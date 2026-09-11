import React from "react";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaHeart,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { PORTFOLIO_INFO } from "../data/portfolioData";

const renderIcon = (Icon: any, props: any = {}) => {
  return <Icon {...props} />;
};

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      icon: FaGithub,
      href: PORTFOLIO_INFO.socials.github,
      label: "GitHub",
      color: "hover:text-white hover:border-purple-400",
    },
    {
      icon: FaLinkedin,
      href: PORTFOLIO_INFO.socials.linkedin,
      label: "LinkedIn",
      color: "hover:text-cyan-300 hover:border-cyan-400",
    },
    {
      icon: FaTwitter,
      href: PORTFOLIO_INFO.socials.twitter,
      label: "Twitter / X",
      color: "hover:text-sky-300 hover:border-sky-400",
    },
    {
      icon: FaEnvelope,
      href: `mailto:${PORTFOLIO_INFO.email}`,
      label: "Email",
      color: "hover:text-pink-300 hover:border-pink-400",
    },
  ];

  const quickNav = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Education", href: "#education" },
    { label: "Certificates", href: "#certificates" },
    { label: "Skills", href: "#skills" },
    { label: "Projects", href: "#projects" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <footer className="relative pt-16 pb-12 overflow-hidden border-t bg-[#030014] border-white/10">
      {/* Background Subtle Ambience */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute -bottom-24 left-1/4 w-96 h-96 rounded-full bg-purple-600/20 blur-[130px]" />
        <div className="absolute -top-24 right-1/4 w-96 h-96 rounded-full bg-cyan-600/15 blur-[130px]" />
      </div>

      <div className="relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 lg:gap-12 pb-12 border-b border-white/5">
          {/* Brand & Narrative */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-10 h-10 overflow-hidden font-bold text-white rounded-xl bg-gradient-to-tr from-purple-600 via-pink-500 to-cyan-400 shadow-md shadow-purple-500/20 border border-white/20">
                <img
                  src={PORTFOLIO_INFO.profileImage}
                  alt={PORTFOLIO_INFO.name}
                  className="object-cover object-top w-full h-full"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <span className="absolute inset-0 flex items-center justify-center -z-10">
                  MH
                </span>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                {PORTFOLIO_INFO.name}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400 max-w-sm">
              Full-Stack Software Engineer &amp; Mobile Developer dedicated to creating scalable, resilient digital experiences with thoughtful design.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map(({ icon: Icon, href, label, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`flex items-center justify-center w-10 h-10 text-slate-400 transition-all duration-200 border rounded-xl bg-white/[0.03] border-white/10 ${color} hover:scale-110 active:scale-95`}
                >
                  {renderIcon(Icon, { size: 16 })}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold tracking-widest uppercase text-cyan-400">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              {quickNav.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Direct Contact Info */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-semibold tracking-widest uppercase text-purple-400">
              Direct Contact
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2.5 text-slate-400">
                {renderIcon(FaEnvelope, { size: 13, className: "text-purple-400 flex-shrink-0" })}
                <a href={`mailto:${PORTFOLIO_INFO.email}`} className="hover:text-white transition-colors truncate">
                  {PORTFOLIO_INFO.email}
                </a>
              </li>

              <li className="flex items-center gap-2.5 text-slate-400">
                {renderIcon(FaPhoneAlt, { size: 12, className: "text-cyan-400 flex-shrink-0" })}
                <a href={`tel:${PORTFOLIO_INFO.phone.replace(/\s+/g, "")}`} className="hover:text-white transition-colors">
                  {PORTFOLIO_INFO.phone}
                </a>
              </li>

              <li className="flex items-center gap-2.5 text-slate-400">
                {renderIcon(FaMapMarkerAlt, { size: 13, className: "text-pink-400 flex-shrink-0" })}
                <a
                  href={PORTFOLIO_INFO.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  {PORTFOLIO_INFO.location}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Status */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs text-slate-500">
          <p className="flex items-center gap-1.5">
            <span>© {currentYear} {PORTFOLIO_INFO.name}. Built with</span>
            {renderIcon(FaHeart, { size: 12, className: "text-rose-500 inline" })}
            <span>React, TypeScript &amp; Tailwind CSS.</span>
          </p>

          <div className="flex items-center gap-2 text-slate-400">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Available for new opportunities</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
