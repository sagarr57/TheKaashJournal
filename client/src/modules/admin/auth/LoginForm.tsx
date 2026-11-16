import { useState, FormEvent } from "react";
import { useLocation } from "wouter";
import { Eye, EyeOff, Lock, Shield, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { setAuth } from "./index";

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export function LoginForm() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // 2FA step
  const [requires2fa, setRequires2fa] = useState(false);
  const [totpToken, setTotpToken] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const body: Record<string, string> = { username: username.trim(), password };
      if (requires2fa) body.totpToken = totpToken.replace(/\s/g, "");

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      let data: any;
      try { data = await response.json(); }
      catch {
        setError('Server error. Please check the backend is running.');
        return;
      }

      if (!response.ok) {
        setError(data.error || 'Invalid credentials');
        return;
      }

      if (data.requires2fa && !requires2fa) {
        setRequires2fa(true);
        setTotpToken("");
        return;
      }

      if (data.success) {
        setAuth(username.trim());
        toast.success("Logged in successfully");
        setLocation("/admin");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setRequires2fa(false);
    setTotpToken("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative w-full max-w-md">
        {/* Logo / branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/30 mb-4">
            {requires2fa
              ? <Shield className="w-7 h-7 text-white" />
              : <Lock className="w-7 h-7 text-white" />
            }
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {requires2fa ? "Two-Factor Auth" : "Admin Login"}
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {requires2fa
              ? `Enter the 6-digit code from your authenticator app`
              : "The Kaash Journal — Admin Dashboard"
            }
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">

            {!requires2fa ? (
              <>
                {/* Username */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="TeamKaash"
                    required
                    autoFocus
                    disabled={isLoading}
                    className="w-full bg-white/5 border border-white/15 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50"
                  />
                </div>

                {/* Password with eye toggle */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      disabled={isLoading}
                      className="w-full bg-white/5 border border-white/15 text-white placeholder-slate-500 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-200 transition-colors"
                      tabIndex={-1}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword
                        ? <EyeOff className="w-4.5 h-4.5" />
                        : <Eye className="w-4.5 h-4.5" />
                      }
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* 2FA code input */
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Authenticator Code
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={totpToken}
                  onChange={(e) => setTotpToken(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="000000"
                  required
                  autoFocus
                  disabled={isLoading}
                  className="w-full bg-white/5 border border-white/15 text-white placeholder-slate-500 rounded-xl px-4 py-4 text-2xl font-mono tracking-[0.5em] text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50"
                />
                <p className="text-xs text-slate-500 text-center">
                  Open your authenticator app and enter the 6-digit code
                </p>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading || (requires2fa && totpToken.length !== 6)}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 mt-2"
            >
              {isLoading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying…</>
                : requires2fa ? "Verify Code" : "Sign In"
              }
            </button>

            {/* Back link for 2FA step */}
            {requires2fa && (
              <button
                type="button"
                onClick={handleBack}
                className="w-full text-center text-sm text-slate-400 hover:text-slate-200 transition-colors"
              >
                ← Back to login
              </button>
            )}
          </form>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          thekaashjournal.com · Admin access only
        </p>
      </div>
    </div>
  );
}
