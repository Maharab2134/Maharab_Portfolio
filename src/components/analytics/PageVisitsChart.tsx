import React from "react";
import {
  FaCompass,
  FaShareAlt,
  FaFolderOpen,
  FaUserTie,
  FaEnvelope,
  FaGraduationCap,
  FaAward,
  FaCogs,
  FaLinkedin,
  FaGithub,
  FaGoogle,
  FaGlobe,
} from "react-icons/fa";
import { PageStat, ReferrerStat } from "../../lib/analyticsService";

interface PageVisitsChartProps {
  topPages: PageStat[];
  topReferrers: ReferrerStat[];
}

const renderIcon = (Icon: any, props: any = {}) => {
  const Comp: any = Icon;
  return <Comp {...props} />;
};

export const PageVisitsChart: React.FC<PageVisitsChartProps> = ({
  topPages,
  topReferrers,
}) => {
  const getSectionIcon = (path: string) => {
    switch (path) {
      case "projects":
        return renderIcon(FaFolderOpen, { className: "h-3.5 w-3.5 text-cyan-400" });
      case "about":
        return renderIcon(FaUserTie, { className: "h-3.5 w-3.5 text-purple-400" });
      case "skills":
        return renderIcon(FaCogs, { className: "h-3.5 w-3.5 text-emerald-400" });
      case "certificates":
        return renderIcon(FaAward, { className: "h-3.5 w-3.5 text-amber-400" });
      case "education":
        return renderIcon(FaGraduationCap, { className: "h-3.5 w-3.5 text-blue-400" });
      case "contact":
        return renderIcon(FaEnvelope, { className: "h-3.5 w-3.5 text-rose-400" });
      default:
        return renderIcon(FaCompass, { className: "h-3.5 w-3.5 text-slate-400" });
    }
  };

  const getReferrerIcon = (source: string) => {
    const s = source.toLowerCase();
    if (s.includes("linkedin")) return renderIcon(FaLinkedin, { className: "h-3.5 w-3.5 text-blue-400" });
    if (s.includes("github")) return renderIcon(FaGithub, { className: "h-3.5 w-3.5 text-slate-200" });
    if (s.includes("google")) return renderIcon(FaGoogle, { className: "h-3.5 w-3.5 text-red-400" });
    return renderIcon(FaGlobe, { className: "h-3.5 w-3.5 text-cyan-400" });
  };

  const maxPageVisits = Math.max(...topPages.map((p) => p.visits), 1);
  const maxRefVisits = Math.max(...topReferrers.map((r) => r.count), 1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Top Pages / Sections Card */}
      <div className="relative rounded-2xl border border-cyan-500/20 bg-gradient-to-b from-[#111726]/90 via-[#0e1422]/90 to-[#090d16] p-5 shadow-2xl backdrop-blur-xl">
        <div className="mb-4 flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
              {renderIcon(FaCompass, { className: "h-5 w-5" })}
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">Top Visited Sections</h3>
              <p className="text-xs text-slate-400">Content popularity & visitor engagement</p>
            </div>
          </div>
          <span className="rounded-lg bg-cyan-500/10 px-2.5 py-1 text-[11px] font-semibold text-cyan-300 border border-cyan-500/20">
            Portfolio Navigation
          </span>
        </div>

        <div className="space-y-3">
          {topPages.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">No page views recorded</div>
          ) : (
            topPages.map((page, idx) => {
              const barWidth = Math.round((page.visits / maxPageVisits) * 100);

              return (
                <div
                  key={page.path}
                  className="group relative overflow-hidden rounded-xl border border-white/5 bg-[#090d16]/60 p-2.5 transition-all duration-300 hover:border-cyan-500/40 hover:bg-[#0c1220]"
                >
                  <div
                    className="pointer-events-none absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500/10 via-cyan-500/5 to-transparent transition-all duration-500 group-hover:from-cyan-500/20"
                    style={{ width: `${barWidth}%` }}
                  />

                  <div className="relative flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 border border-white/10">
                        {getSectionIcon(page.path)}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-200 group-hover:text-white">
                            {page.title}
                          </span>
                          <span className="rounded bg-white/5 px-1.5 py-0.2 text-[10px] font-mono text-slate-400">
                            /{page.path}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-white group-hover:text-cyan-300">
                        {page.visits}
                        <span className="ml-1 text-[10px] text-slate-500 font-normal">views</span>
                      </span>
                      <span className="w-10 text-right text-xs font-semibold text-cyan-400">
                        {page.percentage}%
                      </span>
                    </div>
                  </div>

                  <div className="relative mt-2 h-1 w-full overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                      style={{ width: `${page.percentage}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Referral Sources Card */}
      <div className="relative rounded-2xl border border-purple-500/20 bg-gradient-to-b from-[#111726]/90 via-[#0e1422]/90 to-[#090d16] p-5 shadow-2xl backdrop-blur-xl">
        <div className="mb-4 flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.25)]">
              {renderIcon(FaShareAlt, { className: "h-5 w-5" })}
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">Referral Channels</h3>
              <p className="text-xs text-slate-400">Inbound traffic sources & campaigns</p>
            </div>
          </div>
          <span className="rounded-lg bg-purple-500/10 px-2.5 py-1 text-[11px] font-semibold text-purple-300 border border-purple-500/20">
            Source Origin
          </span>
        </div>

        <div className="space-y-3">
          {topReferrers.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">No referral channels captured</div>
          ) : (
            topReferrers.map((ref) => {
              const barWidth = Math.round((ref.count / maxRefVisits) * 100);

              return (
                <div
                  key={ref.source}
                  className="group relative overflow-hidden rounded-xl border border-white/5 bg-[#090d16]/60 p-2.5 transition-all duration-300 hover:border-purple-500/40 hover:bg-[#0c1220]"
                >
                  <div
                    className="pointer-events-none absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500/10 via-purple-500/5 to-transparent transition-all duration-500 group-hover:from-purple-500/20"
                    style={{ width: `${barWidth}%` }}
                  />

                  <div className="relative flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 border border-white/10">
                        {getReferrerIcon(ref.source)}
                      </span>
                      <span className="text-xs font-bold text-slate-200 group-hover:text-white">
                        {ref.source}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-white group-hover:text-purple-300">
                        {ref.count}
                        <span className="ml-1 text-[10px] text-slate-500 font-normal">hits</span>
                      </span>
                      <span className="w-10 text-right text-xs font-semibold text-purple-400">
                        {ref.percentage}%
                      </span>
                    </div>
                  </div>

                  <div className="relative mt-2 h-1 w-full overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                      style={{ width: `${ref.percentage}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
