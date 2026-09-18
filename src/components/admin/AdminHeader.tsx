import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBars,
  FaTimes,
  FaBell,
  FaInbox,
  FaStar,
  FaExternalLinkAlt,
  FaSignOutAlt,
  FaWhatsapp,
  FaBriefcase,
  FaEnvelope,
} from "react-icons/fa";
import { AdminNavTab, ProjectViewMode, renderIcon } from "./types";

interface AdminHeaderProps {
  activeTab: AdminNavTab;
  tabTitle: string;
  isSupabaseConfigured: boolean;
  userEmail?: string;
  isMobileNavOpen: boolean;
  setIsMobileNavOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  projectViewMode?: ProjectViewMode;
  editingProjectId?: string | null;
  messagesList: any[];
  unreadMessagesCount: number;
  newReviews: any[];
  newReviewsCount: number;
  onSelectMessage: (msg: any) => void;
  onMarkAllMessagesRead: () => void;
  onMarkReviewsSeen: () => void;
  setActiveTab: (tab: AdminNavTab) => void;
  onLogout: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  activeTab,
  tabTitle,
  isSupabaseConfigured,
  userEmail = "admin@maharab.dev",
  isMobileNavOpen,
  setIsMobileNavOpen,
  projectViewMode,
  editingProjectId,
  messagesList,
  unreadMessagesCount,
  newReviews,
  newReviewsCount,
  onSelectMessage,
  onMarkAllMessagesRead,
  onMarkReviewsSeen,
  setActiveTab,
  onLogout,
}) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const totalNotifications = unreadMessagesCount + newReviewsCount;

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between w-full h-16 px-4 border-b border-white/[0.08] bg-[#090d16]/85 backdrop-blur-xl sm:px-6 lg:px-8 shadow-sm">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={() => setIsMobileNavOpen((prev) => !prev)}
          className="p-2 -ml-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 md:hidden"
          aria-label="Toggle navigation menu"
        >
          {renderIcon(isMobileNavOpen ? FaTimes : FaBars, { size: 18 })}
        </button>

        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 font-bold text-xs text-white shadow-md shadow-indigo-500/20 shrink-0">
          MH
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 font-mono hidden sm:inline-block">
              Console /
            </span>
            <h1 className="text-xs sm:text-sm font-bold text-white tracking-tight">
              {tabTitle}
            </h1>
            {activeTab === "projects" && projectViewMode === "editor" && (
              <span className="px-2 py-0.5 text-[9px] font-mono font-bold rounded-md bg-indigo-500/15 border border-indigo-500/30 text-indigo-300">
                {editingProjectId ? "EDIT" : "NEW"}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-mono rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{isSupabaseConfigured ? "Supabase Live" : "Local Reactivity"}</span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono hidden md:inline-block">
              {userEmail}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Real-time Notification Bell & Popover */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsNotificationOpen((prev) => !prev)}
            title={totalNotifications > 0 ? `${totalNotifications} new notifications` : "Notifications"}
            className={`relative inline-flex items-center justify-center w-9 h-9 rounded-xl border transition-all cursor-pointer ${
              isNotificationOpen
                ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-300"
                : "bg-white/[0.02] hover:bg-white/[0.06] border-white/[0.08] hover:border-white/20 text-slate-300 hover:text-white"
            }`}
          >
            {renderIcon(FaBell, {
              size: 13,
              className: totalNotifications > 0 ? "text-amber-400" : "text-slate-400",
            })}
            {totalNotifications > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-rose-500 text-[9px] font-extrabold text-white shadow-lg ring-2 ring-[#0c101d] animate-pulse">
                {totalNotifications > 9 ? "9+" : totalNotifications}
              </span>
            )}
          </button>

          {/* Notification Dropdown Popover */}
          <AnimatePresence>
            {isNotificationOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsNotificationOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl bg-[#0f172a]/95 border border-white/10 backdrop-blur-2xl shadow-2xl p-4 space-y-3.5 z-50 overflow-hidden"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white tracking-wide uppercase">
                        Notifications
                      </span>
                      {totalNotifications > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          {totalNotifications} new
                        </span>
                      )}
                    </div>
                    {(unreadMessagesCount > 0 || newReviewsCount > 0) && (
                      <button
                        type="button"
                        onClick={() => {
                          onMarkAllMessagesRead();
                          onMarkReviewsSeen();
                        }}
                        className="text-[11px] font-medium text-indigo-400 hover:text-indigo-300 cursor-pointer"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  {/* Notification Messages List */}
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {messagesList.length === 0 ? (
                      <div className="py-6 text-center text-slate-500 text-xs">
                        {renderIcon(FaInbox, { size: 24, className: "mx-auto mb-2 text-slate-600" })}
                        <p>No contact inquiries received yet</p>
                      </div>
                    ) : (
                      messagesList.slice(0, 5).map((msg) => {
                        const isWhatsApp =
                          (msg.subject && msg.subject.toLowerCase().includes("whatsapp")) ||
                          (msg.message && msg.message.toLowerCase().includes("whatsapp")) ||
                          (msg.email && msg.email.includes("whatsapp"));
                        const isHire =
                          (msg.subject && msg.subject.toLowerCase().includes("collaborat")) ||
                          (msg.message && msg.message.toLowerCase().includes("collaborat")) ||
                          (msg.email && msg.email.includes("hire"));

                        return (
                          <div
                            key={msg.id}
                            onClick={() => {
                              onSelectMessage(msg);
                              setActiveTab("messages");
                              setIsNotificationOpen(false);
                            }}
                            className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                              !msg.read
                                ? "bg-indigo-500/10 border-indigo-500/30 hover:bg-indigo-500/15"
                                : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05]"
                            }`}
                          >
                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                isWhatsApp
                                  ? "bg-emerald-500/20 text-emerald-400"
                                  : isHire
                                  ? "bg-purple-500/20 text-purple-400"
                                  : "bg-cyan-500/20 text-cyan-400"
                              }`}
                            >
                              {renderIcon(
                                isWhatsApp
                                  ? FaWhatsapp
                                  : isHire
                                  ? FaBriefcase
                                  : FaEnvelope,
                                { size: 12 }
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-xs font-semibold text-white truncate">
                                  {msg.name || "Anonymous Lead"}
                                </span>
                                <span className="text-[10px] text-slate-500 font-mono flex-shrink-0">
                                  {new Date(msg.created_at).toLocaleDateString(undefined, {
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-300 truncate mt-0.5 font-medium">
                                {msg.subject || msg.message}
                              </p>
                            </div>
                            {!msg.read && (
                              <span className="w-2 h-2 rounded-full bg-indigo-400 mt-1 flex-shrink-0" />
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* New Reviews Section */}
                  {newReviews.length > 0 && (
                    <div className="pt-2 border-t border-white/[0.06]">
                      <div className="flex items-center gap-1.5 mb-2">
                        {renderIcon(FaStar, { size: 10, className: "text-amber-400" })}
                        <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                          New Reviews
                        </span>
                        <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {newReviews.length}
                        </span>
                      </div>
                      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                        {newReviews.map((rev) => (
                          <div
                            key={rev.id}
                            onClick={() => {
                              onMarkReviewsSeen();
                              setActiveTab("reviews");
                              setIsNotificationOpen(false);
                            }}
                            className="p-2.5 rounded-xl border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 transition-all cursor-pointer flex items-start gap-2.5"
                          >
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 bg-amber-500/20 text-amber-400">
                              {renderIcon(FaStar, { size: 11 })}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-xs font-semibold text-white truncate">
                                  {rev.name}
                                </span>
                                <span className="text-[10px] text-slate-500 font-mono flex-shrink-0">
                                  {new Date(rev.created_at).toLocaleDateString(undefined, {
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400 truncate mt-0.5">
                                {"★".repeat(rev.rating || 5)} · {rev.project_id}
                              </p>
                              <p className="text-[11px] text-slate-300 truncate font-light">
                                {rev.message}
                              </p>
                            </div>
                            <span className="w-2 h-2 rounded-full bg-amber-400 mt-1 flex-shrink-0" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("messages");
                      setIsNotificationOpen(false);
                    }}
                    className="w-full py-2 text-center text-xs font-semibold rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition-all cursor-pointer block"
                  >
                    View All in Contact Inquiries →
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            window.location.hash = "";
            window.location.reload();
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white border border-white/[0.08] hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.06] rounded-xl transition-all cursor-pointer"
        >
          {renderIcon(FaExternalLinkAlt, { size: 10, className: "text-slate-400" })}
          <span className="hidden sm:inline">View Live Site</span>
          <span className="sm:hidden">Site</span>
        </a>

        <button
          onClick={onLogout}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-400 hover:text-rose-300 border border-rose-500/20 hover:border-rose-500/40 bg-rose-500/5 hover:bg-rose-500/10 rounded-xl transition-all cursor-pointer"
        >
          {renderIcon(FaSignOutAlt, { size: 11 })}
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
};
