import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  UserCheck,
  Mail,
  Lock,
  Wrench,
  Bell,
  Users,
  Shield,
  X,
  CheckCircle2,
  KeyRound,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Forgot Password Modal State
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState<string | null>(null);
  const [forgotError, setForgotError] = useState<string | null>(null);

  const performLogin = async (targetEmail: string, targetPass: string) => {
    setError(null);
    setIsLoading(true);

    try {
      const res = await api.login(targetEmail, targetPass);
      login(res.token, res.user);

      if (res.user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/resident/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your email address and password.');
      return;
    }
    performLogin(email, password);
  };

  const handleQuickDemoFill = (type: 'admin' | 'resident') => {
    const demoEmail = type === 'admin' ? 'admin@societyos.app' : 'ananya@societyos.app';
    const demoPass = type === 'admin' ? 'Admin@123' : 'Resident@123';

    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    setForgotSuccess(null);

    if (!forgotEmail.trim()) {
      setForgotError('Please enter your registered email address.');
      return;
    }

    setForgotLoading(true);

    try {
      const res = await api.forgotPassword(forgotEmail.trim());
      setForgotSuccess(res.message);
    } catch (err: any) {
      setForgotError(err.message || 'Failed to send reset instructions.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative bg-[#050B14] text-[#F3F0E8] font-sans flex flex-col justify-between overflow-x-hidden selection:bg-[#E88D38] selection:text-[#0D1A28] animate-page-enter">
      {/* Background Image Asset: bg_image.jpg with Darker Blackish Filter */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0 transition-transform duration-1000 scale-105"
        style={{
          backgroundImage: `url('/bg_image.jpg')`,
          filter: 'brightness(0.42) contrast(1.15) saturate(0.9)',
        }}
      />

      {/* Deep Blackish Dark Tint Overlay */}
      <div className="fixed inset-0 bg-gradient-to-r from-black/92 via-black/78 to-black/88 z-0 pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-t from-black/95 via-transparent to-black/60 z-0 pointer-events-none" />
      <div className="fixed inset-0 bg-[#E88D38]/5 pointer-events-none z-0 mix-blend-color-dodge" />

      {/* Main Content Layout Container */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 lg:px-16 py-8 flex-1 flex flex-col justify-between min-h-screen">
        {/* Top Header Logo */}
        <header className="flex items-center space-x-3.5 mb-8 lg:mb-0">
          <div className="w-11 h-11 rounded-2xl bg-[#E88D38]/20 border border-[#E88D38]/40 backdrop-blur-md flex items-center justify-center text-[#E88D38] shadow-lg shrink-0 transition-transform duration-500 hover:scale-105 hover:rotate-3">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-bold tracking-tight text-[#E9E3D2]">NestGrid</span>
            <p className="text-[10px] text-[#E88D38] font-extrabold uppercase tracking-widest mt-0.5">
              SMARTER MAINTENANCE. STRONGER COMMUNITIES.
            </p>
          </div>
        </header>

        {/* Main Split Body: Hero Content Left + Floating Glassmorphism Card Right */}
        <div className="my-auto py-8 lg:py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* LEFT SIDE — Editorial Hero Branding */}
          <div className="lg:col-span-7 space-y-8 max-w-2xl animate-slide-left">
            {/* Serif Heading with Warm Orange Shimmer Glow */}
            <div className="space-y-3">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-[#E9E3D2] tracking-tight leading-[1.1]">
                Smarter maintenance.<br />
                <span className="bg-gradient-to-r from-[#E88D38] via-[#F3C082] to-[#E88D38] bg-clip-text text-transparent italic drop-shadow-[0_0_20px_rgba(232,141,56,0.3)] animate-text-glow">
                  Stronger communities.
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-[#A7B1B5] max-w-lg leading-relaxed font-medium pt-2 transition-all duration-300 hover:text-[#E9E3D2]">
                A simple and modern way for residents and administrators to manage maintenance requests and stay connected.
              </p>
            </div>

            {/* 3 Compact Feature Points */}
            <div className="space-y-4 pt-2">
              <div className="flex items-start space-x-4 p-2 rounded-2xl transition-all duration-300 hover:bg-white/5 group">
                <div className="w-9 h-9 rounded-full bg-[#E88D38]/15 border border-[#E88D38]/35 flex items-center justify-center text-[#E88D38] shrink-0 mt-0.5 shadow-[0_0_12px_rgba(232,141,56,0.15)] transition-transform duration-300 group-hover:scale-110">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#E9E3D2] transition-colors duration-300 group-hover:text-[#E88D38]">Track maintenance</h3>
                  <p className="text-xs text-[#A7B1B5] font-medium mt-0.5">
                    Report issues and track their progress in real time.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-2 rounded-2xl transition-all duration-300 hover:bg-white/5 group">
                <div className="w-9 h-9 rounded-full bg-[#E88D38]/15 border border-[#E88D38]/35 flex items-center justify-center text-[#E88D38] shrink-0 mt-0.5 shadow-[0_0_12px_rgba(232,141,56,0.15)] transition-transform duration-300 group-hover:scale-110">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#E9E3D2] transition-colors duration-300 group-hover:text-[#E88D38]">Stay informed</h3>
                  <p className="text-xs text-[#A7B1B5] font-medium mt-0.5">
                    Get notified about updates and important notices.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-2 rounded-2xl transition-all duration-300 hover:bg-white/5 group">
                <div className="w-9 h-9 rounded-full bg-[#E88D38]/15 border border-[#E88D38]/35 flex items-center justify-center text-[#E88D38] shrink-0 mt-0.5 shadow-[0_0_12px_rgba(232,141,56,0.15)] transition-transform duration-300 group-hover:scale-110">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#E9E3D2] transition-colors duration-300 group-hover:text-[#E88D38]">Stronger together</h3>
                  <p className="text-xs text-[#A7B1B5] font-medium mt-0.5">
                    Building better communities through transparency.
                  </p>
                </div>
              </div>
            </div>

            {/* Editorial Quote at Bottom-Left */}
            <div className="pt-6 border-t border-[#E88D38]/20 space-y-1">
              <p className="font-serif italic text-xs text-[#E9E3D2]/80">
                “ Great communities are built on trust, care, and timely actions. ”
              </p>
              <p className="text-[11px] font-bold text-[#E88D38]">— NestGrid</p>
            </div>
          </div>

          {/* RIGHT SIDE — Floating Glassmorphism Login Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end animate-slide-right">
            <div className="bg-[#0A121D]/85 backdrop-blur-2xl border border-[#E88D38]/30 shadow-[0_25px_80px_rgba(0,0,0,0.8),0_0_35px_rgba(232,141,56,0.15)] hover:border-[#E88D38]/50 hover:shadow-[0_25px_90px_rgba(0,0,0,0.9),0_0_45px_rgba(232,141,56,0.25)] transition-all duration-500 rounded-3xl p-7 sm:p-9 max-w-[460px] w-full space-y-6">
              {/* Card Header */}
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#E9E3D2] tracking-tight">
                  Welcome back
                </h2>
                <p className="text-xs text-[#A7B1B5] mt-1 font-medium">
                  Sign in to continue to your NestGrid portal.
                </p>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="p-3.5 bg-[#C96A6A]/15 border border-[#C96A6A]/40 rounded-xl flex items-center space-x-2.5 text-[#C96A6A] text-xs font-semibold animate-page-enter">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-extrabold text-[#E9E3D2] uppercase tracking-wider mb-1.5">
                    EMAIL ADDRESS
                  </label>
                  <div className="relative group">
                    <Mail className="w-4 h-4 text-[#A7B1B5] absolute left-3.5 top-3.5 transition-colors duration-300 group-focus-within:text-[#E88D38]" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@societyos.app"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E88D38]/25 bg-[#121E2C]/90 text-[#F3F0E8] focus:outline-none focus:border-[#E88D38] focus:ring-2 focus:ring-[#E88D38]/30 text-xs font-medium placeholder-[#A7B1B5]/50 transition-all duration-300"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-[#E9E3D2] uppercase tracking-wider mb-1.5">
                    PASSWORD
                  </label>
                  <div className="relative group">
                    <Lock className="w-4 h-4 text-[#A7B1B5] absolute left-3.5 top-3.5 transition-colors duration-300 group-focus-within:text-[#E88D38]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-3 rounded-xl border border-[#E88D38]/25 bg-[#121E2C]/90 text-[#F3F0E8] focus:outline-none focus:border-[#E88D38] focus:ring-2 focus:ring-[#E88D38]/30 text-xs font-medium placeholder-[#A7B1B5]/50 transition-all duration-300"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-[#A7B1B5] hover:text-[#E9E3D2] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center space-x-2 text-[#A7B1B5] cursor-pointer select-none font-medium transition-colors hover:text-[#E9E3D2]">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-[#E88D38]/30 bg-[#121E2C] text-[#E88D38] focus:ring-0 cursor-pointer"
                    />
                    <span>Remember me</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(email);
                      setForgotSuccess(null);
                      setForgotError(null);
                      setIsForgotModalOpen(true);
                    }}
                    className="text-[#E88D38] hover:underline font-bold text-xs transition-all hover:tracking-wide"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#E88D38] hover:bg-[#F09B48] text-[#0D1A28] font-extrabold text-xs shadow-lg hover:shadow-[0_0_25px_rgba(232,141,56,0.45)] hover:scale-[1.01] active:scale-[0.98] transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 mt-2"
                >
                  <span>→ Sign In</span>
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E88D38]/20"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-extrabold">
                  <span className="bg-[#0A121D] px-3 text-[#A7B1B5]">OR</span>
                </div>
              </div>

              {/* Demo Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleQuickDemoFill('resident')}
                  className="py-2.5 px-3 rounded-xl border border-[#E88D38]/30 bg-white/5 hover:bg-[#E88D38]/15 hover:border-[#E88D38]/60 flex items-center justify-center space-x-2 text-xs font-bold text-[#E9E3D2] transition-all duration-300 hover:scale-[1.02]"
                >
                  <UserCheck className="w-3.5 h-3.5 text-[#E88D38]" />
                  <span>Demo Resident</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoFill('admin')}
                  className="py-2.5 px-3 rounded-xl border border-[#E88D38]/30 bg-white/5 hover:bg-[#E88D38]/15 hover:border-[#E88D38]/60 flex items-center justify-center space-x-2 text-xs font-bold text-[#E9E3D2] transition-all duration-300 hover:scale-[1.02]"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#E88D38]" />
                  <span>Demo Admin</span>
                </button>
              </div>

              {/* Registration Link */}
              <p className="text-center text-xs text-[#A7B1B5] pt-2 font-medium">
                Don't have an account?{' '}
                <Link to="/register" className="font-bold text-[#E88D38] hover:underline transition-all hover:tracking-wide">
                  Register as a Resident →
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Center Security Badge */}
        <footer className="py-4 text-center text-[11px] text-[#A7B1B5]/80 font-medium flex items-center justify-center space-x-1.5">
          <Shield className="w-3.5 h-3.5 text-[#E88D38]" />
          <span>Secure. Reliable. Built for your community.</span>
        </footer>
      </div>

      {/* WORKING FORGOT PASSWORD MODAL */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0A121D]/90 backdrop-blur-2xl border border-[#E88D38]/30 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative animate-page-enter">
            <button
              onClick={() => setIsForgotModalOpen(false)}
              className="absolute top-6 right-6 text-[#A7B1B5] hover:text-[#E9E3D2] p-1.5 rounded-xl hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#E88D38]/20 border border-[#E88D38]/40 flex items-center justify-center text-[#E88D38]">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-xl font-bold text-[#E9E3D2]">Reset Password</h2>
                <p className="text-xs text-[#A7B1B5]">NestGrid Account Recovery</p>
              </div>
            </div>

            {forgotSuccess ? (
              <div className="space-y-4 py-2">
                <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl flex items-start space-x-3 text-emerald-300 text-xs">
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
                  <p className="leading-relaxed font-medium">{forgotSuccess}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(false)}
                  className="w-full py-3 rounded-xl bg-[#E88D38] hover:bg-[#F09B48] text-[#0D1A28] font-extrabold text-xs shadow-md transition-all"
                >
                  Back to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <p className="text-xs text-[#A7B1B5] leading-relaxed">
                  Enter your registered email address below and we'll send you password reset instructions.
                </p>

                {forgotError && (
                  <div className="p-3 bg-[#C96A6A]/15 border border-[#C96A6A]/40 rounded-xl flex items-center space-x-2 text-[#C96A6A] text-xs font-semibold">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{forgotError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-extrabold text-[#E9E3D2] uppercase tracking-wider mb-1.5">
                    EMAIL ADDRESS
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#A7B1B5] absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E88D38]/25 bg-[#121E2C] text-[#F3F0E8] focus:outline-none focus:border-[#E88D38] text-xs font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-[#E88D38]/30 text-xs font-bold text-[#A7B1B5] hover:text-[#E9E3D2]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="px-5 py-2.5 rounded-xl bg-[#E88D38] hover:bg-[#F09B48] text-[#0D1A28] font-extrabold text-xs shadow-md transition-all disabled:opacity-50"
                  >
                    {forgotLoading ? 'Sending...' : 'Send Reset Link →'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
