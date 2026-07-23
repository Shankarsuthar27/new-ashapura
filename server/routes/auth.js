'use strict';

const express   = require('express');
const bcrypt    = require('bcrypt');
const crypto    = require('crypto');
const rateLimit = require('express-rate-limit');
const { createClient } = require('@supabase/supabase-js');
const { sendOtpEmail }  = require('../services/emailService');
const {
  validateForgotPassword,
  validateVerifyOtp,
  validateResetPassword,
} = require('../middleware/validate');

const router = express.Router();

// ── Supabase admin client (service role key — never exposed to frontend) ─────
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const BCRYPT_ROUNDS  = 12;
const OTP_TTL_MS     = 10 * 60 * 1000;   // 10 minutes
const RATE_WINDOW_MS = 15 * 60 * 1000;   // 15 minutes
const MAX_OTP_REQ    = 3;                 // max OTP requests per window per email

// ── Per-route stricter rate limiter (10 req / 15 min per IP) ─────────────────
const authLimiter = rateLimit({
  windowMs: RATE_WINDOW_MS,
  max: 10,
  keyGenerator: (req) => req.ip,
  message: { error: 'Too many requests. Please wait 15 minutes and try again.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ── Helper: generate random numeric OTP ─────────────────────────────────────
function generateOTP() {
  // Cryptographically random 6-digit code
  const bytes = crypto.randomBytes(4);
  const num   = bytes.readUInt32BE(0) % 1_000_000;
  return num.toString().padStart(6, '0');
}

// ── Helper: generate hex reset token ─────────────────────────────────────────
function generateResetToken() {
  return crypto.randomBytes(32).toString('hex'); // 64-char hex string
}

// =============================================================================
// POST /api/auth/forgot-password
// =============================================================================
router.post('/forgot-password', authLimiter, validateForgotPassword, async (req, res) => {
  const { email } = req.body;
  const ownerEmail = process.env.OWNER_EMAIL || 'ss2137789@gmail.com';

  try {
    // ── Rate limit: max 3 OTP requests per email per 15 minutes ──────────────
    const windowStart = new Date(Date.now() - RATE_WINDOW_MS).toISOString();
    const { count, error: countErr } = await supabase
      .from('password_reset_otps')
      .select('*', { count: 'exact', head: true })
      .eq('email', email)
      .gte('created_at', windowStart);

    if (countErr) {
      console.error('[forgot-password] DB count error:', countErr.message);
      return res.status(500).json({ error: 'Database error. Please try again.' });
    }

    if (count >= MAX_OTP_REQ) {
      return res.status(429).json({
        error: `Too many OTP requests. Maximum ${MAX_OTP_REQ} per 15 minutes. Please wait.`,
      });
    }

    // ── Generate + hash OTP ──────────────────────────────────────────────────
    const otp     = generateOTP();
    const otpHash = await bcrypt.hash(otp, BCRYPT_ROUNDS);
    const expiresAt = new Date(Date.now() + OTP_TTL_MS).toISOString();

    // ── Invalidate any existing active OTPs for this email ───────────────────
    await supabase
      .from('password_reset_otps')
      .update({ used_at: new Date().toISOString() })
      .eq('email', email)
      .is('used_at', null);

    // ── Insert new OTP record ────────────────────────────────────────────────
    const { error: insertErr } = await supabase
      .from('password_reset_otps')
      .insert({ email, otp_hash: otpHash, expires_at: expiresAt });

    if (insertErr) {
      console.error('[forgot-password] DB insert error:', insertErr.message);
      return res.status(500).json({ error: 'Failed to generate OTP. Please try again.' });
    }

    // ── Send email (always goes to OWNER_EMAIL) ──────────────────────────────
    const emailResult = await sendOtpEmail(ownerEmail, otp, email);
    if (!emailResult.success) {
      console.error('[forgot-password] Email failed:', emailResult.error);
      // OTP is still saved — user can retry; don't fail the whole request
      return res.status(202).json({
        success: true,
        warning: 'OTP generated but email delivery failed. Check server logs.',
      });
    }

    console.log(`[forgot-password] OTP sent for ${email} → ${ownerEmail}`);
    return res.status(200).json({
      success: true,
      message: `OTP sent to ${ownerEmail}. Valid for 10 minutes.`,
    });
  } catch (err) {
    console.error('[forgot-password] Unexpected error:', err.message);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// =============================================================================
// POST /api/auth/verify-otp
// =============================================================================
router.post('/verify-otp', authLimiter, validateVerifyOtp, async (req, res) => {
  const { email, otp } = req.body;

  try {
    // ── Find latest active (unexpired, unused) OTP for this email ────────────
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
      console.error('[verify-otp] DB fetch error:', fetchErr.message);
      return res.status(500).json({ error: 'Database error. Please try again.' });
    }

    if (!otpRow) {
      return res.status(400).json({ error: 'No valid OTP found. Please request a new one.' });
    }

    // ── Compare provided OTP against stored hash ─────────────────────────────
    const isMatch = await bcrypt.compare(otp, otpRow.otp_hash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Incorrect OTP code. Please try again.' });
    }

    // ── OTP verified — generate reset token ──────────────────────────────────
    const resetToken = generateResetToken();

    const { error: updateErr } = await supabase
      .from('password_reset_otps')
      .update({ verified: true, reset_token: resetToken })
      .eq('id', otpRow.id);

    if (updateErr) {
      console.error('[verify-otp] DB update error:', updateErr.message);
      return res.status(500).json({ error: 'Failed to verify OTP. Please try again.' });
    }

    console.log(`[verify-otp] OTP verified for ${email}. Reset token issued.`);
    return res.status(200).json({ success: true, reset_token: resetToken });
  } catch (err) {
    console.error('[verify-otp] Unexpected error:', err.message);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// =============================================================================
// POST /api/auth/reset-password
// =============================================================================
router.post('/reset-password', authLimiter, validateResetPassword, async (req, res) => {
  const { email, reset_token, new_password } = req.body;

  try {
    // ── Verify reset token exists, is verified, and is unused ────────────────
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
      console.error('[reset-password] DB fetch error:', fetchErr.message);
      return res.status(500).json({ error: 'Database error. Please try again.' });
    }

    if (!tokenRow) {
      return res.status(400).json({
        error: 'Invalid or expired reset token. Please start the password reset again.',
      });
    }

    // ── Update password in Supabase Auth ─────────────────────────────────────
    // Step 1: find user by email
    const { data: { users }, error: listErr } = await supabase.auth.admin.listUsers();
    if (listErr) {
      console.error('[reset-password] Auth list error:', listErr.message);
      return res.status(500).json({ error: 'Failed to locate user account.' });
    }

    const authUser = users.find(u => u.email === email);

    if (authUser) {
      // Update Supabase Auth password
      const { error: updateAuthErr } = await supabase.auth.admin.updateUserById(
        authUser.id,
        { password: new_password }
      );
      if (updateAuthErr) {
        console.error('[reset-password] Auth update error:', updateAuthErr.message);
        return res.status(500).json({ error: 'Failed to update password in Auth.' });
      }
      console.log(`[reset-password] Supabase Auth password updated for ${email}`);
    }

    // ── Also update custom admin_users table (bcrypt) if RPC exists ──────────
    const { error: rpcErr } = await supabase.rpc('reset_admin_password', {
      p_username: email,
      p_password: new_password,
    });
    // Not fatal if this RPC doesn't exist — only Supabase Auth is mandatory
    if (rpcErr) {
      console.warn('[reset-password] admin_users RPC skipped/failed:', rpcErr.message);
    }

    // ── Invalidate the OTP record ─────────────────────────────────────────────
    await supabase
      .from('password_reset_otps')
      .update({ used_at: new Date().toISOString() })
      .eq('id', tokenRow.id);

    // ── Also invalidate all other active OTPs for this email ─────────────────
    await supabase
      .from('password_reset_otps')
      .update({ used_at: new Date().toISOString() })
      .eq('email', email)
      .is('used_at', null);

    console.log(`[reset-password] Password reset successful for ${email}`);
    return res.status(200).json({ success: true, message: 'Password reset successfully.' });
  } catch (err) {
    console.error('[reset-password] Unexpected error:', err.message);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
