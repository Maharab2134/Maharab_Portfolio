import React, { useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaArrowLeft,
  FaRocket,
  FaCheckCircle,
  FaCalendarAlt,
  FaCode,
  FaCoffee,
  FaHeart,
  FaLightbulb,
} from "react-icons/fa";
import { PORTFOLIO_INFO, MILESTONES_DATA } from "../data/portfolioData";

const renderIcon = (Icon: any, props: any = {}) => {
  return <Icon {...props} />;
};

const MyJourney: React.FC = () => {
  useEffect(() => {
    document.title = "My Engineering Journey | Md. Maharab Hosen";
    window.scrollTo({ top: 0, behavior: "smooth" });
    return () => {
      document.title = `${PORTFOLIO_INFO.name} | Portfolio`;
    };
  }, []);

  const handleReturnHome = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.hash = "";
    window.location.href = "/";
  };

  const principles = [
    { icon: FaCode, title: "Clean Craftsmanship", desc: "Writing testable, maintainable code structured for scale." },
    { icon: FaCoffee, title: "Relentless Curiosity", desc: "Continuous exploration of modern system architectures and tools." },
    { icon: FaLightbulb, title: "Product Mindset", desc: "Focusing on actual user value and commercial problem solving." },
    { icon: FaHeart, title: "Community & Mentorship", desc: "Sharing knowledge and contributing to open-source growth." },
  ];

  return (
    <main className="relative min-h-screen py-10 sm:py-16 bg-[#030014] text-white overflow-x-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none opacity-20 -z-0">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full bg-purple-600/15 blur-[150px]" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] rounded-full bg-cyan-600/15 blur-[150px]" />
      </div>

      <div className="relative z-10 px-4 mx-auto max-w-5xl sm:px-6 lg:px-8">
        {/* Top Return Navigation */}
        <div className="flex items-center justify-between gap-4 mb-10">
          <a
            href="/"
            onClick={handleReturnHome}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-300 transition-colors border rounded-full bg-white/5 border-white/10 hover:text-white hover:bg-white/10 hover:border-white/25 backdrop-blur-md"
          >
            {renderIcon(FaArrowLeft, { size: 12 })}
            <span>Back to Portfolio</span>
          </a>

          <span className="text-xs font-semibold tracking-wider text-purple-400 uppercase">
            Engineering Evolution
          </span>
        </div>

        {/* Header Hero */}
        <header className="mb-16 text-center max-w-3xl mx-auto">
          <span className="text-xs font-semibold tracking-widest uppercase text-cyan-400">
            Roadmap &amp; Milestones
          </span>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
            My Software Engineering Journey
          </h1>
          <div className="w-20 h-1 mx-auto mt-4 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400" />
          <p className="mt-4 text-sm sm:text-base text-slate-300/90 leading-relaxed font-light">
            From discovering algorithmic logic in 2022 to deploying production-grade full-stack architectures and mobile ecosystems.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {["Software Engineer", "BUBT CSE", "Full Stack Developer", "Mobile Builder"].map((badge) => (
              <span
                key={badge}
                className="px-3.5 py-1 text-xs font-medium rounded-full bg-white/5 border border-white/10 text-slate-300"
              >
                {badge}
              </span>
            ))}
          </div>
        </header>

        {/* Milestone Timeline */}
        <div className="relative pl-6 sm:pl-10 space-y-12 border-l border-white/10 ml-4 sm:ml-8 mb-20">
          {MILESTONES_DATA.map((milestone, index) => (
            <motion.div
              key={milestone.year}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative group"
            >
              {/* Timeline Icon Badge */}
              <div className="absolute -left-[37px] sm:-left-[53px] top-1.5 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-900 border border-purple-500/50 shadow-md shadow-purple-500/20 text-purple-400 group-hover:scale-110 group-hover:border-cyan-400 group-hover:text-cyan-400 transition-all duration-300">
                {renderIcon(FaCalendarAlt, { size: 14 })}
              </div>

              {/* Milestone Card */}
              <div className="p-6 sm:p-8 border rounded-3xl bg-white/[0.03] border-white/10 backdrop-blur-xl shadow-xl shadow-black/20 hover:border-purple-500/30 transition-all duration-300">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className={`px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r ${milestone.gradient} text-white shadow-sm`}>
                    {milestone.year}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {milestone.subtitle}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-white group-hover:text-purple-300 transition-colors mb-3">
                  {milestone.title}
                </h2>

                <p className="text-sm leading-relaxed text-slate-300 mb-5 font-normal">
                  {milestone.description}
                </p>

                {/* Highlights */}
                <div className="pt-4 border-t border-white/5 space-y-2">
                  {milestone.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-400">
                      {renderIcon(FaCheckCircle, { size: 14, className: "text-cyan-400 mt-0.5 flex-shrink-0" })}
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Guiding Principles Grid */}
        <section className="mb-20">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Guiding Engineering Values
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              The core principles that shape how I build software and collaborate with teams.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {principles.map((p) => (
              <div
                key={p.title}
                className="p-6 border rounded-2xl bg-white/[0.03] border-white/10 backdrop-blur-xl hover:border-white/20 transition-colors"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400">
                    {renderIcon(p.icon, { size: 16 })}
                  </div>
                  <h3 className="text-base font-bold text-white">
                    {p.title}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom Call to Action */}
        <div className="p-8 sm:p-12 text-center border rounded-3xl bg-gradient-to-r from-purple-950/30 via-slate-900/50 to-cyan-950/30 border-white/10 backdrop-blur-xl">
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Let's Build Something Exceptional
          </h3>
          <p className="max-w-lg mx-auto text-sm sm:text-base text-slate-300 mb-8">
            I am always interested in discussing technical challenges, full-time engineering positions, and collaborative products.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="#hire"
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = "#hire";
              }}
              className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold text-white rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 active:scale-95 transition-all"
            >
              <span>Get In Touch</span>
              {renderIcon(FaRocket, { size: 13 })}
            </a>

            <a
              href="/"
              onClick={handleReturnHome}
              className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-300 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 hover:text-white transition-all"
            >
              <span>Back to Home</span>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MyJourney;
