import React, { useState } from "react";
import {
  FaSyncAlt,
  FaSearch,
  FaFemale,
  FaMale,
  FaUser,
  FaAngleDoubleUp,
  FaArrowUp,
  FaArrowDown,
  FaTrash,
} from "react-icons/fa";
import { renderIcon } from "../types";
import { ProjectReview } from "../../../lib/portfolioService";

interface ReviewsTabProps {
  reviewsList: ProjectReview[];
  fetchReviews: () => void;
  reviewsLoading: boolean;
  testimonialsConfig: { enabled: boolean };
  testimonialsToggling: boolean;
  handleToggleTestimonials: (enabled: boolean) => void;
  handleMoveReview: (id: string, direction: "up" | "down") => void;
  handleMoveReviewToTop: (id: string) => void;
  handleDeleteReview: (id: string) => void;
  reviewReordering: boolean;
  projectsList: any[];
}

export const ReviewsTab: React.FC<ReviewsTabProps> = ({
  reviewsList,
  fetchReviews,
  reviewsLoading,
  testimonialsConfig,
  testimonialsToggling,
  handleToggleTestimonials,
  handleMoveReview,
  handleMoveReviewToTop,
  handleDeleteReview,
  reviewReordering,
  projectsList,
}) => {
  const [reviewSearchQuery, setReviewSearchQuery] = useState("");
  const [selectedReviewProjectFilter, setSelectedReviewProjectFilter] = useState("all");

  const filtered = reviewsList.filter((r) => {
    const matchesProject =
      selectedReviewProjectFilter === "all" || r.project_id === selectedReviewProjectFilter;
    const q = reviewSearchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      (r.name && r.name.toLowerCase().includes(q)) ||
      (r.email && r.email.toLowerCase().includes(q)) ||
      (r.message && r.message.toLowerCase().includes(q));
    return matchesProject && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Project Reviews &amp; Evaluations
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {reviewsList.length} Total
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage real-time visitor ratings and reviews submitted across all project detail pages
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchReviews}
            disabled={reviewsLoading}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
          >
            {renderIcon(FaSyncAlt, { size: 10, className: reviewsLoading ? "animate-spin" : "" })}
            <span>{reviewsLoading ? "Refreshing..." : "Refresh Reviews"}</span>
          </button>
        </div>
      </div>

      {/* Homepage Testimonials Slider Visibility Controller */}
      <div className="p-4 sm:p-5 rounded-2xl border border-white/[0.08] bg-gradient-to-r from-[#111726]/90 via-purple-950/25 to-[#111726]/90 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-start sm:items-center gap-3.5">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 border transition-all ${
              testimonialsConfig.enabled
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                : "bg-rose-500/20 text-rose-300 border-rose-500/30"
            }`}
          >
            💬
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-bold text-white">Homepage Testimonial Slider</h3>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                  testimonialsConfig.enabled
                    ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                    : "bg-rose-500/15 text-rose-300 border-rose-500/30"
                }`}
              >
                {testimonialsConfig.enabled ? "● Active (Visible on User Panel)" : "○ Inactive (Hidden on User Panel)"}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-light leading-relaxed max-w-xl">
              Showcase top reviews with reviewer name, gender icon, mail, and rating in an interactive slider on the homepage.
              Switch to <strong>Inactive</strong> to instantly hide this section from visitors.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-center flex-shrink-0">
          <button
            type="button"
            disabled={testimonialsToggling}
            onClick={() => handleToggleTestimonials(!testimonialsConfig.enabled)}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl border transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-2 ${
              testimonialsConfig.enabled
                ? "bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border-rose-500/40 hover:border-rose-500/60"
                : "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-500/40 hover:border-emerald-500/60 shadow-emerald-500/10"
            }`}
          >
            <span>
              {testimonialsToggling
                ? "Updating..."
                : testimonialsConfig.enabled
                ? "Make Inactive (Hide Section)"
                : "Make Active (Show Section)"}
            </span>
          </button>
        </div>
      </div>

      {/* Reordering Instructions Banner */}
      <div className="px-4 py-3 rounded-xl border border-cyan-500/20 bg-cyan-500/[0.04] text-xs text-slate-300 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="text-cyan-400 font-bold text-sm">💡</span>
          <span>
            <strong>Homepage Slider Ordering:</strong> The testimonials at the top of this list appear first on the Homepage slider.
            Use the <strong>Up (▲)</strong>, <strong>Down (▼)</strong>, or <strong>Top (⇈)</strong> buttons on any review to adjust the display order.
          </span>
        </div>
        {reviewReordering && (
          <span className="text-[11px] text-cyan-400 font-mono animate-pulse flex-shrink-0">
            Saving order...
          </span>
        )}
      </div>

      {/* Filters & Search Row */}
      <div className="p-4 rounded-2xl border border-white/[0.08] bg-[#111726]/60 backdrop-blur-md flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
            {renderIcon(FaSearch, { size: 12 })}
          </div>
          <input
            type="text"
            value={reviewSearchQuery}
            onChange={(e) => setReviewSearchQuery(e.target.value)}
            placeholder="Search reviews by name, email, or message..."
            className="w-full pl-9 pr-4 py-2 text-xs text-white bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500/50 placeholder:text-slate-500"
          />
        </div>

        {/* Project Filter Selector */}
        <div className="w-full sm:w-64">
          <select
            value={selectedReviewProjectFilter}
            onChange={(e) => setSelectedReviewProjectFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs text-white bg-[#0c111e] border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500/50 cursor-pointer"
          >
            <option value="all">All Projects ({reviewsList.length})</option>
            {projectsList.map((p) => {
              const count = reviewsList.filter((r) => r.project_id === (p.id || p.project_id)).length;
              return (
                <option key={p.id || p.project_id} value={p.id || p.project_id}>
                  {p.title} ({count})
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Filtered Reviews List */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-white/[0.08] bg-[#111726]/50 text-slate-400 text-xs">
          No matching reviews found. Reviews submitted from the Project Details page will automatically appear here.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((r) => {
            const isFemale = r.gender === "female";
            const isMale = r.gender === "male";
            const projectMatch = projectsList.find((p) => (p.id || p.project_id) === r.project_id);
            const globalIndex = reviewsList.findIndex((item) => item.id === r.id);
            const isFirst = globalIndex <= 0;
            const isLast = globalIndex === reviewsList.length - 1;
            const isTopShowcase = globalIndex < 3;

            return (
              <div
                key={r.id}
                className={`p-5 rounded-2xl border ${
                  isTopShowcase
                    ? "border-cyan-500/35 bg-[#12192d]/90 shadow-[0_0_20px_rgba(6,182,212,0.1)]"
                    : "border-white/[0.08] bg-[#111726]/75 hover:bg-[#111726]"
                } backdrop-blur-sm transition-all space-y-3.5 shadow-lg group relative`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 border ${
                        isFemale
                          ? "bg-pink-500/20 text-pink-300 border-pink-500/30"
                          : isMale
                          ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                          : "bg-purple-500/20 text-purple-300 border-purple-500/30"
                      }`}
                    >
                      {renderIcon(isFemale ? FaFemale : isMale ? FaMale : FaUser, { size: 16 })}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-xs font-bold text-white">{r.name}</h4>
                        <span
                          className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border ${
                            isFemale
                              ? "bg-pink-500/15 text-pink-300 border-pink-500/30"
                              : isMale
                              ? "bg-blue-500/15 text-blue-300 border-blue-500/30"
                              : "bg-white/5 text-slate-400 border-white/10"
                          }`}
                        >
                          {isFemale ? "Female 👩" : isMale ? "Male 👨" : "Reviewer 👤"}
                        </span>
                      </div>
                      <p className="text-[11px] text-cyan-400 truncate font-mono mt-0.5">
                        {r.email || "No email"}
                      </p>
                    </div>
                  </div>

                  {/* Actions: Priority Rank Badge, Move to Top, Move Up, Move Down, Delete */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span
                      className={`px-2 py-1 text-[10px] font-mono font-bold rounded-lg border ${
                        isTopShowcase
                          ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm"
                          : "bg-white/5 text-slate-400 border-white/10"
                      }`}
                      title={`Rank #${globalIndex + 1} in Homepage Testimonials`}
                    >
                      #{globalIndex + 1}
                    </span>

                    {/* Move to Top */}
                    <button
                      type="button"
                      disabled={isFirst || reviewReordering}
                      onClick={() => handleMoveReviewToTop(r.id)}
                      className={`p-1.5 rounded-lg border text-xs transition-all ${
                        isFirst
                          ? "opacity-30 cursor-not-allowed border-white/5 text-slate-600"
                          : "border-white/10 bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 cursor-pointer active:scale-95"
                      }`}
                      title="Move directly to #1 Top (First on Homepage)"
                    >
                      {renderIcon(FaAngleDoubleUp, { size: 11 })}
                    </button>

                    {/* Move Up */}
                    <button
                      type="button"
                      disabled={isFirst || reviewReordering}
                      onClick={() => handleMoveReview(r.id, "up")}
                      className={`p-1.5 rounded-lg border text-xs transition-all ${
                        isFirst
                          ? "opacity-30 cursor-not-allowed border-white/5 text-slate-600"
                          : "border-white/10 bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white cursor-pointer active:scale-95"
                      }`}
                      title="Move Up (Show earlier on Homepage slider)"
                    >
                      {renderIcon(FaArrowUp, { size: 10 })}
                    </button>

                    {/* Move Down */}
                    <button
                      type="button"
                      disabled={isLast || reviewReordering}
                      onClick={() => handleMoveReview(r.id, "down")}
                      className={`p-1.5 rounded-lg border text-xs transition-all ${
                        isLast
                          ? "opacity-30 cursor-not-allowed border-white/5 text-slate-600"
                          : "border-white/10 bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white cursor-pointer active:scale-95"
                      }`}
                      title="Move Down (Show later on Homepage slider)"
                    >
                      {renderIcon(FaArrowDown, { size: 10 })}
                    </button>

                    {/* Delete Review */}
                    <button
                      type="button"
                      onClick={() => handleDeleteReview(r.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Delete this review"
                    >
                      {renderIcon(FaTrash, { size: 12 })}
                    </button>
                  </div>
                </div>

                {/* Target Project and Rating */}
                <div className="flex items-center justify-between gap-2 text-xs pt-1 border-t border-white/[0.04]">
                  <span className="text-[11px] text-slate-400 truncate font-medium">
                    Project: <strong className="text-white">{projectMatch ? projectMatch.title : r.project_id}</strong>
                  </span>

                  <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20 flex-shrink-0">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span
                        key={s}
                        className={`text-[10px] ${
                          s <= (r.rating || 5) ? "text-amber-400" : "text-slate-700"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                    <span className="text-[10px] font-bold text-amber-300 font-mono ml-0.5">
                      {r.rating || 5}.0
                    </span>
                  </div>
                </div>

                {/* Message Body */}
                <p className="text-xs text-slate-300 leading-relaxed font-light p-3 rounded-xl bg-[#0c101d] border border-white/[0.04]">
                  "{r.message}"
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>Received: {new Date(r.created_at).toLocaleString()}</span>
                  <span>{r.likes || 0} Helpful Likes</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
