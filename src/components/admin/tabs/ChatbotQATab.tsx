import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaDownload,
  FaCopy,
  FaCheck,
  FaSearch,
  FaRobot,
  FaDatabase,
} from "react-icons/fa";
import { AdminToast, renderIcon } from "../types";
import { getLiveChatbotQA, saveLiveChatbotQA, deleteLiveChatbotQA, ChatbotQAItem } from "../../../lib/portfolioService";
import defaultChatData from "../../../data/gn_chat.json";

interface QATabProps {
  uploadStatus: string;
}

export const ChatbotQATab: React.FC<QATabProps> = () => {
  const [qaItems, setQaItems] = useState<ChatbotQAItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<ChatbotQAItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [editingItem, setEditingItem] = useState<ChatbotQAItem | null>(null);
  const [toast, setToast] = useState<AdminToast | null>(null);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load from database on mount
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await getLiveChatbotQA();
      setQaItems(data);
      setFilteredItems(data);
    } catch (e) {
      console.error("Failed to load QA from DB", e);
      showToast("Failed to load data from database", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = qaItems.map(i => i.category).filter(Boolean);
    return ["All", ...Array.from(new Set(cats))].sort();
  }, [qaItems]);

  // Search filter
  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();
    const filtered = qaItems.filter((item) => {
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      if (!matchesCategory) return false;
      
      if (!searchTerm.trim()) return true;
      return (
        item.category?.toLowerCase().includes(lowerSearch) ||
        item.answer.toLowerCase().includes(lowerSearch) ||
        item.questions.some((q) => q.toLowerCase().includes(lowerSearch))
      );
    });
    setFilteredItems(filtered);
  }, [searchTerm, qaItems, selectedCategory]);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveItem = async () => {
    if (!editingItem) return;
    if (!editingItem.answer.trim() || editingItem.questions.length === 0) {
      showToast("Answer and at least one question are required.", "error");
      return;
    }

    try {
      const res = await saveLiveChatbotQA(editingItem);
      if (res.success && res.data) {
        if (editingItem.id && editingItem.id > 0) {
          setQaItems((prev) =>
            prev.map((i) => (i.id === editingItem.id ? res.data! : i))
          );
        } else {
          setQaItems((prev) => [res.data!, ...prev]);
        }
        showToast("Q&A pair saved successfully!", "success");
        setEditingItem(null);
      } else {
        showToast(res.error || "Failed to save Q&A pair", "error");
      }
    } catch (e: any) {
      showToast(e.message || "Failed to save Q&A pair", "error");
    }
  };

  const handleDeleteItem = async (id?: number) => {
    if (!id) return;
    if (window.confirm("Are you sure you want to delete this Q&A pair?")) {
      try {
        const success = await deleteLiveChatbotQA(id);
        if (success) {
          setQaItems((prev) => prev.filter((i) => i.id !== id));
          showToast("Q&A pair deleted.", "success");
        } else {
          showToast("Failed to delete Q&A pair.", "error");
        }
      } catch (e: any) {
        showToast(e.message || "Failed to delete Q&A pair", "error");
      }
    }
  };

  const handleCopyJSON = () => {
    // Exclude the id, created_at, updated_at from export if desired, but we can export as is
    const exportData = qaItems.map(({ id, created_at, updated_at, ...rest }) => ({ id, ...rest }));
    navigator.clipboard
      .writeText(JSON.stringify(exportData, null, 2))
      .then(() => {
        setCopied(true);
        showToast("JSON copied to clipboard!", "success");
        setTimeout(() => setCopied(false), 2000);
      });
  };

  const handleDownloadJSON = () => {
    const exportData = qaItems.map(({ id, created_at, updated_at, ...rest }) => ({ id, ...rest }));
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "gn_chat.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("JSON file downloaded!", "success");
  };

  const handleMigrate = async () => {
    if (window.confirm("This will migrate all 330 items from gn_chat.json to Supabase. Continue?")) {
      setIsLoading(true);
      let successCount = 0;
      let failCount = 0;
      
      for (const item of defaultChatData.items) {
        // Prepare item for insert (strip existing ID so Supabase auto-generates it)
        const { id, ...rest } = item;
        const res = await saveLiveChatbotQA(rest as any);
        if (res.success) {
          successCount++;
        } else {
          failCount++;
        }
      }
      
      showToast(`Migration complete. Success: ${successCount}, Failed: ${failCount}`, "success");
      await fetchData();
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-400">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            {renderIcon(FaRobot, { className: "text-indigo-400", size: 24 })}
            Chatbot Knowledge Base (Supabase)
          </h2>
          <p className="text-gray-400 mt-1">
            Manage the Q&A fallback dataset. Changes are saved instantly to the production database.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleMigrate}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 rounded-lg transition-colors border border-purple-500/30"
          >
            {renderIcon(FaDatabase)}
            Migrate Local JSON to DB
          </button>
          <button
            onClick={handleCopyJSON}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-700"
          >
            {copied ? renderIcon(FaCheck, { className: "text-green-400" }) : renderIcon(FaCopy)}
            Copy JSON
          </button>
          <button
            onClick={handleDownloadJSON}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
          >
            {renderIcon(FaDownload)}
            Download JSON
          </button>
        </div>
      </div>

      {toast && (
        <div
          className={`p-4 rounded-lg flex items-center gap-3 ${
            toast.type === "success"
              ? "bg-green-500/10 border border-green-500/20 text-green-400"
              : "bg-red-500/10 border border-red-500/20 text-red-400"
          }`}
        >
          {renderIcon(FaCheck)}
          {toast.message}
        </div>
      )}

      {/* Main Content Area */}
      {editingItem ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 p-6 rounded-xl border border-slate-700"
        >
          <h3 className="text-xl font-bold text-white mb-6">
            {(!editingItem.id || editingItem.id === 0) ? "Add New Q&A" : "Edit Q&A Pair"}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Category
              </label>
              <input
                type="text"
                value={editingItem.category || ""}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, category: e.target.value })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                placeholder="e.g. greetings, skills, contact"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Questions (one per line)
              </label>
              <textarea
                value={editingItem.questions.join("\n")}
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    questions: e.target.value.split("\n").filter(Boolean),
                  })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 h-32"
                placeholder="Enter variations of the question..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Answer
              </label>
              <textarea
                value={editingItem.answer}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, answer: e.target.value })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 h-32"
                placeholder="The answer the chatbot should give..."
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => setEditingItem(null)}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveItem}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              {renderIcon(FaCheck)}
              Save Item
            </button>
          </div>
        </motion.div>
      ) : (
        <>
          {/* Toolbar */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto flex-1">
              <div className="relative w-full md:w-96">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {renderIcon(FaSearch)}
                </div>
                <input
                  type="text"
                  placeholder="Search questions or answers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
              <div className="relative w-full md:w-64">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 transition-colors appearance-none"
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">
                  ▼
                </div>
              </div>
            </div>
            <button
              onClick={() =>
                setEditingItem({
                  id: 0,
                  category: "",
                  questions: [],
                  answer: "",
                })
              }
              className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 rounded-lg transition-colors border border-indigo-500/30"
            >
              {renderIcon(FaPlus)}
              Add New Q&A
            </button>
          </div>

          {/* List */}
          <div className="space-y-4">
            <div className="text-sm text-gray-400">
              Showing {filteredItems.length} of {qaItems.length} items
            </div>
            <AnimatePresence>
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-slate-800/30 border border-slate-700/50 p-4 rounded-xl hover:border-indigo-500/30 transition-colors group"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-mono bg-slate-900 text-gray-400 px-2 py-1 rounded">
                          ID: {item.id}
                        </span>
                        {item.category && (
                          <span className="text-xs font-medium bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded">
                            {item.category}
                          </span>
                        )}
                      </div>
                      <div className="space-y-1 mb-3">
                        {item.questions.map((q, idx) => (
                          <div key={idx} className="text-white font-medium">
                            Q: {q}
                          </div>
                        ))}
                      </div>
                      <div className="text-gray-300 text-sm bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                        <span className="text-green-400 font-bold mr-2">A:</span>
                        {item.answer}
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="p-2 bg-slate-700 hover:bg-indigo-600 text-white rounded-lg transition-colors"
                        title="Edit"
                      >
                        {renderIcon(FaEdit)}
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-2 bg-slate-700 hover:bg-red-600 text-white rounded-lg transition-colors"
                        title="Delete"
                      >
                        {renderIcon(FaTrash)}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {filteredItems.length === 0 && (
              <div className="text-center py-12 text-gray-400 bg-slate-800/20 rounded-xl border border-slate-700/30 border-dashed">
                No matching Q&A pairs found.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
