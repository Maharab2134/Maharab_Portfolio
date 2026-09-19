import React, { useState } from "react";
import {
  FaShieldAlt,
  FaCopy,
  FaCheck,
  FaCloudUploadAlt,
  FaSyncAlt,
  FaExclamationTriangle,
  FaDatabase,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { renderIcon } from "../types";
import { syncAllPortfolioDataToSupabaseCloud } from "../../../lib/portfolioService";

export const SetupTab: React.FC = () => {
  const [completeMigrationCopied, setCompleteMigrationCopied] = useState(false);
  const [rlsFixCopied, setRlsFixCopied] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{
    success?: boolean;
    results?: { entity: string; success: boolean; error?: string }[];
  } | null>(null);

  const completeMigrationSql = `-- ==============================================================================
-- 1. Create Missing Tables (Experience, Skills, Skill Categories)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.experience (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  role TEXT NOT NULL,
  company TEXT NOT NULL,
  company_url TEXT,
  company_logo TEXT,
  location TEXT,
  period TEXT NOT NULL,
  employment_type TEXT,
  description TEXT NOT NULL,
  technologies TEXT[] DEFAULT '{}',
  highlights TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.skill_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  skill_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  level TEXT NOT NULL DEFAULT 'Core',
  color TEXT DEFAULT '#a855f7',
  icon_name TEXT DEFAULT '',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- 2. Add Missing JSONB Columns to profile_info (Fix HTTP 400 Bad Request)
-- ==============================================================================
ALTER TABLE public.profile_info ADD COLUMN IF NOT EXISTS experience_config JSONB DEFAULT '{"isActive": true, "showCurrentOnly": false, "enableHighlights": true}'::jsonb;
ALTER TABLE public.profile_info ADD COLUMN IF NOT EXISTS development_process JSONB DEFAULT '{"enabled": true, "title": "Engineering Workflow", "subtitle": "From concept to production"}'::jsonb;
ALTER TABLE public.profile_info ADD COLUMN IF NOT EXISTS working_hours JSONB DEFAULT '{"enabled": true, "startHour": 9, "endHour": 22, "timezone": "Asia/Dhaka", "onlineLabel": "Available for Work"}'::jsonb;

-- ==============================================================================
-- 3. Disable Row Level Security (RLS) on ALL 10 Tables for Direct Admin Access
-- ==============================================================================
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_info DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.education DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_analytics DISABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 4. Storage Bucket for File Uploads (Images & Resumes)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio-assets', 'portfolio-assets', true) ON CONFLICT (id) DO UPDATE SET public = true;
DROP POLICY IF EXISTS "Allow public all on portfolio-assets" ON storage.objects;
CREATE POLICY "Allow public all on portfolio-assets" ON storage.objects FOR ALL TO public USING (bucket_id = 'portfolio-assets') WITH CHECK (bucket_id = 'portfolio-assets');`;

  const quickRlsSql = `-- Disable RLS on all 10 tables
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_info DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.education DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_analytics DISABLE ROW LEVEL SECURITY;

-- Storage bucket access
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio-assets', 'portfolio-assets', true) ON CONFLICT (id) DO UPDATE SET public = true;
DROP POLICY IF EXISTS "Allow public all on portfolio-assets" ON storage.objects;
CREATE POLICY "Allow public all on portfolio-assets" ON storage.objects FOR ALL TO public USING (bucket_id = 'portfolio-assets') WITH CHECK (bucket_id = 'portfolio-assets');`;

  const handleCopyCompleteMigration = () => {
    navigator.clipboard.writeText(completeMigrationSql);
    setCompleteMigrationCopied(true);
    setTimeout(() => setCompleteMigrationCopied(false), 2500);
  };

  const handleCopyQuickRls = () => {
    navigator.clipboard.writeText(quickRlsSql);
    setRlsFixCopied(true);
    setTimeout(() => setRlsFixCopied(false), 2500);
  };

  const handleDirectCloudSync = async () => {
    setIsSyncing(true);
    setSyncStatus(null);
    try {
      const res = await syncAllPortfolioDataToSupabaseCloud();
      setSyncStatus(res);
    } catch (err: any) {
      setSyncStatus({
        success: false,
        results: [{ entity: "Sync Process", success: false, error: err.message }],
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-white/[0.08]">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Supabase Setup &amp; Live Cloud Synchronization
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Deploy SQL schemas, fix missing tables / columns (404/400), and sync all admin data to Supabase cloud
        </p>
      </div>

      {/* Status Indicator */}
      <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#111726]/75 backdrop-blur-sm flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <div>
            <h4 className="text-sm font-bold text-white">Database Connection Configured</h4>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              https://zcmeryxyifkxbxkmgvfe.supabase.co
            </p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          Connected
        </span>
      </div>

      {/* Notice: Why Dummy Data Appears on Live Site */}
      <div className="p-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 space-y-4 shadow-xl">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 mt-0.5">
            {renderIcon(FaExclamationTriangle, { size: 18 })}
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-amber-200">
              Why was the live website showing dummy / static data?
            </h3>
            <p className="text-xs text-amber-100/90 leading-relaxed">
              When Supabase receives queries for tables that do not exist yet (such as{" "}
              <code className="bg-black/40 px-1 py-0.5 rounded text-amber-300 font-mono">public.experience</code>,{" "}
              <code className="bg-black/40 px-1 py-0.5 rounded text-amber-300 font-mono">public.skills</code>,{" "}
              <code className="bg-black/40 px-1 py-0.5 rounded text-amber-300 font-mono">public.skill_categories</code>
              ) or columns like{" "}
              <code className="bg-black/40 px-1 py-0.5 rounded text-amber-300 font-mono">experience_config</code>, it returns{" "}
              <strong>HTTP 404 (Not Found)</strong> or <strong>HTTP 400 (Bad Request)</strong>. As a safeguard against page crashes, the website automatically falls back to default static data.
            </p>
            <p className="text-xs text-amber-200 font-medium pt-1">
              Follow these two quick steps below to make your website 100% dynamic:
            </p>
          </div>
        </div>
      </div>

      {/* Step 1: SQL Migration */}
      <div className="p-6 rounded-2xl border border-indigo-500/30 bg-indigo-500/5 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-indigo-500 text-white text-xs font-bold flex items-center justify-center">
              1
            </span>
            <h3 className="text-sm font-bold text-indigo-200 flex items-center gap-2">
              {renderIcon(FaDatabase, { size: 15 })}
              <span>Run Database Schema in Supabase SQL Editor</span>
            </h3>
          </div>
          <button
            onClick={handleCopyCompleteMigration}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white flex items-center gap-2 transition-all shadow-md active:scale-[0.98] cursor-pointer"
          >
            {renderIcon(completeMigrationCopied ? FaCheck : FaCopy, { size: 12 })}
            <span>{completeMigrationCopied ? "Copied to Clipboard!" : "Copy Full Migration SQL"}</span>
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed font-light">
          Go to your{" "}
          <a
            href="https://supabase.com/dashboard/project/zcmeryxyifkxbxkmgvfe/sql"
            target="_blank"
            rel="noreferrer"
            className="text-cyan-400 hover:underline font-medium"
          >
            Supabase Dashboard ➔ SQL Editor
          </a>
          , paste the code below, and click <strong>Run</strong>. This will create all tables, add the missing JSONB columns, and unlock RLS permissions:
        </p>

        <pre className="p-4 rounded-xl bg-[#0c101d] border border-white/[0.08] text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed max-h-60">
          {completeMigrationSql}
        </pre>
      </div>

      {/* Step 2: Direct 1-Click Sync */}
      <div className="p-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 text-xs font-bold flex items-center justify-center">
              2
            </span>
            <h3 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
              {renderIcon(FaCloudUploadAlt, { size: 16 })}
              <span>Push All Admin &amp; Portfolio Data to Supabase Cloud</span>
            </h3>
          </div>
          <button
            onClick={handleDirectCloudSync}
            disabled={isSyncing}
            className={`px-5 py-2.5 text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-lg active:scale-[0.98] cursor-pointer ${
              isSyncing
                ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold"
            }`}
          >
            {renderIcon(FaSyncAlt, { size: 13, className: isSyncing ? "animate-spin" : "" })}
            <span>{isSyncing ? "Pushing Data to Supabase..." : "Push All Data to Cloud Now"}</span>
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed font-light">
          After running Step 1 in Supabase, click this button to automatically upload all your Profile details, Skills, Categories, Experience, Education, and Configurations directly to Supabase cloud. Once synced, every visitor on your live site will see your real dynamic data.
        </p>

        {syncStatus && (
          <div className="mt-4 p-4 rounded-xl bg-[#0d1322] border border-white/[0.08] space-y-3">
            <div className="flex items-center gap-2">
              {syncStatus.success ? (
                <>
                  {renderIcon(FaCheckCircle, { className: "text-emerald-400", size: 16 })}
                  <span className="text-xs font-bold text-emerald-400">
                    All Portfolio entities successfully uploaded to Supabase Cloud!
                  </span>
                </>
              ) : (
                <>
                  {renderIcon(FaTimesCircle, { className: "text-rose-400", size: 16 })}
                  <span className="text-xs font-bold text-rose-400">
                    Some tables could not be synced. Please check the details below:
                  </span>
                </>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {syncStatus.results?.map((res, i) => (
                <div
                  key={i}
                  className={`p-2.5 rounded-lg text-xs flex items-center justify-between border ${
                    res.success
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                      : "bg-rose-500/10 border-rose-500/30 text-rose-300"
                  }`}
                >
                  <span className="font-medium">{res.entity}</span>
                  <span className="text-[11px] font-mono">
                    {res.success ? "✓ Synced" : `✗ ${res.error || "Failed"}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Fix for RLS Write Permissions */}
      <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#111726]/75 backdrop-blur-sm space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            {renderIcon(FaShieldAlt, { size: 15, className: "text-amber-400" })}
            <span>Quick RLS Permissions Fix Only</span>
          </h3>
          <button
            onClick={handleCopyQuickRls}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-slate-200 flex items-center gap-2 transition-all border border-white/[0.1] active:scale-[0.98] cursor-pointer"
          >
            {renderIcon(rlsFixCopied ? FaCheck : FaCopy, { size: 12 })}
            <span>{rlsFixCopied ? "Copied RLS SQL!" : "Copy RLS Disable SQL"}</span>
          </button>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed font-light">
          If saving in any tab gives a <code className="text-amber-300 font-mono">violates row-level security policy</code> warning, copy this script to disable RLS on all 10 portfolio tables.
        </p>
      </div>
    </div>
  );
};
