'use strict';

const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Builds a premium HTML email for OTP delivery
 */
function buildOtpEmailHtml(otp, email) {
  const expiresMinutes = 10;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Your OTP Code — Ashapura</title>
  <style>
    body{font-family:'Segoe UI',Arial,sans-serif;background:#f4f4f4;margin:0;padding:0;}
    .wrap{max-width:520px;margin:36px auto;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);}
    .hdr{background:linear-gradient(135deg,#0B1220 0%,#1a2340 100%);padding:36px 32px;text-align:center;}
    .hdr h1{margin:0;color:#C8A96A;font-size:22px;letter-spacing:.05em;}
    .hdr p{margin:6px 0 0;color:#9ca3af;font-size:13px;}
    .body{padding:40px 36px;text-align:center;}
    .intro{font-size:14px;color:#4b5563;line-height:1.6;margin-bottom:28px;}
    .otp-card{background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:28px;margin:0 auto 28px;max-width:300px;}
    .otp-code{font-family:'Courier New',monospace;font-size:38px;letter-spacing:.18em;color:#0B1220;font-weight:800;margin:0;}
    .otp-label{font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:#9ca3af;margin-top:8px;}
    .timer{display:inline-block;background:#fef2f2;border:1px solid #fecaca;color:#dc2626;border-radius:8px;padding:6px 14px;font-size:12px;font-weight:700;margin-top:20px;}
    .divider{border:none;border-top:1px solid #f0f0f0;margin:28px 0;}
    .warn{font-size:12px;color:#9ca3af;line-height:1.6;}
    .ftr{background:#f9fafb;padding:20px 36px;border-top:1px solid #f0f0f0;text-align:center;}
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
      <p class="intro">
        A password reset was requested for <strong>${email}</strong>.<br/>
        Use the secure code below to verify your identity.
      </p>
      <div class="otp-card">
        <div class="otp-code">${otp}</div>
        <div class="otp-label">One-Time Password</div>
      </div>
      <div class="timer">⏱ Expires in ${expiresMinutes} minutes</div>
      <hr class="divider"/>
      <p class="warn">
        If you did not request this, ignore this email — your account is still secure.<br/>
        <strong>Never share this code with anyone.</strong>
      </p>
    </div>
    <div class="ftr">
      <p>Sent automatically by Ashapura Admin System</p>
      <p>© ${new Date().getFullYear()} Ashapura Tiles &amp; Marbles</p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Sends OTP verification email via Resend
 * @param {string} toEmail  - recipient (OWNER_EMAIL from env)
 * @param {string} otp      - plaintext 6-digit OTP
 * @param {string} reqEmail - email that triggered the request (shown in body)
 * @returns {Promise<{success:boolean, id?:string, error?:string}>}
 */
async function sendOtpEmail(toEmail, otp, reqEmail) {
  try {
    const fromAddress = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    const { data, error } = await resend.emails.send({
      from: `Ashapura Security <${fromAddress}>`,
      to: [toEmail],
      subject: '🔐 Your Password Reset OTP — Ashapura Admin',
      html: buildOtpEmailHtml(otp, reqEmail),
    });

    if (error) {
      console.error('[Email] Resend error:', error);
      return { success: false, error: error.message };
    }

    console.log(`[Email] OTP sent to ${toEmail}. Resend ID: ${data.id}`);
    return { success: true, id: data.id };
  } catch (err) {
    console.error('[Email] Unexpected error:', err.message);
    return { success: false, error: err.message };
  }
}

module.exports = { sendOtpEmail };
