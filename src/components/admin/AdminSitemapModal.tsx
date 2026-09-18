import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaGlobe, FaTimes, FaCopy, FaCheck, FaDownload } from "react-icons/fa";
import { renderIcon } from "./types";

interface AdminSitemapModalProps {
  isOpen: boolean;
  onClose: () => void;
  sitemapXmlPreview: string;
  sitemapCopied: boolean;
  onCopy: () => void;
  onDownload: () => void;
}

export const AdminSitemapModal: React.FC<AdminSitemapModalProps> = ({
  isOpen,
  onClose,
  sitemapXmlPreview,
  sitemapCopied,
  onCopy,
  onDownload,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl max-h-[85vh] flex flex-col p-5 border shadow-2xl rounded-2xl bg-[#0f1422] border-white/15 backdrop-blur-xl"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                  {renderIcon(FaGlobe, { size: 15 })}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                    <span>Live Sitemap.xml Preview</span>
                    <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Auto-Indexed A to Z
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Generated dynamically from your live projects catalogue + core routes for Google Search Console & SEO crawlers.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                {renderIcon(FaTimes, { size: 14 })}
              </button>
            </div>

            {/* Code Box */}
            <div className="my-4 flex-1 overflow-auto rounded-xl border border-white/10 bg-[#090d16] p-4 font-mono text-xs text-cyan-300/90 leading-relaxed shadow-inner">
              <pre className="whitespace-pre overflow-x-auto selection:bg-cyan-500/30">
                {sitemapXmlPreview}
              </pre>
            </div>

            {/* Modal Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
              <div className="text-[11px] text-slate-400">
                Total indexed routes: <strong className="text-white">{(sitemapXmlPreview.match(/<url>/g) || []).length} URLs</strong>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onCopy}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:text-white border border-white/15 bg-white/5 hover:bg-white/10 rounded-xl transition-all cursor-pointer"
                >
                  {renderIcon(sitemapCopied ? FaCheck : FaCopy, { size: 11, className: sitemapCopied ? "text-emerald-400" : "text-slate-400" })}
                  <span>{sitemapCopied ? "Copied to Clipboard" : "Copy XML"}</span>
                </button>
                <button
                  type="button"
                  onClick={onDownload}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:opacity-95 rounded-xl shadow-lg shadow-cyan-600/20 transition-all cursor-pointer"
                >
                  {renderIcon(FaDownload, { size: 11 })}
                  <span>Download sitemap.xml</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
