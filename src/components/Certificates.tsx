import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCertificate,
  FaExternalLinkAlt,
  FaTrophy,
  FaCheckCircle,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { CertificateItem } from "../data/portfolioData";
import { getCachedCertificatesSync } from "../lib/portfolioService";

const renderIcon = (Icon: any, props: any = {}) => {
  return <Icon {...props} />;
};

const Certificates: React.FC = () => {
  const [certsList, setCertsList] = useState<CertificateItem[]>(getCachedCertificatesSync);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [showAll, setShowAll] = useState(false);
  const initialLimit = 4;

  useEffect(() => {
    const handleCertsUpdate = () => {
      const live = getCachedCertificatesSync();
      React.startTransition(() => {
        setCertsList(live);
      });
    };
    window.addEventListener("portfolio_certificates_updated", handleCertsUpdate);
    return () => window.removeEventListener("portfolio_certificates_updated", handleCertsUpdate);
  }, []);

  const filteredCerts = certsList.filter((cert) => {
    if (activeTab === "all") return true;
    if (activeTab === "professional") return cert.type === "Professional";
    if (activeTab === "achievement") return cert.type === "Achievement" || cert.type === "Conference";
    return true;
  });

  const displayedCerts = showAll ? filteredCerts : filteredCerts.slice(0, initialLimit);

  return (
    <section
      id="certificates"
      className="relative py-8 sm:py-12 overflow-hidden bg-gradient-to-b from-[#030014] via-[#0b0c1e] to-[#030014]"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="relative px-4 mx-auto max-w-6xl sm:px-6 lg:px-8">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-6 sm:mb-8 text-center"
        >
          <span className="text-xs font-semibold tracking-widest uppercase text-cyan-400">
            Validated Competency
          </span>
          <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            Certificates &amp; Credentials
          </h2>
          <div className="w-20 h-1 mx-auto mt-3 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400" />
          <p className="max-w-xl mx-auto mt-4 text-sm sm:text-base text-slate-400">
            Verified assessments, specialized training programs, and recognized technical contributions.
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {[
            { id: "all", label: "All Credentials" },
            { id: "professional", label: "Professional Certifications" },
            { id: "achievement", label: "Awards & Conferences" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setShowAll(false);
              }}
              className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-full transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-500/20"
                  : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/10"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Certifications Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence>
            {displayedCerts.map((cert: CertificateItem, index: number) => {
              const isProfessional = cert.type === "Professional";

              return (
                <motion.article
                  key={`${cert.title}-${index}`}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="relative flex flex-col justify-between p-6 sm:p-7 border rounded-2xl bg-white/[0.03] border-white/10 backdrop-blur-xl hover:border-purple-500/30 hover:bg-white/[0.05] transition-all duration-300 group shadow-lg shadow-black/20"
                >
                  <div>
                    {/* Top Row: Type Pill & Year */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border ${
                          isProfessional
                            ? "bg-purple-500/15 border-purple-500/30 text-purple-300"
                            : "bg-cyan-500/15 border-cyan-500/30 text-cyan-300"
                        }`}
                      >
                        {isProfessional
                          ? renderIcon(FaCertificate, { size: 12 })
                          : renderIcon(FaTrophy, { size: 12 })}
                        {cert.type}
                      </span>
                      <span className="text-xs font-medium text-slate-400">{cert.year}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors mb-1.5">
                      {cert.title}
                    </h3>

                    {/* Issuer */}
                    <p className="text-xs sm:text-sm font-semibold text-cyan-400 mb-3">
                      {cert.issuer}
                    </p>

                    {/* Details */}
                    <p className="text-xs sm:text-sm leading-relaxed text-slate-300/80 mb-4">
                      {cert.details}
                    </p>
                  </div>

                  {/* Bottom Verification Link */}
                  <div className="pt-4 mt-auto border-t border-white/5 flex items-center justify-between">
                    {cert.verificationId ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                        {renderIcon(FaCheckCircle, { size: 11 })}
                        Verified ID: {cert.verificationId}
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400">Official Record</span>
                    )}

                    <a
                      href={cert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-200 hover:text-cyan-300 transition-colors"
                    >
                      <span>View Credential</span>
                      {renderIcon(FaExternalLinkAlt, { size: 11 })}
                    </a>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Show More / Show Less Button */}
        {filteredCerts.length > initialLimit && (
          <div className="flex justify-center mt-10">
            <button
              type="button"
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-full border border-white/15 bg-white/5 text-slate-200 hover:text-white hover:bg-white/10 hover:border-purple-400/40 transition-all duration-300 active:scale-95"
            >
              <span>{showAll ? "Show Less" : `View All (${filteredCerts.length})`}</span>
              {showAll ? renderIcon(FaChevronUp, { size: 11 }) : renderIcon(FaChevronDown, { size: 11 })}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Certificates;
