import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaReact,
  FaNodeJs,
  FaGitAlt,
  FaMobileAlt,
  FaPython,
  FaJava,
  FaAndroid,
  FaFigma,
  FaHtml5,
  FaCss3Alt,
  FaDocker,
  FaLinux,
  FaCode,
  FaServer,
  FaDatabase,
  FaBrain,
  FaMicrochip,
  FaArrowRight,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import {
  SiMongodb,
  SiExpress,
  SiPostman,
  SiTensorflow,
  SiFlutter,
  SiKotlin,
  SiMysql,
  SiFirebase,
  SiArduino,
  SiCplusplus,
  SiJavascript,
  SiPostgresql,
  SiTailwindcss,
  SiNextdotjs,
  SiTypescript,
} from "react-icons/si";

interface SkillItem {
  name: string;
  category: "frontend" | "backend" | "mobile" | "languages" | "tools" | "aiml";
  level: "Core Production" | "Advanced" | "Proficient";
  icon: any;
  color: string;
}

const renderIcon = (Icon: any, props: any = {}) => {
  return <Icon {...props} />;
};

const SKILLS_LIST: SkillItem[] = [
  // Frontend & Full Stack
  { name: "React.js", category: "frontend", level: "Core Production", icon: FaReact, color: "#61DAFB" },
  { name: "Next.js", category: "frontend", level: "Core Production", icon: SiNextdotjs, color: "#ffffff" },
  { name: "TypeScript", category: "frontend", level: "Core Production", icon: SiTypescript, color: "#3178C6" },
  { name: "Tailwind CSS", category: "frontend", level: "Core Production", icon: SiTailwindcss, color: "#06B6D4" },
  { name: "HTML5 / Semantic Web", category: "frontend", level: "Advanced", icon: FaHtml5, color: "#E34F26" },
  { name: "Modern CSS3", category: "frontend", level: "Advanced", icon: FaCss3Alt, color: "#1572B6" },

  // Mobile
  { name: "Flutter", category: "mobile", level: "Core Production", icon: SiFlutter, color: "#02569B" },
  { name: "Android Native", category: "mobile", level: "Advanced", icon: FaAndroid, color: "#3DDC84" },
  { name: "Kotlin", category: "mobile", level: "Advanced", icon: SiKotlin, color: "#7F52FF" },
  { name: "Java (Android)", category: "mobile", level: "Advanced", icon: FaJava, color: "#ED8B00" },

  // Backend & Database
  { name: "Node.js", category: "backend", level: "Core Production", icon: FaNodeJs, color: "#339933" },
  { name: "Express.js", category: "backend", level: "Core Production", icon: SiExpress, color: "#ffffff" },
  { name: "MongoDB & Mongoose", category: "backend", level: "Core Production", icon: SiMongodb, color: "#47A248" },
  { name: "PostgreSQL", category: "backend", level: "Advanced", icon: SiPostgresql, color: "#336791" },
  { name: "MySQL", category: "backend", level: "Advanced", icon: SiMysql, color: "#4479A1" },
  { name: "Firebase (Auth/DB)", category: "backend", level: "Advanced", icon: SiFirebase, color: "#FFCA28" },

  // Languages
  { name: "JavaScript (ES6+)", category: "languages", level: "Core Production", icon: SiJavascript, color: "#F7DF1E" },
  { name: "Python", category: "languages", level: "Advanced", icon: FaPython, color: "#3776AB" },
  { name: "C++", category: "languages", level: "Advanced", icon: SiCplusplus, color: "#00599C" },
  { name: "Java", category: "languages", level: "Advanced", icon: FaJava, color: "#ED8B00" },

  // Tools & DevOps
  { name: "Git & GitHub", category: "tools", level: "Core Production", icon: FaGitAlt, color: "#F05032" },
  { name: "Postman", category: "tools", level: "Core Production", icon: SiPostman, color: "#FF6C37" },
  { name: "Linux Environments", category: "tools", level: "Advanced", icon: FaLinux, color: "#FCC624" },
  { name: "Docker Basics", category: "tools", level: "Proficient", icon: FaDocker, color: "#2496ED" },
  { name: "UI/UX & Figma", category: "tools", level: "Proficient", icon: FaFigma, color: "#F24E1E" },

  // AI & IoT
  { name: "TensorFlow & Keras", category: "aiml", level: "Advanced", icon: SiTensorflow, color: "#FF6F00" },
  { name: "ESP32 & IoT Embedded", category: "aiml", level: "Advanced", icon: FaMicrochip, color: "#38BDF8" },
  { name: "Arduino Hardware", category: "aiml", level: "Advanced", icon: SiArduino, color: "#00979D" },
];

const Skills: React.FC = () => {
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
    { id: "frontend", label: "Frontend & Full Stack", icon: FaReact },
    { id: "mobile", label: "Mobile Apps", icon: FaMobileAlt },
    { id: "backend", label: "Backend & Database", icon: FaServer },
    { id: "languages", label: "Programming Languages", icon: FaCode },
    { id: "aiml", label: "AI/ML & IoT", icon: FaBrain },
    { id: "tools", label: "Tools & DevOps", icon: FaDatabase },
  ];

  const filteredSkills = SKILLS_LIST.filter((skill) => {
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
            {visibleSkills.map((skill, index) => (
              <motion.div
                key={skill.name}
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
                  style={{ backgroundColor: `${skill.color}15` }}
                >
                  {renderIcon(skill.icon, {
                    size: 26,
                    style: { color: skill.color },
                  })}
                </div>

                {/* Skill Name */}
                <h3 className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors">
                  {skill.name}
                </h3>

                {/* Level Tag */}
                <span
                  className={`inline-block mt-2 px-2.5 py-0.5 text-[10px] font-semibold rounded-full border ${
                    skill.level === "Core Production"
                      ? "bg-purple-500/10 border-purple-500/30 text-purple-300"
                      : skill.level === "Advanced"
                      ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-300"
                      : "bg-slate-500/10 border-slate-500/30 text-slate-300"
                  }`}
                >
                  {skill.level}
                </span>
              </motion.div>
            ))}
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
