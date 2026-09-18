import React, { useState } from "react";
import { FaShieldAlt, FaCopy, FaCheck } from "react-icons/fa";
import { renderIcon } from "../types";

export const SetupTab: React.FC = () => {
  const [databaseFixCopied, setDatabaseFixCopied] = useState(false);

  const fullRlsSql = `-- 1. Disable RLS on all tables
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_info DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.education DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_analytics DISABLE ROW LEVEL SECURITY;

-- 2. Allow public uploads & access to 'portfolio-assets' bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio-assets', 'portfolio-assets', true) ON CONFLICT (id) DO UPDATE SET public = true;
CREATE POLICY "Allow public all on portfolio-assets" ON storage.objects FOR ALL TO public USING (bucket_id = 'portfolio-assets') WITH CHECK (bucket_id = 'portfolio-assets');`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(fullRlsSql);
    setDatabaseFixCopied(true);
    setTimeout(() => setDatabaseFixCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-white/[0.08]">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Supabase Setup &amp; Live SQL Schema</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Verify your database connection and deploy schema configurations in 1 click
        </p>
      </div>

      {/* Status Indicator */}
      <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#111726]/75 backdrop-blur-sm flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <div>
            <h4 className="text-sm font-bold text-white">Database Connection Active</h4>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              https://zcmeryxyifkxbxkmgvfe.supabase.co
            </p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          Ready &amp; Synced
        </span>
      </div>

      {/* Quick Fix for RLS Write Permissions */}
      <div className="p-6 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
            {renderIcon(FaShieldAlt, { size: 15 })}
            <span>Fix Edit, Save &amp; Upload Permissions (Supabase RLS Fix)</span>
          </h3>
          <button
            onClick={handleCopySql}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center gap-2 transition-all shadow-md active:scale-[0.98] cursor-pointer"
          >
            {renderIcon(databaseFixCopied ? FaCheck : FaCopy, { size: 12 })}
            <span>{databaseFixCopied ? "Copied to Clipboard!" : "Copy Full RLS Fix SQL"}</span>
          </button>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-light">
          If editing says <code className="text-amber-300 bg-black/40 px-1 py-0.5 rounded font-mono">RLS error</code> or file uploading says <code className="text-amber-300 bg-black/40 px-1 py-0.5 rounded font-mono">new row violates row-level security policy</code>, simply copy and run this script in your <strong className="text-cyan-300">Supabase SQL Editor</strong>:
        </p>
        <pre className="p-4 rounded-xl bg-[#0c101d] border border-white/[0.08] text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed">
{`-- 1. Disable RLS on all tables
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_info DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.education DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_analytics DISABLE ROW LEVEL SECURITY;

-- 2. Allow public uploads to 'portfolio-assets' bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio-assets', 'portfolio-assets', true) ON CONFLICT (id) DO UPDATE SET public = true;
CREATE POLICY "Allow public all on portfolio-assets" ON storage.objects FOR ALL TO public USING (bucket_id = 'portfolio-assets') WITH CHECK (bucket_id = 'portfolio-assets');`}
        </pre>
      </div>

      {/* Step by Step SQL Instructions */}
      <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#111726]/75 backdrop-blur-sm space-y-4 text-xs leading-relaxed text-slate-300 shadow-xl">
        <h3 className="text-sm font-bold text-white">How to initialize your tables in Supabase:</h3>
        <ol className="list-decimal pl-5 space-y-2 text-slate-400">
          <li>
            Open your project root file: <code className="text-cyan-400 font-mono">supabase_schema.sql</code>.
          </li>
          <li>
            Go to your <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">Supabase Dashboard</a> ➔ <strong>SQL Editor</strong>.
          </li>
          <li>
            Paste all the code from <code className="text-cyan-400 font-mono">supabase_schema.sql</code> and click <strong>Run</strong>.
          </li>
          <li>
            In Supabase Dashboard, go to <strong>Storage ➔ New Bucket</strong>, name it: <code className="text-cyan-400 font-mono font-bold">portfolio-assets</code>, and toggle <strong>Public Bucket: ON</strong>.
          </li>
        </ol>
      </div>
    </div>
  );
};
