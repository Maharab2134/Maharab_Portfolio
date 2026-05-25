// ============================================
// HERO.tsx - UPDATED (Minimalist Name)
// ============================================

import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  AnimatePresence,
  Variants,
} from "framer-motion";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaArrowDown,
  FaPaperPlane,
} from "react-icons/fa";
import { HiOutlineSparkles } from "react-icons/hi2";
import { IconBaseProps } from "react-icons";
import { TypeAnimation } from "react-type-animation";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";

const renderIcon = (
  Icon: React.ComponentType<IconBaseProps>,
  props: IconBaseProps = {},
) => {
  return <Icon {...props} />;
};

// Floating orbs data
const FLOATING_ORBS = [...Array(6)].map((_, i) => ({
  size: Math.random() * 300 + 150,
  x: Math.random() * 100,
  y: Math.random() * 100,
  duration: Math.random() * 20 + 15,
  delay: i * 2,
  color:
    i % 3 === 0
      ? "from-purple-600/20 to-blue-600/20"
      : i % 3 === 1
        ? "from-pink-600/20 to-purple-600/20"
        : "from-cyan-600/20 to-teal-600/20",
}));

// Star particles
const STARS = [...Array(50)].map(() => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 1,
  duration: Math.random() * 3 + 2,
  delay: Math.random() * 5,
  opacity: Math.random() * 0.5 + 0.1,
}));

// Meteor/shooting star data
const METEORS = [...Array(4)].map((_, i) => ({
  delay: i * 4 + Math.random() * 3,
  duration: Math.random() * 1.5 + 0.8,
  startX: Math.random() * 60 + 20,
  startY: -10,
}));

// Grid lines data
const GRID_LINES_H = [...Array(12)].map((_, i) => ({
  top: `${(i + 1) * 8}%`,
  delay: i * 0.1,
}));
const GRID_LINES_V = [...Array(12)].map((_, i) => ({
  left: `${(i + 1) * 8}%`,
  delay: i * 0.1,
}));

const SOCIAL_LINKS = [
  {
    href: "https://github.com/Maharab2134",
    label: "GitHub",
    icon: FaGithub,
    color: "hover:text-gray-100 hover:shadow-gray-400/50",
  },
  {
    href: "https://www.linkedin.com/in/md-maharab-hosen-679a70253/",
    label: "LinkedIn",
    icon: FaLinkedin,
    color: "hover:text-blue-400 hover:shadow-blue-400/50",
  },
  {
    href: "https://x.com/Mahar22234",
    label: "Twitter",
    icon: FaTwitter,
    color: "hover:text-cyan-400 hover:shadow-cyan-400/50",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const Hero = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const rotateX = useTransform(smoothMouseY, [0, 1], [2, -2]);
  const rotateY = useTransform(smoothMouseX, [0, 1], [-2, 2]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const updatePreferences = () => {
      if (typeof window === "undefined") return;
      const touchMedia = window.matchMedia("(hover: none), (pointer: coarse)");
      const reducedMedia = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      );
      setIsTouchDevice(touchMedia.matches);
      setPrefersReducedMotion(reducedMedia.matches);
    };

    updatePreferences();
    window.addEventListener("resize", updatePreferences);
    return () => window.removeEventListener("resize", updatePreferences);
  }, []);

  const shouldReduceEffects = isTouchDevice || prefersReducedMotion;
  const floatingOrbs = useMemo(
    () => (shouldReduceEffects ? FLOATING_ORBS.slice(0, 2) : FLOATING_ORBS),
    [shouldReduceEffects],
  );
  const stars = useMemo(
    () => (shouldReduceEffects ? STARS.slice(0, 18) : STARS),
    [shouldReduceEffects],
  );
  const meteors = useMemo(
    () => (shouldReduceEffects ? [] : METEORS),
    [shouldReduceEffects],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set(clientX / innerWidth);
      mouseY.set(clientY / innerHeight);
      setMousePosition({
        x: (clientX / innerWidth - 0.5) * 30,
        y: (clientY / innerHeight - 0.5) * 30,
      });
    },
    [mouseX, mouseY],
  );

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > window.innerHeight / 2);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Show scroll-down indicator only when Hero is visible
  const sectionRef = useRef<HTMLElement | null>(null);
  const [showScrollDown, setShowScrollDown] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = sectionRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // show indicator when hero is mostly visible
          setShowScrollDown(
            entry.isIntersecting && entry.intersectionRatio > 0.3,
          );
        });
      },
      { threshold: [0, 0.3, 0.6, 1] },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="home"
      ref={sectionRef}
      onMouseMove={shouldReduceEffects ? undefined : handleMouseMove}
      className="relative flex items-center justify-center min-h-[100svh] overflow-hidden bg-[#030014] md:min-h-screen"
    >
      {/* ===== LAYERED BACKGROUND SYSTEM ===== */}

      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030014] via-[#0a0a2e] to-[#030014]" />

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 opacity-[0.03]">
        {GRID_LINES_H.map((line, i) => (
          <motion.div
            key={`h-${i}`}
            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"
            style={{ top: line.top }}
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 2, delay: line.delay + 1 }}
          />
        ))}
        {GRID_LINES_V.map((line, i) => (
          <motion.div
            key={`v-${i}`}
            className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-purple-500 to-transparent"
            style={{ left: line.left }}
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ duration: 2, delay: line.delay + 1 }}
          />
        ))}
      </div>

      {/* Floating orbs with parallax */}
      <div className="absolute inset-0 overflow-hidden">
        {floatingOrbs.map((orb, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full bg-gradient-to-br ${orb.color} blur-3xl`}
            style={{
              width: orb.size,
              height: orb.size,
              left: `${orb.x}%`,
              top: `${orb.y}%`,
              x: mousePosition.x * (i % 2 === 0 ? 1 : -1) * 0.5,
              y: mousePosition.y * (i % 2 === 0 ? -1 : 1) * 0.5,
            }}
            animate={{
              x: [0, 50 * (i % 2 === 0 ? 1 : -1), 0],
              y: [0, 30 * (i % 2 === 0 ? -1 : 1), 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: orb.duration,
              repeat: Infinity,
              repeatType: "reverse",
              delay: orb.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Star field */}
      <div className="absolute inset-0">
        {stars.map((star, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: star.size,
              height: star.size,
              left: `${star.x}%`,
              top: `${star.y}%`,
            }}
            animate={{
              opacity: [star.opacity, star.opacity * 2.5, star.opacity],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              delay: star.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Shooting meteors */}
      {meteors.map((meteor, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: `${meteor.startX}%`, top: `${meteor.startY}%` }}
          animate={{
            x: [0, 300],
            y: [0, 400],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: meteor.duration,
            repeat: Infinity,
            repeatDelay: meteor.delay + 8,
            ease: "easeIn",
          }}
        >
          <div className="w-[2px] h-[2px] bg-white rounded-full shadow-[0_0_6px_2px_rgba(255,255,255,0.6)]">
            <div className="absolute top-0 right-0 w-[80px] h-[1px] bg-gradient-to-l from-white/80 to-transparent -translate-x-full" />
          </div>
        </motion.div>
      ))}

      {/* Radial spotlight following mouse */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: `radial-gradient(600px circle at ${(mousePosition.x / 30 + 0.5) * 100}% ${(mousePosition.y / 30 + 0.5) * 100}%, rgba(120, 80, 255, 0.08), transparent 70%)`,
        }}
      />

      {/* ===== MAIN CONTENT ===== */}
      <motion.div
        className="relative z-10 px-4 py-24 mx-auto text-center max-w-7xl sm:px-6 sm:py-32"
        style={{ rotateX, rotateY, transformPerspective: 1200 }}
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
      >
        {/* Status Badge */}
        <motion.div variants={itemVariants} className="mb-8">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-full bg-white/[0.03] border-white/[0.08] text-white/70 backdrop-blur-xl"
            whileHover={{
              scale: 1.05,
              borderColor: "rgba(168, 85, 247, 0.3)",
              backgroundColor: "rgba(168, 85, 247, 0.05)",
            }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <motion.span
              className="relative flex w-2.5 h-2.5"
              aria-hidden="true"
            >
              <span className="absolute inline-flex w-full h-full bg-green-400 rounded-full opacity-75 animate-ping" />
              <span className="relative inline-flex w-2.5 h-2.5 bg-green-500 rounded-full" />
            </motion.span>
            Available for opportunities
            {renderIcon(
              HiOutlineSparkles as React.ComponentType<IconBaseProps>,
              {
                size: 16,
                className: "text-purple-400 ml-1",
              },
            )}
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-4">
          <h2 className="text-base font-light tracking-[0.3em] uppercase text-white/50 sm:text-lg mb-1">
            As-salamu alaykum 👋
          </h2>
          <h2 className="text-base font-light tracking-[0.3em] uppercase text-white/50 sm:text-lg mb-3">
            I'm
          </h2>
        </motion.div>

        {/* ✅ UPDATED: Single powerful name */}
        <motion.div variants={itemVariants} className="mb-6">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
            <span className="relative inline-block">
              <motion.span
                className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                style={{ backgroundSize: "200% 200%" }}
              >
                Md. Maharab
              </motion.span>
            </span>
          </h1>
        </motion.div>

        {/* Role Type Animation */}
        <motion.div variants={itemVariants} className="mb-8 sm:mb-10">
          <div className="flex flex-col items-center justify-center gap-2 text-base sm:text-lg md:text-xl sm:flex-row">
            <span className="font-light tracking-wide text-white/40">
              I craft
            </span>
            <div className="relative">
              <TypeAnimation
                sequence={[
                  "Full Stack Applications",
                  2500,
                  "Mobile Experiences",
                  2500,
                  "Quality Tested Software",
                  2500,
                  "Beautiful Interfaces",
                  2500,
                ]}
                wrapper="span"
                speed={40}
                repeat={Infinity}
                className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500"
              />
              {/* Blinking cursor enhancement */}
              <motion.span
                className="inline-block w-[2px] h-[1.1em] ml-1 align-middle bg-gradient-to-b from-cyan-400 to-purple-500 rounded-full"
                animate={{ opacity: [1, 0] }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="max-w-2xl mx-auto mb-10 text-sm font-light leading-relaxed sm:text-base text-white/40"
        >
          Passionate about transforming ideas into{" "}
          <span className="font-medium text-white/70">
            elegant digital solutions
          </span>
          . I blend cutting-edge technology with thoughtful design to build
          experiences that{" "}
          <span className="font-medium text-white/70">
            captivate and inspire
          </span>
          .
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center justify-center gap-3 mb-10 sm:flex-row sm:gap-4"
        >
          {/* Primary CTA */}
          <motion.a
            href="#projects"
            className="relative group inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium text-white rounded-full overflow-hidden sm:px-7 sm:py-3"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {/* Animated gradient background */}
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              style={{ backgroundSize: "200% 200%" }}
            />
            {/* Glow effect */}
            <div className="absolute inset-0 transition-opacity duration-500 rounded-full opacity-0 group-hover:opacity-100 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 blur-xl" />
            <span className="relative z-10 flex items-center gap-2">
              View My Work
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </span>
          </motion.a>

          {/* Secondary CTA */}
          <motion.a
            href="/#hire"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open Hire page in a new tab"
            className="relative group inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium text-white rounded-full border border-transparent bg-purple-600/10 hover:bg-purple-600/20 backdrop-blur-sm transition-all duration-300 sm:px-7 sm:py-3"
            whileHover={{
              scale: 1.03,
            }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="relative z-10 flex items-center gap-2">
              <motion.span
                initial={{ x: 0 }}
                animate={{ x: [0, 4, 0] }}
                transition={{
                  duration: 1.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="flex items-center"
              >
                {renderIcon(
                  FaPaperPlane as React.ComponentType<IconBaseProps>,
                  {
                    size: 13,
                    className: "text-white/90",
                  },
                )}
              </motion.span>
              Hire Me
            </span>
          </motion.a>
        </motion.div>

        {/* Social Links */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center gap-2.5"
        >
          {SOCIAL_LINKS.map(({ href, label, icon: Icon, color }) => (
            <div key={label} className="relative">
              <motion.a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className={`group relative flex items-center justify-center w-10 h-10 rounded-full border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm text-white/50 ${color} transition-all duration-300 sm:w-11 sm:h-11`}
                whileHover={{
                  scale: 1.15,
                  borderColor: "rgba(168, 85, 247, 0.3)",
                  backgroundColor: "rgba(255,255,255,0.05)",
                }}
                whileTap={{ scale: 0.9 }}
                onHoverStart={
                  shouldReduceEffects
                    ? undefined
                    : () => setActiveTooltip(label)
                }
                onHoverEnd={
                  shouldReduceEffects ? undefined : () => setActiveTooltip(null)
                }
              >
                {renderIcon(Icon as React.ComponentType<IconBaseProps>, {
                  size: 18,
                })}

                {/* Hover ring effect */}
                <motion.div
                  className="absolute inset-0 border-2 rounded-full border-purple-500/0 group-hover:border-purple-500/30"
                  initial={false}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>

              {/* Tooltip */}
              <AnimatePresence>
                {activeTooltip === label && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="absolute -bottom-9 left-1/2 -translate-x-1/2 px-2.5 py-1 text-xs font-medium text-white bg-white/10 backdrop-blur-xl rounded-lg border border-white/10 whitespace-nowrap"
                  >
                    {label}
                    <div className="absolute w-2 h-2 rotate-45 -translate-x-1/2 border-t border-l -top-1 left-1/2 bg-white/10 border-white/10 backdrop-blur-xl" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>

        {/* Tech stack floating badges */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap items-center justify-center max-w-lg gap-2 mx-auto mt-12"
        >
          {[
            "React",
            "Next.js",
            "TypeScript",
            "Node.js",
            "Flutter",
            "Figma",
          ].map((tech, i) => (
            <motion.span
              key={tech}
              className="px-2.5 py-1 text-[11px] font-medium rounded-full bg-white/[0.03] border border-white/[0.06] text-white/40 hover:text-white/70 hover:border-white/15 transition-all duration-300 cursor-default"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2 + i * 0.1 }}
              whileHover={{
                scale: 1.1,
                backgroundColor: "rgba(168, 85, 247, 0.08)",
                borderColor: "rgba(168, 85, 247, 0.2)",
              }}
            >
              {tech}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>

      {/* ===== SCROLL INDICATORS ===== */}

      {/* Scroll Down */}
      <AnimatePresence>
        {showScrollDown && (
          <motion.div
            key="hero-scroll"
            className="fixed z-50 transform -translate-x-1/2 left-1/2 bottom-6 sm:bottom-8"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ opacity: { duration: 0.4 }, y: { duration: 0.4 } }}
          >
            <button
              aria-label="Scroll down"
              className="cursor-pointer group"
              onClick={() =>
                window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
              }
            >
              <motion.div
                className="flex flex-col items-center gap-1.5"
                animate={{ y: [0, 8, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <span className="text-[9px] font-medium tracking-[0.3em] uppercase text-white/30 group-hover:text-white/60 transition-colors">
                  Scroll
                </span>
                <div className="relative w-[20px] h-[32px] rounded-full border-2 border-white/20 group-hover:border-white/40 transition-colors flex justify-center">
                  <motion.div
                    className="w-1 h-1.5 mt-1.5 rounded-full bg-white/50"
                    animate={{ y: [0, 10, 0], opacity: [1, 0.3, 1] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </div>
                {renderIcon(FaArrowDown as React.ComponentType<IconBaseProps>, {
                  size: 9,
                  className:
                    "text-white/20 group-hover:text-white/40 transition-colors",
                })}
              </motion.div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            aria-label="Scroll to top"
            className="fixed z-50 bottom-5 right-4 sm:bottom-6 sm:right-6 group"
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <div className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/[0.05] backdrop-blur-xl border border-white/[0.1] text-white/60 group-hover:text-white group-hover:border-purple-500/30 group-hover:bg-purple-500/10 transition-all duration-300">
              <motion.span
                className="text-base"
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                ↑
              </motion.span>
              {/* Progress ring (decorative) */}
              <svg
                className="absolute inset-0 w-full h-full -rotate-90"
                viewBox="0 0 48 48"
              >
                <circle
                  cx="24"
                  cy="24"
                  r="22"
                  fill="none"
                  stroke="rgba(168, 85, 247, 0.3)"
                  strokeWidth="1"
                  strokeDasharray="138.2"
                  strokeDashoffset="0"
                  className="transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                />
              </svg>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#030014] to-transparent pointer-events-none z-20" />
    </section>
  );
};

export default Hero;
