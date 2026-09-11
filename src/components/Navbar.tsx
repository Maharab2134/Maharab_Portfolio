import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaUser,
  FaGraduationCap,
  FaCode,
  FaProjectDiagram,
  FaEnvelope,
  FaRocket,
} from "react-icons/fa";
import { PORTFOLIO_INFO } from "../data/portfolioData";
import { useLiveProfile } from "../lib/portfolioService";

interface NavbarProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  onNavigatePage?: (page: "home" | "hire" | "journey") => void;
}

const renderIcon = (Icon: any, props: any = {}) => {
  return <Icon {...props} />;
};

const navLinks = [
  { name: "Home", href: "#home", id: "home", icon: FaHome },
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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const sections = ["home", "about", "education", "certificates", "skills", "projects", "contact"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
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

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.substring(1);
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
      setIsMenuOpen(false);
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
            className="flex items-center gap-3 group"
          >
            <div className="relative flex items-center justify-center w-10 h-10 overflow-hidden font-bold text-white transition-transform duration-300 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-500 to-cyan-400 group-hover:scale-105 shadow-md shadow-purple-500/20 border border-white/20">
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
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-white transition-colors duration-300 group-hover:text-purple-300">
                {displayName}
              </span>
              <span className="text-[11px] font-medium tracking-wide text-cyan-400/80">
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

            {/* Hire Me CTA Button */}
            <a
              href="#hire"
              onClick={() => {
                if (onNavigatePage) onNavigatePage("hire");
                else window.location.hash = "#hire";
              }}
              className="relative inline-flex items-center gap-2 px-5 py-2 ml-3 text-sm font-semibold text-white transition-all duration-300 rounded-full group bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105 active:scale-95"
            >
              <span>Hire Me</span>
              {renderIcon(FaRocket, { size: 12, className: "transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" })}
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <a
              href="#hire"
              onClick={() => {
                if (onNavigatePage) onNavigatePage("hire");
                else window.location.hash = "#hire";
              }}
              className="px-3 py-1.5 text-xs font-semibold text-white rounded-full bg-gradient-to-r from-purple-600 to-pink-600"
            >
              Hire Me
            </a>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2.5 text-slate-300 transition-colors rounded-xl bg-white/5 border border-white/10 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500"
              aria-label={isMenuOpen ? "Close menu" : "Open navigation menu"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? renderIcon(FaTimes, { size: 20 }) : renderIcon(FaBars, { size: 20 })}
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

              <div className="pt-3 my-2 border-t border-white/10">
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
