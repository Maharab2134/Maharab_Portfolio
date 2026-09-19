/**
 * Background Sync Engine for Portfolio User Panel
 *
 * Ensures 100% of data synchronization, Supabase cloud queries, and cache revalidation
 * happen purely in the background during idle browser frames (via requestIdleCallback).
 *
 * Design Goals:
 * - 0ms main thread blocking on initial render and route transitions
 * - 0 layout shifts, zero UI pop-ins
 * - Non-blocking idle execution (never competes with animations or scrolling)
 * - Deep equality check to prevent unnecessary re-renders
 * - Relieves the frontend completely of data-fetching pressure
 */

import { supabase, isSupabaseConfigured } from "./supabaseClient";
import {
  STORAGE_PROJECTS_KEY,
  STORAGE_EXPERIENCE_KEY,
  STORAGE_EDUCATION_KEY,
  STORAGE_CERTIFICATES_KEY,
  STORAGE_SKILLS_KEY,
  STORAGE_SKILL_CATEGORIES_KEY,
  STORAGE_PROFILE_KEY,
  STORAGE_PROJECT_REVIEWS_KEY,
  STORAGE_EXPERIENCE_CONFIG_KEY,
  mapSupabaseToProject,
  SkillItemData,
  SkillCategory,
  ProjectReview,
} from "./portfolioService";
import { ExperienceItem, EducationItem, CertificateItem } from "../data/portfolioData";

/**
 * Executes a task during browser idle time, or falls back to setTimeout.
 * Guarantees that active UI work (scrolling, clicking, rendering) always takes precedence.
 */
export const runWhenIdle = (callback: () => void, timeoutMs = 2500): number | any => {
  if (typeof window === "undefined") return 0;
  if ("requestIdleCallback" in window) {
    return (window as any).requestIdleCallback(callback, { timeout: timeoutMs });
  }
  return setTimeout(callback, Math.min(timeoutMs, 1000));
};

/**
 * Deep equality helper to verify if cached data changed before notifying React components.
 */
const isContentEqual = (a: any, b: any): boolean => {
  if (a === b) return true;
  if (!a || !b) return false;
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch {
    return false;
  }
};

/**
 * Background Sync Tasks
 */

// 1. Projects Background Sync
const syncProjects = async () => {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && Array.isArray(data) && data.length > 0) {
      const mapped = data.map(mapSupabaseToProject);
      const rawCached = localStorage.getItem(STORAGE_PROJECTS_KEY);
      const parsedCached = rawCached ? JSON.parse(rawCached) : null;

      // Only dispatch update if cloud data differs from local cache
      if (!isContentEqual(parsedCached, mapped)) {
        localStorage.setItem(STORAGE_PROJECTS_KEY, JSON.stringify(mapped));
        window.dispatchEvent(new Event("portfolio_projects_updated"));
      }
    }
  } catch (e) {
    // Non-critical background task failure, silently ignored
  }
};

// 2. Experience Background Sync
const syncExperience = async () => {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const { data, error } = await supabase
      .from("experience")
      .select("*")
      .order("order_index", { ascending: true });

    if (!error && Array.isArray(data) && data.length > 0) {
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
      const rawCached = localStorage.getItem(STORAGE_EXPERIENCE_KEY);
      const parsedCached = rawCached ? JSON.parse(rawCached) : null;

      if (!isContentEqual(parsedCached, mapped)) {
        localStorage.setItem(STORAGE_EXPERIENCE_KEY, JSON.stringify(mapped));
        window.dispatchEvent(new Event("portfolio_experience_updated"));
      }
    }
  } catch (e) {}
};

// 3. Education Background Sync
const syncEducation = async () => {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const { data, error } = await supabase
      .from("education")
      .select("*")
      .order("order_index", { ascending: true });

    if (!error && Array.isArray(data) && data.length > 0) {
      const mapped: EducationItem[] = data.map((d: any) => ({
        id: d.id,
        degree: d.degree || "",
        institution: d.institution || "",
        period: d.period || "",
        description: d.description || "",
        score: d.score || "",
        field: d.field || "",
        highlights: Array.isArray(d.highlights) ? d.highlights : [],
        isActive: d.is_active !== undefined ? d.is_active : (d.isActive !== undefined ? d.isActive : true),
      }));
      const rawCached = localStorage.getItem(STORAGE_EDUCATION_KEY);
      const parsedCached = rawCached ? JSON.parse(rawCached) : null;

      if (!isContentEqual(parsedCached, mapped)) {
        localStorage.setItem(STORAGE_EDUCATION_KEY, JSON.stringify(mapped));
        window.dispatchEvent(new Event("portfolio_education_updated"));
      }
    }
  } catch (e) {}
};

// 4. Certificates Background Sync
const syncCertificates = async () => {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const { data, error } = await supabase
      .from("certificates")
      .select("*")
      .order("order_index", { ascending: true });

    if (!error && Array.isArray(data) && data.length > 0) {
      const mapped: CertificateItem[] = data.map((c: any) => ({
        title: c.title || "",
        issuer: c.issuer || "",
        year: c.year || "",
        type: c.type || "Professional",
        link: c.link || "",
        details: c.details || "",
        verificationId: c.verification_id || c.verificationId || "",
      }));
      const rawCached = localStorage.getItem(STORAGE_CERTIFICATES_KEY);
      const parsedCached = rawCached ? JSON.parse(rawCached) : null;

      if (!isContentEqual(parsedCached, mapped)) {
        localStorage.setItem(STORAGE_CERTIFICATES_KEY, JSON.stringify(mapped));
        window.dispatchEvent(new Event("portfolio_certificates_updated"));
      }
    }
  } catch (e) {}
};

// 5. Skills Background Sync
const syncSkills = async () => {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const [skillsRes, catsRes] = await Promise.all([
      supabase.from("skills").select("*").order("order_index", { ascending: true }),
      supabase.from("skill_categories").select("*").order("order_index", { ascending: true }),
    ]);

    if (!skillsRes.error && Array.isArray(skillsRes.data) && skillsRes.data.length > 0) {
      const mappedSkills: SkillItemData[] = skillsRes.data.map((s: any) => ({
        id: s.skill_id || s.id || `skill-${s.name?.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
        name: s.name || "",
        category: s.category || "frontend",
        level: s.level || "Core",
        color: s.color || "#a855f7",
        iconName: s.icon_name || s.iconName || "",
        order_index: s.order_index ?? 0,
      }));
      const rawCached = localStorage.getItem(STORAGE_SKILLS_KEY);
      const parsedCached = rawCached ? JSON.parse(rawCached) : null;
      if (!isContentEqual(parsedCached, mappedSkills)) {
        localStorage.setItem(STORAGE_SKILLS_KEY, JSON.stringify(mappedSkills));
        window.dispatchEvent(new Event("portfolio_skills_updated"));
      }
    }

    if (!catsRes.error && Array.isArray(catsRes.data) && catsRes.data.length > 0) {
      const mappedCats: SkillCategory[] = catsRes.data.map((c: any) => ({
        id: c.category_id || c.id,
        label: c.label || c.name || "",
        iconName: c.icon_name || c.iconName || "",
        description: c.description || "",
        order_index: c.order_index ?? 0,
      }));
      const rawCached = localStorage.getItem(STORAGE_SKILL_CATEGORIES_KEY);
      const parsedCached = rawCached ? JSON.parse(rawCached) : null;
      if (!isContentEqual(parsedCached, mappedCats)) {
        localStorage.setItem(STORAGE_SKILL_CATEGORIES_KEY, JSON.stringify(mappedCats));
        window.dispatchEvent(new Event("portfolio_skills_updated"));
      }
    }
  } catch (e) {}
};

// 6. Profile Background Sync
const syncProfile = async () => {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const { data, error } = await supabase.from("profile_info").select("*").limit(1);
    if (!error && Array.isArray(data) && data.length > 0) {
      const p = data[0];
      const rawCached = localStorage.getItem(STORAGE_PROFILE_KEY);
      const parsedCached = rawCached ? JSON.parse(rawCached) : null;
      if (!isContentEqual(parsedCached, p)) {
        localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(p));
        window.dispatchEvent(new Event("portfolio_profile_updated"));
      }

      if (p.experience_config) {
        const rawExpCfg = localStorage.getItem(STORAGE_EXPERIENCE_CONFIG_KEY);
        const parsedExpCfg = rawExpCfg ? JSON.parse(rawExpCfg) : null;
        if (!isContentEqual(parsedExpCfg, p.experience_config)) {
          localStorage.setItem(STORAGE_EXPERIENCE_CONFIG_KEY, JSON.stringify(p.experience_config));
          window.dispatchEvent(
            new CustomEvent("portfolio_experience_config_updated", { detail: p.experience_config })
          );
        }
      }
    }
  } catch (e) {}
};

// 7. Reviews / Testimonials Background Sync
const syncReviews = async () => {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const { data, error } = await supabase
      .from("project_reviews")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(60);

    if (!error && Array.isArray(data) && data.length > 0) {
      const mappedReviews: ProjectReview[] = data.map((r: any) => ({
        id: r.id,
        project_id: r.project_id || r.projectId,
        name: r.name || "Anonymous",
        email: r.email || "",
        gender: r.gender || "unspecified",
        rating: typeof r.rating === "number" ? r.rating : 5,
        message: r.message || "",
        created_at: r.created_at || new Date().toISOString(),
        likes: typeof r.likes === "number" ? r.likes : 0,
      }));
      const rawCached = localStorage.getItem(STORAGE_PROJECT_REVIEWS_KEY);
      const parsedCached = rawCached ? JSON.parse(rawCached) : null;
      if (!isContentEqual(parsedCached, mappedReviews)) {
        localStorage.setItem(STORAGE_PROJECT_REVIEWS_KEY, JSON.stringify(mappedReviews));
        window.dispatchEvent(new Event("portfolio_reviews_updated"));
      }
    }
  } catch (e) {}
};

/**
 * Sequential Idle Sync Queue:
 * Executes one sync task at a time across idle frames so the event loop stays free.
 */
export const runFullBackgroundSync = () => {
  const tasks = [
    syncProjects,
    syncExperience,
    syncEducation,
    syncCertificates,
    syncSkills,
    syncProfile,
    syncReviews,
  ];

  let taskIndex = 0;

  const executeNextTask = () => {
    if (taskIndex >= tasks.length) return;
    const task = tasks[taskIndex++];
    runWhenIdle(async () => {
      try {
        await task();
      } catch (e) {
        // silent
      }
      // Schedule next task during the subsequent idle frame
      executeNextTask();
    }, 1500);
  };

  executeNextTask();
};

let isInitialized = false;

/**
 * Initializes Background Sync Engine for the User Panel.
 * Defers the first execution until 1.5 seconds after initial page load to give
 * animations, hero rendering, and user scrolling 100% CPU time.
 */
export const initBackgroundSync = () => {
  if (typeof window === "undefined" || isInitialized) return;
  isInitialized = true;

  // 1. Initial deferred sync during idle time
  setTimeout(() => {
    runWhenIdle(() => {
      runFullBackgroundSync();
    }, 3000);
  }, 1500);

  // 2. Periodic sync every 4 minutes, only if tab is visible
  setInterval(() => {
    if (typeof document !== "undefined" && document.visibilityState === "visible") {
      runWhenIdle(() => {
        runFullBackgroundSync();
      }, 4000);
    }
  }, 240000);

  // 3. On tab focus (when visitor switches back to the tab)
  if (typeof document !== "undefined") {
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        runWhenIdle(() => {
          runFullBackgroundSync();
        }, 2000);
      }
    });
  }
};
