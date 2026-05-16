import { motion, Variants } from "framer-motion";
import { useEffect, useState } from "react";
import { IconBaseProps } from "react-icons";
import {
  FaArrowLeft,
  FaExternalLinkAlt,
  FaGithub,
  FaLock,
  FaTag,
  FaStar,
} from "react-icons/fa";

type Project = {
  title: string;
  description: string;
  technologies: string[];
  image: string;
  projectNumber?: number;
  link?: string;
  github?: string;
  sourceCodePrivate?: boolean;
  featured?: boolean;
  longDescription?: string;
};

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

const IMAGE_FALLBACK =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#1e293b"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="800" fill="url(#g)"/>
      <text x="600" y="390" text-anchor="middle" fill="#e2e8f0" font-family="Arial" font-size="42" font-weight="700">Preview unavailable</text>
      <text x="600" y="450" text-anchor="middle" fill="#94a3b8" font-family="Arial" font-size="24">Image could not be loaded.</text>
    </svg>
  `);

const readProjectFromUrl = (): Project | null => {
  const encodedProject = new URLSearchParams(window.location.search).get(
    "project",
  );
  if (!encodedProject) return null;
  try {
    return JSON.parse(encodedProject) as Project;
  } catch {
    return null;
  }
};

const techColors: Record<string, string> = {
  React: "from-cyan-500/20 to-cyan-400/10 border-cyan-400/30 text-cyan-300",
  TypeScript:
    "from-blue-500/20 to-blue-400/10 border-blue-400/30 text-blue-300",
  JavaScript:
    "from-yellow-500/20 to-yellow-400/10 border-yellow-400/30 text-yellow-300",
  "Node.js":
    "from-green-500/20 to-green-400/10 border-green-400/30 text-green-300",
  Python: "from-sky-500/20 to-sky-400/10 border-sky-400/30 text-sky-300",
  default:
    "from-purple-500/20 to-purple-400/10 border-purple-400/30 text-purple-300",
};

const getTechColor = (tech: string) => techColors[tech] ?? techColors.default;

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const ProjectDetails = () => {
  const project = readProjectFromUrl();
  const [imageSrc, setImageSrc] = useState(IMAGE_FALLBACK);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (!project?.image) {
      setImageSrc(IMAGE_FALLBACK);
      return;
    }
    setImageSrc(toProxyImageUrl(project.image));
  }, [project?.image]);

  useEffect(() => {
    if (!project) return;

    document.title = `Maharab | ${project.title}`;

    return () => {
      document.title = "Maharab Hosen";
    };
  }, [project]);

  if (!project) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#060b18] text-white">
        {/* Background blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-purple-700/10 blur-[120px]" />
          <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-cyan-700/10 blur-[120px]" />
        </div>

        <div className="relative flex flex-col items-center justify-center min-h-screen px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-lg"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 mb-6 border rounded-full border-white/10 bg-white/5">
              <span className="text-4xl">🔍</span>
            </div>
            <p className="mb-2 text-sm uppercase tracking-[0.35em] text-cyan-400">
              404 — Not Found
            </p>
            <h1 className="mb-4 text-3xl font-bold sm:text-4xl">
              Project link is missing or invalid.
            </h1>
            <p className="mb-8 text-gray-400">
              The project you're looking for doesn't exist or the URL is
              malformed.
            </p>
            <a
              href={window.location.pathname}
              className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-white transition-all rounded-full shadow-lg bg-gradient-to-r from-cyan-500 to-purple-600 shadow-purple-500/20 hover:scale-105 hover:shadow-purple-500/40"
            >
              {renderIcon(
                FaArrowLeft as React.ComponentType<IconBaseProps>,
                {},
              )}
              Back to Portfolio
            </a>
          </motion.div>
        </div>
      </main>
    );
  }

  const isSourceCodePrivate = project.sourceCodePrivate === true;
  const hasGithubLink = Boolean(project.github?.trim());
  const hasLiveLink = Boolean(project.link?.trim());

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#060b18] text-white">
      {/* Ambient background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute -left-60 -top-60 h-[700px] w-[700px] rounded-full bg-purple-700/10 blur-[150px]" />
        <div className="absolute -bottom-60 -right-60 h-[600px] w-[600px] rounded-full bg-cyan-700/10 blur-[150px]" />
        <div className="absolute left-1/2 top-1/3 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-blue-700/5 blur-[120px]" />
      </div>

      {/* Grid overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 px-4 py-10 mx-auto max-w-7xl sm:px-6 lg:px-8 lg:py-14">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <a
            href={window.location.pathname}
            className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/70 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
          >
            <span className="transition-transform group-hover:-translate-x-0.5">
              {renderIcon(
                FaArrowLeft as React.ComponentType<IconBaseProps>,
                {},
              )}
            </span>
            Back to Portfolio
          </a>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mt-10 space-y-8"
        >
          {/* Hero Image Block */}
          <motion.div variants={itemVariants} className="relative">
            <div className="relative overflow-hidden border shadow-2xl rounded-3xl border-white/10 bg-white/5 shadow-black/40">
              {/* Shimmer overlay while loading */}
              {!imageLoaded && (
                <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-white/5 via-white/10 to-white/5" />
              )}

              <img
                src={imageSrc}
                alt={project.title}
                onLoad={() => setImageLoaded(true)}
                onError={() => {
                  setImageSrc(IMAGE_FALLBACK);
                  setImageLoaded(true);
                }}
                className={`h-64 w-full object-cover transition-opacity duration-700 sm:h-80 lg:h-[480px] ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#060b18] via-[#060b18]/30 to-transparent" />

              {/* Featured badge */}
              {project.featured && (
                <div className="absolute right-4 top-4">
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: "spring" }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-sm font-semibold text-amber-300 backdrop-blur-sm"
                  >
                    {renderIcon(FaStar as React.ComponentType<IconBaseProps>, {
                      className: "text-amber-400",
                    })}
                    Featured
                  </motion.span>
                </div>
              )}

              {/* Title overlay on image */}
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-10">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.4em] text-cyan-400">
                  Project Detail
                </p>
                <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl xl:text-6xl">
                  {project.title}
                </h1>
              </div>
            </div>
          </motion.div>

          {/* Content Grid */}
          <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Description Card */}
              <motion.div
                variants={itemVariants}
                className="p-6 border rounded-2xl border-white/10 bg-white/5 backdrop-blur-sm sm:p-8"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-cyan-500/20">
                    <span className="text-lg">📋</span>
                  </div>
                  <h2 className="text-lg font-semibold text-white">Overview</h2>
                </div>
                <p className="leading-relaxed text-gray-300 sm:text-lg">
                  {project.description}
                </p>
              </motion.div>

              {/* Long Description */}
              {project.longDescription && (
                <motion.div
                  variants={itemVariants}
                  className="p-6 border rounded-2xl border-white/10 bg-white/5 backdrop-blur-sm sm:p-8"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-purple-500/20">
                      <span className="text-lg">📄</span>
                    </div>
                    <h2 className="text-lg font-semibold text-white">
                      About This Project
                    </h2>
                  </div>
                  <p className="leading-relaxed text-gray-300">
                    {project.longDescription}
                  </p>
                </motion.div>
              )}

              {/* Technologies */}
              <motion.div
                variants={itemVariants}
                className="p-6 border rounded-2xl border-white/10 bg-white/5 backdrop-blur-sm sm:p-8"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-blue-500/20">
                    {renderIcon(FaTag as React.ComponentType<IconBaseProps>, {
                      className: "text-blue-400 text-sm",
                    })}
                  </div>
                  <h2 className="text-lg font-semibold text-white">
                    Technologies Used
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {project.technologies.map((tech, i) => (
                    <motion.span
                      key={tech}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                      className={`inline-flex items-center rounded-full border bg-gradient-to-br px-4 py-1.5 text-sm font-medium backdrop-blur-sm ${getTechColor(tech)}`}
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Sidebar */}
            <motion.aside variants={itemVariants} className="space-y-4">
              {/* Quick Info Card */}
              <div className="p-6 border rounded-2xl border-white/10 bg-white/5 backdrop-blur-sm">
                <h2 className="mb-4 text-sm font-semibold tracking-widest text-gray-400 uppercase">
                  Project Info
                </h2>
                <dl className="space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-sm text-gray-400">Status</dt>
                    <dd>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-green-400/30 bg-green-400/10 px-3 py-1 text-xs font-medium text-green-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                        Active
                      </span>
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-sm text-gray-400">Source Code</dt>
                    <dd>
                      {isSourceCodePrivate ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-300">
                          {renderIcon(
                            FaLock as React.ComponentType<IconBaseProps>,
                            { className: "text-xs" },
                          )}
                          Private
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300">
                          Public
                        </span>
                      )}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-sm text-gray-400">Type</dt>
                    <dd>
                      <span className="text-sm font-medium text-white">
                        {project.featured ? "Featured Project" : "Project"}
                      </span>
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-sm text-gray-400">Stack</dt>
                    <dd className="text-sm font-medium text-white">
                      {project.technologies.length} Technologies
                    </dd>
                  </div>
                </dl>
              </div>

              {/* CTA Buttons */}
              <div className="p-6 space-y-3 border rounded-2xl border-white/10 bg-white/5 backdrop-blur-sm">
                <h2 className="mb-4 text-sm font-semibold tracking-widest text-gray-400 uppercase">
                  Links
                </h2>

                {hasLiveLink && (
                  <motion.a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3.5 font-semibold text-white shadow-lg shadow-cyan-500/20 transition-shadow hover:shadow-cyan-500/40"
                  >
                    <span className="absolute inset-0 transition-colors bg-white/0 group-hover:bg-white/10" />
                    {renderIcon(
                      FaExternalLinkAlt as React.ComponentType<IconBaseProps>,
                      { className: "text-sm" },
                    )}
                    View Live Demo
                  </motion.a>
                )}

                {!isSourceCodePrivate && hasGithubLink && (
                  <motion.a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl border border-white/10 bg-white/5 px-5 py-3.5 font-semibold text-white transition-all hover:border-white/20 hover:bg-white/10"
                  >
                    {renderIcon(
                      FaGithub as React.ComponentType<IconBaseProps>,
                      { className: "text-lg" },
                    )}
                    View Source Code
                  </motion.a>
                )}

                {isSourceCodePrivate && (
                  <div className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/5 px-5 py-3.5 font-medium text-amber-300/70">
                    {renderIcon(FaLock as React.ComponentType<IconBaseProps>, {
                      className: "text-sm",
                    })}
                    Source Code Private
                  </div>
                )}

                {!hasLiveLink && !hasGithubLink && !isSourceCodePrivate && (
                  <p className="text-sm text-center text-gray-500">
                    No links available for this project.
                  </p>
                )}
              </div>

              {/* Decorative glow card */}
              <div className="relative p-6 overflow-hidden border rounded-2xl border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-cyan-500/5 backdrop-blur-sm">
                <div className="absolute w-40 h-40 rounded-full pointer-events-none -right-10 -top-10 bg-purple-500/20 blur-3xl" />
                <p className="relative text-sm leading-relaxed text-gray-400">
                  💡 This project is part of my portfolio. Feel free to reach
                  out if you have any questions or want to collaborate!
                </p>
              </div>
            </motion.aside>
          </div>
        </motion.div>
      </div>
    </main>
  );
};

export default ProjectDetails;
