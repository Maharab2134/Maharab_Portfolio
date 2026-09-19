import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaChevronLeft,
  FaChevronRight,
  FaCommentDots,
} from "react-icons/fa";
import {
  ProjectReview,
  getBestProjectReviews,
  useTestimonialsConfig,
  getCachedReviewsSync,
} from "../lib/portfolioService";
import { getAllProjectsSync } from "../data/projectsData";
import { TestimonialCard } from "./TestimonialCard";

const renderIcon = (Icon: any, props: any = {}) => {
  return <Icon {...props} />;
};

interface TestimonialsProps {
  onSelectProjectReview?: (projectId: string, reviewAnchor?: string) => void;
}

export const Testimonials: React.FC<TestimonialsProps> = ({
  onSelectProjectReview,
}) => {
  const config = useTestimonialsConfig();
  const [reviews, setReviews] = useState<ProjectReview[]>(() => getCachedReviewsSync(12));
  const [loading, setLoading] = useState<boolean>(() => getCachedReviewsSync(12).length === 0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isPaused, setIsPaused] = useState(false);
  const allProjects = useMemo(() => getAllProjectsSync(), []);

  // Fetch top rated reviews
  const loadReviews = useCallback(async () => {
    try {
      const cached = getCachedReviewsSync(config.maxItems);
      if (cached.length > 0) {
        React.startTransition(() => {
          setReviews(cached);
          setLoading(false);
        });
      }
      const data = await getBestProjectReviews(config.minRating, config.maxItems);
      React.startTransition(() => {
        setReviews(data);
        setLoading(false);
      });
    } catch (e) {
      console.warn("Failed to load testimonials:", e);
      setLoading(false);
    }
  }, [config.minRating, config.maxItems]);

  useEffect(() => {
    loadReviews();

    const handleReviewsUpdate = () => {
      const cached = getCachedReviewsSync(config.maxItems);
      if (cached.length > 0) {
        React.startTransition(() => {
          setReviews(cached);
          setLoading(false);
        });
      }
    };

    window.addEventListener("portfolio_reviews_updated", handleReviewsUpdate);
    return () => {
      window.removeEventListener("portfolio_reviews_updated", handleReviewsUpdate);
    };
  }, [loadReviews, config.maxItems]);

  // Determine items per page based on window size
  const [itemsPerPage, setItemsPerPage] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (typeof window === "undefined") return;
      if (window.innerWidth < 640) {
        setItemsPerPage(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = Math.max(1, Math.ceil(reviews.length / itemsPerPage));

  // Ensure currentIndex stays within range when reviews or itemsPerPage change
  useEffect(() => {
    if (currentIndex >= totalPages) {
      setCurrentIndex(Math.max(0, totalPages - 1));
    }
  }, [totalPages, currentIndex]);

  // Autoplay functionality
  useEffect(() => {
    if (!config.autoplay || isPaused || reviews.length <= itemsPerPage) return;

    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % totalPages);
    }, 5500);

    return () => clearInterval(timer);
  }, [config.autoplay, isPaused, reviews.length, itemsPerPage, totalPages]);

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  // If section is disabled by admin, hide completely from user panel
  if (!config.enabled) {
    return null;
  }

  // If not loading and no reviews exist, hide section gracefully
  if (!loading && reviews.length === 0) {
    return null;
  }

  // Sliced reviews for current slide
  const startIndex = currentIndex * itemsPerPage;
  const visibleReviews = reviews.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section
      id="testimonials"
      className="relative py-10 sm:py-14 bg-[#030014] text-white overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Ambience & Lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none -z-0" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none -z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-2.5 backdrop-blur-md">
              {renderIcon(FaCommentDots, { className: "text-amber-400" })}
              <span>Client &amp; Peer Testimonials</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              What People Say About My Work
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-2xl font-light leading-relaxed">
              Authentic peer evaluations, engineering reviews, and client ratings from production systems and active applications.
            </p>
          </div>

          {/* Navigation Controls */}
          {reviews.length > itemsPerPage && (
            <div className="flex items-center gap-3 self-start md:self-end">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous testimonial"
                className="w-10 h-10 rounded-full flex items-center justify-center border border-white/10 bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-all shadow-md active:scale-95 cursor-pointer backdrop-blur-sm"
              >
                {renderIcon(FaChevronLeft, { size: 13 })}
              </button>
              <span className="text-xs font-mono text-slate-400">
                {currentIndex + 1} / {totalPages}
              </span>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next testimonial"
                className="w-10 h-10 rounded-full flex items-center justify-center border border-white/10 bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-all shadow-md active:scale-95 cursor-pointer backdrop-blur-sm"
              >
                {renderIcon(FaChevronRight, { size: 13 })}
              </button>
            </div>
          )}
        </div>

        {/* Testimonials Slider Grid */}
        <div className="relative min-h-[360px] sm:min-h-[320px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={{
                enter: (d: number) => ({ opacity: 0, x: d > 0 ? 48 : -48 }),
                center: { opacity: 1, x: 0 },
                exit:  (d: number) => ({ opacity: 0, x: d > 0 ? -48 : 48 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {visibleReviews.map((item) => {
                const matchedProject = allProjects.find(
                  (p) =>
                    p.id.toLowerCase() === item.project_id.toLowerCase() ||
                    p.title.toLowerCase() === item.project_id.toLowerCase()
                );

                const projectName = matchedProject
                  ? matchedProject.title
                  : item.project_id.toLowerCase() === "saytica"
                  ? "Saytica - Web Platform & Admin Dashboard"
                  : item.project_id;
                const projectSlug = matchedProject
                  ? matchedProject.id
                  : item.project_id || "saytica";
                const reviewAnchor =
                  projectSlug === "saytica"
                    ? "saytica-review"
                    : `${projectSlug}-review`;

                return (
                  <TestimonialCard
                    key={item.id}
                    reviewerName={item.name}
                    email={item.email}
                    rating={item.rating || 5}
                    projectName={projectName}
                    projectSlug={projectSlug}
                    reviewAnchor={reviewAnchor}
                    gender={item.gender}
                    onClick={(e) => {
                      if (onSelectProjectReview) {
                        e.preventDefault();
                        onSelectProjectReview(projectSlug, reviewAnchor);
                      }
                    }}
                  />
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dot Pagination Indicators */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex === idx
                    ? "w-8 bg-gradient-to-r from-purple-500 to-cyan-400"
                    : "w-2 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
