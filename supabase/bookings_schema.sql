-- ============================================================
-- Ashapura Tiles & Marbles — Bookings Table Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

CREATE TABLE IF NOT EXISTS bookings (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name           TEXT NOT NULL,
  email          TEXT NOT NULL,
  phone          TEXT NOT NULL,
  product        TEXT,
  quantity       TEXT,
  preferred_date DATE,
  city           TEXT,
  message        TEXT,
  created_at     TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users (website visitors) to INSERT bookings
CREATE POLICY "Allow public inserts on bookings"
  ON bookings
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users (admin) to SELECT all bookings
CREATE POLICY "Allow authenticated reads on bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (true);
