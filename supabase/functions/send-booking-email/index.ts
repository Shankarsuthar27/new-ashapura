// Supabase Edge Function: send-booking-email
// Deno runtime — deploy with: npx supabase functions deploy send-booking-email --project-ref YOUR_REF
// Set secrets:  npx supabase secrets set RESEND_API_KEY=re_xxx OWNER_EMAIL=you@gmail.com --project-ref YOUR_REF

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

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
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    const OWNER_EMAIL   = Deno.env.get('OWNER_EMAIL') ?? 'ashapura.owner@gmail.com';

    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'RESEND_API_KEY secret is not configured on Supabase.' }),
        { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      );
    }

    // Parse incoming booking data
    const body = await req.json();
    const {
      name,
      email,
      phone,
      product,
      quantity,
      preferred_date,
      city,
      message,
      created_at,
    } = body;

    const submittedAt = created_at
      ? new Date(created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
      : new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Booking Request</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
    .wrapper { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #1a1a1e 0%, #2a2a30 100%); padding: 36px 40px; text-align: center; }
    .header h1 { margin: 0; color: #C8A96A; font-size: 24px; letter-spacing: 0.05em; }
    .header p { margin: 8px 0 0; color: #9ca3af; font-size: 13px; }
    .badge { display: inline-block; background: #C8A96A22; border: 1px solid #C8A96A55; color: #C8A96A; border-radius: 20px; padding: 4px 16px; font-size: 12px; font-weight: 600; letter-spacing: 0.08em; margin-top: 16px; }
    .body { padding: 40px; }
    .section-title { font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: #9ca3af; font-weight: 700; margin: 0 0 16px; border-bottom: 1px solid #f0f0f0; padding-bottom: 8px; }
    .field { display: flex; margin-bottom: 14px; }
    .field-label { width: 140px; font-size: 13px; color: #6b7280; font-weight: 600; flex-shrink: 0; }
    .field-value { font-size: 14px; color: #111827; font-weight: 500; word-break: break-word; }
    .message-box { background: #f9fafb; border-left: 3px solid #C8A96A; border-radius: 6px; padding: 16px 20px; margin-top: 8px; font-size: 14px; color: #374151; line-height: 1.6; }
    .footer { background: #f9fafb; padding: 24px 40px; text-align: center; border-top: 1px solid #f0f0f0; }
    .footer p { font-size: 12px; color: #9ca3af; margin: 4px 0; }
    .timestamp { font-size: 12px; color: #9ca3af; text-align: right; padding-top: 20px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>Ashapura Tiles &amp; Marbles</h1>
      <p>New Booking Request Received</p>
      <span class="badge">🔔 Action Required</span>
    </div>
    <div class="body">
      <p class="section-title">Customer Details</p>
      <div class="field">
        <span class="field-label">Full Name</span>
        <span class="field-value">${name || '—'}</span>
      </div>
      <div class="field">
        <span class="field-label">Email</span>
        <span class="field-value"><a href="mailto:${email}" style="color:#C8A96A;">${email || '—'}</a></span>
      </div>
      <div class="field">
        <span class="field-label">Phone</span>
        <span class="field-value"><a href="tel:${phone}" style="color:#C8A96A;">${phone || '—'}</a></span>
      </div>
      <div class="field">
        <span class="field-label">City / Location</span>
        <span class="field-value">${city || '—'}</span>
      </div>

      <p class="section-title" style="margin-top:24px;">Order Details</p>
      <div class="field">
        <span class="field-label">Product</span>
        <span class="field-value">${product || '—'}</span>
      </div>
      <div class="field">
        <span class="field-label">Quantity</span>
        <span class="field-value">${quantity || '—'}</span>
      </div>
      <div class="field">
        <span class="field-label">Preferred Date</span>
        <span class="field-value">${preferred_date ? new Date(preferred_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}</span>
      </div>

      ${message ? `
      <p class="section-title" style="margin-top:24px;">Customer Message</p>
      <div class="message-box">${message.replace(/\n/g, '<br/>')}</div>
      ` : ''}

      <p class="timestamp">Submitted at: ${submittedAt} (IST)</p>
    </div>
    <div class="footer">
      <p>This is an automated notification from your Ashapura booking system.</p>
      <p>Reply directly to <strong>${email}</strong> to respond to this customer.</p>
    </div>
  </div>
</body>
</html>`;

    // Call Resend API
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Ashapura Bookings <onboarding@resend.dev>',
        to: [OWNER_EMAIL],
        reply_to: email,
        subject: `New Booking Request — ${product || 'General Enquiry'} from ${name}`,
        html: emailHtml,
      }),
    });

    const resendData = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error('Resend API error:', resendData);
      return new Response(
        JSON.stringify({ error: 'Failed to send email', details: resendData }),
        { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, emailId: resendData.id }),
      { status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    console.error('Edge Function error:', err);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: String(err) }),
      { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );
  }
});
