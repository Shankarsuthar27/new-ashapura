'use strict';

require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const rateLimit  = require('express-rate-limit');
const authRoutes = require('./routes/auth');

const app = express();

// ── Security headers ──────────────────────────────────────────────────────────
app.use(helmet());

// ── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.FRONTEND_URL || '*').split(',').map(s => s.trim());
app.use(cors({
  origin: (origin, cb) => {
    // allow curl / Postman (no origin) and listed origins
    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      cb(null, true);
    } else {
      cb(new Error(`CORS: origin ${origin} not allowed`));
    }
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── Body parser ───────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));

// ── Global rate limiter (100 req / 15 min per IP) ────────────────────────────
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP. Please try again later.' },
}));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// ── 404 fallback ──────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: 'Route not found.' }));

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[Server Error]', err.message);
  res.status(500).json({ error: 'Internal server error.' });
});

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅  Ashapura Auth Server running on port ${PORT}`);
  console.log(`    Supabase URL : ${process.env.SUPABASE_URL ? '✔ set' : '✘ MISSING'}`);
  console.log(`    Resend Key   : ${process.env.RESEND_API_KEY ? '✔ set' : '✘ MISSING'}`);
  console.log(`    Owner Email  : ${process.env.OWNER_EMAIL || '✘ MISSING'}`);
});
