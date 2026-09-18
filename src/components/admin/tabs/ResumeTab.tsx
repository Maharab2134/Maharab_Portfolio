import React, { useState } from "react";
import {
  FaSpinner,
  FaFilePdf,
  FaCheckCircle,
  FaExternalLinkAlt,
  FaCheck,
  FaCopy,
} from "react-icons/fa";
import { renderIcon } from "../types";

interface ResumeTabProps {
  uploadStatus: string;
  renderStorageRlsBanner: () => React.ReactNode;
  profileForm: any;
  setProfileForm: React.Dispatch<React.SetStateAction<any>>;
  saveLiveProfile: (form: any) => Promise<any>;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>, type: "avatar" | "resume") => void;
}

export const ResumeTab: React.FC<ResumeTabProps> = ({
  uploadStatus,
  renderStorageRlsBanner,
  profileForm,
  setProfileForm,
  saveLiveProfile,
  handleFileUpload,
}) => {
  const [resumeSavedToast, setResumeSavedToast] = useState(false);
  const [resumeManualSaving, setResumeManualSaving] = useState(false);
  const [resumeCopied, setResumeCopied] = useState(false);

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-white/[0.08]">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Resume &amp; Asset Cloud Storage</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Direct management of your primary curriculum vitae PDF and CDN portfolio media assets
        </p>
      </div>

      {uploadStatus && (
        <div className="p-3.5 text-xs text-cyan-300 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center gap-2.5">
          {renderIcon(FaSpinner, { className: "animate-spin shrink-0", size: 13 })}
          <span className="font-medium">{uploadStatus}</span>
        </div>
      )}

      {renderStorageRlsBanner()}

      {/* Current Resume Info Card */}
      <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#111726]/75 backdrop-blur-sm space-y-5 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            {renderIcon(FaFilePdf, { size: 28 })}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">Currently Active Resume Document</h3>
              <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                LIVE ON PORTFOLIO
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono break-all mt-1 bg-[#0c101d] px-3 py-1.5 rounded-lg border border-white/[0.06]">
              {profileForm.resume_url || "/PDF/Maharab_Hosen.pdf"}
            </p>
          </div>
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-200">
              Live Resume / CV Hosted URL:
            </label>
            {resumeSavedToast && (
              <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                {renderIcon(FaCheckCircle, { size: 12 })}
                <span>Live CV URL Updated &amp; Saved!</span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-2.5">
            <input
              type="text"
              value={profileForm.resume_url}
              onChange={(e) => setProfileForm({ ...profileForm, resume_url: e.target.value })}
              placeholder="https://..."
              className="flex-1 px-4 py-2.5 text-xs text-white bg-[#0c101d] border border-white/[0.08] rounded-xl focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 font-mono transition-all placeholder:text-slate-500"
            />
            <button
              type="button"
              disabled={resumeManualSaving}
              onClick={async () => {
                setResumeManualSaving(true);
                await saveLiveProfile(profileForm);
                setResumeManualSaving(false);
                setResumeSavedToast(true);
                setTimeout(() => setResumeSavedToast(false), 3000);
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:opacity-95 text-xs font-bold text-white transition-all shadow-md shadow-indigo-500/20 active:scale-[0.98] disabled:opacity-50 cursor-pointer shrink-0"
            >
              {resumeManualSaving ? "Saving..." : "Save & Activate"}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 pt-3 border-t border-white/[0.06]">
          <a
            href={profileForm.resume_url || "/PDF/Maharab_Hosen.pdf"}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white transition-colors cursor-pointer"
          >
            {renderIcon(FaExternalLinkAlt, { size: 10 })}
            <span>Preview Live Resume</span>
          </a>

          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(profileForm.resume_url || "/PDF/Maharab_Hosen.pdf");
              setResumeCopied(true);
              setTimeout(() => setResumeCopied(false), 2500);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            {renderIcon(resumeCopied ? FaCheck : FaCopy, { size: 10 })}
            <span>{resumeCopied ? "Copied!" : "Copy URL"}</span>
          </button>
        </div>
      </div>

      {/* Direct In-Page File Upload Card */}
      <div className="p-8 rounded-2xl border border-dashed border-white/[0.15] bg-[#111726]/40 hover:bg-[#111726]/60 transition-all space-y-3 text-center">
        <div className="p-3.5 w-fit mx-auto rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          {renderIcon(FaFilePdf, { size: 24 })}
        </div>
        <h3 className="text-sm font-bold text-white">Upload New Resume PDF</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto font-light">
          Select a new PDF from your computer. It will automatically upload to Supabase Storage and instantly become your live active resume.
        </p>

        <div className="pt-2">
          <label className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-xs font-semibold text-white shadow-lg shadow-indigo-500/20 cursor-pointer hover:opacity-95 active:scale-[0.98] transition-all">
            <span>Choose PDF File</span>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => handleFileUpload(e, "resume")}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
