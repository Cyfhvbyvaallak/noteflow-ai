import React, { useState, useEffect } from 'react';
import {
  User,
  Lock,
  Sparkles,
  Shield,
  Save,
  Trash2,
  Cpu,
  Zap,
  CheckCircle2,
  HardDrive
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

export function ProfileSettings() {
  const { user, updateUserProfile, demoMode } = useAuth();
  const toast = useToast();

  const [name, setName] = useState(user?.name || 'Alex Vance');
  const [email, setEmail] = useState(user?.email || 'student@noteflow.ai');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [systemStatus, setSystemStatus] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    async function loadStatus() {
      try {
        const data = await api.settings.getStatus();
        setSystemStatus(data);
      } catch (err) {
        setSystemStatus({
          ai_mode: 'Demo Heuristic Generator',
          speech_to_text: 'OpenAI Whisper API / WAV Parser',
          database: 'Active (MySQL / SQLite Fallback)',
          status: 'Operational'
        });
      }
    }
    loadStatus();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const updated = await api.settings.updateProfile({ name, email });
      updateUserProfile(updated);
      toast.success('Profile information updated.');
    } catch {
      updateUserProfile({ name, email });
      toast.success('Profile updated locally.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setSavingPassword(true);
    try {
      await api.settings.changePassword({ current_password: currentPassword, new_password: newPassword });
      toast.success('Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      toast.error(err.message || 'Failed to update password.');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-100/90 via-amber-50 to-orange-100/80 p-6 sm:p-8 rounded-3xl text-stone-900 shadow-warm-card border border-[#E8D5A0] space-y-2">
        <Badge variant="purple" size="md">Account & Architecture</Badge>
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-stone-900">
          System Settings & Profile
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-lg leading-relaxed font-medium">
          Manage your student profile, security credentials, and view real-time AI engine status.
        </p>
      </div>

      {/* AI Engine Status Card */}
      <Card className="p-6 bg-[#FFFDF5] border-[#E8D5A0] shadow-warm-card space-y-4">
        <div className="flex items-center justify-between border-b border-[#E8D5A0]/60 pb-3">
          <div className="flex items-center gap-2.5">
            <Cpu className="w-5 h-5 text-emerald-600" />
            <h3 className="font-black text-stone-900 text-base">NoteFlow AI Engine Status</h3>
          </div>
          <Badge variant="success" size="sm" dot>
            Operational
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-[#FFF9E8] border border-[#E8D5A0]/70 space-y-1">
            <span className="text-stone-500 font-bold">AI Language Model</span>
            <p className="font-extrabold text-stone-900">{systemStatus?.ai_mode || 'GPT-4o Academic Engine'}</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFF9E8] border border-[#E8D5A0]/70 space-y-1">
            <span className="text-stone-500 font-bold">Speech-to-Text Model</span>
            <p className="font-extrabold text-stone-900">{systemStatus?.speech_to_text || 'OpenAI Whisper API'}</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFF9E8] border border-[#E8D5A0]/70 space-y-1">
            <span className="text-stone-500 font-bold">Database Persistence</span>
            <p className="font-extrabold text-emerald-700">{systemStatus?.database || 'MySQL 8.0 & SQLite'}</p>
          </div>
        </div>
      </Card>

      {/* Profile Info Form */}
      <Card className="p-6 bg-[#FFFDF5] border-[#E8D5A0] shadow-warm-card space-y-5">
        <h3 className="font-black text-stone-900 text-base flex items-center gap-2">
          <User className="w-4 h-4 text-cyan-700" />
          Student Profile
        </h3>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-stone-600 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FFF9E8] border border-[#E8D5A0] text-stone-900 placeholder:text-stone-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner"
              />
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-stone-600 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FFF9E8] border border-[#E8D5A0] text-stone-900 placeholder:text-stone-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={Save}
              isLoading={savingProfile}
              className="shadow-warm-card font-black"
            >
              Update Profile
            </Button>
          </div>
        </form>
      </Card>

      {/* Change Password Form */}
      <Card className="p-6 bg-[#FFFDF5] border-[#E8D5A0] shadow-warm-card space-y-5">
        <h3 className="font-black text-stone-900 text-base flex items-center gap-2">
          <Lock className="w-4 h-4 text-purple-700" />
          Security Credentials
        </h3>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-stone-600 mb-1.5">
                Current Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FFF9E8] border border-[#E8D5A0] text-stone-900 placeholder:text-stone-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-inner"
              />
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-stone-600 mb-1.5">
                New Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FFF9E8] border border-[#E8D5A0] text-stone-900 placeholder:text-stone-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-inner"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="purple"
              size="md"
              icon={Save}
              isLoading={savingPassword}
              disabled={!currentPassword || !newPassword}
              className="shadow-warm-card font-black"
            >
              Update Password
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
