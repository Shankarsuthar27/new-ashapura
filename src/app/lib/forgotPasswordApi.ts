/**
 * forgotPasswordApi.ts
 * Calls the Supabase Edge Function "forgot-password" for the 3-step OTP flow.
 * No separate server needed — runs entirely on Supabase infrastructure with Resend email.
 */

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL || '';
const functionsUrl = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL || `${supabaseUrl}/functions/v1`;
const anonKey      = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

interface ApiResponse {
  success?: boolean;
  error?: string;
  message?: string;
  warning?: string;
  reset_token?: string;
}

/**
 * Generic caller for the forgot-password edge function
 */
async function callForgotPassword(action: string, payload: object): Promise<ApiResponse> {
  const res = await fetch(`${functionsUrl}/forgot-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${anonKey}`,
      'apikey': anonKey,
    },
    body: JSON.stringify({ action, ...payload }),
  });

  const data: ApiResponse = await res.json().catch(() => ({
    error: `Server returned status ${res.status} with no JSON body.`,
  }));

  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}.`);
  }

  return data;
}

// =============================================================================
// Step 1 — Request OTP
// =============================================================================
/**
 * Generates a 6-digit OTP, stores its hash in Supabase, and sends it to the owner email via Resend.
 * Rate-limited: max 3 requests per 15 minutes.
 */
export async function requestPasswordResetOTP(
  email: string
): Promise<{ success: boolean; message?: string }> {
  const data = await callForgotPassword('forgot-password', { email });
  return { success: true, message: data.message };
}

// =============================================================================
// Step 2 — Verify OTP
// =============================================================================
/**
 * Verifies the 6-digit OTP against the bcrypt hash stored in Supabase.
 * Returns a short-lived 64-char hex reset_token for step 3.
 */
export async function verifyPasswordResetOTP(
  email: string,
  otp: string
): Promise<{ success: boolean; reset_token: string }> {
  const data = await callForgotPassword('verify-otp', { email, otp });
  if (!data.reset_token) {
    throw new Error('Verification succeeded but no reset token was returned.');
  }
  return { success: true, reset_token: data.reset_token };
}

// =============================================================================
// Step 3 — Reset Password
// =============================================================================
/**
 * Resets the admin password using the validated reset_token.
 * Invalidates the OTP record after use.
 */
export async function resetPasswordWithToken(
  email: string,
  reset_token: string,
  new_password: string
): Promise<{ success: boolean; message?: string }> {
  const data = await callForgotPassword('reset-password', { email, reset_token, new_password });
  return { success: true, message: data.message };
}
