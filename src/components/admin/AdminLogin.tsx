import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, Mail, AlertCircle, ArrowLeft, Key, UserCheck, HelpCircle } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: (admin: any) => void;
  onBackToWebsite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToWebsite }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Bootstrap flow state
  const [bootstrapStatus, setBootstrapStatus] = useState<{ isBootstrapped: boolean; targetInitialEmail: string } | null>(null);
  const [showBootstrapModal, setShowBootstrapModal] = useState(false);
  const [bootstrapToken, setBootstrapToken] = useState('');
  const [bootstrapPassword, setBootstrapPassword] = useState('');
  const [bootstrapFullName, setBootstrapFullName] = useState('Sh. Dharuv Attri');
  const [bootstrapLoading, setBootstrapLoading] = useState(false);
  const [bootstrapError, setBootstrapError] = useState<string | null>(null);
  const [showSecretsGuide, setShowSecretsGuide] = useState(false);

  useEffect(() => {
    checkBootstrapStatus();
  }, []);

  const checkBootstrapStatus = async () => {
    try {
      const res = await fetch('/api/auth/status');
      const data = await res.json();
      setBootstrapStatus(data);
      if (data.targetInitialEmail) {
        setEmail(data.targetInitialEmail);
      }
    } catch (err) {
      console.error('Failed to query bootstrap status:', err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      onLoginSuccess(data.admin);
    } catch (err: any) {
      setError(err.message || 'Login error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleBootstrap = async (e: React.FormEvent) => {
    e.preventDefault();
    setBootstrapLoading(true);
    setBootstrapError(null);

    try {
      const res = await fetch('/api/auth/bootstrap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          setupToken: bootstrapToken,
          email: bootstrapStatus?.targetInitialEmail || 'dharuvattri@gmail.com',
          password: bootstrapPassword,
          fullName: bootstrapFullName,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Bootstrap failed');
      }

      setShowBootstrapModal(false);
      onLoginSuccess(data.admin);
    } catch (err: any) {
      setBootstrapError(err.message || 'Bootstrap setup error');
    } finally {
      setBootstrapLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-100">
      {/* Top back link */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <button
          onClick={onBackToWebsite}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to School Public Website</span>
        </button>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-indigo-900 border border-indigo-700 mx-auto flex items-center justify-center text-amber-400 shadow-md">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            School Administrator Gateway
          </h2>
          <p className="text-xs text-slate-400">
            Modern Public Sr. Sec. School, Swarghat · Authorized Personnel Only
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-slate-900 py-8 px-6 sm:px-10 rounded-2xl border border-slate-800 shadow-2xl space-y-6">
          {error && (
            <div className="p-4 rounded-lg bg-rose-950/50 border border-rose-800 text-rose-300 text-xs sm:text-sm flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Administrator Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="dharuvattri@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 placeholder:text-slate-600"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Secure Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 placeholder:text-slate-600"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 text-xs sm:text-sm font-semibold text-white bg-indigo-700 hover:bg-indigo-600 disabled:bg-indigo-900 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <Key className="w-4 h-4" />
                <span>{loading ? 'Authenticating...' : 'Sign In to Admin Portal'}</span>
              </button>
            </div>
          </form>

          {/* Security details & Bootstrap Trigger if not yet created */}
          <div className="pt-4 border-t border-slate-800 space-y-3 text-[11px] text-slate-400">
            <div className="flex items-center justify-between">
              <span>Security Policy:</span>
              <span className="text-emerald-400 font-medium">Session Rate Limiting & Audit Trail</span>
            </div>

            <div className="flex items-center justify-between">
              <span>Public Registration:</span>
              <span className="text-rose-400 font-medium">Disabled (Server-Enforced)</span>
            </div>

            {/* Secret Guide toggle button */}
            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={() => setShowSecretsGuide(!showSecretsGuide)}
                className="text-amber-400 hover:text-amber-300 underline flex items-center gap-1"
              >
                <HelpCircle className="w-3 h-3" />
                <span>Environment Secrets & Setup Instructions</span>
              </button>

              {bootstrapStatus && !bootstrapStatus.isBootstrapped && (
                <button
                  onClick={() => setShowBootstrapModal(true)}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold"
                >
                  Run Initial Setup →
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Secrets Configuration Explanation Guide */}
        {showSecretsGuide && (
          <div className="mt-6 bg-slate-900/90 border border-slate-800 rounded-xl p-5 text-xs text-slate-300 space-y-3">
            <h4 className="font-bold text-amber-300 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5" /> Required Environment Secrets & Rotation Guide
            </h4>
            <p className="text-slate-400 leading-relaxed">
              To securely initialize or rotate credentials without exposing raw passwords in public code:
            </p>
            <ul className="space-y-2 font-mono text-[11px] bg-slate-950 p-3 rounded-lg border border-slate-800/80">
              <li><strong className="text-indigo-300">INITIAL_ADMIN_EMAIL:</strong> "dharuvattri@gmail.com"</li>
              <li><strong className="text-indigo-300">INITIAL_ADMIN_PASSWORD:</strong> "YourSecurePassword2026!" (Min 8 characters)</li>
              <li><strong className="text-indigo-300">ADMIN_BOOTSTRAP_TOKEN:</strong> One-time setup token if using token-gated endpoint</li>
            </ul>
            <p className="text-[11px] text-slate-400">
              • Once the administrator account is created in PostgreSQL, the bootstrap endpoint automatically locks and rejects all subsequent attempts.
              <br />• Password change is available inside the authenticated portal at <strong>Account Security</strong>.
            </p>
          </div>
        )}
      </div>

      {/* One-Time Bootstrap Modal */}
      {showBootstrapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-5 text-slate-100 shadow-2xl">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-400" />
                Initial Admin Bootstrap Setup
              </h3>
              <p className="text-xs text-slate-400">
                Configure initial administrator for: <strong>{bootstrapStatus?.targetInitialEmail || 'dharuvattri@gmail.com'}</strong>
              </p>
            </div>

            {bootstrapError && (
              <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs">
                {bootstrapError}
              </div>
            )}

            <form onSubmit={handleBootstrap} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Full Name / Title
                </label>
                <input
                  type="text"
                  required
                  value={bootstrapFullName}
                  onChange={(e) => setBootstrapFullName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  New Admin Password (Min 8 characters)
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={bootstrapPassword}
                  onChange={(e) => setBootstrapPassword(e.target.value)}
                  placeholder="Enter strong password"
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Bootstrap Authorization Token
                </label>
                <input
                  type="text"
                  required
                  value={bootstrapToken}
                  onChange={(e) => setBootstrapToken(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowBootstrapModal(false)}
                  className="px-3 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bootstrapLoading}
                  className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-sm"
                >
                  {bootstrapLoading ? 'Creating...' : 'Initialize & Sign In'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
