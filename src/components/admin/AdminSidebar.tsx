import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaChartBar,
  FaChartLine,
  FaFolder,
  FaCode,
  FaUser,
  FaGraduationCap,
  FaFilePdf,
  FaEnvelope,
  FaStar,
  FaDatabase,
  FaSignOutAlt,
  FaCogs,
  FaBriefcase,
} from "react-icons/fa";
import { AdminNavTab, renderIcon } from "./types";
import { toProxyImageUrl } from "../../data/projectsData";

interface AdminSidebarProps {
  activeTab: AdminNavTab;
  setActiveTab: (tab: AdminNavTab) => void;
  counts: {
    analyticsTotal?: number;
    projects: number;
    skills: number;
    process?: number;
    education: number;
    experience?: number;
    messages: number;
    reviews: number;
  };
  profileImage?: string;
  profileName?: string;
  onLogout: () => void;
  isMobileNavOpen: boolean;
  setIsMobileNavOpen: (open: boolean) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  setActiveTab,
  counts,
  profileImage,
  profileName = "Admin",
  onLogout,
  isMobileNavOpen,
  setIsMobileNavOpen,
}) => {
  const navCategories = [
    {
      title: "WORKSPACE",
      items: [
        {
          id: "overview" as AdminNavTab,
          label: "Dashboard Overview",
          icon: FaChartBar,
          activeColor: "text-indigo-400",
        },
        {
          id: "analytics" as AdminNavTab,
          label: "Visitor Analytics",
          icon: FaChartLine,
          badge: counts.analyticsTotal || undefined,
          badgeColor: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
          activeColor: "text-cyan-400",
        },
      ],
    },
    {
      title: "CONTENT STUDIO",
      items: [
        {
          id: "projects" as AdminNavTab,
          label: "Project Catalog",
          icon: FaFolder,
          badge: counts.projects,
          badgeColor: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
          activeColor: "text-indigo-400",
        },
        {
          id: "skills" as AdminNavTab,
          label: "Skills & Stack",
          icon: FaCode,
          badge: counts.skills,
          badgeColor: "bg-purple-500/10 text-purple-300 border-purple-500/20",
          activeColor: "text-purple-400",
        },
        {
          id: "process" as AdminNavTab,
          label: "Development Process",
          icon: FaCogs,
          badge: counts.process,
          badgeColor: "bg-teal-500/10 text-teal-300 border-teal-500/20",
          activeColor: "text-teal-400",
        },
        {
          id: "profile" as AdminNavTab,
          label: "Profile & Bio Settings",
          icon: FaUser,
          activeColor: "text-cyan-400",
        },
        {
          id: "education" as AdminNavTab,
          label: "Education & Credentials",
          icon: FaGraduationCap,
          badge: counts.education,
          badgeColor: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
          activeColor: "text-cyan-400",
        },
        {
          id: "experience" as AdminNavTab,
          label: "Experience & Career",
          icon: FaBriefcase,
          badge: counts.experience,
          badgeColor: "bg-purple-500/10 text-purple-300 border-purple-500/20",
          activeColor: "text-purple-400",
        },
      ],
    },
    {
      title: "ASSETS & COMMS",
      items: [
        {
          id: "resume" as AdminNavTab,
          label: "Resume & Cloud Storage",
          icon: FaFilePdf,
          activeColor: "text-pink-400",
        },
        {
          id: "messages" as AdminNavTab,
          label: "Contact Inquiries",
          icon: FaEnvelope,
          badge: counts.messages > 0 ? counts.messages : undefined,
          badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
          activeColor: "text-emerald-400",
        },
        {
          id: "reviews" as AdminNavTab,
          label: "Project Reviews",
          icon: FaStar,
          badge: counts.reviews > 0 ? counts.reviews : undefined,
          badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
          activeColor: "text-amber-400",
        },
      ],
    },
    {
      title: "INFRASTRUCTURE",
      items: [
        {
          id: "setup" as AdminNavTab,
          label: "Supabase & Live SQL",
          icon: FaDatabase,
          activeColor: "text-emerald-400",
        },
      ],
    },
  ];

  return (
    <>
      {/* Left Navigation Sidebar (Desktop) */}
      <aside className="hidden md:flex w-64 lg:w-72 flex-shrink-0 flex-col justify-between h-full rounded-2xl bg-[#111726]/75 border border-white/[0.08] p-3.5 shadow-xl backdrop-blur-xl overflow-y-auto space-y-6">
        <div className="space-y-5">
          {navCategories.map((group) => (
            <div key={group.title} className="space-y-1">
              <div className="px-3 py-1">
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 font-mono">
                  {group.title}
                </span>
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group relative cursor-pointer ${
                        isActive
                          ? "bg-indigo-500/10 text-white border border-indigo-500/25 shadow-sm font-semibold"
                          : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent"
                      }`}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r bg-gradient-to-b from-indigo-500 to-cyan-400" />
                      )}
                      <span className="flex items-center gap-2.5">
                        {renderIcon(item.icon, {
                          size: 14,
                          className: isActive
                            ? item.activeColor
                            : "text-slate-500 group-hover:text-slate-300 transition-colors",
                        })}
                        <span>{item.label}</span>
                      </span>
                      {item.badge !== undefined && (
                        <span
                          className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-full border ${
                            item.badgeColor || "bg-white/10 text-slate-300 border-white/10"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* User Profile Mini Footer */}
        <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between gap-3 p-2 rounded-xl bg-white/[0.02]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/10 shrink-0 bg-slate-900">
              <img
                src={toProxyImageUrl(profileImage || "/images/img.jpg")}
                alt="Admin"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/images/img.jpg";
                }}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate leading-tight">
                {profileName}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-emerald-400 font-mono">Super Admin</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
            title="Sign Out"
          >
            {renderIcon(FaSignOutAlt, { size: 12 })}
          </button>
        </div>
      </aside>

      {/* Mobile Navigation Drawer Dropdown */}
      <AnimatePresence>
        {isMobileNavOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden w-full overflow-hidden rounded-2xl bg-[#111726] border border-white/[0.08] p-4 mb-4 shadow-2xl space-y-4"
          >
            {navCategories.map((group) => (
              <div key={group.title} className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 font-mono">
                  {group.title}
                </span>
                <div className="grid grid-cols-1 gap-1 pt-1">
                  {group.items.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setActiveTab(item.id);
                          setIsMobileNavOpen(false);
                        }}
                        className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                          isActive
                            ? "bg-indigo-500/15 text-white border border-indigo-500/30 font-semibold"
                            : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          {renderIcon(item.icon, {
                            size: 14,
                            className: isActive ? item.activeColor : "text-slate-500",
                          })}
                          <span>{item.label}</span>
                        </span>
                        {item.badge !== undefined && (
                          <span
                            className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-full border ${
                              item.badgeColor || "bg-white/10 text-slate-300 border-white/10"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
