import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PORTFOLIO_INFO } from "../data/portfolioData";
import { useLiveProfile } from "../lib/portfolioService";

interface SplashScreenProps {
  onComplete?: () => void;
  minDurationMs?: number;
}

const SPLASH_SESSION_KEY = "maharab_portfolio_splash_seen_v2";

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete,
  minDurationMs = 1200,
}) => {
  const profile = useLiveProfile();
  const [isVisible, setIsVisible] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const hash = window.location.hash.toLowerCase();
    const path = window.location.pathname.toLowerCase();
    if (hash === "#admin" || path === "/admin") return false;

    const alreadySeen = sessionStorage.getItem(SPLASH_SESSION_KEY);
    return alreadySeen !== "true";
  });

  const [progress, setProgress] = useState(0);

  const handleFinish = useCallback(() => {
    setIsVisible(false);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(SPLASH_SESSION_KEY, "true");
      document.body.style.overflow = "";
    }
    if (onComplete) {
      onComplete();
    }
  }, [onComplete]);

  // Handle ESC or Space to skip immediately
  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.code === "Space") {
        handleFinish();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isVisible, handleFinish]);

  // Prevent background scroll while splash is active
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isVisible]);

  // Smooth realistic progress progression
  useEffect(() => {
    if (!isVisible) return;

    const startTime = performance.now();
    let animationFrameId: number;

    const updateProgress = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const rawProgress = Math.min(100, Math.round((elapsed / minDurationMs) * 100));

      setProgress(rawProgress);

      if (elapsed < minDurationMs) {
        animationFrameId = requestAnimationFrame(updateProgress);
      } else {
        setProgress(100);
        setTimeout(() => {
          handleFinish();
        }, 160);
      }
    };

    animationFrameId = requestAnimationFrame(updateProgress);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isVisible, minDurationMs, handleFinish]);

  if (!isVisible) return null;

  const profileImg = profile.profileImage || PORTFOLIO_INFO.profileImage;
  const name = profile.name || PORTFOLIO_INFO.name;
  const title = profile.title || "Full-Stack Software Engineer & Mobile Developer";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="splash-screen-overlay"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.03,
            filter: "blur(12px)",
            transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
          }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#030014] text-slate-100 select-none overflow-hidden"
          onClick={handleFinish}
          role="dialog"
          aria-label="Welcome Splash Screen"
        >
          {/* Subtle Ambient Radial Lighting */}
          <div className="absolute w-[600px] h-[600px] rounded-full bg-cyan-500/10 blur-[140px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          <div className="absolute w-[450px] h-[450px] rounded-full bg-purple-600/10 blur-[120px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

          {/* Minimalist Top Right Skip Button */}
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            onClick={(e) => {
              e.stopPropagation();
              handleFinish();
            }}
            className="absolute top-6 right-6 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-cyan-500/30 text-[11px] font-mono tracking-wider uppercase text-slate-400 hover:text-cyan-300 transition-all backdrop-blur-md cursor-pointer z-10 flex items-center gap-1.5"
          >
            <span>Skip</span>
            <span className="text-[9px] px-1 py-0.5 rounded bg-white/10 text-slate-300">
              ESC
            </span>
          </motion.button>

          {/* Luxury Clean Centerpiece */}
          <div className="relative z-10 flex flex-col items-center px-6 text-center max-w-sm">
            {/* Elegant Circular Avatar with Dual Glowing Aura */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="relative mb-6"
            >
              {/* Outer Subtle Spinning Ring */}
              <div
                className="absolute -inset-2.5 rounded-full border border-cyan-400/25 animate-spin pointer-events-none"
                style={{ animationDuration: "12s" }}
              />
              <div
                className="absolute -inset-1 rounded-full border border-purple-500/30 animate-spin pointer-events-none"
                style={{ animationDuration: "8s", animationDirection: "reverse" }}
              />

              {/* Avatar Container */}
              <div className="relative w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500 shadow-[0_0_35px_rgba(168,85,247,0.35)] overflow-hidden">
                <img
                  src={profileImg}
                  alt={name}
                  className="w-full h-full rounded-full object-cover object-top bg-[#0a0520]"
                  onError={(e) => {
                    // Fallback to geometric monogram if image fails
                    e.currentTarget.style.display = "none";
                  }}
                />
                {/* Fallback Monogram when image not available */}
                <div className="w-full h-full rounded-full bg-[#0a0520] flex items-center justify-center font-bold text-lg text-cyan-300 tracking-wider">
                  MH
                </div>
              </div>

              {/* Online pulse dot */}
              <div className="absolute bottom-0 right-0 flex items-center justify-center">
                <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 border-2 border-[#030014]" />
              </div>
            </motion.div>

            {/* Typography */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="mb-5"
            >
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-1.5 whitespace-nowrap">
                {name}
              </h1>
              <p className="text-xs sm:text-sm font-medium tracking-wide text-cyan-400/90 whitespace-nowrap">
                {title}
              </p>
            </motion.div>

            {/* Ultra-Sleek Laser Progress Line */}
            <div className="w-60 sm:w-64 mb-3">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
                <span className="text-slate-400 tracking-wider">INITIALIZING</span>
                <span className="font-semibold text-cyan-400 tracking-wider">
                  {progress}%
                </span>
              </div>

              {/* 2px Laser Track */}
              <div className="h-1 w-full rounded-full bg-white/[0.08] overflow-hidden relative">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-purple-500 relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#38bdf8]" />
                </motion.div>
              </div>
            </div>

            {/* Subtle Micro-Status */}
            <p className="text-[11px] font-mono text-slate-500 tracking-wider">
              {progress < 100 ? "Loading portfolio systems..." : "Ready."}
            </p>
          </div>

          {/* Bottom Hint */}
          <div className="absolute bottom-6 text-[10px] font-mono text-slate-600 tracking-wider uppercase">
            Click anywhere to skip
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
