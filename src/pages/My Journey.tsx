import React, { useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaGraduationCap,
  FaCode,
  FaRocket,
  FaTrophy,
  FaLightbulb,
  FaHeart,
  FaCoffee,
  FaChevronRight,
} from "react-icons/fa";
import { IconBaseProps } from "react-icons";

const renderIcon = (
  Icon: React.ComponentType<IconBaseProps>,
  props: IconBaseProps = {},
) => {
  return <Icon {...props} />;
};

// Timeline data structure
const timelineData = [
  {
    year: "2022",
    title: "The Beginning",
    icon: FaLightbulb,
    color: "from-yellow-400 to-orange-500",
    description:
      "Started my journey into programming. Fell in love with problem-solving and decided to pursue Computer Science.",
    achievements: [
      "Learned fundamentals of C, C++, and Python",
      "Built first console-based projects",
      "Discovered passion for web development",
    ],
  },
  {
    year: "2023",
    title: "Deep Dive into Development",
    icon: FaCode,
    color: "from-blue-400 to-cyan-500",
    description:
      "Mastered full-stack development and mobile app creation. Started building real-world projects and contributing to open source.",
    achievements: [
      "Learned React, Node.js, and Flutter",
      "Built 20+ personal projects",
      "Started freelancing",
      "Contributed to open-source",
    ],
  },
  {
    year: "2024",
    title: "Professional Growth",
    icon: FaRocket,
    color: "from-purple-400 to-pink-500",
    description:
      "Expanded expertise in AI/ML and IoT. Worked on complex full-stack applications and mobile solutions for clients.",
    achievements: [
      "Completed 50+ projects",
      "Learned AI/ML and IoT integration",
      "Built production-ready apps",
      "Mentored junior developers",
    ],
  },
  {
    year: "2025",
    title: "Current Focus",
    icon: FaTrophy,
    color: "from-green-400 to-emerald-500",
    description:
      "Pursuing advanced software engineering. Building scalable solutions and exploring cutting-edge technologies.",
    achievements: [
      "Working on advanced MERN projects",
      "Exploring cloud architecture",
      "Building my personal brand",
      "Continuous learning and growth",
    ],
  },
];

// Skills & Interests
const skills = [
  { name: "Full Stack Development", level: 90 },
  { name: "Mobile Development", level: 85 },
  { name: "UI/UX Design", level: 80 },
  { name: "AI/ML", level: 70 },
  { name: "IoT", level: 65 },
];

const interests = [
  { icon: FaCode, text: "Clean Code" },
  { icon: FaCoffee, text: "Coffee ☕" },
  { icon: FaRocket, text: "Innovation" },
  { icon: FaHeart, text: "Open Source" },
];

const MyJourney = () => {
  useEffect(() => {
    const prev = typeof document !== "undefined" ? document.title : "";
    if (typeof document !== "undefined") document.title = "Maharab | Journey";
    return () => {
      if (typeof document !== "undefined") document.title = prev;
    };
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0f1e] via-[#0f172a] to-[#0a0f1e] text-white relative overflow-hidden">
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
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/15 rounded-full blur-[140px]"
        animate={{
          x: [0, -30, 0],
          y: [0, 50, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative px-4 py-24 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-20 text-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium border rounded-full bg-white/5 border-white/10 backdrop-blur-xl"
          >
            <motion.span
              className="relative flex w-2.5 h-2.5"
              aria-hidden="true"
            >
              <span className="absolute inline-flex w-full h-full bg-green-400 rounded-full opacity-75 animate-ping" />
              <span className="relative inline-flex w-2.5 h-2.5 bg-green-500 rounded-full" />
            </motion.span>
            Actively Learning & Building
          </motion.div>

          <h1 className="mb-6 text-5xl font-bold md:text-7xl">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">
              My Journey
            </span>
          </h1>

          <p className="max-w-2xl mx-auto mb-8 text-lg text-white/70 md:text-xl">
            Turning Coffee into Code — Since 2022
          </p>

          {/* Role Badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {["Software Engineer", "CSE @ BUBT", "Full Stack Developer"].map(
              (badge, i) => (
                <motion.span
                  key={badge}
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="px-4 py-2 text-sm font-semibold border rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-white/10 backdrop-blur-sm"
                >
                  {badge}
                </motion.span>
              ),
            )}
          </div>
        </motion.div>

        {/* Timeline Tree */}
        <div className="relative max-w-5xl mx-auto mb-20">
          {/* Vertical Line */}
          <motion.div
            className="absolute left-0 w-1 h-full transform -translate-x-1/2 rounded-full md:left-1/2 bg-gradient-to-b from-purple-500 via-pink-500 to-cyan-500"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            viewport={{ once: true }}
            style={{ transformOrigin: "top" }}
          />

          {timelineData.map((item, index) => (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={`relative mb-16 md:mb-20 ${
                index % 2 === 0
                  ? "md:pr-[calc(50%+3rem)] md:text-right"
                  : "md:pl-[calc(50%+3rem)]"
              }`}
            >
              {/* Year Badge (Center on Desktop) */}
              <motion.div
                className="absolute left-0 flex items-center justify-center w-16 h-16 transform -translate-x-1/2 border-4 rounded-full md:left-1/2 bg-gradient-to-br border-[#0f172a]"
                style={{
                  background: `linear-gradient(135deg, ${item.color.split(" ")[0].replace("from-", "")}, ${item.color.split(" ")[1].replace("to-", "")})`,
                }}
                whileHover={{ scale: 1.2, rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-2xl font-bold text-white">
                  {renderIcon(item.icon as React.ComponentType<IconBaseProps>, {
                    size: 24,
                  })}
                </span>
              </motion.div>

              {/* Content Card */}
              <motion.div
                className="p-6 ml-12 transition-all duration-300 border shadow-xl md:ml-0 backdrop-blur-xl bg-white/5 rounded-2xl border-white/10 hover:bg-white/10 hover:border-white/20 group"
                whileHover={{ scale: 1.02, y: -5 }}
              >
                {/* Year & Title */}
                <div className="mb-4">
                  <span
                    className={`inline-block px-3 py-1 mb-2 text-sm font-bold rounded-full bg-gradient-to-r ${item.color} bg-opacity-20`}
                  >
                    {item.year}
                  </span>
                  <h3 className="text-2xl font-bold text-white md:text-3xl">
                    {item.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="mb-4 leading-relaxed text-white/70">
                  {item.description}
                </p>

                {/* Achievements */}
                <div className="space-y-2">
                  {item.achievements.map((achievement, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-start gap-2"
                    >
                      {renderIcon(
                        FaChevronRight as React.ComponentType<IconBaseProps>,
                        {
                          size: 14,
                          className: `text-purple-400 mt-1 flex-shrink-0`,
                        },
                      )}
                      <span className="text-sm text-white/80">
                        {achievement}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Hover Glow Effect */}
                <motion.div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 -z-10 blur-xl`}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Skills & Interests Section */}
        <div className="grid max-w-6xl grid-cols-1 gap-12 mx-auto md:grid-cols-2">
          {/* Skills Progress Bars */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="p-8 border shadow-xl backdrop-blur-xl bg-white/5 rounded-2xl border-white/10"
          >
            <h3 className="mb-6 text-2xl font-bold text-white">
              Skills & Expertise
            </h3>
            <div className="space-y-5">
              {skills.map((skill, i) => (
                <div key={skill.name}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-white/80">
                      {skill.name}
                    </span>
                    <span className="text-sm font-bold text-purple-400">
                      {skill.level}%
                    </span>
                  </div>
                  <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      viewport={{ once: true }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Interests Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="p-8 border shadow-xl backdrop-blur-xl bg-white/5 rounded-2xl border-white/10"
          >
            <h3 className="mb-6 text-2xl font-bold text-white">
              Interests & Values
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {interests.map((interest, i) => (
                <motion.div
                  key={interest.text}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="flex flex-col items-center gap-3 p-6 transition-all duration-300 border rounded-xl bg-white/5 border-white/10 hover:bg-white/10 hover:border-purple-500/30"
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                    {renderIcon(
                      interest.icon as React.ComponentType<IconBaseProps>,
                      {
                        size: 24,
                        className: "text-purple-400",
                      },
                    )}
                  </div>
                  <span className="text-sm font-semibold text-center text-white/90">
                    {interest.text}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto mt-20 text-center"
        >
          <h3 className="mb-4 text-3xl font-bold text-white">
            Let's Build Something Amazing Together
          </h3>
          <p className="mb-8 text-lg text-white/70">
            I'm always open to new opportunities and collaborations.
          </p>
          <motion.a
            href="/#contact"
            className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 border-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 border-transparent hover:shadow-[0_0_40px_rgba(147,51,234,0.6)]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Get in Touch</span>
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
        {[...Array(30)].map((_, i) => (
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
    </main>
  );
};

export default MyJourney;
