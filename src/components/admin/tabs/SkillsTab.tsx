import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaPlus,
  FaCheckCircle,
  FaLayerGroup,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSave,
  FaCheck,
  FaSearch,
} from "react-icons/fa";
import {
  SkillCategory,
  SkillItemData,
  DEFAULT_SKILL_CATEGORIES,
  DEFAULT_SKILLS_DATA,
} from "../../../data/portfolioData";
import {
  saveLiveSkills,
  saveLiveSkillCategories,
  resolveSkillIcon,
  resolveCategoryIcon,
  AVAILABLE_SKILL_ICONS,
} from "../../../lib/portfolioService";
import { renderIcon, AdminToast } from "../types";

const PROFICIENCY_OPTIONS = [
  {
    value: "Core",
    label: "Core",
    bengaliTag: "Core (বেশি ভালো)",
    desc: "Primary production stack, architectural mastery, battle-tested in real systems",
    badgeColor: "border-purple-500/40 bg-purple-500/10 text-purple-300",
    borderActive: "border-purple-400 ring-2 ring-purple-500/30 bg-purple-500/10",
  },
  {
    value: "Advanced",
    label: "Advanced",
    bengaliTag: "Advanced (ভালো)",
    desc: "Strong daily engineering, clean production code, robust understanding",
    badgeColor: "border-cyan-500/40 bg-cyan-500/10 text-cyan-300",
    borderActive: "border-cyan-400 ring-2 ring-cyan-500/30 bg-cyan-500/10",
  },
  {
    value: "Working Knowledge",
    label: "Working Knowledge",
    bengaliTag: "Working Knowledge (মিডিয়াম)",
    desc: "Comfortable implementation, working integration knowledge, expanding",
    badgeColor: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
    borderActive: "border-emerald-400 ring-2 ring-emerald-500/30 bg-emerald-500/10",
  },
  {
    value: "Familiar",
    label: "Familiar",
    bengaliTag: "Familiar (পরিচিত)",
    desc: "Foundational concepts, explored in practical environments and prototypes",
    badgeColor: "border-amber-500/40 bg-amber-500/10 text-amber-300",
    borderActive: "border-amber-400 ring-2 ring-amber-500/30 bg-amber-500/10",
  },
];

const TECH_COLOR_PRESETS = [
  { name: "React Cyan", hex: "#61DAFB" },
  { name: "TypeScript Blue", hex: "#3178C6" },
  { name: "Tailwind Cyan", hex: "#06B6D4" },
  { name: "Purple Accent", hex: "#a855f7" },
  { name: "Pink Accent", hex: "#ec4899" },
  { name: "Node Green", hex: "#339933" },
  { name: "MongoDB Green", hex: "#47A248" },
  { name: "JavaScript Yellow", hex: "#F7DF1E" },
  { name: "Python Blue", hex: "#3776AB" },
  { name: "Git Orange-Red", hex: "#F05032" },
  { name: "Linux Amber", hex: "#FCC624" },
  { name: "TensorFlow Orange", hex: "#FF6F00" },
  { name: "Flutter Blue", hex: "#02569B" },
  { name: "Pure White", hex: "#ffffff" },
];

interface SkillsTabProps {
  skillsList: SkillItemData[];
  setSkillsList: React.Dispatch<React.SetStateAction<SkillItemData[]>>;
  skillCategoriesList: SkillCategory[];
  setSkillCategoriesList: React.Dispatch<React.SetStateAction<SkillCategory[]>>;
}

export const SkillsTab: React.FC<SkillsTabProps> = ({
  skillsList,
  setSkillsList,
  skillCategoriesList,
  setSkillCategoriesList,
}) => {
  const [skillSaving, setSkillSaving] = useState(false);
  const [skillToast, setSkillToast] = useState<AdminToast | null>(null);
  const [skillSearch, setSkillSearch] = useState("");
  const [skillCategoryFilter, setSkillCategoryFilter] = useState("all");

  // Category Form state
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    id: "",
    label: "",
    iconName: "FaCode",
  });

  // Skill Form state
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [skillForm, setSkillForm] = useState({
    name: "",
    category: "frontend",
    level: "Core",
    color: "#61DAFB",
    iconName: "FaReact",
  });

  // Visual Icon Picker state
  const [skillIconSearch, setSkillIconSearch] = useState("");
  const [skillIconCategory, setSkillIconCategory] = useState("all");

  // Filter skills
  const filteredAdminSkills = skillsList.filter((skill) => {
    const matchesCategory =
      skillCategoryFilter === "all" || skill.category === skillCategoryFilter;
    const matchesSearch =
      !skillSearch.trim() ||
      skill.name.toLowerCase().includes(skillSearch.toLowerCase()) ||
      (skill.level || "").toLowerCase().includes(skillSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // ==========================================================================
  // Category Handlers
  // ==========================================================================
  const handleOpenAddCategory = () => {
    setEditingCategoryId(null);
    setIsAddingCategory(true);
    setCategoryForm({
      id: "",
      label: "",
      iconName: "FaCode",
    });
  };

  const handleOpenEditCategory = (cat: SkillCategory) => {
    setIsAddingCategory(false);
    setEditingCategoryId(cat.id);
    setCategoryForm({
      id: cat.id,
      label: cat.label,
      iconName: cat.iconName || "FaCode",
    });
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.label.trim()) {
      alert("Please provide a Category Name / Label.");
      return;
    }

    const slug =
      categoryForm.id.trim() ||
      categoryForm.label
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    const newCat: SkillCategory = {
      id: slug,
      label: categoryForm.label.trim(),
      iconName: categoryForm.iconName || "FaCode",
    };

    let updatedList: SkillCategory[];
    if (editingCategoryId) {
      updatedList = skillCategoriesList.map((c) =>
        c.id === editingCategoryId ? { ...newCat, id: editingCategoryId } : c
      );
    } else {
      if (skillCategoriesList.some((c) => c.id === slug)) {
        alert("A category with this ID already exists. Please use a unique label.");
        return;
      }
      updatedList = [...skillCategoriesList, newCat];
    }

    setSkillCategoriesList(updatedList);
    setIsAddingCategory(false);
    setEditingCategoryId(null);
    setSkillSaving(true);

    try {
      const res = await saveLiveSkillCategories(updatedList);
      setSkillToast({
        message: res.error
          ? `Category saved locally! (Cloud note: ${res.error})`
          : "Category successfully saved and synced live!",
        type: "success",
      });
      setTimeout(() => setSkillToast(null), 4000);
    } catch (err: any) {
      setSkillToast({
        message: "Failed to sync category with cloud database.",
        type: "error",
      });
      setTimeout(() => setSkillToast(null), 4000);
    } finally {
      setSkillSaving(false);
    }
  };

  const handleDeleteCategory = async (catId: string) => {
    const skillsInCategory = skillsList.filter((s) => s.category === catId);
    const confirmMsg =
      skillsInCategory.length > 0
        ? `This category contains ${skillsInCategory.length} skills. Deleting it will reassign those skills to the first available category. Proceed?`
        : "Are you sure you want to delete this category?";

    if (!window.confirm(confirmMsg)) return;

    const updatedCats = skillCategoriesList.filter((c) => c.id !== catId);
    if (updatedCats.length === 0) {
      alert("You must keep at least one category.");
      return;
    }

    setSkillCategoriesList(updatedCats);

    if (skillsInCategory.length > 0) {
      const remappedSkills = skillsList.map((s) =>
        s.category === catId ? { ...s, category: updatedCats[0].id } : s
      );
      setSkillsList(remappedSkills);
      await saveLiveSkills(remappedSkills);
    }

    setSkillSaving(true);
    try {
      await saveLiveSkillCategories(updatedCats);
      setSkillToast({
        message: "Category removed successfully!",
        type: "success",
      });
      setTimeout(() => setSkillToast(null), 4000);
    } catch (e) {
      setSkillToast({
        message: "Failed to remove category from database.",
        type: "error",
      });
      setTimeout(() => setSkillToast(null), 4000);
    } finally {
      setSkillSaving(false);
    }
  };

  // ==========================================================================
  // Skill Handlers
  // ==========================================================================
  const handleOpenAddSkill = () => {
    setEditingSkillId(null);
    setIsAddingSkill(true);
    setSkillForm({
      name: "",
      category: skillCategoriesList[0]?.id || "frontend",
      level: "Core",
      color: "#61DAFB",
      iconName: "FaReact",
    });
  };

  const handleOpenEditSkill = (skill: SkillItemData) => {
    setIsAddingSkill(false);
    setEditingSkillId(skill.id);
    setSkillForm({
      name: skill.name || "",
      category: skill.category || "frontend",
      level: skill.level || "Core",
      color: skill.color || "#a855f7",
      iconName: skill.iconName || "",
    });
  };

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillForm.name.trim()) {
      alert("Please provide a Technology / Skill name.");
      return;
    }

    const newSkill: SkillItemData = {
      id:
        editingSkillId ||
        `skill-${skillForm.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")}-${Date.now()}`,
      name: skillForm.name.trim(),
      category: skillForm.category || "frontend",
      level: skillForm.level.trim() || "Core",
      color: skillForm.color || "#a855f7",
      iconName: skillForm.iconName || "",
    };

    let updatedList: SkillItemData[];
    if (editingSkillId) {
      updatedList = skillsList.map((s) => (s.id === editingSkillId ? newSkill : s));
    } else {
      updatedList = [newSkill, ...skillsList];
    }

    setSkillsList(updatedList);
    setIsAddingSkill(false);
    setEditingSkillId(null);
    setSkillSaving(true);

    try {
      const res = await saveLiveSkills(updatedList);
      setSkillToast({
        message: res.error
          ? `Skill saved locally! (Cloud notice: ${res.error})`
          : "Skill saved and synced to website live!",
        type: "success",
      });
      setTimeout(() => setSkillToast(null), 4000);
    } catch (err: any) {
      setSkillToast({
        message: "Failed to sync skills with cloud database.",
        type: "error",
      });
      setTimeout(() => setSkillToast(null), 4000);
    } finally {
      setSkillSaving(false);
    }
  };

  const handleDeleteSkill = async (skillId: string) => {
    if (!window.confirm("Are you sure you want to delete this technology from your stack?")) return;

    const updatedList = skillsList.filter((s) => s.id !== skillId);
    setSkillsList(updatedList);
    setSkillSaving(true);

    try {
      await saveLiveSkills(updatedList);
      setSkillToast({
        message: "Technology removed from stack.",
        type: "success",
      });
      setTimeout(() => setSkillToast(null), 4000);
    } catch (e) {
      setSkillToast({
        message: "Failed to remove skill from database.",
        type: "error",
      });
      setTimeout(() => setSkillToast(null), 4000);
    } finally {
      setSkillSaving(false);
    }
  };

  const handleResetSkillsDefaults = async () => {
    if (
      !window.confirm(
        "Are you sure you want to reset all skills and categories back to default 29 technologies and 6 standard categories?"
      )
    )
      return;

    setSkillCategoriesList(DEFAULT_SKILL_CATEGORIES);
    setSkillsList(DEFAULT_SKILLS_DATA);
    setSkillSaving(true);

    try {
      await saveLiveSkillCategories(DEFAULT_SKILL_CATEGORIES);
      await saveLiveSkills(DEFAULT_SKILLS_DATA);
      setSkillToast({
        message: "Stack reset to default 29 technologies & 6 categories!",
        type: "success",
      });
      setTimeout(() => setSkillToast(null), 4000);
    } catch (e) {
      setSkillToast({
        message: "Failed to reset stack in cloud.",
        type: "error",
      });
      setTimeout(() => setSkillToast(null), 4000);
    } finally {
      setSkillSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.08]">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Skills &amp; Technology Stack Studio
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage your tech stack, update &amp; create custom categories, set proficiency levels (Beshi Valo, Valo, Medium), and customize icons.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleResetSkillsDefaults}
            className="px-3.5 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-xl transition-all cursor-pointer"
            title="Restore default 29 skills and 6 categories"
          >
            Reset Defaults
          </button>
          <button
            type="button"
            onClick={handleOpenAddCategory}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white rounded-xl bg-gradient-to-r from-purple-600 to-indigo-500 hover:opacity-95 shadow-md shadow-purple-500/20 active:scale-[0.98] transition-all cursor-pointer"
          >
            {renderIcon(FaPlus, { size: 10 })}
            <span>+ Add Category</span>
          </button>
          <button
            type="button"
            onClick={handleOpenAddSkill}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 hover:opacity-95 shadow-md shadow-cyan-500/20 active:scale-[0.98] transition-all cursor-pointer"
          >
            {renderIcon(FaPlus, { size: 10 })}
            <span>+ Add Technology</span>
          </button>
        </div>
      </div>

      {/* Status & Toast Notification */}
      {skillToast && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3.5 rounded-2xl border text-xs flex items-center gap-3 ${
            skillToast.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              : "bg-rose-500/10 border-rose-500/30 text-rose-300"
          }`}
        >
          {renderIcon(FaCheckCircle, { size: 16 })}
          <span className="font-medium">{skillToast.message}</span>
        </motion.div>
      )}

      {/* SECTION 1: CATEGORIES & DOMAINS */}
      <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#111726]/75 space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              {renderIcon(FaLayerGroup, { size: 14, className: "text-purple-400" })}
              <span>Categories &amp; Filter Domains</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Categories appear as filter tabs on your live portfolio. You can add new categories, rename them, or delete empty ones.
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenAddCategory}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 transition-all cursor-pointer"
          >
            {renderIcon(FaPlus, { size: 9 })}
            <span>New Category</span>
          </button>
        </div>

        {/* Categories List Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {skillCategoriesList.map((cat) => {
            const catIcon = resolveCategoryIcon(cat.id, cat.iconName);
            const count = skillsList.filter((s) => s.category === cat.id).length;

            return (
              <div
                key={cat.id}
                className="flex items-center justify-between p-3.5 rounded-xl border border-white/[0.08] bg-black/20 hover:border-purple-500/30 transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
                    {renderIcon(catIcon, { size: 16 })}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-semibold text-white truncate">{cat.label}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-mono text-slate-400">ID: {cat.id}</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-white/[0.06] text-slate-300 border border-white/[0.08]">
                        {count} {count === 1 ? "skill" : "skills"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEditCategory(cat)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-white/[0.06] transition-colors cursor-pointer"
                    title="Edit Category"
                  >
                    {renderIcon(FaEdit, { size: 12 })}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/[0.06] transition-colors cursor-pointer"
                    title="Delete Category"
                  >
                    {renderIcon(FaTrash, { size: 12 })}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add / Edit Category Form (Inline Drawer) */}
        {(isAddingCategory || editingCategoryId !== null) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="p-5 rounded-xl border border-purple-500/30 bg-purple-950/20 space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                {editingCategoryId ? "Edit Category" : "Add New Category"}
              </h4>
              <button
                type="button"
                onClick={() => {
                  setIsAddingCategory(false);
                  setEditingCategoryId(null);
                }}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                {renderIcon(FaTimes, { size: 12 })}
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 text-[11px] uppercase tracking-wider mb-1.5">
                    Category Label / Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cloud & DevOps"
                    value={categoryForm.label}
                    onChange={(e) => setCategoryForm({ ...categoryForm, label: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs text-white bg-[#0c101d] border border-white/10 rounded-xl focus:outline-none focus:border-purple-400 transition-all"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 text-[11px] uppercase tracking-wider mb-1.5">
                    Category ID / Slug
                  </label>
                  <input
                    type="text"
                    placeholder="auto-generated from label (e.g. cloud-devops)"
                    value={categoryForm.id}
                    onChange={(e) => setCategoryForm({ ...categoryForm, id: e.target.value })}
                    disabled={Boolean(editingCategoryId)}
                    className="w-full px-3.5 py-2 text-xs text-white bg-[#0c101d] border border-white/10 rounded-xl focus:outline-none focus:border-purple-400 transition-all font-mono disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 text-[11px] uppercase tracking-wider mb-1.5">
                    Category Icon
                  </label>
                  <select
                    value={categoryForm.iconName}
                    onChange={(e) => setCategoryForm({ ...categoryForm, iconName: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs text-white bg-[#0c101d] border border-white/10 rounded-xl focus:outline-none focus:border-purple-400 transition-all"
                  >
                    <option value="FaCode">FaCode (Code & Languages)</option>
                    <option value="FaReact">FaReact (Frontend & Web)</option>
                    <option value="FaMobileAlt">FaMobileAlt (Mobile Apps)</option>
                    <option value="FaServer">FaServer (Backend & API)</option>
                    <option value="FaDatabase">FaDatabase (Databases & DevOps)</option>
                    <option value="FaBrain">FaBrain (AI / Machine Learning)</option>
                    <option value="FaMicrochip">FaMicrochip (IoT & Hardware)</option>
                    <option value="FaCloud">FaCloud (Cloud Infrastructure)</option>
                    <option value="FaShieldAlt">FaShieldAlt (Security & Cybersecurity)</option>
                    <option value="FaTools">FaTools (Tools & Utilities)</option>
                    <option value="FaGlobe">FaGlobe (Web & Network)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingCategory(false);
                    setEditingCategoryId(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={skillSaving}
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white rounded-xl bg-gradient-to-r from-purple-600 to-indigo-500 hover:opacity-95 shadow-md shadow-purple-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                >
                  {renderIcon(FaSave, { size: 11 })}
                  <span>{editingCategoryId ? "Update Category" : "Save Category"}</span>
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </div>

      {/* SECTION 2: ADD / EDIT SKILL STUDIO (IN-PAGE FORM) */}
      {(isAddingSkill || editingSkillId !== null) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 rounded-2xl border border-cyan-500/30 bg-[#111726]/90 space-y-6 shadow-2xl relative"
        >
          {/* Decorative Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] relative z-10">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                {renderIcon(editingSkillId ? FaEdit : FaPlus, { size: 14, className: "text-cyan-400" })}
                <span>{editingSkillId ? "Edit Technology Specification" : "Add New Technology to Arsenal"}</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Configure technology name, assign category, pick proficiency tier, customize badge color, and select icon.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsAddingSkill(false);
                setEditingSkillId(null);
              }}
              className="text-slate-400 hover:text-white text-xs cursor-pointer p-1 rounded-lg hover:bg-white/[0.06]"
            >
              {renderIcon(FaTimes, { size: 14 })}
            </button>
          </div>

          <form onSubmit={handleSaveSkill} className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left 8 cols: Form Inputs */}
              <div className="lg:col-span-8 space-y-5">
                {/* Row 1: Name and Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-300 text-[11px] uppercase tracking-wider mb-1.5">
                      Technology / Skill Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Next.js, Docker, Flutter, PostgreSQL"
                      value={skillForm.name}
                      onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs text-white bg-[#0c101d] border border-white/10 rounded-xl focus:outline-none focus:border-cyan-400 transition-all font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 text-[11px] uppercase tracking-wider mb-1.5">
                      Category Domain *
                    </label>
                    <select
                      value={skillForm.category}
                      onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs text-white bg-[#0c101d] border border-white/10 rounded-xl focus:outline-none focus:border-cyan-400 transition-all font-medium cursor-pointer"
                    >
                      {skillCategoriesList.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.label} ({c.id})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Row 2: Proficiency Level Tier */}
                <div className="space-y-2">
                  <label className="block font-semibold text-slate-300 text-[11px] uppercase tracking-wider">
                    Proficiency Level Tier (Core / Advanced / Working Knowledge / Familiar) *
                  </label>
                  <p className="text-[11px] text-slate-400">
                    Select how well you know this skill. It controls the glowing badge on your live portfolio.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                    {PROFICIENCY_OPTIONS.map((opt) => {
                      const isSelected = skillForm.level === opt.value;

                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setSkillForm({ ...skillForm, level: opt.value })}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? opt.borderActive
                              : "border-white/[0.08] bg-black/20 hover:border-white/20 hover:bg-black/30"
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-white">{opt.label}</span>
                              {isSelected && (
                                <div className="p-1 rounded-full bg-white/10 text-white">
                                  {renderIcon(FaCheck, { size: 10 })}
                                </div>
                              )}
                            </div>
                            <span className={`inline-block mt-1 px-2 py-0.5 text-[9px] font-bold rounded-md border ${opt.badgeColor}`}>
                              {opt.bengaliTag}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                            {opt.desc}
                          </p>
                        </button>
                      );
                    })}
                  </div>

                  {/* Optional Custom Level Input */}
                  <div className="pt-1.5 flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-mono">Custom Level:</span>
                    <input
                      type="text"
                      placeholder="Or type custom level (e.g. Core, Advanced, Working Knowledge, Familiar)"
                      value={skillForm.level}
                      onChange={(e) => setSkillForm({ ...skillForm, level: e.target.value })}
                      className="flex-1 px-3 py-1.5 text-xs text-white bg-[#0c101d] border border-white/10 rounded-lg focus:outline-none focus:border-cyan-400 transition-all font-mono"
                    />
                  </div>
                </div>

                {/* Row 3: Color Palette Selection */}
                <div className="space-y-2">
                  <label className="block font-semibold text-slate-300 text-[11px] uppercase tracking-wider">
                    Brand Accent Color (Card &amp; Icon Tint)
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    {TECH_COLOR_PRESETS.map((preset) => (
                      <button
                        key={preset.hex}
                        type="button"
                        onClick={() => setSkillForm({ ...skillForm, color: preset.hex })}
                        className={`w-7 h-7 rounded-full transition-transform cursor-pointer relative ${
                          skillForm.color.toLowerCase() === preset.hex.toLowerCase()
                            ? "scale-125 ring-2 ring-white ring-offset-2 ring-offset-[#0c101d]"
                            : "hover:scale-110 opacity-85 hover:opacity-100"
                        }`}
                        style={{ backgroundColor: preset.hex }}
                        title={`${preset.name} (${preset.hex})`}
                      />
                    ))}

                    <div className="flex items-center gap-2 ml-2">
                      <input
                        type="color"
                        value={skillForm.color.startsWith("#") ? skillForm.color : "#a855f7"}
                        onChange={(e) => setSkillForm({ ...skillForm, color: e.target.value })}
                        className="w-7 h-7 rounded-lg border border-white/10 bg-transparent cursor-pointer"
                        title="Custom Hex Color"
                      />
                      <input
                        type="text"
                        value={skillForm.color}
                        onChange={(e) => setSkillForm({ ...skillForm, color: e.target.value })}
                        placeholder="#a855f7"
                        className="w-24 px-2 py-1 text-xs text-white bg-[#0c101d] border border-white/10 rounded-lg focus:outline-none focus:border-cyan-400 font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 4: Comprehensive Icon Selector with Live Search & Categories */}
                <div className="space-y-3 pt-1 border-t border-white/[0.06]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <label className="block font-semibold text-slate-300 text-[11px] uppercase tracking-wider">
                      Technology Icon ({AVAILABLE_SKILL_ICONS.length}+ Curated Icons)
                    </label>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span>Auto-resolved:</span>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.06] border border-white/[0.1] text-white font-mono text-xs">
                        {renderIcon(resolveSkillIcon(skillForm.name, skillForm.iconName, skillForm.category), {
                          size: 15,
                          style: { color: skillForm.color },
                        })}
                        <span className="font-semibold text-cyan-300">
                          {skillForm.iconName || "Auto-Matched"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Icon Search & Category Filter */}
                  <div className="space-y-2.5 p-3.5 rounded-xl bg-[#090d16] border border-white/[0.08]">
                    <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center justify-between">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-2.5 text-slate-500">
                          {renderIcon(FaSearch, { size: 11 })}
                        </span>
                        <input
                          type="text"
                          value={skillIconSearch}
                          onChange={(e) => setSkillIconSearch(e.target.value)}
                          placeholder="Search icon (e.g., VS Code, Postman, Python, Docker, React)..."
                          className="w-full pl-8 pr-7 py-1.5 text-xs text-white bg-[#0c101d] border border-white/10 rounded-lg focus:outline-none focus:border-cyan-400 placeholder:text-slate-500 transition-all font-sans"
                        />
                        {skillIconSearch && (
                          <button
                            type="button"
                            onClick={() => setSkillIconSearch("")}
                            className="absolute right-2 top-2 text-slate-400 hover:text-white cursor-pointer"
                          >
                            {renderIcon(FaTimes, { size: 10 })}
                          </button>
                        )}
                      </div>

                      {/* Reset to Auto button */}
                      <button
                        type="button"
                        onClick={() => setSkillForm({ ...skillForm, iconName: "" })}
                        className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all cursor-pointer whitespace-nowrap border ${
                          !skillForm.iconName
                            ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-semibold"
                            : "bg-white/[0.03] text-slate-400 border-white/[0.06] hover:text-white hover:bg-white/[0.06]"
                        }`}
                      >
                        ✨ Auto from Name
                      </button>
                    </div>

                    {/* Category Filter Pills for Icons */}
                    <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px]">
                      {[
                        { id: "all", label: "All" },
                        { id: "tools", label: "IDEs & Tools" },
                        { id: "languages", label: "Languages" },
                        { id: "frontend", label: "Frontend" },
                        { id: "backend", label: "Backend" },
                        { id: "database", label: "Database" },
                        { id: "cloud", label: "Cloud & DevOps" },
                        { id: "ai", label: "AI / ML" },
                        { id: "iot", label: "IoT" },
                      ].map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setSkillIconCategory(cat.id)}
                          className={`px-2 py-0.5 rounded-md text-[10px] font-medium transition-all whitespace-nowrap cursor-pointer ${
                            skillIconCategory === cat.id
                              ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40"
                              : "text-slate-400 hover:text-slate-200 bg-white/[0.02]"
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>

                    {/* Scrollable Visual Icon Grid */}
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-1.5 max-h-48 overflow-y-auto pr-1 pt-1">
                      {AVAILABLE_SKILL_ICONS.filter((ic) => {
                        const matchesCat =
                          skillIconCategory === "all" || (ic as any).category === skillIconCategory;
                        const matchesSearch =
                          !skillIconSearch ||
                          ic.label.toLowerCase().includes(skillIconSearch.toLowerCase()) ||
                          ic.id.toLowerCase().includes(skillIconSearch.toLowerCase());
                        return matchesCat && matchesSearch;
                      }).map((ic) => {
                        const isSelected = skillForm.iconName === ic.id;
                        return (
                          <button
                            key={ic.id}
                            type="button"
                            onClick={() => setSkillForm({ ...skillForm, iconName: ic.id })}
                            className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer text-center ${
                              isSelected
                                ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md ring-1 ring-cyan-400/40 scale-95"
                                : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.06] text-slate-300 hover:text-white"
                            }`}
                            title={`${ic.label} (${ic.id})`}
                          >
                            <div className="text-base">{renderIcon(ic.icon, { size: 16 })}</div>
                            <span className="text-[9px] font-medium truncate max-w-[70px] leading-tight">
                              {ic.label.split(" ")[0]}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.06]">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingSkill(false);
                      setEditingSkillId(null);
                    }}
                    className="px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={skillSaving}
                    className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white rounded-xl bg-gradient-to-r from-cyan-600 via-cyan-500 to-indigo-500 hover:opacity-95 shadow-lg shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {renderIcon(FaSave, { size: 12 })}
                    <span>{editingSkillId ? "Update Technology" : "Save to Stack"}</span>
                  </button>
                </div>
              </div>

              {/* Right 4 cols: Live Card Preview */}
              <div className="lg:col-span-4 p-5 rounded-2xl border border-white/[0.08] bg-black/30 flex flex-col justify-between space-y-4">
                <div className="border-b border-white/[0.06] pb-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                    Live Website Preview
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Real-time rendering of how visitors see this card on your portfolio.
                  </p>
                </div>

                {/* Live Card */}
                <div className="flex flex-col items-center justify-center p-6 text-center border rounded-2xl bg-white/[0.03] border-white/10 backdrop-blur-xl max-w-[200px] mx-auto shadow-xl">
                  <div
                    className="flex items-center justify-center w-12 h-12 mb-3 rounded-xl transition-transform duration-300"
                    style={{ backgroundColor: `${skillForm.color || "#a855f7"}18` }}
                  >
                    {renderIcon(
                      resolveSkillIcon(skillForm.name, skillForm.iconName, skillForm.category),
                      {
                        size: 26,
                        style: { color: skillForm.color || "#a855f7" },
                      }
                    )}
                  </div>

                  <h4 className="text-sm font-semibold text-white">
                    {skillForm.name || "Technology Name"}
                  </h4>

                  <span
                    className={`inline-block mt-2 px-2.5 py-0.5 text-[10px] font-semibold rounded-full border ${
                      skillForm.level === "Core" ||
                      skillForm.level === "Core Production" ||
                      skillForm.level.toLowerCase().includes("core") ||
                      skillForm.level.toLowerCase().includes("beshi")
                        ? "bg-purple-500/10 border-purple-500/30 text-purple-300"
                        : skillForm.level === "Advanced" ||
                          skillForm.level.toLowerCase().includes("adv") ||
                          skillForm.level.toLowerCase().includes("valo")
                        ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-300"
                        : skillForm.level === "Working Knowledge" ||
                          skillForm.level === "Proficient" ||
                          skillForm.level.toLowerCase().includes("working") ||
                          skillForm.level.toLowerCase().includes("medium")
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                        : "bg-amber-500/10 border-amber-500/30 text-amber-300"
                    }`}
                  >
                    {skillForm.level || "Core"}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-[11px] text-slate-400 space-y-1 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Category:</span>
                    <span className="text-slate-200">
                      {skillCategoriesList.find((c) => c.id === skillForm.category)?.label || skillForm.category}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Color:</span>
                    <span className="text-slate-200">{skillForm.color}</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </motion.div>
      )}

      {/* SECTION 3: SKILLS CATALOG & FILTER BAR */}
      <div className="space-y-4">
        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSkillCategoryFilter("all")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                skillCategoryFilter === "all"
                  ? "bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-md shadow-purple-500/20"
                  : "bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.08]"
              }`}
            >
              All ({skillsList.length})
            </button>
            {skillCategoriesList.map((cat) => {
              const isActive = skillCategoryFilter === cat.id;
              const count = skillsList.filter((s) => s.category === cat.id).length;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSkillCategoryFilter(cat.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
                      : "bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.08]"
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-white/[0.06] text-slate-400"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[220px]">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              {renderIcon(FaSearch, { size: 12 })}
            </span>
            <input
              type="text"
              placeholder="Search technologies..."
              value={skillSearch}
              onChange={(e) => setSkillSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-1.5 text-xs text-white bg-[#0c101d] border border-white/10 rounded-xl focus:outline-none focus:border-cyan-400 transition-all placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Skills Grid */}
        {filteredAdminSkills.length === 0 ? (
          <div className="p-12 text-center border rounded-2xl bg-white/[0.02] border-white/[0.08]">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/[0.04] text-slate-400 mb-3">
              {renderIcon(FaSearch, { size: 20 })}
            </div>
            <p className="text-sm font-semibold text-white">No technologies found</p>
            <p className="text-xs text-slate-400 mt-1">
              No technology matched your filter or search query "{skillSearch}".
            </p>
            <button
              type="button"
              onClick={() => {
                setSkillSearch("");
                setSkillCategoryFilter("all");
              }}
              className="mt-3 px-3.5 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
            {filteredAdminSkills.map((skill) => {
              const skillIcon = resolveSkillIcon(skill.name, skill.iconName, skill.category);
              const isCore =
                skill.level === "Core" ||
                skill.level === "Core Production" ||
                skill.level.toLowerCase().includes("core") ||
                skill.level.toLowerCase().includes("beshi");
              const isAdvanced =
                skill.level === "Advanced" ||
                skill.level.toLowerCase().includes("adv") ||
                skill.level.toLowerCase().includes("valo");
              const isWorkingKnowledge =
                skill.level === "Working Knowledge" ||
                skill.level === "Proficient" ||
                skill.level.toLowerCase().includes("working") ||
                skill.level.toLowerCase().includes("medium");

              return (
                <div
                  key={skill.id}
                  className="flex flex-col items-center justify-between p-4 text-center border rounded-2xl bg-white/[0.03] border-white/10 hover:border-purple-500/40 hover:bg-white/[0.06] transition-all group relative shadow-md shadow-black/10"
                >
                  {/* Quick Action Overlay Buttons */}
                  <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => handleOpenEditSkill(skill)}
                      className="p-1.5 rounded-lg bg-black/60 text-slate-300 hover:text-cyan-400 border border-white/10 hover:border-cyan-400/40 transition-colors cursor-pointer"
                      title="Edit Technology"
                    >
                      {renderIcon(FaEdit, { size: 10 })}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSkill(skill.id)}
                      className="p-1.5 rounded-lg bg-black/60 text-slate-300 hover:text-rose-400 border border-white/10 hover:border-rose-400/40 transition-colors cursor-pointer"
                      title="Delete Technology"
                    >
                      {renderIcon(FaTrash, { size: 10 })}
                    </button>
                  </div>

                  {/* Icon Container */}
                  <div
                    className="flex items-center justify-center w-12 h-12 mb-3 rounded-xl transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${skill.color || "#a855f7"}18` }}
                  >
                    {renderIcon(skillIcon, {
                      size: 26,
                      style: { color: skill.color || "#a855f7" },
                    })}
                  </div>

                  {/* Skill Name */}
                  <h4 className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                    {skill.name}
                  </h4>

                  {/* Category Tag */}
                  <span className="text-[10px] text-slate-400 mt-0.5 truncate max-w-full">
                    {skillCategoriesList.find((c) => c.id === skill.category)?.label || skill.category}
                  </span>

                  {/* Level Tag */}
                  <span
                    className={`inline-block mt-2 px-2.5 py-0.5 text-[10px] font-semibold rounded-full border ${
                      isCore
                        ? "bg-purple-500/10 border-purple-500/30 text-purple-300"
                        : isAdvanced
                        ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-300"
                        : isWorkingKnowledge
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                        : "bg-amber-500/10 border-amber-500/30 text-amber-300"
                    }`}
                  >
                    {skill.level}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
export default SkillsTab;
