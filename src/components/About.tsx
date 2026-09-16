import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaDownload,
  FaPlay,
  FaTimes,
  FaEnvelope,
} from "react-icons/fa";
import { PORTFOLIO_INFO } from "../data/portfolioData";
import { toProxyImageUrl } from "../data/projectsData";
import { useLiveProfile, getVideoEmbedUrl } from "../lib/portfolioService";

const renderIcon = (Icon: any, props: any = {}) => {
  return <Icon {...props} />;
};

const AVATAR_FALLBACK = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 480" width="400" height="480">
    <rect width="100%" height="100%" fill="#0f172a"/>
    <circle cx="200" cy="180" r="70" fill="#1e293b"/>
    <text x="200" y="380" font-family="sans-serif" font-size="20" font-weight="700" fill="#ffffff" text-anchor="middle">Md. Maharab Hosen</text>
    <text x="200" y="410" font-family="sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">Software Developer</text>
  </svg>
`)}`;

const About: React.FC = () => {
  const profile = useLiveProfile();
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState(toProxyImageUrl(profile.profileImage));

  useEffect(() => {
    if (profile.profileImage) {
      setImgSrc(toProxyImageUrl(profile.profileImage));
    }
  }, [profile.profileImage]);

  const rawVideoUrl =
    (profile as any).intro_video_url ||
    (profile as any).introVideoUrl ||
    profile.introVideoId ||
    (PORTFOLIO_INFO as any).introVideoUrl ||
    PORTFOLIO_INFO.introVideoId;
  const introDrivePreview = getVideoEmbedUrl(rawVideoUrl);
  const isVideoVisible =
    Boolean(
      (profile as any).show_intro_video !== undefined
        ? (profile as any).show_intro_video
        : (profile as any).showIntroVideo !== undefined
        ? (profile as any).showIntroVideo
        : (PORTFOLIO_INFO as any).showIntroVideo
    ) && Boolean(introDrivePreview);
  const resumeUrl = profile.resumeUrl || PORTFOLIO_INFO.resumeUrl;
  const aboutStats = (profile as any).aboutStats || (profile as any).about_stats || (PORTFOLIO_INFO as any).aboutStats;

  return (
    <section
      id="about"
      className="relative py-12 sm:py-16 overflow-hidden bg-gradient-to-b from-[#030014] via-[#090e1f] to-[#030014]"
    >
      {/* Background Ambience (Exact match with Education, Skills, Certificates) */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="relative px-4 mx-auto max-w-6xl sm:px-6 lg:px-8">
        {/* Section Heading (Exact match with other sections) */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 sm:mb-12 text-center"
        >
          <span className="text-xs font-semibold tracking-widest uppercase text-cyan-400">
            Get To Know Me
          </span>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
            About Me
          </h2>
          <div className="w-20 h-1 mx-auto mt-4 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400" />
        </motion.div>

        {/* Clean, Simple 2-Column Layout */}
        <div className="grid items-center grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
          
          {/* Left: Clean Profile Photo Frame */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex justify-center lg:col-span-5"
          >
            <div className="relative w-full max-w-sm">
              {/* Subtle ambient glow behind photo */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-purple-600/20 via-pink-500/10 to-cyan-400/20 blur-xl -z-10" />

              <div className="p-2.5 overflow-hidden border rounded-3xl bg-white/[0.03] border-white/10 backdrop-blur-xl shadow-2xl shadow-black/40 group">
                <img
                  src={imgSrc}
                  alt={profile.name || PORTFOLIO_INFO.name}
                  onError={() => setImgSrc(AVATAR_FALLBACK)}
                  className="object-cover object-top w-full h-80 sm:h-96 rounded-2xl transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
            </div>
          </motion.div>

          {/* Right: Short & Punchy Story + Quick Highlights */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6 lg:col-span-7"
          >
            {/* Short Bio (Simple, No Wall of Text) */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white sm:text-3xl">
                Hi, I'm{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">
                  {profile.name || PORTFOLIO_INFO.name}
                </span>
              </h3>
              <p className="text-sm sm:text-base leading-relaxed text-slate-300 text-justify">
                {profile.bio || "I enjoy building modern web and mobile applications using React, Next.js, Node.js, and Flutter. My focus is on writing clean, scalable code and turning ideas into fast, user-friendly digital products."}
              </p>
            </div>

            {/* Quick Stat Badges (Controlled from Admin) */}
            {aboutStats && aboutStats.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-1">
                {aboutStats.map((stat: any, idx: number) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: idx * 0.05 }}
                    whileHover={{ y: -3 }}
                    className="p-3 sm:p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-purple-500/30 transition-all text-center flex flex-col justify-center items-center backdrop-blur-sm group shadow-sm shadow-black/20"
                  >
                    <span className="text-xl sm:text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 group-hover:scale-105 transition-transform">
                      {stat.value}
                    </span>
                    <span className="text-[11px] sm:text-xs font-medium text-slate-400 mt-1 line-clamp-1 group-hover:text-slate-200 transition-colors">
                      {stat.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Action Buttons (Matches Hero and Rest of Site) */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={resumeUrl}
                target="_blank"
                rel="noreferrer"
                download
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 rounded-xl shadow-lg bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 hover:shadow-purple-500/30 hover:scale-105 active:scale-95 cursor-pointer"
              >
                {renderIcon(FaDownload, { size: 12 })}
                <span>Download Resume</span>
              </a>

              {isVideoVisible && (
                <button
                  type="button"
                  onClick={() => setIsVideoOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-slate-200 transition-all duration-300 border rounded-xl bg-white/[0.04] border-white/10 hover:bg-white/[0.08] hover:text-white hover:border-white/20 active:scale-95 cursor-pointer"
                >
                  {renderIcon(FaPlay, { size: 10, className: "text-purple-400" })}
                  <span>Watch Intro</span>
                </button>
              )}

              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-1.5 px-4 py-3 text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                {renderIcon(FaEnvelope, { size: 12 })}
                <span>Contact Me</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Video Introduction Modal */}
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsVideoOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl p-2 border shadow-2xl rounded-2xl bg-slate-900/90 border-white/15 backdrop-blur-xl"
            >
              <button
                onClick={() => setIsVideoOpen(false)}
                aria-label="Close video"
                className="absolute z-20 flex items-center justify-center w-9 h-9 text-slate-300 transition-colors border rounded-full -top-12 right-0 bg-white/10 border-white/20 hover:text-white hover:bg-white/20"
              >
                {renderIcon(FaTimes, { size: 16 })}
              </button>

              <div className="relative overflow-hidden rounded-xl aspect-video bg-black/80">
                <iframe
                  src={introDrivePreview}
                  title="Md. Maharab Hosen Intro Video"
                  className="w-full h-full"
                  allow="autoplay; encrypted-media; fullscreen"
                  allowFullScreen
                />
              </div>

              <div className="p-4 text-center">
                <h3 className="text-lg font-bold text-white">
                  Introduction Video
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                  A short introduction to my engineering background and projects.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default About;
