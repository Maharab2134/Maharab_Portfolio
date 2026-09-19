import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaPlus,
  FaCheckCircle,
  FaGraduationCap,
  FaTimes,
  FaSpinner,
  FaSave,
  FaEdit,
  FaTrash,
  FaCertificate,
  FaExternalLinkAlt,
  FaEye,
  FaEyeSlash,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import {
  saveLiveEducation,
  saveLiveCertificates,
} from "../../../lib/portfolioService";
import { EDUCATION_DATA, CERTIFICATES_DATA } from "../../../data/portfolioData";
import { renderIcon, getFeatureList, AdminToast } from "../types";

interface EducationTabProps {
  educationList: any[];
  setEducationList: React.Dispatch<React.SetStateAction<any[]>>;
  certsList: any[];
  setCertsList: React.Dispatch<React.SetStateAction<any[]>>;
}

export const EducationTab: React.FC<EducationTabProps> = ({
  educationList,
  setEducationList,
  certsList,
  setCertsList,
}) => {
  const [eduSaving, setEduSaving] = useState(false);
  const [eduToast, setEduToast] = useState<AdminToast | null>(null);

  // Education state
  const [isAddingEdu, setIsAddingEdu] = useState(false);
  const [editingEduIndex, setEditingEduIndex] = useState<number | null>(null);
  const [eduForm, setEduForm] = useState({
    degree: "",
    institution: "",
    period: "",
    description: "",
    highlights: "",
    isActive: true,
  });

  // Certificate state
  const [isAddingCert, setIsAddingCert] = useState(false);
  const [editingCertIndex, setEditingCertIndex] = useState<number | null>(null);
  const [certForm, setCertForm] = useState({
    title: "",
    issuer: "",
    year: new Date().getFullYear().toString(),
    type: "Professional",
    link: "",
    details: "",
    verificationId: "",
  });

  // ==========================================================================
  // Education Handlers
  // ==========================================================================
  const handleOpenAddDegree = () => {
    setEditingEduIndex(null);
    setIsAddingEdu(true);
    setEduForm({
      degree: "",
      institution: "",
      period: "",
      description: "",
      highlights: "",
      isActive: true,
    });
  };

  const handleOpenEditDegree = (idx: number) => {
    const item = educationList[idx];
    if (!item) return;
    setIsAddingEdu(false);
    setEditingEduIndex(idx);
    setEduForm({
      degree: item.degree || "",
      institution: item.institution || "",
      period: item.period || "",
      description: item.description || "",
      highlights: Array.isArray(item.highlights) ? item.highlights.join("\n") : "",
      isActive: item.isActive !== false,
    });
  };

  const handleSaveDegree = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eduForm.degree.trim() || !eduForm.institution.trim()) {
      alert("Please provide both Degree title and Institution name.");
      return;
    }

    const newDegree = {
      degree: eduForm.degree.trim(),
      institution: eduForm.institution.trim(),
      period: eduForm.period.trim() || "2024 - Present",
      description: eduForm.description.trim(),
      highlights: getFeatureList(eduForm.highlights),
      isActive: eduForm.isActive,
    };

    let updatedList: any[];
    if (editingEduIndex !== null && editingEduIndex >= 0) {
      updatedList = [...educationList];
      updatedList[editingEduIndex] = newDegree;
    } else {
      updatedList = [newDegree, ...educationList];
    }

    setEducationList(updatedList);
    setIsAddingEdu(false);
    setEditingEduIndex(null);
    setEduSaving(true);

    try {
      const res = await saveLiveEducation(updatedList);
      setEduToast({
        message: res.error
          ? `Degree saved in local cache! (Supabase note: ${res.error})`
          : "Degree successfully saved and synced to database!",
        type: "success",
      });
      setTimeout(() => setEduToast(null), 4000);
    } catch (err: any) {
      alert("Failed to save degree: " + err.message);
    } finally {
      setEduSaving(false);
    }
  };

  const handleDeleteDegree = async (idx: number) => {
    const item = educationList[idx];
    if (!window.confirm(`Are you sure you want to delete "${item?.degree}"?`)) return;

    const updatedList = educationList.filter((_, i) => i !== idx);
    setEducationList(updatedList);
    setEduSaving(true);
    try {
      await saveLiveEducation(updatedList);
      setEduToast({ message: "Degree removed successfully!", type: "success" });
      setTimeout(() => setEduToast(null), 3000);
    } catch (err: any) {
      alert("Failed to delete degree: " + err.message);
    } finally {
      setEduSaving(false);
    }
  };

  const handleToggleDegreeActive = async (idx: number) => {
    const item = educationList[idx];
    if (!item) return;

    const updated = [...educationList];
    const newStatus = item.isActive === false ? true : false;
    updated[idx] = { ...item, isActive: newStatus };

    setEducationList(updated);
    setEduSaving(true);
    try {
      await saveLiveEducation(updated);
      setEduToast({
        message: `"${item.degree}" is now ${newStatus ? "ACTIVE (visible)" : "INACTIVE (hidden)"}.`,
        type: "success",
      });
      setTimeout(() => setEduToast(null), 3000);
    } catch (err: any) {
      alert("Failed to update degree status: " + err.message);
    } finally {
      setEduSaving(false);
    }
  };

  const handleMoveDegree = async (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= educationList.length) return;

    const updated = [...educationList];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIdx, 0, moved);

    setEducationList(updated);
    setEduSaving(true);
    try {
      await saveLiveEducation(updated);
      setEduToast({ message: "Degree timeline order updated!", type: "success" });
      setTimeout(() => setEduToast(null), 3000);
    } catch (err: any) {
      alert("Failed to reorder degree: " + err.message);
    } finally {
      setEduSaving(false);
    }
  };

  // ==========================================================================
  // Certificate Handlers
  // ==========================================================================
  const handleOpenAddCert = () => {
    setEditingCertIndex(null);
    setIsAddingCert(true);
    setCertForm({
      title: "",
      issuer: "",
      year: new Date().getFullYear().toString(),
      type: "Professional",
      link: "",
      details: "",
      verificationId: "",
    });
  };

  const handleOpenEditCert = (idx: number) => {
    const item = certsList[idx];
    if (!item) return;
    setIsAddingCert(false);
    setEditingCertIndex(idx);
    setCertForm({
      title: item.title || "",
      issuer: item.issuer || "",
      year: item.year || "",
      type: item.type || "Professional",
      link: item.link || "",
      details: item.details || "",
      verificationId: item.verificationId || item.verification_id || "",
    });
  };

  const handleSaveCert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certForm.title.trim() || !certForm.issuer.trim()) {
      alert("Please provide both Certificate title and Issuing organization.");
      return;
    }

    const newCert = {
      title: certForm.title.trim(),
      issuer: certForm.issuer.trim(),
      year: certForm.year.trim() || new Date().getFullYear().toString(),
      type: certForm.type.trim() || "Professional",
      link: certForm.link.trim(),
      details: certForm.details.trim(),
      verificationId: certForm.verificationId.trim(),
    };

    let updatedList: any[];
    if (editingCertIndex !== null && editingCertIndex >= 0) {
      updatedList = [...certsList];
      updatedList[editingCertIndex] = newCert;
    } else {
      updatedList = [newCert, ...certsList];
    }

    setCertsList(updatedList);
    setIsAddingCert(false);
    setEditingCertIndex(null);
    setEduSaving(true);

    try {
      const res = await saveLiveCertificates(updatedList);
      setEduToast({
        message: res.error
          ? `Certificate saved in local cache! (Supabase note: ${res.error})`
          : "Certificate successfully saved and synced to database!",
        type: "success",
      });
      setTimeout(() => setEduToast(null), 4000);
    } catch (err: any) {
      alert("Failed to save certificate: " + err.message);
    } finally {
      setEduSaving(false);
    }
  };

  const handleDeleteCert = async (idx: number) => {
    const item = certsList[idx];
    if (!window.confirm(`Are you sure you want to delete "${item?.title}"?`)) return;

    const updatedList = certsList.filter((_, i) => i !== idx);
    setCertsList(updatedList);
    setEduSaving(true);
    try {
      await saveLiveCertificates(updatedList);
      setEduToast({ message: "Certificate removed successfully!", type: "success" });
      setTimeout(() => setEduToast(null), 3000);
    } catch (err: any) {
      alert("Failed to delete certificate: " + err.message);
    } finally {
      setEduSaving(false);
    }
  };

  const handleResetEducationDefaults = async () => {
    if (!window.confirm("Reset Education and Certificates back to default data?")) return;
    setEducationList(EDUCATION_DATA);
    setCertsList(CERTIFICATES_DATA);
    setEduSaving(true);
    try {
      await saveLiveEducation(EDUCATION_DATA);
      await saveLiveCertificates(CERTIFICATES_DATA);
      setEduToast({ message: "Reset to default education & certificates data!", type: "success" });
      setTimeout(() => setEduToast(null), 3000);
    } catch (err: any) {
      alert("Failed to reset: " + err.message);
    } finally {
      setEduSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Bar with Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.08]">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Education &amp; Credentials Studio
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Add, edit, and organize your academic degrees, certifications, and technical credentials in real-time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleResetEducationDefaults}
            className="px-3.5 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-xl transition-all"
            title="Restore default sample degrees and certifications"
          >
            Reset Defaults
          </button>
          <button
            type="button"
            onClick={handleOpenAddDegree}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:opacity-95 shadow-md shadow-indigo-500/20 active:scale-[0.98] transition-all cursor-pointer"
          >
            {renderIcon(FaPlus, { size: 10 })}
            <span>+ Add Degree</span>
          </button>
          <button
            type="button"
            onClick={handleOpenAddCert}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 hover:opacity-95 shadow-md shadow-cyan-500/20 active:scale-[0.98] transition-all cursor-pointer"
          >
            {renderIcon(FaPlus, { size: 10 })}
            <span>+ Add Certificate</span>
          </button>
        </div>
      </div>

      {/* Status & Toast Notification */}
      {eduToast && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3.5 rounded-2xl border text-xs flex items-center gap-3 ${
            eduToast.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              : "bg-rose-500/10 border-rose-500/30 text-rose-300"
          }`}
        >
          {renderIcon(FaCheckCircle, { size: 16 })}
          <span className="font-medium">{eduToast.message}</span>
        </motion.div>
      )}

      {/* SECTION 1: DEGREE PROGRAMS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {renderIcon(FaGraduationCap, { size: 18 })}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                Academic Degree Programs
              </h3>
              <p className="text-[11px] text-slate-400">Formal engineering degrees and academic milestones</p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">
            {educationList.length} Degrees
          </span>
        </div>

        {/* In-Page Add / Edit Degree Form */}
        {(isAddingEdu || editingEduIndex !== null) && (
          <motion.form
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSaveDegree}
            className="p-6 rounded-2xl border border-indigo-500/30 bg-[#111726]/90 shadow-2xl space-y-4 text-xs backdrop-blur-sm"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
              <span className="font-bold text-xs text-indigo-300 font-mono uppercase tracking-wider">
                {editingEduIndex !== null ? "Edit Academic Degree" : "Add New Academic Degree"}
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsAddingEdu(false);
                  setEditingEduIndex(null);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
              >
                {renderIcon(FaTimes, { size: 13 })}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-semibold text-slate-200 mb-1 text-xs">
                  Degree / Program Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={eduForm.degree}
                  onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
                  placeholder="e.g. B.Sc. in Computer Science & Engineering"
                  className="w-full px-3.5 py-2.5 text-xs text-white bg-[#0c101d] border border-white/[0.08] rounded-xl focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 font-medium placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-200 mb-1 text-xs">
                  University / Institution <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={eduForm.institution}
                  onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
                  placeholder="e.g. Bangladesh University of Business and Technology (BUBT)"
                  className="w-full px-3.5 py-2.5 text-xs text-white bg-[#0c101d] border border-white/[0.08] rounded-xl focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 font-medium placeholder:text-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-200 mb-1 text-xs">
                Timeline / Period <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={eduForm.period}
                onChange={(e) => setEduForm({ ...eduForm, period: e.target.value })}
                placeholder="e.g. 2022 - Present or 2019 - 2021"
                className="w-full px-3.5 py-2.5 text-xs text-white bg-[#0c101d] border border-white/[0.08] rounded-xl focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 font-medium placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-200 mb-1 text-xs">
                Program Description &amp; Academic Focus
              </label>
              <textarea
                rows={3}
                value={eduForm.description}
                onChange={(e) => setEduForm({ ...eduForm, description: e.target.value })}
                placeholder="Core focus areas, analytical foundation, major coursework, or achievements..."
                className="w-full px-3.5 py-2.5 text-xs text-white bg-[#0c101d] border border-white/[0.08] rounded-xl focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 leading-relaxed placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-200 mb-1 text-xs">
                Key Highlights &amp; Honors (One per line)
              </label>
              <textarea
                rows={3}
                value={eduForm.highlights}
                onChange={(e) => setEduForm({ ...eduForm, highlights: e.target.value })}
                placeholder={"Dean's List for Academic Performance\nBUBT IT Club Technical Contributor\nWinner of Regional Science Fair"}
                className="w-full px-3.5 py-2.5 text-xs text-white bg-[#0c101d] border border-white/[0.08] rounded-xl focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 font-mono leading-relaxed placeholder:text-slate-500"
              />
            </div>

            {/* Active / Inactive checkbox */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/10">
              <input
                type="checkbox"
                id="isActiveDegree"
                checked={eduForm.isActive}
                onChange={(e) => setEduForm({ ...eduForm, isActive: e.target.checked })}
                className="w-4 h-4 rounded text-cyan-500 bg-slate-800 border-white/20 focus:ring-cyan-500 cursor-pointer"
              />
              <label htmlFor="isActiveDegree" className="text-xs text-slate-300 cursor-pointer">
                <span className="font-semibold text-white">Degree Active</span> &mdash; When checked, this academic program is visible on the public website.
              </label>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={() => {
                  setIsAddingEdu(false);
                  setEditingEduIndex(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={eduSaving}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:opacity-95 shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
              >
                {eduSaving ? renderIcon(FaSpinner, { className: "animate-spin", size: 12 }) : renderIcon(FaSave, { size: 12 })}
                <span>{eduSaving ? "Saving..." : "Save Degree"}</span>
              </button>
            </div>
          </motion.form>
        )}

        {/* Degree Cards List */}
        <div className="space-y-3.5">
          {educationList.length === 0 ? (
            <div className="p-8 text-center rounded-2xl border border-dashed border-white/15 bg-white/[0.01]">
              <p className="text-xs text-slate-400">No degrees added yet. Click "+ Add Degree" to add your first degree.</p>
            </div>
          ) : (
            educationList.map((edu, idx) => {
              const isItemActive = edu.isActive !== false;
              return (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl border transition-all space-y-3 shadow-lg group ${
                    isItemActive
                      ? "bg-[#111726]/75 border-white/[0.08] hover:border-indigo-500/30"
                      : "bg-red-950/10 border-red-500/20 opacity-70"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                          {edu.degree}
                        </h4>
                        <span
                          className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${
                            isItemActive
                              ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                              : "bg-rose-500/10 text-rose-300 border-rose-500/20"
                          }`}
                        >
                          {isItemActive ? "ACTIVE" : "INACTIVE"}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">
                          {edu.period}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-cyan-300 mt-0.5">{edu.institution}</p>
                    </div>

                    <div className="flex items-center gap-1.5 self-end sm:self-auto">
                      {/* Active/Inactive Toggle */}
                      <button
                        type="button"
                        onClick={() => handleToggleDegreeActive(idx)}
                        disabled={eduSaving}
                        className={`p-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
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
                        onClick={() => handleMoveDegree(idx, "up")}
                        disabled={idx === 0 || eduSaving}
                        className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/[0.08] disabled:opacity-30 text-xs transition-all cursor-pointer"
                        title="Move Up"
                      >
                        {renderIcon(FaArrowUp, { size: 11 })}
                      </button>

                      {/* Move Down */}
                      <button
                        type="button"
                        onClick={() => handleMoveDegree(idx, "down")}
                        disabled={idx === educationList.length - 1 || eduSaving}
                        className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/[0.08] disabled:opacity-30 text-xs transition-all cursor-pointer"
                        title="Move Down"
                      >
                        {renderIcon(FaArrowDown, { size: 11 })}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenEditDegree(idx)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-white/[0.04] hover:bg-indigo-500/20 text-slate-300 hover:text-indigo-200 border border-white/[0.08] hover:border-indigo-500/40 transition-all cursor-pointer"
                      >
                        {renderIcon(FaEdit, { size: 11 })}
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteDegree(idx)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-400 bg-white/[0.04] hover:bg-rose-500/15 border border-white/[0.08] hover:border-rose-500/30 transition-all cursor-pointer"
                        title="Delete Degree"
                      >
                        {renderIcon(FaTrash, { size: 11 })}
                      </button>
                    </div>
                  </div>

                  {edu.description && (
                    <p className="text-xs text-slate-400 leading-relaxed font-light">
                      {edu.description}
                    </p>
                  )}

                  {/* Highlights pills */}
                  {Array.isArray(edu.highlights) && edu.highlights.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/[0.06]">
                      {edu.highlights.map((hl: string, hIdx: number) => (
                        <span
                          key={hIdx}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] bg-white/[0.03] border border-white/[0.06] text-slate-300"
                        >
                          <span className="text-indigo-400">✓</span>
                          <span>{hl}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* SECTION 2: CERTIFICATIONS & CREDENTIALS */}
      <div className="space-y-4 pt-6 border-t border-white/[0.08]">
        <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {renderIcon(FaCertificate, { size: 18 })}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                Certifications &amp; Verified Credentials
              </h3>
              <p className="text-[11px] text-slate-400">Technical certifications, conference papers &amp; verified awards</p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
            {certsList.length} Certifications
          </span>
        </div>

        {/* In-Page Add / Edit Certificate Form */}
        {(isAddingCert || editingCertIndex !== null) && (
          <motion.form
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSaveCert}
            className="p-6 rounded-2xl border border-cyan-500/30 bg-[#111726]/90 shadow-2xl space-y-4 text-xs backdrop-blur-sm"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
              <span className="font-bold text-xs text-cyan-300 font-mono uppercase tracking-wider">
                {editingCertIndex !== null ? "Edit Certification Details" : "Add New Certification"}
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsAddingCert(false);
                  setEditingCertIndex(null);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
              >
                {renderIcon(FaTimes, { size: 13 })}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-semibold text-slate-200 mb-1 text-xs">
                  Certificate / Award Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={certForm.title}
                  onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                  placeholder="e.g. Full Stack Development with MERN"
                  className="w-full px-3.5 py-2.5 text-xs text-white bg-[#0c101d] border border-white/[0.08] rounded-xl focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 font-medium placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-200 mb-1 text-xs">
                  Issuing Organization <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={certForm.issuer}
                  onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                  placeholder="e.g. HackerRank, IEEE, Grameenphone Academy"
                  className="w-full px-3.5 py-2.5 text-xs text-white bg-[#0c101d] border border-white/[0.08] rounded-xl focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 font-medium placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-semibold text-slate-200 mb-1 text-xs">
                  Credential Type
                </label>
                <select
                  value={certForm.type}
                  onChange={(e) => setCertForm({ ...certForm, type: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs text-white bg-[#0c101d] border border-white/[0.08] rounded-xl focus:outline-none focus:border-cyan-500/60 font-medium"
                >
                  <option value="Professional">Professional Certification</option>
                  <option value="Achievement">Achievement &amp; Award</option>
                  <option value="Conference">Conference &amp; Publication</option>
                  <option value="Academic">Academic Honor</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-200 mb-1 text-xs">
                  Year Issued
                </label>
                <input
                  type="text"
                  value={certForm.year}
                  onChange={(e) => setCertForm({ ...certForm, year: e.target.value })}
                  placeholder="e.g. 2026"
                  className="w-full px-3.5 py-2.5 text-xs text-white bg-[#0c101d] border border-white/[0.08] rounded-xl focus:outline-none focus:border-cyan-500/60 font-medium placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-semibold text-slate-200 mb-1 text-xs">
                  Verification / Credential URL
                </label>
                <input
                  type="text"
                  value={certForm.link}
                  onChange={(e) => setCertForm({ ...certForm, link: e.target.value })}
                  placeholder="https://www.hackerrank.com/certificates/..."
                  className="w-full px-3.5 py-2.5 text-xs text-white bg-[#0c101d] border border-white/[0.08] rounded-xl focus:outline-none focus:border-cyan-500/60 font-medium placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-200 mb-1 text-xs">
                  Verification ID / License Number
                </label>
                <input
                  type="text"
                  value={certForm.verificationId}
                  onChange={(e) => setCertForm({ ...certForm, verificationId: e.target.value })}
                  placeholder="e.g. 42cafa841d01"
                  className="w-full px-3.5 py-2.5 text-xs text-white bg-[#0c101d] border border-white/[0.08] rounded-xl focus:outline-none focus:border-cyan-500/60 font-medium placeholder:text-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-200 mb-1 text-xs">
                Details &amp; Competencies Covered
              </label>
              <textarea
                rows={2}
                value={certForm.details}
                onChange={(e) => setCertForm({ ...certForm, details: e.target.value })}
                placeholder="Key skills assessed, algorithms, full-stack architecture, or contribution details..."
                className="w-full px-3.5 py-2.5 text-xs text-white bg-[#0c101d] border border-white/[0.08] rounded-xl focus:outline-none focus:border-cyan-500/60 leading-relaxed placeholder:text-slate-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={() => {
                  setIsAddingCert(false);
                  setEditingCertIndex(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={eduSaving}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white rounded-xl bg-gradient-to-r from-cyan-600 via-indigo-600 to-indigo-500 hover:opacity-95 shadow-lg shadow-cyan-500/20 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
              >
                {eduSaving ? renderIcon(FaSpinner, { className: "animate-spin", size: 12 }) : renderIcon(FaSave, { size: 12 })}
                <span>{eduSaving ? "Saving..." : "Save Certificate"}</span>
              </button>
            </div>
          </motion.form>
        )}

        {/* Certificates Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {certsList.length === 0 ? (
            <div className="col-span-full p-8 text-center rounded-2xl border border-dashed border-white/15 bg-white/[0.01]">
              <p className="text-xs text-slate-400">No certifications added yet. Click "+ Add Certificate" to add your first credential.</p>
            </div>
          ) : (
            certsList.map((cert, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl border border-white/[0.08] bg-[#111726]/75 backdrop-blur-sm space-y-2.5 shadow-lg hover:border-cyan-500/30 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                      {cert.type}
                    </span>
                    <span className="text-xs text-slate-400 font-mono font-semibold">{cert.year}</span>
                  </div>

                  <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {cert.title}
                  </h4>
                  <p className="text-xs text-indigo-300 font-medium">{cert.issuer}</p>

                  {cert.details && (
                    <p className="text-xs text-slate-400 leading-relaxed font-light line-clamp-2">
                      {cert.details}
                    </p>
                  )}

                  {cert.verificationId && (
                    <div className="text-[10px] font-mono text-slate-500">
                      ID: <span className="text-slate-300">{cert.verificationId}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                  {cert.link ? (
                    <a
                      href={cert.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                    >
                      <span>Verify Link</span>
                      {renderIcon(FaExternalLinkAlt, { size: 9 })}
                    </a>
                  ) : (
                    <span className="text-[11px] text-slate-600">No verification link</span>
                  )}

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEditCert(idx)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-white/[0.04] hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-200 border border-white/[0.08] hover:border-cyan-500/40 transition-all cursor-pointer"
                    >
                      {renderIcon(FaEdit, { size: 10 })}
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCert(idx)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 bg-white/[0.04] hover:bg-rose-500/15 border border-white/[0.08] hover:border-rose-500/30 transition-all cursor-pointer"
                      title="Delete Certificate"
                    >
                      {renderIcon(FaTrash, { size: 10 })}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
export default EducationTab;
