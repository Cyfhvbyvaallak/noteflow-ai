import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  GraduationCap,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  Zap,
  AlertCircle
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export function Login() {
  const navigate = useNavigate();
  const { login, loginDemo } = useAuth();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      await login(email.trim(), password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      setErrorMessage(err.message || 'Incorrect email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = () => {
    loginDemo();
    toast.success('Logged in as Demo Student!');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#FFF9E8] flex items-center justify-center p-4 sm:p-6 text-stone-900 relative overflow-hidden">
      {/* Background glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Brand Logo Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5 font-black text-2xl text-stone-900 tracking-tight group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 flex items-center justify-center text-white shadow-warm-card font-black">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span>NoteFlow <span className="text-emerald-700 font-black">AI</span></span>
          </Link>
          <p className="text-xs text-stone-600 font-medium">
            Sign in to access your AI study system
          </p>
        </div>

        {/* 1-Click Quick Demo Login Button */}
        <div className="p-4 rounded-3xl bg-[#FFFDF5] border border-emerald-500/40 text-center space-y-2 shadow-warm-card">
          <div className="text-xs font-bold text-emerald-800 flex items-center justify-center gap-1.5">
            <Zap className="w-4 h-4 text-emerald-600" />
            <span>Instant Zero-Configuration Access</span>
          </div>
          <Button
            variant="primary"
            size="md"
            icon={Zap}
            onClick={handleQuickDemoLogin}
            className="w-full shadow-warm-card font-black"
          >
            1-Click Demo Login (Alex Vance)
          </Button>
        </div>

        {/* Traditional Credentials Form Card */}
        <Card className="p-6 sm:p-8 bg-[#FFFDF5] border-[#E8D5A0] shadow-warm-card space-y-5">
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-stone-600 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="student@noteflow.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#E8D5A0] bg-[#FFF9E8] text-stone-900 placeholder:text-stone-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-black uppercase tracking-wider text-stone-600">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs text-emerald-700 hover:underline font-bold">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#E8D5A0] bg-[#FFF9E8] text-stone-900 placeholder:text-stone-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="cyan"
              size="lg"
              isLoading={loading}
              icon={ArrowRight}
              className="w-full font-black mt-2"
            >
              Sign In to NoteFlow AI
            </Button>
          </form>

          <div className="text-center text-xs text-stone-600 pt-2 border-t border-[#E8D5A0]/60">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-emerald-700 font-bold hover:underline">
              Create free student account
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
