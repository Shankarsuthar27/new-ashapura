# Ashapura Auth Server — Render Deployment Guide

Express.js backend for the Forgot Password flow.  
Handles OTP generation, email sending via Resend, and password reset via Supabase.

---

## 📁 Structure

```
server/
├── index.js                 ← Express entry point
├── package.json
├── .env.example
├── routes/
│   └── auth.js              ← POST /api/auth/forgot-password|verify-otp|reset-password
├── middleware/
│   └── validate.js          ← express-validator rules
└── services/
    └── emailService.js      ← Resend email sender
```

---

## 🚀 Deploy to Render (Free Tier)

### Step 1 — Push to GitHub

Make sure your project is in a GitHub repository.

### Step 2 — Create a New Web Service on Render

1. Go to [render.com](https://render.com) → **New** → **Web Service**
2. Connect your GitHub repo
3. Settings:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
   - **Environment**: `Node`

### Step 3 — Set Environment Variables on Render

In the Render dashboard → your service → **Environment**:

| Key | Value |
|-----|-------|
| `SUPABASE_URL` | `https://cpmpyrliupmmsbvwcish.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `RESEND_API_KEY` | `re_your_resend_key` |
| `OWNER_EMAIL` | `ss2137789@gmail.com` |
| `FRONTEND_URL` | `https://your-vercel-url.vercel.app` |

### Step 4 — Update Frontend .env

After Render deploys, copy the URL (e.g. `https://ashapura-auth.onrender.com`) and update your frontend `.env`:

```
VITE_AUTH_API_URL=https://ashapura-auth.onrender.com
```

Rebuild and redeploy the frontend.

---

## 🗄️ Run the Supabase SQL Schema

1. Open Supabase Dashboard → **SQL Editor**
2. Run `supabase/password_reset_otps.sql`

---

## 🔌 API Endpoints

### `POST /api/auth/forgot-password`
```json
{ "email": "admin@example.com" }
```
Response: `{ "success": true, "message": "OTP sent to ss2137789@gmail.com..." }`

---

### `POST /api/auth/verify-otp`
```json
{ "email": "admin@example.com", "otp": "123456" }
```
Response: `{ "success": true, "reset_token": "abc123...64chars" }`

---

### `POST /api/auth/reset-password`
```json
{
  "email": "admin@example.com",
  "reset_token": "abc123...64chars",
  "new_password": "NewSecurePass1!"
}
```
Response: `{ "success": true, "message": "Password reset successfully." }`

---

## 🔒 Security Features

- ✅ OTP hashed with bcrypt (12 rounds) before storing
- ✅ OTP expires after **10 minutes**
- ✅ Max **3 OTP requests per 15 minutes** per email
- ✅ Service Role Key **never** exposed to frontend
- ✅ Helmet.js for security headers
- ✅ Rate limiting: 10 req/15min per IP on auth routes
- ✅ Input validation via express-validator
- ✅ OTP invalidated immediately after password reset

---

## 🧪 Test Locally

```bash
cd server
cp .env.example .env
# Fill in real values in .env
npm run dev
```

Test with curl:
```bash
curl -X POST http://localhost:3001/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"ss2137789@gmail.com"}'
```
