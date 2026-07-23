// Supabase Edge Function: admin-auth
// Deno runtime — deploy with: npx supabase functions deploy admin-auth

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';
// @ts-ignore — Deno supports npm: specifiers
import nodemailer from 'npm:nodemailer@6.9.9';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req: Request) => {
  // Handle CORS pre-flight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: 'Supabase URL or Service Key is not configured.' }),
        { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Auto-seed default admin if table is empty
    try {
      const { count } = await supabase
        .from('admin_users')
        .select('*', { count: 'exact', head: true });
      if (count === 0) {
        console.log('[admin-auth] Seeding default admin user...');
        await supabase
          .from('admin_users')
          .insert({
            username: 'admin2233',
            password_hash: '$2b$10$/ayttLqNdzfvtKRihTLaCeb2wbLOG4QvMyQ0cZzjzFqOcayKJHque',
            phone: '9664471637',
            email: 'ss2137789@gmail.com'
          });
      }
    } catch (e) {
      console.warn('[admin-auth] Auto-seed failed:', e);
    }

    const body = await req.json().catch(() => ({}));
    const ipAddress = req.headers.get('x-real-ip') || req.headers.get('x-forwarded-for') || 'unknown';

    // Parse subroute action: login, send-otp, verify-otp, reset-password
    const url = new URL(req.url);
    const pathAction = url.pathname.split('/').pop();
    const action = (pathAction && pathAction !== 'admin-auth') ? pathAction : body.action;

    // Helper: Find administrator user by username or email
    const findAdminUser = async (usernameOrEmail: string) => {
      if (!usernameOrEmail) return null;
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .or(`username.eq.${usernameOrEmail},email.eq.${usernameOrEmail}`)
        .maybeSingle();
      if (error) {
        console.error('Error finding user:', error);
        return null;
      }
      return data;
    };

    // Helper: Log auth events
    const logAuthEvent = async (username: string, eventName: string) => {
      await supabase.from('admin_auth_logs').insert({
        username: username || 'unknown',
        action: eventName,
        ip_address: ipAddress,
      });
    };

    // ==========================================
    // ROUTE: LOGIN
    // ==========================================
    if (action === 'login') {
      const { username, password } = body;
      if (!username || !password) {
        return new Response(
          JSON.stringify({ error: 'Username and password are required.' }),
          { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
        );
      }

      // Check login attempts rate limiting in the last 15 minutes
      const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
      const { count: failCount } = await supabase
        .from('admin_auth_logs')
        .select('*', { count: 'exact', head: true })
        .eq('username', username)
        .eq('action', 'login_fail')
        .gt('created_at', fifteenMinsAgo);

      if (failCount && failCount >= 5) {
        return new Response(
          JSON.stringify({ error: 'Too many failed login attempts. Please try again in 15 minutes.' }),
          { status: 429, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
        );
      }

      const { data: isValid, error: rpcError } = await supabase.rpc('verify_admin_login', {
        p_username: username,
        p_password: password
      });

      if (rpcError) {
        console.error('RPC Error verify_admin_login:', rpcError);
        return new Response(
          JSON.stringify({ error: 'Database verification failed.' }),
          { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
        );
      }

      if (isValid) {
        await logAuthEvent(username, 'login_success');
        return new Response(
          JSON.stringify({ success: true, message: 'Logged in successfully.' }),
          { status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
        );
      } else {
        await logAuthEvent(username, 'login_fail');
        return new Response(
          JSON.stringify({ error: 'Invalid username or password.' }),
          { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
        );
      }
    }

    // ==========================================
    // ROUTE: SEND OTP
    // ==========================================
    else if (action === 'send-otp') {
      const { username_or_email } = body;
      if (!username_or_email) {
        return new Response(
          JSON.stringify({ error: 'Username or email is required.' }),
          { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
        );
      }

      const user = await findAdminUser(username_or_email);
      if (!user) {
        return new Response(
          JSON.stringify({ error: 'No administrative user found matching that username or email.' }),
          { status: 404, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
        );
      }

      // Rate limit OTP requests: max 5 requests per hour
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      const { count: otpReqCount } = await supabase
        .from('admin_auth_logs')
        .select('*', { count: 'exact', head: true })
        .eq('username', user.username)
        .eq('action', 'otp_request')
        .gt('created_at', oneHourAgo);

      if (otpReqCount && otpReqCount >= 5) {
        return new Response(
          JSON.stringify({ error: 'Too many OTP requests. Maximum 5 requests per hour. Please wait.' }),
          { status: 429, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
        );
      }

      // Generate 6-digit code
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 minutes validity

      // Invalidate existing OTP codes for this user
      await supabase
        .from('admin_otps')
        .update({ is_used: true })
        .eq('username', user.username)
        .eq('is_used', false);

      // Insert new OTP
      const { error: otpInsertErr } = await supabase.from('admin_otps').insert({
        username: user.username,
        otp_code: otp,
        expires_at: expiresAt,
        is_used: false,
        attempts: 0
      });

      if (otpInsertErr) {
        console.error('Error inserting OTP:', otpInsertErr);
        return new Response(
          JSON.stringify({ error: 'Failed to generate OTP.' }),
          { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
        );
      }

      await logAuthEvent(user.username, 'otp_request');

      // Send Email via Gmail SMTP (nodemailer)
      const GMAIL_FROM  = Deno.env.get('GMAIL_FROM_EMAIL') ?? 'ss2137789@gmail.com';
      const GMAIL_PASS  = Deno.env.get('GMAIL_APP_PASSWORD');
      let emailSent = false;
      const targetEmail = user.email || 'ss2137789@gmail.com';

      if (GMAIL_PASS) {
        try {
          const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Security OTP Code</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
    .wrapper { max-width: 500px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06); border: 1px solid #e5e7eb; }
    .header { background: #0B1F44; padding: 32px 24px; text-align: center; }
    .header h1 { margin: 0; color: #C8A96A; font-size: 22px; letter-spacing: 0.05em; font-weight: 600; }
    .body { padding: 36px 32px; text-align: center; }
    .intro { font-size: 14px; color: #4b5563; line-height: 1.5; margin-bottom: 24px; }
    .otp-card { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; margin: 24px 0; }
    .otp-code { font-family: 'Courier New', monospace; font-size: 32px; letter-spacing: 0.15em; color: #0B1F44; font-weight: bold; margin: 0; }
    .timer { font-size: 12px; color: #EF233C; font-weight: 600; margin-top: 8px; }
    .warning { font-size: 11px; color: #9ca3af; line-height: 1.5; margin-top: 32px; }
    .footer { background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb; }
    .footer p { font-size: 11px; color: #9ca3af; margin: 0; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>Ashapura Tiles &amp; Granite</h1>
    </div>
    <div class="body">
      <p class="intro">A password reset request was initiated for your administrator portal account. Use the secure verification code below to proceed:</p>
      <div class="otp-card">
        <div class="otp-code">${otp}</div>
        <div class="timer">⚠️ Valid for 5 minutes only</div>
      </div>
      <p class="intro" style="font-size: 12px; margin-top: 16px;">If you did not request this, please ignore this email or contact support to verify your account security.</p>
      <p class="warning">Do not share this code with anyone. System administrators will never ask for your verification codes.</p>
    </div>
    <div class="footer">
      <p>This is a secure automated notification from your Ashapura system.</p>
    </div>
  </div>
</body>
</html>`;

          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: GMAIL_FROM, pass: GMAIL_PASS },
          });

          const info = await transporter.sendMail({
            from: `"Ashapura Security" <${GMAIL_FROM}>`,
            to: targetEmail,
            subject: 'Admin Verification Code — Ashapura Tiles',
            html: emailHtml,
          });

          emailSent = true;
          console.log(`OTP Email sent successfully to ${targetEmail}. MessageId: ${info.messageId}`);
        } catch (mailErr) {
          console.error('Gmail SMTP error sending OTP:', String(mailErr));
        }
      } else {
        console.warn('GMAIL_APP_PASSWORD not set — skipping OTP email.');
      }

      // Send SMS
      const FAST2SMS_API_KEY = Deno.env.get('FAST2SMS_API_KEY');
      const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID');
      const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN');
      const TWILIO_FROM_NUMBER = Deno.env.get('TWILIO_FROM_NUMBER');

      let smsSent = false;
      let gatewayMessage = '';

      const targetPhone = user.phone || '9664471637';

      // 1. Fast2SMS Integration
      if (FAST2SMS_API_KEY) {
        try {
          const fast2smsUrl = `https://www.fast2sms.com/dev/bulkV2?authorization=${FAST2SMS_API_KEY}&route=q&message=${encodeURIComponent(`Your Ashapura Admin OTP code is ${otp}. Valid for 5 minutes.`)}&flash=0&numbers=${targetPhone}`;
          const res = await fetch(fast2smsUrl, { method: 'GET' });
          const data = await res.json();
          if (res.ok && data.return === true) {
            smsSent = true;
            gatewayMessage = 'Sent via Fast2SMS';
          } else {
            console.error('Fast2SMS failed:', data);
            gatewayMessage = `Fast2SMS failed: ${data.message || 'unknown error'}`;
          }
        } catch (smsErr) {
          console.error('Fast2SMS fetch error:', smsErr);
          gatewayMessage = `Fast2SMS network error: ${String(smsErr)}`;
        }
      } 
      // 2. Twilio Integration
      else if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_FROM_NUMBER) {
        try {
          const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
          const basicAuth = btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`);
          
          const params = new URLSearchParams();
          params.append('To', targetPhone.startsWith('+') ? targetPhone : `+91${targetPhone}`);
          params.append('From', TWILIO_FROM_NUMBER);
          params.append('Body', `Your Ashapura Admin OTP code is ${otp}. Valid for 5 minutes.`);

          const res = await fetch(twilioUrl, {
            method: 'POST',
            headers: {
              'Authorization': `Basic ${basicAuth}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString()
          });

          const data = await res.json();
          if (res.ok) {
            smsSent = true;
            gatewayMessage = 'Sent via Twilio';
          } else {
            console.error('Twilio failed:', data);
            gatewayMessage = `Twilio failed: ${data.message || 'unknown error'}`;
          }
        } catch (smsErr) {
          console.error('Twilio fetch error:', smsErr);
          gatewayMessage = `Twilio network error: ${String(smsErr)}`;
        }
      }

      // 3. Fallback Sandbox Mode
      if (!emailSent && !smsSent) {
        console.warn(`SANDBOX MODE ENABLED (No Email/SMS API Keys found): OTP for admin is ${otp}`);
        return new Response(
          JSON.stringify({
            success: true,
            sandbox: true,
            message: `Sandbox mode: OTP code has been generated and logged to your Supabase functions console logs.`
          }),
          { status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
        );
      }

      const successMessage = emailSent 
        ? `OTP code has been sent successfully to your registered email address ${targetEmail}.` 
        : `OTP code has been sent successfully via SMS.`;

      return new Response(
        JSON.stringify({ 
          success: true, 
          email_sent: emailSent,
          sms_sent: smsSent,
          message: successMessage
        }),
        { status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      );
    }

    // ==========================================
    // ROUTE: VERIFY OTP
    // ==========================================
    else if (action === 'verify-otp') {
      const { username_or_email, otp } = body;
      if (!username_or_email || !otp) {
        return new Response(
          JSON.stringify({ error: 'Username/email and OTP are required.' }),
          { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
        );
      }

      const user = await findAdminUser(username_or_email);
      if (!user) {
        return new Response(
          JSON.stringify({ error: 'User not found.' }),
          { status: 404, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
        );
      }

      // Get latest active OTP code
      const { data: otpRow, error: otpErr } = await supabase
        .from('admin_otps')
        .select('*')
        .eq('username', user.username)
        .eq('is_used', false)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (otpErr || !otpRow) {
        await logAuthEvent(user.username, 'otp_verify_fail');
        return new Response(
          JSON.stringify({ error: 'The OTP code is invalid or has expired.' }),
          { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
        );
      }

      // Check failed verification attempts count
      if (otpRow.attempts >= 3) {
        // Invalidate OTP
        await supabase.from('admin_otps').update({ is_used: true }).eq('id', otpRow.id);
        await logAuthEvent(user.username, 'otp_verify_fail_max_attempts');
        return new Response(
          JSON.stringify({ error: 'Too many incorrect attempts. This OTP has been invalidated. Please request a new OTP.' }),
          { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
        );
      }

      // Match OTP code
      if (otpRow.otp_code === otp) {
        // Mark OTP as used
        await supabase.from('admin_otps').update({ is_used: true }).eq('id', otpRow.id);

        // Generate dynamic secure reset token (UUID)
        const resetToken = crypto.randomUUID();
        const tokenExpires = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 mins validity

        // Save token
        const { error: tokenErr } = await supabase.from('admin_reset_tokens').insert({
          username: user.username,
          token: resetToken,
          expires_at: tokenExpires,
          is_used: false
        });

        if (tokenErr) {
          console.error('Error storing reset token:', tokenErr);
          return new Response(
            JSON.stringify({ error: 'Failed to initialize password reset session.' }),
            { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
          );
        }

        await logAuthEvent(user.username, 'otp_verify_success');
        return new Response(
          JSON.stringify({ success: true, reset_token: resetToken }),
          { status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
        );
      } else {
        // Increment attempts
        const newAttempts = otpRow.attempts + 1;
        const isMaxed = newAttempts >= 3;
        
        await supabase
          .from('admin_otps')
          .update({ 
            attempts: newAttempts,
            is_used: isMaxed ? true : otpRow.is_used 
          })
          .eq('id', otpRow.id);

        await logAuthEvent(user.username, 'otp_verify_fail');
        
        return new Response(
          JSON.stringify({ 
            error: isMaxed 
              ? 'Too many incorrect attempts. OTP has been invalidated. Please request a new one.' 
              : `Incorrect OTP code. Remaining attempts: ${3 - newAttempts}.` 
          }),
          { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
        );
      }
    }

    // ==========================================
    // ROUTE: RESET PASSWORD
    // ==========================================
    else if (action === 'reset-password') {
      const { username_or_email, reset_token, new_password } = body;
      if (!username_or_email || !reset_token || !new_password) {
        return new Response(
          JSON.stringify({ error: 'All fields are required.' }),
          { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
        );
      }

      // Password Validation
      if (new_password.length < 8) {
        return new Response(
          JSON.stringify({ error: 'New password must be at least 8 characters long.' }),
          { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
        );
      }

      const user = await findAdminUser(username_or_email);
      if (!user) {
        return new Response(
          JSON.stringify({ error: 'User not found.' }),
          { status: 404, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
        );
      }

      // Retrieve reset token
      const { data: tokenRow, error: tokenErr } = await supabase
        .from('admin_reset_tokens')
        .select('*')
        .eq('username', user.username)
        .eq('token', reset_token)
        .eq('is_used', false)
        .gt('expires_at', new Date().toISOString())
        .maybeSingle();

      if (tokenErr || !tokenRow) {
        await logAuthEvent(user.username, 'password_reset_fail_invalid_token');
        return new Response(
          JSON.stringify({ error: 'Invalid or expired password reset token.' }),
          { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
        );
      }

      // Token is valid! Invalidate token
      await supabase.from('admin_reset_tokens').update({ is_used: true }).eq('id', tokenRow.id);

      // Reset the password in DB using pgcrypto helper function
      const { error: rpcErr } = await supabase.rpc('reset_admin_password', {
        p_username: user.username,
        p_password: new_password
      });

      if (rpcErr) {
        console.error('Password reset RPC failed:', rpcErr);
        return new Response(
          JSON.stringify({ error: 'Failed to update database password.' }),
          { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
        );
      }

      // Invalidate all other active OTPs and reset tokens for this user
      await supabase.from('admin_otps').update({ is_used: true }).eq('username', user.username);
      await supabase.from('admin_reset_tokens').update({ is_used: true }).eq('username', user.username);

      await logAuthEvent(user.username, 'password_reset_success');

      return new Response(
        JSON.stringify({ success: true, message: 'Password reset successfully.' }),
        { status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      );
    }

    // Default 404 Route
    return new Response(
      JSON.stringify({ error: `Not found: action ${action || 'none'}` }),
      { status: 404, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    console.error('Admin Auth Edge Function error:', err);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: String(err) }),
      { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );
  }
});
