import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Eye, EyeOff, Lock, User, AlertCircle } from 'lucide-react';

const ADMIN_USERNAME = 'admin2233';
const ADMIN_PASSWORD = 'admin@2233';
const AUTH_STORAGE_KEY = 'ashapura_admin_auth';

export function getAdminAuth(): boolean {
  try {
    return localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setAdminAuth(value: boolean) {
  try {
    if (value) {
      localStorage.setItem(AUTH_STORAGE_KEY, 'true');
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch {}
}

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate small delay for realism
    await new Promise(r => setTimeout(r, 600));

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setAdminAuth(true);
      onLoginSuccess();
    } else {
      setError('Invalid username or password. Please try again.');
      setIsLoading(false);
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1F44] via-[#0f2a5c] to-[#0B1F44] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#EF233C]/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#C8A96A]/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.015] rounded-full blur-3xl" />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(200,169,106,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(200,169,106,0.3) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`relative w-full max-w-md ${shake ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}
        style={shake ? { animation: 'shake 0.5s ease-in-out' } : {}}
      >
        {/* Logo / Brand Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#C8A96A] to-[#a07840] mx-auto flex items-center justify-center shadow-2xl mb-4"
          >
            <ShieldCheck className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Admin Portal</h1>
          <p className="text-[#C8A96A]/80 text-sm mt-1 font-medium tracking-wider uppercase">
            Ashapura Tiles & Granite
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/[0.07] backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-white text-lg font-semibold mb-6">Sign in to continue</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div className="space-y-1.5">
              <label className="text-[#C8A96A] text-xs font-bold uppercase tracking-widest block">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={e => { setUsername(e.target.value); setError(''); }}
                  placeholder="Enter username"
                  autoComplete="username"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#C8A96A]/60 focus:ring-1 focus:ring-[#C8A96A]/40 transition-all text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[#C8A96A] text-xs font-bold uppercase tracking-widest block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  required
                  className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#C8A96A]/60 focus:ring-1 focus:ring-[#C8A96A]/40 transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#C8A96A] transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#EF233C] to-[#d90429] hover:from-[#d90429] hover:to-[#c0001f] text-white font-bold text-sm uppercase tracking-wider transition-all shadow-lg shadow-red-600/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Authenticating...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Sign In to Admin Panel
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Note */}
        <p className="text-center text-gray-500 text-xs mt-6">
          Protected admin area. Unauthorized access is prohibited.
        </p>
      </motion.div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-8px); }
          30% { transform: translateX(8px); }
          45% { transform: translateX(-5px); }
          60% { transform: translateX(5px); }
          75% { transform: translateX(-2px); }
          90% { transform: translateX(2px); }
        }
      `}</style>
    </div>
  );
};
