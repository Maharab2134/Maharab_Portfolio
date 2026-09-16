import React from "react";
import {
  FaStar,
  FaCheckCircle,
  FaEnvelope,
  FaQuoteRight,
  FaUser,
  FaMale,
  FaFemale,
} from "react-icons/fa";
import { maskEmail } from "../lib/portfolioService";

export interface TestimonialCardProps {
  reviewerName: string;
  email?: string;
  rating?: number; // default 5
  projectName: string;
  projectSlug?: string; // e.g. "saytica"
  reviewAnchor?: string; // e.g. "saytica-review"
  gender?: "male" | "female" | "other" | "unspecified";
  avatar?: string;
  isPinned?: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  className?: string;
}

const renderIcon = (Icon: any, props: any = {}) => {
  return <Icon {...props} />;
};

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  reviewerName,
  email,
  rating = 5,
  projectName,
  projectSlug = "saytica",
  reviewAnchor,
  gender = "unspecified",
  avatar,
  isPinned = false,
  onClick,
  className = "",
}) => {
  const safeRating = Math.min(5, Math.max(1, Math.round(rating || 5)));
  const anchorId = reviewAnchor || `${projectSlug}-review`;
  const targetHref = `?project=${encodeURIComponent(projectSlug)}#${anchorId}`;
  const maskedEmail = email ? maskEmail(email) : "";

  const isFemale = gender === "female";
  const isMale = gender === "male";

  return (
    <a
      href={targetHref}
      onClick={onClick}
      aria-label={`View client review for ${projectName} by ${reviewerName}`}
      className={`group relative flex flex-col justify-between p-6 sm:p-7 rounded-3xl border ${
        isPinned
          ? "border-amber-400/50 hover:border-amber-300/70 shadow-[0_0_35px_-5px_rgba(245,158,11,0.3)] hover:shadow-[0_12px_45px_-5px_rgba(245,158,11,0.4)]"
          : "border-blue-500/25 hover:border-blue-400/50 shadow-[0_0_30px_-5px_rgba(30,58,138,0.3)] hover:shadow-[0_12px_40px_-5px_rgba(59,130,246,0.35)]"
      } bg-[#070d1e]/85 hover:bg-[#09122a]/95 backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-1.5 cursor-pointer overflow-hidden focus:outline-none focus:ring-2 focus:ring-cyan-400/50 select-none block text-decoration-none ${className}`}
    >
      {/* Pinned Featured Badge in Top-Left */}
      {isPinned && (
        <div className="absolute top-4 left-5 z-10 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.3)] backdrop-blur-md">
          {renderIcon(FaStar, { size: 9, className: "text-amber-400" })}
          <span>Top Review</span>
        </div>
      )}

      {/* Decorative Translucent Quotation Mark in Top-Right */}
      <div
        className="absolute top-4.5 right-5 text-purple-400/15 group-hover:text-purple-400/30 transition-colors pointer-events-none select-none"
        aria-hidden="true"
      >
        {renderIcon(FaQuoteRight, { size: 36 })}
      </div>

      {/* TOP / REVIEWER AREA - Centered */}
      <div className="flex flex-col items-center text-center pt-1">
        {/* Glowing Circular Avatar */}
        <div className="relative w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-600 shadow-[0_0_20px_rgba(59,130,246,0.45)] transition-transform duration-300 group-hover:scale-105 flex items-center justify-center">
          <div className="w-full h-full rounded-full bg-[#0a1128] flex items-center justify-center overflow-hidden">
            {avatar ? (
              <img
                src={avatar}
                alt={reviewerName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <span className="text-white">
                {renderIcon(
                  isFemale ? FaFemale : isMale ? FaMale : FaUser,
                  { size: 22, className: "text-white" }
                )}
              </span>
            )}
          </div>
        </div>

        {/* Reviewer Name + Verified Check */}
        <div className="flex items-center justify-center gap-1.5 mt-3">
          <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">
            {reviewerName}
          </h4>
          {renderIcon(FaCheckCircle, {
            size: 13,
            className: "text-cyan-400 shrink-0",
            title: "Verified Client Evaluation",
          })}
        </div>

        {/* Masked Email */}
        {maskedEmail ? (
          <p className="text-xs text-slate-400 font-mono flex items-center justify-center gap-1.5 mt-1">
            {renderIcon(FaEnvelope, { size: 10, className: "text-slate-400 shrink-0" })}
            <span className="truncate">{maskedEmail}</span>
          </p>
        ) : (
          <p className="text-[11px] text-slate-500 mt-1">Verified Client</p>
        )}

        {/* 2. RATING: ONLY 5 Gold Star Icons (No numeric '5.0') */}
        <div
          className="flex items-center justify-center gap-1.5 mt-3.5"
          aria-label={`${safeRating} out of 5 stars`}
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <span key={star} className="inline-flex">
              {renderIcon(FaStar, {
                size: 18,
                className:
                  star <= safeRating
                    ? "text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.65)]"
                    : "text-slate-700/60",
              })}
            </span>
          ))}
        </div>
      </div>

      {/* 3. DIVIDER: Subtle Horizontal Divider */}
      <div className="w-full border-t border-white/[0.08] my-4.5 sm:my-5" />

      {/* 4. EVALUATED FOR AREA */}
      <div className="flex items-center gap-3.5 text-left w-full pb-0.5">
        <div className="min-w-0 flex-1">
          <span className="block text-[10px] uppercase font-bold tracking-widest text-cyan-400/90 font-mono mb-0.5">
            EVALUATED FOR:-
          </span>
          <span className="block text-xs sm:text-sm font-semibold text-slate-100 group-hover:text-white transition-colors truncate">
            {projectName}
          </span>
        </div>
      </div>
    </a>
  );
};

export default TestimonialCard;
