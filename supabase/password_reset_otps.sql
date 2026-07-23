-- =====================================================================
-- password_reset_otps — Secure OTP table for admin forgot-password flow
-- Deploy in Supabase SQL Editor
-- =====================================================================

CREATE TABLE IF NOT EXISTS password_reset_otps (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  email       TEXT        NOT NULL,
  otp_hash    TEXT        NOT NULL,        -- bcrypt hash of the 6-digit OTP
  reset_token TEXT,                        -- set after OTP is verified; used in step 3
  verified    BOOLEAN     DEFAULT FALSE,   -- true once OTP entered correctly
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  expires_at  TIMESTAMPTZ NOT NULL,        -- NOW() + 10 minutes
  used_at     TIMESTAMPTZ                  -- set when password is actually reset
);

-- Index for fast lookup of recent OTPs per email
CREATE INDEX IF NOT EXISTS idx_prot_email_created
  ON password_reset_otps (email, created_at DESC);

-- Row-level security: no public access — only service role key from backend
ALTER TABLE password_reset_otps ENABLE ROW LEVEL SECURITY;

-- No public policies — all access goes through service-role key in Express backend
-- This means the frontend NEVER touches this table directly

-- Optional: auto-delete rows older than 24 hours (run via pg_cron or manually)
-- CREATE EXTENSION IF NOT EXISTS pg_cron;
-- SELECT cron.schedule('cleanup-otps', '0 * * * *',
--   $$DELETE FROM password_reset_otps WHERE created_at < NOW() - INTERVAL '24 hours'$$);
