import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCode,
  FaArrowRight,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import {
  useLiveSkills,
  useLiveSkillCategories,
  resolveSkillIcon,
  resolveCategoryIcon,
} from "../lib/portfolioService";

const renderIcon = (Icon: any, props: any = {}) => {
  const Comp: any = Icon || FaCode;
  return <Comp {...props} />;
};

const Skills: React.FC = () => {
  const liveSkills = useLiveSkills();
  const liveCategories = useLiveSkillCategories();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [showAllSkills, setShowAllSkills] = useState<boolean>(false);
  const [columns, setColumns] = useState<number>(5);

  useEffect(() => {
    const updateCols = () => {
      if (typeof window === "undefined") return;
      if (window.innerWidth >= 1024) setColumns(5);
      else if (window.innerWidth >= 768) setColumns(4);
      else if (window.innerWidth >= 640) setColumns(3);
      else setColumns(2);
    };

    updateCols();
    window.addEventListener("resize", updateCols);
    return () => window.removeEventListener("resize", updateCols);
  }, []);

  const handleTabChange = (tabId: string) => {
    setActiveCategory(tabId);
    setShowAllSkills(false);
  };

  const filterTabs = [
    { id: "all", label: "All Technologies", icon: FaCode },
    ...liveCategories.map((c) => ({
      id: c.id,
      label: c.label,
      icon: resolveCategoryIcon(c.id, c.iconName),
    })),
  ];

  const filteredSkills = liveSkills.filter((skill) => {
    if (activeCategory === "all") return true;
    return skill.category === activeCategory;
  });

  const isAllTab = activeCategory === "all";
  const rowLimit = columns * 4; // Exactly 4 rows based on current active grid columns
  const visibleSkills =
    isAllTab && !showAllSkills
      ? filteredSkills.slice(0, rowLimit)
      : filteredSkills;

  return (
    <section
      id="skills"
      className="relative py-12 sm:py-16 overflow-hidden bg-gradient-to-b from-[#030014] via-[#090e1f] to-[#030014]"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 sm:mb-12 text-center"
        >
          <span className="text-xs font-semibold tracking-widest uppercase text-purple-400">
            Technical Stack
          </span>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
            Skills &amp; Technologies
          </h2>
          <div className="w-20 h-1 mx-auto mt-4 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400" />
          <p className="max-w-2xl mx-auto mt-4 text-sm sm:text-base text-slate-400">
            A comprehensive, battle-tested technology arsenal applied across production web systems, mobile applications, and embedded engineering.
          </p>
        </motion.div>

        {/* Interactive Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {filterTabs.map((tab) => {
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium rounded-full transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 text-white shadow-lg shadow-purple-500/20 scale-105"
                    : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/10"
                }`}
              >
                {renderIcon(tab.icon, { size: 12 })}
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Skills Grid */}
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4"
        >
          <AnimatePresence>
            {visibleSkills.map((skill, index) => {
              const skillIcon = resolveSkillIcon(skill.name, skill.iconName, skill.category);
              const lvlLower = (skill.level || "").toLowerCase();
              const isCore =
                skill.level === "Core" ||
                skill.level === "Core Production" ||
                lvlLower.includes("core") ||
                lvlLower.includes("expert") ||
                lvlLower.includes("beshi");
              const isAdvanced =
                skill.level === "Advanced" ||
                lvlLower.includes("adv") ||
                lvlLower.includes("valo") ||
                lvlLower.includes("high");
              const isWorkingKnowledge =
                skill.level === "Working Knowledge" ||
                skill.level === "Proficient" ||
                lvlLower.includes("working") ||
                lvlLower.includes("proficient") ||
                lvlLower.includes("medium");

              return (
                <motion.div
                  key={skill.id || skill.name}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.25, delay: index * 0.02 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="flex flex-col items-center justify-center p-4 text-center border rounded-2xl bg-white/[0.03] border-white/10 backdrop-blur-xl hover:border-purple-500/40 hover:bg-white/[0.06] transition-colors group shadow-md shadow-black/10"
                >
                  {/* Icon Container */}
                  <div
                    className="flex items-center justify-center w-12 h-12 mb-3 rounded-xl transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${skill.color || "#a855f7"}18` }}
                  >
                    {renderIcon(skillIcon, {
                      size: 26,
                      style: { color: skill.color || "#a855f7" },
                    })}
                  </div>

                  {/* Skill Name */}
                  <h3 className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors">
                    {skill.name}
                  </h3>

                  {/* Level Tag */}
                  <span
                    className={`inline-block mt-2 px-2.5 py-0.5 text-[10px] font-semibold rounded-full border ${
                      isCore
                        ? "bg-purple-500/10 border-purple-500/30 text-purple-300"
                        : isAdvanced
                        ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-300"
                        : isWorkingKnowledge
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                        : "bg-amber-500/10 border-amber-500/30 text-amber-300"
                    }`}
                  >
                    {skill.level}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* View All / Show Less Toggle Button */}
        {isAllTab && filteredSkills.length > rowLimit && (
          <div className="flex justify-center mt-10">
            <button
              type="button"
              onClick={() => {
                setShowAllSkills((prev) => !prev);
              }}
              className="inline-flex items-center gap-2.5 px-7 py-3 text-xs sm:text-sm font-semibold text-white transition-all duration-300 rounded-full border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 hover:border-purple-400 hover:scale-105 shadow-lg shadow-purple-500/10 active:scale-95 group"
            >
              <span>
                {showAllSkills
                  ? "Show Less"
                  : `View All Technologies (${filteredSkills.length})`}
              </span>
              {renderIcon(showAllSkills ? FaChevronUp : FaChevronDown, {
                size: 13,
                className: "transition-transform text-purple-300",
              })}
            </button>
          </div>
        )}

        {/* CTA to Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="p-8 mt-16 text-center border rounded-3xl bg-gradient-to-r from-purple-950/20 via-slate-900/40 to-cyan-950/20 border-white/10 backdrop-blur-xl max-w-3xl mx-auto"
        >
          <h3 className="text-xl font-bold text-white sm:text-2xl">
            Want to see these technologies in action?
          </h3>
          <p className="mt-2 text-sm text-slate-400 max-w-lg mx-auto">
            Browse through my full case studies featuring architecture breakdowns, code repositories, and live deployed systems.
          </p>
          <div className="mt-6">
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center gap-2 px-7 py-3 text-sm font-semibold text-white transition-all duration-300 rounded-full shadow-lg bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 hover:shadow-purple-500/30 hover:scale-105 active:scale-95"
            >
              <span>Explore My Work</span>
              {renderIcon(FaArrowRight, { size: 12 })}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
