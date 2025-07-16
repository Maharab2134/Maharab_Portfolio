import { motion } from 'framer-motion';
import { FaReact, FaNodeJs, FaDatabase, FaCode, FaTools, FaGitAlt, FaDocker, FaMobile } from 'react-icons/fa';
import { SiMongodb, SiExpress, SiJira, SiPostman, SiVsco, SiTensorflow, SiPytorch } from 'react-icons/si';

const Skills = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  const skills = [
    { icon: FaMobile, name: 'App Development', color: '#4CAF50', level: 'Expert' },
    { icon: FaNodeJs, name: 'Node.js', color: '#339933', level: 'Expert' },
    { icon: SiExpress, name: 'Express', color: '#000000', level: 'Expert' },
    { icon: SiMongodb, name: 'MongoDB', color: '#47A248', level: 'Advanced' },
    { icon: FaDatabase, name: 'SQL', color: '#336791', level: 'Advanced' },
    { icon: FaReact, name: 'React', color: '#61DAFB', level: 'Advanced' },
  ];

  const technologies = [
    { icon: FaGitAlt, name: 'Git', color: '#F05032', level: 'Advanced' },
    { icon: FaDocker, name: 'Docker', color: '#2496ED', level: 'Intermediate' },
    { icon: SiJira, name: 'Jira', color: '#0052CC', level: 'Advanced' },
    { icon: SiPostman, name: 'Postman', color: '#FF6C37', level: 'Advanced' },
    { icon: SiVsco, name: 'VS Code', color: '#007ACC', level: 'Expert' },
    { icon: FaDatabase, name: 'Database Design', color: '#336791', level: 'Advanced' },
  ];

  const additionalSkills = [
    { icon: SiTensorflow, name: 'TensorFlow', color: '#FF6F00', level: 'Intermediate' },
    { icon: SiPytorch, name: 'PyTorch', color: '#EE4C2C', level: 'Intermediate' },
    { icon: FaCode, name: 'System Design', color: '#61DAFB', level: 'Advanced' },
  ];

  return (
    <section id="skills" className="py-20 bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a]">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-20 text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold text-textPrimary">
              Technical Expertise
            </h2>
            <motion.div 
              className="w-20 h-1 mx-auto bg-secondary"
              initial={{ width: 0 }}
              whileInView={{ width: "5rem" }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
            <motion.p
              variants={itemVariants}
              className="max-w-2xl mx-auto mt-3 text-lg text-gray-300"
            >
              A comprehensive overview of my technical skills and development tools
            </motion.p>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Core Development Skills */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            className="p-10 transition-all duration-300 border shadow-xl bg-white/5 rounded-3xl backdrop-blur-sm border-white/10 hover:border-white/20"
          >
            <motion.div variants={itemVariants} className="flex items-center gap-4 mb-10">
              <motion.span 
                className="text-3xl text-purple-400"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                {FaCode({ size: 28 })}
              </motion.span>
              <h3 className="text-2xl font-semibold text-white">Core Development</h3>
            </motion.div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {skills.map((skill, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, x: 5 }}
                  className="flex items-center gap-5 p-5 transition-all duration-300 group rounded-2xl bg-white/5 hover:bg-white/10"
                >
                  <motion.div
                    className="flex items-center justify-center w-14 h-14 rounded-2xl"
                    style={{ backgroundColor: `${skill.color}15` }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <motion.span 
                      style={{ color: skill.color }}
                      whileHover={{ scale: 1.2 }}
                    >
                      {skill.icon({ size: 28 })}
                    </motion.span>
                  </motion.div>
                  <div className="flex-1">
                    <h4 className="text-lg font-medium text-white">{skill.name}</h4>
                    <motion.div 
                      className="mt-1 h-1.5 bg-white/10 rounded-full overflow-hidden"
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <motion.div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level === 'Expert' ? '100%' : skill.level === 'Advanced' ? '80%' : '60%'}` }}
                        transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                      />
                    </motion.div>
                    <p className="mt-1 text-sm text-gray-400">{skill.level}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Tools & Technologies */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            className="p-10 transition-all duration-300 border shadow-xl bg-white/5 rounded-3xl backdrop-blur-sm border-white/10 hover:border-white/20"
          >
            <motion.div variants={itemVariants} className="flex items-center gap-4 mb-10">
              <motion.span 
                className="text-3xl text-pink-400"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                {FaTools({ size: 28 })}
              </motion.span>
              <h3 className="text-2xl font-semibold text-white">Tools & Technologies</h3>
            </motion.div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {technologies.map((tech, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, x: 5 }}
                  className="flex items-center gap-5 p-5 transition-all duration-300 group rounded-2xl bg-white/5 hover:bg-white/10"
                >
                  <motion.div
                    className="flex items-center justify-center w-14 h-14 rounded-2xl"
                    style={{ backgroundColor: `${tech.color}15` }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <motion.span 
                      style={{ color: tech.color }}
                      whileHover={{ scale: 1.2 }}
                    >
                      {tech.icon({ size: 28 })}
                    </motion.span>
                  </motion.div>
                  <div className="flex-1">
                    <h4 className="text-lg font-medium text-white">{tech.name}</h4>
                    <motion.div 
                      className="mt-1 h-1.5 bg-white/10 rounded-full overflow-hidden"
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <motion.div
                        className="h-full bg-gradient-to-r from-pink-500 to-purple-500"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${tech.level === 'Expert' ? '100%' : tech.level === 'Advanced' ? '80%' : '60%'}` }}
                        transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                      />
                    </motion.div>
                    <p className="mt-1 text-sm text-gray-400">{tech.level}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Additional Skills */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            className="p-10 transition-all duration-300 border shadow-xl lg:col-span-2 bg-white/5 rounded-3xl backdrop-blur-sm border-white/10 hover:border-white/20"
          >
            <motion.div variants={itemVariants} className="flex items-center gap-4 mb-10">
              <motion.span 
                className="text-3xl text-cyan-400"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                {FaMobile({ size: 28 })}
              </motion.span>
              <h3 className="text-2xl font-semibold text-white">Additional Expertise</h3>
            </motion.div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {additionalSkills.map((skill, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, x: 5 }}
                  className="flex items-center gap-5 p-5 transition-all duration-300 group rounded-2xl bg-white/5 hover:bg-white/10"
                >
                  <motion.div
                    className="flex items-center justify-center w-14 h-14 rounded-2xl"
                    style={{ backgroundColor: `${skill.color}15` }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <motion.span 
                      style={{ color: skill.color }}
                      whileHover={{ scale: 1.2 }}
                    >
                      {skill.icon({ size: 28 })}
                    </motion.span>
                  </motion.div>
                  <div className="flex-1">
                    <h4 className="text-lg font-medium text-white">{skill.name}</h4>
                    <motion.div 
                      className="mt-1 h-1.5 bg-white/10 rounded-full overflow-hidden"
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <motion.div
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level === 'Expert' ? '100%' : skill.level === 'Advanced' ? '80%' : '60%'}` }}
                        transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                      />
                    </motion.div>
                    <p className="mt-1 text-sm text-gray-400">{skill.level}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Skills; 