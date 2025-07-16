import { motion } from 'framer-motion';
import { FaGraduationCap } from 'react-icons/fa';

const Education = () => {
  const educationData = [
    {
      degree: "Bachelor of Science in Computer Science and Engineering",
      institution: "Bangladesh University of Business and Technology (BUBT)",
      year: "2022 - Present",
      description: "Specialized in Software Engineering and Web Development. Currently pursuing studies and participating in various coding competitions and hackathons.",
      achievements: [
        "Dean's List for Academic Excellence",
        "Best Final Year Project Award"
      ]
    },
    {
      degree: "Higher Secondary Certificate (HSC)",
      institution: "Bangla Bazar Fatema Khanam Degree College",
      year: "2019 - 2020",
      description: "Completed with excellent results in Science group.",
      achievements: [
        "Active member of Science Club"
      ]
    },
    {
      degree: "Secondary School Certificate (SSC)",
      institution: "Bhola Residential School & College",
      year: "2017 - 2018",
      description: "Completed with outstanding results.",
      achievements: [
        "Active participant in Science Fairs"
      ]
    }
  ];

  return (
    <section id="education" className="py-20 bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a]">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-textPrimary">
            Education
          </h2>
          <motion.div 
            className="w-20 h-1 mx-auto bg-secondary"
            initial={{ width: 0 }}
            whileInView={{ width: "5rem" }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          />
        </motion.div>

        <div className="space-y-12">
          {educationData.map((edu, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -50, y: 20 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2, ease: "easeOut" }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Timeline Line */}
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-secondary/30" />

              {/* Content Card */}
              <div className="relative pl-8">
                {/* Timeline Dot */}
                <motion.div
                  className="absolute left-0 w-4 h-4 rounded-full bg-secondary"
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.2 + 0.1, ease: "easeOut" }}
                  viewport={{ once: true }}
                />

                {/* Education Icon */}
                <motion.div
                  className="absolute top-0 flex items-center justify-center w-8 h-8 border rounded-full -left-2 bg-tertiary text-secondary border-secondary/50"
                  initial={{ scale: 0.5, rotateY: -180, opacity: 0 }}
                  whileInView={{ scale: 1, rotateY: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.2 + 0.3, ease: "backOut" }}
                  viewport={{ once: true }}
                >
                  {FaGraduationCap({ size: 16 })}
                </motion.div>

                {/* Content */}
                <div className="p-6 border rounded-lg bg-tertiary/50 backdrop-blur-sm border-secondary/20">
                  <motion.h3
                    className="mb-2 text-xl font-semibold text-white"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {edu.degree}
                  </motion.h3>
                  <motion.p
                    className="mb-2 text-lg text-secondary"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {edu.institution}
                  </motion.p>
                  <motion.p
                    className="mb-4 text-sm text-gray-400"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {edu.year}
                  </motion.p>
                  <p className="mb-4 text-gray-300">
                    {edu.description}
                  </p>
                  {/* Restored Achievements list */}
                   {edu.achievements.length > 0 && (
                    <ul className="mt-4 space-y-2">
                      {edu.achievements.map((achievement, idx) => (
                        <motion.li
                          key={idx}
                          className="flex items-center space-x-2 text-gray-300"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.2 + idx * 0.1, ease: "easeOut" }}
                          viewport={{ once: true }}
                        >
                          <motion.span
                            className="w-2 h-2 rounded-full bg-secondary"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity, delay: index * 0.2 + idx * 0.1 }}
                          />
                          <span>{achievement}</span>
                        </motion.li>
                      ))}
                    </ul>
                   )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Background decoration */}
      <motion.div 
        className="absolute inset-0 -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-tertiary/50 to-primary/50"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
            opacity: [0.5, 0.7, 0.5]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: 'reverse'
          }}
        />
      </motion.div>
    </section>
  );
};

export default Education; 