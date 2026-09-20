import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaMobileAlt,
  FaGlobe,
  FaBrain,
  FaMicrochip,
  FaGithub,
  FaExternalLinkAlt,
  FaLock,
  FaStar,
  FaArrowRight,
  FaLayerGroup,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import {
  Project,
  getAllProjectsSync,
  toProxyImageUrl,
  extractGoogleDriveFileId,
  toGoogleDriveDirectUrl,
  createProjectSvgFallback,
} from "../data/projectsData";
import { getLiveProjects } from "../lib/portfolioService";

const renderIcon = (Icon: any, props: any = {}) => {
  return <Icon {...props} />;
};

interface ProjectsProps {
  onSelectProject?: (project: Project) => void;
}

const ProjectCard: React.FC<{
  project: Project;
  index: number;
  onSelectProject?: (project: Project) => void;
}> = ({ project, index, onSelectProject }) => {
  const [imgSrc, setImgSrc] = useState(toProxyImageUrl(project.image));

  useEffect(() => {
    setImgSrc(toProxyImageUrl(project.image));
  }, [project.image]);

  const fallback = createProjectSvgFallback(
    project.title,
    project.categoryLabel,
    project.technologies[0] || "Code"
  );

  const handleImageError = () => {
    const fileId = extractGoogleDriveFileId(project.image);
    if (fileId && !imgSrc.includes("googleusercontent.com")) {
      setImgSrc(toGoogleDriveDirectUrl(project.image));
      return;
    }
    setImgSrc(fallback);
  };

  const handleOpenDetails = () => {
    if (onSelectProject) {
      onSelectProject(project);
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#0b0c1e] to-[#040510] backdrop-blur-xl hover:border-purple-500/40 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300"
    >
      {/* Visual Thumbnail */}
      <div
        className="relative w-full h-48 sm:h-52 overflow-hidden bg-slate-900/60 cursor-pointer"
        onClick={handleOpenDetails}
      >
        <img
          src={imgSrc}
          alt={project.title}
          onError={handleImageError}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c1e] via-transparent to-transparent opacity-80" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-black/60 border border-white/10 text-cyan-300 backdrop-blur-md">
            {project.categoryLabel}
          </span>
        </div>

        {/* Featured Pill */}
        {project.featured && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md">
              {renderIcon(FaStar, { size: 9 })}
              <span>Featured</span>
            </span>
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex flex-col justify-between flex-1">
        <div>
          <h3
            onClick={handleOpenDetails}
            title={project.title}
            className="text-base sm:text-lg font-bold text-white group-hover:text-purple-300 transition-colors cursor-pointer mb-2 truncate block"
          >
            {project.title}
          </h3>

          <p
            className="text-xs sm:text-sm text-slate-400 line-clamp-2 leading-relaxed mb-4"
            title={project.short_desc || project.shortDescription || project.description}
          >
            {project.short_desc || project.shortDescription || project.description}
          </p>
        </div>

        {/* Technologies Pills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.technologies.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 text-[10px] sm:text-[11px] font-medium rounded-md bg-white/5 border border-white/10 text-slate-300"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="px-1.5 py-0.5 text-[10px] font-medium rounded-md bg-white/5 text-slate-400">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>

        {/* Bottom Actions Row */}
        <div
          className="flex items-center justify-between pt-3 border-t border-white/5 text-xs"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Source Code Badge / Link */}
          {project.sourceCodePrivate ? (
            <span className="inline-flex items-center gap-1.5 text-amber-300/80 font-medium">
              {renderIcon(FaLock, { size: 11 })}
              Private Codebase
            </span>
          ) : project.github ? (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
            >
              {renderIcon(FaGithub, { size: 13 })}
              <span>GitHub</span>
            </a>
          ) : (
            <span className="text-slate-500">Internal</span>
          )}

          {/* Live Link or Details */}
          {project.link ? (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <span>Live Demo</span>
              {renderIcon(FaExternalLinkAlt, { size: 10 })}
            </a>
          ) : (
            <button
              type="button"
              onClick={handleOpenDetails}
              className="inline-flex items-center gap-1 font-semibold text-purple-400 hover:text-purple-300 transition-colors"
            >
              <span>Case Study</span>
              {renderIcon(FaArrowRight, { size: 10 })}
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
};

const Projects: React.FC<ProjectsProps> = ({ onSelectProject }) => {
  const [projectsList, setProjectsList] = useState<Project[]>(getAllProjectsSync);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [showAllProjects, setShowAllProjects] = useState<boolean>(false);
  const [columns, setColumns] = useState<number>(3);

  useEffect(() => {
    let active = true;
    getLiveProjects().then((live) => {
      if (active && live && live.length > 0) {
        React.startTransition(() => {
          setProjectsList(live);
        });
      }
    });

    const handleProjectsUpdate = () => {
      const live = getAllProjectsSync();
      React.startTransition(() => {
        setProjectsList(live);
      });
    };

    window.addEventListener("portfolio_projects_updated", handleProjectsUpdate);
    return () => {
      active = false;
      window.removeEventListener("portfolio_projects_updated", handleProjectsUpdate);
    };
  }, []);

  useEffect(() => {
    const updateCols = () => {
      if (typeof window === "undefined") return;
      if (window.innerWidth >= 1024) setColumns(4);
      else if (window.innerWidth >= 640) setColumns(2);
      else setColumns(1);
    };

    updateCols();
    window.addEventListener("resize", updateCols);
    return () => window.removeEventListener("resize", updateCols);
  }, []);

  const handleFilterChange = (filterId: string) => {
    React.startTransition(() => {
      setActiveFilter(filterId);
      setShowAllProjects(false);
    });
  };

  const filterTabs = [
    { id: "all", label: "All Projects", icon: FaLayerGroup },
    { id: "featured", label: "Featured", icon: FaStar },
    { id: "web", label: "Web Applications", icon: FaGlobe },
    { id: "mobile", label: "Mobile Apps", icon: FaMobileAlt },
    { id: "ml", label: "AI & Machine Learning", icon: FaBrain },
    { id: "iot", label: "IoT & Hardware", icon: FaMicrochip },
  ];

  const filteredProjects = projectsList.filter((p) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "featured") return p.featured;
    return p.category === activeFilter;
  });

  const getCategoryCount = (filterId: string) => {
    if (filterId === "all") return projectsList.length;
    if (filterId === "featured") return projectsList.filter((p) => p.featured).length;
    return projectsList.filter((p) => p.category === filterId).length;
  };

  const rowLimit = columns * 3; // 4 columns * 3 rows = 12 projects on desktop initially
  const visibleProjects = !showAllProjects
    ? filteredProjects.slice(0, rowLimit)
    : filteredProjects;

  return (
    <section
      id="projects"
      className="relative py-8 sm:py-12 overflow-hidden bg-gradient-to-b from-[#030014] via-[#090e1f] to-[#030014]"
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
          className="mb-6 sm:mb-8 text-center"
        >
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-cyan-400">
            <span>Portfolio Showcase</span>
            <span className="w-1 h-1 rounded-full bg-cyan-400" />
          </span>
          <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
            <span>Featured Projects &amp;</span>
            <a
              href="#case-studies"
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = "#case-studies";
              }}
              title="Click to explore the Case Studies Flow"
              className="group/cs inline-flex items-center gap-1.5 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 hover:from-cyan-300 hover:to-pink-400 cursor-pointer transition-all duration-300 underline decoration-cyan-400/40 hover:decoration-pink-400 decoration-2 underline-offset-4"
            >
              <span>Case Studies</span>
              <span className="inline-block text-xs sm:text-sm text-cyan-400 group-hover/cs:text-pink-400 group-hover/cs:translate-x-0.5 group-hover/cs:-translate-y-0.5 transition-transform">
                ↗
              </span>
            </a>
          </h2>
          <div className="w-20 h-1 mx-auto mt-3 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400" />
          <p className="max-w-2xl mx-auto mt-4 text-sm sm:text-base text-slate-400">
            Explore software systems engineered with modern architecture, practical problem solving, and proven business utility.
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.id;
            const count = getCategoryCount(tab.id);
            return (
              <button
                key={tab.id}
                onClick={() => handleFilterChange(tab.id)}
                className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-full transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 text-white shadow-lg shadow-purple-500/20 scale-105"
                    : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/10"
                }`}
              >
                {renderIcon(tab.icon, { size: 12 })}
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold leading-none transition-colors ${
                    isActive
                      ? "bg-white/25 text-white"
                      : "bg-white/[0.08] text-slate-400"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Projects Grid with Silky-Smooth Category Transition */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {visibleProjects.length === 0 ? (
              <div className="col-span-full py-16 text-center text-slate-400 text-sm">
                No projects found in this category.
              </div>
            ) : (
              visibleProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  onSelectProject={onSelectProject}
                />
              ))
            )}
          </motion.div>
        </AnimatePresence>

        {/* View All / Show Less Toggle Button */}
        {filteredProjects.length > rowLimit && (
          <div className="flex justify-center mt-12">
            <button
              type="button"
              onClick={() => {
                setShowAllProjects((prev) => !prev);
              }}
              className="inline-flex items-center gap-2.5 px-7 py-3 text-xs sm:text-sm font-semibold text-white transition-all duration-300 rounded-full border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 hover:border-purple-400 hover:scale-105 shadow-lg shadow-purple-500/10 active:scale-95 group"
            >
              <span>
                {showAllProjects
                  ? "Show Less"
                  : `View All Projects (${filteredProjects.length})`}
              </span>
              {renderIcon(showAllProjects ? FaChevronUp : FaChevronDown, {
                size: 13,
                className: "transition-transform text-cyan-300",
              })}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
