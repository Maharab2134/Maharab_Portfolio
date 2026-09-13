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
  FaShieldAlt,
} from "react-icons/fa";
import { SiReact, SiFlutter, SiNodedotjs } from "react-icons/si";
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
  const [showAllTech, setShowAllTech] = useState(false);

  // Dynamic Animated Typewriter Configuration from Admin
  const typewriterPrefix =
    (profile as any).typewriterPrefix ??
    (profile as any).typewriter_prefix ??
    "I engineer";

  const typewriterPhrases = useMemo(() => {
    const raw =
      (profile as any).typewriterPhrases ??
      (profile as any).typewriter_phrases;
    if (Array.isArray(raw) && raw.length > 0) return raw;
    if (typeof raw === "string" && raw.trim()) {
      const items = raw.split("\n").map((s: string) => s.trim()).filter(Boolean);
      if (items.length > 0) return items;
    }
    return [
      "Scalable Full-Stack Web Apps",
      "Cross-Platform Mobile Experiences",
      "High-Throughput REST & GraphQL APIs",
      "Secure Microservices Architecture",
    ];
  }, [profile]);

  const typewriterSequence = useMemo(() => {
    const seq: (string | number)[] = [];
    typewriterPhrases.forEach((phrase: string) => {
      seq.push(phrase, 2400);
    });
    return seq.length > 0 ? seq : ["Scalable Full-Stack Web Apps", 2400];
  }, [typewriterPhrases]);

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
              className="flex items-center gap-1.5 sm:gap-2 text-sm xs:text-base sm:text-xl md:text-2xl font-medium text-slate-400 whitespace-nowrap overflow-hidden"
            >
              {typewriterPrefix && (
                <span className="shrink-0 whitespace-nowrap">{typewriterPrefix}</span>
              )}
              <div className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 whitespace-nowrap truncate min-w-0">
                <TypeAnimation
                  key={typewriterPhrases.join("|")}
                  sequence={typewriterSequence}
                  wrapper="span"
                  speed={45}
                  repeat={Infinity}
                />
              </div>
            </motion.div>
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

            {/* Social Connection Pills & Tech Stack */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 pt-2"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-semibold tracking-wider uppercase text-slate-400 mr-1">
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
                        className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 transition-all duration-300 border rounded-full text-slate-400 bg-white/[0.03] border-white/10 backdrop-blur-sm ${hoverColor} hover:scale-110 active:scale-95`}
                      >
                        {renderIcon(Icon, { size: 15 })}
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
              </div>

              <div className="w-px h-6 bg-white/10 hidden sm:block" />

              {/* Core Tech Stack Mini Chips */}
              <div className="flex flex-wrap items-center gap-1.5">
                {(showAllTech ? techBadges : techBadges.slice(0, 3)).map((tech) => (
                  <motion.span
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    key={tech}
                    className="px-2.5 py-1 text-[11px] font-mono rounded-md bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-white/20 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {tech}
                  </motion.span>
                ))}

                <button
                  type="button"
                  onClick={() => setShowAllTech((prev) => !prev)}
                  title={showAllTech ? "Show fewer technologies" : `Show all ${techBadges.length} technologies`}
                  className={`px-2 py-1 text-[11px] font-mono rounded-md border transition-all cursor-pointer flex items-center gap-1 active:scale-95 ${
                    showAllTech
                      ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20"
                      : "bg-white/[0.04] border-white/10 text-slate-400 hover:text-white hover:border-white/25 hover:bg-white/[0.08]"
                  }`}
                >
                  <span>...</span>
                  {!showAllTech && (
                    <span className="text-[10px] text-slate-500 font-sans">
                      +{techBadges.length - 3}
                    </span>
                  )}
                </button>
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: Holographic Developer HUD / Visual Showcase (5 cols) */}
          <motion.div
            style={{ rotateX, rotateY, transformPerspective: 1000 }}
            className="relative lg:col-span-5"
          >
            {/* Ambient Background Aura */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-purple-600/20 via-pink-600/10 to-cyan-500/20 blur-2xl -z-10" />

            {/* Main Cyber Terminal Glass Frame */}
            <div className="overflow-hidden border shadow-2xl rounded-3xl bg-slate-950/85 border-white/15 backdrop-blur-2xl">
              
              {/* Terminal Title Bar */}
              <div className="flex items-center justify-between px-4 py-3 border-b bg-white/[0.02] border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                  <span className="ml-2 font-mono text-xs text-slate-400 flex items-center gap-1.5">
                    {renderIcon(FaTerminal, { size: 10, className: "text-slate-500" })}
                    maharab.dev
                  </span>
                </div>

                <div className="flex items-center gap-1.5 font-mono text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Available for Hire</span>
                </div>
              </div>

              {/* Developer Portrait & Identity Banner */}
              <div className="p-4 sm:p-5 border-b border-white/5 bg-gradient-to-r from-purple-950/25 via-slate-900/40 to-cyan-950/25 flex items-center gap-3.5 sm:gap-4">
                <div className="relative shrink-0">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden p-0.5 bg-gradient-to-tr from-purple-500 via-pink-500 to-cyan-400 shadow-lg shadow-purple-500/20">
                    <div className="w-full h-full rounded-[14px] overflow-hidden bg-slate-900 relative flex items-center justify-center">
                      <img
                        src={profile.profileImage || "/images/img.jpg"}
                        alt={profile.name}
                        className="w-full h-full object-cover object-top"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                      <span className="absolute inset-0 flex items-center justify-center font-bold text-white text-base bg-gradient-to-tr from-purple-600 to-cyan-500 -z-10">
                        MH
                      </span>
                    </div>
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-950" />
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-white truncate">
                      {profile.name}
                    </h3>
                    <span className="shrink-0 px-2 py-0.5 text-[10px] font-semibold text-cyan-300 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                      CSE BUBT
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 truncate">
                    {profile.title}
                  </p>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1.5 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                    <span className="truncate">Mirpur, Dhaka, Bangladesh</span>
                  </p>
                </div>
              </div>

              {/* Visual Core Specialties Grid (2x2) - Visual, not text heavy */}
              <div className="p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between text-[11px] uppercase tracking-wider font-mono text-slate-400">
                  <span>Core Expertise</span>
                  <span className="text-cyan-400">Production Ready</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {/* Full-Stack Web */}
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 hover:border-cyan-500/40 hover:bg-white/[0.06] transition-all group">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform shrink-0">
                        {renderIcon(SiReact, { size: 14 })}
                      </div>
                      <span className="text-xs font-semibold text-white truncate">Web Apps</span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">React • Next.js</p>
                  </div>

                  {/* Mobile Engineering */}
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 hover:border-sky-500/40 hover:bg-white/[0.06] transition-all group">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform shrink-0">
                        {renderIcon(SiFlutter, { size: 14 })}
                      </div>
                      <span className="text-xs font-semibold text-white truncate">Mobile Apps</span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">Flutter • Android</p>
                  </div>

                  {/* Backend & DB */}
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 hover:border-purple-500/40 hover:bg-white/[0.06] transition-all group">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform shrink-0">
                        {renderIcon(SiNodedotjs, { size: 14 })}
                      </div>
                      <span className="text-xs font-semibold text-white truncate">Backend &amp; DB</span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">Node.js • Postgres</p>
                  </div>

                  {/* Clean Architecture */}
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 hover:border-pink-500/40 hover:bg-white/[0.06] transition-all group">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-7 h-7 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform shrink-0">
                        {renderIcon(FaShieldAlt, { size: 12 })}
                      </div>
                      <span className="text-xs font-semibold text-white truncate">Architecture</span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">OWASP • Clean Code</p>
                  </div>
                </div>

                {/* Quick Performance Strip */}
                <div className="grid grid-cols-3 gap-2 pt-1 text-center font-mono">
                  <div className="py-2 px-1 rounded-lg bg-white/[0.02] border border-white/5">
                    <p className="text-xs font-bold text-cyan-400">50+</p>
                    <p className="text-[10px] text-slate-400">Projects</p>
                  </div>
                  <div className="py-2 px-1 rounded-lg bg-white/[0.02] border border-white/5">
                    <p className="text-xs font-bold text-emerald-400">&lt;50ms</p>
                    <p className="text-[10px] text-slate-400">Fast APIs</p>
                  </div>
                  <div className="py-2 px-1 rounded-lg bg-white/[0.02] border border-white/5">
                    <p className="text-xs font-bold text-purple-400">100%</p>
                    <p className="text-[10px] text-slate-400">Commitment</p>
                  </div>
                </div>
              </div>

              {/* Terminal Bottom Command Line */}
              <div className="px-4 py-2.5 border-t border-white/5 bg-black/40 flex items-center justify-between font-mono text-[11px] text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-slate-300">Ready to Deploy &amp; Scale</span>
                </div>
                <span className="text-cyan-400 font-semibold flex items-center gap-1">
                  {renderIcon(HiOutlineSparkles, { size: 12 })}
                  <span>Verified Dev</span>
                </span>
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

