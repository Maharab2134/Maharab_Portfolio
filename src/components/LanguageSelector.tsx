import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaGlobe, FaChevronDown, FaCheck, FaTimes, FaSearch, FaRedo } from "react-icons/fa";
import {
  SUPPORTED_LANGUAGES,
  getCurrentLanguage,
  changeLanguage,
  initGoogleTranslateScript,
  SupportedLanguage,
} from "../lib/googleTranslate";

interface LanguageSelectorProps {
  isMobileCompact?: boolean;
  className?: string;
  dropdownAlign?: "left" | "right";
}

const renderIcon = (Icon: any, props: any = {}) => {
  return <Icon {...props} />;
};

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  isMobileCompact = false,
  className = "",
  dropdownAlign = "right",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLangCode, setCurrentLangCode] = useState<string>("en");
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Initialize Google Translate on component mount
  useEffect(() => {
    initGoogleTranslateScript();
    setCurrentLangCode(getCurrentLanguage());

    // Listen for cookie or language changes periodically or on storage event
    const checkLangInterval = setInterval(() => {
      const active = getCurrentLanguage();
      setCurrentLangCode((prev) => (prev !== active ? active : prev));
    }, 1500);

    return () => clearInterval(checkLangInterval);
  }, []);

  // Close dropdown on outside click or ESC
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("keydown", handleKeyDown);
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const currentLang: SupportedLanguage =
    SUPPORTED_LANGUAGES.find((l) => l.code.toLowerCase() === currentLangCode.toLowerCase()) || {
      code: currentLangCode,
      name: currentLangCode.toUpperCase(),
      nativeName: currentLangCode.toUpperCase(),
      flag: "🌐",
    };

  const filteredLanguages = SUPPORTED_LANGUAGES.filter((lang) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      lang.name.toLowerCase().includes(q) ||
      lang.nativeName.toLowerCase().includes(q) ||
      lang.code.toLowerCase().includes(q)
    );
  });

  const handleSelectLanguage = (code: string) => {
    setCurrentLangCode(code);
    setIsOpen(false);
    setSearchQuery("");
    changeLanguage(code);
  };

  return (
    <div
      ref={dropdownRef}
      className={`relative inline-block notranslate ${className}`}
      translate="no"
    >
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select Language (Google Translate)"
        aria-expanded={isOpen}
        className={`group flex items-center gap-1.5 transition-all duration-200 cursor-pointer rounded-full border border-white/10 bg-slate-900/80 backdrop-blur-md text-slate-200 hover:text-white hover:border-purple-500/50 hover:bg-slate-800/90 shadow-sm ${
          isMobileCompact
            ? "px-2.5 py-1.5 text-xs"
            : "px-3 py-1.5 text-xs font-medium"
        } ${isOpen ? "ring-2 ring-purple-500/40 border-purple-500/60" : ""}`}
      >
        <span className="text-purple-400 group-hover:rotate-12 transition-transform duration-300">
          {renderIcon(FaGlobe, { size: isMobileCompact ? 12 : 13 })}
        </span>

        <span className="text-sm leading-none">{currentLang.flag}</span>

        {!isMobileCompact && (
          <span className="font-semibold text-slate-200 group-hover:text-white tracking-tight">
            {currentLang.code === "en" ? "English" : currentLang.nativeName || currentLang.name}
          </span>
        )}

        {isMobileCompact && (
          <span className="font-bold text-[10px] text-slate-200 uppercase">
            {currentLang.code}
          </span>
        )}

        <span
          className={`text-slate-400 group-hover:text-purple-300 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          {renderIcon(FaChevronDown, { size: 9 })}
        </span>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className={`absolute top-full mt-2 w-72 sm:w-80 rounded-2xl bg-slate-950/95 backdrop-blur-2xl border border-white/15 shadow-2xl shadow-purple-950/50 overflow-hidden z-50 ${
              dropdownAlign === "left" ? "left-0" : "right-0"
            }`}
          >
            {/* Header with Google Translate Branding */}
            <div className="px-4 py-3 border-b border-white/10 bg-slate-900/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-purple-400">
                  {renderIcon(FaGlobe, { size: 14 })}
                </span>
                <div>
                  <h4 className="text-xs font-bold text-white tracking-wide">
                    Real-Time Translation
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    Powered by Google Translate
                  </p>
                </div>
              </div>

              {currentLangCode !== "en" && (
                <button
                  onClick={() => handleSelectLanguage("en")}
                  title="Reset to Original English"
                  className="flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-purple-300 bg-purple-900/40 hover:bg-purple-800/60 border border-purple-500/30 rounded-lg transition-colors"
                >
                  {renderIcon(FaRedo, { size: 9 })}
                  <span>Reset (EN)</span>
                </button>
              )}
            </div>

            {/* Search Box */}
            <div className="p-2.5 border-b border-white/5 bg-slate-900/40">
              <div className="relative flex items-center">
                <span className="absolute left-3 text-slate-400 pointer-events-none">
                  {renderIcon(FaSearch, { size: 11 })}
                </span>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search language (e.g. বাংলা, Spanish)..."
                  className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-800/80 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500/70 focus:ring-1 focus:ring-purple-500/40"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 text-slate-400 hover:text-white p-0.5"
                  >
                    {renderIcon(FaTimes, { size: 10 })}
                  </button>
                )}
              </div>
            </div>

            {/* Language List */}
            <div className="max-h-64 overflow-y-auto p-1.5 space-y-0.5 divide-y divide-white/5">
              {filteredLanguages.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400">
                  No languages found matching "{searchQuery}"
                </div>
              ) : (
                filteredLanguages.map((lang) => {
                  const isSelected = currentLangCode.toLowerCase() === lang.code.toLowerCase();
                  return (
                    <button
                      key={lang.code}
                      onClick={() => handleSelectLanguage(lang.code)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all duration-150 group cursor-pointer ${
                        isSelected
                          ? "bg-gradient-to-r from-purple-600/30 to-cyan-600/20 text-white border border-purple-500/40 font-semibold"
                          : "text-slate-300 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-base flex-shrink-0">{lang.flag}</span>
                        <div className="truncate">
                          <span className="text-xs block text-white font-medium group-hover:text-purple-200">
                            {lang.nativeName}
                          </span>
                          {lang.name !== lang.nativeName && (
                            <span className="text-[10px] text-slate-400 block -mt-0.5">
                              {lang.name}
                            </span>
                          )}
                        </div>
                      </div>

                      {isSelected ? (
                        <span className="text-purple-400 flex-shrink-0 ml-2">
                          {renderIcon(FaCheck, { size: 11 })}
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500 font-mono flex-shrink-0 uppercase ml-2 opacity-60 group-hover:opacity-100">
                          {lang.code}
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Bottom Footer Note */}
            <div className="px-3.5 py-2 border-t border-white/10 bg-slate-900/80 flex items-center justify-between text-[10px] text-slate-400">
              <span>Real-time DOM translation</span>
              <span className="text-purple-400 font-medium">Auto-synced</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSelector;
