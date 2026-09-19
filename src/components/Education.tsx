import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaGraduationCap, FaAward, FaCalendarAlt } from "react-icons/fa";
import { EducationItem } from "../data/portfolioData";
import { getCachedEducationSync } from "../lib/portfolioService";

const renderIcon = (Icon: any, props: any = {}) => {
  return <Icon {...props} />;
};

const Education: React.FC = () => {
  const [educationList, setEducationList] = useState<EducationItem[]>(getCachedEducationSync);

  useEffect(() => {
    const handleEduUpdate = () => {
      const live = getCachedEducationSync();
      React.startTransition(() => {
        setEducationList(live);
      });
    };
    window.addEventListener("portfolio_education_updated", handleEduUpdate);
    return () => window.removeEventListener("portfolio_education_updated", handleEduUpdate);
  }, []);

  const visibleEducation = educationList.filter(
    (edu) => edu.isActive !== false
  );

  if (visibleEducation.length === 0) {
    return null;
  }

  return (
    <section
      id="education"
      className="relative py-8 sm:py-12 overflow-hidden bg-gradient-to-b from-[#030014] via-[#090e1f] to-[#030014]"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="relative px-4 mx-auto max-w-5xl sm:px-6 lg:px-8">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-6 sm:mb-8 text-center"
        >
          <span className="text-xs font-semibold tracking-widest uppercase text-purple-400">
            Academic Background
          </span>
          <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            Education
          </h2>
          <div className="w-20 h-1 mx-auto mt-3 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400" />
          <p className="max-w-xl mx-auto mt-4 text-sm sm:text-base text-slate-400">
            My formal engineering and academic milestones, laying the foundation for analytical problem solving.
          </p>
        </motion.div>

        {/* Timeline Container */}
        <div className="relative pl-6 sm:pl-10 space-y-10 border-l border-white/10 ml-4 sm:ml-8">
          {visibleEducation.map((edu, index) => (
            <motion.div
              key={edu.degree}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative group"
            >
              {/* Timeline Icon Node */}
              <div className="absolute -left-[37px] sm:-left-[53px] top-1.5 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-900 border border-purple-500/50 shadow-md shadow-purple-500/20 text-purple-400 group-hover:scale-110 group-hover:border-cyan-400 group-hover:text-cyan-400 transition-all duration-300">
                {renderIcon(FaGraduationCap, { size: 16 })}
              </div>

              {/* Education Card */}
              <div className="p-6 sm:p-7 border rounded-2xl bg-white/[0.03] border-white/10 backdrop-blur-xl hover:border-white/20 transition-all duration-300 shadow-xl shadow-black/20">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                    {edu.degree}
                  </h3>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-white/5 border border-white/10 text-cyan-300 self-start sm:self-auto">
                    {renderIcon(FaCalendarAlt, { size: 10 })}
                    {edu.period}
                  </span>
                </div>

                <p className="text-sm font-medium text-slate-300 mb-3">
                  {edu.institution}
                </p>

                <p className="text-sm leading-relaxed text-slate-400 mb-4">
                  {edu.description}
                </p>

                {/* Highlights / Achievements */}
                {edu.highlights.length > 0 && (
                  <div className="pt-3 border-t border-white/5">
                    <ul className="space-y-1.5">
                      {edu.highlights.map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs sm:text-sm text-slate-300/90">
                          {renderIcon(FaAward, { size: 12, className: "text-purple-400 flex-shrink-0" })}
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;
