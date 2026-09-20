import React from 'react';
import { motion } from 'framer-motion';
import { FaHome, FaUser, FaCode, FaProjectDiagram, FaEnvelope } from 'react-icons/fa';

interface MobileBottomNavProps {
  activeView: string;
  activeSection: string | null;
  onNavigatePage: (page: "home" | "hire" | "journey", targetSection?: string) => void;
}

const navLinks = [
  { name: "About", id: "about", icon: FaUser },
  { name: "Skills", id: "skills", icon: FaCode },
  { name: "Projects", id: "projects", icon: FaProjectDiagram },
  { name: "Contact", id: "contact", icon: FaEnvelope },
];

const renderIcon = (Icon: any, props: any = {}) => {
  return <Icon {...props} />;
};

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activeView, activeSection, onNavigatePage }) => {
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    if (targetId === "home") {
      onNavigatePage("home", "home");
    } else {
      onNavigatePage("home", targetId);
    }
  };

  const isHomeActive = activeView === "home" && (activeSection === "home" || activeSection === "hero" || !activeSection);

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100]">
      <div className="bg-[#030014]/90 backdrop-blur-2xl border-t border-white/10 shadow-[0_-8px_30px_rgba(0,0,0,0.6)] flex items-center justify-around px-2 py-2 pb-safe sm:pb-2">
        <a
          href="#home"
          onClick={(e) => handleLinkClick(e, "home")}
          className={`flex flex-col items-center justify-center w-16 h-12 rounded-xl transition-all active:scale-90 relative ${
            isHomeActive ? "text-cyan-400" : "text-slate-400 hover:text-white"
          }`}
        >
          {renderIcon(FaHome, { size: 20, className: "mb-1 z-10 relative" })}
          <span className="text-[10px] font-medium z-10 relative">Home</span>
          {isHomeActive && (
            <motion.div
              layoutId="activeBottomNav"
              className="absolute inset-0 rounded-xl bg-white/10"
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            />
          )}
        </a>
        
        {navLinks.map((link) => {
          const isActive = activeView === "home" && activeSection === link.id;
          return (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => handleLinkClick(e, link.id)}
              className={`flex flex-col items-center justify-center w-16 h-12 rounded-xl transition-all active:scale-90 relative ${
                isActive ? "text-cyan-400" : "text-slate-400 hover:text-white"
              }`}
            >
              {renderIcon(link.icon, { size: 20, className: "mb-1 z-10 relative" })}
              <span className="text-[10px] font-medium z-10 relative">{link.name}</span>
              {isActive && (
                <motion.div
                  layoutId="activeBottomNav"
                  className="absolute inset-0 rounded-xl bg-white/10"
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                />
              )}
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;
