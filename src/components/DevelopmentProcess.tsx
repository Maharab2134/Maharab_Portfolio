import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaDraftingCompass,
  FaFigma,
  FaLaptopCode,
  FaRocket,
  FaArrowRight,
  FaCheck,
  FaCode,
  FaBrain,
  FaTools,
  FaLayerGroup,
  FaCogs,
  FaTerminal,
  FaServer,
  FaDatabase,
  FaLightbulb,
} from "react-icons/fa";
import { useDevelopmentProcessConfig } from "../lib/portfolioService";

const iconMap: Record<string, any> = {
  FaDraftingCompass,
  FaFigma,
  FaLaptopCode,
  FaRocket,
  FaCode,
  FaBrain,
  FaTools,
  FaLayerGroup,
  FaCogs,
  FaTerminal,
  FaServer,
  FaDatabase,
  FaLightbulb,
  FaCheck,
  FaArrowRight,
};

const renderIcon = (iconName: string, props: any = {}) => {
  const IconComponent = iconMap[iconName] || FaCogs;
  return <IconComponent {...props} />;
};

export const DevelopmentProcess: React.FC = () => {
  const config = useDevelopmentProcessConfig();
  const [activeBranchId, setActiveBranchId] = useState<string | null>(null);

  // If disabled via Admin, hide completely
  if (!config.enabled || !config.steps || config.steps.length === 0) {
    return null;
  }

  const steps = config.steps.slice(0, 4); // The 4 main branches of the tree

  return (
    <section
      id="process"
      className="relative py-24 sm:py-32 overflow-hidden bg-[#030014]"
      aria-label="Development Process Tree"
    >
      {/* Background Ambient Glows & Grid Mesh */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-cyan-600/15 via-purple-600/15 to-blue-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 left-1/4 w-[500px] h-[350px] bg-emerald-600/10 rounded-full blur-[130px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_45%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16 sm:mb-20"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-mono font-semibold tracking-wider uppercase bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.15)] mb-3.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>{config.badge || "WORKFLOW TREE • 4 BRANCHES"}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            {config.title || "Engineering & Development Process"}
          </h2>

          <p className="mt-3.5 text-xs sm:text-sm text-slate-400 leading-relaxed max-w-xl mx-auto">
            {config.subtitle ||
              "A clean 4-branch engineering roadmap designed to build scalable, resilient software from concept to production."}
          </p>
        </motion.div>

        {/* Tree Root Badge / Center Start Node */}
        <div className="flex flex-col items-center justify-center mb-8 relative z-20">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2.5 px-5 py-2 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0d1424] to-slate-900 border border-white/15 text-xs font-mono font-bold text-slate-200 shadow-xl shadow-black/50 backdrop-blur-md"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_10px_rgba(6,182,212,0.8)] animate-ping" />
            <span className="text-cyan-400 tracking-wider">ROOT:</span>
            <span>SYSTEM LIFECYCLE</span>
            <span className="text-slate-500 font-normal">| 4 KEY PHASES</span>
          </motion.div>

          {/* Glowing Stem under Root Badge */}
          <div className="w-0.5 h-10 bg-gradient-to-b from-cyan-500 via-purple-500 to-transparent my-1" />
        </div>

        {/* ==================================================================== */}
        {/* DESKTOP 4-BRANCH TREE ARCHITECTURE                                    */}
        {/* ==================================================================== */}
        <div className="relative hidden lg:block">
          {/* Central Trunk Line */}
          <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-1 bg-gradient-to-b from-cyan-500/80 via-purple-500/80 via-emerald-500/80 to-rose-500/80 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.4)] z-0" />

          {/* 4 Alternating Branches (Left & Right) */}
          <div className="space-y-12 relative z-10">
            {steps.map((step, index) => {
              const isEven = index % 2 === 0; // 0, 2 -> Left; 1, 3 -> Right
              const isSelected = activeBranchId === step.id;

              return (
                <div
                  key={step.id}
                  className={`flex items-center w-full ${
                    isEven ? "justify-start" : "justify-end"
                  }`}
                >
                  {/* Branch Card Container (Takes ~46% of width on either side) */}
                  <div className="w-[46%] relative">
                    {/* SVG Branch Cable connecting Card to Central Trunk */}
                    <svg
                      className={`absolute top-1/2 -translate-y-1/2 pointer-events-none ${
                        isEven
                          ? "right-[-48px] w-12 h-6"
                          : "left-[-48px] w-12 h-6 scale-x-[-1]"
                      }`}
                      fill="none"
                      viewBox="0 0 48 24"
                    >
                      <path
                        d="M 0 12 L 48 12"
                        stroke={
                          isSelected
                            ? "rgba(6, 182, 212, 1)"
                            : "rgba(255, 255, 255, 0.25)"
                        }
                        strokeWidth="2"
                        strokeDasharray={isSelected ? "none" : "3 3"}
                      />
                    </svg>

                    {/* Central Junction Node Dot */}
                    <div
                      className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 transition-all duration-300 z-20 ${
                        isEven ? "right-[-56px]" : "left-[-56px]"
                      } ${
                        isSelected
                          ? "bg-cyan-400 border-white shadow-[0_0_15px_rgba(6,182,212,1)] scale-125"
                          : "bg-[#0b0f19] border-white/40 group-hover:border-cyan-400"
                      }`}
                    />

                    {/* Branch Card */}
                    <motion.article
                      initial={{ opacity: 0, x: isEven ? -25 : 25 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      onClick={() =>
                        setActiveBranchId(isSelected ? null : step.id)
                      }
                      className={`group relative p-6 rounded-3xl border transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-xl ${
                        isSelected
                          ? "bg-white/[0.06] border-cyan-400/60 shadow-[0_15px_35px_-10px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400/40"
                          : "bg-white/[0.025] border-white/10 hover:border-white/25 hover:bg-white/[0.045] shadow-xl shadow-black/40"
                      }`}
                    >
                      {/* Ambient corner glow */}
                      <div
                        className={`absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity bg-gradient-to-br ${
                          step.colorTheme || "from-cyan-500 to-blue-500"
                        }`}
                      />

                      {/* Header Row: Step Number, Icon, Phase Badge */}
                      <div className="flex items-center justify-between gap-3 mb-3.5">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xl font-black text-white px-2.5 py-0.5 rounded-lg bg-white/5 border border-white/10 shadow-inner">
                            {step.stepNumber}
                          </span>
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center text-white bg-gradient-to-br shadow-md ${
                              step.colorTheme || "from-cyan-500 to-blue-600"
                            }`}
                          >
                            {renderIcon(step.iconName, { size: 15 })}
                          </div>
                        </div>

                        <span className="text-[10px] font-mono font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/5 text-slate-300 border border-white/10">
                          {step.badge || `BRANCH ${index + 1}`}
                        </span>
                      </div>

                      {/* Branch Title */}
                      <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors tracking-tight">
                        {step.title}
                      </h3>

                      {/* Short Subtitle (No long paragraph!) */}
                      <p className="text-xs text-slate-400 mt-1 mb-4 font-normal">
                        {step.subtitle || step.description}
                      </p>

                      {/* 3 Deliverables Badges */}
                      <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/[0.08]">
                        {step.deliverables.slice(0, 3).map((d, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white/5 border border-white/10 text-slate-300 group-hover:border-cyan-500/30 transition-colors"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                            <span>{d}</span>
                          </span>
                        ))}
                      </div>

                      {/* Bottom Edge Accent Line */}
                      <div
                        className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${
                          step.colorTheme || "from-cyan-500 to-blue-500"
                        } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                      />
                    </motion.article>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ==================================================================== */}
        {/* MOBILE & TABLET LAYOUT (Vertical Trunk on the Left)                  */}
        {/* ==================================================================== */}
        <div className="block lg:hidden relative pl-6 sm:pl-8">
          {/* Vertical Trunk Line on Left */}
          <div className="absolute left-2.5 sm:left-3.5 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 via-purple-500 via-emerald-500 to-rose-500 rounded-full" />

          <div className="space-y-6">
            {steps.map((step, index) => {
              const isSelected = activeBranchId === step.id;

              return (
                <div key={step.id} className="relative">
                  {/* Branch Junction Node on Trunk Line */}
                  <div
                    className={`absolute -left-[23px] sm:-left-[27px] top-6 w-3.5 h-3.5 rounded-full border-2 transition-all ${
                      isSelected
                        ? "bg-cyan-400 border-white shadow-[0_0_12px_rgba(6,182,212,1)]"
                        : "bg-[#0b0f19] border-cyan-400"
                    }`}
                  />

                  {/* Branch Card */}
                  <motion.article
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                    onClick={() =>
                      setActiveBranchId(isSelected ? null : step.id)
                    }
                    className={`p-5 rounded-2xl border transition-all duration-300 backdrop-blur-xl ${
                      isSelected
                        ? "bg-white/[0.06] border-cyan-400/50 shadow-lg"
                        : "bg-white/[0.025] border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 mb-2.5">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-base font-black text-white px-2 py-0.5 rounded-lg bg-white/5 border border-white/10">
                          {step.stepNumber}
                        </span>
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${
                            step.colorTheme || "from-cyan-500 to-blue-600"
                          }`}
                        >
                          {renderIcon(step.iconName, { size: 14 })}
                        </div>
                        <h3 className="text-base font-bold text-white">
                          {step.title}
                        </h3>
                      </div>
                      <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10">
                        {step.badge || `BRANCH ${index + 1}`}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 mb-3">
                      {step.subtitle || step.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-2.5 border-t border-white/[0.08]">
                      {step.deliverables.slice(0, 3).map((d, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] bg-white/5 border border-white/10 text-slate-300"
                        >
                          <span className="w-1 h-1 rounded-full bg-cyan-400" />
                          <span>{d}</span>
                        </span>
                      ))}
                    </div>
                  </motion.article>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Callout Banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-14 sm:mt-18 p-6 sm:p-8 rounded-3xl border border-white/10 bg-gradient-to-r from-cyan-950/40 via-[#0b101f] to-purple-950/40 backdrop-blur-xl relative overflow-hidden shadow-xl"
        >
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full inline-block mb-2">
                AGILE • CLEAN • SCALE
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                Ready to engineer your next software product?
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Let&apos;s apply this 4-branch engineering workflow to deliver results fast.
              </p>
            </div>

            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs tracking-wide shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all cursor-pointer shrink-0"
            >
              <span>Get in Touch</span>
              {renderIcon("FaArrowRight", { className: "text-[11px]" })}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
