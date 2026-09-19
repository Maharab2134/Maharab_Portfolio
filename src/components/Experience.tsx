import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaBriefcase,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaBuilding,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { EXPERIENCE_DATA, ExperienceItem, getCompanyLogoUrl } from "../data/portfolioData";
import {
  getLiveExperience,
  useExperienceConfig,
} from "../lib/portfolioService";

const renderIcon = (Icon: any, props: any = {}) => {
  return <Icon {...props} />;
};

const Experience: React.FC = () => {
  const config = useExperienceConfig();
  const [experienceList, setExperienceList] = useState<ExperienceItem[]>(EXPERIENCE_DATA);

  useEffect(() => {
    const fetchExp = () => {
      getLiveExperience().then((data) => {
        if (data && data.length > 0) {
          setExperienceList(data);
        }
      });
    };
    fetchExp();
    window.addEventListener("portfolio_experience_updated", fetchExp);
    return () => window.removeEventListener("portfolio_experience_updated", fetchExp);
  }, []);

  // If section is toggled off in Admin Studio, completely hide it
  if (!config.isActive) {
    return null;
  }

  // Filter out items disabled by admin
  const visibleExperiences = experienceList.filter(
    (item) => item.isActive !== false
  );

  if (visibleExperiences.length === 0) {
    return null;
  }

  return (
    <section
      id="experience"
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
          <span className="text-xs font-semibold tracking-widest uppercase text-cyan-400">
            {config.badge || "Career Trajectory"}
          </span>
          <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            {config.title || "Professional Experience"}
          </h2>
          <div className="w-20 h-1 mx-auto mt-3 rounded-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500" />
          <p className="max-w-xl mx-auto mt-4 text-sm sm:text-base text-slate-400">
            {config.subtitle ||
              "A proven track record of engineering scalable web systems, cross-platform apps, and high-impact digital solutions."}
          </p>
        </motion.div>

        {/* Timeline Container */}
        <div className="relative pl-6 sm:pl-10 space-y-10 border-l border-white/10 ml-4 sm:ml-8">
          {visibleExperiences.map((exp, index) => {
            const logoUrl = getCompanyLogoUrl(exp.companyUrl, exp.companyLogo);
            const formattedUrl = exp.companyUrl
              ? exp.companyUrl.trim().startsWith("http://") || exp.companyUrl.trim().startsWith("https://")
                ? exp.companyUrl.trim()
                : `https://${exp.companyUrl.trim()}`
              : "";

            return (
              <motion.div
                key={exp.id || `${exp.company}-${exp.role}-${index}`}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
                className="relative group"
              >
                {/* Timeline Icon Node */}
                <div className="absolute -left-[37px] sm:-left-[53px] top-1.5 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-900 border border-cyan-500/50 shadow-md shadow-cyan-500/20 text-cyan-400 group-hover:scale-110 group-hover:border-purple-400 group-hover:text-purple-400 transition-all duration-300 overflow-hidden">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt={exp.company}
                      className="w-5 h-5 sm:w-6 sm:h-6 object-contain rounded p-0.5"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  ) : (
                    renderIcon(FaBriefcase, { size: 16 })
                  )}
                </div>

                {/* Experience Card */}
                <div className="p-6 sm:p-7 border rounded-2xl bg-white/[0.03] border-white/10 backdrop-blur-xl hover:border-white/20 transition-all duration-300 shadow-xl shadow-black/20">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {exp.role}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-sm font-medium text-slate-300">
                        {formattedUrl ? (
                          <a
                            href={formattedUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-purple-300 hover:text-cyan-300 transition-colors group/company"
                            title={`Visit ${exp.company} official website`}
                          >
                            {logoUrl && (
                              <img
                                src={logoUrl}
                                alt={exp.company}
                                className="w-4 h-4 rounded object-contain bg-white/10 p-0.5"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = "none";
                                }}
                              />
                            )}
                            <span className="font-semibold underline-offset-4 group-hover/company:underline">
                              {exp.company}
                            </span>
                            {renderIcon(FaExternalLinkAlt, {
                              size: 10,
                              className: "opacity-60 group-hover/company:opacity-100",
                            })}
                          </a>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-purple-300 font-semibold">
                            {logoUrl ? (
                              <img
                                src={logoUrl}
                                alt={exp.company}
                                className="w-4 h-4 rounded object-contain bg-white/10 p-0.5"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = "none";
                                }}
                              />
                            ) : (
                              renderIcon(FaBuilding, { size: 12 })
                            )}
                            <span>{exp.company}</span>
                          </span>
                        )}

                        {exp.location && (
                          <span className="inline-flex items-center gap-1 text-slate-400 text-xs">
                            {renderIcon(FaMapMarkerAlt, { size: 10 })}
                            {exp.location}
                          </span>
                        )}
                        {exp.employmentType && (
                          <span className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20">
                            {exp.employmentType}
                          </span>
                        )}
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-white/5 border border-white/10 text-cyan-300 self-start sm:self-auto flex-shrink-0">
                      {renderIcon(FaCalendarAlt, { size: 10 })}
                      {exp.period}
                    </span>
                  </div>

                <p className="text-sm leading-relaxed text-slate-400 mt-3 mb-4">
                  {exp.description}
                </p>

                {/* Tech stack badges */}
                {exp.technologies && exp.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {exp.technologies.map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                {/* Highlights / Responsibilities */}
                {exp.highlights && exp.highlights.length > 0 && (
                  <div className="pt-3 border-t border-white/5">
                    <ul className="space-y-2">
                      {exp.highlights.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300/90 leading-relaxed"
                        >
                          <span className="mt-1 text-cyan-400 flex-shrink-0">
                            {renderIcon(FaCheckCircle, { size: 12 })}
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
        </div>
      </div>
    </section>
  );
};

export default Experience;
