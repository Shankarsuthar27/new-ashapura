-- ============================================================
-- Ashapura Tiles & Marbles — Admin Auth & OTP Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Enable pgcrypto for crypt/bcrypt functions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username      TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  phone         TEXT NOT NULL,
  email         TEXT,
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed default administrator account if it doesn't exist
INSERT INTO admin_users (username, password_hash, phone, email)
VALUES (
  'admin2233',
  crypt('admin@2233', gen_salt('bf')),
  '9664471637',
  'ashapura.owner@gmail.com'
)
ON CONFLICT (username) DO NOTHING;

-- 2. Create admin_otps table
CREATE TABLE IF NOT EXISTS admin_otps (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username   TEXT NOT NULL,
  otp_code   TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  attempts   INTEGER DEFAULT 0,
  is_used    BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create admin_reset_tokens table
CREATE TABLE IF NOT EXISTS admin_reset_tokens (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username   TEXT NOT NULL,
  token      TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_used    BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create admin_auth_logs table
CREATE TABLE IF NOT EXISTS admin_auth_logs (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username   TEXT NOT NULL,
  action     TEXT NOT NULL, -- 'login_success', 'login_fail', 'otp_request', 'otp_verify_success', 'otp_verify_fail', 'password_reset'
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on all authentication tables
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_otps ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_reset_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_auth_logs ENABLE ROW LEVEL SECURITY;

-- Note: We intentionally do NOT define any public SELECT or UPDATE policies.
-- Bypassing RLS is done securely via the Supabase Service Role Key inside the Edge Function.
-- This guarantees that clients/visitors cannot inspect or manipulate these tables directly.

-- 5. Helper Function: Verify Admin login
CREATE OR REPLACE FUNCTION verify_admin_login(p_username TEXT, p_password TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  v_hash TEXT;
BEGIN
  SELECT password_hash INTO v_hash 
  FROM admin_users 
  WHERE username = p_username OR email = p_username;
  
  IF v_hash IS NULL THEN
    RETURN FALSE;
  END IF;
  
  RETURN v_hash = crypt(p_password, v_hash);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Helper Function: Reset Admin password
CREATE OR REPLACE FUNCTION reset_admin_password(p_username TEXT, p_password TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE admin_users
  SET password_hash = crypt(p_password, gen_salt('bf'))
  WHERE username = p_username OR email = p_username;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
