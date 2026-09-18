import React from "react";
import {
  FaPlus,
  FaUser,
  FaCode,
  FaEnvelope,
  FaChartLine,
  FaEdit,
  FaFolder,
  FaChartBar,
  FaCheckCircle,
  FaDatabase,
} from "react-icons/fa";
import { renderIcon, AdminNavTab } from "../types";
import { PORTFOLIO_INFO } from "../../../data/portfolioData";
import { toProxyImageUrl } from "../../../data/projectsData";
import { AnalyticsSummary } from "../../../lib/analyticsService";

interface OverviewTabProps {
  session: any;
  profileForm: any;
  skillsList: any[];
  messagesList: any[];
  projectsList: any[];
  analyticsSummary: AnalyticsSummary | null;
  isSupabaseConfigured: boolean;
  setActiveTab: (tab: AdminNavTab) => void;
  handleOpenCreateProject: () => void;
  setSelectedMessage: (msg: any) => void;
  handleSyncAllProjectsToSupabase: () => Promise<void>;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  session,
  profileForm,
  skillsList,
  messagesList,
  projectsList,
  analyticsSummary,
  isSupabaseConfigured,
  setActiveTab,
  handleOpenCreateProject,
  setSelectedMessage,
  handleSyncAllProjectsToSupabase,
}) => {
  return (
    <div className="space-y-6">
      {/* Executive Welcome Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#111726] via-[#141c30] to-[#0c1220] border border-white/[0.08] relative overflow-hidden shadow-xl">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute -top-10 -right-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-mono font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Supabase Live Synchronized</span>
              </span>
              <span className="px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-400 text-[11px] font-mono">
                Session: {session.user?.email || "admin@maharab.dev"}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Welcome back, {profileForm.short_name || PORTFOLIO_INFO.shortName}!
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
              Your full-stack portfolio database is connected and reactive. You can update project case studies, customize your hero biography, publish new resume PDFs, and review incoming recruiter submissions in real time.
            </p>

            {/* Instant Action Chips */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("projects");
                  handleOpenCreateProject();
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:opacity-95 shadow-md shadow-indigo-500/20 active:scale-95 transition-all cursor-pointer"
              >
                {renderIcon(FaPlus, { size: 10 })}
                <span>New Project</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("profile")}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-all cursor-pointer"
              >
                {renderIcon(FaUser, { size: 11, className: "text-cyan-400" })}
                <span>Edit Bio &amp; Photo</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("skills")}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-all cursor-pointer"
              >
                {renderIcon(FaCode, { size: 11, className: "text-purple-400" })}
                <span>Manage Skills ({skillsList.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("messages")}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-all cursor-pointer"
              >
                {renderIcon(FaEnvelope, { size: 11, className: "text-emerald-400" })}
                <span>View Inquiries ({messagesList.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("analytics")}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-cyan-300 hover:text-white bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition-all cursor-pointer"
              >
                {renderIcon(FaChartLine, { size: 11, className: "text-cyan-400" })}
                <span>Visitor Analytics ({analyticsSummary?.totalVisits || 0})</span>
              </button>
            </div>
          </div>

          {/* Right Avatar Card */}
          <div className="shrink-0 flex items-center gap-4 p-3.5 rounded-2xl bg-black/25 border border-white/[0.08] backdrop-blur-md self-start lg:self-auto">
            <div className="w-16 h-16 rounded-2xl p-0.5 bg-gradient-to-br from-indigo-500 to-cyan-400 overflow-hidden shrink-0 shadow-lg shadow-indigo-500/20">
              <img
                src={toProxyImageUrl(profileForm.profile_image || PORTFOLIO_INFO.profileImage)}
                alt={profileForm.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/images/img.jpg";
                }}
                className="w-full h-full object-cover rounded-[14px]"
              />
            </div>
            <div className="pr-1 space-y-1">
              <p className="text-xs font-bold text-white leading-tight">
                {profileForm.name}
              </p>
              <p className="text-[11px] text-cyan-400 truncate max-w-[150px]">
                {profileForm.title}
              </p>
              <button
                type="button"
                onClick={() => setActiveTab("profile")}
                className="inline-flex items-center gap-1 text-[11px] text-indigo-300 hover:text-indigo-200 font-semibold cursor-pointer transition-colors"
              >
                <span>Change Avatar</span>
                {renderIcon(FaEdit, { size: 9 })}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Metric KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#111726]/60 hover:border-white/[0.15] transition-all shadow-sm group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Projects</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:scale-105 transition-transform">
              {renderIcon(FaFolder, { size: 14 })}
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-2">{projectsList.length}</p>
          <p className="text-[11px] text-indigo-400 font-mono mt-1 flex items-center gap-1">
            <span>Live in catalog</span>
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#111726]/60 hover:border-white/[0.15] transition-all shadow-sm group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Contact Inquiries</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-105 transition-transform">
              {renderIcon(FaEnvelope, { size: 14 })}
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-2">{messagesList.length}</p>
          <p className="text-[11px] text-emerald-400 font-mono mt-1 flex items-center gap-1">
            <span>Direct form submissions</span>
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#111726]/60 hover:border-white/[0.15] transition-all shadow-sm group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Experience</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:scale-105 transition-transform">
              {renderIcon(FaChartBar, { size: 14 })}
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-2">{profileForm.years_experience}</p>
          <p className="text-[11px] text-cyan-400 font-mono mt-1 flex items-center gap-1">
            <span>{profileForm.satisfaction_rate} Satisfaction</span>
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#111726]/60 hover:border-white/[0.15] transition-all shadow-sm group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Work Status</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-105 transition-transform">
              {renderIcon(FaCheckCircle, { size: 14 })}
            </div>
          </div>
          <p className="text-sm sm:text-base font-bold text-emerald-400 mt-3 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Available for Hire</span>
          </p>
          <p className="text-[11px] text-slate-500 font-mono mt-1">
            Homepage badge active
          </p>
        </div>
      </div>

      {/* Lower 2-Column Section: Recent Messages & Cloud Infrastructure Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Inquiries (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl border border-white/[0.08] bg-[#111726]/60 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                {renderIcon(FaEnvelope, { size: 14 })}
              </div>
              <h3 className="text-sm font-bold text-white">Recent Contact Submissions</h3>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab("messages")}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
            >
              View All ({messagesList.length}) ➔
            </button>
          </div>

          {messagesList.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-white/[0.02] border border-white/[0.05] text-slate-400 text-xs">
              No incoming messages recorded yet. Client submissions from the website contact section will appear here.
            </div>
          ) : (
            <div className="space-y-2.5">
              {messagesList.slice(0, 3).map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => {
                    setSelectedMessage(msg);
                    setActiveTab("messages");
                  }}
                  className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/15 transition-all cursor-pointer flex items-start justify-between gap-3"
                >
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-white truncate">{msg.name}</p>
                      <span className="text-[10px] text-slate-500 font-mono truncate">{msg.email}</span>
                    </div>
                    <p className="text-xs text-slate-300 font-medium truncate">{msg.subject || "(No Subject)"}</p>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{msg.message}</p>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono shrink-0">
                    {new Date(msg.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cloud Infrastructure & Quick Sync (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl border border-white/[0.08] bg-[#111726]/60 space-y-4 shadow-sm">
          <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.08]">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              {renderIcon(FaDatabase, { size: 14 })}
            </div>
            <h3 className="text-sm font-bold text-white">Cloud Infrastructure Status</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
              <span className="text-slate-400">Supabase DB</span>
              <span className="text-emerald-400 font-mono font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {isSupabaseConfigured ? "Connected" : "Pending Keys"}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
              <span className="text-slate-400">Storage Bucket</span>
              <span className="text-cyan-400 font-mono font-medium">portfolio-assets</span>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
              <span className="text-slate-400">Active Profile Sync</span>
              <span className="text-indigo-300 font-mono font-medium">2-Way Reactive</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              type="button"
              onClick={handleSyncAllProjectsToSupabase}
              className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-200 hover:text-white bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {renderIcon(FaDatabase, { size: 11, className: "text-amber-400" })}
              <span>Sync Project Catalog to Supabase</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("setup")}
              className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors cursor-pointer text-center"
            >
              Inspect SQL Schema &amp; Storage Policies ➔
            </button>
          </div>
        </div>
      </div>

      {/* Overview Visitor Traffic Pulse Snapshot Card */}
      <div className="p-6 rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-[#111726] via-[#10182b] to-[#0c1220] shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.3)] shrink-0">
            {renderIcon(FaChartLine, { className: "h-6 w-6" })}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-wide">
                Visitor Traffic &amp; Audience Telemetry
              </h3>
              <span className="flex items-center gap-1 rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-cyan-400 border border-cyan-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                Live
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {analyticsSummary?.totalVisits ?? 0} total hits recorded across {analyticsSummary?.uniqueVisitors ?? 0} verified unique visitors
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-4 text-xs font-mono pr-2 border-r border-white/10">
            <div>
              <span className="text-slate-400 text-[10px] block">Top Country</span>
              <span className="text-white font-bold">
                {analyticsSummary && analyticsSummary.totalVisits > 0
                  ? analyticsSummary.topLocations[0]?.country || "Global"
                  : "None"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Loyalty Rate</span>
              <span className="text-purple-400 font-bold">
                {analyticsSummary && analyticsSummary.totalVisits > 0
                  ? `${Math.round(
                      (analyticsSummary.returningVisitors / analyticsSummary.totalVisits) * 100
                    )}%`
                  : "0%"}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab("analytics")}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-black bg-gradient-to-r from-cyan-400 to-blue-500 hover:opacity-95 shadow-md shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <span>Open Analytics Studio</span>
            <span>➔</span>
          </button>
        </div>
      </div>
    </div>
  );
};
