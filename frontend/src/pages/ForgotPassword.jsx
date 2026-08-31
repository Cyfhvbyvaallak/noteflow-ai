import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  GraduationCap,
  Mail,
  ArrowLeft,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

export function ForgotPassword() {
  const navigate = useNavigate();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.auth.forgotPassword(email.trim());
      setSubmitted(true);
      toast.success('Password reset instructions generated.');
    } catch (err) {
      toast.error('Unable to send reset request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5 font-extrabold text-2xl text-slate-900 tracking-tight">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span>NoteFlow <span className="text-emerald-600 font-black">AI</span></span>
          </Link>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Reset your password</h2>
          <p className="text-xs text-slate-500">Enter your student email to receive recovery instructions</p>
        </div>

        <Card className="p-6 sm:p-8 bg-white border-slate-200 shadow-soft">
          {submitted ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Check Your Inbox</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                If an account matches <strong>{email}</strong>, we have generated password reset instructions.
              </p>
              <Button variant="primary" size="md" onClick={() => navigate('/login')} className="w-full">
                Return to Login
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Account Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="student@noteflow.ai"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={loading}
                className="w-full mt-2 shadow-emerald-500/20"
              >
                Send Reset Instructions
              </Button>
            </form>
          )}

          <div className="pt-6 mt-6 border-t border-slate-100 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to sign in</span>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
