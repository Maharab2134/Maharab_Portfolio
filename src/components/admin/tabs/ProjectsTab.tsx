import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaSpinner,
  FaCode,
  FaDownload,
  FaDatabase,
  FaPlus,
  FaCheck,
  FaCopy,
  FaExternalLinkAlt,
  FaCheckCircle,
  FaTimes,
  FaSearch,
  FaSortAmountDown,
  FaFolder,
  FaAngleDoubleUp,
  FaArrowUp,
  FaArrowDown,
  FaEdit,
  FaTrash,
  FaArrowLeft,
  FaSave,
  FaStar,
  FaTags,
  FaLightbulb,
  FaMagic,
  FaListUl,
  FaExclamationTriangle,
  FaGithub,
  FaGlobe,
} from "react-icons/fa";
import { supabase, isSupabaseConfigured } from "../../../lib/supabaseClient";
import {
  PROJECTS,
  toProxyImageUrl,
  extractGoogleDriveFileId,
  toGoogleDriveDirectUrl,
} from "../../../data/projectsData";
import {
  saveLiveProject,
  deleteLiveProject,
  saveProjectOrder,
  getCategoryPriority,
} from "../../../lib/portfolioService";
import {
  renderIcon,
  getSelectedTechs,
  getFeatureList,
  ProjectViewMode,
  AdminToast,
} from "../types";
import {
  PROJECT_CATEGORIES,
  TECH_SUGGESTIONS,
  STACK_PRESETS,
  PRESET_COVERS,
} from "../constants";
import { StorageRlsBanner } from "../StorageRlsBanner";

interface ProjectsTabProps {
  projectsList: any[];
  setProjectsList: React.Dispatch<React.SetStateAction<any[]>>;
  projectViewMode: ProjectViewMode;
  setProjectViewMode: React.Dispatch<React.SetStateAction<ProjectViewMode>>;
  editingProjectId: string | null;
  setEditingProjectId: React.Dispatch<React.SetStateAction<string | null>>;
  projectForm: any;
  setProjectForm: React.Dispatch<React.SetStateAction<any>>;
  handleFileUpload: (
    e: React.ChangeEvent<HTMLInputElement>,
    destination: "profile" | "resume" | "project"
  ) => Promise<void>;
  uploadStatus: string;
  storageRlsError: string | null;
  setStorageRlsError: (err: string | null) => void;
  sitemapGenerating: boolean;
  handleGenerateSitemap: (mode: "view" | "download" | "copy") => Promise<void>;
  sitemapCopied: boolean;
  fetchProjects: () => Promise<void>;
}

export const ProjectsTab: React.FC<ProjectsTabProps> = ({
  projectsList,
  setProjectsList,
  projectViewMode,
  setProjectViewMode,
  editingProjectId,
  setEditingProjectId,
  projectForm,
  setProjectForm,
  handleFileUpload,
  uploadStatus,
  storageRlsError,
  setStorageRlsError,
  sitemapGenerating,
  handleGenerateSitemap,
  sitemapCopied,
  fetchProjects,
}) => {
  const [projectSaving, setProjectSaving] = useState(false);
  const [projectToast, setProjectToast] = useState<AdminToast | null>(null);
  const [projectSearch, setProjectSearch] = useState("");
  const [projectCategoryFilter, setProjectCategoryFilter] = useState("all");

  // Technology Studio State
  const [techCategoryFilter, setTechCategoryFilter] = useState<string>("all");
  const [techSearchQuery, setTechSearchQuery] = useState("");
  const [customTechInput, setCustomTechInput] = useState("");
  const [studioPreviewTab, setStudioPreviewTab] = useState<"card" | "casestudy">("card");

  // Filtered projects for list view
  const filteredProjects = projectsList.filter((p) => {
    const matchesCategory =
      projectCategoryFilter === "all" ||
      (p.category || "").toLowerCase() === projectCategoryFilter.toLowerCase();
    const matchesSearch =
      (p.title || "").toLowerCase().includes(projectSearch.toLowerCase()) ||
      (p.short_desc || "").toLowerCase().includes(projectSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // ==========================================================================
  // Technology Helper Functions
  // ==========================================================================
  const toggleTechTag = (techName: string) => {
    const current = getSelectedTechs(projectForm.technologies);
    const exists = current.some((t) => t.toLowerCase() === techName.toLowerCase());
    let next: string[];
    if (exists) {
      next = current.filter((t) => t.toLowerCase() !== techName.toLowerCase());
    } else {
      next = [...current, techName];
    }
    setProjectForm((prev: any) => ({ ...prev, technologies: next.join(", ") }));
  };

  const removeTechTag = (tagToRemove: string) => {
    const current = getSelectedTechs(projectForm.technologies);
    const next = current.filter((t) => t.toLowerCase() !== tagToRemove.toLowerCase());
    setProjectForm((prev: any) => ({ ...prev, technologies: next.join(", ") }));
  };

  const addCustomTechTag = (tag: string) => {
    const trimmed = tag.trim().replace(/^,+|,+$/g, "");
    if (!trimmed) return;
    const current = getSelectedTechs(projectForm.technologies);
    if (!current.some((t) => t.toLowerCase() === trimmed.toLowerCase())) {
      setProjectForm((prev: any) => ({
        ...prev,
        technologies: [...current, trimmed].join(", "),
      }));
    }
  };

  const handleCustomTechKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (customTechInput.trim()) {
        addCustomTechTag(customTechInput);
        setCustomTechInput("");
      }
    }
  };

  const applyStackPreset = (presetTechs: string[]) => {
    const current = getSelectedTechs(projectForm.technologies);
    const combined = [...current];
    presetTechs.forEach((t) => {
      if (!combined.some((c) => c.toLowerCase() === t.toLowerCase())) {
        combined.push(t);
      }
    });
    setProjectForm((prev: any) => ({ ...prev, technologies: combined.join(", ") }));
  };

  // ==========================================================================
  // Project Actions
  // ==========================================================================
  const handleOpenCreateProject = () => {
    setEditingProjectId(null);
    setTechCategoryFilter("all");
    setTechSearchQuery("");
    setCustomTechInput("");
    setStudioPreviewTab("card");
    setProjectToast(null);
    setProjectForm({
      title: "",
      category: "web",
      short_desc: "",
      full_desc: "",
      image_url: "",
      technologies: "",
      features: "",
      github_url: "",
      live_url: "",
      featured: false,
    });
    setProjectViewMode("editor");
  };

  const handleOpenEditProject = (project: any) => {
    const projId = project.project_id || project.id;
    setEditingProjectId(projId);
    setTechCategoryFilter("all");
    setTechSearchQuery("");
    setCustomTechInput("");
    setStudioPreviewTab("card");
    setProjectToast(null);

    let initialCat = "web";
    const rawCat = (project.category || "").toLowerCase();
    if (rawCat.includes("mobile")) initialCat = "mobile";
    else if (rawCat.includes("ai") || rawCat.includes("ml")) initialCat = "ml";
    else if (rawCat.includes("iot") || rawCat.includes("hardware")) initialCat = "iot";
    else initialCat = "web";

    setProjectForm({
      title: project.title || "",
      category: initialCat,
      short_desc: project.short_desc || project.shortDescription || project.description || "",
      full_desc: project.full_desc || project.fullDescription || project.description || "",
      image_url: project.image_url || project.image || "",
      technologies: Array.isArray(project.technologies)
        ? project.technologies.join(", ")
        : (typeof project.technologies === "string" ? project.technologies : ""),
      features: Array.isArray(project.features)
        ? project.features.join("\n")
        : (typeof project.features === "string" ? project.features : ""),
      github_url: project.github_url || project.github || "",
      live_url: project.live_url || project.link || project.live || "",
      featured: Boolean(project.featured),
    });
    setProjectViewMode("editor");
  };

  const handleSaveProject = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!projectForm.title.trim()) {
      alert("Please provide a project title.");
      return;
    }

    setProjectSaving(true);
    const targetId =
      editingProjectId ||
      projectForm.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const payload = {
      project_id: targetId,
      id: targetId,
      title: projectForm.title,
      category: projectForm.category,
      short_desc: projectForm.short_desc,
      full_desc: projectForm.full_desc,
      image_url: projectForm.image_url || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
      technologies: projectForm.technologies,
      features: projectForm.features,
      github_url: projectForm.github_url,
      live_url: projectForm.live_url,
      featured: projectForm.featured,
    };

    // Optimistically update projectsList immediately in UI
    setProjectsList((prev) => {
      const idx = prev.findIndex((p) => (p.project_id || p.id) === targetId);
      const updatedItem = {
        ...payload,
        technologies: getSelectedTechs(payload.technologies),
        features: getFeatureList(payload.features),
      };
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], ...updatedItem };
        return copy;
      }
      return [updatedItem, ...prev];
    });

    try {
      const res = await saveLiveProject(payload);

      if (res.savedLocallyOnly) {
        setProjectToast({
          message: "Project saved in local cache! (Supabase returned RLS restriction: " + res.error + ")",
          type: "success",
        });
      } else {
        setProjectToast({
          message: "Project successfully updated and saved in live Supabase database!",
          type: "success",
        });
      }

      await fetchProjects();
      setTimeout(() => {
        setProjectToast(null);
        setProjectViewMode("list");
      }, 700);
    } catch (err: any) {
      alert("Failed to save project: " + err.message);
    } finally {
      setProjectSaving(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    setProjectsList((prev) => prev.filter((p) => (p.project_id || p.id) !== id));
    await deleteLiveProject(id);
    await fetchProjects();
  };

  const handleToggleFeatured = async (project: any) => {
    const updated = !project.featured;
    await saveLiveProject({ ...project, featured: updated });
    await fetchProjects();
  };

  const handleMoveProject = async (id: string, direction: "up" | "down") => {
    const currentIndex = projectsList.findIndex((p) => (p.id || p.project_id) === id);
    if (currentIndex === -1) return;
    if (direction === "up" && currentIndex === 0) return;
    if (direction === "down" && currentIndex === projectsList.length - 1) return;

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const copy = [...projectsList];
    const [moved] = copy.splice(currentIndex, 1);
    copy.splice(targetIndex, 0, moved);

    setProjectsList(copy);
    await saveProjectOrder(copy);
    setProjectToast({
      message: `"${moved.title}" moved to position #${targetIndex + 1}!`,
      type: "success",
    });
    setTimeout(() => setProjectToast(null), 3000);
  };

  const handleMoveToTop = async (id: string) => {
    const currentIndex = projectsList.findIndex((p) => (p.id || p.project_id) === id);
    if (currentIndex <= 0) return;

    const copy = [...projectsList];
    const [moved] = copy.splice(currentIndex, 1);
    copy.unshift(moved);

    setProjectsList(copy);
    await saveProjectOrder(copy);
    setProjectToast({
      message: `"${moved.title}" pinned to position #1 (Top of Portfolio)!`,
      type: "success",
    });
    setTimeout(() => setProjectToast(null), 3000);
  };

  const handleSortWebFirst = async () => {
    const sorted = [...projectsList].sort((a, b) => {
      const diff = getCategoryPriority(a.category) - getCategoryPriority(b.category);
      if (diff !== 0) return diff;
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });

    setProjectsList(sorted);
    await saveProjectOrder(sorted);
    setProjectToast({
      message: "Projects reorganized: Web Developer First ⭐",
      type: "success",
    });
    setTimeout(() => setProjectToast(null), 3500);
  };

  const handleSyncAllProjectsToSupabase = async () => {
    if (!isSupabaseConfigured || !supabase) {
      alert("Please configure Supabase in .env first.");
      return;
    }
    if (!window.confirm("Sync all default projects into your Supabase database?")) return;

    let successCount = 0;
    for (const p of PROJECTS) {
      const res = await saveLiveProject(p);
      if (res.success) successCount++;
    }
    alert(`Successfully synced ${successCount} projects to Supabase!`);
    await fetchProjects();
  };

  return (
    <div>
      {/* MODE A: PROJECT LIST VIEW */}
      {projectViewMode === "list" ? (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Project Catalog</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage, publish, and showcase your live portfolio applications and case studies
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                disabled={sitemapGenerating}
                onClick={() => handleGenerateSitemap("view")}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-cyan-300 hover:text-white border border-cyan-500/30 hover:border-cyan-500/60 bg-cyan-500/10 hover:bg-cyan-500/20 rounded-xl transition-all cursor-pointer disabled:opacity-50"
                title="Preview generated sitemap XML with all projects"
              >
                {renderIcon(sitemapGenerating ? FaSpinner : FaCode, {
                  size: 11,
                  className: sitemapGenerating ? "animate-spin text-cyan-400" : "text-cyan-400",
                })}
                <span>Sitemap XML</span>
              </button>

              <button
                type="button"
                disabled={sitemapGenerating}
                onClick={() => handleGenerateSitemap("download")}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-300 hover:text-white border border-emerald-500/30 hover:border-emerald-500/60 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-xl transition-all cursor-pointer disabled:opacity-50"
                title="Download latest sitemap.xml containing all projects (A to Z)"
              >
                {renderIcon(FaDownload, { size: 11, className: "text-emerald-400" })}
                <span>Download Sitemap</span>
              </button>

              <button
                type="button"
                onClick={handleSyncAllProjectsToSupabase}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white border border-white/[0.08] hover:border-white/20 bg-white/[0.03] hover:bg-white/[0.06] rounded-xl transition-all cursor-pointer"
                title="Seed all initial projects into your Supabase database"
              >
                {renderIcon(FaDatabase, { size: 11, className: "text-amber-400" })}
                <span>Sync to DB</span>
              </button>

              <button
                onClick={handleOpenCreateProject}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:opacity-95 shadow-md shadow-indigo-500/20 active:scale-95 transition-all cursor-pointer"
              >
                {renderIcon(FaPlus, { size: 11 })}
                <span>Add New Project</span>
              </button>
            </div>
          </div>

          {/* Automated Sitemap & SEO Status Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3.5 rounded-xl border border-cyan-500/20 bg-gradient-to-r from-cyan-950/30 via-indigo-950/20 to-transparent text-xs text-slate-300">
            <div className="flex items-center gap-2.5">
              <span className="flex h-2.5 w-2.5 relative flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
              </span>
              <div>
                <span className="font-semibold text-white">Automated Dynamic Sitemap: </span>
                <span className="text-slate-400">
                  Whenever projects are added/updated, all project URLs (A–Z) are automatically indexed into <code className="text-cyan-300 font-mono">sitemap.xml</code> on every build.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end md:self-center flex-shrink-0">
              <button
                type="button"
                onClick={() => handleGenerateSitemap("copy")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all font-medium text-[11px] cursor-pointer"
              >
                {renderIcon(sitemapCopied ? FaCheck : FaCopy, {
                  size: 10,
                  className: sitemapCopied ? "text-emerald-400" : "text-slate-400",
                })}
                <span>{sitemapCopied ? "XML Copied" : "Copy XML"}</span>
              </button>
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-300 hover:text-cyan-200 border border-white/10 transition-all font-medium text-[11px]"
              >
                {renderIcon(FaExternalLinkAlt, { size: 9 })}
                <span>View Live File</span>
              </a>
            </div>
          </div>

          {/* Project Reorder & Action Toast Notification */}
          {projectToast && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-3.5 rounded-xl text-xs font-semibold flex items-center justify-between shadow-lg ${
                projectToast.type === "success"
                  ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300"
                  : "bg-red-500/15 border border-red-500/30 text-red-300"
              }`}
            >
              <div className="flex items-center gap-2">
                {renderIcon(FaCheckCircle, { className: "h-4 w-4" })}
                <span>{projectToast.message}</span>
              </div>
              <button
                type="button"
                onClick={() => setProjectToast(null)}
                className="text-slate-400 hover:text-white"
              >
                {renderIcon(FaTimes, { className: "h-3 w-3" })}
              </button>
            </motion.div>
          )}

          {/* Search and Category Filters Toolbar */}
          <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
            <div className="relative w-full sm:w-80">
              <span className="absolute left-3.5 top-3 text-slate-500">
                {renderIcon(FaSearch, { size: 12 })}
              </span>
              <input
                type="text"
                value={projectSearch}
                onChange={(e) => setProjectSearch(e.target.value)}
                placeholder="Search projects by title, tech or summary..."
                className="w-full pl-9 pr-8 py-2 text-xs text-white bg-[#0c101d] border border-white/10 rounded-xl focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30 transition-all placeholder:text-slate-500"
              />
              {projectSearch && (
                <button
                  type="button"
                  onClick={() => setProjectSearch("")}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
                >
                  {renderIcon(FaTimes, { size: 12 })}
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: "all", label: "All", count: projectsList.length },
                {
                  id: "web",
                  label: "Web",
                  count: projectsList.filter((p) => (p.category || "").toLowerCase() === "web").length,
                },
                {
                  id: "mobile",
                  label: "Mobile",
                  count: projectsList.filter((p) => (p.category || "").toLowerCase() === "mobile").length,
                },
                {
                  id: "ml",
                  label: "AI & ML",
                  count: projectsList.filter((p) => (p.category || "").toLowerCase() === "ml").length,
                },
                {
                  id: "iot",
                  label: "IoT",
                  count: projectsList.filter((p) => (p.category || "").toLowerCase() === "iot").length,
                },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setProjectCategoryFilter(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    projectCategoryFilter === cat.id
                      ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-semibold shadow-sm"
                      : "text-slate-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06]"
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className="text-[10px] font-mono opacity-70">({cat.count})</span>
                </button>
              ))}

              {/* Web Developer First Preset Button */}
              <button
                type="button"
                onClick={handleSortWebFirst}
                title="Prioritize Web Development projects to the top (#1, #2...) on your portfolio"
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500/20 via-indigo-500/20 to-cyan-500/20 hover:from-amber-500/30 hover:to-indigo-500/30 text-amber-300 border border-amber-500/40 hover:border-amber-400 shadow-sm flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ml-1"
              >
                {renderIcon(FaSortAmountDown, { size: 11, className: "text-amber-400" })}
                <span>Web Dev First ⭐</span>
              </button>
            </div>
          </div>

          {/* Empty state when no projects match */}
          {filteredProjects.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-white/[0.08] bg-[#111726]/60 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.04] text-slate-400 flex items-center justify-center mx-auto">
                {renderIcon(FaFolder, { size: 20 })}
              </div>
              <h3 className="text-sm font-bold text-white">No projects found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {projectSearch || projectCategoryFilter !== "all"
                  ? "No projects matched your search filters. Try adjusting your query or category filter."
                  : "Your catalog currently has no projects. Click 'Add New Project' or 'Sync All to Supabase' to get started."}
              </p>
              {(projectSearch || projectCategoryFilter !== "all") && (
                <button
                  type="button"
                  onClick={() => {
                    setProjectSearch("");
                    setProjectCategoryFilter("all");
                  }}
                  className="px-4 py-2 text-xs font-semibold text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-xl transition-colors cursor-pointer"
                >
                  Reset Filters
                </button>
              )}
            </div>
          ) : (
            /* Projects Table / In-Page Cards */
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
              {filteredProjects.map((project) => {
                const pIndex = projectsList.findIndex(
                  (p) => (p.id || p.project_id) === (project.id || project.project_id)
                );
                const pId = project.id || project.project_id;

                return (
                  <div
                    key={pId}
                    className="p-4 rounded-2xl border border-white/[0.08] bg-[#111726]/70 hover:border-indigo-500/30 flex flex-col justify-between hover:shadow-xl hover:shadow-indigo-500/5 transition-all space-y-4 group"
                  >
                    <div className="space-y-3">
                      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-900 border border-white/10">
                        <img
                          src={toProxyImageUrl(project.image_url || project.image)}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            const fileId = extractGoogleDriveFileId(project.image_url || project.image || "");
                            if (fileId && !e.currentTarget.src.includes("googleusercontent.com")) {
                              e.currentTarget.src = toGoogleDriveDirectUrl(project.image_url || project.image);
                              return;
                            }
                            e.currentTarget.src = "https://placehold.co/600x400/0f172a/cbd5e1?text=Preview";
                          }}
                        />
                        {/* Rank position badge at top-left */}
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-black bg-slate-950/90 backdrop-blur-md border border-white/20 text-cyan-300 shadow-lg">
                            #{pIndex >= 0 ? pIndex + 1 : "?"}
                          </span>
                        </div>
                        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                          {project.featured && (
                            <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-amber-400 text-slate-950 shadow-md">
                              ★ FEATURED
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-950/80 backdrop-blur-md border border-white/10 text-cyan-300 capitalize">
                            {project.category}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-white truncate group-hover:text-indigo-300 transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {project.short_desc || project.shortDescription || project.description}
                        </p>
                      </div>

                      {/* Tech stack tags */}
                      {project.technologies && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {getSelectedTechs(project.technologies).slice(0, 3).map((tech, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/[0.04] border border-white/[0.06] text-slate-300"
                            >
                              {tech}
                            </span>
                          ))}
                          {getSelectedTechs(project.technologies).length > 3 && (
                            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono text-slate-500">
                              +{getSelectedTechs(project.technologies).length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2">
                      {/* Sequence priority reorder controls */}
                      <div className="flex items-center gap-1 bg-white/[0.03] p-1 rounded-xl border border-white/[0.06]">
                        <button
                          type="button"
                          disabled={pIndex <= 0}
                          onClick={() => handleMoveToTop(pId)}
                          title="Pin directly to #1 (Top of Portfolio)"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-amber-400/10 transition-colors disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-slate-400 cursor-pointer"
                        >
                          {renderIcon(FaAngleDoubleUp, { size: 11 })}
                        </button>
                        <button
                          type="button"
                          disabled={pIndex <= 0}
                          onClick={() => handleMoveProject(pId, "up")}
                          title="Move Up (# Higher Priority)"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-cyan-400/10 transition-colors disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-slate-400 cursor-pointer"
                        >
                          {renderIcon(FaArrowUp, { size: 11 })}
                        </button>
                        <button
                          type="button"
                          disabled={pIndex < 0 || pIndex >= projectsList.length - 1}
                          onClick={() => handleMoveProject(pId, "down")}
                          title="Move Down (# Lower Priority)"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-cyan-400/10 transition-colors disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-slate-400 cursor-pointer"
                        >
                          {renderIcon(FaArrowDown, { size: 11 })}
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(project)}
                          className={`text-[11px] px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                            project.featured
                              ? "border-amber-400/40 text-amber-300 bg-amber-400/10 font-medium"
                              : "border-white/10 text-slate-400 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          {project.featured ? "★" : "Feature"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEditProject(project)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 rounded-lg transition-colors cursor-pointer"
                        >
                          {renderIcon(FaEdit, { size: 11 })}
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProject(pId)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title="Delete Project"
                        >
                          {renderIcon(FaTrash, { size: 11 })}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* MODE B: FULL IN-PAGE PROJECT STUDIO */
        <div className="space-y-6">
          {/* Editor Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.08]">
            <div className="flex items-center gap-3.5">
              <button
                type="button"
                onClick={() => setProjectViewMode("list")}
                className="p-2.5 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] text-slate-300 hover:text-white transition-all"
                title="Back to Projects Catalog"
              >
                {renderIcon(FaArrowLeft, { size: 14 })}
              </button>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-semibold uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">
                    {editingProjectId ? "STUDIO • EDIT MODE" : "STUDIO • NEW DRAFT"}
                  </span>
                  {editingProjectId && (
                    <span className="text-[11px] font-mono text-slate-500">
                      ID: {editingProjectId}
                    </span>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {editingProjectId ? (projectForm.title || "Edit Project Details") : "Create New Project"}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Fine-tune project identity, technologies, narrative, and deliverables with real-time preview.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setProjectViewMode("list")}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={projectSaving}
                onClick={() => handleSaveProject()}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:opacity-95 shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
              >
                {projectSaving ? (
                  renderIcon(FaSpinner, { className: "animate-spin", size: 13 })
                ) : (
                  renderIcon(FaSave, { size: 13 })
                )}
                <span>{projectSaving ? "Saving to Cloud..." : "Save to Database"}</span>
              </button>
            </div>
          </div>

          {/* Toast notification banner */}
          {projectToast && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3.5 rounded-2xl border text-xs flex items-center gap-3 ${
                projectToast.type === "success"
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                  : "bg-rose-500/10 border-rose-500/30 text-rose-300"
              }`}
            >
              {renderIcon(FaCheckCircle, { size: 16 })}
              <span className="font-medium">{projectToast.message}</span>
            </motion.div>
          )}

          {uploadStatus && (
            <div className="p-3.5 text-xs text-cyan-300 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center gap-2.5">
              {renderIcon(FaSpinner, { className: "animate-spin shrink-0", size: 13 })}
              <span className="font-medium">{uploadStatus}</span>
            </div>
          )}

          <StorageRlsBanner
            storageRlsError={storageRlsError}
            onDismiss={() => setStorageRlsError(null)}
          />

          {/* 2-Column Studio Grid: Left Form (7 cols), Right Sticky Live Preview (5 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Input Form (7 cols) */}
            <form onSubmit={handleSaveProject} className="lg:col-span-7 space-y-6 text-xs">
              {/* CARD 1: Core Identity & Category */}
              <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#111726]/75 backdrop-blur-sm space-y-5 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs font-mono">
                      1
                    </span>
                    <h3 className="text-xs font-bold text-white tracking-wider uppercase font-mono">
                      Project Identity &amp; Category
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                    Core Metadata
                  </span>
                </div>

                {/* Title */}
                <div>
                  <label className="block font-semibold text-slate-200 mb-1.5 text-xs">
                    Project Title <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    placeholder="e.g. AI Financial Forecaster & Risk Analysis SaaS"
                    className="w-full px-4 py-2.5 text-xs text-white bg-[#0c101d] border border-white/[0.08] rounded-xl focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all font-medium placeholder:text-slate-500"
                  />
                </div>

                {/* Visual Category Selector */}
                <div>
                  <label className="block font-semibold text-slate-200 mb-2 text-xs">
                    Select Category <span className="text-rose-400">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {PROJECT_CATEGORIES.map((cat) => {
                      const isSelected = projectForm.category === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setProjectForm({ ...projectForm, category: cat.id })}
                          className={`p-3.5 rounded-xl border text-left transition-all relative cursor-pointer ${
                            isSelected
                              ? "border-indigo-500/60 bg-indigo-500/10 shadow-sm ring-1 ring-indigo-500/30"
                              : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.12]"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2.5">
                              <div className={`p-2 rounded-lg ${cat.badge}`}>
                                {renderIcon(cat.icon, { size: 14 })}
                              </div>
                              <div>
                                <div className="font-bold text-white text-xs">{cat.name}</div>
                                <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                                  {cat.desc}
                                </div>
                              </div>
                            </div>
                            {isSelected && (
                              <span className="p-1 rounded-full bg-cyan-400 text-slate-950">
                                {renderIcon(FaCheck, { size: 9 })}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Featured Project Switch */}
                <div
                  className="p-3.5 rounded-xl border border-white/[0.08] bg-[#0c101d]/60 hover:bg-[#0c101d] transition-colors flex items-center justify-between cursor-pointer"
                  onClick={() => setProjectForm({ ...projectForm, featured: !projectForm.featured })}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        projectForm.featured
                          ? "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                          : "bg-white/5 text-slate-400"
                      }`}
                    >
                      {renderIcon(FaStar, { size: 14 })}
                    </div>
                    <div>
                      <div className="font-bold text-white text-xs flex items-center gap-2">
                        <span>Feature on Portfolio Showcase</span>
                        {projectForm.featured && (
                          <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                            FEATURED
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Displays prominently with a highlighted badge on the homepage hero and top of the showcase.
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={projectForm.featured}
                    onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                    onClick={(e) => e.stopPropagation()}
                    className="w-4 h-4 rounded text-indigo-600 bg-white/10 border-white/20 focus:ring-0 cursor-pointer"
                  />
                </div>
              </div>

              {/* CARD 2: Technology Stack Studio */}
              <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#111726]/75 backdrop-blur-sm space-y-5 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs font-mono">
                      2
                    </span>
                    <div className="flex items-center gap-2">
                      {renderIcon(FaTags, { className: "text-indigo-400", size: 13 })}
                      <h3 className="text-xs font-bold text-white tracking-wider uppercase font-mono">
                        Technology Stack Studio
                      </h3>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">
                    {getSelectedTechs(projectForm.technologies).length} Selected
                  </span>
                </div>

                {/* Active Selected Tech Pills Container */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">
                      Active Technologies in this Project:
                    </span>
                    {getSelectedTechs(projectForm.technologies).length > 0 && (
                      <button
                        type="button"
                        onClick={() => setProjectForm({ ...projectForm, technologies: "" })}
                        className="text-[11px] text-rose-400 hover:text-rose-300 transition-colors"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  <div className="min-h-[52px] p-3 rounded-xl border border-white/[0.08] bg-[#0c101d] flex flex-wrap items-center gap-2">
                    {getSelectedTechs(projectForm.technologies).length === 0 ? (
                      <p className="text-xs text-slate-500 italic flex items-center gap-2">
                        {renderIcon(FaLightbulb, { size: 12 })}
                        <span>No technologies added yet. Click suggestions below, use 1-click presets, or type your own!</span>
                      </p>
                    ) : (
                      getSelectedTechs(projectForm.technologies).map((tag) => (
                        <span
                          key={tag}
                          className="group inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg bg-indigo-500/15 border border-indigo-500/40 text-indigo-200 shadow-sm transition-all"
                        >
                          <span>{tag}</span>
                          <button
                            type="button"
                            onClick={() => removeTechTag(tag)}
                            className="p-0.5 rounded hover:bg-rose-500/20 text-indigo-300 hover:text-rose-400 transition-colors"
                            title={`Remove ${tag}`}
                          >
                            {renderIcon(FaTimes, { size: 10 })}
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {/* Custom Technology Input with Enter or Button */}
                <div className="space-y-1.5">
                  <label className="block font-semibold text-slate-200 text-xs">
                    Add Custom Technology Tag:
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={customTechInput}
                        onChange={(e) => setCustomTechInput(e.target.value)}
                        onKeyDown={handleCustomTechKeyDown}
                        placeholder="Type any technology and press Enter (e.g. GraphQL, Tailwind, Redis, FastAPI)..."
                        className="w-full pl-9 pr-3.5 py-2 text-xs text-white bg-[#0c101d] border border-white/[0.08] rounded-xl focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all placeholder:text-slate-500"
                      />
                      <span className="absolute left-3 top-2.5 text-slate-500">
                        {renderIcon(FaCode, { size: 12 })}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (customTechInput.trim()) {
                          addCustomTechTag(customTechInput);
                          setCustomTechInput("");
                        }
                      }}
                      className="px-4 py-2 text-xs font-semibold text-white rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] transition-all active:scale-95"
                    >
                      + Add Tag
                    </button>
                  </div>
                </div>

                {/* 1-Click Popular Stack Presets */}
                <div className="p-3.5 rounded-xl border border-white/[0.06] bg-[#0c101d]/60 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300">
                    {renderIcon(FaMagic, { size: 12 })}
                    <span>1-Click Popular Stack Presets (Click to append):</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {STACK_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => applyStackPreset(preset.techs)}
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border bg-gradient-to-r ${preset.badgeColor} hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer`}
                        title={`Appends: ${preset.techs.join(", ")}`}
                      >
                        {renderIcon(preset.icon, { size: 11 })}
                        <span>+ {preset.name}</span>
                        <span className="text-[10px] opacity-70">({preset.techs.length})</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Technology Suggestions Matrix */}
                <div className="space-y-3 pt-2 border-t border-white/[0.06]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 font-semibold text-slate-200 text-xs">
                      {renderIcon(FaLightbulb, { className: "text-amber-400", size: 12 })}
                      <span>Curated Technology Suggestions (Click chip to toggle):</span>
                    </div>

                    {/* Search filter for suggestions */}
                    <div className="relative w-full sm:w-48">
                      <input
                        type="text"
                        value={techSearchQuery}
                        onChange={(e) => setTechSearchQuery(e.target.value)}
                        placeholder="Filter suggestions..."
                        className="w-full pl-7 pr-3 py-1 text-[11px] text-white bg-[#0c101d] border border-white/[0.08] rounded-lg focus:outline-none focus:border-indigo-500/60 placeholder:text-slate-500"
                      />
                      <span className="absolute left-2.5 top-1.5 text-slate-500">
                        {renderIcon(FaSearch, { size: 10 })}
                      </span>
                      {techSearchQuery && (
                        <button
                          type="button"
                          onClick={() => setTechSearchQuery("")}
                          className="absolute right-2 top-1.5 text-slate-400 hover:text-white"
                        >
                          {renderIcon(FaTimes, { size: 10 })}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Category Filter Pills */}
                  <div className="flex flex-wrap gap-1.5 pb-1">
                    {[
                      { id: "all", label: "All" },
                      { id: "frontend", label: "Frontend" },
                      { id: "backend", label: "Backend" },
                      { id: "db_cloud", label: "DB & Cloud" },
                      { id: "ai_ml", label: "AI & ML" },
                      { id: "mobile", label: "Mobile" },
                      { id: "iot", label: "IoT & Hardware" },
                      { id: "tools", label: "Tools & DevOps" },
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setTechCategoryFilter(f.id)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all cursor-pointer ${
                          techCategoryFilter === f.id
                            ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/40 font-semibold"
                            : "bg-white/[0.03] text-slate-400 border-white/[0.06] hover:bg-white/[0.08] hover:text-slate-200"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  {/* Filtered suggestions list */}
                  <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto pr-1 p-1">
                    {TECH_SUGGESTIONS.filter((item) => {
                      const matchesCat =
                        techCategoryFilter === "all" || item.category === techCategoryFilter;
                      const matchesQuery =
                        !techSearchQuery || item.name.toLowerCase().includes(techSearchQuery.toLowerCase());
                      return matchesCat && matchesQuery;
                    }).map((item) => {
                      const isAlreadySelected = getSelectedTechs(projectForm.technologies).some(
                        (t) => t.toLowerCase() === item.name.toLowerCase()
                      );
                      return (
                        <button
                          key={item.name}
                          type="button"
                          onClick={() => toggleTechTag(item.name)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer active:scale-95 ${
                            isAlreadySelected
                              ? "bg-indigo-500/20 text-indigo-200 border-indigo-400/50 shadow-sm shadow-indigo-500/20 ring-1 ring-indigo-400/30"
                              : "bg-white/[0.03] text-slate-300 border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.15] hover:text-white"
                          }`}
                          title={isAlreadySelected ? `Remove ${item.name}` : `Add ${item.name}`}
                        >
                          {isAlreadySelected ? (
                            renderIcon(FaCheck, { size: 10, className: "text-indigo-400" })
                          ) : (
                            <span className="text-slate-500 text-xs font-bold">+</span>
                          )}
                          <span>{item.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* CARD 3: Narrative & Case Study */}
              <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#111726]/75 backdrop-blur-sm space-y-5 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs font-mono">
                      3
                    </span>
                    <h3 className="text-xs font-bold text-white tracking-wider uppercase font-mono">
                      Project Narrative &amp; Breakdown
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                    Descriptions
                  </span>
                </div>

                {/* Short Description */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-semibold text-slate-200 text-xs">
                      Short Description (Shown on Main Card) <span className="text-rose-400">*</span>
                    </label>
                    <span className="text-[10px] font-mono text-slate-400">
                      {projectForm.short_desc.length} chars
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    value={projectForm.short_desc}
                    onChange={(e) => setProjectForm({ ...projectForm, short_desc: e.target.value })}
                    placeholder="Brief 1-2 sentence compelling hook of what this project does and who it helps"
                    className="w-full px-4 py-2.5 text-xs text-white bg-[#0c101d] border border-white/[0.08] rounded-xl focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all placeholder:text-slate-500"
                  />
                </div>

                {/* Full Detailed Description */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-semibold text-slate-200 text-xs">
                      Full Case Study Description
                    </label>
                    <span className="text-[10px] font-mono text-slate-400">
                      Shown in detail modal &amp; case study view
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    value={projectForm.full_desc}
                    onChange={(e) => setProjectForm({ ...projectForm, full_desc: e.target.value })}
                    placeholder="Comprehensive architectural overview: what problem this solves, architectural decisions, data flow, performance optimizations, and quantifiable impact."
                    className="w-full px-4 py-2.5 text-xs text-white bg-[#0c101d] border border-white/[0.08] rounded-xl focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all font-sans leading-relaxed placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* CARD 4: Key Deliverables & Architecture Features */}
              <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#111726]/75 backdrop-blur-sm space-y-4 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs font-mono">
                      4
                    </span>
                    <div className="flex items-center gap-2">
                      {renderIcon(FaListUl, { className: "text-emerald-400", size: 12 })}
                      <h3 className="text-xs font-bold text-white tracking-wider uppercase font-mono">
                        Key Deliverables &amp; Features
                      </h3>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                    {getFeatureList(projectForm.features).length} Features
                  </span>
                </div>

                <p className="text-[11px] text-slate-400">
                  Enter one feature per line. These will render as structured bullet points with checkmark icons on the project detail modal.
                </p>

                <textarea
                  rows={4}
                  value={projectForm.features}
                  onChange={(e) => setProjectForm({ ...projectForm, features: e.target.value })}
                  placeholder={"JWT Authentication & Role-based Permissions\nStripe Payment Gateway Integration\nReal-time Telemetry WebSocket Stream\nAutomated CI/CD Pipeline with Docker"}
                  className="w-full px-4 py-2.5 text-xs text-white bg-[#0c101d] border border-white/[0.08] rounded-xl focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all font-mono leading-relaxed placeholder:text-slate-500"
                />
              </div>

              {/* CARD 5: Media & Deployment URLs */}
              <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#111726]/75 backdrop-blur-sm space-y-5 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs font-mono">
                      5
                    </span>
                    <h3 className="text-xs font-bold text-white tracking-wider uppercase font-mono">
                      Media Assets &amp; Production Links
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                    Assets &amp; URLs
                  </span>
                </div>

                {/* Project Image */}
                <div className="space-y-2.5">
                  <label className="block font-semibold text-slate-200 text-xs">
                    Project Cover Image URL
                  </label>
                  <input
                    type="text"
                    value={projectForm.image_url}
                    onChange={(e) => setProjectForm({ ...projectForm, image_url: e.target.value })}
                    placeholder="https://images.unsplash.com/... or Google Drive share link"
                    className="w-full px-4 py-2.5 text-xs text-white bg-[#0c101d] border border-white/[0.08] rounded-xl focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all placeholder:text-slate-500"
                  />

                  {/* Google Drive Link Auto-Detection Helper Badge */}
                  {extractGoogleDriveFileId(projectForm.image_url) && (
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-[11px]">
                      {renderIcon(FaCheckCircle, { size: 13, className: "text-emerald-400 shrink-0" })}
                      <span>
                        <strong>Google Drive Image detected:</strong> Automatically converted for instant live preview and portfolio display.
                      </span>
                    </div>
                  )}

                  {/* Quick 1-click Preset Cover Images */}
                  <div className="p-3 rounded-xl border border-white/[0.06] bg-[#0c101d]/60 space-y-2">
                    <span className="text-[11px] font-semibold text-slate-400">
                      Quick Preset Cover Images (Click to apply):
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {PRESET_COVERS.map((cov) => (
                        <button
                          key={cov.name}
                          type="button"
                          onClick={() => setProjectForm({ ...projectForm, image_url: cov.url })}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-lg bg-white/[0.04] hover:bg-indigo-500/20 border border-white/[0.08] hover:border-indigo-500/40 text-slate-300 hover:text-indigo-200 transition-all cursor-pointer"
                        >
                          <span>{cov.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* File upload */}
                  <div className="flex flex-col gap-2 pt-1">
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500 font-mono text-[10px]">OR UPLOAD IMAGE FILE:</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, "project")}
                        className="text-[11px] text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:bg-white/[0.08] file:text-white hover:file:bg-white/[0.15] cursor-pointer"
                      />
                    </div>
                    {storageRlsError && (
                      <p className="text-[11px] text-amber-300 flex items-center gap-1.5">
                        {renderIcon(FaExclamationTriangle, { size: 11, className: "text-amber-400 shrink-0" })}
                        <span>
                          Supabase Storage RLS blocked cloud upload. Loaded as local image preview. Run SQL fix below to enable Supabase Cloud storage.
                        </span>
                      </p>
                    )}
                  </div>
                </div>

                {/* GitHub & Live URL */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block font-semibold text-slate-200 mb-1 flex items-center gap-1.5 text-xs">
                      {renderIcon(FaGithub, { size: 12 })}
                      <span>GitHub Repository URL</span>
                    </label>
                    <input
                      type="text"
                      value={projectForm.github_url}
                      onChange={(e) => setProjectForm({ ...projectForm, github_url: e.target.value })}
                      placeholder="https://github.com/your-username/repo"
                      className="w-full px-3.5 py-2 text-xs text-white bg-[#0c101d] border border-white/[0.08] rounded-xl focus:outline-none focus:border-indigo-500/60 transition-all placeholder:text-slate-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-200 mb-1 flex items-center gap-1.5 text-xs">
                      {renderIcon(FaGlobe, { size: 12 })}
                      <span>Live Deployment / Demo URL</span>
                    </label>
                    <input
                      type="text"
                      value={projectForm.live_url}
                      onChange={(e) => setProjectForm({ ...projectForm, live_url: e.target.value })}
                      placeholder="https://my-app.vercel.app"
                      className="w-full px-3.5 py-2 text-xs text-white bg-[#0c101d] border border-white/[0.08] rounded-xl focus:outline-none focus:border-indigo-500/60 transition-all placeholder:text-slate-500"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Save & Cancel Bar */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setProjectViewMode("list")}
                  className="px-5 py-2.5 text-xs font-semibold text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={projectSaving}
                  className="inline-flex items-center gap-2 px-7 py-2.5 text-xs font-bold text-white rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:opacity-95 shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
                >
                  {projectSaving ? (
                    renderIcon(FaSpinner, { className: "animate-spin", size: 13 })
                  ) : (
                    renderIcon(FaSave, { size: 13 })
                  )}
                  <span>{projectSaving ? "Saving..." : "Save Project to Supabase"}</span>
                </button>
              </div>
            </form>

            {/* Right: Live Interactive Card Preview (5 cols, sticky) */}
            <div className="lg:col-span-5 sticky top-2 space-y-4">
              {/* Preview Studio Header & View Switcher */}
              <div className="p-3.5 rounded-2xl border border-white/[0.08] bg-[#111726]/85 backdrop-blur-sm flex items-center justify-between shadow-xl">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                    Live Studio Preview
                  </span>
                </div>
                <div className="flex items-center p-0.5 rounded-xl bg-[#0c101d] border border-white/[0.08] text-[11px]">
                  <button
                    type="button"
                    onClick={() => setStudioPreviewTab("card")}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                      studioPreviewTab === "card"
                        ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Card View
                  </button>
                  <button
                    type="button"
                    onClick={() => setStudioPreviewTab("casestudy")}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                      studioPreviewTab === "casestudy"
                        ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Case Study
                  </button>
                </div>
              </div>

              {/* PREVIEW TAB 1: Grid Card View */}
              {studioPreviewTab === "card" && (
                <div className="rounded-2xl border border-white/[0.08] bg-[#111726]/90 p-5 shadow-xl space-y-4 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl -z-0 pointer-events-none" />

                  {/* Image preview */}
                  <div className="aspect-video rounded-xl overflow-hidden bg-[#0c101d] relative border border-white/[0.08] shadow-inner">
                    <img
                      src={
                        toProxyImageUrl(projectForm.image_url) ||
                        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"
                      }
                      alt="Preview"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        const fileId = extractGoogleDriveFileId(projectForm.image_url);
                        if (fileId && !e.currentTarget.src.includes("googleusercontent.com")) {
                          e.currentTarget.src = toGoogleDriveDirectUrl(projectForm.image_url);
                          return;
                        }
                        e.currentTarget.src = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80";
                      }}
                    />
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      {projectForm.featured && (
                        <span className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-amber-500/90 text-slate-950 shadow-md flex items-center gap-1">
                          {renderIcon(FaStar, { size: 9 })}
                          <span>Featured</span>
                        </span>
                      )}
                      <span className="px-2.5 py-1 text-[10px] font-semibold rounded-lg bg-[#090d16]/80 backdrop-blur-md border border-white/15 text-indigo-200 capitalize">
                        {PROJECT_CATEGORIES.find((c) => c.id === projectForm.category)?.name || projectForm.category}
                      </span>
                    </div>
                  </div>

                  {/* Title & Short Description */}
                  <div className="space-y-1.5">
                    <h3 className="text-base font-bold text-white tracking-tight">
                      {projectForm.title || "Your Project Title Will Appear Here"}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                      {projectForm.short_desc || "Your short project overview summary will appear right here..."}
                    </p>
                  </div>

                  {/* Technologies preview chips */}
                  <div className="pt-3 border-t border-white/[0.06] space-y-1.5">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                      Tech Stack ({getSelectedTechs(projectForm.technologies).length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {getSelectedTechs(projectForm.technologies).length > 0 ? (
                        getSelectedTechs(projectForm.technologies).slice(0, 6).map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-0.5 rounded-lg text-[10px] font-semibold bg-indigo-500/10 border border-indigo-500/30 text-indigo-300"
                          >
                            {tech}
                          </span>
                        ))
                      ) : (
                        <span className="text-[11px] text-slate-500 italic">
                          No technologies added yet
                        </span>
                      )}
                      {getSelectedTechs(projectForm.technologies).length > 6 && (
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-white/[0.04] border border-white/[0.08] text-slate-400">
                          +{getSelectedTechs(projectForm.technologies).length - 6} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action links buttons */}
                  <div className="flex items-center gap-2 pt-2">
                    <div className="flex-1 py-2 text-center text-xs font-semibold rounded-xl bg-white/[0.06] border border-white/[0.08] text-white flex items-center justify-center gap-2 opacity-90">
                      {renderIcon(FaExternalLinkAlt, { size: 10 })}
                      <span>Live Preview</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-300 flex items-center justify-center opacity-90">
                      {renderIcon(FaGithub, { size: 14 })}
                    </div>
                  </div>
                </div>
              )}

              {/* PREVIEW TAB 2: Full Case Study Modal Preview */}
              {studioPreviewTab === "casestudy" && (
                <div className="rounded-2xl border border-white/[0.08] bg-[#111726]/90 p-5 shadow-xl space-y-4 max-h-[580px] overflow-y-auto">
                  <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                    <span className="text-[11px] font-mono text-indigo-400 font-bold uppercase tracking-wider">
                      Case Study Detailed Preview
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/[0.06] text-slate-300 capitalize">
                      {projectForm.category}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {projectForm.title || "Untitled Project"}
                  </h3>

                  {/* Case Study Image */}
                  <div className="aspect-video rounded-xl overflow-hidden bg-[#0c101d] relative border border-white/[0.08]">
                    <img
                      src={
                        toProxyImageUrl(projectForm.image_url) ||
                        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"
                      }
                      alt="Case study"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const fileId = extractGoogleDriveFileId(projectForm.image_url);
                        if (fileId && !e.currentTarget.src.includes("googleusercontent.com")) {
                          e.currentTarget.src = toGoogleDriveDirectUrl(projectForm.image_url);
                          return;
                        }
                        e.currentTarget.src = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80";
                      }}
                    />
                  </div>

                  {/* Overview section */}
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wide">
                      Overview &amp; Architecture
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {projectForm.full_desc || projectForm.short_desc || "No full description provided yet."}
                    </p>
                  </div>

                  {/* Features list */}
                  {getFeatureList(projectForm.features).length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                      <h4 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wide">
                        Key Deliverables
                      </h4>
                      <ul className="space-y-1.5">
                        {getFeatureList(projectForm.features).map((feat, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                            <span className="text-emerald-400 mt-0.5">
                              {renderIcon(FaCheckCircle, { size: 12 })}
                            </span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Tech stack full view */}
                  <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                    <h4 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wide">
                      Technologies &amp; Tools Used
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {getSelectedTechs(projectForm.technologies).map((t, i) => (
                        <span key={i} className="px-2.5 py-0.5 rounded-lg text-xs font-medium bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Publication Health Checklist Card */}
              <div className="p-4 rounded-2xl border border-white/[0.08] bg-[#111726]/75 space-y-2.5 text-xs shadow-xl">
                <span className="font-mono uppercase font-bold text-slate-400 text-[11px] tracking-wider">
                  Publication Quality Checklist
                </span>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Project Title Provided</span>
                    <span className={projectForm.title.trim() ? "text-emerald-400 font-bold" : "text-slate-600"}>
                      {projectForm.title.trim() ? "✓ Ready" : "Missing"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Short Description Added</span>
                    <span className={projectForm.short_desc.trim() ? "text-emerald-400 font-bold" : "text-slate-600"}>
                      {projectForm.short_desc.trim() ? "✓ Ready" : "Missing"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Technology Tags</span>
                    <span className={getSelectedTechs(projectForm.technologies).length > 0 ? "text-indigo-400 font-bold" : "text-slate-600"}>
                      {getSelectedTechs(projectForm.technologies).length} tags
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Key Features Specified</span>
                    <span className={getFeatureList(projectForm.features).length > 0 ? "text-emerald-400 font-bold" : "text-slate-500"}>
                      {getFeatureList(projectForm.features).length} points
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Cover Image Asset</span>
                    <span className={projectForm.image_url ? "text-emerald-400 font-bold" : "text-amber-400"}>
                      {projectForm.image_url ? "✓ Configured" : "Default Used"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ProjectsTab;
