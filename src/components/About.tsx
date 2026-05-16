import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaDownload,
  FaCode,
  FaMobile,
  FaPalette,
  FaDatabase,
  FaServer,
  FaRocket,
  FaChevronDown,
} from "react-icons/fa";
import { IconBaseProps, IconType } from "react-icons";

const renderIcon = (
  Icon: React.ComponentType<IconBaseProps>,
  props: IconBaseProps = {},
) => {
  return <Icon {...props} />;
};

const toProxyImageUrl = (url: string) => {
  if (!url || typeof url !== "string") return url;
  if (url.includes("images.weserv.nl/?url=")) return url;

  const driveShareMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (driveShareMatch?.[1]) {
    const fileId = driveShareMatch[1];
    return `https://images.weserv.nl/?url=drive.google.com/uc?export=view%26id=${fileId}`;
  }

  const driveUcMatch = url.match(/drive\.google\.com\/uc\?[^\s]*id=([^&]+)/);
  if (driveUcMatch?.[1]) {
    const fileId = driveUcMatch[1];
    return `https://images.weserv.nl/?url=drive.google.com/uc?export=view%26id=${fileId}`;
  }

  return url;
};

const About = () => {
  const [showAllSkillsMobile, setShowAllSkillsMobile] = useState(false);

  const skills: {
    icon: IconType;
    text: string;
    color: string;
  }[] = [
    {
      icon: FaCode,
      text: "Full Stack Web Development",
      color: "from-blue-400 to-cyan-400",
    },
    {
      icon: FaMobile,
      text: "Mobile App Development",
      color: "from-green-400 to-emerald-400",
    },
    {
      icon: FaPalette,
      text: "UI/UX Design",
      color: "from-pink-400 to-rose-400",
    },
    {
      icon: FaDatabase,
      text: "Database Design & Management",
      color: "from-purple-400 to-violet-400",
    },
    {
      icon: FaServer,
      text: "API Development & Integration",
      color: "from-orange-400 to-amber-400",
    },
    {
      icon: FaRocket,
      text: "Performance Optimization",
      color: "from-red-400 to-pink-400",
    },
  ];

  return (
    <section
      id="about"
      className="relative py-20 overflow-hidden bg-gradient-to-b from-[#0a0f1e] via-[#0f172a] to-[#0a0f1e]"
    >
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* Floating Orbs */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-purple-500/30 rounded-full blur-[100px]"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-[120px]"
        animate={{
          x: [0, -30, 0],
          y: [0, 50, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20 text-center"
        >
          <motion.h2
            className="mb-4 text-4xl font-bold md:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400">
              About Me
            </span>
          </motion.h2>
          <motion.div
            className="w-24 h-1 mx-auto rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
            initial={{ width: 0 }}
            whileInView={{ width: "6rem" }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
        </motion.div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="relative flex justify-center"
          >
            <div className="relative w-full max-w-md">
              {/* Glow Effect Behind Image */}
              <motion.div
                className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/50 to-pink-500/50 blur-2xl"
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Image Container with Glassmorphism */}
              <motion.div
                className="relative overflow-hidden border shadow-2xl backdrop-blur-xl bg-white/5 rounded-3xl border-white/10 group"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                {/* Animated Border */}
                <motion.div
                  className="absolute inset-0 rounded-3xl"
                  style={{
                    background:
                      "linear-gradient(45deg, transparent, rgba(147, 51, 234, 0.5), transparent)",
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />

                <div className="relative p-2">
                  <motion.img
                    src={toProxyImageUrl(
                      "https://drive.google.com/file/d/1vBSH9y7WpSNJhVfoiOOcwyki-PyoSQlj/view?usp=drive_link",
                    )}
                    alt="Md. Maharab Hosen"
                    className="object-cover w-full h-full transition-transform duration-700 rounded-2xl group-hover:scale-105"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/images/image.png";
                    }}
                    loading="eager"
                    decoding="async"
                  />
                </div>

                {/* Overlay on Hover */}
                <motion.div
                  className="absolute inset-0 transition-all duration-500 opacity-0 bg-gradient-to-t from-purple-900/90 via-purple-500/50 to-transparent group-hover:opacity-100 rounded-3xl"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                />

                <motion.div
                  className="absolute bottom-0 left-0 right-0 p-8 text-white transition-all duration-500 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
                  initial={{ y: 20, opacity: 0 }}
                  whileHover={{ y: 0, opacity: 1 }}
                >
                  <h3 className="text-3xl font-bold text-transparent bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text">
                    Full Stack Developer
                  </h3>
                  <p className="mt-2 text-sm text-purple-200">
                    Building digital experiences
                  </p>
                </motion.div>
              </motion.div>

              {/* Stats Cards attached to image container edges */}
              <motion.div
                className="absolute z-20 px-4 py-2.5 border top-0 right-3 -translate-y-full backdrop-blur-xl bg-purple-900/65 rounded-2xl border-purple-300/40"
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <p className="text-xl font-bold leading-none text-white">2+</p>
                <p className="mt-1 text-xs font-medium text-purple-100">
                  Years Experience
                </p>
              </motion.div>

              <motion.div
                className="absolute z-20 px-4 py-2.5 border bottom-0 left-3 translate-y-full backdrop-blur-xl bg-pink-900/65 rounded-2xl border-pink-300/40"
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ duration: 2.4, repeat: Infinity }}
              >
                <p className="text-xl font-bold leading-none text-white">50+</p>
                <p className="mt-1 text-xs font-medium text-pink-100">
                  Projects Done
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="flex flex-col justify-center space-y-8"
          >
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h3 className="mb-2 text-sm font-semibold tracking-widest text-purple-400 uppercase">
                Introduction
              </h3>
              <h2 className="text-3xl font-bold leading-tight md:text-4xl">
                <span className="text-white">I am </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400">
                  Md. Maharab Hosen
                </span>
              </h2>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base leading-relaxed text-gray-300 md:text-lg"
            >
              A passionate full-stack developer with expertise in creating
              beautiful and functional web applications. With a strong
              foundation in both front-end and back-end development, I strive to
              build seamless user experiences that combine aesthetic appeal with
              robust functionality.
            </motion.p>

            {/* Skills Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="space-y-4"
            >
              <h4 className="text-xl font-bold text-white md:text-2xl">
                What I Do
              </h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {skills.map((skill, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.05 * index }}
                    whileHover={{ scale: 1.05, x: 5 }}
                    className={`${
                      index >= 3 && !showAllSkillsMobile
                        ? "hidden sm:flex"
                        : "flex"
                    } items-center p-4 space-x-4 transition-all duration-300 border rounded-xl backdrop-blur-xl bg-white/5 border-white/10 hover:bg-white/10 group`}
                  >
                    <motion.div
                      className={`p-3 rounded-lg bg-gradient-to-br ${skill.color} bg-opacity-20`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      {renderIcon(
                        skill.icon as React.ComponentType<IconBaseProps>,
                        { className: "text-xl text-white" },
                      )}
                    </motion.div>
                    <span className="text-sm font-medium leading-snug text-gray-300 group-hover:text-white">
                      {skill.text}
                    </span>
                  </motion.div>
                ))}
              </div>

              {skills.length > 3 && (
                <div className="sm:hidden">
                  <button
                    type="button"
                    onClick={() => setShowAllSkillsMobile((prev) => !prev)}
                    className="inline-flex items-center gap-2 px-4 py-2 mt-2 text-sm font-semibold text-white transition-all border rounded-full bg-white/5 border-white/15 hover:bg-white/10"
                  >
                    {showAllSkillsMobile ? "Show Less" : "Show More"}
                    <span
                      className={`transition-transform duration-300 ${
                        showAllSkillsMobile ? "rotate-180" : "rotate-0"
                      }`}
                    >
                      {renderIcon(
                        FaChevronDown as React.ComponentType<IconBaseProps>,
                        { size: 12 },
                      )}
                    </span>
                  </button>
                </div>
              )}
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="pt-4"
            >
              <motion.a
                href="/PDF/Maharab_Hosen.pdf"
                download
                className="inline-flex items-center px-6 py-3.5 text-base font-semibold text-white transition-all duration-300 border-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 border-transparent hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span
                  className="mr-3"
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {renderIcon(
                    FaDownload as React.ComponentType<IconBaseProps>,
                    { size: 20 },
                  )}
                </motion.span>
                <span>Download Resume</span>
                <motion.span
                  className="ml-2"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Decorative Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
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
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default About;
