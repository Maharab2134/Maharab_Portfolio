import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaPaperPlane,
  FaRedo,
  FaExternalLinkAlt,
  FaMinus,
  FaUser,
  FaFolder,
  FaCode,
  FaBriefcase,
  FaAward,
  FaEnvelope,
  FaFileAlt,
  FaCompass,
} from "react-icons/fa";
import {
  ChatMessage,
  ChatAction,
  PortfolioChatbotEngine,
  formatOneLineDescription,
} from "../lib/chatbotService";
import { ActiveContext } from "../lib/chatbotKnowledge";
import { Project, getAllProjectsSync, toProxyImageUrl } from "../data/projectsData";

interface ChatbotProps {
  activeView: "home" | "hire" | "journey" | "project" | "admin" | "case-studies";
  selectedProject?: Project | null;
  activeSection?: string | null;
  onNavigateView?: (view: string) => void;
  onSelectProject?: (project: Project) => void;
}

const renderIcon = (Icon: any, props: any = {}) => {
  return <Icon {...props} />;
};

export const Chatbot: React.FC<ChatbotProps> = ({
  activeView,
  selectedProject,
  activeSection,
  onNavigateView,
  onSelectProject,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  const context: ActiveContext = {
    view: activeView,
    project: selectedProject,
    section: activeSection,
  };

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    PortfolioChatbotEngine.getInitialMessage(context),
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update initial message if context changes and chat hasn't started yet
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id.includes("init")) {
        return [
          PortfolioChatbotEngine.getInitialMessage({
            view: activeView,
            project: selectedProject,
            section: activeSection,
          }),
        ];
      }
      return prev;
    });
  }, [activeView, selectedProject, activeSection]);

  // Scroll to bottom on new messages (keep at top on initial load so greeting is visible)
  useEffect(() => {
    if (isOpen) {
      if (messages.length > 1 || isTyping) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      } else {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = 0;
        }
      }
    }
  }, [messages, isTyping, isOpen]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // Keyboard shortcut: ESC to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Responsive assistant delay to provide a polished interactive feel
    setTimeout(() => {
      const reply = PortfolioChatbotEngine.processQuery(query, context);
      setMessages((prev) => [...prev, reply]);
      setIsTyping(false);
      if (!isOpen) setHasUnread(true);
    }, 220);
  };

  const handleActionClick = (action: ChatAction) => {
    if (action.type === "url") {
      if (action.target) {
        window.open(action.target, "_blank", "noopener,noreferrer");
      }
      return;
    }

    if (action.type === "scroll") {
      if (activeView !== "home" && onNavigateView) {
        onNavigateView("home");
      }
      setTimeout(() => {
        const el = document.getElementById(action.target);
        if (el) {
          const targetTop = el.getBoundingClientRect().top + window.scrollY - 70;
          window.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
        }
      }, 100);
      return;
    }

    if (action.type === "project") {
      let targetProj = action.projectData;
      if (!targetProj) {
        const all = getAllProjectsSync();
        targetProj = all.find((p) => p.id === action.target);
      }
      if (targetProj && onSelectProject) {
        onSelectProject(targetProj);
      }
      return;
    }

    if (action.type === "view") {
      if (onNavigateView) {
        onNavigateView(action.target as any);
      }
      return;
    }
  };

  const handleResetChat = () => {
    setMessages([PortfolioChatbotEngine.getInitialMessage(context)]);
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = 0;
    }
  };

  const renderFormattedText = (rawText: string) => {
    const lines = rawText.split("\n");
    return lines.map((line, idx) => {
      // Heading 3
      if (line.startsWith("### ")) {
        return (
          <h4 key={idx} className="font-bold text-white text-xs sm:text-sm mt-2 mb-1">
            {line.replace("### ", "").replace(/\*\*/g, "")}
          </h4>
        );
      }
      // Blockquote
      if (line.startsWith("> ")) {
        return (
          <blockquote
            key={idx}
            className="border-l-2 border-purple-400 pl-2 text-xs italic text-slate-300 my-1 bg-purple-500/10 py-1 rounded-r"
          >
            {line.replace("> ", "")}
          </blockquote>
        );
      }
      // Bullet list item
      if (line.startsWith("- ")) {
        const bulletText = line.replace("- ", "");
        return (
          <div key={idx} className="flex items-start gap-1.5 text-xs my-0.5 text-slate-200">
            <span className="text-purple-400 mt-0.5">•</span>
            <span>{renderInlineFormatting(bulletText)}</span>
          </div>
        );
      }
      // Empty line
      if (!line.trim()) {
        return <div key={idx} className="h-1.5" />;
      }
      // Standard line
      return (
        <p key={idx} className="text-xs text-slate-200 leading-relaxed my-0.5">
          {renderInlineFormatting(line)}
        </p>
      );
    });
  };

  const renderInlineFormatting = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\))/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-semibold text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
      if (linkMatch) {
        return (
          <a
            key={i}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 underline font-medium"
          >
            {linkMatch[1]}
          </a>
        );
      }
      return part;
    });
  };

  // Prototype Quick Action Buttons
  const quickActions = [
    { label: "About me", icon: FaUser, prompt: "Tell me about yourself" },
    { label: "My projects", icon: FaFolder, prompt: "What projects are available?" },
    { label: "Skills", icon: FaCode, prompt: "What skills do you have?" },
    { label: "Experience", icon: FaBriefcase, prompt: "What is your career experience?" },
    { label: "Certifications", icon: FaAward, prompt: "Show certifications" },
    { label: "Contact", icon: FaEnvelope, prompt: "How can I contact you?" },
    { label: "Download CV", icon: FaFileAlt, prompt: "Where can I find your CV?" },
    { label: "Guide me", icon: FaCompass, prompt: "Guide me through the portfolio" },
  ];

  return (
    <>
      {/* Floating Launcher Button - Positioned with clear gap directly above SmartScrollButton */}
      {!isOpen && (
        <div className="fixed bottom-[96px] sm:bottom-[100px] right-6 z-40 pointer-events-auto flex items-center gap-3">
          {/* Prototype-style Speech Bubble Callout */}
          <motion.div
            initial={{ opacity: 0, x: 8, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="hidden sm:flex flex-col items-end relative pointer-events-none"
          >
            <div className="relative px-3.5 py-2 rounded-2xl bg-slate-900/95 border border-purple-500/30 shadow-xl shadow-purple-950/50 text-right backdrop-blur-xl">
              <span className="text-[11px] text-slate-300 font-medium block leading-tight">
                Have a question?
              </span>
              <span className="text-[12px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-300 leading-tight">
                Ask Maharab!
              </span>
              {/* Arrow tail */}
              <span className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-slate-900 border-t border-r border-purple-500/30 rotate-45" />
            </div>
          </motion.div>

          {/* Floating Robot Launcher Button */}
          <motion.button
            onClick={() => setIsOpen(true)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            aria-label="Open Ask Maharab AI Assistant"
            className="relative group w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-slate-950/90 border border-purple-500/40 p-2 shadow-xl shadow-purple-950/60 backdrop-blur-xl flex items-center justify-center cursor-pointer transition-all duration-300 hover:border-cyan-400 hover:shadow-cyan-500/30"
          >
            {/* Ambient Glow */}
            <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 opacity-60 blur-md group-hover:opacity-100 transition duration-500 -z-10 animate-pulse" />

            {/* Robot Icon Image */}
            <img
              src="/chatbot.png"
              alt="Ask Maharab"
              className="w-full h-full object-contain rounded-full"
            />

            {/* Red / Coral Notification Dot */}
            <span
              className={`absolute top-0 right-0 w-3.5 h-3.5 bg-rose-500 border-2 border-slate-950 rounded-full shadow-sm ${
                hasUnread ? "animate-bounce" : ""
              }`}
            />
          </motion.button>
        </div>
      )}

      {/* Floating Chat Window Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="fixed bottom-4 sm:bottom-6 right-3 sm:right-6 z-50 w-[95vw] sm:w-[420px] h-[640px] sm:h-[680px] max-h-[calc(100vh-2rem)] rounded-3xl bg-slate-950/95 border border-slate-800/90 backdrop-blur-2xl shadow-2xl shadow-purple-950/60 flex flex-col overflow-hidden text-slate-100"
          >
            {/* Ambient Background Glows */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2.5rem_2.5rem]" />
            <div className="absolute -top-20 -right-20 w-44 h-44 rounded-full bg-purple-600/25 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-44 h-44 rounded-full bg-cyan-600/20 blur-3xl pointer-events-none" />

            {/* Prototype Header (Always visible at top of modal) */}
            <div className="sticky top-0 z-20 px-4 py-3 border-b border-white/10 bg-slate-900/95 backdrop-blur-md flex items-center justify-between shrink-0 shadow-sm">
              <div className="flex items-center gap-3">
                {/* Developer Profile Avatar with Online Dot */}
                <div className="relative w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 via-indigo-500 to-cyan-400 p-[1.5px] shadow-md flex-shrink-0">
                  <img
                    src="/images/img.jpg"
                    alt="Maharab"
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/chatbot.png";
                    }}
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-slate-950 rounded-full shadow-sm" />
                </div>

                {/* Name & Title */}
                <div>
                  <h3 className="text-sm font-bold text-white tracking-wide leading-tight">
                    Ask Maharab
                  </h3>
                  <p className="text-[10px] text-slate-400 font-medium leading-tight">
                    Portfolio Assistant
                  </p>
                </div>
              </div>

              {/* Controls: Reset, Minimize, Close */}
              <div className="flex items-center gap-1.5 text-slate-400">
                <button
                  onClick={handleResetChat}
                  title="Reset conversation"
                  aria-label="Reset chat"
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors"
                >
                  {renderIcon(FaRedo, { size: 11 })}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Minimize Assistant"
                  aria-label="Minimize chat"
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors"
                >
                  {renderIcon(FaMinus, { size: 11 })}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close Assistant (Esc)"
                  aria-label="Close chat"
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-rose-500/20 hover:text-rose-300 text-slate-200 transition-colors"
                >
                  {renderIcon(FaTimes, { size: 15 })}
                </button>
              </div>
            </div>

            {/* Active Context Banner */}
            {(selectedProject || activeView !== "home" || activeSection) && (
              <div className="relative z-10 px-3.5 py-1.5 bg-purple-950/40 border-b border-purple-500/20 flex items-center justify-between text-[10px] text-purple-200">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
                  <span className="font-semibold uppercase tracking-wider text-[9px] text-purple-300">
                    Context:
                  </span>
                  <span className="truncate font-medium text-white">
                    {selectedProject
                      ? `Project • ${selectedProject.title}`
                      : activeView === "case-studies"
                      ? "Case Studies Blueprint"
                      : activeView === "journey"
                      ? "My Journey"
                      : activeView === "hire"
                      ? "Hire Page"
                      : activeSection
                      ? `${activeSection.toUpperCase()} Section`
                      : "Portfolio Home"}
                  </span>
                </div>
              </div>
            )}

            {/* Messages Stream */}
            <div
              ref={messagesContainerRef}
              className="relative z-10 flex-1 overflow-y-auto p-3.5 pt-4 space-y-3.5 text-xs scrollbar-thin scrollbar-thumb-purple-600/30 scrollbar-track-transparent"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 shadow-md ${
                      msg.sender === "user"
                        ? "bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-br-sm border border-purple-400/30"
                        : "bg-slate-900/90 text-slate-100 rounded-tl-sm border border-white/10 backdrop-blur-md"
                    }`}
                  >
                    {msg.sender === "bot" ? (
                      <div>{renderFormattedText(msg.text)}</div>
                    ) : (
                      <p className="text-xs leading-relaxed">{msg.text}</p>
                    )}
                  </div>

                  {/* Prototype 2-Column Quick Action Grid */}
                  {msg.showQuickActionGrid && (
                    <div className="mt-3 w-full space-y-3">
                      <div className="grid grid-cols-2 gap-2 w-full">
                        {quickActions.map((action, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSend(action.prompt)}
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800/80 hover:border-purple-500/50 text-slate-300 hover:text-white transition-all duration-200 cursor-pointer text-left shadow-sm group"
                          >
                            <span className="text-purple-400 group-hover:text-cyan-300 text-xs transition-colors flex-shrink-0">
                              {renderIcon(action.icon, { size: 12 })}
                            </span>
                            <span className="text-[11px] font-semibold tracking-tight truncate">
                              {action.label}
                            </span>
                          </button>
                        ))}
                      </div>

                      {/* Prototype Suggested / Example Questions */}
                      <div className="pt-1">
                        <div className="flex items-center gap-1.5 mb-2 px-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Suggested Questions
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            "Tell me about you",
                            "What projects are available?",
                            "What technologies do you use?",
                            "How can I contact you?",
                            "Where can I find your CV?",
                          ].map((suggested, sIdx) => (
                            <button
                              key={sIdx}
                              onClick={() => handleSend(suggested)}
                              className="text-[10.5px] px-2.5 py-1 rounded-full bg-slate-900/80 hover:bg-purple-900/30 border border-slate-800/90 hover:border-purple-500/40 text-slate-300 hover:text-purple-200 transition-all duration-150 cursor-pointer text-left"
                            >
                              "{suggested}"
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Prototype Project Cards: Strictly 1 Line Description with ... */}
                  {msg.projectsList && msg.projectsList.length > 0 && (
                    <div className="space-y-2 mt-2.5 w-full">
                      {msg.projectsList.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => {
                            if (onSelectProject) {
                              onSelectProject(p);
                            }
                          }}
                          className="group relative flex items-center gap-3 p-2.5 rounded-2xl bg-slate-900/95 hover:bg-slate-850 border border-slate-800/90 hover:border-purple-500/50 transition-all duration-200 cursor-pointer shadow-md overflow-hidden"
                        >
                          {/* Project Thumbnail */}
                          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-slate-950 flex-shrink-0 border border-white/10">
                            <img
                              src={toProxyImageUrl(p.image)}
                              alt={p.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = "none";
                              }}
                            />
                          </div>

                          {/* Project Details */}
                          <div className="flex-1 min-w-0 pr-1">
                            <div className="flex items-center justify-between gap-1">
                              <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-purple-300 transition-colors truncate">
                                {p.title}
                              </h4>
                              <span className="text-slate-400 group-hover:text-cyan-300 text-[11px] transition-colors flex-shrink-0">
                                {renderIcon(FaExternalLinkAlt, { size: 10 })}
                              </span>
                            </div>

                            {/* STRICTLY ONE-LINE DESCRIPTION ENDING IN ... */}
                            <p className="text-[11px] text-slate-400 truncate line-clamp-1 leading-normal my-0.5">
                              {formatOneLineDescription(p.description)}
                            </p>

                            {/* Tech Stack Pills */}
                            <div className="flex flex-wrap gap-1 mt-1">
                              {p.technologies.slice(0, 3).map((tech, tIdx) => (
                                <span
                                  key={tIdx}
                                  className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-slate-800 text-purple-200 border border-purple-500/20"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Interactive Action Pills (hidden if quick action grid is displayed) */}
                  {msg.actions && msg.actions.length > 0 && !msg.showQuickActionGrid && (
                    <div className="flex flex-wrap gap-1.5 mt-2 max-w-[95%]">
                      {msg.actions.map((act, aIdx) => (
                        <button
                          key={aIdx}
                          onClick={() => handleActionClick(act)}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all duration-200 cursor-pointer ${
                            act.primary
                              ? "bg-gradient-to-r from-purple-600 to-cyan-500 text-white border border-white/20 shadow-md shadow-purple-900/30 hover:brightness-110"
                              : "bg-slate-800/90 text-purple-200 border border-purple-500/30 hover:bg-purple-600/20 hover:text-white"
                          }`}
                        >
                          <span>{act.label}</span>
                          {act.type === "url" &&
                            renderIcon(FaExternalLinkAlt, { className: "text-[8px] opacity-70" })}
                        </button>
                      ))}
                    </div>
                  )}

                  <span className="text-[9px] text-slate-500 mt-1 px-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              ))}

              {/* Typing Animation */}
              {isTyping && (
                <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-2 rounded-2xl rounded-tl-sm border border-white/10 w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.3s]" />
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Pill Input Container — absolute last element, no gap below */}
            <div className="relative z-10 px-3 py-2 border-t border-white/10 bg-slate-950/95 backdrop-blur-md shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 focus-within:border-purple-500/60 focus-within:ring-1 focus-within:ring-purple-500/30 shadow-inner transition-all"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none py-1.5 px-1"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  aria-label="Send message"
                  className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-md shadow-purple-950/50 flex-shrink-0 hover:scale-105 active:scale-95 cursor-pointer"
                >
                  {renderIcon(FaPaperPlane, { size: 10 })}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
