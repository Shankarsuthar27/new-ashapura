// Supabase Edge Function: forgot-password
// Zero npm dependencies — uses only:
//   - Web Crypto API (built-in Deno) for OTP hashing via PBKDF2
//   - Native fetch for Resend API
//   - esm.sh Supabase client (already used across all functions)

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const OTP_TTL_MS     = 10 * 60 * 1000; // 10 minutes
const RATE_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_OTP_REQ    = 3;
const PBKDF2_ITERS   = 100_000;        // NIST-recommended iterations

// ── Helpers ───────────────────────────────────────────────────────────────────

function generateOTP(): string {
  const buf = new Uint8Array(4);
  crypto.getRandomValues(buf);
  const num = new DataView(buf.buffer).getUint32(0) % 1_000_000;
  return num.toString().padStart(6, '0');
}

function generateResetToken(): string {
  const buf = new Uint8Array(32);
  crypto.getRandomValues(buf);
  return Array.from(buf).map(b => b.toString(16).padStart(2, '0')).join('');
}

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function fromHex(hex: string): Uint8Array {
  const pairs = hex.match(/.{2}/g) ?? [];
  return new Uint8Array(pairs.map(b => parseInt(b, 16)));
}

/** Hash OTP with PBKDF2 + random salt — stored as "saltHex:hashHex" */
async function hashOTP(otp: string): Promise<string> {
  const enc  = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key  = await crypto.subtle.importKey('raw', enc.encode(otp), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERS, hash: 'SHA-256' },
    key,
    256
  );
  return `${toHex(salt.buffer)}:${toHex(bits)}`;
}

/** Compare a plaintext OTP against a stored "saltHex:hashHex" */
async function verifyOTP(otp: string, stored: string): Promise<boolean> {
  const [saltHex, storedHash] = stored.split(':');
  if (!saltHex || !storedHash) return false;
  const enc  = new TextEncoder();
  const salt = fromHex(saltHex);
  const key  = await crypto.subtle.importKey('raw', enc.encode(otp), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERS, hash: 'SHA-256' },
    key,
    256
  );
  return toHex(bits) === storedHash;
}

/** Send email via Resend REST API (no SDK) */
async function sendResendEmail(
  apiKey: string,
  from: string,
  to: string,
  subject: string,
  html: string
): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify({ from, to: [to], subject, html }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.message ?? data?.error ?? `Resend HTTP ${res.status}`;
    console.error('[Email] Resend error:', JSON.stringify(data));
    return { ok: false, error: msg };
  }
  console.log('[Email] Sent OK. ID:', data.id);
  return { ok: true };
}

/** OTP email HTML */
function buildOtpHtml(otp: string, requestedFor: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>OTP Code</title>
  <style>
    body{font-family:'Segoe UI',Arial,sans-serif;background:#f4f4f4;margin:0;padding:0;}
    .wrap{max-width:520px;margin:36px auto;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);}
    .hdr{background:linear-gradient(135deg,#0B1220,#1a2340);padding:36px 32px;text-align:center;}
    .hdr h1{margin:0;color:#C8A96A;font-size:22px;letter-spacing:.05em;}
    .hdr p{margin:6px 0 0;color:#9ca3af;font-size:13px;}
    .body{padding:40px 36px;text-align:center;}
    .intro{font-size:14px;color:#4b5563;line-height:1.6;margin-bottom:28px;}
    .otp-card{background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:28px;margin:0 auto 24px;max-width:300px;}
    .otp-code{font-family:'Courier New',monospace;font-size:40px;letter-spacing:.2em;color:#0B1220;font-weight:800;margin:0;}
    .otp-label{font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:#9ca3af;margin-top:8px;}
    .timer{display:inline-block;background:#fef2f2;border:1px solid #fecaca;color:#dc2626;border-radius:8px;padding:6px 16px;font-size:12px;font-weight:700;margin-bottom:24px;}
    hr{border:none;border-top:1px solid #f0f0f0;margin:24px 0;}
    .warn{font-size:12px;color:#9ca3af;line-height:1.6;}
    .ftr{background:#f9fafb;padding:18px 36px;border-top:1px solid #f0f0f0;text-align:center;}
    .ftr p{font-size:11px;color:#9ca3af;margin:3px 0;}
  </style>
</head>
<body>
  <div class="wrap">
    <div class="hdr">
      <h1>Ashapura Tiles &amp; Marbles</h1>
      <p>Administrator Password Reset</p>
    </div>
    <div class="body">
      <p class="intro">A password reset was requested for:<br/><strong>${requestedFor}</strong></p>
      <div class="otp-card">
        <div class="otp-code">${otp}</div>
        <div class="otp-label">One-Time Password</div>
      </div>
      <div class="timer">⏱ Expires in 10 minutes</div>
      <hr/>
      <p class="warn">If you did not request this, safely ignore this email.<br/><strong>Never share this code with anyone.</strong></p>
    </div>
    <div class="ftr">
      <p>Sent automatically by Ashapura Admin System</p>
    </div>
  </div>
</body>
</html>`;
}

/** JSON response shortcut */
function json(data: object, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

// ── Main ──────────────────────────────────────────────────────────────────────

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS_HEADERS });

  const supabaseUrl  = Deno.env.get('SUPABASE_URL')              ?? '';
  const serviceKey   = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  const resendKey    = Deno.env.get('RESEND_API_KEY')            ?? '';
  const ownerEmail   = Deno.env.get('OWNER_EMAIL')               ?? 'ss2137789@gmail.com';
  const fromEmail    = Deno.env.get('RESEND_FROM_EMAIL')         ?? 'onboarding@resend.dev';

  console.log('[forgot-password] Invoked. Owner:', ownerEmail, '| From:', fromEmail);

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid JSON body.' }, 400);
  }

  const action = body.action;

  // =======================================================================
  // ACTION: forgot-password
  // =======================================================================
  if (action === 'forgot-password') {
    const { email } = body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ error: 'A valid email address is required.' }, 400);
    }

    // Rate limit check
    const windowStart = new Date(Date.now() - RATE_WINDOW_MS).toISOString();
    const { count } = await supabase
      .from('password_reset_otps')
      .select('*', { count: 'exact', head: true })
      .eq('email', email)
      .gte('created_at', windowStart);

    if ((count ?? 0) >= MAX_OTP_REQ) {
      return json({ error: `Too many requests. Maximum ${MAX_OTP_REQ} OTPs per 15 minutes.` }, 429);
    }

    const otp       = generateOTP();
    const otpHash   = await hashOTP(otp);
    const expiresAt = new Date(Date.now() + OTP_TTL_MS).toISOString();

    console.log('[forgot-password] OTP generated for', email);

    // Invalidate previous OTPs
    await supabase
      .from('password_reset_otps')
      .update({ used_at: new Date().toISOString() })
      .eq('email', email)
      .is('used_at', null);

    const { error: insertErr } = await supabase
      .from('password_reset_otps')
      .insert({ email, otp_hash: otpHash, expires_at: expiresAt });

    if (insertErr) {
      console.error('[forgot-password] Insert error:', insertErr.message);
      return json({ error: 'Failed to generate OTP. Please try again.' }, 500);
    }

    // Send email
    const emailResult = await sendResendEmail(
      resendKey,
      `Ashapura Security <${fromEmail}>`,
      ownerEmail,
      '🔐 Your Password Reset OTP — Ashapura Admin',
      buildOtpHtml(otp, email)
    );

    if (!emailResult.ok) {
      return json({
        success: true,
        warning: `OTP saved but email failed: ${emailResult.error}`,
        message: 'OTP generated. Check server logs if email is not received.',
      });
    }

    return json({ success: true, message: `OTP sent to ${ownerEmail}. Valid for 10 minutes.` });
  }

  // =======================================================================
  // ACTION: verify-otp
  // =======================================================================
  if (action === 'verify-otp') {
    const { email, otp } = body;

    if (!email || !otp || otp.length !== 6 || isNaN(Number(otp))) {
      return json({ error: 'Email and a valid 6-digit OTP are required.' }, 400);
    }

    const { data: otpRow, error: fetchErr } = await supabase
      .from('password_reset_otps')
      .select('*')
      .eq('email', email)
      .eq('verified', false)
      .is('used_at', null)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (fetchErr) {
      console.error('[verify-otp] DB error:', fetchErr.message);
      return json({ error: 'Database error. Please try again.' }, 500);
    }

    if (!otpRow) {
      return json({ error: 'No valid OTP found. It may have expired — please request a new one.' }, 400);
    }

    const isMatch = await verifyOTP(otp, otpRow.otp_hash);
    if (!isMatch) {
      return json({ error: 'Incorrect OTP code. Please check and try again.' }, 400);
    }

    const resetToken = generateResetToken();

    const { error: updateErr } = await supabase
      .from('password_reset_otps')
      .update({ verified: true, reset_token: resetToken })
      .eq('id', otpRow.id);

    if (updateErr) {
      console.error('[verify-otp] Update error:', updateErr.message);
      return json({ error: 'Failed to verify OTP. Please try again.' }, 500);
    }

    console.log('[verify-otp] Verified for', email);
    return json({ success: true, reset_token: resetToken });
  }

  // =======================================================================
  // ACTION: reset-password
  // =======================================================================
  if (action === 'reset-password') {
    const { email, reset_token, new_password } = body;

    if (!email || !reset_token || !new_password || new_password.length < 8) {
      return json({ error: 'Email, reset token, and a password (min 8 chars) are required.' }, 400);
    }

    const { data: tokenRow, error: fetchErr } = await supabase
      .from('password_reset_otps')
      .select('*')
      .eq('email', email)
      .eq('reset_token', reset_token)
      .eq('verified', true)
      .is('used_at', null)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();

    if (fetchErr) {
      console.error('[reset-password] DB error:', fetchErr.message);
      return json({ error: 'Database error. Please try again.' }, 500);
    }

    if (!tokenRow) {
      return json({ error: 'Invalid or expired reset token. Please restart the password reset.' }, 400);
    }

    // ── Look up the actual username from admin_users by email ─────────────
    // The RPC reset_admin_password expects p_username (NOT email)
    const { data: adminUser, error: userErr } = await supabase
      .from('admin_users')
      .select('username')
      .or(`email.eq.${email},username.eq.${email}`)
      .maybeSingle();

    if (userErr) {
      console.error('[reset-password] admin_users lookup error:', userErr.message);
      return json({ error: 'Failed to locate admin account.' }, 500);
    }

    if (!adminUser) {
      console.error('[reset-password] No admin_users row found for:', email);
      return json({ error: 'No admin account found for this email.' }, 404);
    }

    const username = adminUser.username;
    console.log(`[reset-password] Updating password for username="${username}" (email="${email}")`);

    // ── Call RPC with the real username ───────────────────────────────────
    const { error: rpcErr } = await supabase.rpc('reset_admin_password', {
      p_username: username,
      p_password: new_password,
    });

    if (rpcErr) {
      console.error('[reset-password] RPC error:', rpcErr.message);
      return json({ error: 'Failed to update password. Please try again.' }, 500);
    }

    // Invalidate all OTPs for this email
    await supabase
      .from('password_reset_otps')
      .update({ used_at: new Date().toISOString() })
      .eq('email', email)
      .is('used_at', null);

    console.log('[reset-password] Success for', email, '/', username);
    return json({ success: true, message: 'Password reset successfully.' });
  }

  return json({ error: `Unknown action: "${action}"` }, 404);
});
