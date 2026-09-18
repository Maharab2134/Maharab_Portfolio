import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaDraftingCompass,
  FaFigma,
  FaLaptopCode,
  FaShieldAlt,
  FaRocket,
  FaArrowRight,
  FaClock,
  FaCode,
  FaBrain,
  FaTools,
  FaLayerGroup,
  FaCogs,
  FaTerminal,
  FaServer,
  FaDatabase,
  FaCheck,
  FaLightbulb,
} from "react-icons/fa";
import { useDevelopmentProcessConfig } from "../lib/portfolioService";

const iconMap: Record<string, any> = {
  FaDraftingCompass,
  FaFigma,
  FaLaptopCode,
  FaShieldAlt,
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
  FaClock,
  FaCheck,
  FaArrowRight,
};

const renderIcon = (iconName: string, props: any = {}) => {
  const IconComponent = iconMap[iconName] || FaCogs;
  return <IconComponent {...props} />;
};

export const DevelopmentProcess: React.FC = () => {
  const config = useDevelopmentProcessConfig();
  const [activeStepId, setActiveStepId] = useState<string | null>(null);

  // If disabled via Admin Panel, hide completely
  if (!config.enabled || !config.steps || config.steps.length === 0) {
    return null;
  }

  const steps = config.steps;
  const currentActive = steps.find((s) => s.id === activeStepId) || steps[0];

  return (
    <section
      id="process"
      className="relative py-24 sm:py-32 overflow-hidden bg-[#030014]"
      aria-label="Development Process"
    >
      {/* Background Ambient Glows & Grid Mesh */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-cyan-600/15 via-purple-600/15 to-indigo-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[300px] bg-purple-600/10 rounded-full blur-[120px]" />
        {/* Subtle grid mesh overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16 sm:mb-20"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-mono font-semibold tracking-wider uppercase bg-cyan-500/10 text-cyan-300 border border-cyan-500/25 backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.15)] mb-4">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>{config.badge || "ENGINEERING LIFECYCLE"}</span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight sm:leading-none">
            {config.title || "Development & Engineering Process"}
          </h2>

          {/* Subtitle */}
          <p className="mt-4 text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
            {config.subtitle ||
              "A disciplined, battle-tested engineering methodology that transforms complex ideas into scalable, secure, and production-ready digital software."}
          </p>
        </motion.div>

        {/* Desktop Interactive Stepper Rail */}
        <div className="hidden lg:block mb-14">
          <div className="relative flex items-center justify-between">
            {/* Connecting Track Line */}
            <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 h-0.5 bg-white/[0.08] z-0" />
            <div
              className="absolute top-1/2 left-8 -translate-y-1/2 h-0.5 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 z-0 transition-all duration-700"
              style={{
                width: `${
                  (steps.findIndex((s) => s.id === currentActive.id) /
                    (steps.length - 1 || 1)) *
                  100
                }%`,
              }}
            />

            {/* Stepper Nodes */}
            {steps.map((step, idx) => {
              const isSelected = step.id === currentActive.id;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setActiveStepId(step.id)}
                  className={`relative z-10 flex flex-col items-center group cursor-pointer transition-all duration-300`}
                >
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center font-mono text-sm font-bold border transition-all duration-300 shadow-xl ${
                      isSelected
                        ? "bg-gradient-to-br from-cyan-500 to-blue-600 border-cyan-300 text-white shadow-[0_0_25px_rgba(6,182,212,0.45)] scale-110"
                        : "bg-[#0c101d] border-white/10 text-slate-400 group-hover:text-white group-hover:border-cyan-500/40 group-hover:scale-105"
                    }`}
                  >
                    {step.stepNumber}
                  </div>
                  <span
                    className={`mt-3 text-xs font-semibold tracking-wide transition-colors ${
                      isSelected
                        ? "text-cyan-300"
                        : "text-slate-400 group-hover:text-slate-200"
                    }`}
                  >
                    {step.title.split(" ")[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Process Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step, index) => {
            const isHighlighted = step.id === currentActive.id;
            return (
              <motion.article
                key={step.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                onClick={() => setActiveStepId(step.id)}
                className={`group relative flex flex-col justify-between p-6 sm:p-7 rounded-3xl border transition-all duration-500 cursor-pointer overflow-hidden backdrop-blur-xl ${
                  isHighlighted
                    ? "bg-white/[0.05] border-cyan-500/50 shadow-[0_15px_35px_-10px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400/30"
                    : "bg-white/[0.02] border-white/10 hover:border-purple-500/40 hover:bg-white/[0.04] shadow-lg shadow-black/30"
                }`}
              >
                {/* Accent Gradient Glow in Corner */}
                <div
                  className={`absolute -top-16 -right-16 w-36 h-36 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity bg-gradient-to-br ${
                    step.colorTheme || "from-cyan-500 to-blue-500"
                  }`}
                />

                <div>
                  {/* Top Bar: Step Number & Phase Badge */}
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xl sm:text-2xl font-black tracking-tight text-white/90 bg-white/5 border border-white/10 px-3 py-1 rounded-xl shadow-inner">
                        {step.stepNumber}
                      </span>
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-white bg-gradient-to-br shadow-md ${
                          step.colorTheme || "from-cyan-500 to-blue-600"
                        }`}
                      >
                        {renderIcon(step.iconName, { size: 16 })}
                      </div>
                    </div>

                    {/* Phase Badge */}
                    <span className="px-2.5 py-1 text-[10px] font-mono font-semibold uppercase tracking-wider rounded-full bg-white/5 text-slate-300 border border-white/10">
                      {step.badge || `PHASE ${index + 1}`}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-cyan-300 transition-colors tracking-tight">
                    {step.title}
                  </h3>
                  {step.subtitle && (
                    <p className="text-xs font-medium text-cyan-400/80 mt-1 mb-3">
                      {step.subtitle}
                    </p>
                  )}

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6 font-normal">
                    {step.description}
                  </p>
                </div>

                {/* Deliverables Section */}
                <div className="pt-4 border-t border-white/[0.08] mt-auto">
                  <div className="flex items-center justify-between mb-3 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                    <span>Key Deliverables</span>
                    {step.estimatedDuration && (
                      <span className="inline-flex items-center gap-1 text-slate-300 font-sans normal-case">
                        {renderIcon("FaClock", { className: "text-cyan-400 text-[10px]" })}
                        {step.estimatedDuration}
                      </span>
                    )}
                  </div>

                  <ul className="space-y-1.5">
                    {step.deliverables.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-xs text-slate-300"
                      >
                        {renderIcon("FaCheck", { className: "text-cyan-400 mt-1 shrink-0 text-[10px]" })}
                        <span className="leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom Edge Glow on Hover */}
                <div
                  className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${
                    step.colorTheme || "from-cyan-500 to-blue-500"
                  } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />
              </motion.article>
            );
          })}
        </div>

        {/* Bottom Callout Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 sm:mt-20 p-8 sm:p-10 rounded-3xl border border-white/10 bg-gradient-to-r from-cyan-950/40 via-[#0b101f] to-purple-950/40 backdrop-blur-xl relative overflow-hidden shadow-2xl shadow-black/40"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left max-w-xl">
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 mb-3 inline-block">
                READY TO COLLABORATE
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Have a project or architectural vision in mind?
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                Let&apos;s apply this robust engineering lifecycle to deliver your next product on time, on budget, and built to scale effortlessly.
              </p>
            </div>

            <a
              href="#contact"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-sm tracking-wide shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] transition-all duration-300 shrink-0 cursor-pointer active:scale-[0.98]"
            >
              <span>Initiate Project Discussion</span>
              {renderIcon("FaArrowRight", { className: "text-xs" })}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
