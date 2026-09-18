import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCheck,
  FaPlus,
  FaTrash,
  FaArrowUp,
  FaArrowDown,
  FaRedo,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaTimes,
  FaClock,
  FaDraftingCompass,
  FaFigma,
  FaLaptopCode,
  FaShieldAlt,
  FaRocket,
  FaCode,
  FaBrain,
  FaTools,
  FaLayerGroup,
  FaCogs,
  FaServer,
  FaDatabase,
  FaLightbulb,
} from "react-icons/fa";
import {
  useDevelopmentProcessConfig,
  saveDevelopmentProcessConfig,
  resetDevelopmentProcessConfig,
} from "../../../lib/portfolioService";
import { ProcessStep } from "../../../data/processData";
import { renderIcon, AdminToast } from "../types";

const AVAILABLE_ICONS = [
  { name: "FaDraftingCompass", label: "Compass / Architecture", icon: FaDraftingCompass },
  { name: "FaFigma", label: "Figma / UI Design", icon: FaFigma },
  { name: "FaLaptopCode", label: "Laptop / Development", icon: FaLaptopCode },
  { name: "FaShieldAlt", label: "Shield / Testing & Security", icon: FaShieldAlt },
  { name: "FaRocket", label: "Rocket / Launch & CI/CD", icon: FaRocket },
  { name: "FaCode", label: "Code / Clean Syntax", icon: FaCode },
  { name: "FaBrain", label: "Brain / AI & Logic", icon: FaBrain },
  { name: "FaTools", label: "Tools / Maintenance", icon: FaTools },
  { name: "FaLayerGroup", label: "Layer / Full Stack", icon: FaLayerGroup },
  { name: "FaCogs", label: "Cogs / Engineering", icon: FaCogs },
  { name: "FaServer", label: "Server / Backend", icon: FaServer },
  { name: "FaDatabase", label: "Database / Schema", icon: FaDatabase },
  { name: "FaLightbulb", label: "Lightbulb / Ideation", icon: FaLightbulb },
];

const COLOR_THEMES = [
  { label: "Cyan & Blue", value: "from-cyan-500 to-blue-600", bg: "bg-cyan-500" },
  { label: "Purple & Indigo", value: "from-purple-500 to-indigo-600", bg: "bg-purple-500" },
  { label: "Emerald & Teal", value: "from-emerald-500 to-teal-600", bg: "bg-emerald-500" },
  { label: "Amber & Orange", value: "from-amber-500 to-orange-600", bg: "bg-amber-500" },
  { label: "Pink & Rose", value: "from-pink-500 to-rose-600", bg: "bg-pink-500" },
];

export const ProcessTab: React.FC = () => {
  const config = useDevelopmentProcessConfig();
  const [toast, setToast] = useState<AdminToast | null>(null);
  const [editingStep, setEditingStep] = useState<ProcessStep | null>(null);
  const [isNewStepModalOpen, setIsNewStepModalOpen] = useState(false);
  const [deliverableInput, setDeliverableInput] = useState("");

  // Local form state for section headers
  const [badge, setBadge] = useState(config.badge);
  const [title, setTitle] = useState(config.title);
  const [subtitle, setSubtitle] = useState(config.subtitle);
  const [isSavingHeader, setIsSavingHeader] = useState(false);

  // Sync state when external config loads/updates
  React.useEffect(() => {
    setBadge(config.badge);
    setTitle(config.title);
    setSubtitle(config.subtitle);
  }, [config.badge, config.title, config.subtitle]);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3200);
  };

  // Toggle active / inactive section on homepage
  const handleToggleEnabled = async () => {
    try {
      const nextState = !config.enabled;
      await saveDevelopmentProcessConfig({ enabled: nextState });
      showToast(
        nextState
          ? "Development Process section is now LIVE on the homepage!"
          : "Development Process section is now HIDDEN from the homepage."
      );
    } catch (e: any) {
      showToast(e?.message || "Failed to toggle section status", "error");
    }
  };

  // Save headers
  const handleSaveHeaders = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingHeader(true);
    try {
      await saveDevelopmentProcessConfig({ badge, title, subtitle });
      showToast("Section titles and badge updated successfully!");
    } catch (e: any) {
      showToast(e?.message || "Failed to update headers", "error");
    } finally {
      setIsSavingHeader(false);
    }
  };

  // Move step up / down
  const handleMoveStep = async (index: number, direction: "up" | "down") => {
    const steps = [...config.steps];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= steps.length) return;

    const temp = steps[index];
    steps[index] = steps[targetIdx];
    steps[targetIdx] = temp;

    // Re-index step numbers
    const updatedSteps = steps.map((s, idx) => ({
      ...s,
      stepNumber: String(idx + 1).padStart(2, "0"),
    }));

    await saveDevelopmentProcessConfig({ steps: updatedSteps });
    showToast("Step order updated!");
  };

  // Delete step
  const handleDeleteStep = async (stepId: string) => {
    if (!window.confirm("Are you sure you want to delete this development process step?")) {
      return;
    }
    const filtered = config.steps.filter((s) => s.id !== stepId);
    const updatedSteps = filtered.map((s, idx) => ({
      ...s,
      stepNumber: String(idx + 1).padStart(2, "0"),
    }));
    await saveDevelopmentProcessConfig({ steps: updatedSteps });
    showToast("Step deleted successfully.");
  };

  // Reset to default presets
  const handleResetPresets = async () => {
    if (
      !window.confirm(
        "Reset Development Process back to the original 5 engineering lifecycle phases?"
      )
    ) {
      return;
    }
    await resetDevelopmentProcessConfig();
    showToast("Reset to default 5-step engineering process!");
  };

  // Save or update an existing or new step
  const handleSaveStep = async (stepToSave: ProcessStep) => {
    const existingIndex = config.steps.findIndex((s) => s.id === stepToSave.id);
    let updatedSteps = [...config.steps];

    if (existingIndex >= 0) {
      updatedSteps[existingIndex] = stepToSave;
    } else {
      updatedSteps.push({
        ...stepToSave,
        stepNumber: String(updatedSteps.length + 1).padStart(2, "0"),
      });
    }

    await saveDevelopmentProcessConfig({ steps: updatedSteps });
    setEditingStep(null);
    setIsNewStepModalOpen(false);
    showToast("Process step saved successfully!");
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-3.5 rounded-xl text-xs font-semibold flex items-center justify-between shadow-xl fixed top-6 right-6 z-50 max-w-md ${
              toast.type === "success"
                ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 backdrop-blur-md"
                : "bg-red-500/20 border border-red-500/40 text-red-200 backdrop-blur-md"
            }`}
          >
            <div className="flex items-center gap-2">
              {renderIcon(FaCheckCircle, { className: "h-4 w-4" })}
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => setToast(null)}
              className="text-white/60 hover:text-white ml-3"
            >
              {renderIcon(FaTimes, { className: "h-3.5 w-3.5" })}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header & Quick Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.08]">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <span>Development Process &amp; Lifecycle</span>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-medium border ${
                config.enabled
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                  : "bg-slate-800 text-slate-400 border-slate-700"
              }`}
            >
              {config.enabled ? "LIVE ON HOMEPAGE" : "HIDDEN / INACTIVE"}
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Positioned right after Skills &amp; Technologies. Control visibility, customize phase deliverables, and organize your engineering workflow.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleResetPresets}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 flex items-center gap-2 transition-all cursor-pointer"
            title="Reset to default 5-step engineering process"
          >
            {renderIcon(FaRedo, { size: 11 })}
            <span>Reset Presets</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setEditingStep({
                id: `step-${Date.now()}`,
                stepNumber: String(config.steps.length + 1).padStart(2, "0"),
                title: "",
                subtitle: "",
                description: "",
                iconName: "FaDraftingCompass",
                badge: `PHASE ${config.steps.length + 1}`,
                deliverables: [],
                estimatedDuration: "1 - 2 Days",
                colorTheme: "from-cyan-500 to-blue-600",
                glowColor: "rgba(6, 182, 212, 0.35)",
              });
              setIsNewStepModalOpen(true);
            }}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all cursor-pointer"
          >
            {renderIcon(FaPlus, { size: 11 })}
            <span>Add Step</span>
          </button>
        </div>
      </div>

      {/* Master Active / Inactive Switch Card */}
      <div
        className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-xl ${
          config.enabled
            ? "bg-gradient-to-r from-cyan-950/30 via-[#0e1424] to-blue-950/20 border-cyan-500/40 shadow-[0_10px_30px_-10px_rgba(6,182,212,0.2)]"
            : "bg-[#101420]/80 border-white/10"
        }`}
      >
        <div className="flex items-start sm:items-center gap-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-all ${
              config.enabled
                ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                : "bg-white/5 border-white/10 text-slate-400"
            }`}
          >
            {renderIcon(config.enabled ? FaEye : FaEyeSlash, { size: 20 })}
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-base font-bold text-white">
                Section Visibility:{" "}
                <span className={config.enabled ? "text-cyan-400" : "text-slate-400"}>
                  {config.enabled ? "Active (Shown to Visitors)" : "Inactive (Hidden)"}
                </span>
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-xl">
              {config.enabled
                ? "The 'Development Process' section is currently displayed on your homepage right after Skills & Technologies."
                : "The section is completely hidden from the public website. Toggle on whenever you are ready to publish it."}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleToggleEnabled}
          className={`relative inline-flex h-8 w-16 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            config.enabled ? "bg-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.5)]" : "bg-slate-700"
          }`}
          role="switch"
          aria-checked={config.enabled}
        >
          <span
            aria-hidden="true"
            className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
              config.enabled ? "translate-x-8" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Section Header Customization Form */}
      <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#111726]/75 backdrop-blur-sm space-y-5 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span>Section Headings &amp; Badge</span>
          </h3>
          <span className="text-[11px] font-mono text-slate-400">Homepage Display</span>
        </div>

        <form onSubmit={handleSaveHeaders} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Pill Badge Text
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g. ENGINEERING LIFECYCLE"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c101d] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Section Main Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Development & Engineering Process"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c101d] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Section Subtitle / Description
            </label>
            <textarea
              rows={2}
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Provide a clear, engaging explanation of your engineering approach..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c101d] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSavingHeader}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black flex items-center gap-2 transition-all cursor-pointer shadow-md active:scale-95 disabled:opacity-50"
            >
              {renderIcon(FaCheck, { size: 11 })}
              <span>{isSavingHeader ? "Saving..." : "Update Section Titles"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Steps List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span>Process Steps ({config.steps.length})</span>
          </h3>
          <span className="text-xs text-slate-400">
            Use arrows to reorder steps or click to edit
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {config.steps.map((step, idx) => (
            <div
              key={step.id}
              className="p-5 sm:p-6 rounded-2xl border border-white/[0.08] bg-[#111726]/75 backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-5 hover:border-cyan-500/30 transition-all duration-300 shadow-xl group"
            >
              <div className="flex items-start sm:items-center gap-4">
                {/* Step Number */}
                <div className="flex flex-col items-center">
                  <span className="font-mono text-xl font-black text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 rounded-xl">
                    {step.stepNumber}
                  </span>
                </div>

                {/* Step Details */}
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10">
                      {step.badge}
                    </span>
                    {step.estimatedDuration && (
                      <span className="text-[10px] font-mono text-cyan-400 flex items-center gap-1">
                        {renderIcon(FaClock, { className: "text-[9px]" })}
                        {step.estimatedDuration}
                      </span>
                    )}
                  </div>
                  <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {step.title}
                  </h4>
                  {step.subtitle && (
                    <p className="text-xs text-slate-400 line-clamp-1">{step.subtitle}</p>
                  )}

                  {/* Deliverables preview */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {step.deliverables.map((d, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md text-[10px] bg-white/5 border border-white/10 text-slate-300"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                {/* Move Up */}
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => handleMoveStep(idx, "up")}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-20 text-slate-300 border border-white/10 cursor-pointer disabled:cursor-not-allowed transition-all"
                  title="Move Up"
                >
                  {renderIcon(FaArrowUp, { size: 11 })}
                </button>

                {/* Move Down */}
                <button
                  type="button"
                  disabled={idx === config.steps.length - 1}
                  onClick={() => handleMoveStep(idx, "down")}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-20 text-slate-300 border border-white/10 cursor-pointer disabled:cursor-not-allowed transition-all"
                  title="Move Down"
                >
                  {renderIcon(FaArrowDown, { size: 11 })}
                </button>

                {/* Edit Button */}
                <button
                  type="button"
                  onClick={() => {
                    setEditingStep(step);
                    setIsNewStepModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 cursor-pointer transition-all"
                >
                  Edit Step
                </button>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => handleDeleteStep(step.id)}
                  className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 cursor-pointer transition-all"
                  title="Delete Step"
                >
                  {renderIcon(FaTrash, { size: 11 })}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit / Create Step Modal */}
      <AnimatePresence>
        {isNewStepModalOpen && editingStep && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl my-8 rounded-3xl bg-[#0f1424] border border-white/15 p-6 sm:p-8 shadow-2xl space-y-6 text-slate-200"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>{editingStep.title ? "Edit Process Step" : "Add Process Step"}</span>
                  <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                    Step {editingStep.stepNumber}
                  </span>
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setIsNewStepModalOpen(false);
                    setEditingStep(null);
                  }}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
                >
                  {renderIcon(FaTimes, { size: 14 })}
                </button>
              </div>

              <div className="space-y-4 text-xs max-h-[70vh] overflow-y-auto pr-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Step Title *
                    </label>
                    <input
                      type="text"
                      value={editingStep.title}
                      onChange={(e) =>
                        setEditingStep({ ...editingStep, title: e.target.value })
                      }
                      placeholder="e.g. Discovery & System Architecture"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#080c18] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Phase Badge *
                    </label>
                    <input
                      type="text"
                      value={editingStep.badge}
                      onChange={(e) =>
                        setEditingStep({ ...editingStep, badge: e.target.value })
                      }
                      placeholder="e.g. PHASE 1 • BLUEPRINT"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#080c18] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Subtitle / Tagline
                    </label>
                    <input
                      type="text"
                      value={editingStep.subtitle}
                      onChange={(e) =>
                        setEditingStep({ ...editingStep, subtitle: e.target.value })
                      }
                      placeholder="e.g. Requirements analysis & roadmap"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#080c18] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Estimated Duration / Timeline
                    </label>
                    <input
                      type="text"
                      value={editingStep.estimatedDuration || ""}
                      onChange={(e) =>
                        setEditingStep({
                          ...editingStep,
                          estimatedDuration: e.target.value,
                        })
                      }
                      placeholder="e.g. 1 - 2 Days / Sprint 1"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#080c18] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Detailed Methodology &amp; Description *
                  </label>
                  <textarea
                    rows={3}
                    value={editingStep.description}
                    onChange={(e) =>
                      setEditingStep({ ...editingStep, description: e.target.value })
                    }
                    placeholder="Describe how you execute this engineering phase, what best practices you follow..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#080c18] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>

                {/* Deliverables Builder */}
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Key Deliverables (Bullet points)
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={deliverableInput}
                      onChange={(e) => setDeliverableInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (deliverableInput.trim()) {
                            setEditingStep({
                              ...editingStep,
                              deliverables: [
                                ...editingStep.deliverables,
                                deliverableInput.trim(),
                              ],
                            });
                            setDeliverableInput("");
                          }
                        }
                      }}
                      placeholder="Type a deliverable and press Enter (or click Add)"
                      className="flex-1 px-3.5 py-2 rounded-xl bg-[#080c18] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (deliverableInput.trim()) {
                          setEditingStep({
                            ...editingStep,
                            deliverables: [
                              ...editingStep.deliverables,
                              deliverableInput.trim(),
                            ],
                          });
                          setDeliverableInput("");
                        }
                      }}
                      className="px-3 py-2 rounded-xl bg-cyan-500 text-black font-semibold"
                    >
                      Add
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {editingStep.deliverables.map((item, dIdx) => (
                      <span
                        key={dIdx}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300"
                      >
                        <span>{item}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = editingStep.deliverables.filter(
                              (_, i) => i !== dIdx
                            );
                            setEditingStep({ ...editingStep, deliverables: updated });
                          }}
                          className="text-red-400 hover:text-red-300 ml-1"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Icon Selection */}
                <div>
                  <label className="block font-semibold text-slate-300 mb-1.5">
                    Step Icon
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {AVAILABLE_ICONS.map((ico) => {
                      const isSelected = editingStep.iconName === ico.name;
                      return (
                        <button
                          key={ico.name}
                          type="button"
                          onClick={() =>
                            setEditingStep({ ...editingStep, iconName: ico.name })
                          }
                          className={`flex items-center gap-2 p-2 rounded-xl border text-left cursor-pointer transition-all ${
                            isSelected
                              ? "bg-cyan-500/15 border-cyan-500 text-cyan-300"
                              : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                          }`}
                        >
                          {renderIcon(ico.icon, { size: 14 })}
                          <span className="text-[11px] truncate">{ico.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Color Theme Selector */}
                <div>
                  <label className="block font-semibold text-slate-300 mb-1.5">
                    Glow &amp; Gradient Accent
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {COLOR_THEMES.map((theme) => {
                      const isSelected = editingStep.colorTheme === theme.value;
                      return (
                        <button
                          key={theme.value}
                          type="button"
                          onClick={() =>
                            setEditingStep({
                              ...editingStep,
                              colorTheme: theme.value,
                            })
                          }
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border cursor-pointer transition-all ${
                            isSelected
                              ? "bg-white/10 border-cyan-400 text-white"
                              : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                          }`}
                        >
                          <span className={`w-3 h-3 rounded-full ${theme.bg}`} />
                          <span className="text-[11px]">{theme.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setIsNewStepModalOpen(false);
                    setEditingStep(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!editingStep.title.trim()) {
                      alert("Please enter a step title.");
                      return;
                    }
                    handleSaveStep(editingStep);
                  }}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
                >
                  Save Step
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
