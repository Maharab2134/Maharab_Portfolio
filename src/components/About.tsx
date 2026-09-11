import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaDownload,
  FaPlay,
  FaTimes,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaRocket,
  FaEnvelope,
} from "react-icons/fa";
import { PORTFOLIO_INFO } from "../data/portfolioData";
import { toProxyImageUrl } from "../data/projectsData";

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
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState(toProxyImageUrl(PORTFOLIO_INFO.profileImage));

  const introDrivePreview = `https://drive.google.com/file/d/${PORTFOLIO_INFO.introVideoId}/preview?autoplay=1`;

  const highlights = [
    {
      icon: FaGraduationCap,
      label: "Education",
      value: "B.Sc. in CSE, BUBT (2022 - Present)",
      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    },
    {
      icon: FaMapMarkerAlt,
      label: "Location",
      value: "Mirpur, Dhaka, Bangladesh",
      color: "text-pink-400 bg-pink-500/10 border-pink-500/20",
    },
    {
      icon: FaRocket,
      label: "Experience",
      value: `${PORTFOLIO_INFO.stats.yearsExperience} Years • ${PORTFOLIO_INFO.stats.projectsCompleted} Projects Built`,
      color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    },
  ];

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
          initial={{ opacity: 0, y: 20 }}
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
                  alt={PORTFOLIO_INFO.name}
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
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-white sm:text-3xl">
                Hi, I'm{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">
                  {PORTFOLIO_INFO.name}
                </span>
              </h3>
              <p className="text-base sm:text-lg leading-relaxed text-slate-300">
                A passionate <strong className="font-semibold text-white">Full-Stack Software Developer</strong> and Computer Science &amp; Engineering student at BUBT.
              </p>
              <p className="text-sm sm:text-base leading-relaxed text-slate-400">
                I enjoy building modern web and mobile applications using <span className="text-slate-200">React, Next.js, Node.js, and Flutter</span>. My focus is on writing clean, scalable code and turning ideas into fast, user-friendly digital products.
              </p>
            </div>

            {/* Quick Highlights (Clean matching cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {highlights.map((item) => (
                <div
                  key={item.label}
                  className="p-3.5 rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-sm"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`p-1.5 rounded-lg border text-xs ${item.color}`}>
                      {renderIcon(item.icon, { size: 12 })}
                    </span>
                    <span className="text-xs font-medium text-slate-400">{item.label}</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-200 leading-snug">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Action Buttons (Matches Hero and Rest of Site) */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <a
                href={PORTFOLIO_INFO.resumeUrl}
                download
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 rounded-xl shadow-lg bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 hover:shadow-purple-500/30 hover:scale-105 active:scale-95"
              >
                {renderIcon(FaDownload, { size: 12 })}
                <span>Download Resume</span>
              </a>

              <button
                type="button"
                onClick={() => setIsVideoOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-slate-200 transition-all duration-300 border rounded-xl bg-white/[0.04] border-white/10 hover:bg-white/[0.08] hover:text-white hover:border-white/20 active:scale-95"
              >
                {renderIcon(FaPlay, { size: 10, className: "text-purple-400" })}
                <span>Watch Intro</span>
              </button>

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
