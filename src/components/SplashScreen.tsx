import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SplashScreenProps {
  onComplete?: () => void;
  minDurationMs?: number;
}

const SPLASH_SESSION_KEY = "maharab_portfolio_splash_seen_v1";

const SYSTEM_LOGS = [
  "Initializing neural core & runtime...",
  "Calibrating full-stack & mobile engines...",
  "Optimizing graphics & UI shaders...",
  "Systems online. Welcome to Maharab's Portfolio.",
];

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete,
  minDurationMs = 120000,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    // Never show on admin page
    const hash = window.location.hash.toLowerCase();
    const path = window.location.pathname.toLowerCase();
    if (hash === "#admin" || path === "/admin") return false;

    // Check if user already saw splash in current browser session
    const alreadySeen = sessionStorage.getItem(SPLASH_SESSION_KEY);
    return alreadySeen !== "true";
  });

  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);

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

  // Handle keyboard ESC to skip
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

  // Lock scroll while splash is active
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

      // Advance logs based on progress percentage
      if (rawProgress < 30) setLogIndex(0);
      else if (rawProgress < 65) setLogIndex(1);
      else if (rawProgress < 90) setLogIndex(2);
      else setLogIndex(3);

      if (elapsed < minDurationMs) {
        animationFrameId = requestAnimationFrame(updateProgress);
      } else {
        setProgress(100);
        setTimeout(() => {
          handleFinish();
        }, 180);
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

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="splash-screen-overlay"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.05,
            filter: "blur(14px)",
            transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
          }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#030014] text-slate-100 select-none overflow-hidden"
          onClick={handleFinish}
          role="dialog"
          aria-label="Welcome Splash Screen"
        >
          {/* Subtle Cyber Grid Background */}
          <div
            className="absolute inset-0 opacity-[0.07] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(56, 189, 248, 0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(168, 85, 247, 0.4) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          {/* Ambient Glowing Nebula Blobs */}
          <div className="absolute w-[500px] h-[500px] rounded-full bg-cyan-500/15 blur-[120px] -top-20 -left-20 pointer-events-none animate-pulse" />
          <div className="absolute w-[500px] h-[500px] rounded-full bg-purple-600/15 blur-[140px] -bottom-20 -right-20 pointer-events-none animate-pulse" />
          <div className="absolute w-[360px] h-[360px] rounded-full bg-sky-500/10 blur-[100px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

          {/* Skip Button Top Right */}
          <motion.button
            type="button"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={(e) => {
              e.stopPropagation();
              handleFinish();
            }}
            className="absolute top-6 right-6 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-cyan-500/30 text-[11px] font-mono tracking-wider uppercase text-slate-400 hover:text-cyan-300 transition-all backdrop-blur-md cursor-pointer z-10 flex items-center gap-1.5 group"
          >
            <span>Skip</span>
            <span className="text-[9px] px-1 py-0.5 rounded bg-white/10 text-slate-300 group-hover:bg-cyan-500/20 group-hover:text-cyan-300">
              ESC
            </span>
          </motion.button>

          {/* Central Architectural Card */}
          <div className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center">
            {/* Holographic Logo Badge */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotate: -6 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative mb-6"
            >
              {/* Outer Counter-Rotating Orbiting Ring */}
              <div
                className="absolute -inset-3 rounded-2xl border border-cyan-400/20 animate-spin pointer-events-none"
                style={{ animationDuration: "10s" }}
              />
              <div
                className="absolute -inset-1.5 rounded-2xl border border-purple-500/20 animate-spin pointer-events-none"
                style={{ animationDuration: "7s", animationDirection: "reverse" }}
              />

              {/* Main Badge */}
              <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-cyan-500/30 backdrop-blur-2xl shadow-[0_0_35px_rgba(56,189,248,0.25)] flex items-center justify-center group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-transparent to-purple-500/10" />
                
                {/* Glowing Monogram */}
                <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(56,189,248,0.5)]">
                  &lt;MH /&gt;
                </span>

                {/* Corner Accents */}
                <div className="absolute top-1 left-1 w-1.5 h-1.5 border-t border-l border-cyan-400/60" />
                <div className="absolute top-1 right-1 w-1.5 h-1.5 border-t border-r border-cyan-400/60" />
                <div className="absolute bottom-1 left-1 w-1.5 h-1.5 border-b border-l border-cyan-400/60" />
                <div className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b border-r border-cyan-400/60" />
              </div>

              {/* Online indicator ping */}
              <div className="absolute -bottom-1 -right-1 flex items-center justify-center">
                <span className="animate-ping absolute inline-flex h-3.5 w-3.5 rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border-2 border-[#030014]" />
              </div>
            </motion.div>

            {/* Engineer Name & Title */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="mb-5"
            >
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white mb-1">
                Md. Maharab Hosen
              </h1>
              <p className="text-xs sm:text-sm font-medium tracking-wide bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Full-Stack Software Engineer &amp; Mobile Developer
              </p>
            </motion.div>

            {/* Futuristic Progress Bar & Counter */}
            <div className="w-64 sm:w-72 mb-4">
              {/* Top stats info */}
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1.5">
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  LOADING CORE
                </span>
                <span className="font-bold text-slate-200 tracking-wider">
                  {progress}%
                </span>
              </div>

              {/* Bar track */}
              <div className="h-1.5 w-full rounded-full bg-white/[0.06] border border-white/[0.08] overflow-hidden p-0.5 relative">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-sky-400 to-purple-500 relative"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: "linear" }}
                >
                  {/* Glowing beam tip */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#38bdf8]" />
                </motion.div>
              </div>
            </div>

            {/* Dynamic System Terminal Line */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="h-6 flex items-center justify-center"
            >
              <p className="text-[11px] font-mono text-slate-400 truncate max-w-xs flex items-center gap-1.5">
                <span className="text-purple-400">&gt;</span>
                <span className="text-slate-300">{SYSTEM_LOGS[logIndex]}</span>
              </p>
            </motion.div>
          </div>

          {/* Bottom Hint */}
          <div className="absolute bottom-6 text-[11px] font-mono text-slate-500/70 tracking-wider">
            Click anywhere or press [ESC] to proceed
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
