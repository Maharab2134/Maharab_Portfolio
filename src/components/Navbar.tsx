import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBars,
  FaTimes,
  FaUser,
  FaGraduationCap,
  FaCode,
  FaProjectDiagram,
  FaEnvelope,
  FaRocket,
} from "react-icons/fa";
import { PORTFOLIO_INFO } from "../data/portfolioData";
import { useLiveProfile, calculateWorkStatus } from "../lib/portfolioService";
import LanguageSelector from "./LanguageSelector";

interface NavbarProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  onNavigatePage?: (page: "home" | "hire" | "journey", targetSection?: string) => void;
}

const renderIcon = (Icon: any, props: any = {}) => {
  return <Icon {...props} />;
};

const navLinks = [
  { name: "About", href: "#about", id: "about", icon: FaUser },
  { name: "Education", href: "#education", id: "education", icon: FaGraduationCap },
  { name: "Skills", href: "#skills", id: "skills", icon: FaCode },
  { name: "Projects", href: "#projects", id: "projects", icon: FaProjectDiagram },
  { name: "Contact", href: "#contact", id: "contact", icon: FaEnvelope },
];

const Navbar: React.FC<NavbarProps> = ({ isMenuOpen, setIsMenuOpen, onNavigatePage }) => {
  const profile = useLiveProfile();

  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const isProgrammaticScrollRef = useRef(false);

  // Real-time work status evaluation (recomputed every 20 seconds)
  const [workStatus, setWorkStatus] = useState(() =>
    calculateWorkStatus((profile as any).workingHours)
  );

  useEffect(() => {
    setWorkStatus(calculateWorkStatus((profile as any).workingHours));

    const intervalId = setInterval(() => {
      setWorkStatus(calculateWorkStatus((profile as any).workingHours));
    }, 20000);

    return () => clearInterval(intervalId);
  }, [profile]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setScrolled(scrollY > 30);

      // When scrolled near the top in Hero section, automatically remove section hash (unless programmatic scroll is running)
      if (!isProgrammaticScrollRef.current && scrollY < 120) {
        setActiveSection("home");
        const hash = window.location.hash;
        if (hash && !["#admin", "#hire", "#journey"].includes(hash)) {
          window.history.replaceState(null, "", window.location.pathname + window.location.search);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const sections = [
      "home",
      "about",
      "education",
      "experience",
      "certificates",
      "skills",
      "process",
      "projects",
      "contact",
    ];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Avoid intermediate hash flickering during programmatic navbar link scroll
            if (isProgrammaticScrollRef.current) return;

            const sectionId = entry.target.id;
            setActiveSection(sectionId);

            // Sync URL hash with the section currently in viewport
            const currentHash = window.location.hash;
            if (["#admin", "#hire", "#journey"].includes(currentHash)) return;

            if (sectionId === "home") {
              if (currentHash && currentHash !== "#home") {
                window.history.replaceState(null, "", window.location.pathname + window.location.search);
              }
            } else {
              const targetHash = `#${sectionId}`;
              if (currentHash !== targetHash) {
                window.history.replaceState(null, "", window.location.pathname + window.location.search + targetHash);
              }
            }
          }
        });
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0,
      }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const scrollToTarget = (targetId: string) => {
    // 1. Immediately unlock scroll on body
    document.body.style.overflow = "";

    isProgrammaticScrollRef.current = true;
    setTimeout(() => {
      isProgrammaticScrollRef.current = false;
    }, 1200);

    if (targetId === "home") {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
      setActiveSection("home");
      return;
    }

    const element = document.getElementById(targetId);
    if (element) {
      const headerOffset = 70;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: "smooth",
      });

      window.history.replaceState(null, "", window.location.pathname + window.location.search + `#${targetId}`);
      setActiveSection(targetId);

      // Re-align once mobile menu drawer collapse transition completes
      setTimeout(() => {
        const recheckEl = document.getElementById(targetId);
        if (recheckEl) {
          const newPos = recheckEl.getBoundingClientRect().top;
          if (Math.abs(newPos - headerOffset) > 15) {
            const recheckOffset = newPos + window.scrollY - headerOffset;
            window.scrollTo({
              top: Math.max(0, recheckOffset),
              behavior: "smooth",
            });
          }
        }
      }, 320);
    }
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.substring(1);

      // Instantly release body scroll lock and close mobile drawer
      document.body.style.overflow = "";
      setIsMenuOpen(false);

      const element = document.getElementById(targetId);
      if (element) {
        // Section is present on current page - scroll directly to it without resetting view or jumping to Hero!
        scrollToTarget(targetId);
      } else if (onNavigatePage) {
        // Target is not on current page (e.g. user was on /hire or /journey)
        onNavigatePage("home", targetId);
      }
    }
  };

  const displayName = profile.shortName || profile.name || "Md. Maharab";
  const displayTitle = profile.title || "Software Developer";
  const initials = (profile.shortName || profile.name || "MH")
    .split(" ")
    .filter(Boolean)
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? "bg-[#030014]/85 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/30"
          : "bg-transparent"
        }`}
    >
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <a
            href="#home"
            onClick={(e) => handleLinkClick(e, "#home")}
            aria-label={`${profile.name || PORTFOLIO_INFO.name} Home`}
            className="flex items-center gap-2.5 sm:gap-3 group min-w-0 max-w-[calc(100%-120px)] sm:max-w-none"
          >
            <div className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 shrink-0 overflow-hidden font-bold text-white transition-transform duration-300 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-500 to-cyan-400 group-hover:scale-105 shadow-md shadow-purple-500/20 border border-white/20">
              <img
                src={profile.profileImage || PORTFOLIO_INFO.profileImage}
                alt={profile.name || PORTFOLIO_INFO.name}
                className="object-cover object-top w-full h-full"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-base tracking-wider -z-10">
                {initials || "MH"}
              </span>
              <div className="absolute inset-0 transition-opacity opacity-0 bg-white/20 group-hover:opacity-100" />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-sm sm:text-base font-bold tracking-tight text-white transition-colors duration-300 group-hover:text-purple-300 truncate">
                  {displayName}
                </span>

                {/* Live Radial Blinking Status Light (Green / Red) */}
                {((profile as any).workingHours?.enabled ?? true) && (
                  <div
                    className="relative flex items-center justify-center shrink-0 cursor-help group/status ml-0.5"
                    title={`${workStatus.statusLabel} • ${workStatus.timeString ? `${workStatus.timeString} ` : ""}(${workStatus.timezone.replace("_", " ")})`}
                  >
                    {/* Blinking Ping Halo */}
                    <span
                      className={`animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full opacity-75 ${
                        workStatus.isOnline ? "bg-emerald-400" : "bg-rose-500"
                      }`}
                    />
                    {/* Solid Core Dot with Radial Glow */}
                    <span
                      className={`relative inline-flex rounded-full h-2 w-2 ${
                        workStatus.isOnline
                          ? "bg-emerald-400 shadow-[0_0_8px_#34d399]"
                          : "bg-rose-500 shadow-[0_0_8px_#f43f5e]"
                      }`}
                    />
                  </div>
                )}
              </div>
              <span className="text-[10px] sm:text-[11px] font-medium tracking-wide text-cyan-400/80 truncate">
                {displayTitle}
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="items-center hidden space-x-1 lg:space-x-2 md:flex" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`relative px-3.5 py-2 text-sm font-medium transition-all duration-200 rounded-lg group ${isActive ? "text-white" : "text-slate-300 hover:text-white"
                    }`}
                >
                  <span className="relative z-10 flex items-center gap-1.5">
                    {renderIcon(link.icon, { size: 13, className: isActive ? "text-cyan-400" : "text-slate-400 group-hover:text-cyan-300 transition-colors" })}
                    {link.name}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 rounded-lg bg-white/10 border border-white/10 backdrop-blur-md -z-0"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}

            {/* Language Switcher (Google Translate Real-Time Translation) */}
            <div className="ml-1.5 lg:ml-2">
              <LanguageSelector />
            </div>

            {/* Hire Me CTA Button */}
            <a
              href="#hire"
              onClick={() => {
                if (onNavigatePage) onNavigatePage("hire");
                else window.location.hash = "#hire";
              }}
              className="relative inline-flex items-center gap-2 px-5 py-2 ml-2 text-sm font-semibold text-white transition-all duration-300 rounded-full group bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105 active:scale-95"
            >
              <span>Hire Me</span>
              {renderIcon(FaRocket, { size: 12, className: "transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" })}
            </a>
          </nav>

          {/* Mobile Menu Button & Language Switcher */}
          <div className="flex items-center gap-1.5 sm:gap-2 md:hidden shrink-0">
            <LanguageSelector isMobileCompact dropdownAlign="right" />
            <a
              href="#hire"
              onClick={() => {
                if (onNavigatePage) onNavigatePage("hire");
                else window.location.hash = "#hire";
              }}
              className="shrink-0 whitespace-nowrap px-3 py-1.5 text-xs font-semibold text-white rounded-full bg-gradient-to-r from-purple-600 to-pink-600 shadow-md shadow-purple-500/20 active:scale-95 transition-transform"
            >
              Hire Me
            </a>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-slate-300 transition-colors rounded-xl bg-white/5 border border-white/10 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500 shrink-0"
              aria-label={isMenuOpen ? "Close menu" : "Open navigation menu"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? renderIcon(FaTimes, { size: 17 }) : renderIcon(FaBars, { size: 17 })}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-[#030014]/95 backdrop-blur-2xl border-b border-white/10 overflow-hidden"
          >
            <div className="px-4 pt-3 pb-6 space-y-1">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className={`flex items-center gap-3 px-4 py-3 text-base font-medium rounded-xl transition-colors ${isActive
                        ? "text-white bg-white/10 border border-white/10"
                        : "text-slate-300 hover:text-white hover:bg-white/5"
                      }`}
                  >
                    <span className="p-2 rounded-lg bg-white/5 text-cyan-400">
                      {renderIcon(link.icon, { size: 16 })}
                    </span>
                    <span>{link.name}</span>
                  </a>
                );
              })}

              <div className="pt-3 my-2 border-t border-white/10 space-y-3">
                {/* Mobile Drawer Language Row */}
                <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-xs font-medium text-slate-300 flex items-center gap-2">
                    <span className="text-purple-400">🌐</span>
                    <span>Website Language</span>
                  </span>
                  <LanguageSelector dropdownAlign="right" />
                </div>

                <a
                  href="#hire"
                  onClick={() => {
                    setIsMenuOpen(false);
                    if (onNavigatePage) onNavigatePage("hire");
                    else window.location.hash = "#hire";
                  }}
                  className="flex items-center justify-center gap-2 w-full px-5 py-3 text-base font-semibold text-white rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 shadow-lg shadow-purple-500/20"
                >
                  <span>Hire Me / Work Together</span>
                  {renderIcon(FaRocket, { size: 14 })}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
