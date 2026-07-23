import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Lock, 
  User, 
  AlertCircle, 
  KeyRound, 
  X, 
  ArrowLeft, 
  RefreshCw, 
  CheckCircle2, 
  LockKeyhole, 
  Info,
  Smartphone,
  Check
} from 'lucide-react';
import { 
  loginAdmin, 
  isSupabaseConfigured,
  getAdminAuth,
  setAdminAuth
} from '../lib/supabase';
import {
  requestPasswordResetOTP,
  verifyPasswordResetOTP,
  resetPasswordWithToken,
} from '../lib/forgotPasswordApi';

const ADMIN_USERNAME = 'admin2233';
const ADMIN_PASSWORD = 'admin@2233';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
}

type FlowStep = 'login' | 'forgot-request' | 'forgot-otp' | 'forgot-reset';

interface PasswordStrength {
  score: number; // 0 to 4
  hasMinLength: boolean;
  hasLetter: boolean;
  hasNumber: boolean;
  hasSymbol: boolean;
}

const checkPasswordStrength = (pass: string): PasswordStrength => {
  const hasMinLength = pass.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(pass);
  const hasNumber = /[0-9]/.test(pass);
  const hasSymbol = /[^a-zA-Z0-9]/.test(pass);
  
  let score = 0;
  if (hasMinLength) score += 1;
  if (hasLetter) score += 1;
  if (hasNumber) score += 1;
  if (hasSymbol) score += 1;
  
  return { score, hasMinLength, hasLetter, hasNumber, hasSymbol };
};

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess }) => {
  // Flow management
  const [flowStep, setFlowStep] = useState<FlowStep>('login');
  
  // Login fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Forgot Password fields
  const [forgotUserOrEmail, setForgotUserOrEmail] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  // Timer indicators
  const [otpTimer, setOtpTimer] = useState(300); // 5 mins in seconds
  
  // UI states
  const [error, setError] = useState('');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [shake, setShake] = useState(false);

  // Show dynamic toast helper
  const triggerToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 5000);
  };

  // Timer Effect
  useEffect(() => {
    let interval: any;
    if (flowStep === 'forgot-otp' && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [flowStep, otpTimer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Submit standard login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!isSupabaseConfigured) {
      // Local fallback
      await new Promise(r => setTimeout(r, 600));
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        setAdminAuth(true);
        onLoginSuccess();
      } else {
        setError('Invalid credentials (local fallback).');
        setIsLoading(false);
        setShake(true);
        setTimeout(() => setShake(false), 600);
      }
      return;
    }

    try {
      await loginAdmin(username, password);
      setAdminAuth(true);
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message || 'Invalid username or password. Please try again.');
      setIsLoading(false);
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  };

  // Submit request for OTP code
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!forgotUserOrEmail.trim()) {
      setError('Please enter your email address.');
      setIsLoading(false);
      return;
    }

    try {
      const res = await requestPasswordResetOTP(forgotUserOrEmail.trim());
      setIsLoading(false);
      setOtpTimer(600); // 10 minutes to match backend TTL
      setFlowStep('forgot-otp');
      triggerToast('success', res.message || 'A secure 6-digit code has been sent to the owner email.');
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP. Please try again.');
      setIsLoading(false);
    }
  };

  // Submit OTP code verification
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (otpTimer <= 0) {
      setError('This OTP code has expired. Please request a new code.');
      setIsLoading(false);
      return;
    }

    try {
      const res = await verifyPasswordResetOTP(forgotUserOrEmail.trim(), enteredOtp.trim());
      setResetToken(res.reset_token);
      setIsLoading(false);
      setFlowStep('forgot-reset');
      triggerToast('success', 'Verification complete. Update your password below.');
    } catch (err: any) {
      setError(err.message || 'OTP verification failed. Please check the code and try again.');
      setIsLoading(false);
    }
  };

  // Resend OTP trigger
  const handleResendOtp = async () => {
    setError('');
    setIsLoading(true);
    try {
      const res = await requestPasswordResetOTP(forgotUserOrEmail.trim());
      setIsLoading(false);
      setOtpTimer(600); // Reset to 10 mins
      triggerToast('success', res.message || 'OTP code has been resent.');
    } catch (err: any) {
      setError(err.message || 'Failed to resend OTP.');
      setIsLoading(false);
    }
  };

  // Submit password reset
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const strength = checkPasswordStrength(newPassword);
    if (strength.score < 3 || !strength.hasMinLength) {
      setError('Password does not meet the minimum security strength criteria.');
      return;
    }

    setIsLoading(true);
    try {
      await resetPasswordWithToken(forgotUserOrEmail.trim(), resetToken, newPassword);
      setIsLoading(false);
      setFlowStep('login');
      setUsername(forgotUserOrEmail);
      setPassword('');
      setForgotUserOrEmail('');
      setResetToken('');
      triggerToast('success', 'Password reset successfully. You can now log in.');
    } catch (err: any) {
      setError(err.message || 'Password update failed. Please try again.');
      setIsLoading(false);
    }
  };

  // Password strength check helper variables
  const strength = checkPasswordStrength(newPassword);
  const strengthLabels = ['Weak', 'Weak', 'Moderate', 'Strong', 'Very Strong'];
  const strengthColors = [
    'bg-red-500', 
    'bg-red-500', 
    'bg-amber-500', 
    'bg-emerald-500', 
    'bg-green-500'
  ];

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

      {/* Floating Status Toast Notifications */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.95 }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl border shadow-2xl backdrop-blur-md max-w-sm w-[90%] ${
              toast.type === 'success' 
                ? 'bg-green-500/10 border-green-500/20 text-green-300' 
                : 'bg-red-500/10 border-red-500/20 text-red-300'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 shrink-0 text-green-400" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
            )}
            <span className="text-sm font-medium">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

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

        {/* Dynamic Auth Card Layout */}
        <div className="bg-white/[0.07] backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden">
          
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Standard Login Form */}
            {flowStep === 'login' && (
              <motion.div
                key="login-step"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="text-white text-lg font-semibold mb-6">Sign in to continue</h2>

                <form onSubmit={handleLoginSubmit} className="space-y-5">
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
                    <div className="flex justify-between items-center">
                      <label className="text-[#C8A96A] text-xs font-bold uppercase tracking-widest block">
                        Password
                      </label>
                    </div>
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

                  {/* Forgot link positioned below password field */}
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => { setFlowStep('forgot-request'); setError(''); }}
                      className="text-xs text-gray-400 hover:text-[#C8A96A] transition-colors focus:outline-none font-medium"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

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
              </motion.div>
            )}

            {/* STEP 2: Request Forgot Password OTP */}
            {flowStep === 'forgot-request' && (
              <motion.div
                key="request-otp-step"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-2 mb-6">
                  <button
                    onClick={() => { setFlowStep('login'); setError(''); }}
                    className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <h2 className="text-white text-lg font-semibold">Reset Password</h2>
                </div>

                <p className="text-gray-400 text-xs mb-5 leading-relaxed text-left">
                  Enter your registered administrator username or email address. We will send a secure 6-digit OTP code to the system owner's phone number (**9664471637**).
                </p>

                <form onSubmit={handleRequestOtp} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[#C8A96A] text-xs font-bold uppercase tracking-widest block text-left">
                      Username or Email
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={forgotUserOrEmail}
                        onChange={e => { setForgotUserOrEmail(e.target.value); setError(''); }}
                        placeholder="e.g. admin2233"
                        required
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#C8A96A]/60 focus:ring-1 focus:ring-[#C8A96A]/40 transition-all text-sm"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#C8A96A] to-[#a07840] hover:from-[#d5b67a] hover:to-[#b0874c] text-white font-bold text-sm uppercase tracking-wider transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="animate-spin w-4 h-4" />
                        Generating Code...
                      </>
                    ) : (
                      <>
                        <Smartphone className="w-4 h-4" />
                        Send OTP SMS
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}

            {/* STEP 3: Verify 6-digit OTP */}
            {flowStep === 'forgot-otp' && (
              <motion.div
                key="verify-otp-step"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-2 mb-6">
                  <button
                    onClick={() => { setFlowStep('forgot-request'); setError(''); }}
                    className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <h2 className="text-white text-lg font-semibold">Enter Security Code</h2>
                </div>

                <p className="text-gray-400 text-xs mb-5 leading-relaxed text-left">
                  We have dispatched a 6-digit OTP to your registered email address. Please check your inbox.
                </p>

                <form onSubmit={handleVerifyOtp} className="space-y-5">
                  <div className="space-y-1.5 text-center">
                    <label className="text-[#C8A96A] text-xs font-bold uppercase tracking-widest block text-left">
                      Verification OTP Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={enteredOtp}
                      onChange={e => { setEnteredOtp(e.target.value.replace(/\D/g, '')); setError(''); }}
                      placeholder="e.g. 123456"
                      required
                      className="w-full text-center py-3 bg-white/10 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#C8A96A]/60 focus:ring-1 focus:ring-[#C8A96A]/40 transition-all font-mono text-xl tracking-widest"
                    />
                  </div>

                  {/* Timer Display */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Code expires in:</span>
                    <span className={`font-mono font-semibold ${otpTimer <= 60 ? 'text-[#EF233C]' : 'text-[#C8A96A]'}`}>
                      {formatTime(otpTimer)}
                    </span>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-left">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading || enteredOtp.length !== 6}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#C8A96A] to-[#a07840] hover:from-[#d5b67a] hover:to-[#b0874c] text-white font-bold text-sm uppercase tracking-wider transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="animate-spin w-4 h-4" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Verify Code
                      </>
                    )}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      disabled={isLoading || otpTimer > 0}
                      onClick={handleResendOtp}
                      className="text-xs text-gray-400 hover:text-white transition-colors disabled:opacity-40 disabled:hover:text-gray-400 font-medium flex items-center gap-1.5 mx-auto"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                      Resend Code {otpTimer > 0 ? `(${otpTimer}s)` : ''}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* STEP 4: Reset Password Page */}
            {flowStep === 'forgot-reset' && (
              <motion.div
                key="reset-password-step"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-2 mb-6">
                  <h2 className="text-white text-lg font-semibold">Set New Password</h2>
                </div>

                <p className="text-gray-400 text-xs mb-5 leading-relaxed text-left">
                  Provide a new secure password. Resetting the password will invalidate any previous tokens and log out existing sessions.
                </p>

                <form onSubmit={handlePasswordReset} className="space-y-4">
                  {/* New Password */}
                  <div className="space-y-1.5">
                    <label className="text-[#C8A96A] text-xs font-bold uppercase tracking-widest block text-left">
                      New Password
                    </label>
                    <div className="relative">
                      <LockKeyhole className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={e => { setNewPassword(e.target.value); setError(''); }}
                        placeholder="Minimum 8 characters"
                        required
                        className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#C8A96A]/60 focus:ring-1 focus:ring-[#C8A96A]/40 transition-all text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(p => !p)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#C8A96A] transition-colors"
                        tabIndex={-1}
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1.5">
                    <label className="text-[#C8A96A] text-xs font-bold uppercase tracking-widest block text-left">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <LockKeyhole className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={e => { setConfirmPassword(e.target.value); setError(''); }}
                        placeholder="Repeat new password"
                        required
                        className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#C8A96A]/60 focus:ring-1 focus:ring-[#C8A96A]/40 transition-all text-sm"
                      />
                    </div>
                  </div>

                  {/* Password Strength Indicator */}
                  {newPassword.length > 0 && (
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5 space-y-3 text-left animate-fadeIn">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">Password Strength:</span>
                        <span className={`font-bold ${
                          strength.score <= 1 ? 'text-red-400' : strength.score === 2 ? 'text-amber-400' : 'text-green-400'
                        }`}>
                          {strengthLabels[strength.score]}
                        </span>
                      </div>
                      
                      {/* Strength meter bars */}
                      <div className="grid grid-cols-4 gap-1.5">
                        {[0, 1, 2, 3].map(index => (
                          <div
                            key={index}
                            className={`h-1.5 rounded-full transition-all ${
                              index < strength.score ? strengthColors[strength.score] : 'bg-white/10'
                            }`}
                          />
                        ))}
                      </div>

                      {/* Criteria Checklist */}
                      <div className="space-y-1.5 pt-1 text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <Check className={`w-3.5 h-3.5 ${strength.hasMinLength ? 'text-green-400' : 'text-gray-500'}`} />
                          <span className={strength.hasMinLength ? 'text-gray-300' : 'text-gray-500'}>Minimum 8 characters</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Check className={`w-3.5 h-3.5 ${strength.hasLetter ? 'text-green-400' : 'text-gray-500'}`} />
                          <span className={strength.hasLetter ? 'text-gray-300' : 'text-gray-500'}>Contains letters (a-z)</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Check className={`w-3.5 h-3.5 ${strength.hasNumber ? 'text-green-400' : 'text-gray-500'}`} />
                          <span className={strength.hasNumber ? 'text-gray-300' : 'text-gray-500'}>Contains numbers (0-9)</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Check className={`w-3.5 h-3.5 ${strength.hasSymbol ? 'text-green-400' : 'text-gray-500'}`} />
                          <span className={strength.hasSymbol ? 'text-gray-300' : 'text-gray-500'}>Contains special symbols</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-left">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading || strength.score < 3 || newPassword !== confirmPassword}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#EF233C] to-[#d90429] hover:from-[#d90429] hover:to-[#c0001f] text-white font-bold text-sm uppercase tracking-wider transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="animate-spin w-4 h-4" />
                        Updating Password...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        Update Password & Log In
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}
            
          </AnimatePresence>

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
