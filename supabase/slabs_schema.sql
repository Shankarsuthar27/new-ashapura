-- ============================================================
-- Ashapura Tiles & Marbles — Slabs / Products Table Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

CREATE TABLE IF NOT EXISTS slabs (
  id               TEXT PRIMARY KEY,
  name             TEXT NOT NULL,
  category         TEXT NOT NULL,
  color            TEXT,
  origin           TEXT,
  finishes         JSONB,
  dimensions       TEXT,
  thickness        TEXT,
  price_tier       TEXT,
  price            NUMERIC,
  unit             TEXT DEFAULT 'Per Square Foot',
  in_stock_slabs   INT DEFAULT 10,
  bundle_number    TEXT,
  rarity           TEXT,
  description      TEXT,
  long_description TEXT,
  image            TEXT,
  bookmatch_image  TEXT,
  applications     JSONB,
  featured         BOOLEAN DEFAULT false,
  specifications   JSONB,
  created_at       TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Note: RLS is disabled by default on this table to allow your frontend admin 
-- panel (which uses the anonymous Supabase client) to insert and update products.
ALTER TABLE slabs DISABLE ROW LEVEL SECURITY;
