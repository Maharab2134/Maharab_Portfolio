import { motion } from "framer-motion";
import type { ComponentType, CSSProperties } from "react";
import { IconType } from "react-icons";
import {
  FaReact,
  FaNodeJs,
  FaDatabase,
  FaCode,
  FaTools,
  FaGitAlt,
  FaMobile,
  FaPython,
  FaJava,
  FaAndroid,
  FaFigma,
  FaHtml5,
  FaCss3Alt,
  FaDocker,
  FaAws,
  FaLinux,
  FaWindows,
} from "react-icons/fa";
import {
  SiMongodb,
  SiExpress,
  SiPostman,
  SiTensorflow,
  SiPytorch,
  SiFlutter,
  SiKotlin,
  SiMysql,
  SiFirebase,
  SiArduino,
  SiC,
  SiCplusplus,
  SiJavascript,
  SiPhp,
  SiPostgresql,
  SiTailwindcss,
  SiBootstrap,
  SiAndroidstudio,
  SiInkscape,
  SiCanva,
  SiGimp,
} from "react-icons/si";
import { TbApi } from "react-icons/tb";

type IconProps = { className?: string; size?: number; style?: CSSProperties };

interface Skill {
  icon: IconType;
  name: string;
  color: string;
  level: number;
}

interface SkillCategory {
  title: string;
  description: string;
  icon: IconType;
  gradient: string;
  skills: Skill[];
}

const Skills = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
      },
    },
  };

  const skillCategories: SkillCategory[] = [
    {
      title: "Programming Languages",
      description: "Core languages I work with",
      icon: FaCode,
      gradient: "from-blue-500 via-blue-400 to-cyan-400",
      skills: [
        { icon: FaJava, name: "Java", color: "#ED8B00", level: 95 },
        { icon: SiKotlin, name: "Kotlin", color: "#7F52FF", level: 90 },
        { icon: SiJavascript, name: "JavaScript", color: "#F7DF1E", level: 88 },
        { icon: FaPython, name: "Python", color: "#3776AB", level: 85 },
        { icon: SiCplusplus, name: "C++", color: "#00599C", level: 90 },
        { icon: SiPhp, name: "PHP", color: "#777BB4", level: 70 },
      ],
    },
    {
      title: "Mobile Development",
      description: "Building cross-platform & native apps",
      icon: FaMobile,
      gradient: "from-green-500 via-emerald-400 to-teal-400",
      skills: [
        {
          icon: FaAndroid,
          name: "Android Native",
          color: "#3DDC84",
          level: 95,
        },
        { icon: SiFlutter, name: "Flutter", color: "#02569B", level: 88 },
        { icon: SiKotlin, name: "Kotlin", color: "#7F52FF", level: 90 },
        { icon: FaJava, name: "Java", color: "#ED8B00", level: 95 },
      ],
    },
    {
      title: "Web Development",
      description: "Frontend & Backend technologies",
      icon: FaReact,
      gradient: "from-purple-500 via-pink-400 to-rose-400",
      skills: [
        { icon: FaReact, name: "React", color: "#61DAFB", level: 85 },
        { icon: FaNodeJs, name: "Node.js", color: "#339933", level: 85 },
        { icon: SiExpress, name: "Express.js", color: "#000000", level: 80 },
        { icon: FaHtml5, name: "HTML5", color: "#E34F26", level: 95 },
        { icon: FaCss3Alt, name: "CSS3", color: "#1572B6", level: 90 },
        {
          icon: SiTailwindcss,
          name: "Tailwind CSS",
          color: "#06B6D4",
          level: 88,
        },
        { icon: SiBootstrap, name: "Bootstrap", color: "#7952B3", level: 85 },
        { icon: TbApi, name: "RESTful APIs", color: "#FF6C37", level: 85 },
      ],
    },
    {
      title: "Database & Storage",
      description: "Data management solutions",
      icon: FaDatabase,
      gradient: "from-orange-500 via-amber-400 to-yellow-400",
      skills: [
        { icon: SiMongodb, name: "MongoDB", color: "#47A248", level: 85 },
        { icon: SiMysql, name: "MySQL", color: "#4479A1", level: 85 },
        { icon: SiPostgresql, name: "PostgreSQL", color: "#336791", level: 75 },
        { icon: SiFirebase, name: "Firebase", color: "#FFCA28", level: 80 },
        { icon: FaDatabase, name: "SQLite", color: "#003B57", level: 80 },
      ],
    },
    {
      title: "DevOps & Tools",
      description: "Development workflow & deployment",
      icon: FaTools,
      gradient: "from-cyan-500 via-sky-400 to-blue-400",
      skills: [
        { icon: FaGitAlt, name: "Git", color: "#F05032", level: 90 },
        {
          icon: FaCode,
          name: "VS Code",
          color: "#007ACC",
          level: 95,
        },
        {
          icon: SiAndroidstudio,
          name: "Android Studio",
          color: "#3DDC84",
          level: 95,
        },
        { icon: SiPostman, name: "Postman", color: "#FF6C37", level: 85 },
        { icon: FaDocker, name: "Docker", color: "#2496ED", level: 50 },
        { icon: FaAws, name: "AWS", color: "#FF9900", level: 35 },
      ],
    },
    {
      title: "Design & Graphics",
      description: "UI/UX and visual design tools",
      icon: FaFigma,
      gradient: "from-pink-500 via-rose-400 to-red-400",
      skills: [
        { icon: FaFigma, name: "Figma", color: "#F24E1E", level: 80 },
        { icon: SiInkscape, name: "Inkscape", color: "#000000", level: 75 },
        { icon: SiCanva, name: "Canva", color: "#00C4CC", level: 85 },
        { icon: SiGimp, name: "GIMP", color: "#5C5543", level: 70 },
      ],
    },
    {
      title: "AI & Machine Learning",
      description: "Building intelligent systems",
      icon: SiTensorflow,
      gradient: "from-indigo-500 via-purple-400 to-pink-400",
      skills: [
        { icon: SiTensorflow, name: "TensorFlow", color: "#FF6F00", level: 70 },
        { icon: SiPytorch, name: "PyTorch", color: "#EE4C2C", level: 65 },
        { icon: FaPython, name: "Python ML", color: "#3776AB", level: 75 },
      ],
    },
    {
      title: "IoT & Embedded",
      description: "Hardware programming & automation",
      icon: SiArduino,
      gradient: "from-teal-500 via-cyan-400 to-blue-400",
      skills: [
        { icon: SiArduino, name: "Arduino", color: "#00979D", level: 75 },
        { icon: SiC, name: "C (Embedded)", color: "#A8B9CC", level: 80 },
      ],
    },
    {
      title: "Operating Systems",
      description: "Platform expertise",
      icon: FaLinux,
      gradient: "from-gray-600 via-gray-500 to-gray-400",
      skills: [
        {
          icon: FaLinux,
          name: "Linux (Debian/Mint)",
          color: "#FCC624",
          level: 95,
        },
        { icon: FaWindows, name: "Windows", color: "#0078D6", level: 90 },
      ],
    },
  ];

  const renderIcon = (Icon: IconType, props: IconProps) => {
    const IconComponent = Icon as unknown as ComponentType<IconProps>;
    return <IconComponent {...props} />;
  };

  return (
    <section
      id="skills"
      className="relative py-20 overflow-hidden bg-gradient-to-b from-[#0a0f1e] via-[#0f172a] to-[#0a0f1e]"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-[120px]"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <motion.h2
            className="mb-4 text-4xl font-bold md:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">
              Technical Skills & Expertise
            </span>
          </motion.h2>
          <motion.div
            className="w-24 h-1 mx-auto rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
            initial={{ width: 0 }}
            whileInView={{ width: "6rem" }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="max-w-2xl mx-auto mt-6 text-base text-white/70 md:text-lg"
          >
            A comprehensive overview of technologies I work with across{" "}
            <span className="font-semibold text-white">Mobile</span>,{" "}
            <span className="font-semibold text-white">Web</span>,{" "}
            <span className="font-semibold text-white">AI/ML</span>, and{" "}
            <span className="font-semibold text-white">IoT</span> domains
          </motion.p>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="relative p-6 overflow-hidden transition-all duration-300 border shadow-xl bg-white/5 rounded-2xl backdrop-blur-xl border-white/10 hover:border-white/20 group"
            >
              {/* Gradient overlay on hover */}
              <motion.div
                className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 bg-gradient-to-br ${category.gradient}`}
              />

              {/* Category Header */}
              <motion.div
                variants={itemVariants}
                className="relative flex items-start gap-4 mb-6"
              >
                <motion.div
                  className={`flex items-center justify-center flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${category.gradient} shadow-lg`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {renderIcon(category.icon, {
                    className: "text-2xl text-white",
                  })}
                </motion.div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white md:text-2xl">
                    {category.title}
                  </h3>
                  <p className="mt-1 text-sm text-white/50">
                    {category.description}
                  </p>
                </div>
              </motion.div>

              {/* Skills Grid */}
              <motion.div
                variants={containerVariants}
                className="relative grid grid-cols-2 gap-3 sm:grid-cols-3"
              >
                {category.skills.map((skill, skillIndex) => (
                  <motion.div
                    key={skill.name}
                    variants={itemVariants}
                    whileHover={{
                      scale: 1.05,
                      y: -4,
                      transition: { type: "spring", stiffness: 300 },
                    }}
                    className="relative p-3 transition-all duration-300 cursor-pointer rounded-xl bg-white/5 hover:bg-white/10 group/skill"
                  >
                    <div className="flex flex-col items-center gap-2 text-center">
                      <motion.div
                        className="flex items-center justify-center w-12 h-12 rounded-xl"
                        style={{ backgroundColor: `${skill.color}15` }}
                        whileHover={{ scale: 1.15 }}
                      >
                        {renderIcon(skill.icon, {
                          size: 24,
                          style: { color: skill.color },
                        })}
                      </motion.div>
                      <div className="w-full">
                        <h4 className="text-xs font-semibold text-white truncate">
                          {skill.name}
                        </h4>
                        <div className="w-full h-1 mt-2 overflow-hidden rounded-full bg-white/10">
                          <motion.div
                            className="h-full rounded-full"
                            style={{
                              background: `linear-gradient(90deg, ${skill.color}80, ${skill.color})`,
                            }}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level}%` }}
                            transition={{
                              duration: 1,
                              delay: categoryIndex * 0.1 + skillIndex * 0.05,
                              ease: "easeOut",
                            }}
                            viewport={{ once: true }}
                          />
                        </div>
                        <p className="mt-1 text-[10px] font-medium text-white/40">
                          {skill.level}%
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="mb-6 text-lg text-white/70">
            Want to see these skills in action?
          </p>
          <motion.a
            href="#projects"
            className="inline-flex items-center gap-2 px-8 py-3 text-base font-semibold text-white transition-all duration-300 border-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 border-transparent hover:shadow-[0_0_30px_rgba(147,51,234,0.5)]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>View My Projects</span>
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </motion.a>
        </motion.div>
      </div>

      {/* Decorative Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-20"
            style={{
              width: Math.random() * 4 + 2,
              height: Math.random() * 4 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.5, 0.1],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default Skills;
