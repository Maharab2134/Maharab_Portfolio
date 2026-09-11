import React, { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaExternalLinkAlt,
  FaGithub,
  FaLock,
  FaTag,
  FaStar,
  FaCheckCircle,
} from "react-icons/fa";
import {
  PROJECTS,
  Project,
  getProjectById,
  toProxyImageUrl,
  createProjectSvgFallback,
} from "../data/projectsData";

const renderIcon = (Icon: any, props: any = {}) => {
  return <Icon {...props} />;
};

const resolveProject = (): Project | null => {
  if (typeof window === "undefined") return null;

  const params = new URLSearchParams(window.location.search);
  const param = params.get("project");
  if (!param) return null;

  // Try matching by slug/id first
  const matched = getProjectById(param);
  if (matched) return matched;

  // Fallback: Check if it's JSON encoded
  try {
    const parsed = JSON.parse(param);
    if (parsed && typeof parsed === "object") {
      // If parsed has id or title, find it
      if (parsed.id) {
        const found = getProjectById(parsed.id);
        if (found) return found;
      }
      if (parsed.title) {
        const foundByTitle = PROJECTS.find(
          (p) => p.title.toLowerCase() === String(parsed.title).toLowerCase()
        );
        if (foundByTitle) return foundByTitle;
      }
      return {
        id: "custom-project",
        title: parsed.title || "Project Case Study",
        subtitle: parsed.subtitle || "Full-Stack Project Details",
        category: parsed.category || "web",
        categoryLabel: parsed.categoryLabel || "Web App",
        description: parsed.description || "",
        longDescription: parsed.longDescription || parsed.description,
        problem: parsed.problem,
        solution: parsed.solution,
        features: Array.isArray(parsed.features) ? parsed.features : [],
        results: Array.isArray(parsed.results) ? parsed.results : [],
        technologies: Array.isArray(parsed.technologies) ? parsed.technologies : [],
        image: parsed.image || "",
        fallbackGradient: "from-purple-600/30 to-blue-600/30",
        link: parsed.link,
        github: parsed.github,
        sourceCodePrivate: parsed.sourceCodePrivate,
        featured: parsed.featured,
        year: parsed.year,
      };
    }
  } catch {
    // Ignore JSON parse errors
  }

  return null;
};

const ProjectDetails: React.FC = () => {
  const [project, setProject] = useState<Project | null>(() => resolveProject());
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const proj = resolveProject();
    setProject(proj);
    setImageError(false);

    if (proj) {
      document.title = `${proj.title} | Case Study — Md. Maharab Hosen`;
    } else {
      document.title = "Project Not Found | Md. Maharab Hosen";
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleReturnHome = (e: React.MouseEvent) => {
    e.preventDefault();
    const url = new URL(window.location.href);
    url.searchParams.delete("project");
    window.location.href = url.pathname;
  };

  if (!project) {
    return (
      <main className="relative min-h-screen flex items-center justify-center p-4 bg-[#030014] text-white">
        <div className="max-w-md p-8 text-center border rounded-3xl bg-white/[0.03] border-white/10 backdrop-blur-xl shadow-2xl">
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-2xl bg-white/5 text-3xl">
            🔍
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Project Not Found
          </h1>
          <p className="text-sm text-slate-400 mb-6">
            The project you're looking for doesn't exist or the link was updated.
          </p>
          <a
            href="/"
            onClick={handleReturnHome}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg hover:shadow-purple-500/30 transition-all"
          >
            {renderIcon(FaArrowLeft, { size: 12 })}
            <span>Back to Portfolio</span>
          </a>
        </div>
      </main>
    );
  }

  // Next and Previous project navigation
  const currentIndex = PROJECTS.findIndex((p) => p.id === project.id);
  const prevProject = currentIndex > 0 ? PROJECTS[currentIndex - 1] : PROJECTS[PROJECTS.length - 1];
  const nextProject = currentIndex < PROJECTS.length - 1 ? PROJECTS[currentIndex + 1] : PROJECTS[0];

  const fallbackSvg = createProjectSvgFallback(
    project.title,
    project.categoryLabel,
    project.technologies[0] || "Code"
  );
  const heroImage = imageError || !project.image ? fallbackSvg : toProxyImageUrl(project.image);

  return (
    <main className="relative min-h-screen py-10 sm:py-16 bg-[#030014] text-white overflow-x-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none opacity-20 -z-0">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full bg-purple-600/15 blur-[150px]" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] rounded-full bg-cyan-600/15 blur-[150px]" />
      </div>

      <div className="relative z-10 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Top Breadcrumb & Return Nav */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <a
            href="/"
            onClick={handleReturnHome}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-300 transition-colors border rounded-full bg-white/5 border-white/10 hover:text-white hover:bg-white/10 hover:border-white/25 backdrop-blur-md"
          >
            {renderIcon(FaArrowLeft, { size: 12 })}
            <span>Back to Portfolio</span>
          </a>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <span>Portfolio</span>
            <span>/</span>
            <span className="text-cyan-400 capitalize">{project.categoryLabel}</span>
          </div>
        </div>

        {/* Project Header Card */}
        <header className="mb-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-white/5 border border-white/10 text-cyan-300">
              {project.categoryLabel}
            </span>
            {project.featured && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300">
                {renderIcon(FaStar, { size: 11 })}
                Featured System
              </span>
            )}
            {project.year && (
              <span className="px-3 py-1 text-xs font-medium text-slate-400 rounded-full bg-white/5 border border-white/5">
                Year: {project.year}
              </span>
            )}
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
            {project.title}
          </h1>

          {project.subtitle && (
            <p className="text-lg sm:text-xl font-medium text-slate-300/90 max-w-4xl">
              {project.subtitle}
            </p>
          )}
        </header>

        {/* Hero Image Showcase */}
        <div className="relative mb-12 overflow-hidden border shadow-2xl rounded-3xl bg-slate-950/80 border-white/10 aspect-[16/9] max-h-[580px] shadow-black/40">
          <img
            src={heroImage}
            alt={project.title}
            onError={() => setImageError(true)}
            className="object-cover object-top w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030014] via-transparent to-transparent opacity-60 pointer-events-none" />
        </div>

        {/* 2-Column Content Layout */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12 items-start">
          {/* Main Case Study Column */}
          <div className="space-y-8 lg:col-span-8">
            {/* Overview & Deep Dive */}
            <section className="p-6 sm:p-8 border rounded-2xl bg-white/[0.03] border-white/10 backdrop-blur-xl">
              <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <span>📋</span>
                <span>Project Overview</span>
              </h2>
              <p className="text-base leading-relaxed text-slate-300">
                {project.longDescription || project.description}
              </p>
            </section>

            {/* Problem & Solution */}
            {(project.problem || project.solution) && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {project.problem && (
                  <div className="p-6 border rounded-2xl bg-white/[0.03] border-white/10 backdrop-blur-xl">
                    <h3 className="text-base font-bold text-rose-300 mb-2">
                      The Challenge
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-400">
                      {project.problem}
                    </p>
                  </div>
                )}
                {project.solution && (
                  <div className="p-6 border rounded-2xl bg-white/[0.03] border-white/10 backdrop-blur-xl">
                    <h3 className="text-base font-bold text-emerald-300 mb-2">
                      The Solution
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-400">
                      {project.solution}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Key Features */}
            {project.features && project.features.length > 0 && (
              <section className="p-6 sm:p-8 border rounded-2xl bg-white/[0.03] border-white/10 backdrop-blur-xl">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span>⚡</span>
                  <span>Key Architectural Features</span>
                </h2>
                <ul className="space-y-3">
                  {project.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-slate-300">
                      {renderIcon(FaCheckCircle, { size: 15, className: "text-purple-400 mt-0.5 flex-shrink-0" })}
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Results / Impact */}
            {project.results && project.results.length > 0 && (
              <section className="p-6 sm:p-8 border rounded-2xl bg-white/[0.03] border-white/10 backdrop-blur-xl">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span>🏆</span>
                  <span>Results &amp; Impact</span>
                </h2>
                <ul className="space-y-2.5">
                  {project.results.map((res, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 flex-shrink-0" />
                      <span>{res}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Sidebar Info & Action Links */}
          <aside className="space-y-6 lg:col-span-4 lg:sticky lg:top-8">
            {/* Quick Action Buttons */}
            <div className="p-6 border rounded-2xl bg-white/[0.03] border-white/10 backdrop-blur-xl space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Project Links
              </h3>

              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 font-semibold text-sm text-white rounded-xl shadow-lg bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 hover:shadow-purple-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Launch Live Demo</span>
                  {renderIcon(FaExternalLinkAlt, { size: 12 })}
                </a>
              )}

              {project.github && !project.sourceCodePrivate ? (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 font-semibold text-sm text-slate-200 rounded-xl bg-white/5 border border-white/15 hover:bg-white/10 hover:text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  {renderIcon(FaGithub, { size: 16 })}
                  <span>View Source Code</span>
                </a>
              ) : project.sourceCodePrivate ? (
                <div className="flex items-center justify-center gap-2 w-full py-3 px-4 text-xs font-medium text-amber-300 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  {renderIcon(FaLock, { size: 12 })}
                  <span>Private Enterprise Repository</span>
                </div>
              ) : null}
            </div>

            {/* Tech Stack Breakdown */}
            <div className="p-6 border rounded-2xl bg-white/[0.03] border-white/10 backdrop-blur-xl">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
                {renderIcon(FaTag, { size: 12 })}
                <span>Technologies Used</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 text-xs font-medium rounded-lg bg-white/5 border border-white/10 text-slate-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Next / Previous Project Navigator */}
            <div className="p-6 border rounded-2xl bg-white/[0.03] border-white/10 backdrop-blur-xl space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Explore More Projects
              </h3>
              <div className="space-y-2 text-xs">
                {prevProject && (
                  <a
                    href={`?project=${prevProject.id}`}
                    onClick={() => {
                      setProject(prevProject);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="block p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/15 hover:bg-white/5 transition-all group"
                  >
                    <span className="text-slate-500 block">← Previous Project</span>
                    <span className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors">
                      {prevProject.title}
                    </span>
                  </a>
                )}
                {nextProject && (
                  <a
                    href={`?project=${nextProject.id}`}
                    onClick={() => {
                      setProject(nextProject);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="block p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/15 hover:bg-white/5 transition-all group text-right"
                  >
                    <span className="text-slate-500 block">Next Project →</span>
                    <span className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                      {nextProject.title}
                    </span>
                  </a>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default ProjectDetails;
