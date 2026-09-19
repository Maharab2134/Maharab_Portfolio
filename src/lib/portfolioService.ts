import { useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "./supabaseClient";
import { PROJECTS, Project } from "../data/projectsData";
import {
  PORTFOLIO_INFO,
  EDUCATION_DATA,
  CERTIFICATES_DATA,
  EXPERIENCE_DATA,
  DEFAULT_EXPERIENCE_CONFIG,
  EducationItem,
  CertificateItem,
  ExperienceItem,
  ExperienceConfig,
  DEFAULT_SKILL_CATEGORIES,
  DEFAULT_SKILLS_DATA,
  SkillCategory,
  SkillItemData,
  WorkingHoursConfig,
} from "../data/portfolioData";
import {
  DevelopmentProcessConfig,
  DEFAULT_PROCESS_CONFIG,
} from "../data/processData";
import { VscVscode, VscCode, VscTerminal } from "react-icons/vsc";
import {
  FaReact,
  FaNodeJs,
  FaGitAlt,
  FaMobileAlt,
  FaPython,
  FaJava,
  FaAndroid,
  FaFigma,
  FaHtml5,
  FaCss3Alt,
  FaDocker,
  FaLinux,
  FaCode,
  FaServer,
  FaDatabase,
  FaBrain,
  FaMicrochip,
  FaTerminal,
  FaCloud,
  FaShieldAlt,
  FaTools,
  FaLayerGroup,
  FaNetworkWired,
  FaLaptopCode,
  FaCogs,
  FaCube,
  FaFire,
  FaGlobe,
  FaAws,
  FaGithub,
  FaGitlab,
  FaBitbucket,
  FaUbuntu,
  FaStripe,
  FaWordpress,
  FaShopify,
  FaTrello,
  FaSlack,
  FaMarkdown,
} from "react-icons/fa";
import {
  SiMongodb,
  SiExpress,
  SiPostman,
  SiTensorflow,
  SiFlutter,
  SiKotlin,
  SiMysql,
  SiFirebase,
  SiArduino,
  SiCplusplus,
  SiJavascript,
  SiPostgresql,
  SiTailwindcss,
  SiNextdotjs,
  SiTypescript,
  SiVuedotjs,
  SiAngular,
  SiSvelte,
  SiGraphql,
  SiRedux,
  SiRedis,
  SiNginx,
  SiKubernetes,
  SiGooglecloud,
  SiVercel,
  SiSupabase,
  SiDjango,
  SiFastapi,
  SiFlask,
  SiSpringboot,
  SiPytorch,
  SiPandas,
  SiNumpy,
  SiScikitlearn,
  SiOpencv,
  SiRust,
  SiGo,
  SiPhp,
  SiRubyonrails,
  SiSwift,
  SiDart,
  SiVite,
  SiPrisma,
  SiNetlify,
  SiCloudflare,
  SiOpenai,
  SiJupyter,
  SiNotion,
  SiInsomnia,
  SiSwagger,
  SiJest,
  SiCypress,
  SiVitest,
  SiEslint,
  SiPrettier,
  SiWebpack,
  SiBabel,
  SiNpm,
  SiYarn,
  SiPnpm,
  SiBun,
  SiDeno,
  SiWebstorm,
  SiPycharm,
  SiIntellijidea,
  SiSublimetext,
  SiBootstrap,
  SiSass,
  SiSqlite,
  SiMariadb,
  SiCanva,
  SiJira,
  SiDebian,
  SiArchlinux,
  SiRaspberrypi,
  SiEspressif,
  SiApollographql,
  SiHuggingface,
  SiSocketdotio,
} from "react-icons/si";

export interface ExtendedProject extends Project {
  db_id?: string;
  _local_updated_at?: number;
}

export const mapSupabaseToProject = (raw: any): ExtendedProject => {
  const categoryStr = (raw.category || "web").toLowerCase();
  let cat: "web" | "mobile" | "ml" | "iot" = "web";
  let catLabel = raw.category || "Web App";

  if (categoryStr.includes("mobile")) {
    cat = "mobile";
    catLabel = "Mobile App";
  } else if (categoryStr.includes("ai") || categoryStr.includes("ml") || categoryStr.includes("learning")) {
    cat = "ml";
    catLabel = "AI / ML";
  } else if (categoryStr.includes("iot") || categoryStr.includes("hardware") || categoryStr.includes("embedded")) {
    cat = "iot";
    catLabel = "IoT & Hardware";
  } else if (categoryStr.includes("full") || categoryStr.includes("web")) {
    cat = "web";
    catLabel = "Web App";
  }

  return {
    id: raw.project_id || raw.id,
    db_id: raw.id,
    title: raw.title || "Untitled Project",
    subtitle: raw.short_desc || raw.description || "",
    category: cat,
    categoryLabel: catLabel,
    description: raw.short_desc || raw.description || "",
    longDescription: raw.full_desc || raw.longDescription || raw.description || "",
    problem: raw.problem || "Solving user accessibility and automated real-time workflows.",
    solution: raw.solution || "Architected a scalable, responsive system with modern design patterns.",
    features: Array.isArray(raw.features) ? raw.features : [],
    results: Array.isArray(raw.results) ? raw.results : ["100% responsive", "Production ready"],
    technologies: Array.isArray(raw.technologies)
      ? raw.technologies
      : typeof raw.technologies === "string"
      ? raw.technologies.split(",").map((t: string) => t.trim()).filter(Boolean)
      : ["React", "Node.js"],
    image: raw.image_url || raw.image || "https://placehold.co/600x400/0f172a/cbd5e1?text=Project",
    fallbackGradient: "from-purple-900 to-indigo-950",
    link: raw.live_url || raw.link || "",
    github: raw.github_url || raw.github || "",
    featured: Boolean(raw.featured),
    year: raw.year || "2024",
    orderIndex: raw.order_index !== undefined ? Number(raw.order_index) : (raw.orderIndex !== undefined ? Number(raw.orderIndex) : undefined),
  };
};

// Smart Video Embed URL parser (Google Drive, YouTube, Loom, direct video links)
export const getVideoEmbedUrl = (raw?: string | null): string => {
  if (!raw || typeof raw !== "string") return "";
  const trimmed = raw.trim();
  if (!trimmed) return "";

  // YouTube watch or embed or short link
  const ytMatch = trimmed.match(
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
  );
  if (ytMatch?.[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`;
  }

  // Google Drive file link: drive.google.com/file/d/{id}/...
  const driveMatch = trimmed.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (driveMatch?.[1]) {
    return `https://drive.google.com/file/d/${driveMatch[1]}/preview?autoplay=1`;
  }

  // Google Drive uc link: drive.google.com/uc?id={id}
  const driveUcMatch = trimmed.match(/drive\.google\.com\/uc\?[^\s]*id=([^&]+)/);
  if (driveUcMatch?.[1]) {
    return `https://drive.google.com/file/d/${driveUcMatch[1]}/preview?autoplay=1`;
  }

  // Loom share link: loom.com/share/{id}
  const loomMatch = trimmed.match(/loom\.com\/share\/([^?]+)/);
  if (loomMatch?.[1]) {
    return `https://www.loom.com/embed/${loomMatch[1]}?autoplay=1`;
  }

  // If raw is just a Google Drive alphanumeric ID (length >= 20)
  if (/^[a-zA-Z0-9_-]{20,}$/.test(trimmed)) {
    return `https://drive.google.com/file/d/${trimmed}/preview?autoplay=1`;
  }

  return trimmed;
};

// Category priority: Web Developer first, then Mobile, AI/ML, and IoT
export const getCategoryPriority = (cat?: string): number => {
  const c = (cat || "").toLowerCase();
  if (c === "web") return 1;
  if (c === "mobile") return 2;
  if (c === "ml" || c === "ai") return 3;
  if (c === "iot" || c === "hardware") return 4;
  return 5;
};

// Sort projects respecting user's custom order, then category priority (Web First)
export const sortProjectsWithPriority = (projects: ExtendedProject[]): ExtendedProject[] => {
  // 1. Check if user has saved a manual order sequence
  let customOrderIds: string[] = [];
  try {
    const raw = localStorage.getItem("maharab_projects_order");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        customOrderIds = parsed.map(String);
      }
    }
  } catch (e) {}

  if (customOrderIds.length > 0) {
    return [...projects].sort((a, b) => {
      const idA = a.id || (a as any).project_id;
      const idB = b.id || (b as any).project_id;
      const idxA = customOrderIds.indexOf(idA);
      const idxB = customOrderIds.indexOf(idB);

      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;

      return getCategoryPriority(a.category) - getCategoryPriority(b.category);
    });
  }

  // 2. Check if projects have an explicit orderIndex
  const hasOrderIndex = projects.some((p) => p.orderIndex !== undefined || (p as any).order_index !== undefined);
  if (hasOrderIndex) {
    return [...projects].sort((a, b) => {
      const ordA = a.orderIndex ?? (a as any).order_index ?? 9999;
      const ordB = b.orderIndex ?? (b as any).order_index ?? 9999;
      if (ordA !== ordB) return ordA - ordB;
      return getCategoryPriority(a.category) - getCategoryPriority(b.category);
    });
  }

  // 3. Default category priority: Web Developer first (Web -> Mobile -> AI/ML -> IoT)
  return [...projects].sort((a, b) => {
    const catDiff = getCategoryPriority(a.category) - getCategoryPriority(b.category);
    if (catDiff !== 0) return catDiff;
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });
};

// Persist custom order and trigger live sync
export const saveProjectOrder = async (orderedList: ExtendedProject[]): Promise<boolean> => {
  try {
    const ids = orderedList.map((p) => p.id || (p as any).project_id);
    localStorage.setItem("maharab_projects_order", JSON.stringify(ids));

    const updatedWithOrder = orderedList.map((p, idx) => ({
      ...p,
      orderIndex: idx,
      _local_updated_at: Date.now(),
    }));
    localStorage.setItem("maharab_cached_projects", JSON.stringify(updatedWithOrder));

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("portfolio_projects_updated"));
    }

    if (isSupabaseConfigured && supabase) {
      const client = supabase;
      Promise.allSettled(
        updatedWithOrder.map((proj, idx) =>
          client
            .from("projects")
            .update({ order_index: idx })
            .or(`project_id.eq.${proj.id},id.eq.${proj.id}`)
        )
      ).catch(() => {});
    }

    return true;
  } catch (e) {
    console.error("Failed to save project order:", e);
    return false;
  }
};

// Fetch live projects (Supabase + LocalStorage Smart Merge + Web First Priority)
export const getLiveProjects = async (): Promise<ExtendedProject[]> => {
  let cachedList: ExtendedProject[] = [];

  // 1. Read localStorage cache first
  try {
    const cached = localStorage.getItem("maharab_cached_projects");
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        cachedList = parsed;
      }
    }
  } catch (e) {
    console.warn("Failed to read cached projects:", e);
  }

  // 2. Fetch from Supabase if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        const supabaseMapped = data.map(mapSupabaseToProject);

        // Smart merge: Keep local edits if they are newer or not yet in Supabase
        const merged: ExtendedProject[] = [];
        const seenIds = new Set<string>();

        // Check each Supabase project against local cache
        for (const sp of supabaseMapped) {
          const localMatch = cachedList.find(
            (cp) => cp.id === sp.id || cp.title.toLowerCase() === sp.title.toLowerCase()
          );

          if (localMatch && localMatch._local_updated_at) {
            merged.push(localMatch);
          } else {
            merged.push(sp);
          }
          seenIds.add(sp.id);
        }

        // Also add any completely new locally created projects not in Supabase yet
        for (const cp of cachedList) {
          if (!seenIds.has(cp.id)) {
            merged.unshift(cp);
            seenIds.add(cp.id);
          }
        }

        const sortedMerged = sortProjectsWithPriority(merged);

        try {
          localStorage.setItem("maharab_cached_projects", JSON.stringify(sortedMerged));
        } catch (e) {}

        return sortedMerged;
      }
    } catch (err) {
      console.warn("Supabase fetch failed, falling back to local data:", err);
    }
  }

  // If Supabase is empty or failed, use cached list if available
  if (cachedList.length > 0) {
    return sortProjectsWithPriority(cachedList);
  }

  // Fallback to static PROJECTS data
  return sortProjectsWithPriority(PROJECTS.map((p) => ({ ...p, _local_updated_at: 0 })));
};

// Save or Update a Project in Supabase and LocalStorage
export const saveLiveProject = async (
  payload: any
): Promise<{ success: boolean; savedLocallyOnly?: boolean; error?: string }> => {
  const projectSlug =
    payload.project_id ||
    payload.id ||
    payload.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  const catRaw = (payload.category || "web").toLowerCase();
  let canonicalCat: "web" | "mobile" | "ml" | "iot" = "web";
  if (catRaw.includes("mobile")) canonicalCat = "mobile";
  else if (catRaw.includes("ai") || catRaw.includes("ml")) canonicalCat = "ml";
  else if (catRaw.includes("iot") || catRaw.includes("hardware")) canonicalCat = "iot";

  const dbPayload = {
    title: payload.title,
    project_id: projectSlug,
    category: canonicalCat,
    short_desc: payload.short_desc || payload.description || "",
    full_desc: payload.full_desc || payload.longDescription || payload.description || "",
    image_url: payload.image_url || payload.image || "",
    technologies: Array.isArray(payload.technologies)
      ? payload.technologies.map((t: any) => String(t).trim()).filter(Boolean)
      : typeof payload.technologies === "string"
      ? payload.technologies
          .split(",")
          .map((t: string) => t.trim())
          .filter(Boolean)
      : [],
    features: Array.isArray(payload.features)
      ? payload.features.map((f: any) => String(f).trim()).filter(Boolean)
      : typeof payload.features === "string"
      ? payload.features
          .split("\n")
          .map((f: string) => f.trim())
          .filter(Boolean)
      : [],
    github_url: payload.github_url || payload.github || "",
    live_url: payload.live_url || payload.link || "",
    featured: Boolean(payload.featured),
  };

  const localUpdatedObj: ExtendedProject = {
    ...mapSupabaseToProject(dbPayload),
    id: projectSlug,
    _local_updated_at: Date.now(),
  };

  // 1. ALWAYS update localStorage cache immediately so work is NEVER lost
  try {
    let currentList: ExtendedProject[] = [];
    const cached = localStorage.getItem("maharab_cached_projects");
    if (cached) {
      try {
        currentList = JSON.parse(cached);
      } catch (e) {}
    }
    if (!Array.isArray(currentList) || currentList.length === 0) {
      currentList = PROJECTS.map((p) => ({ ...p }));
    }

    const existingIndex = currentList.findIndex(
      (p) => p.id === projectSlug || p.title.toLowerCase() === payload.title.toLowerCase()
    );

    let nextList: ExtendedProject[];
    if (existingIndex >= 0) {
      nextList = [...currentList];
      nextList[existingIndex] = {
        ...nextList[existingIndex],
        ...localUpdatedObj,
      };
    } else {
      nextList = [localUpdatedObj, ...currentList];
    }
    localStorage.setItem("maharab_cached_projects", JSON.stringify(nextList));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("portfolio_projects_updated"));
    }
  } catch (e) {
    console.error("Local storage save error:", e);
  }

  // 2. Try saving to Supabase
  if (isSupabaseConfigured && supabase) {
    try {
      // First try to check if the row exists in Supabase by project_id
      const { data: existingRows } = await supabase
        .from("projects")
        .select("id")
        .eq("project_id", projectSlug)
        .limit(1);

      if (existingRows && existingRows.length > 0) {
        // Project exists in Supabase -> UPDATE it
        const { error: updateError } = await supabase
          .from("projects")
          .update(dbPayload)
          .eq("project_id", projectSlug);

        if (updateError) {
          console.warn("Supabase update error:", updateError);
          return {
            success: true,
            savedLocallyOnly: true,
            error: updateError.message,
          };
        }
      } else {
        // Project doesn't exist -> INSERT it
        const { error: insertError } = await supabase
          .from("projects")
          .insert([dbPayload]);

        if (insertError) {
          // If insert fails on conflict, try upsert
          const { error: upsertError } = await supabase
            .from("projects")
            .upsert(dbPayload, { onConflict: "project_id" });

          if (upsertError) {
            console.warn("Supabase insert/upsert error:", upsertError);
            return {
              success: true,
              savedLocallyOnly: true,
              error: upsertError.message,
            };
          }
        }
      }
    } catch (err: any) {
      console.warn("Supabase network error:", err);
      return {
        success: true,
        savedLocallyOnly: true,
        error: err.message || "Failed to reach Supabase",
      };
    }
  }

  return { success: true };
};

// Delete a project safely
export const deleteLiveProject = async (id: string): Promise<boolean> => {
  // 1. Remove from localStorage
  try {
    let currentList: ExtendedProject[] = [];
    const cached = localStorage.getItem("maharab_cached_projects");
    if (cached) {
      try {
        currentList = JSON.parse(cached);
      } catch (e) {}
    }
    const updated = currentList.filter((p) => p.id !== id);
    localStorage.setItem("maharab_cached_projects", JSON.stringify(updated));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("portfolio_projects_updated"));
    }
  } catch (e) {}

  // 2. Remove from Supabase if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      if (isUuid) {
        await supabase.from("projects").delete().eq("id", id);
      } else {
        await supabase.from("projects").delete().eq("project_id", id);
      }
    } catch (e) {
      console.warn("Supabase delete failed:", e);
    }
  }

  return true;
};

// --- Contact Inquiries & Notification Service ---
export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  source?: "whatsapp" | "email" | "form" | "hire";
  created_at: string;
  read?: boolean;
}

const STORAGE_MESSAGES_KEY = "maharab_contact_messages";
const STORAGE_READ_MESSAGES_KEY = "maharab_read_messages";
const STORAGE_DELETED_MESSAGES_KEY = "maharab_deleted_messages";
const STORAGE_DELETED_FINGERPRINTS_KEY = "maharab_deleted_fingerprints";

export const getReadMessageIds = (): Set<string> => {
  try {
    const raw = localStorage.getItem(STORAGE_READ_MESSAGES_KEY);
    if (raw) return new Set(JSON.parse(raw));
  } catch (e) {}
  return new Set();
};

export const getDeletedMessageIds = (): Set<string> => {
  try {
    const raw = localStorage.getItem(STORAGE_DELETED_MESSAGES_KEY);
    if (raw) return new Set(JSON.parse(raw));
  } catch (e) {}
  return new Set();
};

export const getDeletedMessageFingerprints = (): Set<string> => {
  try {
    const raw = localStorage.getItem(STORAGE_DELETED_FINGERPRINTS_KEY);
    if (raw) return new Set(JSON.parse(raw));
  } catch (e) {}
  return new Set();
};

// Computes a consistent signature for identifying duplicates and tombstones
export const getMessageFingerprint = (msg: {
  email?: string;
  message?: string;
  subject?: string;
  name?: string;
}): string => {
  const normEmail = (msg.email || "").toLowerCase().trim();
  const normMsg = (msg.message || "").toLowerCase().trim().replace(/\s+/g, " ").slice(0, 120);
  const normSubj = (msg.subject || "").toLowerCase().trim().replace(/\s+/g, " ").slice(0, 50);
  return `${normEmail}___${normSubj}___${normMsg}`;
};

export const markMessageAsRead = (id: string): void => {
  try {
    const ids = getReadMessageIds();
    ids.add(id);
    localStorage.setItem(STORAGE_READ_MESSAGES_KEY, JSON.stringify(Array.from(ids)));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("portfolio_messages_updated"));
    }
  } catch (e) {}
};

export const markAllMessagesAsRead = (allIds: string[]): void => {
  try {
    const ids = getReadMessageIds();
    allIds.forEach((id) => ids.add(id));
    localStorage.setItem(STORAGE_READ_MESSAGES_KEY, JSON.stringify(Array.from(ids)));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("portfolio_messages_updated"));
    }
  } catch (e) {}
};

let lastSubmissionTimestamp = 0;
let lastSubmissionFingerprint = "";

export const recordContactInquiry = async (data: {
  name: string;
  email: string;
  subject?: string;
  message: string;
  source?: "whatsapp" | "email" | "form" | "hire";
}): Promise<{ success: boolean; id: string }> => {
  const currentFingerprint = getMessageFingerprint(data);
  const now = Date.now();
  // Prevent duplicate accidental double-clicks or rapid calls within 3 seconds
  if (currentFingerprint === lastSubmissionFingerprint && now - lastSubmissionTimestamp < 3000) {
    return { success: true, id: "debounced" };
  }
  lastSubmissionTimestamp = now;
  lastSubmissionFingerprint = currentFingerprint;

  let assignedId = `msg_${now}_${Math.random().toString(36).substring(2, 7)}`;
  const timestamp = new Date().toISOString();

  const inquiryRecord: ContactInquiry = {
    id: assignedId,
    name: data.name.trim() || "Website Visitor",
    email: data.email.trim() || "visitor@direct.contact",
    subject:
      data.subject?.trim() ||
      (data.source === "whatsapp"
        ? "WhatsApp Fast-Track Inquiry"
        : data.source === "hire"
        ? "Let's Collaborate Proposal"
        : "Direct Email Inquiry"),
    message: data.message.trim(),
    source: data.source || "form",
    created_at: timestamp,
    read: false,
  };

  // 1. Persist into Supabase contact_messages table first if configured to get authoritative DB ID
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: insertedData } = await supabase
        .from("contact_messages")
        .insert([
          {
            name: inquiryRecord.name,
            email: inquiryRecord.email,
            subject: inquiryRecord.subject,
            message: inquiryRecord.message,
            created_at: timestamp,
          },
        ])
        .select("id");

      if (insertedData && insertedData[0]?.id) {
        assignedId = String(insertedData[0].id);
        inquiryRecord.id = assignedId;
      }
    } catch (err) {
      console.warn("Supabase contact_messages insert note (local backup active):", err);
    }
  }

  // 2. Cache in localStorage for instant offline access and deduplication
  try {
    const existingRaw = localStorage.getItem(STORAGE_MESSAGES_KEY);
    const existingList: ContactInquiry[] = existingRaw ? JSON.parse(existingRaw) : [];
    // Ensure no existing item with same fingerprint or ID is kept duplicated
    const filtered = existingList.filter(
      (m) => m.id !== assignedId && getMessageFingerprint(m) !== currentFingerprint
    );
    const updated = [inquiryRecord, ...filtered];
    localStorage.setItem(STORAGE_MESSAGES_KEY, JSON.stringify(updated.slice(0, 100)));
  } catch (e) {
    console.warn("Failed to cache inquiry locally:", e);
  }

  // 3. Dispatch events for real-time notification in Admin navbar and inbox
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("portfolio_new_inquiry", { detail: inquiryRecord }));
    window.dispatchEvent(new Event("portfolio_messages_updated"));
  }

  return { success: true, id: assignedId };
};

export const getLiveMessages = async (): Promise<ContactInquiry[]> => {
  let localList: ContactInquiry[] = [];
  try {
    const raw = localStorage.getItem(STORAGE_MESSAGES_KEY);
    if (raw) localList = JSON.parse(raw);
  } catch (e) {}

  const readIds = getReadMessageIds();
  const deletedIds = getDeletedMessageIds();
  const deletedFingerprints = getDeletedMessageFingerprints();

  // Filter out any tombstoned messages from local list
  localList = localList.filter(
    (m) => !deletedIds.has(m.id) && !deletedFingerprints.has(getMessageFingerprint(m))
  );

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        const mergedMap = new Map<string, ContactInquiry>();
        const seenFingerprints = new Set<string>();

        // 1. Process Supabase messages first (authoritative database IDs)
        data.forEach((row: any) => {
          const rowId = String(row.id);
          const fp = getMessageFingerprint(row);

          // If this message was deleted by the user, skip it!
          if (deletedIds.has(rowId) || deletedFingerprints.has(fp)) {
            return;
          }

          // If exact duplicate content already seen in Supabase, skip duplicate
          if (seenFingerprints.has(fp)) {
            return;
          }
          seenFingerprints.add(fp);

          const subj = (row.subject || "").toLowerCase();
          const body = (row.message || "").toLowerCase();
          let detectedSource: "whatsapp" | "email" | "hire" | "form" = "form";
          if (subj.includes("whatsapp") || body.includes("whatsapp")) detectedSource = "whatsapp";
          else if (subj.includes("hire") || body.includes("collaborat")) detectedSource = "hire";
          else if (subj.includes("email") || body.includes("email")) detectedSource = "email";

          mergedMap.set(rowId, {
            id: rowId,
            name: row.name || "Anonymous Visitor",
            email: row.email || "No Email",
            subject: row.subject || "General Inquiry",
            message: row.message || "",
            created_at: row.created_at || new Date().toISOString(),
            source: detectedSource,
            read: readIds.has(rowId),
          });
        });

        // 2. Merge local messages ONLY if not already in Supabase (by ID and by content fingerprint)
        localList.forEach((local) => {
          const localFp = getMessageFingerprint(local);
          if (deletedIds.has(local.id) || deletedFingerprints.has(localFp)) {
            return;
          }
          if (mergedMap.has(local.id) || seenFingerprints.has(localFp)) {
            // Already present from Supabase, discard local copy to prevent duplicate 2x display
            return;
          }

          seenFingerprints.add(localFp);
          mergedMap.set(local.id, {
            ...local,
            read: readIds.has(local.id),
          });
        });

        const sorted = Array.from(mergedMap.values()).sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        // Re-persist clean, deduplicated, non-deleted list back to localStorage
        try {
          localStorage.setItem(STORAGE_MESSAGES_KEY, JSON.stringify(sorted.slice(0, 100)));
        } catch (e) {}

        return sorted;
      }
    } catch (e) {
      console.warn("Supabase messages fetch fallback:", e);
    }
  }

  // Fallback when Supabase is not configured or offline: deduplicate local list
  const seenFp = new Set<string>();
  const deduplicatedLocal: ContactInquiry[] = [];
  for (const m of localList) {
    const fp = getMessageFingerprint(m);
    if (!deletedIds.has(m.id) && !deletedFingerprints.has(fp) && !seenFp.has(fp)) {
      seenFp.add(fp);
      deduplicatedLocal.push({ ...m, read: readIds.has(m.id) });
    }
  }

  try {
    localStorage.setItem(STORAGE_MESSAGES_KEY, JSON.stringify(deduplicatedLocal.slice(0, 100)));
  } catch (e) {}

  return deduplicatedLocal;
};

export const deleteLiveMessage = async (
  id: string,
  messageObj?: Partial<ContactInquiry>
): Promise<boolean> => {
  let targetFingerprint = messageObj ? getMessageFingerprint(messageObj) : "";

  // 1. Delete from localStorage and record tombstone so it can never resurrect
  try {
    const raw = localStorage.getItem(STORAGE_MESSAGES_KEY);
    if (raw) {
      const list: ContactInquiry[] = JSON.parse(raw);
      if (!targetFingerprint) {
        const found = list.find((m) => m.id === id);
        if (found) targetFingerprint = getMessageFingerprint(found);
      }
      const filtered = list.filter(
        (m) =>
          m.id !== id &&
          (targetFingerprint ? getMessageFingerprint(m) !== targetFingerprint : true)
      );
      localStorage.setItem(STORAGE_MESSAGES_KEY, JSON.stringify(filtered));
    }

    // Add to tombstone sets
    const deletedIds = getDeletedMessageIds();
    deletedIds.add(id);
    localStorage.setItem(STORAGE_DELETED_MESSAGES_KEY, JSON.stringify(Array.from(deletedIds)));

    if (targetFingerprint) {
      const deletedFp = getDeletedMessageFingerprints();
      deletedFp.add(targetFingerprint);
      localStorage.setItem(
        STORAGE_DELETED_FINGERPRINTS_KEY,
        JSON.stringify(Array.from(deletedFp))
      );
    }

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("portfolio_messages_updated"));
    }
  } catch (e) {
    console.warn("Local storage delete error:", e);
  }

  // 2. Attempt Supabase delete
  if (isSupabaseConfigured && supabase) {
    try {
      if (!id.startsWith("msg_")) {
        await supabase.from("contact_messages").delete().eq("id", id);
      }
    } catch (e) {
      console.warn("Supabase message delete error:", e);
    }
  }
  return true;
};

// Smart Typewriter Phrases parser
export const parseTypewriterPhrases = (val: any): string[] => {
  if (Array.isArray(val)) {
    const filtered = val.map((s) => String(s).trim()).filter(Boolean);
    if (filtered.length > 0) return filtered;
  } else if (typeof val === "string") {
    const items = val.includes("\n")
      ? val.split("\n")
      : val.includes(",")
      ? val.split(",")
      : [val];
    const filtered = items.map((s) => s.trim()).filter(Boolean);
    if (filtered.length > 0) return filtered;
  }
  return [
    "Scalable Full-Stack Web Apps",
    "Cross-Platform Mobile Experiences",
    "High-Throughput REST & GraphQL APIs",
    "Secure Microservices Architecture",
  ];
};

export interface WorkStatusResult {
  isOnline: boolean;
  statusLabel: string;
  timeString: string;
  timezone: string;
  scheduleText: string;
  mode: "auto" | "online" | "offline";
}

// Calculate whether developer is currently active/online based on timezone & schedule
export const calculateWorkStatus = (
  workingHoursConfig?: Partial<WorkingHoursConfig>
): WorkStatusResult => {
  const fallback = (PORTFOLIO_INFO as any).workingHours || {
    enabled: true,
    mode: "auto",
    startTime: "09:00",
    endTime: "22:00",
    timezone: "Asia/Dhaka",
    onlineLabel: "Available for Work",
    offlineLabel: "Currently Away / Offline",
  };

  const cfg: WorkingHoursConfig = {
    enabled: workingHoursConfig?.enabled !== undefined ? Boolean(workingHoursConfig.enabled) : fallback.enabled,
    mode: workingHoursConfig?.mode || fallback.mode || "auto",
    startTime: workingHoursConfig?.startTime || fallback.startTime || "09:00",
    endTime: workingHoursConfig?.endTime || fallback.endTime || "22:00",
    timezone: workingHoursConfig?.timezone || fallback.timezone || "Asia/Dhaka",
    onlineLabel: workingHoursConfig?.onlineLabel || fallback.onlineLabel || "Available for Work",
    offlineLabel: workingHoursConfig?.offlineLabel || fallback.offlineLabel || "Currently Away / Offline",
  };

  // If manual override: online
  if (cfg.mode === "online") {
    return {
      isOnline: true,
      statusLabel: cfg.onlineLabel,
      timeString: "",
      timezone: cfg.timezone,
      scheduleText: "Always Online (Manual Override)",
      mode: "online",
    };
  }

  // If manual override: offline
  if (cfg.mode === "offline") {
    return {
      isOnline: false,
      statusLabel: cfg.offlineLabel,
      timeString: "",
      timezone: cfg.timezone,
      scheduleText: "Offline (Manual Override)",
      mode: "offline",
    };
  }

  // Auto mode: calculate against current time in configured timezone
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: cfg.timezone,
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    });
    const parts = formatter.formatToParts(now);
    const hourPart = parts.find((p) => p.type === "hour")?.value || "0";
    const minutePart = parts.find((p) => p.type === "minute")?.value || "0";
    const currentMinutes = parseInt(hourPart, 10) * 60 + parseInt(minutePart, 10);

    const [startH, startM] = cfg.startTime.split(":").map((v) => parseInt(v, 10) || 0);
    const [endH, endM] = cfg.endTime.split(":").map((v) => parseInt(v, 10) || 0);
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    let isOnline = false;
    if (startMinutes <= endMinutes) {
      // Normal shift (e.g. 09:00 - 22:00)
      isOnline = currentMinutes >= startMinutes && currentMinutes < endMinutes;
    } else {
      // Cross-midnight shift (e.g. 20:00 - 04:00)
      isOnline = currentMinutes >= startMinutes || currentMinutes < endMinutes;
    }

    const displayFormatter = new Intl.DateTimeFormat("en-US", {
      timeZone: cfg.timezone,
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    const timeString = displayFormatter.format(now);

    return {
      isOnline,
      statusLabel: isOnline ? cfg.onlineLabel : cfg.offlineLabel,
      timeString,
      timezone: cfg.timezone,
      scheduleText: `${cfg.startTime} – ${cfg.endTime} (${cfg.timezone.replace("_", " ")})`,
      mode: "auto",
    };
  } catch (err) {
    return {
      isOnline: true,
      statusLabel: cfg.onlineLabel,
      timeString: "",
      timezone: cfg.timezone,
      scheduleText: `${cfg.startTime} – ${cfg.endTime}`,
      mode: "auto",
    };
  }
};

// Profile Info Service
export const getLiveProfile = async (): Promise<typeof PORTFOLIO_INFO> => {
  try {
    const cached = localStorage.getItem("maharab_cached_profile");
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && (parsed.name || parsed.resume_url || parsed.resumeUrl)) {
        return {
          ...PORTFOLIO_INFO,
          ...parsed,
          name: parsed.name || PORTFOLIO_INFO.name,
          shortName: parsed.short_name || parsed.shortName || PORTFOLIO_INFO.shortName,
          title: parsed.title || PORTFOLIO_INFO.title,
          typewriterPrefix:
            parsed.typewriter_prefix !== undefined
              ? parsed.typewriter_prefix
              : parsed.typewriterPrefix !== undefined
              ? parsed.typewriterPrefix
              : PORTFOLIO_INFO.typewriterPrefix,
          typewriterPhrases: parseTypewriterPhrases(
            parsed.typewriter_phrases !== undefined
              ? parsed.typewriter_phrases
              : parsed.typewriterPhrases
          ),
          bio: parsed.bio || PORTFOLIO_INFO.bio,
          footerBio:
            parsed.footer_bio ||
            parsed.footerBio ||
            (PORTFOLIO_INFO as any).footerBio ||
            "Full-Stack Software Engineer & Mobile Developer dedicated to creating scalable, resilient digital experiences with thoughtful design.",
          footer_bio:
            parsed.footer_bio ||
            parsed.footerBio ||
            (PORTFOLIO_INFO as any).footerBio ||
            "Full-Stack Software Engineer & Mobile Developer dedicated to creating scalable, resilient digital experiences with thoughtful design.",
          email: parsed.email || PORTFOLIO_INFO.email,
          phone: parsed.phone || PORTFOLIO_INFO.phone,
          location: parsed.location || PORTFOLIO_INFO.location,
          mapsUrl:
            parsed.maps_url ||
            parsed.mapsUrl ||
            (parsed.location
              ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(parsed.location)}`
              : PORTFOLIO_INFO.mapsUrl),
          maps_url:
            parsed.maps_url ||
            parsed.mapsUrl ||
            (parsed.location
              ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(parsed.location)}`
              : PORTFOLIO_INFO.mapsUrl),
          resumeUrl: parsed.resume_url || parsed.resumeUrl || PORTFOLIO_INFO.resumeUrl,
          stats: {
            ...PORTFOLIO_INFO.stats,
            yearsExperience: parsed.years_experience || parsed.stats?.yearsExperience || PORTFOLIO_INFO.stats.yearsExperience,
            projectsCompleted: parsed.projects_completed || parsed.stats?.projectsCompleted || PORTFOLIO_INFO.stats.projectsCompleted,
            satisfactionRate: parsed.satisfaction_rate || parsed.stats?.satisfactionRate || PORTFOLIO_INFO.stats.satisfactionRate,
          },
          aboutStats:
            parsed.aboutStats ||
            parsed.about_stats ||
            (parsed.about_stat1_val ? [
              { value: parsed.about_stat1_val, label: parsed.about_stat1_lbl || "Project Experience" },
              { value: parsed.about_stat2_val || "15+", label: parsed.about_stat2_lbl || "Projects" },
              { value: parsed.about_stat3_val || "10+", label: parsed.about_stat3_lbl || "Technologies" },
              { value: parsed.about_stat4_val || "CSE", label: parsed.about_stat4_lbl || "Academic Background" },
            ] : (PORTFOLIO_INFO as any).aboutStats),
          about_stat1_val: parsed.about_stat1_val || (PORTFOLIO_INFO as any).aboutStats?.[0]?.value || "2+ Years",
          about_stat1_lbl: parsed.about_stat1_lbl || (PORTFOLIO_INFO as any).aboutStats?.[0]?.label || "Project Experience",
          about_stat2_val: parsed.about_stat2_val || (PORTFOLIO_INFO as any).aboutStats?.[1]?.value || "15+",
          about_stat2_lbl: parsed.about_stat2_lbl || (PORTFOLIO_INFO as any).aboutStats?.[1]?.label || "Projects",
          about_stat3_val: parsed.about_stat3_val || (PORTFOLIO_INFO as any).aboutStats?.[2]?.value || "10+",
          about_stat3_lbl: parsed.about_stat3_lbl || (PORTFOLIO_INFO as any).aboutStats?.[2]?.label || "Technologies",
          about_stat4_val: parsed.about_stat4_val || (PORTFOLIO_INFO as any).aboutStats?.[3]?.value || "CSE",
          about_stat4_lbl: parsed.about_stat4_lbl || (PORTFOLIO_INFO as any).aboutStats?.[3]?.label || "Academic Background",
          socials: {
            ...PORTFOLIO_INFO.socials,
            github: parsed.github_url || parsed.github || parsed.socials?.github || PORTFOLIO_INFO.socials.github,
            linkedin: parsed.linkedin_url || parsed.linkedin || parsed.socials?.linkedin || PORTFOLIO_INFO.socials.linkedin,
            twitter: parsed.twitter_url || parsed.twitter || parsed.socials?.twitter || PORTFOLIO_INFO.socials.twitter,
          },
          workingHours: parsed.workingHours || parsed.working_hours || (PORTFOLIO_INFO as any).workingHours,
        };
      }
    }
  } catch (e) {}

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("profile_info")
        .select("*")
        .limit(1);

      if (!error && data && data.length > 0) {
        const row = data[0];
        const profileMapped = {
          ...PORTFOLIO_INFO,
          name: row.name || PORTFOLIO_INFO.name,
          shortName: row.short_name || PORTFOLIO_INFO.shortName,
          title: row.title || PORTFOLIO_INFO.title,
          tagline: row.tagline || PORTFOLIO_INFO.tagline,
          typewriterPrefix:
            row.typewriter_prefix !== undefined
              ? row.typewriter_prefix
              : row.typewriterPrefix !== undefined
              ? row.typewriterPrefix
              : PORTFOLIO_INFO.typewriterPrefix,
          typewriterPhrases: parseTypewriterPhrases(
            row.typewriter_phrases !== undefined
              ? row.typewriter_phrases
              : row.typewriterPhrases
          ),
          bio: row.bio || PORTFOLIO_INFO.bio,
          footerBio:
            row.footer_bio ||
            row.footerBio ||
            (PORTFOLIO_INFO as any).footerBio ||
            "Full-Stack Software Engineer & Mobile Developer dedicated to creating scalable, resilient digital experiences with thoughtful design.",
          footer_bio:
            row.footer_bio ||
            row.footerBio ||
            (PORTFOLIO_INFO as any).footerBio ||
            "Full-Stack Software Engineer & Mobile Developer dedicated to creating scalable, resilient digital experiences with thoughtful design.",
          email: row.email || PORTFOLIO_INFO.email,
          phone: row.phone || PORTFOLIO_INFO.phone,
          whatsappNumber: (row.phone || PORTFOLIO_INFO.phone).replace(/[^0-9]/g, ""),
          whatsappUrl: `https://wa.me/${(row.phone || PORTFOLIO_INFO.phone).replace(/[^0-9]/g, "")}`,
          location: row.location || PORTFOLIO_INFO.location,
          mapsUrl:
            row.maps_url ||
            row.mapsUrl ||
            (row.location
              ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(row.location)}`
              : PORTFOLIO_INFO.mapsUrl),
          maps_url:
            row.maps_url ||
            row.mapsUrl ||
            (row.location
              ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(row.location)}`
              : PORTFOLIO_INFO.mapsUrl),
          resumeUrl: row.resume_url || PORTFOLIO_INFO.resumeUrl,
          profileImage: row.profile_image || row.profileImage || PORTFOLIO_INFO.profileImage,
          profile_image: row.profile_image || row.profileImage || PORTFOLIO_INFO.profileImage,
          showIntroVideo:
            row.show_intro_video !== undefined
              ? Boolean(row.show_intro_video)
              : row.showIntroVideo !== undefined
              ? Boolean(row.showIntroVideo)
              : PORTFOLIO_INFO.showIntroVideo,
          show_intro_video:
            row.show_intro_video !== undefined
              ? Boolean(row.show_intro_video)
              : row.showIntroVideo !== undefined
              ? Boolean(row.showIntroVideo)
              : PORTFOLIO_INFO.showIntroVideo,
          introVideoUrl:
            row.intro_video_url ||
            row.introVideoUrl ||
            row.intro_video_id ||
            row.introVideoId ||
            PORTFOLIO_INFO.introVideoUrl,
          intro_video_url:
            row.intro_video_url ||
            row.introVideoUrl ||
            row.intro_video_id ||
            row.introVideoId ||
            PORTFOLIO_INFO.introVideoUrl,
          introVideoId:
            row.intro_video_id ||
            row.introVideoId ||
            PORTFOLIO_INFO.introVideoId,
          stats: {
            ...PORTFOLIO_INFO.stats,
            yearsExperience: row.years_experience || PORTFOLIO_INFO.stats.yearsExperience,
            projectsCompleted: row.projects_completed || PORTFOLIO_INFO.stats.projectsCompleted,
            satisfactionRate: row.satisfaction_rate || PORTFOLIO_INFO.stats.satisfactionRate,
          },
          socials: {
            github: row.github_url || PORTFOLIO_INFO.socials.github,
            linkedin: row.linkedin_url || PORTFOLIO_INFO.socials.linkedin,
            twitter: row.twitter_url || PORTFOLIO_INFO.socials.twitter,
          },
          workingHours: row.working_hours || (row.work_hours_enabled !== undefined ? {
            enabled: Boolean(row.work_hours_enabled),
            mode: row.work_hours_mode || "auto",
            startTime: row.work_start_time || "09:00",
            endTime: row.work_end_time || "22:00",
            timezone: row.work_timezone || "Asia/Dhaka",
            onlineLabel: row.work_online_label || "Available for Work",
            offlineLabel: row.work_offline_label || "Currently Away / Offline",
          } : (PORTFOLIO_INFO as any).workingHours),
        };
        try {
          localStorage.setItem("maharab_cached_profile", JSON.stringify(profileMapped));
        } catch (e) {}
        return profileMapped;
      }
    } catch (e) {}
  }

  return PORTFOLIO_INFO;
};

export const saveLiveProfile = async (
  profileData: any
): Promise<{ success: boolean; error?: string }> => {
  const resumeUrl = profileData.resume_url || profileData.resumeUrl;
  const profileImage = profileData.profile_image || profileData.profileImage;
  const showIntroVideo =
    profileData.show_intro_video !== undefined
      ? Boolean(profileData.show_intro_video)
      : profileData.showIntroVideo !== undefined
      ? Boolean(profileData.showIntroVideo)
      : true;
  const introVideoUrl =
    profileData.intro_video_url !== undefined
      ? profileData.intro_video_url
      : profileData.introVideoUrl !== undefined
      ? profileData.introVideoUrl
      : profileData.introVideoId || PORTFOLIO_INFO.introVideoUrl;

  const typewriterPrefix =
    profileData.typewriter_prefix !== undefined
      ? profileData.typewriter_prefix
      : profileData.typewriterPrefix !== undefined
      ? profileData.typewriterPrefix
      : PORTFOLIO_INFO.typewriterPrefix;

  const typewriterPhrases = parseTypewriterPhrases(
    profileData.typewriter_phrases !== undefined
      ? profileData.typewriter_phrases
      : profileData.typewriterPhrases
  );

  const aboutStats = profileData.about_stats || [
    { value: profileData.about_stat1_val || (PORTFOLIO_INFO as any).aboutStats?.[0]?.value || "2+ Years", label: profileData.about_stat1_lbl || (PORTFOLIO_INFO as any).aboutStats?.[0]?.label || "Project Experience" },
    { value: profileData.about_stat2_val || (PORTFOLIO_INFO as any).aboutStats?.[1]?.value || "15+", label: profileData.about_stat2_lbl || (PORTFOLIO_INFO as any).aboutStats?.[1]?.label || "Projects" },
    { value: profileData.about_stat3_val || (PORTFOLIO_INFO as any).aboutStats?.[2]?.value || "10+", label: profileData.about_stat3_lbl || (PORTFOLIO_INFO as any).aboutStats?.[2]?.label || "Technologies" },
    { value: profileData.about_stat4_val || (PORTFOLIO_INFO as any).aboutStats?.[3]?.value || "CSE", label: profileData.about_stat4_lbl || (PORTFOLIO_INFO as any).aboutStats?.[3]?.label || "Academic Background" },
  ];

  const workingHours: WorkingHoursConfig = profileData.workingHours || profileData.working_hours || {
    enabled: profileData.work_hours_enabled !== undefined ? Boolean(profileData.work_hours_enabled) : true,
    mode: profileData.work_hours_mode || "auto",
    startTime: profileData.work_start_time || "09:00",
    endTime: profileData.work_end_time || "22:00",
    timezone: profileData.work_timezone || "Asia/Dhaka",
    onlineLabel: profileData.work_online_label || "Available for Work",
    offlineLabel: profileData.work_offline_label || "Currently Away / Offline",
  };

  // Normalize and cache
  const toCache = {
    ...profileData,
    ...(resumeUrl ? { resume_url: resumeUrl, resumeUrl } : {}),
    ...(profileImage ? { profile_image: profileImage, profileImage } : {}),
    show_intro_video: showIntroVideo,
    showIntroVideo: showIntroVideo,
    intro_video_url: introVideoUrl,
    introVideoUrl: introVideoUrl,
    typewriter_prefix: typewriterPrefix,
    typewriterPrefix: typewriterPrefix,
    typewriter_phrases: typewriterPhrases,
    typewriterPhrases: typewriterPhrases,
    aboutStats,
    about_stats: aboutStats,
    workingHours,
    working_hours: workingHours,
    work_hours_enabled: workingHours.enabled,
    work_hours_mode: workingHours.mode,
    work_start_time: workingHours.startTime,
    work_end_time: workingHours.endTime,
    work_timezone: workingHours.timezone,
    work_online_label: workingHours.onlineLabel,
    work_offline_label: workingHours.offlineLabel,
  };

  try {
    const existingCached = localStorage.getItem("maharab_cached_profile");
    const merged = {
      ...(existingCached ? JSON.parse(existingCached) : {}),
      ...toCache,
    };
    localStorage.setItem("maharab_cached_profile", JSON.stringify(merged));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("portfolio_profile_updated"));
    }
  } catch (e) {}

  if (isSupabaseConfigured && supabase) {
    try {
      const fieldMap: Record<string, any> = {
        name: profileData.name,
        short_name: profileData.short_name || profileData.shortName,
        title: profileData.title,
        tagline: profileData.tagline,
        typewriter_prefix: typewriterPrefix,
        typewriter_phrases: typewriterPhrases,
        bio: profileData.bio,
        footer_bio: profileData.footer_bio || profileData.footerBio,
        email: profileData.email,
        phone: profileData.phone,
        location: profileData.location,
        maps_url: profileData.maps_url || profileData.mapsUrl,
        resume_url: resumeUrl,
        profile_image: profileImage,
        show_intro_video: showIntroVideo,
        intro_video_url: introVideoUrl,
        available_for_hire: profileData.available_for_hire,
        years_experience: profileData.years_experience,
        projects_completed: profileData.projects_completed,
        satisfaction_rate: profileData.satisfaction_rate,
        github_url: profileData.github || profileData.github_url,
        linkedin_url: profileData.linkedin || profileData.linkedin_url,
        twitter_url: profileData.twitter || profileData.twitter_url,
        work_hours_enabled: workingHours.enabled,
        work_hours_mode: workingHours.mode,
        work_start_time: workingHours.startTime,
        work_end_time: workingHours.endTime,
        work_timezone: workingHours.timezone,
        work_online_label: workingHours.onlineLabel,
        work_offline_label: workingHours.offlineLabel,
      };

      const dbProfile: Record<string, any> = {};
      for (const [key, val] of Object.entries(fieldMap)) {
        if (val !== undefined) {
          dbProfile[key] = val;
        }
      }

      const { data: existing } = await supabase.from("profile_info").select("id").limit(1);
      if (existing && existing.length > 0) {
        const { error: updErr } = await supabase.from("profile_info").update(dbProfile).eq("id", existing[0].id);
        if (updErr) {
          // If custom column not yet migrated in Supabase, retry with core fields
          const safeDb = { ...dbProfile };
          delete safeDb.show_intro_video;
          delete safeDb.intro_video_url;
          delete safeDb.typewriter_prefix;
          delete safeDb.typewriter_phrases;
          delete safeDb.maps_url;
          delete safeDb.footer_bio;
          delete safeDb.work_hours_enabled;
          delete safeDb.work_hours_mode;
          delete safeDb.work_start_time;
          delete safeDb.work_end_time;
          delete safeDb.work_timezone;
          delete safeDb.work_online_label;
          delete safeDb.work_offline_label;
          await supabase.from("profile_info").update(safeDb).eq("id", existing[0].id);
        }
      } else {
        const { error: insErr } = await supabase.from("profile_info").insert([dbProfile]);
        if (insErr) {
          const safeDb = { ...dbProfile };
          delete safeDb.show_intro_video;
          delete safeDb.intro_video_url;
          delete safeDb.typewriter_prefix;
          delete safeDb.typewriter_phrases;
          delete safeDb.maps_url;
          delete safeDb.footer_bio;
          delete safeDb.work_hours_enabled;
          delete safeDb.work_hours_mode;
          delete safeDb.work_start_time;
          delete safeDb.work_end_time;
          delete safeDb.work_timezone;
          delete safeDb.work_online_label;
          delete safeDb.work_offline_label;
          await supabase.from("profile_info").insert([safeDb]);
        }
      }
    } catch (err: any) {
      return { success: true, error: err.message };
    }
  }

  return { success: true };
};

export const saveLiveResumeUrl = async (
  newResumeUrl: string
): Promise<{ success: boolean; error?: string }> => {
  return await saveLiveProfile({
    resume_url: newResumeUrl,
    resumeUrl: newResumeUrl,
  });
};

// Unified Live Profile Hook - auto synchronizes any updates live
export const useLiveProfile = (): typeof PORTFOLIO_INFO => {
  const [profile, setProfile] = useState<typeof PORTFOLIO_INFO>(() => {
    try {
      const cached = localStorage.getItem("maharab_cached_profile");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && (parsed.name || parsed.resume_url || parsed.resumeUrl)) {
          return {
            ...PORTFOLIO_INFO,
            ...parsed,
            name: parsed.name || PORTFOLIO_INFO.name,
            shortName: parsed.short_name || parsed.shortName || PORTFOLIO_INFO.shortName,
            title: parsed.title || PORTFOLIO_INFO.title,
            tagline: parsed.tagline || PORTFOLIO_INFO.tagline,
            typewriterPrefix:
              parsed.typewriter_prefix !== undefined
                ? parsed.typewriter_prefix
                : parsed.typewriterPrefix !== undefined
                ? parsed.typewriterPrefix
                : PORTFOLIO_INFO.typewriterPrefix,
            typewriterPhrases: parseTypewriterPhrases(
              parsed.typewriter_phrases !== undefined
                ? parsed.typewriter_phrases
                : parsed.typewriterPhrases
            ),
            bio: parsed.bio || PORTFOLIO_INFO.bio,
            email: parsed.email || PORTFOLIO_INFO.email,
            phone: parsed.phone || PORTFOLIO_INFO.phone,
            whatsappNumber: (parsed.phone || PORTFOLIO_INFO.phone).replace(/[^0-9]/g, ""),
            whatsappUrl: `https://wa.me/${(parsed.phone || PORTFOLIO_INFO.phone).replace(/[^0-9]/g, "")}`,
            location: parsed.location || PORTFOLIO_INFO.location,
            mapsUrl:
              parsed.maps_url ||
              parsed.mapsUrl ||
              (parsed.location
                ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(parsed.location)}`
                : PORTFOLIO_INFO.mapsUrl),
            maps_url:
              parsed.maps_url ||
              parsed.mapsUrl ||
              (parsed.location
                ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(parsed.location)}`
                : PORTFOLIO_INFO.mapsUrl),
            resumeUrl: parsed.resume_url || parsed.resumeUrl || PORTFOLIO_INFO.resumeUrl,
            profileImage: parsed.profile_image || parsed.profileImage || PORTFOLIO_INFO.profileImage,
            profile_image: parsed.profile_image || parsed.profileImage || PORTFOLIO_INFO.profileImage,
            showIntroVideo:
              parsed.show_intro_video !== undefined
                ? Boolean(parsed.show_intro_video)
                : parsed.showIntroVideo !== undefined
                ? Boolean(parsed.showIntroVideo)
                : PORTFOLIO_INFO.showIntroVideo,
            show_intro_video:
              parsed.show_intro_video !== undefined
                ? Boolean(parsed.show_intro_video)
                : parsed.showIntroVideo !== undefined
                ? Boolean(parsed.showIntroVideo)
                : PORTFOLIO_INFO.showIntroVideo,
            introVideoUrl:
              parsed.intro_video_url ||
              parsed.introVideoUrl ||
              parsed.introVideoId ||
              PORTFOLIO_INFO.introVideoUrl,
            intro_video_url:
              parsed.intro_video_url ||
              parsed.introVideoUrl ||
              parsed.introVideoId ||
              PORTFOLIO_INFO.introVideoUrl,
            stats: {
              ...PORTFOLIO_INFO.stats,
              yearsExperience: parsed.years_experience || parsed.stats?.yearsExperience || PORTFOLIO_INFO.stats.yearsExperience,
              projectsCompleted: parsed.projects_completed || parsed.stats?.projectsCompleted || PORTFOLIO_INFO.stats.projectsCompleted,
              satisfactionRate: parsed.satisfaction_rate || parsed.stats?.satisfactionRate || PORTFOLIO_INFO.stats.satisfactionRate,
            },
            socials: {
              ...PORTFOLIO_INFO.socials,
              github: parsed.github_url || parsed.github || parsed.socials?.github || PORTFOLIO_INFO.socials.github,
              linkedin: parsed.linkedin_url || parsed.linkedin || parsed.socials?.linkedin || PORTFOLIO_INFO.socials.linkedin,
              twitter: parsed.twitter_url || parsed.twitter || parsed.socials?.twitter || PORTFOLIO_INFO.socials.twitter,
            },
            workingHours: parsed.workingHours || parsed.working_hours || (PORTFOLIO_INFO as any).workingHours,
          };
        }
      }
    } catch (e) {}
    return PORTFOLIO_INFO;
  });

  useEffect(() => {
    let active = true;
    const fetchLatest = async () => {
      const live = await getLiveProfile();
      if (active) setProfile(live);
    };

    fetchLatest();

    const handleUpdate = () => {
      fetchLatest();
    };

    window.addEventListener("portfolio_profile_updated", handleUpdate);
    return () => {
      active = false;
      window.removeEventListener("portfolio_profile_updated", handleUpdate);
    };
  }, []);

  return profile;
};

// ============================================================================
// Education Service (Local-First with Supabase Cloud Sync)
// ============================================================================
export const getLiveEducation = async (): Promise<EducationItem[]> => {
  try {
    const cached = localStorage.getItem("maharab_cached_education");
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {}

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("education")
        .select("*")
        .order("order_index", { ascending: true });

      if (!error && data && data.length > 0) {
        const mapped: EducationItem[] = data.map((d: any) => ({
          degree: d.degree || "",
          institution: d.institution || "",
          period: d.period || "",
          description: d.description || "",
          highlights: Array.isArray(d.highlights) ? d.highlights : [],
          isActive: d.is_active !== undefined ? d.is_active : (d.isActive !== undefined ? d.isActive : true),
        }));
        try {
          localStorage.setItem("maharab_cached_education", JSON.stringify(mapped));
        } catch (e) {}
        return mapped;
      }
    } catch (e) {}
  }

  return EDUCATION_DATA;
};

export const saveLiveEducation = async (
  educationList: EducationItem[]
): Promise<{ success: boolean; error?: string }> => {
  // 1. Immediately update localStorage
  try {
    localStorage.setItem("maharab_cached_education", JSON.stringify(educationList));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("portfolio_education_updated"));
    }
  } catch (e) {}

  // 2. Sync with Supabase cloud if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const rows = educationList.map((edu, idx) => ({
        degree: edu.degree,
        institution: edu.institution,
        period: edu.period,
        description: edu.description,
        highlights: edu.highlights || [],
        is_active: edu.isActive !== false,
        order_index: idx,
      }));

      // Delete existing and insert updated list
      await supabase.from("education").delete().neq("degree", "___never_match___");
      const { error } = await supabase.from("education").insert(rows);
      if (error) {
        return { success: true, error: error.message };
      }
    } catch (err: any) {
      return { success: true, error: err.message };
    }
  }

  return { success: true };
};

// ============================================================================
// Certificates & Credentials Service (Local-First with Supabase Cloud Sync)
// ============================================================================
export const getLiveCertificates = async (): Promise<CertificateItem[]> => {
  try {
    const cached = localStorage.getItem("maharab_cached_certificates");
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {}

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("certificates")
        .select("*")
        .order("order_index", { ascending: true });

      if (!error && data && data.length > 0) {
        const mapped: CertificateItem[] = data.map((c: any) => ({
          title: c.title || "",
          issuer: c.issuer || "",
          year: c.year || "",
          type: c.type || "Professional",
          link: c.link || "",
          details: c.details || "",
          verificationId: c.verification_id || c.verificationId || "",
        }));
        try {
          localStorage.setItem("maharab_cached_certificates", JSON.stringify(mapped));
        } catch (e) {}
        return mapped;
      }
    } catch (e) {}
  }

  return CERTIFICATES_DATA;
};

export const saveLiveCertificates = async (
  certsList: CertificateItem[]
): Promise<{ success: boolean; error?: string }> => {
  // 1. Immediately update localStorage
  try {
    localStorage.setItem("maharab_cached_certificates", JSON.stringify(certsList));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("portfolio_certificates_updated"));
    }
  } catch (e) {}

  // 2. Sync with Supabase cloud if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const rows = certsList.map((cert, idx) => ({
        title: cert.title,
        issuer: cert.issuer,
        year: cert.year,
        type: cert.type,
        link: cert.link || "",
        details: cert.details || "",
        verification_id: cert.verificationId || "",
        order_index: idx,
      }));

      await supabase.from("certificates").delete().neq("title", "___never_match___");
      const { error } = await supabase.from("certificates").insert(rows);
      if (error) {
        return { success: true, error: error.message };
      }
    } catch (err: any) {
      return { success: true, error: err.message };
    }
  }

  return { success: true };
};

// ============================================================================
// Skills & Categories Icon Registry & Resolvers
// ============================================================================
// ============================================================================
// Skills & Categories Icon Registry & Resolvers (Comprehensive Developer Icons)
// ============================================================================
export const ICON_REGISTRY: Record<string, any> = {
  // IDEs & Code Editors
  VscVscode,
  VscCode,
  VscTerminal,
  SiWebstorm,
  SiPycharm,
  SiIntellijidea,
  SiSublimetext,

  // Languages
  SiTypescript,
  SiJavascript,
  FaPython,
  SiDart,
  FaJava,
  SiCplusplus,
  SiRust,
  SiGo,
  SiPhp,
  SiSwift,
  SiKotlin,
  SiRubyonrails,
  FaHtml5,
  FaCss3Alt,

  // Frontend & Mobile
  FaReact,
  SiNextdotjs,
  SiFlutter,
  FaAndroid,
  SiVuedotjs,
  SiAngular,
  SiSvelte,
  SiTailwindcss,
  SiBootstrap,
  SiSass,
  SiRedux,
  SiVite,
  SiWebpack,
  SiBabel,

  // Backend & APIs
  FaNodeJs,
  SiExpress,
  SiFastapi,
  SiDjango,
  SiFlask,
  SiSpringboot,
  SiGraphql,
  SiApollographql,
  SiSocketdotio,
  SiPostman,
  SiInsomnia,
  SiSwagger,
  FaServer,

  // Databases & ORMs
  SiPostgresql,
  SiMongodb,
  SiMysql,
  SiSqlite,
  SiMariadb,
  SiRedis,
  SiPrisma,
  SiSupabase,
  SiFirebase,
  FaDatabase,

  // DevOps & Cloud
  FaGitAlt,
  FaGithub,
  FaGitlab,
  FaBitbucket,
  FaDocker,
  SiKubernetes,
  FaAws,
  SiGooglecloud,
  SiVercel,
  SiNetlify,
  SiCloudflare,
  FaLinux,
  FaUbuntu,
  SiDebian,
  SiArchlinux,
  SiNginx,
  FaCloud,

  // AI & Data Science
  SiOpenai,
  SiHuggingface,
  SiJupyter,
  SiTensorflow,
  SiPytorch,
  SiOpencv,
  SiScikitlearn,
  SiPandas,
  SiNumpy,
  FaBrain,

  // IoT & Hardware
  SiArduino,
  SiRaspberrypi,
  SiEspressif,
  FaMicrochip,
  FaCogs,

  // Testing & Tooling
  SiJest,
  SiCypress,
  SiVitest,
  SiEslint,
  SiPrettier,
  SiNpm,
  SiYarn,
  SiPnpm,
  SiBun,
  SiDeno,

  // Design, Collaboration & CMS
  FaFigma,
  SiCanva,
  SiNotion,
  SiJira,
  FaTrello,
  FaSlack,
  FaStripe,
  FaWordpress,
  FaShopify,
  FaMarkdown,

  // Generic Utility Icons
  FaCode,
  FaMobileAlt,
  FaTerminal,
  FaShieldAlt,
  FaTools,
  FaLayerGroup,
  FaNetworkWired,
  FaLaptopCode,
  FaCube,
  FaFire,
  FaGlobe,
};

export const AVAILABLE_SKILL_ICONS = [
  // IDEs & Code Editors
  { id: "VscVscode", label: "VS Code / Visual Studio Code", icon: VscVscode, category: "tools" },
  { id: "SiWebstorm", label: "WebStorm IDE", icon: SiWebstorm, category: "tools" },
  { id: "SiPycharm", label: "PyCharm IDE", icon: SiPycharm, category: "tools" },
  { id: "SiIntellijidea", label: "IntelliJ IDEA", icon: SiIntellijidea, category: "tools" },
  { id: "SiSublimetext", label: "Sublime Text", icon: SiSublimetext, category: "tools" },
  { id: "FaTerminal", label: "Terminal / Bash / CLI", icon: FaTerminal, category: "tools" },
  { id: "FaLaptopCode", label: "Code Studio / IDE", icon: FaLaptopCode, category: "tools" },

  // Programming Languages
  { id: "SiTypescript", label: "TypeScript", icon: SiTypescript, category: "languages" },
  { id: "SiJavascript", label: "JavaScript", icon: SiJavascript, category: "languages" },
  { id: "FaPython", label: "Python", icon: FaPython, category: "languages" },
  { id: "SiDart", label: "Dart", icon: SiDart, category: "languages" },
  { id: "FaJava", label: "Java", icon: FaJava, category: "languages" },
  { id: "SiCplusplus", label: "C++ / C", icon: SiCplusplus, category: "languages" },
  { id: "SiRust", label: "Rust", icon: SiRust, category: "languages" },
  { id: "SiGo", label: "Go / Golang", icon: SiGo, category: "languages" },
  { id: "SiPhp", label: "PHP", icon: SiPhp, category: "languages" },
  { id: "SiSwift", label: "Swift", icon: SiSwift, category: "languages" },
  { id: "SiKotlin", label: "Kotlin", icon: SiKotlin, category: "languages" },
  { id: "SiRubyonrails", label: "Ruby on Rails", icon: SiRubyonrails, category: "languages" },
  { id: "FaHtml5", label: "HTML5", icon: FaHtml5, category: "languages" },
  { id: "FaCss3Alt", label: "CSS3", icon: FaCss3Alt, category: "languages" },

  // Frontend Frameworks & Libraries
  { id: "FaReact", label: "React / React Native", icon: FaReact, category: "frontend" },
  { id: "SiNextdotjs", label: "Next.js", icon: SiNextdotjs, category: "frontend" },
  { id: "SiVuedotjs", label: "Vue.js", icon: SiVuedotjs, category: "frontend" },
  { id: "SiAngular", label: "Angular", icon: SiAngular, category: "frontend" },
  { id: "SiSvelte", label: "Svelte", icon: SiSvelte, category: "frontend" },
  { id: "SiTailwindcss", label: "Tailwind CSS", icon: SiTailwindcss, category: "frontend" },
  { id: "SiBootstrap", label: "Bootstrap", icon: SiBootstrap, category: "frontend" },
  { id: "SiSass", label: "Sass / SCSS", icon: SiSass, category: "frontend" },
  { id: "SiRedux", label: "Redux / Toolkit", icon: SiRedux, category: "frontend" },
  { id: "SiVite", label: "Vite Bundler", icon: SiVite, category: "frontend" },
  { id: "SiWebpack", label: "Webpack", icon: SiWebpack, category: "frontend" },
  { id: "SiBabel", label: "Babel", icon: SiBabel, category: "frontend" },

  // Mobile App Development
  { id: "SiFlutter", label: "Flutter (Cross-Platform)", icon: SiFlutter, category: "mobile" },
  { id: "FaAndroid", label: "Android Development", icon: FaAndroid, category: "mobile" },
  { id: "FaMobileAlt", label: "Mobile Apps (Generic)", icon: FaMobileAlt, category: "mobile" },

  // Backend & APIs
  { id: "FaNodeJs", label: "Node.js", icon: FaNodeJs, category: "backend" },
  { id: "SiExpress", label: "Express.js", icon: SiExpress, category: "backend" },
  { id: "SiFastapi", label: "FastAPI", icon: SiFastapi, category: "backend" },
  { id: "SiDjango", label: "Django", icon: SiDjango, category: "backend" },
  { id: "SiFlask", label: "Flask", icon: SiFlask, category: "backend" },
  { id: "SiSpringboot", label: "Spring Boot", icon: SiSpringboot, category: "backend" },
  { id: "SiGraphql", label: "GraphQL", icon: SiGraphql, category: "backend" },
  { id: "SiApollographql", label: "Apollo GraphQL", icon: SiApollographql, category: "backend" },
  { id: "SiSocketdotio", label: "Socket.io (WebSockets)", icon: SiSocketdotio, category: "backend" },
  { id: "SiPostman", label: "Postman API Platform", icon: SiPostman, category: "tools" },
  { id: "SiInsomnia", label: "Insomnia REST", icon: SiInsomnia, category: "tools" },
  { id: "SiSwagger", label: "Swagger / OpenAPI", icon: SiSwagger, category: "tools" },
  { id: "FaServer", label: "REST APIs & Servers", icon: FaServer, category: "backend" },

  // Databases & Backend As A Service
  { id: "SiPostgresql", label: "PostgreSQL", icon: SiPostgresql, category: "database" },
  { id: "SiMongodb", label: "MongoDB", icon: SiMongodb, category: "database" },
  { id: "SiMysql", label: "MySQL", icon: SiMysql, category: "database" },
  { id: "SiSqlite", label: "SQLite", icon: SiSqlite, category: "database" },
  { id: "SiMariadb", label: "MariaDB", icon: SiMariadb, category: "database" },
  { id: "SiRedis", label: "Redis Cache", icon: SiRedis, category: "database" },
  { id: "SiPrisma", label: "Prisma ORM", icon: SiPrisma, category: "database" },
  { id: "SiSupabase", label: "Supabase (Cloud DB & Auth)", icon: SiSupabase, category: "database" },
  { id: "SiFirebase", label: "Firebase (Firestore & Auth)", icon: SiFirebase, category: "database" },
  { id: "FaDatabase", label: "Database Management", icon: FaDatabase, category: "database" },

  // DevOps, Cloud & Version Control
  { id: "FaGitAlt", label: "Git Version Control", icon: FaGitAlt, category: "tools" },
  { id: "FaGithub", label: "GitHub", icon: FaGithub, category: "tools" },
  { id: "FaGitlab", label: "GitLab", icon: FaGitlab, category: "tools" },
  { id: "FaBitbucket", label: "Bitbucket", icon: FaBitbucket, category: "tools" },
  { id: "FaDocker", label: "Docker Containers", icon: FaDocker, category: "cloud" },
  { id: "SiKubernetes", label: "Kubernetes (K8s)", icon: SiKubernetes, category: "cloud" },
  { id: "FaAws", label: "Amazon Web Services (AWS)", icon: FaAws, category: "cloud" },
  { id: "SiGooglecloud", label: "Google Cloud Platform (GCP)", icon: SiGooglecloud, category: "cloud" },
  { id: "SiVercel", label: "Vercel Cloud", icon: SiVercel, category: "cloud" },
  { id: "SiNetlify", label: "Netlify Hosting", icon: SiNetlify, category: "cloud" },
  { id: "SiCloudflare", label: "Cloudflare", icon: SiCloudflare, category: "cloud" },
  { id: "FaLinux", label: "Linux Administration", icon: FaLinux, category: "cloud" },
  { id: "FaUbuntu", label: "Ubuntu Server / OS", icon: FaUbuntu, category: "cloud" },
  { id: "SiDebian", label: "Debian Linux", icon: SiDebian, category: "cloud" },
  { id: "SiArchlinux", label: "Arch Linux", icon: SiArchlinux, category: "cloud" },
  { id: "SiNginx", label: "Nginx Reverse Proxy", icon: SiNginx, category: "cloud" },
  { id: "FaCloud", label: "Cloud Infrastructure", icon: FaCloud, category: "cloud" },

  // Artificial Intelligence, ML & Data
  { id: "SiOpenai", label: "OpenAI / ChatGPT / GPT-4", icon: SiOpenai, category: "ai" },
  { id: "SiHuggingface", label: "Hugging Face Models", icon: SiHuggingface, category: "ai" },
  { id: "SiJupyter", label: "Jupyter Notebooks", icon: SiJupyter, category: "ai" },
  { id: "SiTensorflow", label: "TensorFlow & Keras", icon: SiTensorflow, category: "ai" },
  { id: "SiPytorch", label: "PyTorch Deep Learning", icon: SiPytorch, category: "ai" },
  { id: "SiOpencv", label: "OpenCV Computer Vision", icon: SiOpencv, category: "ai" },
  { id: "SiScikitlearn", label: "Scikit-Learn ML", icon: SiScikitlearn, category: "ai" },
  { id: "SiPandas", label: "Pandas Data Science", icon: SiPandas, category: "ai" },
  { id: "SiNumpy", label: "NumPy Arrays", icon: SiNumpy, category: "ai" },
  { id: "FaBrain", label: "Artificial Intelligence (AI)", icon: FaBrain, category: "ai" },

  // IoT & Embedded Systems
  { id: "SiArduino", label: "Arduino Microcontrollers", icon: SiArduino, category: "iot" },
  { id: "SiRaspberrypi", label: "Raspberry Pi", icon: SiRaspberrypi, category: "iot" },
  { id: "SiEspressif", label: "ESP32 / ESP8266 IoT", icon: SiEspressif, category: "iot" },
  { id: "FaMicrochip", label: "Hardware & Microchips", icon: FaMicrochip, category: "iot" },
  { id: "FaCogs", label: "Robotics & Embedded", icon: FaCogs, category: "iot" },

  // Testing & Package Managers
  { id: "SiJest", label: "Jest Testing Framework", icon: SiJest, category: "tools" },
  { id: "SiCypress", label: "Cypress E2E", icon: SiCypress, category: "tools" },
  { id: "SiVitest", label: "Vitest Unit Testing", icon: SiVitest, category: "tools" },
  { id: "SiEslint", label: "ESLint Linter", icon: SiEslint, category: "tools" },
  { id: "SiPrettier", label: "Prettier Code Formatter", icon: SiPrettier, category: "tools" },
  { id: "SiNpm", label: "npm Package Manager", icon: SiNpm, category: "tools" },
  { id: "SiYarn", label: "Yarn", icon: SiYarn, category: "tools" },
  { id: "SiPnpm", label: "pnpm", icon: SiPnpm, category: "tools" },
  { id: "SiBun", label: "Bun Runtime", icon: SiBun, category: "tools" },
  { id: "SiDeno", label: "Deno Runtime", icon: SiDeno, category: "tools" },

  // Design, Collaboration, Payments & CMS
  { id: "FaFigma", label: "Figma UI/UX Design", icon: FaFigma, category: "tools" },
  { id: "SiCanva", label: "Canva Design", icon: SiCanva, category: "tools" },
  { id: "SiNotion", label: "Notion Workspace", icon: SiNotion, category: "tools" },
  { id: "SiJira", label: "Jira Agile", icon: SiJira, category: "tools" },
  { id: "FaTrello", label: "Trello Kanban", icon: FaTrello, category: "tools" },
  { id: "FaSlack", label: "Slack Team Chat", icon: FaSlack, category: "tools" },
  { id: "FaStripe", label: "Stripe Payments", icon: FaStripe, category: "tools" },
  { id: "FaWordpress", label: "WordPress CMS", icon: FaWordpress, category: "tools" },
  { id: "FaShopify", label: "Shopify E-Commerce", icon: FaShopify, category: "tools" },
  { id: "FaMarkdown", label: "Markdown Documentation", icon: FaMarkdown, category: "tools" },
  { id: "FaShieldAlt", label: "Security & Authentication", icon: FaShieldAlt, category: "tools" },
  { id: "FaTools", label: "Developer Tools (Generic)", icon: FaTools, category: "tools" },
  { id: "FaCode", label: "General Programming", icon: FaCode, category: "languages" },
];

export const resolveCategoryIcon = (categoryId: string, iconName?: string): any => {
  if (iconName && ICON_REGISTRY[iconName]) {
    return ICON_REGISTRY[iconName];
  }
  const id = (categoryId || "").toLowerCase();
  if (id.includes("front") || id.includes("web")) return FaReact;
  if (id.includes("mobile") || id.includes("app")) return FaMobileAlt;
  if (id.includes("back") || id.includes("db") || id.includes("data")) return FaServer;
  if (id.includes("lang") || id.includes("code")) return FaCode;
  if (id.includes("ai") || id.includes("ml") || id.includes("iot") || id.includes("embedded")) return FaBrain;
  if (id.includes("tool") || id.includes("devops") || id.includes("cloud")) return FaDatabase;
  return FaCode;
};

export const resolveSkillIcon = (name: string, iconName?: string, category?: string): any => {
  if (iconName && ICON_REGISTRY[iconName]) {
    return ICON_REGISTRY[iconName];
  }
  const n = (name || "").toLowerCase().trim();

  // 1. IDEs, Editors & CLI
  if (n.includes("vs code") || n.includes("vscode") || n.includes("visual studio code") || n === "vsc") return VscVscode;
  if (n.includes("visual studio")) return VscCode;
  if (n.includes("webstorm")) return SiWebstorm;
  if (n.includes("pycharm")) return SiPycharm;
  if (n.includes("intellij") || n.includes("idea")) return SiIntellijidea;
  if (n.includes("sublime")) return SiSublimetext;
  if (n.includes("terminal") || n.includes("bash") || n.includes("shell") || n.includes("cli")) return FaTerminal;

  // 2. Developer Tools & APIs
  if (n.includes("postman")) return SiPostman;
  if (n.includes("insomnia")) return SiInsomnia;
  if (n.includes("swagger") || n.includes("openapi")) return SiSwagger;
  if (n.includes("vite")) return SiVite;
  if (n.includes("webpack")) return SiWebpack;
  if (n.includes("babel")) return SiBabel;
  if (n.includes("prisma")) return SiPrisma;
  if (n.includes("npm")) return SiNpm;
  if (n.includes("yarn")) return SiYarn;
  if (n.includes("pnpm")) return SiPnpm;
  if (n.includes("bun")) return SiBun;
  if (n.includes("deno")) return SiDeno;

  // 3. Languages
  if (n.includes("typescript") || n === "ts") return SiTypescript;
  if (n.includes("javascript") || n === "js") return SiJavascript;
  if (n.includes("python") || n === "py") return FaPython;
  if (n.includes("dart")) return SiDart;
  if (n.includes("java") && !n.includes("javascript")) return FaJava;
  if (n.includes("c++") || n.includes("cpp")) return SiCplusplus;
  if (n.includes("c#") || n.includes("csharp")) return FaCode;
  if (n.includes("rust")) return SiRust;
  if (n.includes("golang") || n === "go" || n.startsWith("go ")) return SiGo;
  if (n.includes("php")) return SiPhp;
  if (n.includes("ruby") || n.includes("rails")) return SiRubyonrails;
  if (n.includes("kotlin")) return SiKotlin;
  if (n.includes("swift")) return SiSwift;
  if (n.includes("html")) return FaHtml5;
  if (n.includes("css")) return FaCss3Alt;

  // 4. Frontend & Mobile
  if (n.includes("react")) return FaReact;
  if (n.includes("next")) return SiNextdotjs;
  if (n.includes("flutter")) return SiFlutter;
  if (n.includes("android")) return FaAndroid;
  if (n.includes("vue")) return SiVuedotjs;
  if (n.includes("angular")) return SiAngular;
  if (n.includes("svelte")) return SiSvelte;
  if (n.includes("tailwind")) return SiTailwindcss;
  if (n.includes("bootstrap")) return SiBootstrap;
  if (n.includes("sass") || n.includes("scss")) return SiSass;
  if (n.includes("redux")) return SiRedux;

  // 5. Backend & Cloud DB
  if (n.includes("node")) return FaNodeJs;
  if (n.includes("express")) return SiExpress;
  if (n.includes("fastapi")) return SiFastapi;
  if (n.includes("django")) return SiDjango;
  if (n.includes("flask")) return SiFlask;
  if (n.includes("spring")) return SiSpringboot;
  if (n.includes("graphql")) return SiGraphql;
  if (n.includes("apollo")) return SiApollographql;
  if (n.includes("socket")) return SiSocketdotio;
  if (n.includes("postgre") || n.includes("postgres") || n.includes("psql")) return SiPostgresql;
  if (n.includes("mongo")) return SiMongodb;
  if (n.includes("mysql")) return SiMysql;
  if (n.includes("sqlite")) return SiSqlite;
  if (n.includes("mariadb")) return SiMariadb;
  if (n.includes("redis")) return SiRedis;
  if (n.includes("supabase")) return SiSupabase;
  if (n.includes("firebase")) return SiFirebase;

  // 6. DevOps & Cloud
  if (n.includes("github")) return FaGithub;
  if (n.includes("gitlab")) return FaGitlab;
  if (n.includes("bitbucket")) return FaBitbucket;
  if (n.includes("git")) return FaGitAlt;
  if (n.includes("docker")) return FaDocker;
  if (n.includes("kubern") || n.includes("k8s")) return SiKubernetes;
  if (n.includes("aws")) return FaAws;
  if (n.includes("gcp") || n.includes("google cloud")) return SiGooglecloud;
  if (n.includes("vercel")) return SiVercel;
  if (n.includes("netlify")) return SiNetlify;
  if (n.includes("cloudflare")) return SiCloudflare;
  if (n.includes("ubuntu")) return FaUbuntu;
  if (n.includes("debian")) return SiDebian;
  if (n.includes("arch")) return SiArchlinux;
  if (n.includes("linux")) return FaLinux;
  if (n.includes("nginx")) return SiNginx;

  // 7. AI & Machine Learning
  if (n.includes("openai") || n.includes("chatgpt") || n.includes("gpt")) return SiOpenai;
  if (n.includes("hugging")) return SiHuggingface;
  if (n.includes("jupyter")) return SiJupyter;
  if (n.includes("tensor") || n.includes("keras")) return SiTensorflow;
  if (n.includes("pytorch")) return SiPytorch;
  if (n.includes("opencv")) return SiOpencv;
  if (n.includes("scikit") || n.includes("sklearn")) return SiScikitlearn;
  if (n.includes("pandas")) return SiPandas;
  if (n.includes("numpy")) return SiNumpy;
  if (n.includes("ai") || n.includes("ml") || n.includes("deep learning") || n.includes("neural")) return FaBrain;

  // 8. IoT & Microcontrollers
  if (n.includes("arduino")) return SiArduino;
  if (n.includes("raspberry")) return SiRaspberrypi;
  if (n.includes("esp32") || n.includes("espressif")) return SiEspressif;
  if (n.includes("microchip") || n.includes("iot") || n.includes("sensor")) return FaMicrochip;

  // 9. Testing & Linter
  if (n.includes("jest")) return SiJest;
  if (n.includes("cypress")) return SiCypress;
  if (n.includes("vitest")) return SiVitest;
  if (n.includes("eslint")) return SiEslint;
  if (n.includes("prettier")) return SiPrettier;

  // 10. Design, CMS, Collab & Payments
  if (n.includes("figma") || n.includes("ui/ux")) return FaFigma;
  if (n.includes("canva")) return SiCanva;
  if (n.includes("notion")) return SiNotion;
  if (n.includes("jira")) return SiJira;
  if (n.includes("trello")) return FaTrello;
  if (n.includes("slack")) return FaSlack;
  if (n.includes("stripe")) return FaStripe;
  if (n.includes("wordpress")) return FaWordpress;
  if (n.includes("shopify")) return FaShopify;
  if (n.includes("markdown")) return FaMarkdown;

  if (category) {
    return resolveCategoryIcon(category);
  }
  return FaCode;
};

// ============================================================================
// Skill Categories Service (Local-First with Supabase Cloud Sync)
// ============================================================================
export const getLiveSkillCategories = async (): Promise<SkillCategory[]> => {
  try {
    const cached = localStorage.getItem("maharab_cached_skill_categories");
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {}

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("skill_categories")
        .select("*")
        .order("order_index", { ascending: true });

      if (!error && data && data.length > 0) {
        const mapped: SkillCategory[] = data.map((c: any) => ({
          id: c.category_id || c.id,
          label: c.label || "",
          iconName: c.icon_name || c.iconName || "",
          order_index: c.order_index ?? 0,
        }));
        try {
          localStorage.setItem("maharab_cached_skill_categories", JSON.stringify(mapped));
        } catch (e) {}
        return mapped;
      }
    } catch (e) {}
  }

  return DEFAULT_SKILL_CATEGORIES;
};

export const saveLiveSkillCategories = async (
  categories: SkillCategory[]
): Promise<{ success: boolean; error?: string }> => {
  // 1. Immediately update localStorage & dispatch event
  try {
    localStorage.setItem("maharab_cached_skill_categories", JSON.stringify(categories));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("portfolio_skills_updated"));
    }
  } catch (e) {}

  // 2. Sync with Supabase cloud if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const rows = categories.map((cat, idx) => ({
        category_id: cat.id,
        label: cat.label,
        icon_name: cat.iconName || "",
        order_index: idx,
      }));

      await supabase.from("skill_categories").delete().neq("category_id", "___never_match___");
      const { error } = await supabase.from("skill_categories").insert(rows);
      if (error) {
        return { success: true, error: error.message };
      }
    } catch (err: any) {
      return { success: true, error: err.message };
    }
  }

  return { success: true };
};

export const useLiveSkillCategories = (): SkillCategory[] => {
  const [categories, setCategories] = useState<SkillCategory[]>(() => {
    try {
      const cached = localStorage.getItem("maharab_cached_skill_categories");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return DEFAULT_SKILL_CATEGORIES;
  });

  useEffect(() => {
    let active = true;
    const fetchLatest = async () => {
      const live = await getLiveSkillCategories();
      if (active && live && live.length > 0) setCategories(live);
    };

    fetchLatest();

    const handleUpdate = () => {
      fetchLatest();
    };

    window.addEventListener("portfolio_skills_updated", handleUpdate);
    return () => {
      active = false;
      window.removeEventListener("portfolio_skills_updated", handleUpdate);
    };
  }, []);

  return categories;
};

// ============================================================================
// Skills List Service (Local-First with Supabase Cloud Sync)
// ============================================================================
export const getLiveSkills = async (): Promise<SkillItemData[]> => {
  try {
    const cached = localStorage.getItem("maharab_cached_skills");
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {}

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .order("order_index", { ascending: true });

      if (!error && data && data.length > 0) {
        const mapped: SkillItemData[] = data.map((s: any) => ({
          id: s.skill_id || s.id || `skill-${s.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
          name: s.name || "",
          category: s.category || "frontend",
          level: s.level || "Core",
          color: s.color || "#a855f7",
          iconName: s.icon_name || s.iconName || "",
          order_index: s.order_index ?? 0,
        }));
        try {
          localStorage.setItem("maharab_cached_skills", JSON.stringify(mapped));
        } catch (e) {}
        return mapped;
      }
    } catch (e) {}
  }

  return DEFAULT_SKILLS_DATA;
};

export const saveLiveSkills = async (
  skillsList: SkillItemData[]
): Promise<{ success: boolean; error?: string }> => {
  // 1. Immediately update localStorage & dispatch event
  try {
    localStorage.setItem("maharab_cached_skills", JSON.stringify(skillsList));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("portfolio_skills_updated"));
    }
  } catch (e) {}

  // 2. Sync with Supabase cloud if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const rows = skillsList.map((skill, idx) => ({
        skill_id: skill.id,
        name: skill.name,
        category: skill.category,
        level: skill.level,
        color: skill.color || "#a855f7",
        icon_name: skill.iconName || "",
        order_index: idx,
      }));

      await supabase.from("skills").delete().neq("skill_id", "___never_match___");
      const { error } = await supabase.from("skills").insert(rows);
      if (error) {
        return { success: true, error: error.message };
      }
    } catch (err: any) {
      return { success: true, error: err.message };
    }
  }

  return { success: true };
};

export const useLiveSkills = (): SkillItemData[] => {
  const [skills, setSkills] = useState<SkillItemData[]>(() => {
    try {
      const cached = localStorage.getItem("maharab_cached_skills");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return DEFAULT_SKILLS_DATA;
  });

  useEffect(() => {
    let active = true;
    const fetchLatest = async () => {
      const live = await getLiveSkills();
      if (active && live && live.length > 0) setSkills(live);
    };

    fetchLatest();

    const handleUpdate = () => {
      fetchLatest();
    };

    window.addEventListener("portfolio_skills_updated", handleUpdate);
    return () => {
      active = false;
      window.removeEventListener("portfolio_skills_updated", handleUpdate);
    };
  }, []);

  return skills;
};

// ============================================================================
// Project Reviews & Gender Detection Service
// ============================================================================

export interface ProjectReview {
  id: string;
  project_id: string;
  name: string;
  email: string;
  gender: "male" | "female" | "unspecified";
  rating: number; // 1 to 5
  message: string;
  created_at: string;
  likes?: number;
}

const STORAGE_PROJECT_REVIEWS_KEY = "maharab_project_reviews";
const STORAGE_LIKED_REVIEWS_KEY = "maharab_liked_reviews";
const STORAGE_DELETED_REVIEWS_KEY = "maharab_deleted_review_ids";
const STORAGE_DELETED_REVIEW_FPS_KEY = "maharab_deleted_review_fingerprints";
const STORAGE_REVIEWS_ORDER_KEY = "maharab_reviews_order";

export const getReviewsOrderMap = (): Map<string, number> | null => {
  try {
    const raw = localStorage.getItem(STORAGE_REVIEWS_ORDER_KEY);
    if (raw) {
      const ids: string[] = JSON.parse(raw);
      if (Array.isArray(ids) && ids.length > 0) {
        const map = new Map<string, number>();
        ids.forEach((id, idx) => map.set(String(id), idx));
        return map;
      }
    }
  } catch (e) {}
  return null;
};

export const saveReviewsOrder = async (orderedList: ProjectReview[]): Promise<boolean> => {
  try {
    const ids = orderedList.map((r) => String(r.id));
    localStorage.setItem(STORAGE_REVIEWS_ORDER_KEY, JSON.stringify(ids));
    localStorage.setItem(STORAGE_PROJECT_REVIEWS_KEY, JSON.stringify(orderedList.slice(0, 200)));

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("portfolio_reviews_updated"));
    }
    return true;
  } catch (e) {
    console.warn("Failed to save reviews order:", e);
    return false;
  }
};

export const getReviewFingerprint = (r: Partial<ProjectReview>): string => {
  const pId = (r.project_id || "").trim();
  const name = (r.name || "").trim().toLowerCase();
  const msg = (r.message || "").trim().toLowerCase().slice(0, 100);
  return `${pId}_${name}_${msg}`;
};

export const getDeletedReviewIds = (): Set<string> => {
  try {
    const raw = localStorage.getItem(STORAGE_DELETED_REVIEWS_KEY);
    if (raw) return new Set(JSON.parse(raw));
  } catch (e) {}
  return new Set();
};

export const getDeletedReviewFingerprints = (): Set<string> => {
  try {
    const raw = localStorage.getItem(STORAGE_DELETED_REVIEW_FPS_KEY);
    if (raw) return new Set(JSON.parse(raw));
  } catch (e) {}
  return new Set();
};

// Safe email masker for privacy on user-facing panels (e.g. saytica.ceo@gmail.com -> say***o@gmail.com)
export const maskEmail = (email?: string): string => {
  if (!email || typeof email !== "string") return "";
  const trimmed = email.trim();
  const atIndex = trimmed.indexOf("@");
  if (atIndex <= 0) return "";
  const username = trimmed.slice(0, atIndex);
  const domain = trimmed.slice(atIndex);

  if (username.length <= 2) {
    return `${username[0]}***${domain}`;
  }
  if (username.length <= 4) {
    return `${username.slice(0, 2)}***${domain}`;
  }
  const prefix = username.slice(0, 3);
  const suffix = username.slice(-1);
  return `${prefix}***${suffix}${domain}`;
};

// Comprehensive intelligent name-to-gender detector
export const detectGenderFromName = (
  rawName: string
): "male" | "female" | "unspecified" => {
  if (!rawName || typeof rawName !== "string") return "unspecified";

  const clean = rawName
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .trim();
  if (!clean) return "unspecified";

  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "unspecified";

  const first = parts[0];
  const last = parts[parts.length - 1];

  // Explicit title / salutation checks
  if (["mrs", "miss", "ms", "madam", "lady", "begum", "sultana", "khatun", "bibi"].includes(first)) {
    return "female";
  }
  if (["mr", "md", "mohammad", "mohammed", "muhammad", "sir", "sheikh", "syed", "kazi"].includes(first)) {
    return "male";
  }
  if (["begum", "sultana", "khatun", "akhtar", "bibi", "akter"].includes(last)) {
    return "female";
  }

  // Common female names dictionary (South Asian, Islamic & Western)
  const femaleNames = new Set([
    "fatima", "fatema", "ayesha", "aisha", "sadia", "nusrat", "jannat", "jannatul", "anika",
    "mim", "riya", "sneha", "sumaiya", "mariam", "maryam", "nadia", "afsana", "farhana",
    "tanjina", "tasnim", "samia", "sanjida", "lamia", "shanta", "bristy", "bristi", "puja",
    "priya", "mou", "ritu", "munira", "shirin", "nasrin", "parvin", "tamanna", "sharmin",
    "sabrina", "jesmin", "ruma", "sonia", "sathi", "keya", "mithila", "laboni", "pori",
    "nitu", "marufa", "suraiya", "naznin", "shaila", "mahfuza", "tahmina", "tania", "lima",
    "bithi", "papia", "shampa", "monira", "rubina", "salma", "rokshana", "shikha", "lata",
    "champa", "rehana", "farida", "ananya", "ishita", "deepika", "shraddha", "alia", "kriti",
    "katrina", "kareena", "kareen", "rashmika", "kiara", "trisha", "nayanthara", "anushka",
    "sarah", "sara", "emily", "emma", "olivia", "sophia", "sofia", "isabella", "isabelle",
    "mia", "charlotte", "amelia", "harper", "evelyn", "abigail", "elizabeth", "avery",
    "ella", "scarlett", "grace", "chloe", "victoria", "riley", "aria", "lily", "aubrey",
    "zoey", "zoe", "hannah", "layla", "nora", "maya", "elena", "lucy", "anna", "alice",
    "jessica", "jennifer", "ashley", "amanda", "stephanie", "nicole", "samantha", "lauren",
    "megan", "rachel", "kelly", "laura", "amber", "danielle", "heather", "melissa", "rebecca",
    "michelle", "tiffany", "chelsea", "taylor", "jasmine", "kimberly", "amy", "angela",
    "brenda", "pamela", "christine", "maria", "katherine", "catherine", "helen", "nancy",
    "lisa", "diana", "jenny", "tina", "claire", "julia", "steph", "paula", "clara", "elise"
  ]);

  // Common male names dictionary
  const maleNames = new Set([
    "maharab", "mahir", "shakil", "tanvir", "rakib", "sabbir", "hasan", "hassan", "hossain",
    "hussein", "hosen", "ali", "rahman", "ahmed", "mahmud", "arif", "rayhan", "sohel", "rubel",
    "jahid", "imran", "faisal", "nayeem", "fahim", "ashik", "nahid", "sakib", "shakib", "tamim",
    "soumya", "mushfiq", "taskin", "shoriful", "mustafiz", "shanto", "liton", "ebadot", "mehidy",
    "miraz", "shorif", "rony", "anik", "joy", "dipu", "sourav", "amit", "rahul", "rohan",
    "rohit", "virat", "sachin", "asif", "saif", "shahid", "rashed", "mamun", "kamrul", "babor",
    "tareq", "tariq", "salman", "shahrukh", "aamir", "zaheer", "mashrafe", "nasir", "belal",
    "abir", "siyam", "arafat", "towhid", "habib", "faruk", "zia", "monir", "saiful", "ashraful",
    "john", "james", "robert", "michael", "william", "david", "richard", "joseph", "thomas",
    "charles", "christopher", "daniel", "matthew", "anthony", "mark", "donald", "steven", "paul",
    "andrew", "joshua", "kenneth", "kevin", "brian", "george", "edward", "ronald", "timothy",
    "jason", "jeffrey", "ryan", "jacob", "gary", "nicholas", "eric", "jonathan", "stephen",
    "larry", "justin", "scott", "brandon", "benjamin", "samuel", "gregory", "alexander", "alex",
    "frank", "patrick", "raymond", "jack", "dennis", "jerry", "tyler", "aaron", "jose", "adam",
    "nathan", "henry", "douglas", "zachary", "peter", "kyle", "walter", "ethan", "jeremy",
    "harold", "keith", "christian", "roger", "noah", "gerald", "carl", "terry", "sean", "austin",
    "arthur", "lawrence", "jesse", "dylan", "bryan", "joe", "jordan", "billy", "bruce", "albert",
    "willie", "gabriel", "logan", "alan", "juan", "wayne", "roy", "ralph", "randy", "eugene",
    "vincent", "russell", "elijah", "louis", "bobby", "philip", "johnny", "liam", "oliver", "lucas"
  ]);

  // Check any part in names set
  for (const p of parts) {
    if (femaleNames.has(p)) return "female";
    if (maleNames.has(p)) return "male";
  }

  // Morphological / Suffix heuristics
  const target = parts[0];
  if (
    target.endsWith("a") ||
    target.endsWith("ia") ||
    target.endsWith("ya") ||
    target.endsWith("na") ||
    target.endsWith("ka") ||
    target.endsWith("ta") ||
    target.endsWith("ti") ||
    target.endsWith("ly") ||
    target.endsWith("ette") ||
    target.endsWith("ina") ||
    target.endsWith("een")
  ) {
    return "female";
  }

  if (
    target.endsWith("el") ||
    target.endsWith("an") ||
    target.endsWith("on") ||
    target.endsWith("in") ||
    target.endsWith("er") ||
    target.endsWith("or") ||
    target.endsWith("ck") ||
    target.endsWith("rd") ||
    target.endsWith("ld") ||
    target.endsWith("rt")
  ) {
    return "male";
  }

  return "unspecified";
};

export const getProjectReviews = async (
  projectId?: string
): Promise<ProjectReview[]> => {
  const deletedIds = getDeletedReviewIds();
  const deletedFps = getDeletedReviewFingerprints();

  const isTombstoned = (r: Partial<ProjectReview>): boolean => {
    if (r.id && deletedIds.has(String(r.id))) return true;
    const fp = getReviewFingerprint(r);
    if (deletedFps.has(fp)) return true;
    return false;
  };

  let localList: ProjectReview[] = [];
  try {
    const raw = localStorage.getItem(STORAGE_PROJECT_REVIEWS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // Sanitize: dynamically strip legacy dummy/seed reviews, saytica-tanvir-eval, and tombstoned reviews
        localList = parsed.filter(
          (r: any) =>
            r &&
            r.id &&
            !String(r.id).startsWith("rev-seed") &&
            !String(r.id).startsWith("saytica-tanvir-eval") &&
            r.project_id !== "default" &&
            !isTombstoned(r)
        );
        if (localList.length !== parsed.length) {
          localStorage.setItem(STORAGE_PROJECT_REVIEWS_KEY, JSON.stringify(localList));
        }
      }
    }
  } catch (e) {}

  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase
        .from("project_reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (projectId) {
        query = query.eq("project_id", projectId);
      }

      const { data, error } = await query;
      if (!error && data) {
        const mergedMap = new Map<string, ProjectReview>();

        data.forEach((row: any) => {
          const id = String(row.id);
          // Skip legacy seed/default records
          if (id.startsWith("rev-seed") || row.project_id === "default") return;

          const revItem: ProjectReview = {
            id,
            project_id: row.project_id,
            name: row.name || "Anonymous Reviewer",
            email: row.email || "",
            gender: row.gender || detectGenderFromName(row.name),
            rating: Number(row.rating) || 5,
            message: row.message || "",
            created_at: row.created_at || new Date().toISOString(),
            likes: Number(row.likes) || 0,
          };

          if (isTombstoned(revItem)) return;

          mergedMap.set(id, revItem);
        });

        // Merge local reviews (strictly non-dummy and not tombstoned)
        localList.forEach((local) => {
          if (
            !mergedMap.has(local.id) &&
            !local.id.startsWith("rev-seed") &&
            local.project_id !== "default" &&
            !isTombstoned(local)
          ) {
            mergedMap.set(local.id, local);
          }
        });

        const orderMap = getReviewsOrderMap();
        const sorted = Array.from(mergedMap.values()).sort((a, b) => {
          if (orderMap) {
            const indexA = orderMap.has(a.id) ? orderMap.get(a.id)! : 999999;
            const indexB = orderMap.has(b.id) ? orderMap.get(b.id)! : 999999;
            if (indexA !== indexB) return indexA - indexB;
          }
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });

        try {
          localStorage.setItem(STORAGE_PROJECT_REVIEWS_KEY, JSON.stringify(sorted.slice(0, 200)));
        } catch (e) {}

        if (projectId) {
          return sorted.filter((r) => r.project_id === projectId);
        }
        return sorted;
      }
    } catch (e) {
      console.warn("Supabase reviews fetch note:", e);
    }
  }

  if (projectId) {
    const targetClean = projectId.toLowerCase().trim();
    const targetSlug = targetClean.replace(/[^a-z0-9]+/g, "-");
    const results = localList.filter((r) => {
      if (!r.project_id) return false;
      const rClean = r.project_id.toLowerCase().trim();
      const rSlug = rClean.replace(/[^a-z0-9]+/g, "-");
      return (
        rClean === targetClean ||
        rSlug === targetSlug ||
        rClean.includes(targetClean) ||
        targetClean.includes(rClean)
      );
    });
    return results;
  }

  const orderMap = getReviewsOrderMap();
  if (orderMap) {
    localList.sort((a, b) => {
      const indexA = orderMap.has(a.id) ? orderMap.get(a.id)! : 999999;
      const indexB = orderMap.has(b.id) ? orderMap.get(b.id)! : 999999;
      if (indexA !== indexB) return indexA - indexB;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }
  return localList;
};

export const submitProjectReview = async (
  review: Omit<ProjectReview, "id" | "created_at">
): Promise<{ success: boolean; review: ProjectReview; error?: string }> => {
  const newId = `rev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const timestamp = new Date().toISOString();

  const detectedGender =
    review.gender && review.gender !== "unspecified"
      ? review.gender
      : detectGenderFromName(review.name);

  const reviewRecord: ProjectReview = {
    id: newId,
    project_id: review.project_id,
    name: review.name.trim() || "Verified Client",
    email: review.email.trim(),
    gender: detectedGender,
    rating: Math.min(5, Math.max(1, review.rating || 5)),
    message: review.message.trim(),
    created_at: timestamp,
    likes: 0,
  };

  // 1. Immediately cache in localStorage for instant feedback
  try {
    const raw = localStorage.getItem(STORAGE_PROJECT_REVIEWS_KEY);
    const list: ProjectReview[] = raw ? JSON.parse(raw) : [];
    const updated = [reviewRecord, ...list.filter((r) => r.id !== newId)];
    localStorage.setItem(STORAGE_PROJECT_REVIEWS_KEY, JSON.stringify(updated.slice(0, 200)));
  } catch (e) {}

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("portfolio_reviews_updated", { detail: reviewRecord }));
  }

  // 2. Persist in Supabase if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("project_reviews")
        .insert([
          {
            project_id: reviewRecord.project_id,
            name: reviewRecord.name,
            email: reviewRecord.email,
            gender: reviewRecord.gender,
            rating: reviewRecord.rating,
            message: reviewRecord.message,
            created_at: timestamp,
            likes: 0,
          },
        ])
        .select("id");

      if (data && data[0]?.id) {
        const dbId = String(data[0].id);
        const oldId = reviewRecord.id;
        reviewRecord.id = dbId;

        // Keep local cache in sync with authoritative database UUID
        try {
          const raw = localStorage.getItem(STORAGE_PROJECT_REVIEWS_KEY);
          if (raw) {
            const list: ProjectReview[] = JSON.parse(raw);
            const updated = list.map((r) => (r.id === oldId ? { ...r, id: dbId } : r));
            localStorage.setItem(STORAGE_PROJECT_REVIEWS_KEY, JSON.stringify(updated.slice(0, 200)));
          }
        } catch (e) {}
      }
      if (error) {
        console.warn("Supabase project review insert note:", error);
      }
    } catch (e) {}
  }

  return { success: true, review: reviewRecord };
};

export const deleteProjectReview = async (
  id: string,
  reviewObj?: Partial<ProjectReview>
): Promise<boolean> => {
  let targetFp = reviewObj ? getReviewFingerprint(reviewObj) : "";

  // 1. Delete from localStorage and record tombstone so it can NEVER resurrect
  try {
    const raw = localStorage.getItem(STORAGE_PROJECT_REVIEWS_KEY);
    if (raw) {
      const list: ProjectReview[] = JSON.parse(raw);
      if (!targetFp) {
        const found = list.find((r) => r.id === id);
        if (found) targetFp = getReviewFingerprint(found);
      }
      const filtered = list.filter(
        (r) => r.id !== id && (targetFp ? getReviewFingerprint(r) !== targetFp : true)
      );
      localStorage.setItem(STORAGE_PROJECT_REVIEWS_KEY, JSON.stringify(filtered));
    }

    // Record ID in permanent tombstone set
    const deletedIds = getDeletedReviewIds();
    deletedIds.add(id);
    localStorage.setItem(STORAGE_DELETED_REVIEWS_KEY, JSON.stringify(Array.from(deletedIds)));

    // Record fingerprint in permanent tombstone set
    if (targetFp) {
      const deletedFps = getDeletedReviewFingerprints();
      deletedFps.add(targetFp);
      localStorage.setItem(
        STORAGE_DELETED_REVIEW_FPS_KEY,
        JSON.stringify(Array.from(deletedFps))
      );
    }

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("portfolio_reviews_updated"));
    }
  } catch (e) {
    console.warn("Local review delete error:", e);
  }

  // 2. Attempt Supabase delete (both by ID and by field match if available)
  if (isSupabaseConfigured && supabase) {
    try {
      // Direct delete by ID
      await supabase.from("project_reviews").delete().eq("id", id);

      // If review object provided, also delete by matching fields in case DB ID differs from local ID
      if (reviewObj && reviewObj.project_id && reviewObj.name && reviewObj.message) {
        await supabase
          .from("project_reviews")
          .delete()
          .eq("project_id", reviewObj.project_id)
          .eq("name", reviewObj.name)
          .eq("message", reviewObj.message);
      }
    } catch (e) {
      console.warn("Supabase review delete error:", e);
    }
  }
  return true;
};

export const likeProjectReview = async (id: string): Promise<number> => {
  let newLikes = 1;
  try {
    const likedRaw = localStorage.getItem(STORAGE_LIKED_REVIEWS_KEY);
    const likedSet = new Set(likedRaw ? JSON.parse(likedRaw) : []);
    if (likedSet.has(id)) return -1; // already liked

    likedSet.add(id);
    localStorage.setItem(STORAGE_LIKED_REVIEWS_KEY, JSON.stringify(Array.from(likedSet)));

    const raw = localStorage.getItem(STORAGE_PROJECT_REVIEWS_KEY);
    if (raw) {
      const list: ProjectReview[] = JSON.parse(raw);
      const updated = list.map((r) => {
        if (r.id === id) {
          newLikes = (r.likes || 0) + 1;
          return { ...r, likes: newLikes };
        }
        return r;
      });
      localStorage.setItem(STORAGE_PROJECT_REVIEWS_KEY, JSON.stringify(updated));
    }
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("portfolio_reviews_updated"));
    }
  } catch (e) {}

  if (isSupabaseConfigured && supabase) {
    const client = supabase;
    try {
      if (!id.startsWith("rev_")) {
        const { error } = await client.rpc("increment_review_likes", { review_id: id });
        if (error) {
          await client.from("project_reviews").update({ likes: newLikes }).eq("id", id);
        }
      }
    } catch (e) {}
  }

  return newLikes;
};

// ============================================================================
// Testimonials Slider System (Home Page Dynamic Showcase)
// ============================================================================

export const STORAGE_TESTIMONIALS_CONFIG_KEY = "maharab_testimonials_config";

export interface TestimonialsConfig {
  enabled: boolean;
  minRating: number;
  maxItems: number;
  autoplay: boolean;
  pinnedReviewIds: string[];
}

export const getTestimonialsConfig = (): TestimonialsConfig => {
  try {
    const raw = localStorage.getItem(STORAGE_TESTIMONIALS_CONFIG_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        enabled: parsed.enabled !== undefined ? Boolean(parsed.enabled) : true,
        minRating: Number(parsed.minRating) || 4,
        maxItems: Number(parsed.maxItems) || 12,
        autoplay: parsed.autoplay !== undefined ? Boolean(parsed.autoplay) : true,
        pinnedReviewIds: Array.isArray(parsed.pinnedReviewIds) ? parsed.pinnedReviewIds : [],
      };
    }
  } catch (e) {}
  return {
    enabled: true,
    minRating: 4,
    maxItems: 12,
    autoplay: true,
    pinnedReviewIds: [],
  };
};

export const saveTestimonialsConfig = async (
  partial: Partial<TestimonialsConfig>
): Promise<TestimonialsConfig> => {
  const current = getTestimonialsConfig();
  const updated: TestimonialsConfig = { ...current, ...partial };
  try {
    localStorage.setItem(STORAGE_TESTIMONIALS_CONFIG_KEY, JSON.stringify(updated));
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("portfolio_testimonials_config_updated", { detail: updated })
      );
      window.dispatchEvent(new Event("portfolio_reviews_updated"));
    }
  } catch (e) {}

  if (isSupabaseConfigured && supabase) {
    try {
      const { data: existing } = await supabase.from("profile_info").select("id").limit(1);
      if (existing && existing.length > 0) {
        await supabase
          .from("profile_info")
          .update({ testimonials_enabled: updated.enabled } as any)
          .eq("id", existing[0].id);
      }
    } catch (e) {}
  }
  return updated;
};

export const togglePinReview = async (reviewId: string): Promise<TestimonialsConfig> => {
  const current = getTestimonialsConfig();
  const existingPins = current.pinnedReviewIds || [];
  let updatedPins: string[];
  if (existingPins.includes(reviewId)) {
    updatedPins = existingPins.filter((id) => id !== reviewId);
  } else {
    updatedPins = [...existingPins, reviewId];
  }
  return saveTestimonialsConfig({ pinnedReviewIds: updatedPins });
};

export const movePinnedReview = async (
  reviewId: string,
  direction: "up" | "down"
): Promise<TestimonialsConfig> => {
  const current = getTestimonialsConfig();
  const pins = [...(current.pinnedReviewIds || [])];
  const idx = pins.indexOf(reviewId);
  if (idx === -1) return current;

  if (direction === "up" && idx > 0) {
    const temp = pins[idx - 1];
    pins[idx - 1] = pins[idx];
    pins[idx] = temp;
  } else if (direction === "down" && idx < pins.length - 1) {
    const temp = pins[idx + 1];
    pins[idx + 1] = pins[idx];
    pins[idx] = temp;
  }

  return saveTestimonialsConfig({ pinnedReviewIds: pins });
};

export const useTestimonialsConfig = (): TestimonialsConfig => {
  const [config, setConfig] = useState<TestimonialsConfig>(getTestimonialsConfig);

  useEffect(() => {
    const handleUpdate = () => {
      setConfig(getTestimonialsConfig());
    };
    window.addEventListener("portfolio_testimonials_config_updated", handleUpdate);
    return () => {
      window.removeEventListener("portfolio_testimonials_config_updated", handleUpdate);
    };
  }, []);

  return config;
};

export const getBestProjectReviews = async (
  minRating = 4,
  limit = 12
): Promise<ProjectReview[]> => {
  const allReviews = await getProjectReviews();
  if (!allReviews || allReviews.length === 0) return [];

  // Reordering in Admin places top testimonials at the start of the list.
  // Filter by minRating if available, retaining the exact ordered sequence:
  let candidates = allReviews.filter((r) => (r.rating || 5) >= minRating);
  if (candidates.length === 0) {
    candidates = allReviews;
  }

  return candidates.slice(0, limit);
};

// ============================================================================
// Development Process Service & Hook
// ============================================================================
export const STORAGE_DEV_PROCESS_CONFIG_KEY = "maharab_cached_dev_process";

export const getDevelopmentProcessConfig = (): DevelopmentProcessConfig => {
  try {
    const cached = localStorage.getItem(STORAGE_DEV_PROCESS_CONFIG_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (
        parsed &&
        typeof parsed.enabled === "boolean" &&
        Array.isArray(parsed.steps) &&
        parsed.steps[0]?.id !== "step-1"
      ) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Failed to read cached development process config:", e);
  }
  return DEFAULT_PROCESS_CONFIG;
};

export const saveDevelopmentProcessConfig = async (
  partial: Partial<DevelopmentProcessConfig>
): Promise<DevelopmentProcessConfig> => {
  const current = getDevelopmentProcessConfig();
  const updated: DevelopmentProcessConfig = {
    ...current,
    ...partial,
    steps: partial.steps || current.steps || DEFAULT_PROCESS_CONFIG.steps,
  };

  try {
    localStorage.setItem(STORAGE_DEV_PROCESS_CONFIG_KEY, JSON.stringify(updated));
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("portfolio_dev_process_updated", { detail: updated })
      );
    }
  } catch (e) {}

  if (isSupabaseConfigured && supabase) {
    try {
      const { data: existing } = await supabase.from("profile_info").select("id").limit(1);
      if (existing && existing.length > 0) {
        await supabase
          .from("profile_info")
          .update({ development_process: updated } as any)
          .eq("id", existing[0].id);
      }
    } catch (e) {}
  }

  return updated;
};

export const resetDevelopmentProcessConfig = async (): Promise<DevelopmentProcessConfig> => {
  return saveDevelopmentProcessConfig(DEFAULT_PROCESS_CONFIG);
};

export const useDevelopmentProcessConfig = (): DevelopmentProcessConfig => {
  const [config, setConfig] = useState<DevelopmentProcessConfig>(getDevelopmentProcessConfig);

  useEffect(() => {
    let active = true;
    if (isSupabaseConfigured && supabase) {
      (async () => {
        try {
          const { data, error } = await supabase
            .from("profile_info")
            .select("development_process")
            .limit(1);
          if (!error && data && data.length > 0 && (data[0] as any)?.development_process) {
            const remote = (data[0] as any).development_process;
            if (active && remote && typeof remote.enabled === "boolean") {
              setConfig(remote);
              try {
                localStorage.setItem(STORAGE_DEV_PROCESS_CONFIG_KEY, JSON.stringify(remote));
              } catch (e) {}
            }
          }
        } catch (e) {}
      })();
    }

    const handleUpdate = (e?: any) => {
      if (e?.detail) {
        setConfig(e.detail);
      } else {
        setConfig(getDevelopmentProcessConfig());
      }
    };

    window.addEventListener("portfolio_dev_process_updated", handleUpdate);
    return () => {
      active = false;
      window.removeEventListener("portfolio_dev_process_updated", handleUpdate);
    };
  }, []);

  return config;
};

// ============================================================================
// Experience Service (Local-First with Supabase Cloud Sync)
// ============================================================================
export const STORAGE_EXPERIENCE_KEY = "maharab_cached_experience";
export const STORAGE_EXPERIENCE_CONFIG_KEY = "maharab_cached_experience_config";

export const getLiveExperience = async (): Promise<ExperienceItem[]> => {
  try {
    const cached = localStorage.getItem(STORAGE_EXPERIENCE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {}

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("experience")
        .select("*")
        .order("order_index", { ascending: true });

      if (!error && data && data.length > 0) {
        const mapped: ExperienceItem[] = data.map((d: any) => ({
          id: d.id,
          role: d.role || "",
          company: d.company || "",
          companyUrl: d.company_url || d.companyUrl || "",
          companyLogo: d.company_logo || d.companyLogo || "",
          location: d.location || "",
          period: d.period || "",
          employmentType: d.employment_type || d.employmentType || "",
          description: d.description || "",
          technologies: Array.isArray(d.technologies) ? d.technologies : [],
          highlights: Array.isArray(d.highlights) ? d.highlights : [],
          isActive: d.is_active !== undefined ? d.is_active : (d.isActive !== undefined ? d.isActive : true),
        }));
        try {
          localStorage.setItem(STORAGE_EXPERIENCE_KEY, JSON.stringify(mapped));
        } catch (e) {}
        return mapped;
      }
    } catch (e) {}
  }

  return EXPERIENCE_DATA;
};

export const saveLiveExperience = async (
  experienceList: ExperienceItem[]
): Promise<{ success: boolean; error?: string }> => {
  // 1. Immediately update localStorage & dispatch custom event
  try {
    localStorage.setItem(STORAGE_EXPERIENCE_KEY, JSON.stringify(experienceList));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("portfolio_experience_updated"));
    }
  } catch (e) {}

  // 2. Sync with Supabase cloud if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const rows = experienceList.map((exp, idx) => ({
        role: exp.role,
        company: exp.company,
        company_url: exp.companyUrl || "",
        company_logo: exp.companyLogo || "",
        location: exp.location || "",
        period: exp.period,
        employment_type: exp.employmentType || "",
        description: exp.description,
        technologies: exp.technologies || [],
        highlights: exp.highlights || [],
        is_active: exp.isActive !== false,
        order_index: idx,
      }));

      // Delete existing and insert updated list
      await supabase.from("experience").delete().neq("role", "___never_match___");
      const { error } = await supabase.from("experience").insert(rows);
      if (error) {
        return { success: true, error: error.message };
      }
    } catch (err: any) {
      return { success: true, error: err.message };
    }
  }

  return { success: true };
};

export const getLiveExperienceConfig = (): ExperienceConfig => {
  try {
    const raw = localStorage.getItem(STORAGE_EXPERIENCE_CONFIG_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.isActive === "boolean") {
        return {
          ...DEFAULT_EXPERIENCE_CONFIG,
          ...parsed,
        };
      }
    }
  } catch (e) {}
  return DEFAULT_EXPERIENCE_CONFIG;
};

export const saveExperienceConfig = async (
  updates: Partial<ExperienceConfig>
): Promise<ExperienceConfig> => {
  const current = getLiveExperienceConfig();
  const updated: ExperienceConfig = {
    ...current,
    ...updates,
  };

  try {
    localStorage.setItem(STORAGE_EXPERIENCE_CONFIG_KEY, JSON.stringify(updated));
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("portfolio_experience_config_updated", { detail: updated })
      );
    }
  } catch (e) {}

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase
        .from("profile_info")
        .update({ experience_config: updated })
        .limit(1);
    } catch (e) {}
  }

  return updated;
};

export const resetExperienceDefaults = async (): Promise<{
  config: ExperienceConfig;
  items: ExperienceItem[];
}> => {
  const config = await saveExperienceConfig(DEFAULT_EXPERIENCE_CONFIG);
  await saveLiveExperience(EXPERIENCE_DATA);
  return { config, items: EXPERIENCE_DATA };
};

export const useExperienceConfig = (): ExperienceConfig => {
  const [config, setConfig] = useState<ExperienceConfig>(getLiveExperienceConfig);

  useEffect(() => {
    let active = true;
    if (isSupabaseConfigured && supabase) {
      (async () => {
        try {
          const { data, error } = await supabase
            .from("profile_info")
            .select("experience_config")
            .limit(1);
          if (!error && data && data.length > 0 && (data[0] as any)?.experience_config) {
            const remote = (data[0] as any).experience_config;
            if (active && remote && typeof remote.isActive === "boolean") {
              setConfig(remote);
              try {
                localStorage.setItem(STORAGE_EXPERIENCE_CONFIG_KEY, JSON.stringify(remote));
              } catch (e) {}
            }
          }
        } catch (e) {}
      })();
    }

    const handleUpdate = (e?: any) => {
      if (e?.detail) {
        setConfig(e.detail);
      } else {
        setConfig(getLiveExperienceConfig());
      }
    };

    window.addEventListener("portfolio_experience_config_updated", handleUpdate);
    return () => {
      active = false;
      window.removeEventListener("portfolio_experience_config_updated", handleUpdate);
    };
  }, []);

  return config;
};
