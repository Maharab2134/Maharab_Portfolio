import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaArrowLeft,
  FaLightbulb,
  FaSitemap,
  FaCode,
  FaVial,
  FaRocket,
  FaChartLine,
  FaCheckCircle,
  FaTerminal,
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

interface CaseStudyPhase {
  id: string;
  stepNumber: string;
  phaseName: string;
  title: string;
  tagline: string;
  icon: any;
  colorTheme: string;
  badge: string;
  summary: string;
  coreQuestions: string[];
  deliverables: string[];
  sampleOutput: {
    label: string;
    description: string;
    codeSnippet?: string;
  };
}

const CASE_STUDY_PHASES: CaseStudyPhase[] = [
  {
    id: "discovery",
    stepNumber: "01",
    phaseName: "PHASE 01",
    title: "Problem Discovery & Business Scope",
    tagline: "Uncovering root friction points, constraints, and business KPIs before writing code",
    icon: FaLightbulb,
    colorTheme: "from-amber-500 to-orange-600",
    badge: "FOUNDATION",
    summary:
      "A high-impact case study starts by identifying the exact commercial challenge. We dissect what was broken, who the target users are, what latency or conversion bottlenecks existed, and define measurable success criteria.",
    coreQuestions: [
      "What is the exact user pain point or business bottleneck?",
      "Why did legacy or alternative approaches fail?",
      "What are the target KPIs (e.g. sub-200ms latency, 99.9% uptime)?",
      "What are the non-negotiable security and compliance requirements?",
    ],
    deliverables: [
      "Product Requirements Document (PRD)",
      "Target User Personas & Journey Map",
      "Key Success Metrics (KPI Matrix)",
      "Technical Risk & Feasibility Assessment",
    ],
    sampleOutput: {
      label: "Discovered Bottleneck & Target Goal",
      description:
        "Client's legacy system had an 8.4s checkout delay and dropped 14% of transactions during peak traffic. Target goal: Re-engineer into a reactive, decoupled architecture supporting 20,000 req/min with < 150ms response times.",
    },
  },
  {
    id: "architecture",
    stepNumber: "02",
    phaseName: "PHASE 02",
    title: "System Architecture & Stack Selection",
    tagline: "Designing high-availability data topologies, protocols, and microservices schemas",
    icon: FaSitemap,
    colorTheme: "from-cyan-500 to-blue-600",
    badge: "SYSTEM DESIGN",
    summary:
      "Translating requirements into a resilient system blueprint. We choose the optimal technology stack (e.g., Next.js, Node.js, PostgreSQL, Redis), model relational vs non-relational database schemas, and map out secure API boundaries.",
    coreQuestions: [
      "Monolith, modular monolith, or distributed microservices?",
      "Which database model fits the query patterns (Relational, Document, Cache)?",
      "How is authentication, authorization, and RBAC enforced at the edge?",
      "What are the fallback caching and data consistency strategies?",
    ],
    deliverables: [
      "Interactive System Topology Diagram",
      "Entity Relationship Diagrams (ERD)",
      "API Specification & Contracts (REST / OpenAPI)",
      "Security Protocols & JWT/OAuth 2.0 Boundaries",
    ],
    sampleOutput: {
      label: "Architecture Schema Strategy",
      description:
        "Engineered a Next.js App Router frontend with Node.js/Fastify microservices, PostgreSQL with connection pooling (PgBouncer), and a Redis cluster for sub-millisecond session validation and rate-limiting.",
      codeSnippet: `// System Architecture Topology Flow
Clients (Web & Mobile)
  └── Edge CDN (Cloudflare WAF / SSL Termination)
        └── Reverse Proxy (NGINX / Load Balancer)
              ├── API Gateway & Auth Guard (JWT / Rate-Limit)
              │     ├── Core REST Service (Fastify / TypeScript)
              │     └── Async Worker Queue (BullMQ / Redis)
              └── Persistent Storage Layer
                    ├── Read-Replica Cache (Redis In-Memory)
                    └── Primary Database (PostgreSQL / ACID Compliant)`,
    },
  },
  {
    id: "engineering",
    stepNumber: "03",
    phaseName: "PHASE 03",
    title: "Core Engineering & Bottleneck Resolution",
    tagline: "Building scalable logic and conquering hard concurrency, cache, and state problems",
    icon: FaCode,
    colorTheme: "from-purple-500 to-indigo-600",
    badge: "DEEP CODE",
    summary:
      "This is where true engineering shines in a case study. We document the hard engineering hurdles tackled: race conditions, real-time WebSocket state synchronization, memory leak diagnostics, and query optimization.",
    coreQuestions: [
      "What was the most difficult technical bottleneck encountered?",
      "How were concurrency conflicts and race conditions avoided?",
      "How is state synchronized across client devices with minimal re-renders?",
      "What clean code paradigms ensure testability and long-term maintainability?",
    ],
    deliverables: [
      "Modular, Clean TypeScript Codebase",
      "Optimized Database Indexes & Queries",
      "Resilient Error Handling & Retry Mechanics",
      "Automated State Management & Cache Invalidation",
    ],
    sampleOutput: {
      label: "Concurrency & Cache Invalidation Challenge",
      description:
        "Overcame high-frequency database contention by implementing optimistic UI updates combined with Redis distributed locks (Redlock) and idempotency keys, eliminating duplicate transaction anomalies entirely.",
      codeSnippet: `// Idempotent Transaction Execution with Distributed Lock
export async function executeCriticalTransaction(
  idempotencyKey: string,
  payload: TransactionPayload
): Promise<TransactionResult> {
  const lock = await redis.acquireLock(\`lock:\${idempotencyKey}\`, 3000);
  if (!lock) throw new ConcurrencyError("Transaction already in flight.");

  try {
    const existing = await db.transactions.findUnique({ where: { idempotencyKey } });
    if (existing) return existing.result;

    const result = await db.$transaction(async (tx) => {
      // Atomic state transition with zero race conditions
      return await processOrder(tx, payload);
    });
    return result;
  } finally {
    await lock.release();
  }
}`,
    },
  },
  {
    id: "testing",
    stepNumber: "04",
    phaseName: "PHASE 04",
    title: "Quality Assurance & Performance Tuning",
    tagline: "Stress testing, Core Web Vitals optimization, and automated end-to-end verification",
    icon: FaVial,
    colorTheme: "from-emerald-500 to-teal-600",
    badge: "VERIFICATION",
    summary:
      "No case study is complete without proof of stability. We run automated test suites, load test with synthetic traffic (10,000+ concurrent requests), audit for security vulnerabilities, and optimize Lighthouse Core Web Vitals to 95+.",
    coreQuestions: [
      "Does the system pass unit, integration, and E2E regressions?",
      "How does the system behave under 5x expected maximum traffic spike?",
      "Are Core Web Vitals (LCP, INP, CLS) within the 'Good' threshold?",
      "Are all endpoints protected against OWASP Top 10 vulnerabilities?",
    ],
    deliverables: [
      "Automated Test Coverage (Jest / Playwright)",
      "Lighthouse 98+ Core Web Vitals Audit Report",
      "K6 Load & Stress Testing Benchmark",
      "Automated Vulnerability Scan (Snyk / OWASP)",
    ],
    sampleOutput: {
      label: "Performance Optimization Results",
      description:
        "Reduced Largest Contentful Paint (LCP) from 3.2s to 0.7s by optimizing image modern formats (WebP/AVIF), inlining critical CSS, and pre-warming database connection pools.",
    },
  },
  {
    id: "deployment",
    stepNumber: "05",
    phaseName: "PHASE 05",
    title: "CI/CD Pipeline & Zero-Downtime Deploy",
    tagline: "Automated Docker containerization, cloud orchestration, and blue-green rollouts",
    icon: FaRocket,
    colorTheme: "from-rose-500 to-pink-600",
    badge: "DELIVERY",
    summary:
      "A great case study documents the continuous delivery workflow. We build multi-stage Docker images, orchestrate GitHub Actions workflows, automate database migrations, and deploy with zero downtime.",
    coreQuestions: [
      "How are code changes tested and built automatically upon commit?",
      "How are database migrations executed safely without locking production tables?",
      "What is the rollback strategy in case of a critical upstream fault?",
      "Is centralized telemetry and APM error alerting actively monitoring production?",
    ],
    deliverables: [
      "GitHub Actions CI/CD Pipeline Automation",
      "Multi-Stage Dockerfile with Minimized Image Footprint",
      "Automated Zero-Downtime Rollout Strategy",
      "Real-Time Telemetry & Alerting (Sentry / Datadog)",
    ],
    sampleOutput: {
      label: "CI/CD Automation Pipeline",
      description:
        "Every push to production triggers automated linting, test execution, security scans, Docker build, and rolling blue-green deployment in under 3 minutes with zero user downtime.",
    },
  },
  {
    id: "impact",
    stepNumber: "06",
    phaseName: "PHASE 06",
    title: "Measurable Business ROI & Post-Mortem",
    tagline: "Quantifiable conversion lift, latency reduction, and long-term architectural health",
    icon: FaChartLine,
    colorTheme: "from-violet-500 to-fuchsia-600",
    badge: "BUSINESS IMPACT",
    summary:
      "The climax of the case study is business value. We measure real-world numbers: speed improvements, cost savings, user retention increase, and uptime reliability.",
    coreQuestions: [
      "What quantifiable percentage improvement was achieved?",
      "Did server and cloud infrastructure costs decrease?",
      "What was the user feedback and client retention impact?",
      "What lessons were learned to guide the next iteration roadmap?",
    ],
    deliverables: [
      "Before vs After Metrics Comparison Table",
      "Infrastructure Cost Reduction Audit",
      "User Feedback & Client Testimonial",
      "Future Scalability & Feature Roadmap",
    ],
    sampleOutput: {
      label: "Verified Business Impact",
      description:
        "Resulted in +38% increase in completed transactions, 99.99% system uptime over 12 months, and 45% reduction in monthly cloud hosting overhead.",
    },
  },
];

const CaseStudies: React.FC<CaseStudiesProps> = ({ onBack, onSelectProject }) => {
  const profile = useLiveProfile();
  const name = profile.name || PORTFOLIO_INFO.name;
  const [activePhaseId, setActivePhaseId] = useState<string>("discovery");
  const [allProjects, setAllProjects] = useState<Project[]>([]);

  useEffect(() => {
    document.title = `Case Studies Blueprint & Flow | ${name}`;
    window.scrollTo({ top: 0, behavior: "smooth" });
    setAllProjects(getAllProjectsSync());

    return () => {
      document.title = `${name} | Software Engineer & Architect`;
    };
  }, [name]);

  const activePhase =
    CASE_STUDY_PHASES.find((p) => p.id === activePhaseId) || CASE_STUDY_PHASES[0];

  const handleReturnToPortfolio = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onBack) {
      onBack();
    } else {
      window.location.hash = "#projects";
      window.location.href = "/#projects";
    }
  };

  const featuredProjects = allProjects.filter((p) => p.featured).slice(0, 3);

  return (
    <main className="relative min-h-screen bg-[#030014] text-slate-100 selection:bg-purple-500/30 selection:text-white pb-16 overflow-x-hidden">
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none opacity-25 -z-0">
        <div className="absolute top-10 left-1/4 w-[600px] h-[600px] rounded-full bg-cyan-600/15 blur-[160px]" />
        <div className="absolute bottom-10 right-1/4 w-[650px] h-[650px] rounded-full bg-purple-600/15 blur-[160px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* Sticky Navigation Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#030014]/85 border-b border-white/10 px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleReturnToPortfolio}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-300 bg-white/5 border border-white/10 hover:border-cyan-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer shadow-sm active:scale-95"
            >
              {renderIcon(FaArrowLeft, { size: 11 })}
              <span>Back to Projects</span>
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 border-l border-white/10 pl-3">
              <span>{name}</span>
              <span className="text-slate-600">/</span>
              <span className="text-cyan-400 font-mono">Case Study Engineering Blueprint</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href="#hire"
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = "#hire";
              }}
              className="px-4 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 shadow-md shadow-purple-500/20 transition-all cursor-pointer"
            >
              Hire Me
            </a>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <section className="relative pt-10 sm:pt-14 pb-8 sm:pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 mb-4 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            {renderIcon(HiOutlineSparkles, { className: "text-amber-400" })}
            <span>ENGINEERING METHODOLOGY • FULL FLOW</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            How a Production-Grade{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
              Project Case Study
            </span>{" "}
            is Engineered
          </h1>

          <p className="mt-3.5 text-xs sm:text-sm md:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
            A comprehensive, transparent walk-through of how every project is discovered, architected,
            developed, load-tested, and deployed for measurable commercial impact.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 p-3 rounded-2xl bg-white/[0.025] border border-white/10 backdrop-blur-md max-w-2xl mx-auto text-left">
            <div className="p-2 border-r border-white/5">
              <span className="block text-lg font-black text-cyan-400 font-mono">6 Steps</span>
              <span className="text-[11px] text-slate-400">Rigorous Lifecycle</span>
            </div>
            <div className="p-2 sm:border-r border-white/5">
              <span className="block text-lg font-black text-purple-400 font-mono">100% Type-Safe</span>
              <span className="text-[11px] text-slate-400">Modern Codebase</span>
            </div>
            <div className="p-2 border-r border-white/5">
              <span className="block text-lg font-black text-emerald-400 font-mono">&lt; 100ms</span>
              <span className="text-[11px] text-slate-400">Target Latency</span>
            </div>
            <div className="p-2">
              <span className="block text-lg font-black text-pink-400 font-mono">0 Downtime</span>
              <span className="text-[11px] text-slate-400">CI/CD Automation</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Interactive Phase Flow Navigator */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mt-4">
        {/* Phase Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-none justify-start md:justify-center">
          {CASE_STUDY_PHASES.map((phase) => {
            const isActive = activePhaseId === phase.id;
            return (
              <button
                key={phase.id}
                type="button"
                onClick={() => setActivePhaseId(phase.id)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-mono font-semibold transition-all duration-200 shrink-0 border cursor-pointer ${
                  isActive
                    ? "bg-white/10 border-cyan-400 text-white shadow-[0_0_20px_rgba(6,182,212,0.25)] scale-102"
                    : "bg-white/[0.03] border-white/10 text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold text-white bg-gradient-to-br ${phase.colorTheme}`}
                >
                  {phase.stepNumber}
                </span>
                <span className="whitespace-nowrap">{phase.title.split("&")[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Active Phase Deep Dive Card */}
        <div className="mt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePhase.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-gradient-to-b from-[#0d1424] via-[#090e1f] to-[#050814] shadow-2xl backdrop-blur-xl relative overflow-hidden"
            >
              {/* Top Accent Gradient Border */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${activePhase.colorTheme}`}
              />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column: Phase Description & Deliverables */}
                <div className="lg:col-span-7 space-y-5">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white text-lg shadow-lg bg-gradient-to-br ${activePhase.colorTheme}`}
                    >
                      {renderIcon(activePhase.icon, { size: 20 })}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-cyan-400">
                          {activePhase.phaseName}
                        </span>
                        <span className="text-slate-600">•</span>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10">
                          {activePhase.badge}
                        </span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                        {activePhase.title}
                      </h2>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-cyan-300/90 font-medium">
                    {activePhase.tagline}
                  </p>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                    {activePhase.summary}
                  </p>

                  {/* Core Questions Answered */}
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2.5">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      <span>Key Questions Addressed in This Phase:</span>
                    </h3>
                    <ul className="space-y-1.5">
                      {activePhase.coreQuestions.map((q, idx) => (
                        <li
                          key={idx}
                          className="text-xs text-slate-400 flex items-start gap-2 leading-relaxed"
                        >
                          <span className="text-cyan-400 shrink-0 mt-0.5">→</span>
                          <span>{q}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tangible Deliverables */}
                  <div>
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200 mb-2.5 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>Tangible Engineering Deliverables:</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {activePhase.deliverables.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-300"
                        >
                          {renderIcon(FaCheckCircle, {
                            size: 12,
                            className: "text-emerald-400 shrink-0",
                          })}
                          <span className="truncate">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Code Snippet / Concrete Case Study Artifact */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="p-5 rounded-2xl bg-black/50 border border-white/10 shadow-inner">
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                        {renderIcon(FaTerminal, { size: 10 })}
                        <span>{activePhase.sampleOutput.label}</span>
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">ARTIFACT PREVIEW</span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed mb-3">
                      {activePhase.sampleOutput.description}
                    </p>

                    {activePhase.sampleOutput.codeSnippet && (
                      <div className="mt-3 p-3 rounded-xl bg-[#030611] border border-cyan-500/20 text-[11px] font-mono text-cyan-300 overflow-x-auto">
                        <pre className="leading-relaxed">
                          {activePhase.sampleOutput.codeSnippet}
                        </pre>
                      </div>
                    )}
                  </div>

                  {/* Action navigation button */}
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/10 text-xs">
                    <span className="text-slate-400 font-mono">
                      Phase {activePhase.stepNumber} of 06
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const curIdx = CASE_STUDY_PHASES.findIndex((p) => p.id === activePhase.id);
                        const nextIdx = (curIdx + 1) % CASE_STUDY_PHASES.length;
                        setActivePhaseId(CASE_STUDY_PHASES[nextIdx].id);
                      }}
                      className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-mono font-semibold transition-colors cursor-pointer"
                    >
                      <span>Next Phase</span>
                      {renderIcon(FaArrowRight, { size: 10 })}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Real-World Case Studies Applied Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mt-14 sm:mt-16">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-purple-400">
            PRACTICAL EXECUTION
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5">
            Featured Projects Built With This Flow
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Explore how these exact engineering phases were applied to real production software systems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProjects.map((project) => (
            <article
              key={project.id}
              onClick={() => {
                if (onSelectProject) {
                  onSelectProject(project);
                } else {
                  window.location.href = `/?project=${project.id}`;
                }
              }}
              className="group p-5 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-cyan-400/40 transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-video rounded-xl overflow-hidden mb-4 bg-slate-900">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e: any) => {
                      e.target.style.display = "none";
                    }}
                  />
                  <div className="absolute top-2.5 right-2.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/80 text-white backdrop-blur-md">
                      Featured
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-cyan-300">
                    {project.categoryLabel}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {project.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                  {project.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-cyan-400 font-medium group-hover:translate-x-1 transition-transform">
                  <span>View Deep-Dive</span>
                  {renderIcon(FaArrowRight, { size: 10 })}
                </div>
                {project.link && (
                  <span className="text-[11px] text-slate-500 hover:text-slate-300">
                    Live System ↗
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Why Rigorous Case Studies Matter Banner */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mt-14 sm:mt-18">
        <div className="p-8 sm:p-10 rounded-3xl border border-white/10 bg-gradient-to-r from-purple-950/30 via-[#0a0f1d] to-cyan-950/30 backdrop-blur-xl relative overflow-hidden shadow-2xl">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full inline-block">
              READY TO COLLABORATE
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Want this engineering discipline applied to your product?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Whether architecting a zero-to-one MVP, refactoring an enterprise microservice, or scaling
              a high-traffic web platform, I deliver measurable results through proven engineering methods.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a
                href="#hire"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.hash = "#hire";
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs tracking-wide shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
              >
                <span>Initiate Project Inquiry</span>
                {renderIcon(FaArrowRight, { size: 10 })}
              </a>

              <button
                type="button"
                onClick={handleReturnToPortfolio}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-xs transition-all cursor-pointer"
              >
                <span>Return to Portfolio</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CaseStudies;
