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
  PROJECTS,
  Project,
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
    if (typeof window !== "undefined") {
      const currentScrollY =
        window.scrollY || document.documentElement.scrollTop || 0;
      sessionStorage.setItem("portfolio_home_scroll_y", String(currentScrollY));
    }
    if (onSelectProject) {
      onSelectProject(project);
    } else {
      const url = `${window.location.pathname}?project=${project.id}`;
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.3) }}
      whileHover={{ y: -6 }}
      onClick={handleOpenDetails}
      className={`relative flex flex-col justify-between overflow-hidden border rounded-2xl bg-white/[0.03] border-white/10 backdrop-blur-xl hover:border-purple-500/40 hover:bg-white/[0.05] transition-all duration-300 cursor-pointer group shadow-xl shadow-black/20 ${
        project.featured ? "ring-1 ring-purple-500/30" : ""
      }`}
    >
      {/* Thumbnail Banner */}
      <div className="relative overflow-hidden aspect-[16/9] bg-slate-950/80">
        <img
          src={imgSrc}
          alt={project.title}
          loading="lazy"
          onError={handleImageError}
          className="object-cover object-top w-full h-full transition-transform duration-700 group-hover:scale-105"
        />

        {/* Gradient Shadow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-[#0b0f19]/30 to-transparent" />

        {/* Badges Top Row */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="px-2.5 py-1 text-[11px] font-semibold tracking-wider uppercase rounded-full bg-slate-900/80 border border-white/15 text-cyan-300 backdrop-blur-md">
            {project.categoryLabel}
          </span>

          {project.featured && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-full bg-purple-500/80 text-white backdrop-blur-md shadow-md">
              {renderIcon(FaStar, { size: 10 })}
              Featured
            </span>
          )}
        </div>

        {/* Hover Details Button Hint */}
        <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-0 bg-black/40 backdrop-blur-[2px] group-hover:opacity-100">
          <span className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white rounded-full bg-purple-600/90 shadow-lg">
            <span>Explore Case Study</span>
            {renderIcon(FaArrowRight, { size: 11 })}
          </span>
        </div>
      </div>

      {/* Content Container */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        <div className="flex-1">
          <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-purple-300 transition-colors mb-1.5 line-clamp-1">
            {project.title}
          </h3>
          <p className="text-xs leading-relaxed text-slate-400 line-clamp-1 mb-3.5 font-normal" title={project.description}>
            {project.description}
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
  const [projectsList, setProjectsList] = useState<Project[]>(PROJECTS);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [showAllProjects, setShowAllProjects] = useState<boolean>(false);
  const [columns, setColumns] = useState<number>(3);

  useEffect(() => {
    const fetchProjects = () => {
      getLiveProjects().then((data) => {
        if (data && data.length > 0) {
          setProjectsList(data);
        }
      });
    };
    fetchProjects();
    window.addEventListener("portfolio_projects_updated", fetchProjects);
    return () => window.removeEventListener("portfolio_projects_updated", fetchProjects);
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
    setActiveFilter(filterId);
    setShowAllProjects(false);
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
