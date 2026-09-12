import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaEnvelope,
  FaArrowDown,
  FaRocket,
  FaTerminal,
  FaCheckCircle,
  FaShieldAlt,
} from "react-icons/fa";
import { HiOutlineSparkles } from "react-icons/hi2";
import { TypeAnimation } from "react-type-animation";
import { useLiveProfile } from "../lib/portfolioService";

const renderIcon = (Icon: any, props: any = {}) => {
  return <Icon {...props} />;
};

const Hero: React.FC = () => {
  const profile = useLiveProfile();
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeTab, setActiveTab] = useState<"spec" | "capabilities">("spec");

  const socialLinks = useMemo(
    () => [
      {
        href: profile.socials.github,
        label: "GitHub",
        icon: FaGithub,
        hoverColor: "hover:text-white hover:border-purple-400 hover:bg-purple-500/10",
      },
      {
        href: profile.socials.linkedin,
        label: "LinkedIn",
        icon: FaLinkedin,
        hoverColor: "hover:text-cyan-300 hover:border-cyan-400 hover:bg-cyan-500/10",
      },
      {
        href: profile.socials.twitter,
        label: "Twitter / X",
        icon: FaTwitter,
        hoverColor: "hover:text-sky-300 hover:border-sky-400 hover:bg-sky-500/10",
      },
      {
        href: `mailto:${profile.email}`,
        label: "Email Me",
        icon: FaEnvelope,
        hoverColor: "hover:text-pink-300 hover:border-pink-400 hover:bg-pink-500/10",
      },
    ],
    [profile]
  );

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const smoothMouseX = useSpring(mouseX, { stiffness: 60, damping: 25 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 60, damping: 25 });

  const rotateX = useTransform(smoothMouseY, [0, 1], [4, -4]);
  const rotateY = useTransform(smoothMouseX, [0, 1], [-4, 4]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set(clientX / innerWidth);
      mouseY.set(clientY / innerHeight);
    },
    [mouseX, mouseY]
  );

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const techBadges = useMemo(
    () => [
      "React",
      "Next.js",
      "TypeScript",
      "Node.js",
      "Flutter",
      "PostgreSQL",
      "MongoDB",
      "Tailwind CSS",
    ],
    []
  );

  return (
    <section
      id="home"
      onMouseMove={handleMouseMove}
      className="relative flex items-center min-h-screen pt-28 pb-10 sm:pb-14 overflow-hidden bg-[#030014]"
    >
      {/* Dynamic Background Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Upper Left Ambient Glow */}
        <motion.div
          className="absolute -top-32 -left-32 w-[550px] h-[550px] rounded-full bg-gradient-to-br from-purple-600/25 via-indigo-600/15 to-transparent blur-[140px]"
          animate={{
            x: [0, 35, 0],
            y: [0, 25, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Center Right Ambient Glow */}
        <motion.div
          className="absolute top-1/4 -right-32 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-cyan-500/20 via-blue-600/10 to-transparent blur-[150px]"
          animate={{
            x: [0, -35, 0],
            y: [0, 45, 0],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Bottom Ambient Glow */}
        <motion.div
          className="absolute -bottom-32 left-1/3 w-[650px] h-[450px] rounded-full bg-pink-600/15 blur-[160px]"
          animate={{
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Futuristic Subtle Grid lines */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.18) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* Main Container */}
      <div className="relative z-10 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 w-full">
        <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          
          {/* LEFT COLUMN: Narrative & Action Engine (7 cols) */}
          <div className="text-left lg:col-span-7 space-y-6">
            
            {/* Live Availability Tag */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 text-xs font-medium rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-xl text-slate-300 shadow-sm"
            >
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex w-full h-full bg-emerald-400 rounded-full opacity-75 animate-ping" />
                <span className="relative inline-flex w-2 h-2 bg-emerald-500 rounded-full" />
              </span>
              <span className="font-mono text-emerald-400 tracking-wider text-[11px] uppercase font-semibold">
                Available for Hire
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300 hidden sm:inline">Software Engineer &amp; Mobile Dev</span>
              {renderIcon(HiOutlineSparkles, { size: 14, className: "text-purple-400 ml-0.5" })}
            </motion.div>

            {/* Main Greeting & Name */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-2"
            >
              <p className="font-mono text-xs sm:text-sm font-semibold tracking-widest uppercase text-cyan-400">
                &lt;Hello World, I am /&gt;
              </p>
              <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl md:text-7xl">
                <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-purple-200">
                  {profile.name}
                </span>
              </h1>
            </motion.div>

            {/* Dynamic Animated Typewriter Headline */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap items-center gap-2 text-lg sm:text-2xl font-medium text-slate-400"
            >
              <span>I engineer</span>
              <div className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">
                <TypeAnimation
                  sequence={[
                    "Scalable Full-Stack Web Apps",
                    2400,
                    "Cross-Platform Mobile Experiences",
                    2400,
                    "High-Throughput REST & GraphQL APIs",
                    2400,
                    "Secure Microservices Architecture",
                    2400,
                  ]}
                  wrapper="span"
                  speed={45}
                  repeat={Infinity}
                />
              </div>
            </motion.div>

            {/* Subtitle Bio */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="max-w-xl text-base sm:text-lg leading-relaxed text-slate-300/90 font-light"
            >
              {profile.tagline || profile.bio || "Software Engineering student at BUBT. I bridge architectural discipline with human-centered product design to build scalable digital systems."}
            </motion.p>

            {/* Stats Metric Strip */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="grid grid-cols-3 max-w-md gap-3 p-3 border rounded-2xl bg-white/[0.03] border-white/10 backdrop-blur-xl"
            >
              <div className="px-2 py-1 text-left">
                <p className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 sm:text-2xl">
                  {profile.stats.yearsExperience}
                </p>
                <p className="text-[11px] font-medium text-slate-400">Years Exp</p>
              </div>
              <div className="px-2 py-1 text-left border-x border-white/10">
                <p className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 sm:text-2xl">
                  {profile.stats.projectsCompleted}
                </p>
                <p className="text-[11px] font-medium text-slate-400">Projects Built</p>
              </div>
              <div className="px-2 py-1 text-left">
                <p className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 sm:text-2xl">
                  {profile.stats.satisfactionRate}
                </p>
                <p className="text-[11px] font-medium text-slate-400">Commitment</p>
              </div>
            </motion.div>

            {/* Interactive Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center gap-3 pt-2"
            >
              <a
                href="#projects"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 rounded-full shadow-lg bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 active:scale-95"
              >
                <span>Explore Featured Work</span>
                {renderIcon(FaArrowDown, { size: 11, className: "animate-bounce" })}
              </a>

              <a
                href="#hire"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.hash = "#hire";
                }}
                className="inline-flex items-center gap-2 px-5 py-3.5 text-sm font-semibold text-slate-300 transition-all duration-300 border rounded-full bg-white/[0.02] border-white/10 hover:bg-white/10 hover:text-white active:scale-95"
              >
                {renderIcon(FaRocket, { size: 12, className: "text-purple-400" })}
                <span>Hire Me</span>
              </a>
            </motion.div>

            {/* Social Connection Pills */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex items-center gap-2.5 pt-2"
            >
              <span className="text-xs font-semibold tracking-wider uppercase text-slate-400 mr-1 hidden sm:inline">
                Network:
              </span>
              <div className="flex items-center gap-2">
                {socialLinks.map(({ href, label, icon: Icon, hoverColor }) => (
                  <div key={label} className="relative">
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      onMouseEnter={() => setActiveTooltip(label)}
                      onMouseLeave={() => setActiveTooltip(null)}
                      className={`flex items-center justify-center w-10 h-10 transition-all duration-300 border rounded-full text-slate-400 bg-white/[0.03] border-white/10 backdrop-blur-sm ${hoverColor} hover:scale-110 active:scale-95`}
                    >
                      {renderIcon(Icon, { size: 16 })}
                    </a>
                    <AnimatePresence>
                      {activeTooltip === label && (
                        <motion.div
                          initial={{ opacity: 0, y: 6, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.9 }}
                          transition={{ duration: 0.15 }}
                          className="absolute z-30 px-2.5 py-1 text-xs font-medium text-white -translate-x-1/2 border rounded-md shadow-lg pointer-events-none -bottom-8 left-1/2 bg-slate-900/90 border-white/10 backdrop-blur-md whitespace-nowrap"
                        >
                          {label}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              <div className="w-px h-6 bg-white/10 hidden sm:block" />

              {/* Core Tech Stack Mini Chips */}
              <div className="flex flex-wrap items-center gap-1.5">
                {techBadges.slice(0, 5).map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 text-[11px] font-mono rounded-md bg-white/[0.03] border border-white/10 text-slate-400"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: Unique Holographic Developer HUD / Interactive Terminal (5 cols) */}
          <motion.div
            style={{ rotateX, rotateY, transformPerspective: 1000 }}
            className="relative lg:col-span-5"
          >
            {/* Ambient Background Aura */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-purple-600/20 via-pink-600/10 to-cyan-500/20 blur-2xl -z-10" />

            {/* Floating Orbit Badge 1: Clean Architecture */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-5 -right-4 z-20 flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white rounded-xl bg-slate-900/90 border border-purple-500/40 backdrop-blur-xl shadow-xl shadow-purple-500/10"
            >
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              <span>Clean Architecture</span>
            </motion.div>

            {/* Floating Orbit Badge 2: Flutter & Android */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -bottom-5 -left-4 z-20 flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white rounded-xl bg-slate-900/90 border border-cyan-500/40 backdrop-blur-xl shadow-xl shadow-cyan-500/10"
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>Flutter 3 &amp; Android</span>
            </motion.div>

            {/* Main Cyber Terminal Glass Frame */}
            <div className="overflow-hidden border shadow-2xl rounded-3xl bg-slate-950/85 border-white/15 backdrop-blur-2xl">
              
              {/* Terminal Title Bar */}
              <div className="flex items-center justify-between px-4 py-3 border-b bg-white/[0.02] border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                  <span className="ml-2 font-mono text-xs text-slate-400 flex items-center gap-1.5">
                    {renderIcon(FaTerminal, { size: 10, className: "text-slate-500" })}
                    maharab@engine: ~
                  </span>
                </div>

                <div className="flex items-center gap-2 font-mono text-[10px] text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>14ms ping</span>
                </div>
              </div>

              {/* Developer Portrait & Identity Banner */}
              <div className="p-5 border-b border-white/5 bg-gradient-to-r from-purple-950/20 via-slate-900/40 to-cyan-950/20 flex items-center gap-4">
                <div className="relative flex-shrink-0">
                  <img
                    src={profile.profileImage}
                    alt={profile.name}
                    className="w-16 h-16 rounded-2xl object-cover object-top border border-white/20 shadow-md shadow-black/40"
                  />
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-950" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">
                      {profile.name}
                    </h3>
                    <span className="px-2 py-0.5 text-[10px] font-semibold text-cyan-300 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                      CSE BUBT
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {profile.title}
                  </p>
                  <p className="font-mono text-[11px] text-purple-300 flex items-center gap-1">
                    {renderIcon(FaShieldAlt, { size: 10 })}
                    <span>OWASP Top 10 Hardened Architecture</span>
                  </p>
                </div>
              </div>

              {/* Terminal Interactive Tabs */}
              <div className="flex border-b border-white/5 bg-black/30 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setActiveTab("spec")}
                  className={`flex-1 py-2.5 px-4 text-center transition-colors border-r border-white/5 ${
                    activeTab === "spec"
                      ? "text-cyan-300 bg-white/[0.04] border-b-2 border-cyan-400 font-semibold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  system_spec.json
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("capabilities")}
                  className={`flex-1 py-2.5 px-4 text-center transition-colors ${
                    activeTab === "capabilities"
                      ? "text-purple-300 bg-white/[0.04] border-b-2 border-purple-400 font-semibold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  live_metrics.sh
                </button>
              </div>

              {/* Terminal Code / Capabilities View */}
              <div className="p-5 font-mono text-xs leading-relaxed overflow-x-auto min-h-[190px]">
                {activeTab === "spec" ? (
                  <div className="space-y-1.5 text-slate-300">
                    <p className="text-slate-500">{"// Engine runtime parameters"}</p>
                    <p>
                      <span className="text-pink-400">const</span>{" "}
                      <span className="text-cyan-300">engineer</span> = &#123;
                    </p>
                    <p className="pl-4">
                      <span className="text-purple-300">name</span>:{" "}
                      <span className="text-emerald-300">"{profile.name}"</span>,
                    </p>
                    <p className="pl-4">
                      <span className="text-purple-300">institution</span>:{" "}
                      <span className="text-emerald-300">"BUBT (CSE)"</span>,
                    </p>
                    <p className="pl-4">
                      <span className="text-purple-300">primaryStack</span>: [
                      <span className="text-amber-300">"Next.js"</span>,{" "}
                      <span className="text-amber-300">"Flutter"</span>,{" "}
                      <span className="text-amber-300">"Node.js"</span>],
                    </p>
                    <p className="pl-4">
                      <span className="text-purple-300">database</span>: [
                      <span className="text-amber-300">"PostgreSQL"</span>,{" "}
                      <span className="text-amber-300">"MongoDB"</span>],
                    </p>
                    <p className="pl-4">
                      <span className="text-purple-300">status</span>:{" "}
                      <span className="text-cyan-300">"Ready to Deploy &amp; Scale 🚀"</span>
                    </p>
                    <p>&#125;;</p>
                  </div>
                ) : (
                  <div className="space-y-2 text-slate-300">
                    <p className="text-slate-500">{"// Diagnostic capabilities"}</p>
                    <div className="flex items-center gap-2 text-emerald-400">
                      {renderIcon(FaCheckCircle, { size: 12 })}
                      <span>Zero OWASP Top 10 Vulnerabilities</span>
                    </div>
                    <div className="flex items-center gap-2 text-cyan-300">
                      {renderIcon(FaCheckCircle, { size: 12 })}
                      <span>Sub-100ms API Latencies (Redis / Node)</span>
                    </div>
                    <div className="flex items-center gap-2 text-purple-300">
                      {renderIcon(FaCheckCircle, { size: 12 })}
                      <span>60fps Smooth Mobile Renders (Flutter)</span>
                    </div>
                    <div className="flex items-center gap-2 text-pink-300">
                      {renderIcon(FaCheckCircle, { size: 12 })}
                      <span>Full CI/CD &amp; Automated Testing</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Terminal Bottom Command Line */}
              <div className="px-4 py-2.5 border-t border-white/5 bg-black/40 flex items-center justify-between font-mono text-[11px] text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">&gt;</span>
                  <span>readyForInterview: true</span>
                </div>
                <span className="text-purple-400 font-semibold">100% Verified</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Global Floating Scroll to Top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Scroll back to top"
            className="fixed z-40 p-3 text-white transition-all duration-300 border rounded-full shadow-lg bottom-6 right-6 bg-slate-900/80 border-white/20 backdrop-blur-xl hover:bg-purple-600/30 hover:border-purple-400 hover:scale-110 active:scale-95"
          >
            {renderIcon(FaArrowDown, { size: 14, className: "rotate-180" })}
          </motion.button>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Hero;

