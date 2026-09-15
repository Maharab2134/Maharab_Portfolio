import React, { useEffect, useLayoutEffect, useState, useRef } from "react";
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
  Project,
  getProjectById,
  getAllProjectsSync,
  toProxyImageUrl,
  extractGoogleDriveFileId,
  toGoogleDriveDirectUrl,
  createProjectSvgFallback,
} from "../data/projectsData";
import { getLiveProjects } from "../lib/portfolioService";
import ProjectReviews, { openProjectReviewModal } from "../components/ProjectReviews";

const renderIcon = (Icon: any, props: any = {}) => {
  return <Icon {...props} />;
};

interface ProjectDetailsProps {
  initialProject?: Project | null;
  onBack?: () => void;
}

const resolveProjectSync = (initial?: Project | null): Project | null => {
  if (initial) return initial;
  if (typeof window === "undefined") return null;

  const params = new URLSearchParams(window.location.search);
  const param = params.get("project");
  if (!param) return null;

  // 1. Try matching by slug, id, or title via enhanced getProjectById
  const matched = getProjectById(param);
  if (matched) return matched;

  // 2. Direct lookup in localStorage "maharab_cached_projects"
  try {
    const cached = localStorage.getItem("maharab_cached_projects");
    if (cached) {
      const parsedList: any[] = JSON.parse(cached);
      if (Array.isArray(parsedList)) {
        const cleanParam = decodeURIComponent(param).toLowerCase().trim();
        const cleanSlug = cleanParam.replace(/[^a-z0-9]+/g, "-");
        const found = parsedList.find((p) => {
          const id = (p.id || p.project_id || "").toLowerCase().trim();
          const title = (p.title || "").toLowerCase().trim();
          return (
            id === cleanParam ||
            title === cleanParam ||
            id.replace(/[^a-z0-9]+/g, "-") === cleanSlug ||
            title.replace(/[^a-z0-9]+/g, "-") === cleanSlug
          );
        });
        if (found) {
          return {
            id: found.id || found.project_id || cleanSlug,
            title: found.title,
            subtitle: found.subtitle || found.short_desc || found.description || "",
            category: found.category || "web",
            categoryLabel: found.categoryLabel || "Web App",
            description: found.description || found.short_desc || "",
            longDescription:
              found.longDescription || found.full_desc || found.description || "",
            problem: found.problem || "",
            solution: found.solution || "",
            features: Array.isArray(found.features)
              ? found.features
              : typeof found.features === "string"
              ? found.features.split("\n").map((f: string) => f.trim()).filter(Boolean)
              : [],
            results: Array.isArray(found.results)
              ? found.results
              : typeof found.results === "string"
              ? found.results.split("\n").map((r: string) => r.trim()).filter(Boolean)
              : ["100% responsive", "Production ready"],
            technologies: Array.isArray(found.technologies)
              ? found.technologies
              : typeof found.technologies === "string"
              ? found.technologies.split(",").map((t: string) => t.trim()).filter(Boolean)
              : ["React"],
            image: found.image || found.image_url || "",
            fallbackGradient: found.fallbackGradient || "from-purple-600/30 to-blue-600/30",
            link: found.link || found.live_url || "",
            github: found.github || found.github_url || "",
            sourceCodePrivate: Boolean(found.sourceCodePrivate),
            featured: Boolean(found.featured),
            year: found.year || "2024",
          };
        }
      }
    }
  } catch (e) {
    // Ignore error
  }

  // 3. Fallback: Check if it's JSON encoded
  try {
    const parsed = JSON.parse(param);
    if (parsed && typeof parsed === "object") {
      if (parsed.id) {
        const found = getProjectById(parsed.id);
        if (found) return found;
      }
      if (parsed.title) {
        const foundByTitle = getProjectById(parsed.title);
        if (foundByTitle) return foundByTitle;
      }
      return {
        id: parsed.id || "custom-project",
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

const ProjectDetails: React.FC<ProjectDetailsProps> = ({
  initialProject,
  onBack,
}) => {
  const topRef = useRef<HTMLDivElement>(null);
  const [project, setProject] = useState<Project | null>(() =>
    resolveProjectSync(initialProject)
  );
  const [isLoading, setIsLoading] = useState<boolean>(() => {
    if (initialProject || resolveProjectSync(initialProject)) return false;
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return Boolean(params.get("project"));
    }
    return false;
  });
  const [imageError, setImageError] = useState(false);
  const [directFallbackTried, setDirectFallbackTried] = useState(false);

  // Whether we arrived via a review anchor (e.g. from testimonial click)
  const hasHashAnchor =
    typeof window !== "undefined" &&
    window.location.hash &&
    window.location.hash.length > 1;

  const executeInstantTopScroll = () => {
    // If a hash anchor is present, do NOT jump to top — let the hash effect handle it
    if (hasHashAnchor) return;
    if (typeof window !== "undefined") {
      document.documentElement.style.scrollBehavior = "auto";
      document.body.style.scrollBehavior = "auto";
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as any });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  };

  // Scroll to hash anchor once project content is ready — single attempt, no retries
  useEffect(() => {
    if (!hasHashAnchor || isLoading || !project) return;
    const targetId = window.location.hash.substring(1);
    // Short delay to let the DOM render the reviews section
    const timer = setTimeout(() => {
      const el =
        document.getElementById(targetId) ||
        document.getElementById(`${project.id}-review`) ||
        document.getElementById("project-reviews-section");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 180);
    return () => clearTimeout(timer);
  }, [isLoading, project]);

  useLayoutEffect(() => {
    executeInstantTopScroll();
  }, [project?.id, initialProject]);

  useEffect(() => {
    executeInstantTopScroll();

    const proj = resolveProjectSync(initialProject);
    if (proj) {
      setProject(proj);
      setIsLoading(false);
      setImageError(false);
      setDirectFallbackTried(false);
      document.title = `${proj.title} | Case Study — Md. Maharab Hosen`;
    } else {
      // If not resolved locally, attempt live database lookup
      const params = new URLSearchParams(window.location.search);
      const param = params.get("project");
      if (param) {
        setIsLoading(true);
        getLiveProjects()
          .then((liveList) => {
            const cleanParam = decodeURIComponent(param).toLowerCase().trim();
            const cleanSlug = cleanParam.replace(/[^a-z0-9]+/g, "-");

            const found = liveList.find((p) => {
              const pId = (p.id || (p as any).project_id || "").toLowerCase().trim();
              const pTitle = (p.title || "").toLowerCase().trim();
              return (
                pId === cleanParam ||
                pTitle === cleanParam ||
                pId.replace(/[^a-z0-9]+/g, "-") === cleanSlug ||
                pTitle.replace(/[^a-z0-9]+/g, "-") === cleanSlug
              );
            });

            if (found) {
              setProject(found);
              document.title = `${found.title} | Case Study — Md. Maharab Hosen`;
            } else {
              document.title = "Project Not Found | Md. Maharab Hosen";
            }
          })
          .catch(() => {
            document.title = "Project Not Found | Md. Maharab Hosen";
          })
          .finally(() => {
            setIsLoading(false);
            executeInstantTopScroll();
          });
      } else {
        setIsLoading(false);
        document.title = "Project Not Found | Md. Maharab Hosen";
      }
    }

    const rafId = requestAnimationFrame(executeInstantTopScroll);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [initialProject]);

  const handleReturnHome = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onBack) {
      onBack();
    } else {
      const url = new URL(window.location.href);
      url.searchParams.delete("project");
      url.hash = "projects";
      window.history.pushState({}, "", url.toString());
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
  };

  if (isLoading) {
    return (
      <main className="relative min-h-screen flex flex-col items-center justify-center p-4 bg-[#030014] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-400 animate-pulse">
            Loading project case study...
          </p>
        </div>
      </main>
    );
  }

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

  // Safe normalized lists
  const technologiesList: string[] = Array.isArray(project.technologies)
    ? project.technologies
    : typeof project.technologies === "string"
    ? (project.technologies as string)
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : ["Full-Stack"];

  const featuresList: string[] = Array.isArray(project.features)
    ? project.features
    : typeof project.features === "string"
    ? (project.features as string)
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean)
    : [];

  const resultsList: string[] = Array.isArray(project.results)
    ? project.results
    : typeof project.results === "string"
    ? (project.results as string)
        .split("\n")
        .map((r) => r.trim())
        .filter(Boolean)
    : [];

  // Next and Previous project navigation across all live & static projects
  const allProjects = getAllProjectsSync();
  const currentIndex = allProjects.findIndex(
    (p) =>
      p.id.toLowerCase() === project.id.toLowerCase() ||
      p.title.toLowerCase() === project.title.toLowerCase()
  );
  const prevProject =
    currentIndex > 0
      ? allProjects[currentIndex - 1]
      : allProjects[allProjects.length - 1];
  const nextProject =
    currentIndex >= 0 && currentIndex < allProjects.length - 1
      ? allProjects[currentIndex + 1]
      : allProjects[0];

  const fallbackSvg = createProjectSvgFallback(
    project.title,
    project.categoryLabel || "Project",
    technologiesList[0] || "Code"
  );
  const heroImage =
    imageError || !project.image
      ? fallbackSvg
      : directFallbackTried
      ? toGoogleDriveDirectUrl(project.image)
      : toProxyImageUrl(project.image);

  return (
    <main
      ref={topRef}
      id="project-details-root"
      className="relative min-h-screen py-10 sm:py-16 bg-[#030014] text-white overflow-x-hidden"
    >
      <div
        id="project-details-top-anchor"
        className="absolute top-0 left-0 w-0 h-0 pointer-events-none"
      />
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
            <span className="text-cyan-400 capitalize">
              {project.categoryLabel || "Project"}
            </span>
          </div>
        </div>

        {/* Project Header Card */}
        <header className="mb-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-white/5 border border-white/10 text-cyan-300">
              {project.categoryLabel || "Web App"}
            </span>
            {project.featured && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300">
                {renderIcon(FaStar, { size: 11 })}
                Featured System
              </span>
            )}
            <button
              type="button"
              onClick={() => openProjectReviewModal(project.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 transition-all hover:scale-105 cursor-pointer shadow-sm"
              title="Click to write a review for this project"
            >
              {renderIcon(FaStar, { size: 11, className: "text-amber-400" })}
              <span>Client Reviews</span>
              <span className="text-[10px] text-amber-300/80 underline ml-0.5">• Rate Project</span>
            </button>
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
            onError={() => {
              const fileId = extractGoogleDriveFileId(project.image);
              if (fileId && !directFallbackTried) {
                setDirectFallbackTried(true);
                return;
              }
              setImageError(true);
            }}
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
              <p className="text-base leading-relaxed text-slate-300 whitespace-pre-line">
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
            {featuresList.length > 0 && (
              <section className="p-6 sm:p-8 border rounded-2xl bg-white/[0.03] border-white/10 backdrop-blur-xl">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span>⚡</span>
                  <span>Key Architectural Features</span>
                </h2>
                <ul className="space-y-3">
                  {featuresList.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm leading-relaxed text-slate-300"
                    >
                      {renderIcon(FaCheckCircle, {
                        size: 15,
                        className: "text-purple-400 mt-0.5 flex-shrink-0",
                      })}
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Results / Impact */}
            {resultsList.length > 0 && (
              <section className="p-6 sm:p-8 border rounded-2xl bg-white/[0.03] border-white/10 backdrop-blur-xl">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span>🏆</span>
                  <span>Results &amp; Impact</span>
                </h2>
                <ul className="space-y-2.5">
                  {resultsList.map((res, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 text-sm text-slate-300"
                    >
                      <span className="w-2 h-2 rounded-full bg-cyan-400 flex-shrink-0" />
                      <span>{res}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Client & Peer Reviews Section */}
            <div id="saytica-review" className="scroll-mt-24">
              <div id={`${project.id}-review`} className="scroll-mt-24">
                <ProjectReviews projectId={project.id} projectTitle={project.title} />
              </div>
            </div>
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

              {/* Instant Review Trigger in Sticky Sidebar */}
              <button
                type="button"
                onClick={() => openProjectReviewModal(project.id)}
                className="flex items-center justify-center gap-2 w-full py-3 px-4 font-semibold text-sm text-white rounded-xl shadow-lg bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-orange-400 hover:shadow-amber-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                {renderIcon(FaStar, { size: 14, className: "text-white" })}
                <span>Write a Review</span>
              </button>

              <a
                href="#project-reviews-section"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("project-reviews-section")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="block text-center text-xs text-slate-400 hover:text-cyan-300 transition-colors pt-0.5"
              >
                Read client evaluations ↓
              </a>
            </div>

            {/* Tech Stack Breakdown */}
            <div className="p-6 border rounded-2xl bg-white/[0.03] border-white/10 backdrop-blur-xl">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
                {renderIcon(FaTag, { size: 12 })}
                <span>Technologies Used</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {technologiesList.map((tech) => (
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
                    onClick={(e) => {
                      e.preventDefault();
                      setProject(prevProject);
                      setImageError(false);
                      setDirectFallbackTried(false);
                      const url = new URL(window.location.href);
                      url.hash = "";
                      url.searchParams.set("project", prevProject.id);
                      window.history.pushState({}, "", url.toString());
                      document.title = `${prevProject.title} | Case Study — Md. Maharab Hosen`;
                      executeInstantTopScroll();
                    }}
                    className="block p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/15 hover:bg-white/5 transition-all group"
                  >
                    <span className="text-slate-500 block">
                      ← Previous Project
                    </span>
                    <span className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors">
                      {prevProject.title}
                    </span>
                  </a>
                )}
                {nextProject && (
                  <a
                    href={`?project=${nextProject.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setProject(nextProject);
                      setImageError(false);
                      setDirectFallbackTried(false);
                      const url = new URL(window.location.href);
                      url.hash = "";
                      url.searchParams.set("project", nextProject.id);
                      window.history.pushState({}, "", url.toString());
                      document.title = `${nextProject.title} | Case Study — Md. Maharab Hosen`;
                      executeInstantTopScroll();
                    }}
                    className="block p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/15 hover:bg-white/5 transition-all group text-right"
                  >
                    <span className="text-slate-500 block">
                      Next Project →
                    </span>
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
