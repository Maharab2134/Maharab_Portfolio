import React from "react";
import { motion } from "framer-motion";
import { FaLock } from "react-icons/fa";
import { renderIcon } from "./types";
import { isDevLoginEnabled } from "./constants";

interface AdminLoginProps {
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  authError: string;
  authLoading: boolean;
  isSupabaseConfigured: boolean;
  onLogin: (e: React.FormEvent) => void;
  onBypass: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  authError,
  authLoading,
  isSupabaseConfigured,
  onLogin,
  onBypass,
}) => {
  return (
    <div className="relative min-h-screen px-4 bg-[#090d16] text-slate-200 flex items-center justify-center overflow-hidden">
      {/* Subtle Ambient Radial Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md p-7 sm:p-8 rounded-3xl bg-[#111726]/85 border border-white/[0.08] backdrop-blur-2xl shadow-2xl relative z-10"
      >
        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 mb-4 shadow-lg shadow-indigo-500/20 text-white">
            {renderIcon(FaLock, { size: 20 })}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Maharab Admin Console</h1>
          <p className="mt-1 text-xs text-slate-400">
            Sign in with your verified Supabase administrator credentials
          </p>
        </div>

        {/* Supabase Connection Status */}
        <div className="mb-5 p-3 rounded-xl border text-xs flex items-center justify-between bg-white/[0.02] border-white/[0.08]">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isSupabaseConfigured ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
            <span className={`font-medium ${isSupabaseConfigured ? "text-emerald-400" : "text-amber-300"}`}>
              {isSupabaseConfigured ? "Supabase Live Connected" : "Local Development Mode"}
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">v1.0.0</span>
        </div>

        {authError && (
          <div className="p-3 mb-5 text-xs text-rose-300 border rounded-xl bg-rose-500/10 border-rose-500/20">
            {authError}
          </div>
        )}

        <form onSubmit={onLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 text-[11px] uppercase tracking-wider mb-1.5">
              Admin Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@maharab.dev"
              className="w-full px-4 py-2.5 text-sm text-white bg-[#0c101d] border border-white/10 rounded-xl focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30 transition-all font-medium"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 text-[11px] uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-2.5 text-sm text-white bg-[#0c101d] border border-white/10 rounded-xl focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30 transition-all font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={authLoading}
            className="w-full py-3 mt-2 text-xs sm:text-sm font-semibold text-white transition-all rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:opacity-95 shadow-lg shadow-indigo-500/20 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
          >
            {authLoading ? "Authenticating..." : "Sign In to Admin Console"}
          </button>

          {isDevLoginEnabled && (
            <button
              type="button"
              onClick={onBypass}
              className="w-full py-2.5 text-xs font-semibold text-slate-300 hover:text-white transition-all rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] cursor-pointer"
            >
              ⚡ Instant Developer Access (Bypass Login)
            </button>
          )}
        </form>
      </motion.div>
    </div>
  );
};
