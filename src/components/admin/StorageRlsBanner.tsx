import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaShieldAlt, FaTimes, FaCheck, FaCopy } from "react-icons/fa";
import { renderIcon } from "./types";

export const STORAGE_RLS_FIX_SQL = `-- 1. Create 'portfolio-assets' bucket if not already created
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-assets', 'portfolio-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Allow public (anon) full access to upload, update, view, and delete in portfolio-assets
CREATE POLICY "Allow public all on portfolio-assets"
ON storage.objects
FOR ALL
TO public
USING (bucket_id = 'portfolio-assets')
WITH CHECK (bucket_id = 'portfolio-assets');`;

interface StorageRlsBannerProps {
  storageRlsError: string | null;
  onDismiss?: () => void;
  setStorageRlsError?: (err: string | null) => void;
}

export const StorageRlsBanner: React.FC<StorageRlsBannerProps> = ({
  storageRlsError,
  onDismiss,
  setStorageRlsError,
}) => {
  const [storageRlsCopied, setStorageRlsCopied] = useState(false);

  if (!storageRlsError) return null;

  const copyStorageRlsSql = () => {
    navigator.clipboard.writeText(STORAGE_RLS_FIX_SQL);
    setStorageRlsCopied(true);
    setTimeout(() => setStorageRlsCopied(false), 2500);
  };

  const handleDismiss = () => {
    if (onDismiss) onDismiss();
    if (setStorageRlsError) setStorageRlsError(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-amber-500/10 backdrop-blur-md shadow-2xl space-y-3 relative text-xs mb-6"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 text-amber-300 font-bold text-sm">
          {renderIcon(FaShieldAlt, { size: 18, className: "text-amber-400 shrink-0" })}
          <span>Supabase Storage: Row-Level Security (RLS) Policy Required</span>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-all cursor-pointer"
          title="Dismiss notification"
        >
          {renderIcon(FaTimes, { size: 14 })}
        </button>
      </div>

      <p className="text-slate-300 leading-relaxed">
        Supabase Storage prevents anonymous client uploads by default with:{" "}
        <code className="text-rose-300 bg-rose-950/60 px-1.5 py-0.5 rounded font-mono text-[11px]">
          new row violates row-level security policy
        </code>
        . You just need to run this 2-step SQL command in your Supabase dashboard to enable uploads to the{" "}
        <strong className="text-white font-mono">portfolio-assets</strong> bucket.
      </p>

      <div className="p-3 rounded-xl bg-slate-950/90 border border-white/10 font-mono text-[11px] text-cyan-300 overflow-x-auto">
        <pre>{STORAGE_RLS_FIX_SQL}</pre>
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <button
          type="button"
          onClick={copyStorageRlsSql}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer"
        >
          {renderIcon(storageRlsCopied ? FaCheck : FaCopy, { size: 13 })}
          <span>{storageRlsCopied ? "SQL Copied to Clipboard!" : "Copy Storage RLS Fix SQL"}</span>
        </button>
        <span className="text-[11px] text-slate-400">
          Open{" "}
          <a
            href="https://supabase.com"
            target="_blank"
            rel="noreferrer"
            className="text-purple-400 underline font-semibold"
          >
            Supabase Dashboard
          </a>{" "}
          ➔ <strong>SQL Editor</strong>, paste this command and click <strong>Run</strong>.
        </span>
      </div>
    </motion.div>
  );
};
export default StorageRlsBanner;
