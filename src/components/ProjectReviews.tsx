import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaStar,
  FaHeart,
  FaCheckCircle,
  FaPaperPlane,
  FaFemale,
  FaMale,
  FaUser,
  FaQuoteLeft,
  FaLock,
  FaTimes,
} from "react-icons/fa";
import {
  ProjectReview,
  getProjectReviews,
  submitProjectReview,
  likeProjectReview,
  detectGenderFromName,
  maskEmail,
} from "../lib/portfolioService";

interface ProjectReviewsProps {
  projectId: string;
  projectTitle: string;
}

const renderIcon = (Icon: any, props: any = {}) => {
  return <Icon {...props} />;
};

const RATING_LABELS: { [key: number]: string } = {
  1: "Poor experience",
  2: "Fair / Needs improvement",
  3: "Good & functional",
  4: "Very good architecture",
  5: "Exceptional / Outstanding!",
};

// Global helper to trigger review modal from anywhere (e.g. hero banner, sidebar)
export const openProjectReviewModal = (projectId?: string) => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("portfolio_open_review_modal", { detail: { projectId } })
    );
  }
};

export const ProjectReviews: React.FC<ProjectReviewsProps> = ({
  projectId,
  projectTitle,
}) => {
  const [reviews, setReviews] = useState<ProjectReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState("");
  const [genderOverride, setGenderOverride] = useState<"auto" | "male" | "female">("auto");

  // Dynamic gender detection based on name
  const detectedGender = useMemo(() => {
    return detectGenderFromName(name);
  }, [name]);

  const effectiveGender = genderOverride === "auto" ? detectedGender : genderOverride;

  const fetchReviews = useCallback(async () => {
    try {
      const data = await getProjectReviews(projectId);
      setReviews(data);
    } catch (e) {
      console.warn("Error fetching reviews:", e);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchReviews();

    const handleUpdate = () => {
      fetchReviews();
    };

    const handleOpenModal = (e: any) => {
      const targetId = e.detail?.projectId;
      if (!targetId || targetId === projectId) {
        setShowModal(true);
      }
    };

    window.addEventListener("portfolio_reviews_updated", handleUpdate);
    window.addEventListener("portfolio_open_review_modal", handleOpenModal);

    return () => {
      window.removeEventListener("portfolio_reviews_updated", handleUpdate);
      window.removeEventListener("portfolio_open_review_modal", handleOpenModal);
    };
  }, [fetchReviews, projectId]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showModal]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showModal) {
        setShowModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showModal]);

  // Review statistics
  const stats = useMemo(() => {
    if (reviews.length === 0) return { avg: 0, count: 0, breakdown: [0, 0, 0, 0, 0] };
    const sum = reviews.reduce((acc, r) => acc + (r.rating || 5), 0);
    const avg = sum / reviews.length;

    const breakdown = [0, 0, 0, 0, 0];
    reviews.forEach((r) => {
      const starIndex = Math.min(5, Math.max(1, r.rating || 5)) - 1;
      breakdown[starIndex]++;
    });

    return {
      avg: Number(avg.toFixed(1)),
      count: reviews.length,
      breakdown,
    };
  }, [reviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      alert("Please provide your Name and Review message.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await submitProjectReview({
        project_id: projectId,
        name: name.trim(),
        email: email.trim() || "anonymous.reviewer@portfolio.lead",
        gender: effectiveGender,
        rating,
        message: message.trim(),
      });

      if (res.success) {
        setSubmitSuccess("Thank you! Your verified review has been published.");
        setName("");
        setEmail("");
        setMessage("");
        setRating(5);
        setGenderOverride("auto");
        setShowModal(false);
        fetchReviews();
        setTimeout(() => setSubmitSuccess(null), 6000);
      }
    } catch (err: any) {
      alert("Failed to submit review: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (id: string) => {
    const res = await likeProjectReview(id);
    if (res !== -1) {
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, likes: (r.likes || 0) + 1 } : r))
      );
    }
  };

  return (
    <section
      id="project-reviews-section"
      className="mt-12 pt-8 border-t border-white/[0.08] scroll-mt-24"
    >
      {/* Header & Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              {stats.count} {stats.count === 1 ? "Review" : "Reviews"}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Real feedback and technical evaluation for <span className="text-white font-medium">{projectTitle}</span>
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 hover:shadow-lg hover:shadow-purple-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          {renderIcon(FaStar, { className: "text-amber-300" })}
          <span>Write a Review</span>
        </button>
      </div>

      {submitSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm flex items-center gap-2 shadow-lg"
        >
          {renderIcon(FaCheckCircle, { className: "text-emerald-400 flex-shrink-0" })}
          <span>{submitSuccess}</span>
        </motion.div>
      )}

      {/* Ratings Scorecard & Breakdown */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-xl mb-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center shadow-lg">
        {/* Score Left Column */}
        <div className="md:col-span-4 text-center md:text-left md:border-r border-white/[0.08] md:pr-6">
          <div className="text-4xl sm:text-5xl font-black text-white tracking-tight flex items-center justify-center md:justify-start gap-2">
            <span>{stats.count > 0 ? stats.avg.toFixed(1) : "0.0"}</span>
            <span className="text-2xl text-amber-400 font-normal">★</span>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-1 my-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <span
                key={s}
                className={`text-sm ${
                  stats.count > 0 && s <= Math.round(stats.avg)
                    ? "text-amber-400"
                    : "text-slate-600"
                }`}
              >
                ★
              </span>
            ))}
          </div>
          <p className="text-xs text-slate-400">
            {stats.count > 0 ? (
              <>
                Based on{" "}
                <span className="text-white font-medium">
                  {stats.count} verified {stats.count === 1 ? "evaluation" : "evaluations"}
                </span>
              </>
            ) : (
              "No reviews submitted yet"
            )}
          </p>
        </div>

        {/* Breakdown Bars Right Column */}
        <div className="md:col-span-8 space-y-2">
          {[5, 4, 3, 2, 1].map((starVal) => {
            const count = stats.breakdown[starVal - 1];
            const pct = stats.count > 0 ? (count / stats.count) * 100 : 0;
            return (
              <div key={starVal} className="flex items-center gap-3 text-xs">
                <span className="w-12 text-slate-400 font-mono text-right flex-shrink-0">
                  {starVal} star
                </span>
                <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-amber-400 transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-8 text-[11px] text-slate-500 font-mono text-right flex-shrink-0">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            Loading reviews...
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-10 sm:p-12 text-center rounded-2xl border border-dashed border-white/10 bg-white/[0.01] text-slate-400 space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-white/5 flex items-center justify-center text-xl text-amber-400/80 border border-white/10">
              💬
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-300">
                No reviews yet for this project
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Be the first client or peer to share an evaluation!
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 hover:brightness-110 active:scale-95 transition-all shadow-md cursor-pointer mt-2"
            >
              {renderIcon(FaStar, { className: "text-amber-300" })}
              <span>Write the First Review</span>
            </button>
          </div>
        ) : (
          reviews.map((r) => {
            const isFemale = r.gender === "female";
            const isMale = r.gender === "male";

            const maskedEmail = maskEmail(r.email);

            return (
              <div
                key={r.id}
                className="p-5 sm:p-6 rounded-2xl border border-white/[0.08] bg-[#0c111e]/80 hover:bg-[#0e1424] backdrop-blur-sm transition-all shadow-md group"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  {/* User Profile Header */}
                  <div className="flex items-center gap-3.5">
                    {/* Gender-tailored Avatar */}
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg text-lg font-bold border transition-transform group-hover:scale-105 ${
                        isFemale
                          ? "bg-gradient-to-tr from-pink-500/20 via-rose-500/20 to-purple-500/30 text-pink-300 border-pink-500/30"
                          : isMale
                          ? "bg-gradient-to-tr from-blue-500/20 via-indigo-500/20 to-cyan-500/30 text-cyan-300 border-cyan-500/30"
                          : "bg-gradient-to-tr from-purple-500/20 to-slate-700/30 text-purple-300 border-purple-500/30"
                      }`}
                    >
                      {renderIcon(isFemale ? FaFemale : isMale ? FaMale : FaUser, { size: 18 })}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-white tracking-tight">
                          {r.name}
                        </h4>
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-purple-300 bg-purple-500/15 px-2 py-0.5 rounded-full border border-purple-500/25">
                          {renderIcon(FaCheckCircle, { size: 9, className: "text-purple-400" })}
                          <span>Verified Lead</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5 font-mono">
                        {maskedEmail && <span>{maskedEmail}</span>}
                        {maskedEmail && <span>•</span>}
                        <span>{new Date(r.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating Stars in Header */}
                  <div className="inline-flex items-center gap-1.5 bg-white/[0.03] px-3 py-1.5 rounded-xl border border-white/[0.06] self-start">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <span key={s} className="inline-flex">
                          {renderIcon(FaStar, {
                            size: 11,
                            className:
                              s <= (r.rating || 5)
                                ? "text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.4)]"
                                : "text-slate-700",
                          })}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs font-bold text-amber-300 font-mono leading-none translate-y-[0.5px]">
                      {(r.rating || 5).toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* Review Message Body */}
                <div className="mt-4 pt-3 border-t border-white/[0.04] relative">
                  <div className="absolute top-2.5 left-0 text-white/[0.04] pointer-events-none">
                    {renderIcon(FaQuoteLeft, { size: 28 })}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-2 relative z-10 font-light">
                    {r.message}
                  </p>
                </div>

                {/* Footer Action: Helpful Like Counter */}
                <div className="mt-3.5 pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => handleLike(r.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/[0.03] hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 border border-white/5 hover:border-rose-500/20 text-xs font-semibold transition-all cursor-pointer"
                  >
                    {renderIcon(FaHeart, { size: 10, className: (r.likes || 0) > 0 ? "text-rose-400" : "" })}
                    <span>Helpful</span>
                    {(r.likes || 0) > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full bg-rose-500/20 text-[10px] text-rose-300 font-mono">
                        {r.likes}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ==================================================================== */}
      {/* REVIEW SUBMISSION MODAL DIALOG */}
      {/* ==================================================================== */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Dialog Window */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-xl my-8 p-6 sm:p-8 rounded-3xl bg-[#0c111e] border border-white/15 shadow-2xl shadow-black/80 z-10 space-y-5 overflow-hidden text-left"
            >
              {/* Modal Close Button */}
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Close"
              >
                {renderIcon(FaTimes, { size: 16 })}
              </button>

              <div className="pr-8 pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
                  {renderIcon(FaStar, { size: 12 })}
                  <span>Client &amp; Peer Evaluation</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Review &ldquo;{projectTitle}&rdquo;
                </h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Star Rating Selector */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Overall Rating *
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 text-2xl sm:text-3xl transition-transform hover:scale-125 focus:outline-none"
                      >
                        {renderIcon(FaStar, {
                          className:
                            (hoverRating || rating) >= star
                              ? "text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]"
                              : "text-slate-700",
                        })}
                      </button>
                    ))}
                    <span className="ml-3 text-xs sm:text-sm font-semibold text-amber-300">
                      {RATING_LABELS[hoverRating || rating]}
                    </span>
                  </div>
                </div>

                {/* Name and Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ayesha Rahman / Tanvir Ahmed"
                      className="w-full px-4 py-2.5 text-sm text-white bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all placeholder:text-slate-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center justify-between">
                      <span>Your Email</span>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1 font-normal lowercase">
                        {renderIcon(FaLock, { size: 9 })} kept private
                      </span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="client@company.com"
                      className="w-full px-4 py-2.5 text-sm text-white bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all placeholder:text-slate-500"
                    />
                  </div>
                </div>

                {/* Smart Gender Detection Real-time Display */}
                {name.trim().length > 1 && (
                  <div className="p-3.5 rounded-xl bg-[#111726] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-sm ${
                          effectiveGender === "female"
                            ? "bg-pink-500/20 text-pink-400 border border-pink-500/30"
                            : effectiveGender === "male"
                            ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                            : "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                        }`}
                      >
                        {renderIcon(
                          effectiveGender === "female"
                            ? FaFemale
                            : effectiveGender === "male"
                            ? FaMale
                            : FaUser,
                          { size: 14 }
                        )}
                      </div>
                      <div>
                        <span className="text-slate-400">Profile Detected: </span>
                        <span
                          className={`font-semibold capitalize ${
                            effectiveGender === "female"
                              ? "text-pink-300"
                              : effectiveGender === "male"
                              ? "text-blue-300"
                              : "text-purple-300"
                          }`}
                        >
                          {effectiveGender === "female"
                            ? "Female 👩"
                            : effectiveGender === "male"
                            ? "Male 👨"
                            : "Neutral / Professional 👤"}
                        </span>
                        <span className="text-[10px] text-slate-500 ml-1">
                          (based on name "{name.trim()}")
                        </span>
                      </div>
                    </div>

                    {/* Manual Gender Override (Icons only, no text) */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-slate-500 mr-0.5">Gender:</span>
                      <button
                        type="button"
                        title="Auto-detect based on name"
                        onClick={() => setGenderOverride("auto")}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold border transition-all cursor-pointer ${
                          genderOverride === "auto"
                            ? "bg-purple-500/25 border-purple-500/50 text-purple-300 shadow-sm ring-1 ring-purple-400/40"
                            : "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        ⚡
                      </button>
                      <button
                        type="button"
                        title="Female"
                        onClick={() => setGenderOverride("female")}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm border transition-all cursor-pointer ${
                          genderOverride === "female"
                            ? "bg-pink-500/25 border-pink-500/50 text-pink-300 shadow-sm ring-1 ring-pink-400/40 scale-105"
                            : "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        👩
                      </button>
                      <button
                        type="button"
                        title="Male"
                        onClick={() => setGenderOverride("male")}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm border transition-all cursor-pointer ${
                          genderOverride === "male"
                            ? "bg-blue-500/25 border-blue-500/50 text-blue-300 shadow-sm ring-1 ring-blue-400/40 scale-105"
                            : "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        👨
                      </button>
                    </div>
                  </div>
                )}

                {/* Review Message */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Review &amp; Feedback *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share your thoughts on the project architecture, design, code quality, or business impact..."
                    className="w-full px-4 py-2.5 text-sm text-white bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all placeholder:text-slate-500 resize-none"
                  />
                </div>

                {/* Modal Buttons */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 hover:shadow-lg hover:shadow-purple-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {renderIcon(FaPaperPlane, { size: 12 })}
                    <span>{submitting ? "Publishing..." : "Submit Review"}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ProjectReviews;
