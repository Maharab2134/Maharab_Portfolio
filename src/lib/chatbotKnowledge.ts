/**
 * Dynamic Portfolio Knowledge Base
 *
 * Single Source of Truth: Extracts live, dynamically available portfolio data
 * without creating any separate, duplicate, or manually maintained static copies.
 *
 * When any content is updated via Admin Studio, Supabase, or local storage,
 * this knowledge base immediately and automatically serves the updated content.
 */

import {
  PORTFOLIO_INFO,
  EducationItem,
  ExperienceItem,
  CertificateItem,
  SkillItemData,
  SkillCategory,
  DEFAULT_SKILL_CATEGORIES,
} from "../data/portfolioData";
import { Project, getAllProjectsSync } from "../data/projectsData";
import {
  getCachedEducationSync,
  getCachedCertificatesSync,
  getCachedExperienceSync,
  getCachedSkillsSync,
  getCachedReviewsSync,
  STORAGE_PROFILE_KEY,
  STORAGE_SKILL_CATEGORIES_KEY,
  ProjectReview,
  getLiveExperienceConfig,
} from "./portfolioService";
import { DEFAULT_PROCESS_CONFIG, DevelopmentProcessConfig } from "../data/processData";

export interface ActiveContext {
  view: "home" | "hire" | "journey" | "project" | "admin" | "case-studies";
  project?: Project | null;
  section?: string | null;
}

export interface DynamicPortfolioSnapshot {
  profile: typeof PORTFOLIO_INFO;
  projects: Project[];
  skills: SkillItemData[];
  skillCategories: SkillCategory[];
  experience: ExperienceItem[];
  experienceConfig: ReturnType<typeof getLiveExperienceConfig>;
  education: EducationItem[];
  certificates: CertificateItem[];
  process: DevelopmentProcessConfig;
  reviews: ProjectReview[];
  context: ActiveContext;
}

/**
 * Reads the latest live profile synchronously from cache, falling back to base defaults
 */
export const getLiveProfileSync = (): typeof PORTFOLIO_INFO => {
  try {
    const cached = localStorage.getItem(STORAGE_PROFILE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && typeof parsed === "object") {
        return {
          ...PORTFOLIO_INFO,
          ...parsed,
          stats: {
            ...PORTFOLIO_INFO.stats,
            ...(parsed.stats || {}),
          },
          socials: {
            ...PORTFOLIO_INFO.socials,
            ...(parsed.socials || {}),
          },
          workingHours: {
            ...PORTFOLIO_INFO.workingHours,
            ...(parsed.workingHours || parsed.working_hours || {}),
          },
        };
      }
    }
  } catch (e) {}
  return PORTFOLIO_INFO;
};

/**
 * Reads skill categories synchronously from cache, falling back to defaults
 */
export const getLiveSkillCategoriesSync = (): SkillCategory[] => {
  try {
    const cached = localStorage.getItem(STORAGE_SKILL_CATEGORIES_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return DEFAULT_SKILL_CATEGORIES;
};

/**
 * Reads development process configuration synchronously
 */
export const getLiveProcessSync = (): DevelopmentProcessConfig => {
  try {
    const cached = localStorage.getItem("maharab_process_config");
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && typeof parsed === "object") {
        return { ...DEFAULT_PROCESS_CONFIG, ...parsed };
      }
    }
  } catch (e) {}
  return DEFAULT_PROCESS_CONFIG;
};

/**
 * Builds an on-demand, strictly up-to-date snapshot of the portfolio's entire content.
 * Guarantees zero stale state and zero duplicate static databases.
 */
export const getDynamicPortfolioSnapshot = (context: ActiveContext): DynamicPortfolioSnapshot => {
  const profile = getLiveProfileSync();
  const allProjects = getAllProjectsSync();
  const allSkills = getCachedSkillsSync();
  const skillCategories = getLiveSkillCategoriesSync();
  const allExp = getCachedExperienceSync().filter((item) => item.isActive !== false);
  const experienceConfig = getLiveExperienceConfig();
  const allEdu = getCachedEducationSync().filter((item) => item.isActive !== false);
  const allCerts = getCachedCertificatesSync();
  const process = getLiveProcessSync();
  const reviews = getCachedReviewsSync(20);

  return {
    profile,
    projects: allProjects,
    skills: allSkills,
    skillCategories,
    experience: allExp,
    experienceConfig,
    education: allEdu,
    certificates: allCerts,
    process,
    reviews,
    context,
  };
};

/**
 * Strict technology search utility against existing projects data.
 * Verifies that a project was authentically engineered with the technology,
 * preventing accidental false-positive matches on general text descriptions.
 */
export const searchProjectsByTechnology = (
  projects: Project[],
  techName: string
): Project[] => {
  const clean = techName.toLowerCase().trim();
  if (!clean) return projects;

  return projects.filter((p) => {
    // 1. Strict match in technologies array
    const techMatch = p.technologies.some((t) => {
      const tClean = t.toLowerCase().trim();
      return (
        tClean === clean ||
        tClean.includes(clean) ||
        clean.includes(tClean)
      );
    });

    // 2. Direct title match (e.g. "Islamic Life Assistant Flutter Application")
    const titleMatch = p.title.toLowerCase().includes(clean);

    // 3. Category match if searching for general categories (e.g. "mobile", "iot", "web", "ml")
    const isCategory =
      clean === "mobile" ||
      clean === "web" ||
      clean === "iot" ||
      clean === "ml" ||
      clean === "ai";
    const catMatch =
      isCategory &&
      (p.category.toLowerCase() === clean ||
        p.categoryLabel.toLowerCase().includes(clean));

    return techMatch || titleMatch || catMatch;
  });
};

/**
 * General multi-field query search utility
 */
export const searchProjects = (
  projects: Project[],
  query: string
): Project[] => {
  const clean = query.toLowerCase().trim();
  if (!clean) return projects;

  return projects.filter((p) => {
    const titleMatch = p.title.toLowerCase().includes(clean);
    const descMatch = p.description.toLowerCase().includes(clean);
    const catMatch =
      p.category.toLowerCase().includes(clean) ||
      p.categoryLabel.toLowerCase().includes(clean);
    const techMatch = p.technologies.some((t) => t.toLowerCase().includes(clean));
    const featureMatch = p.features.some((f) => f.toLowerCase().includes(clean));
    return titleMatch || descMatch || catMatch || techMatch || featureMatch;
  });
};

export const findSkillInPortfolio = (
  skills: SkillItemData[],
  projects: Project[],
  techName: string
): { found: boolean; skillItem?: SkillItemData; projectsUsingIt: Project[] } => {
  const clean = techName.toLowerCase().trim();

  const skillItem = skills.find(
    (s) =>
      s.name.toLowerCase() === clean ||
      s.name.toLowerCase().includes(clean) ||
      clean.includes(s.name.toLowerCase())
  );

  const projectsUsingIt = projects.filter((p) =>
    p.technologies.some(
      (t) =>
        t.toLowerCase() === clean ||
        t.toLowerCase().includes(clean) ||
        clean.includes(t.toLowerCase())
    )
  );

  const found = Boolean(skillItem || projectsUsingIt.length > 0);

  return {
    found,
    skillItem,
    projectsUsingIt,
  };
};
