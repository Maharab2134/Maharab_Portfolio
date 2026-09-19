import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaPaperPlane,
  FaRedo,
  FaExternalLinkAlt,
  FaMagic,
  FaLightbulb,
} from "react-icons/fa";
import {
  ChatMessage,
  ChatAction,
  PortfolioChatbotEngine,
} from "../lib/chatbotService";
import { ActiveContext } from "../lib/chatbotKnowledge";
import { Project, getAllProjectsSync } from "../data/projectsData";

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
  const inputRef = useRef<HTMLInputElement>(null);

  // Update initial message or add context hint if context changes
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

  // Scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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

    // Natural responsive delay (150ms-300ms) to give a polished assistant feel
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
  };

  const renderFormattedText = (rawText: string) => {
    const lines = rawText.split("\n");
    return lines.map((line, idx) => {
      // Heading 3
      if (line.startsWith("### ")) {
        return (
          <h4 key={idx} className="font-bold text-white text-sm mt-2 mb-1">
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
    // Basic bold and markdown link formatting
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

  // Quick suggestion prompts
  const quickPrompts = [
    "Tell me about him",
    "What projects are available?",
    "Show Flutter projects",
    "What skills does he have?",
    "What experience does he have?",
    "Where can I find his CV?",
    "How can I contact him?",
  ];

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-6 right-6 z-50 pointer-events-auto">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          aria-label="Open Portfolio AI Assistant"
          className="relative group flex items-center gap-2.5 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white shadow-xl shadow-purple-900/40 border border-white/25 backdrop-blur-xl transition-all duration-300 hover:shadow-cyan-500/25"
        >
          {/* Subtle Ambient Pulse Ring */}
          <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 opacity-60 blur-sm group-hover:opacity-100 transition duration-500 -z-10 animate-pulse" />

          {/* Assistant Icon */}
          <div className="relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-950/60 text-white shadow-inner">
            <img
              src="/chatbot.png"
              alt="AI Assistant"
              className="w-full h-full object-contain rounded-full"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
            {/* Live Green Online Dot */}
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950 animate-pulse" />
          </div>

          <div className="hidden sm:flex flex-col text-left">
            <span className="text-[12px] font-bold tracking-wide leading-tight flex items-center gap-1">
              Ask AI Assistant {renderIcon(FaMagic, { className: "text-[10px] text-amber-300" })}
            </span>
            <span className="text-[10px] text-purple-200 font-medium leading-none">
              Dynamic Portfolio Guide
            </span>
          </div>

          {/* Unread Alert Dot */}
          {hasUnread && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-pink-500 rounded-full border-2 border-slate-950" />
          )}
        </motion.button>
      </div>

      {/* Floating Chat Window Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="fixed bottom-20 sm:bottom-24 right-3 sm:right-6 z-50 w-[94vw] sm:w-[420px] h-[580px] max-h-[82vh] rounded-2xl bg-slate-950/95 border border-purple-500/25 backdrop-blur-2xl shadow-2xl shadow-black/80 flex flex-col overflow-hidden text-slate-100"
          >
            {/* Background Ambient Grid & Glow */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2.5rem_2.5rem]" />
            <div className="absolute -top-20 -right-20 w-44 h-44 rounded-full bg-purple-600/30 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-44 h-44 rounded-full bg-cyan-600/20 blur-3xl pointer-events-none" />

            {/* Chat Header */}
            <div className="relative z-10 px-4 py-3 border-b border-white/10 bg-slate-900/60 backdrop-blur-md flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 via-indigo-500 to-cyan-400 p-[1.5px] shadow-md">
                  <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center overflow-hidden">
                    <img
                      src="/chatbot.png"
                      alt="Maharab's Assistant"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-slate-950 rounded-full" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs sm:text-sm font-bold text-white tracking-wide">
                      Maharab's Assistant
                    </h3>
                    <span className="px-1.5 py-0.2 text-[9px] font-semibold text-cyan-300 bg-cyan-950/70 border border-cyan-800/50 rounded">
                      Live Data
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Single Source of Truth • 0 Hallucinations
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-slate-400">
                <button
                  onClick={handleResetChat}
                  title="Clear conversation"
                  aria-label="Clear chat"
                  className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
                >
                  {renderIcon(FaRedo, { size: 12 })}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close Assistant (Esc)"
                  aria-label="Close chat"
                  className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
                >
                  {renderIcon(FaTimes, { size: 14 })}
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

            {/* Message Stream */}
            <div className="relative z-10 flex-1 overflow-y-auto p-3.5 space-y-3.5 text-xs scrollbar-thin scrollbar-thumb-purple-600/30 scrollbar-track-transparent">
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

                  {/* Interactive Action Pills */}
                  {msg.actions && msg.actions.length > 0 && (
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

            {/* Quick Suggestions Chips */}
            <div className="relative z-10 px-3 py-1.5 border-t border-white/5 bg-slate-950/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <span className="text-[10px] text-slate-400 flex items-center gap-1 shrink-0">
                {renderIcon(FaLightbulb, { className: "text-amber-400" })} Ask:
              </span>
              {quickPrompts.map((prompt, pIdx) => (
                <button
                  key={pIdx}
                  onClick={() => handleSend(prompt)}
                  className="shrink-0 px-2 py-0.5 rounded-md text-[10px] bg-slate-900 text-slate-300 border border-white/10 hover:border-purple-400 hover:text-white transition-colors whitespace-nowrap"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="relative z-10 p-2.5 border-t border-white/10 bg-slate-900/80 backdrop-blur-md">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about projects, skills, experience, or CV..."
                  className="flex-1 bg-slate-950/90 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50 transition-all"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  aria-label="Send message"
                  className="w-8 h-8 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 transition-all shadow-md shadow-purple-900/40"
                >
                  {renderIcon(FaPaperPlane, { size: 11 })}
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
