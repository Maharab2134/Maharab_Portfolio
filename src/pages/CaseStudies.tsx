import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaArrowLeft,
  FaLightbulb,
  FaSitemap,
  FaCode,
  FaVial,
  FaRocket,
  FaChartLine,
  FaArrowRight,
} from "react-icons/fa";
import { HiOutlineSparkles } from "react-icons/hi";
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

interface FlowStage {
  step: string;
  title: string;
  subtitle: string;
  icon: any;
  color: string;
  badge: string;
  points: string[];
}

const FLOW_STAGES: FlowStage[] = [
  {
    step: "01",
    title: "Problem & Scope",
    subtitle: "User pain points, constraints & target KPIs",
    icon: FaLightbulb,
    color: "from-amber-500 to-orange-600",
    badge: "FOUNDATION",
    points: ["PRD Blueprint", "User Friction Points", "KPI Success Metrics"],
  },
  {
    step: "02",
    title: "System Architecture",
    subtitle: "Data topology, database schemas & API contracts",
    icon: FaSitemap,
    color: "from-cyan-500 to-blue-600",
    badge: "DESIGN",
    points: ["System Topology", "Database Schema & ERD", "Secure API Contracts"],
  },
  {
    step: "03",
    title: "Core Engineering",
    subtitle: "Clean code, state sync & concurrency handling",
    icon: FaCode,
    color: "from-purple-500 to-indigo-600",
    badge: "BUILD",
    points: ["Type-Safe Codebase", "Concurrency Control", "Optimized Query Indexing"],
  },
  {
    step: "04",
    title: "Testing & QA",
    subtitle: "Automated tests, Core Web Vitals & security audit",
    icon: FaVial,
    color: "from-emerald-500 to-teal-600",
    badge: "TEST",
    points: ["Unit & E2E Tests", "Lighthouse 95+ CWV", "OWASP Security Audit"],
  },
  {
    step: "05",
    title: "CI/CD & Deploy",
    subtitle: "Docker builds, automation & zero downtime",
    icon: FaRocket,
    color: "from-rose-500 to-pink-600",
    badge: "DEPLOY",
    points: ["GitHub Actions CI/CD", "Multi-Stage Docker", "Zero-Downtime Rollout"],
  },
  {
    step: "06",
    title: "Business Impact",
    subtitle: "Latency cut, 99.9% uptime & measurable ROI",
    icon: FaChartLine,
    color: "from-violet-500 to-fuchsia-600",
    badge: "RESULTS",
    points: ["Sub-100ms Latency", "99.9% Production Uptime", "Measurable ROI Lift"],
  },
];

const CaseStudies: React.FC<CaseStudiesProps> = ({ onBack, onSelectProject }) => {
  const profile = useLiveProfile();
  const name = profile.name || PORTFOLIO_INFO.name;
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    document.title = `Case Studies Flow | ${name}`;
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

  return (
    <main className="relative min-h-screen bg-[#030014] text-slate-100 pb-12 overflow-x-hidden selection:bg-purple-500/30 selection:text-white">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none opacity-20 -z-0">
        <div className="absolute top-10 left-1/3 w-[500px] h-[500px] rounded-full bg-cyan-600/15 blur-[150px]" />
        <div className="absolute bottom-10 right-1/3 w-[500px] h-[500px] rounded-full bg-purple-600/15 blur-[150px]" />
      </div>

      {/* Top Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#030014]/85 border-b border-white/10 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
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
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        {/* Title Header */}
        <div className="text-center pt-8 sm:pt-12 pb-6 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 mb-3">
            {renderIcon(HiOutlineSparkles, { className: "text-amber-400" })}
            <span>ENGINEERING METHODOLOGY • 6 STAGES</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Project Case Study Flow
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-slate-400">
            A concise 6-step engineering flow from problem discovery to business impact.
          </p>
        </div>

        {/* 6 Stages Grid (Clean, Simple, Main Points Only) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mt-4">
          {FLOW_STAGES.map((stage, idx) => (
            <motion.article
              key={stage.step}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="p-5 rounded-2xl border border-white/10 bg-white/[0.025] hover:bg-white/[0.05] hover:border-cyan-400/40 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Step Header */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-sm font-black text-white px-2 py-0.5 rounded-lg bg-white/5 border border-white/10">
                      {stage.step}
                    </span>
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-white bg-gradient-to-br ${stage.color}`}
                    >
                      {renderIcon(stage.icon, { size: 13 })}
                    </div>
                  </div>
                  <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10">
                    {stage.badge}
                  </span>
                </div>

                {/* Stage Title & Short Subtitle */}
                <h2 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {stage.title}
                </h2>
                <p className="text-xs text-slate-400 mt-1 mb-3 leading-relaxed">
                  {stage.subtitle}
                </p>
              </div>

              {/* Main Key Points (Pill tags) */}
              <div className="pt-3 border-t border-white/5 flex flex-wrap gap-1.5">
                {stage.points.map((pt, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-medium bg-white/5 border border-white/10 text-slate-300"
                  >
                    <span className="w-1 h-1 rounded-full bg-cyan-400" />
                    <span>{pt}</span>
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </div>

        {/* Featured Projects Built with This Flow */}
        <div className="mt-12 sm:mt-14 pt-8 border-t border-white/10">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                Featured Projects
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Real software built using this engineering workflow.
              </p>
            </div>
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

        {/* Simple Bottom Return Action */}
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
