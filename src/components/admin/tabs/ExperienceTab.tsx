import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBriefcase,
  FaPlus,
  FaTimes,
  FaSpinner,
  FaSave,
  FaEdit,
  FaTrash,
  FaArrowUp,
  FaArrowDown,
  FaEye,
  FaEyeSlash,
  FaUndo,
  FaBuilding,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaGlobe,
  FaExternalLinkAlt,
} from "react-icons/fa";
import {
  saveLiveExperience,
  useExperienceConfig,
  saveExperienceConfig,
  resetExperienceDefaults,
} from "../../../lib/portfolioService";
import { ExperienceItem, getCompanyLogoUrl } from "../../../data/portfolioData";
import { renderIcon, getFeatureList, AdminToast } from "../types";

interface ExperienceTabProps {
  experienceList: ExperienceItem[];
  setExperienceList: React.Dispatch<React.SetStateAction<ExperienceItem[]>>;
}

export const ExperienceTab: React.FC<ExperienceTabProps> = ({
  experienceList,
  setExperienceList,
}) => {
  const config = useExperienceConfig();
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<AdminToast | null>(null);

  // Section Header local form state
  const [badge, setBadge] = useState(config.badge);
  const [title, setTitle] = useState(config.title);
  const [subtitle, setSubtitle] = useState(config.subtitle);
  const [isSavingHeader, setIsSavingHeader] = useState(false);

  // In-Page Experience Editor state (No Dialog/Modal, following Academic Degree Programs)
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [form, setForm] = useState({
    role: "",
    company: "",
    companyUrl: "",
    location: "",
    period: "",
    employmentType: "Full-time",
    description: "",
    technologies: "",
    highlights: "",
    isActive: true,
  });

  useEffect(() => {
    setBadge(config.badge);
    setTitle(config.title);
    setSubtitle(config.subtitle);
  }, [config.badge, config.title, config.subtitle]);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Master Section Active / Inactive Toggle
  const handleToggleMasterActive = async () => {
    const nextStatus = !config.isActive;
    try {
      await saveExperienceConfig({ isActive: nextStatus });
      showToast(
        nextStatus
          ? "Experience section is now LIVE and visible on the website!"
          : "Experience section is now HIDDEN (Inactive) from the website."
      );
    } catch (err: any) {
      showToast(err.message || "Failed to update section status", "error");
    }
  };

  // Save Section Headers
  const handleSaveHeaders = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingHeader(true);
    try {
      await saveExperienceConfig({
        badge: badge.trim(),
        title: title.trim(),
        subtitle: subtitle.trim(),
      });
      showToast("Section titles & badge updated successfully!");
    } catch (err: any) {
      showToast(err.message || "Failed to update section titles", "error");
    } finally {
      setIsSavingHeader(false);
    }
  };

  // Open In-Page Form for Add
  const handleOpenAdd = () => {
    setEditingIndex(null);
    setIsAdding(true);
    setForm({
      role: "",
      company: "",
      companyUrl: "",
      location: "Dhaka, Bangladesh",
      period: "2024 - Present",
      employmentType: "Full-time",
      description: "",
      technologies: "",
      highlights: "",
      isActive: true,
    });
  };

  // Open In-Page Form for Edit
  const handleOpenEdit = (idx: number) => {
    const item = experienceList[idx];
    if (!item) return;
    setIsAdding(false);
    setEditingIndex(idx);
    setForm({
      role: item.role || "",
      company: item.company || "",
      companyUrl: item.companyUrl || "",
      location: item.location || "",
      period: item.period || "",
      employmentType: item.employmentType || "Full-time",
      description: item.description || "",
      technologies: Array.isArray(item.technologies) ? item.technologies.join(", ") : "",
      highlights: Array.isArray(item.highlights) ? item.highlights.join("\n") : "",
      isActive: item.isActive !== false,
    });
  };

  const handleCancelForm = () => {
    setIsAdding(false);
    setEditingIndex(null);
  };

  // Save Experience (Add or Edit)
  const handleSaveExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.role.trim() || !form.company.trim()) {
      alert("Please provide both Job Role and Company / Organization name.");
      return;
    }

    const techArray = form.technologies
      ? form.technologies
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

    const newExpItem: ExperienceItem = {
      role: form.role.trim(),
      company: form.company.trim(),
      companyUrl: form.companyUrl.trim() || undefined,
      location: form.location.trim(),
      period: form.period.trim() || "2024 - Present",
      employmentType: form.employmentType.trim() || "Full-time",
      description: form.description.trim(),
      technologies: techArray,
      highlights: getFeatureList(form.highlights),
      isActive: form.isActive,
    };

    let updatedList: ExperienceItem[];
    if (editingIndex !== null && editingIndex >= 0) {
      updatedList = [...experienceList];
      updatedList[editingIndex] = { ...experienceList[editingIndex], ...newExpItem };
    } else {
      updatedList = [newExpItem, ...experienceList];
    }

    setExperienceList(updatedList);
    setIsAdding(false);
    setEditingIndex(null);
    setSaving(true);

    try {
      const res = await saveLiveExperience(updatedList);
      showToast(
        res.error
          ? `Saved locally! (Sync note: ${res.error})`
          : "Career role saved and synced successfully!"
      );
    } catch (err: any) {
      showToast("Failed to save experience: " + err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  // Toggle individual item active/inactive
  const handleToggleItemActive = async (idx: number) => {
    const item = experienceList[idx];
    if (!item) return;

    const updated = [...experienceList];
    const newStatus = item.isActive === false ? true : false;
    updated[idx] = { ...item, isActive: newStatus };

    setExperienceList(updated);
    setSaving(true);
    try {
      await saveLiveExperience(updated);
      showToast(
        `"${item.role}" is now ${newStatus ? "ACTIVE (visible)" : "INACTIVE (hidden)"}.`
      );
    } catch (err: any) {
      showToast("Failed to update status: " + err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  // Move item up / down in timeline order
  const handleMoveItem = async (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= experienceList.length) return;

    const updated = [...experienceList];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIdx, 0, moved);

    setExperienceList(updated);
    setSaving(true);
    try {
      await saveLiveExperience(updated);
      showToast("Timeline order updated!");
    } catch (err: any) {
      showToast("Failed to reorder: " + err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  // Delete Experience
  const handleDeleteItem = async (idx: number) => {
    const item = experienceList[idx];
    if (!window.confirm(`Are you sure you want to delete "${item?.role} at ${item?.company}"?`)) {
      return;
    }

    const updated = experienceList.filter((_, i) => i !== idx);
    setExperienceList(updated);
    setSaving(true);
    try {
      await saveLiveExperience(updated);
      showToast("Experience record deleted successfully!");
    } catch (err: any) {
      showToast("Failed to delete experience: " + err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  // Reset to Defaults
  const handleResetDefaults = async () => {
    if (
      !window.confirm(
        "Reset Experience section to default demo data and configuration? Any custom entries will be overwritten."
      )
    ) {
      return;
    }

    setSaving(true);
    try {
      const res = await resetExperienceDefaults();
      setExperienceList(res.items);
      setBadge(res.config.badge);
      setTitle(res.config.title);
      setSubtitle(res.config.subtitle);
      showToast("Experience section restored to defaults!");
    } catch (err: any) {
      showToast("Failed to reset: " + err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  // Preview logo for current form companyUrl
  const liveFormLogo = form.companyUrl ? getCompanyLogoUrl(form.companyUrl) : "";

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 rounded-xl text-sm font-medium border shadow-lg flex items-center justify-between ${
              toast.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                : "bg-red-500/10 border-red-500/30 text-red-300"
            }`}
          >
            <span>{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="ml-4 hover:opacity-75 text-slate-400 hover:text-white"
            >
              {renderIcon(FaTimes)}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MASTER SECTION CONTROLS (Active / Inactive Toggle) */}
      <div className="p-6 rounded-2xl bg-[#0b1120]/80 border border-white/10 backdrop-blur-xl shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className={`p-3.5 rounded-xl border ${
                config.isActive
                  ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-lg shadow-cyan-500/10"
                  : "bg-slate-800 border-white/10 text-slate-500"
              }`}
            >
              {renderIcon(FaBriefcase, { size: 22 })}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="text-lg font-bold text-white">Experience Section</h3>
                <span
                  className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${
                    config.isActive
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                      : "bg-rose-500/20 text-rose-300 border-rose-500/30"
                  }`}
                >
                  {config.isActive ? "● LIVE / ACTIVE" : "○ HIDDEN / INACTIVE"}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-400">
                Turn the entire Experience section ON or OFF on the public portfolio homepage.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <button
              type="button"
              onClick={handleToggleMasterActive}
              className={`relative inline-flex h-7 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                config.isActive ? "bg-cyan-500" : "bg-slate-700"
              }`}
              role="switch"
              aria-checked={config.isActive}
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  config.isActive ? "translate-x-7" : "translate-x-0"
                }`}
              />
            </button>
            <span className="text-sm font-semibold text-slate-300 min-w-[70px]">
              {config.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </div>

      {/* SECTION HEADERS CUSTOMIZER */}
      <div className="p-6 rounded-2xl bg-[#0b1120]/80 border border-white/10 backdrop-blur-xl shadow-xl">
        <h3 className="text-md font-bold text-white mb-1">Section Titles &amp; Heading</h3>
        <p className="text-xs text-slate-400 mb-4">
          Customize the badge tag, headline, and subtitle description for the Experience section.
        </p>

        <form onSubmit={handleSaveHeaders} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Badge / Pre-heading
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g. Career Trajectory"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Main Section Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Professional Experience"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Subtitle Description
            </label>
            <textarea
              rows={2}
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. A proven track record of engineering scalable web systems..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500/50 resize-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSavingHeader}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors shadow-lg shadow-cyan-500/20 disabled:opacity-50"
            >
              {isSavingHeader
                ? renderIcon(FaSpinner, { className: "animate-spin" })
                : renderIcon(FaSave)}
              Save Section Headers
            </button>
          </div>
        </form>
      </div>

      {/* EXPERIENCE ITEMS MANAGEMENT (CAREER HISTORY & ROLES) */}
      <div className="p-6 rounded-2xl bg-[#0b1120]/80 border border-white/10 backdrop-blur-xl shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-white/10">
          <div>
            <h3 className="text-md font-bold text-white flex items-center gap-2">
              <span>Career History &amp; Roles</span>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                {experienceList.length} total
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Manage, reorder, or toggle individual roles. Company website link auto-detects official company logos.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetDefaults}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-colors"
              title="Reset to defaults"
            >
              {renderIcon(FaUndo, { size: 11 })}
              <span className="hidden sm:inline">Reset</span>
            </button>
            <button
              type="button"
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:opacity-90 text-white transition-opacity shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              {renderIcon(FaPlus, { size: 11 })}
              + Add Experience
            </button>
          </div>
        </div>

        {/* In-Page Add / Edit Career History & Role Form (No Modal/Dialog, following Academic Degree Programs) */}
        {(isAdding || editingIndex !== null) && (
          <motion.form
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSaveExperience}
            className="p-6 rounded-2xl border border-cyan-500/30 bg-[#0d1527]/95 shadow-2xl space-y-4 text-xs backdrop-blur-md"
          >
            <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  {renderIcon(editingIndex !== null ? FaEdit : FaPlus, { size: 12 })}
                </div>
                <span className="font-bold text-xs text-cyan-300 font-mono uppercase tracking-wider">
                  {editingIndex !== null ? "Edit Career History & Role" : "Add New Career History & Role"}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCancelForm}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                title="Close form"
              >
                {renderIcon(FaTimes, { size: 13 })}
              </button>
            </div>

            {/* Row 1: Role & Company */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-semibold text-slate-200 mb-1 text-xs">
                  Job Role / Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  placeholder="e.g. Full-Stack Software Engineer"
                  className="w-full px-3.5 py-2.5 text-xs text-white bg-[#080d1a] border border-white/[0.1] rounded-xl focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 font-medium placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-200 mb-1 text-xs">
                  Company / Organization Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  placeholder="e.g. Google, Tech Innovations, or BUBT"
                  className="w-full px-3.5 py-2.5 text-xs text-white bg-[#080d1a] border border-white/[0.1] rounded-xl focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 font-medium placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* Row 2: Company Website Link & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-200 text-xs flex items-center gap-1.5">
                    {renderIcon(FaGlobe, { size: 11, className: "text-cyan-400" })}
                    <span>Company Website Link</span>
                  </label>
                  {liveFormLogo && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-cyan-300 font-mono">
                      <img
                        src={liveFormLogo}
                        alt="Logo preview"
                        className="w-3.5 h-3.5 rounded object-contain bg-white/10"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                      <span>Logo detected</span>
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  value={form.companyUrl}
                  onChange={(e) => setForm({ ...form, companyUrl: e.target.value })}
                  placeholder="e.g. https://github.com or company.com"
                  className="w-full px-3.5 py-2.5 text-xs text-white bg-[#080d1a] border border-white/[0.1] rounded-xl focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 font-medium placeholder:text-slate-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Company website link will be embedded into the Company name, and its logo will be fetched and rendered automatically.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-200 mb-1 text-xs">
                  Location
                </label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="e.g. Dhaka, Bangladesh (Hybrid) or Remote"
                  className="w-full px-3.5 py-2.5 text-xs text-white bg-[#080d1a] border border-white/[0.1] rounded-xl focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 font-medium placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* Row 3: Period & Employment Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-semibold text-slate-200 mb-1 text-xs">
                  Period / Timeline
                </label>
                <input
                  type="text"
                  value={form.period}
                  onChange={(e) => setForm({ ...form, period: e.target.value })}
                  placeholder="e.g. 2024 - Present or 2023 - 2024"
                  className="w-full px-3.5 py-2.5 text-xs text-white bg-[#080d1a] border border-white/[0.1] rounded-xl focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 font-medium placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-200 mb-1 text-xs">
                  Employment Type
                </label>
                <select
                  value={form.employmentType}
                  onChange={(e) => setForm({ ...form, employmentType: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs text-white bg-[#080d1a] border border-white/[0.1] rounded-xl focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 font-medium"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Contract / Remote">Contract / Remote</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Internship">Internship</option>
                  <option value="Freelance">Freelance</option>
                </select>
              </div>
            </div>

            {/* Row 4: Role Description */}
            <div>
              <label className="block font-semibold text-slate-200 mb-1 text-xs">
                Role Summary / Description
              </label>
              <textarea
                rows={2}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Brief summary of your role, key duties, and scope..."
                className="w-full px-3.5 py-2.5 text-xs text-white bg-[#080d1a] border border-white/[0.1] rounded-xl focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 font-medium placeholder:text-slate-500 resize-none"
              />
            </div>

            {/* Row 5: Technologies */}
            <div>
              <label className="block font-semibold text-slate-200 mb-1 text-xs">
                Technologies / Stack (Comma-separated)
              </label>
              <input
                type="text"
                value={form.technologies}
                onChange={(e) => setForm({ ...form, technologies: e.target.value })}
                placeholder="e.g. React, Next.js, Node.js, TypeScript, PostgreSQL, Docker"
                className="w-full px-3.5 py-2.5 text-xs text-white bg-[#080d1a] border border-white/[0.1] rounded-xl focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 font-medium placeholder:text-slate-500"
              />
            </div>

            {/* Row 6: Key Highlights */}
            <div>
              <label className="block font-semibold text-slate-200 mb-1 text-xs">
                Key Highlights / Achievements (One per line)
              </label>
              <textarea
                rows={3}
                value={form.highlights}
                onChange={(e) => setForm({ ...form, highlights: e.target.value })}
                placeholder="Architected scalable full-stack web applications with 99.9% uptime&#10;Optimized database queries and API response times by 45%"
                className="w-full px-3.5 py-2.5 text-xs text-white bg-[#080d1a] border border-white/[0.1] rounded-xl focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 font-medium placeholder:text-slate-500"
              />
            </div>

            {/* Row 7: Active / Inactive checkbox */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/10">
              <input
                type="checkbox"
                id="isActiveItem"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="w-4 h-4 rounded text-cyan-500 bg-slate-800 border-white/20 focus:ring-cyan-500 cursor-pointer"
              />
              <label htmlFor="isActiveItem" className="text-xs text-slate-300 cursor-pointer">
                <span className="font-semibold text-white">Item Active</span> &mdash; When checked, this role is visible on the public website (if section is active).
              </label>
            </div>

            {/* Row 8: Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={handleCancelForm}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:opacity-95 shadow-md shadow-cyan-500/20 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
              >
                {saving ? (
                  <>
                    {renderIcon(FaSpinner, { size: 11, className: "animate-spin" })}
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    {renderIcon(FaSave, { size: 11 })}
                    <span>{editingIndex !== null ? "Update Experience" : "Save Experience"}</span>
                  </>
                )}
              </button>
            </div>
          </motion.form>
        )}

        {/* List of Experience items */}
        {experienceList.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl">
            <div className="p-3 w-12 h-12 mx-auto rounded-full bg-white/5 flex items-center justify-center text-slate-500 mb-3">
              {renderIcon(FaBriefcase, { size: 20 })}
            </div>
            <p className="text-sm font-medium text-slate-300">No experience entries found</p>
            <p className="text-xs text-slate-500 mt-1">
              Click &quot;+ Add Experience&quot; or &quot;Reset&quot; to restore defaults.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {experienceList.map((exp, idx) => {
              const isItemActive = exp.isActive !== false;
              const logoUrl = getCompanyLogoUrl(exp.companyUrl, exp.companyLogo);
              const formattedUrl = exp.companyUrl
                ? exp.companyUrl.trim().startsWith("http://") || exp.companyUrl.trim().startsWith("https://")
                  ? exp.companyUrl.trim()
                  : `https://${exp.companyUrl.trim()}`
                : "";

              return (
                <div
                  key={exp.id || idx}
                  className={`p-4 sm:p-5 rounded-xl border transition-all duration-200 ${
                    isItemActive
                      ? "bg-white/[0.02] border-white/10 hover:border-white/20"
                      : "bg-red-950/10 border-red-500/20 opacity-70"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    {/* Left side: Company Logo avatar + Role details */}
                    <div className="flex items-start gap-3.5 flex-1 min-w-0">
                      {/* Company Logo Avatar */}
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-900 border border-white/15 p-1.5 flex items-center justify-center flex-shrink-0 shadow-md">
                        {logoUrl ? (
                          <img
                            src={logoUrl}
                            alt={exp.company}
                            className="w-full h-full object-contain rounded"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="text-cyan-400">
                            {renderIcon(FaBuilding, { size: 16 })}
                          </div>
                        )}
                      </div>

                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-base font-bold text-white">{exp.role}</h4>
                          <span
                            className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${
                              isItemActive
                                ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                                : "bg-rose-500/10 text-rose-300 border-rose-500/20"
                            }`}
                          >
                            {isItemActive ? "ACTIVE" : "INACTIVE"}
                          </span>
                          {exp.employmentType && (
                            <span className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20">
                              {exp.employmentType}
                            </span>
                          )}
                        </div>

                        {/* Company Link and Metadata */}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                          {formattedUrl ? (
                            <a
                              href={formattedUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-semibold underline-offset-2 hover:underline transition-colors group/link"
                              title={`Visit ${exp.company} website: ${formattedUrl}`}
                            >
                              <span>{exp.company}</span>
                              {renderIcon(FaExternalLinkAlt, {
                                size: 9,
                                className: "opacity-70 group-hover/link:opacity-100",
                              })}
                            </a>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-slate-300 font-medium">
                              <span>{exp.company}</span>
                            </span>
                          )}

                          <span className="inline-flex items-center gap-1">
                            {renderIcon(FaCalendarAlt, { size: 11, className: "text-purple-400" })}
                            <span>{exp.period}</span>
                          </span>

                          {exp.location && (
                            <span className="inline-flex items-center gap-1">
                              {renderIcon(FaMapMarkerAlt, { size: 11, className: "text-slate-500" })}
                              <span>{exp.location}</span>
                            </span>
                          )}
                        </div>

                        {exp.description && (
                          <p className="text-xs text-slate-300/90 leading-relaxed pt-1 line-clamp-2">
                            {exp.description}
                          </p>
                        )}

                        {/* Tech badges */}
                        {exp.technologies && exp.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1.5">
                            {exp.technologies.map((t, ti) => (
                              <span
                                key={ti}
                                className="px-2 py-0.5 text-[10px] rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1.5 self-end sm:self-start pt-2 sm:pt-0">
                      {/* Active/Inactive Toggle */}
                      <button
                        type="button"
                        onClick={() => handleToggleItemActive(idx)}
                        disabled={saving}
                        className={`p-2 rounded-lg text-xs font-medium border transition-colors ${
                          isItemActive
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20"
                            : "bg-slate-800 border-white/10 text-slate-400 hover:text-white"
                        }`}
                        title={isItemActive ? "Click to set Inactive" : "Click to set Active"}
                      >
                        {isItemActive
                          ? renderIcon(FaEye, { size: 12 })
                          : renderIcon(FaEyeSlash, { size: 12 })}
                      </button>

                      {/* Move Up */}
                      <button
                        type="button"
                        onClick={() => handleMoveItem(idx, "up")}
                        disabled={idx === 0 || saving}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 disabled:opacity-30 text-xs transition-colors"
                        title="Move Up"
                      >
                        {renderIcon(FaArrowUp, { size: 11 })}
                      </button>

                      {/* Move Down */}
                      <button
                        type="button"
                        onClick={() => handleMoveItem(idx, "down")}
                        disabled={idx === experienceList.length - 1 || saving}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 disabled:opacity-30 text-xs transition-colors"
                        title="Move Down"
                      >
                        {renderIcon(FaArrowDown, { size: 11 })}
                      </button>

                      {/* Edit */}
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(idx)}
                        className="p-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 text-xs transition-colors"
                        title="Edit"
                      >
                        {renderIcon(FaEdit, { size: 12 })}
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(idx)}
                        className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs transition-colors"
                        title="Delete"
                      >
                        {renderIcon(FaTrash, { size: 12 })}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
