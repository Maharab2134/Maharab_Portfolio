import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaArrowLeft,
  FaArrowRight,
  FaFlag,
  FaFileAlt,
  FaLightbulb,
  FaBullseye,
  FaSearch,
  FaLayerGroup,
  FaPalette,
  FaCode,
  FaListUl,
  FaExclamationTriangle,
  FaCogs,
  FaFlask,
  FaChartLine,
  FaGraduationCap,
  FaRocket,
  FaLink,
  FaTrophy,
} from "react-icons/fa";
import { useLiveProfile } from "../lib/portfolioService";
import { PORTFOLIO_INFO } from "../data/portfolioData";
import { getAllProjectsSync, Project } from "../data/projectsData";

const renderIcon = (Icon: any, props: any = {}) => {
  if (!Icon) return null;
  return <Icon {...props} />;
};

interface CaseStudiesProps {
  onBack?: () => void;
  onSelectProject?: (project: Project) => void;
}

interface FlowStep {
  step: string;
  title: string;
  desc: string;
  icon: any;
  numberBg: string;
  borderColor: string;
  iconColor: string;
  glowColor: string;
}

const FLOW_STEPS: FlowStep[] = [
  {
    step: "01",
    title: "Project Overview",
    desc: "A quick introduction to the project, what it is and what it does.",
    icon: FaFileAlt,
    numberBg: "bg-cyan-500 text-slate-950",
    borderColor: "border-cyan-500/30 hover:border-cyan-400",
    iconColor: "text-cyan-400",
    glowColor: "rgba(6,182,212,0.2)",
  },
  {
    step: "02",
    title: "Problem / Challenge",
    desc: "The real problem and pain points that needed to be solved.",
    icon: FaLightbulb,
    numberBg: "bg-rose-500 text-white",
    borderColor: "border-rose-500/30 hover:border-rose-400",
    iconColor: "text-rose-400",
    glowColor: "rgba(244,63,94,0.2)",
  },
  {
    step: "03",
    title: "Goals & Requirements",
    desc: "Key goals, requirements, constraints, and success criteria.",
    icon: FaBullseye,
    numberBg: "bg-sky-500 text-slate-950",
    borderColor: "border-sky-500/30 hover:border-sky-400",
    iconColor: "text-sky-400",
    glowColor: "rgba(14,165,233,0.2)",
  },
  {
    step: "04",
    title: "Research / Planning",
    desc: "Domain research, competitor analysis, and planning the approach.",
    icon: FaSearch,
    numberBg: "bg-fuchsia-500 text-white",
    borderColor: "border-fuchsia-500/30 hover:border-fuchsia-400",
    iconColor: "text-fuchsia-400",
    glowColor: "rgba(217,70,239,0.2)",
  },
  {
    step: "05",
    title: "Architecture & Tech Stack",
    desc: "System architecture, database schemas, and technologies used.",
    icon: FaLayerGroup,
    numberBg: "bg-emerald-500 text-slate-950",
    borderColor: "border-emerald-500/30 hover:border-emerald-400",
    iconColor: "text-emerald-400",
    glowColor: "rgba(16,185,129,0.2)",
  },
  {
    step: "06",
    title: "UI/UX & Design Decisions",
    desc: "Design process, user flows, wireframes, and key design decisions.",
    icon: FaPalette,
    numberBg: "bg-amber-500 text-slate-950",
    borderColor: "border-amber-500/30 hover:border-amber-400",
    iconColor: "text-amber-400",
    glowColor: "rgba(245,158,11,0.2)",
  },
  {
    step: "07",
    title: "Development Process",
    desc: "Step-by-step development approach, sprints, and implementation.",
    icon: FaCode,
    numberBg: "bg-blue-500 text-white",
    borderColor: "border-blue-500/30 hover:border-blue-400",
    iconColor: "text-blue-400",
    glowColor: "rgba(59,130,246,0.2)",
  },
  {
    step: "08",
    title: "Key Features",
    desc: "Main features, capabilities, and standout functionality.",
    icon: FaListUl,
    numberBg: "bg-orange-500 text-slate-950",
    borderColor: "border-orange-500/30 hover:border-orange-400",
    iconColor: "text-orange-400",
    glowColor: "rgba(249,115,22,0.2)",
  },
  {
    step: "09",
    title: "Technical Challenges",
    desc: "Difficult concurrency, state sync, or scaling hurdles faced.",
    icon: FaExclamationTriangle,
    numberBg: "bg-rose-500 text-white",
    borderColor: "border-rose-500/30 hover:border-rose-400",
    iconColor: "text-rose-400",
    glowColor: "rgba(244,63,94,0.2)",
  },
  {
    step: "10",
    title: "Solutions",
    desc: "How the challenges and bottlenecks were engineered and solved.",
    icon: FaCogs,
    numberBg: "bg-cyan-500 text-slate-950",
    borderColor: "border-cyan-500/30 hover:border-cyan-400",
    iconColor: "text-cyan-400",
    glowColor: "rgba(6,182,212,0.2)",
  },
  {
    step: "11",
    title: "Testing & Optimization",
    desc: "Testing process, performance optimization, and Core Web Vitals.",
    icon: FaFlask,
    numberBg: "bg-purple-500 text-white",
    borderColor: "border-purple-500/30 hover:border-purple-400",
    iconColor: "text-purple-400",
    glowColor: "rgba(168,85,247,0.2)",
  },
  {
    step: "12",
    title: "Results / Outcome",
    desc: "Final results, quantitative impact, metrics, and key takeaways.",
    icon: FaChartLine,
    numberBg: "bg-amber-500 text-slate-950",
    borderColor: "border-amber-500/30 hover:border-amber-400",
    iconColor: "text-amber-400",
    glowColor: "rgba(245,158,11,0.2)",
  },
  {
    step: "13",
    title: "Lessons Learned",
    desc: "Important engineering lessons, insights, and architectural takeaways.",
    icon: FaGraduationCap,
    numberBg: "bg-teal-500 text-slate-950",
    borderColor: "border-teal-500/30 hover:border-teal-400",
    iconColor: "text-teal-400",
    glowColor: "rgba(20,184,166,0.2)",
  },
  {
    step: "14",
    title: "Future Improvements",
    desc: "Next iterations, roadmap features, and scalability enhancements.",
    icon: FaRocket,
    numberBg: "bg-pink-500 text-white",
    borderColor: "border-pink-500/30 hover:border-pink-400",
    iconColor: "text-pink-400",
    glowColor: "rgba(236,72,153,0.2)",
  },
  {
    step: "15",
    title: "Live Demo / GitHub",
    desc: "Links to live project, source code repository, and documentation.",
    icon: FaLink,
    numberBg: "bg-cyan-500 text-slate-950",
    borderColor: "border-cyan-500/30 hover:border-cyan-400",
    iconColor: "text-cyan-400",
    glowColor: "rgba(6,182,212,0.2)",
  },
];

const CaseStudies: React.FC<CaseStudiesProps> = ({ onBack, onSelectProject }) => {
  const profile = useLiveProfile();
  const name = profile.name || PORTFOLIO_INFO.name;
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    document.title = `Project Case Study Flow | ${name}`;
    window.scrollTo({ top: 0, behavior: "smooth" });
    setProjects(getAllProjectsSync().filter((p) => p.featured).slice(0, 3));

    return () => {
      document.title = `${name} | Portfolio`;
    };
  }, [name]);

  const handleReturnToPortfolio = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onBack) {
      onBack();
    } else {
      window.location.hash = "#projects";
      window.location.href = "/#projects";
    }
  };

  // Helper to render a single step card
  const renderStepCard = (step: FlowStep) => {
    return (
      <motion.div
        key={step.step}
        whileHover={{ scale: 1.02, y: -2 }}
        transition={{ duration: 0.2 }}
        className={`relative flex-1 p-4 sm:p-5 rounded-2xl sm:rounded-3xl border ${step.borderColor} bg-gradient-to-br from-[#0c1222]/95 via-[#080d1a]/95 to-[#050813]/95 backdrop-blur-xl transition-all duration-300 shadow-xl group`}
        style={{
          boxShadow: `0 8px 32px -8px ${step.glowColor}`,
        }}
      >
        {/* Floating Circle Step Badge on top border */}
        <div className="absolute -top-3.5 left-5">
          <span
            className={`inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full text-xs font-mono font-black shadow-lg ${step.numberBg}`}
          >
            {step.step}
          </span>
        </div>

        <div className="flex items-start gap-3.5 pt-2">
          {/* Glowing Icon */}
          <div
            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center text-lg sm:text-xl shrink-0 bg-white/[0.04] border border-white/10 ${step.iconColor} group-hover:scale-110 transition-transform`}
          >
            {renderIcon(step.icon, { size: 20 })}
          </div>

          {/* Title & 1-line description */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight group-hover:text-cyan-300 transition-colors">
              {step.title}
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
              {step.desc}
            </p>
          </div>
        </div>
      </motion.div>
    );
  };

  // Serpentine rows for desktop (Pairs of 2)
  const rows = [
    {
      type: "ltr",
      leftStep: FLOW_STEPS[0], // 01
      rightStep: FLOW_STEPS[1], // 02
      hasStart: true,
      curveToNext: "right", // curve on right from 02 -> 03
    },
    {
      type: "rtl",
      leftStep: FLOW_STEPS[3], // 04
      rightStep: FLOW_STEPS[2], // 03
      hasStart: false,
      curveToNext: "left", // curve on left from 04 -> 05
    },
    {
      type: "ltr",
      leftStep: FLOW_STEPS[4], // 05
      rightStep: FLOW_STEPS[5], // 06
      hasStart: false,
      curveToNext: "right", // curve on right from 06 -> 07
    },
    {
      type: "rtl",
      leftStep: FLOW_STEPS[7], // 08
      rightStep: FLOW_STEPS[6], // 07
      hasStart: false,
      curveToNext: "left", // curve on left from 08 -> 09
    },
    {
      type: "ltr",
      leftStep: FLOW_STEPS[8], // 09
      rightStep: FLOW_STEPS[9], // 10
      hasStart: false,
      curveToNext: "right", // curve on right from 10 -> 11
    },
    {
      type: "rtl",
      leftStep: FLOW_STEPS[11], // 12
      rightStep: FLOW_STEPS[10], // 11
      hasStart: false,
      curveToNext: "left", // curve on left from 12 -> 13
    },
    {
      type: "ltr",
      leftStep: FLOW_STEPS[12], // 13
      rightStep: FLOW_STEPS[13], // 14
      hasStart: false,
      curveToNext: "right", // curve on right from 14 -> 15
    },
    {
      type: "final",
      leftStep: FLOW_STEPS[14], // 15
      hasFinish: true,
    },
  ];

  return (
    <main className="relative min-h-screen bg-[#030014] text-slate-100 pb-16 overflow-x-hidden selection:bg-purple-500/30 selection:text-white">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none opacity-20 -z-0">
        <div className="absolute top-10 left-1/4 w-[600px] h-[600px] rounded-full bg-cyan-600/15 blur-[170px]" />
        <div className="absolute bottom-10 right-1/4 w-[600px] h-[600px] rounded-full bg-purple-600/15 blur-[170px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#030014]/85 border-b border-white/10 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleReturnToPortfolio}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-300 bg-white/5 border border-white/10 hover:border-cyan-400 hover:text-white transition-all cursor-pointer shadow-sm active:scale-95"
          >
            {renderIcon(FaArrowLeft, { size: 11 })}
            <span>Back to Projects</span>
          </button>

          <a
            href="#hire"
            onClick={(e) => {
              e.preventDefault();
              window.location.hash = "#hire";
            }}
            className="px-4 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 shadow-md transition-all cursor-pointer"
          >
            Hire Me
          </a>
        </div>
      </header>

      {/* Main Container */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        {/* Title Header (Matches Reference Image Style) */}
        <div className="text-center pt-8 sm:pt-12 pb-8 max-w-2xl mx-auto">
          {/* Main Title Pill */}
          <div className="inline-block px-7 py-2.5 rounded-full bg-gradient-to-r from-cyan-950/80 via-[#0e1628] to-purple-950/80 border border-cyan-400/40 shadow-[0_0_30px_rgba(6,182,212,0.25)] mb-3 backdrop-blur-md">
            <h1 className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 tracking-tight">
              Project Case Study
            </h1>
          </div>

          {/* Subtitle Pill */}
          <div>
            <span className="inline-block px-4 py-1 rounded-full bg-slate-900/90 border border-white/10 text-xs sm:text-sm font-medium text-slate-300 shadow-md">
              A Complete Journey From Idea to Impact
            </span>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* DESKTOP & TABLET: SERPENTINE / ZIGZAG FLOWCHART (md and above)      */}
        {/* ==================================================================== */}
        <div className="hidden md:block relative pt-4 pb-8 space-y-10">
          {rows.map((row, rIdx) => {
            if (row.type === "ltr") {
              // Left to Right row: LeftStep -> RightStep
              return (
                <div key={rIdx} className="relative flex items-center justify-between gap-6">
                  {/* Left item + optional START node */}
                  <div className="flex-1 flex items-center gap-3">
                    {row.hasStart && (
                      <>
                        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)] shrink-0 font-bold text-xs">
                          {renderIcon(FaFlag, { size: 13 })}
                          <span>START</span>
                        </div>
                        <div className="text-cyan-400 shrink-0 font-bold text-lg">→</div>
                      </>
                    )}
                    {row.leftStep && renderStepCard(row.leftStep)}
                  </div>

                  {/* Horizontal Arrow between left & right */}
                  <div className="flex items-center justify-center w-8 shrink-0">
                    <div className="w-8 h-8 rounded-full bg-white/5 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-md">
                      {renderIcon(FaArrowRight, { size: 11 })}
                    </div>
                  </div>

                  {/* Right item */}
                  <div className="flex-1">
                    {row.rightStep && renderStepCard(row.rightStep)}
                  </div>

                  {/* Curved Turn-Around Pipe on the RIGHT (Curves down into next row) */}
                  {row.curveToNext === "right" && (
                    <div className="absolute -right-7 top-1/2 w-8 h-[calc(100%+2.5rem)] pointer-events-none">
                      <svg
                        className="w-full h-full overflow-visible"
                        viewBox="0 0 32 100"
                        fill="none"
                        preserveAspectRatio="none"
                      >
                        <path
                          d="M 0 0 C 35 0, 35 100, 0 100"
                          stroke="url(#flowGradientRight)"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                        {/* Downward arrow head at bottom entry */}
                        <polygon points="0,96 8,100 0,104" fill="#8b5cf6" />
                        <defs>
                          <linearGradient id="flowGradientRight" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#06b6d4" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  )}
                </div>
              );
            }

            if (row.type === "rtl") {
              // Right to Left row: RightStep <- LeftStep
              return (
                <div key={rIdx} className="relative flex items-center justify-between gap-6">
                  {/* Left item (04, 08, 12) */}
                  <div className="flex-1">
                    {row.leftStep && renderStepCard(row.leftStep)}
                  </div>

                  {/* Horizontal Arrow pointing LEFT */}
                  <div className="flex items-center justify-center w-8 shrink-0">
                    <div className="w-8 h-8 rounded-full bg-white/5 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-md">
                      {renderIcon(FaArrowLeft, { size: 11 })}
                    </div>
                  </div>

                  {/* Right item (03, 07, 11) */}
                  <div className="flex-1">
                    {row.rightStep && renderStepCard(row.rightStep)}
                  </div>

                  {/* Curved Turn-Around Pipe on the LEFT (Curves down into next row) */}
                  {row.curveToNext === "left" && (
                    <div className="absolute -left-7 top-1/2 w-8 h-[calc(100%+2.5rem)] pointer-events-none">
                      <svg
                        className="w-full h-full overflow-visible"
                        viewBox="0 0 32 100"
                        fill="none"
                        preserveAspectRatio="none"
                      >
                        <path
                          d="M 32 0 C -5 0, -5 100, 32 100"
                          stroke="url(#flowGradientLeft)"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                        {/* Arrow head at bottom entry pointing right */}
                        <polygon points="32,96 24,100 32,104" fill="#06b6d4" />
                        <defs>
                          <linearGradient id="flowGradientLeft" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#8b5cf6" />
                            <stop offset="100%" stopColor="#06b6d4" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  )}
                </div>
              );
            }

            // Final row: 15 Live Demo -> FINISH
            return (
              <div key={rIdx} className="relative flex items-center justify-between gap-6">
                <div className="flex-1">
                  {row.leftStep && renderStepCard(row.leftStep)}
                </div>

                <div className="flex items-center justify-center w-8 shrink-0">
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-md">
                    {renderIcon(FaArrowRight, { size: 11 })}
                  </div>
                </div>

                {/* FINISH Trophy Node (Exact match with reference image) */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex-1 p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-emerald-500/40 bg-gradient-to-br from-emerald-950/70 via-[#071317] to-[#04090f] backdrop-blur-xl shadow-[0_8px_32px_-8px_rgba(16,185,129,0.3)] relative group"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center text-lg sm:text-xl shrink-0 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
                      {renderIcon(FaTrophy, { size: 20 })}
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-black text-emerald-300 tracking-wider">
                        FINISH
                      </h3>
                      <p className="text-xs text-slate-300 mt-1 font-medium leading-relaxed">
                        A Project Well Documented Is A Skill That Stands Out.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* ==================================================================== */}
        {/* MOBILE: SEQUENTIAL FLOWCHART (Below md)                              */}
        {/* ==================================================================== */}
        <div className="block md:hidden relative pt-2 pb-6 space-y-5">
          {/* Start Node */}
          <div className="flex items-center justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-bold text-xs shadow-md">
              {renderIcon(FaFlag, { size: 12 })}
              <span>START OF JOURNEY</span>
            </div>
          </div>

          {/* 15 Steps vertically stacked */}
          {FLOW_STEPS.map((step, sIdx) => (
            <div key={step.step} className="relative">
              {renderStepCard(step)}

              {/* Connecting Down Arrow */}
              {sIdx < FLOW_STEPS.length - 1 && (
                <div className="flex justify-center my-2">
                  <span className="text-cyan-400/60 text-xs">↓</span>
                </div>
              )}
            </div>
          ))}

          {/* Finish Node */}
          <div className="mt-4 p-4 rounded-2xl border border-emerald-500/40 bg-emerald-950/50 text-center space-y-1.5 shadow-lg">
            <div className="inline-flex p-2 rounded-xl bg-emerald-500/20 text-emerald-400 mb-1">
              {renderIcon(FaTrophy, { size: 18 })}
            </div>
            <h3 className="text-sm font-black text-emerald-300 uppercase tracking-wider">
              FINISH
            </h3>
            <p className="text-xs text-slate-300">
              A Project Well Documented Is A Skill That Stands Out.
            </p>
          </div>
        </div>

        {/* Featured Projects Showcase */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-white/10">
          <div className="text-center sm:text-left mb-5">
            <h2 className="text-lg sm:text-xl font-bold text-white">
              Featured Case Study Projects
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Explore real applications built and documented with this methodology.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {projects.map((proj) => (
              <div
                key={proj.id}
                onClick={() => {
                  if (onSelectProject) {
                    onSelectProject(proj);
                  } else {
                    window.location.href = `/?project=${proj.id}`;
                  }
                }}
                className="p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-cyan-400/40 transition-all cursor-pointer group"
              >
                <div className="relative aspect-video rounded-lg overflow-hidden mb-3 bg-slate-900">
                  <img
                    src={proj.image}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e: any) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
                <span className="text-[9px] font-mono uppercase text-cyan-400">
                  {proj.categoryLabel}
                </span>
                <h3 className="text-sm font-bold text-white mt-0.5 truncate group-hover:text-cyan-300">
                  {proj.title}
                </h3>
                <div className="mt-2 text-[11px] text-cyan-400 flex items-center gap-1">
                  <span>View Project</span>
                  {renderIcon(FaArrowRight, { size: 9 })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Return Button */}
        <div className="mt-10 sm:mt-12 text-center">
          <button
            type="button"
            onClick={handleReturnToPortfolio}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 hover:text-white text-xs font-semibold transition-all cursor-pointer active:scale-95"
          >
            {renderIcon(FaArrowLeft, { size: 10 })}
            <span>Return to Portfolio</span>
          </button>
        </div>
      </div>
    </main>
  );
};

export default CaseStudies;
