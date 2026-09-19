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

export interface ProjectMatch {
  project: Project;
  score: number;
  matchType: "exact" | "strong" | "partial";
  matchedReason?: string;
}

// Conversational and filler stop words in English and Bengali/Banglish
const CONVERSATIONAL_STOPWORDS = new Set([
  // English
  "tell", "me", "about", "show", "can", "you", "give", "info", "information",
  "please", "what", "is", "the", "a", "an", "of", "to", "for", "with", "and",
  "or", "in", "on", "at", "by", "from", "do", "does", "did", "have", "has",
  "any", "some", "all", "project", "projects", "app", "apps", "system", "platform",
  "details", "view", "open", "check", "how", "he", "his",
  // Bengali / Banglish
  "ami", "amake", "apni", "tumi", "bolo", "bolba", "bolte", "parba", "parben",
  "dekhao", "dekhte", "chai", "kichu", "kono", "konta", "ki", "eta", "eita",
  "ei", "ta", "ekto", "ache", "ase", "asen", "halka", "niye", "shomporke",
  "somporke", "bistarito", "moddhe", "er", "te", "koro", "koren", "likhe",
  "msg", "dichi", "reply", "diche", "kore", "answer", "dibo", "kujchem",
  "khujchen", "onno", "kicho",
]);

/**
 * Intelligent dynamic project matching engine.
 * Dynamically evaluates all project properties (title, id, acronyms, subtitle,
 * technologies, description, problem, solution, features, category) to accurately
 * identify matching projects even from short acronyms ("nlp", "iot", "ml") or partial queries.
 */
export const findDynamicProjectMatches = (
  projects: Project[],
  rawQuery: string
): ProjectMatch[] => {
  const cleanQ = rawQuery.toLowerCase().trim();
  if (!cleanQ) return [];

  // 1. Tokenize query
  const allTokens = cleanQ
    .replace(/[^a-z0-9.+]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  // Filter out conversational stop words if we have other meaningful terms
  const meaningfulTokens = allTokens.filter((t) => !CONVERSATIONAL_STOPWORDS.has(t));
  const tokens = meaningfulTokens.length > 0 ? meaningfulTokens : allTokens;

  const results: ProjectMatch[] = [];

  for (const p of projects) {
    let score = 0;
    const matchedReasons: string[] = [];

    const idLower = p.id.toLowerCase();
    const idTokens = idLower.split("-");
    const titleLower = p.title.toLowerCase();
    const titleTokens = titleLower
      .replace(/[^a-z0-9.+]/g, " ")
      .split(/\s+/)
      .filter(Boolean);

    // Extract title acronyms (e.g. "NLP" from "NLP Sentiment Analyzer", "BUBT", "BD")
    const titleAcronyms = p.title
      .split(/\s+/)
      .map((w) => w.replace(/[^a-zA-Z]/g, ""))
      .filter((w) => w.length >= 2 && w === w.toUpperCase())
      .map((w) => w.toLowerCase());

    const subtitleLower = (p.subtitle || "").toLowerCase();
    const subtitleTokens = subtitleLower
      .replace(/[^a-z0-9.+]/g, " ")
      .split(/\s+/)
      .filter(Boolean);

    const techsLower = p.technologies.map((t) => t.toLowerCase());
    const categoryLower = p.category.toLowerCase();
    const categoryLabelLower = p.categoryLabel.toLowerCase();
    const descLower = (p.description || "").toLowerCase();
    const problemLower = (p.problem || "").toLowerCase();
    const solutionLower = (p.solution || "").toLowerCase();
    const featuresLower = (p.features || []).join(" ").toLowerCase();

    // A. DIRECT EXACT / SUBSTRING MATCHES
    if (cleanQ === idLower || cleanQ === titleLower) {
      score += 200;
      matchedReasons.push("Exact ID/Title match");
    } else if (titleLower.startsWith(cleanQ) || titleLower.includes(cleanQ)) {
      score += 150;
      matchedReasons.push("Title contains query");
    } else if (cleanQ.includes(idLower) || cleanQ.includes(titleLower)) {
      score += 140;
      matchedReasons.push("Query contains project title/id");
    }

    // B. ACRONYM MATCH (e.g. "nlp" -> "NLP Sentiment Analyzer", "iot" -> IoT projects)
    for (const t of tokens) {
      if (titleAcronyms.includes(t)) {
        score += 160;
        matchedReasons.push(`Title acronym "${t.toUpperCase()}"`);
      }
    }

    // C. TOKEN LEVEL MATCHES IN TITLE & ID
    for (const t of tokens) {
      if (titleTokens.includes(t)) {
        // Direct title word match (e.g. "sentiment", "analyzer", "purchifyshop")
        score += t.length <= 3 ? 80 : 120;
        matchedReasons.push(`Title word "${t}"`);
      } else if (idTokens.includes(t)) {
        score += 100;
        matchedReasons.push(`ID segment "${t}"`);
      } else {
        // Substring match in title words (e.g. "purchify" in "purchifyshop")
        for (const tw of titleTokens) {
          if (tw.length >= 4 && (tw.includes(t) || t.includes(tw))) {
            score += 90;
            matchedReasons.push(`Partial title match "${t}" in "${tw}"`);
            break;
          }
        }
      }
    }

    // D. TECHNOLOGY MATCHES
    for (const t of tokens) {
      const exactTech = techsLower.find((tech) => tech === t);
      if (exactTech) {
        score += 85;
        matchedReasons.push(`Technology "${exactTech}"`);
      } else {
        const partialTech = techsLower.find(
          (tech) => tech.length >= 3 && (tech.includes(t) || t.includes(tech))
        );
        if (partialTech) {
          score += 65;
          matchedReasons.push(`Technology match "${partialTech}"`);
        }
      }
    }

    // E. SUBTITLE & CATEGORY MATCHES
    for (const t of tokens) {
      if (subtitleTokens.includes(t)) {
        score += 55;
        matchedReasons.push(`Subtitle word "${t}"`);
      }
    }

    if (
      tokens.some((t) => t === categoryLower || categoryLabelLower.includes(t)) ||
      cleanQ.includes(categoryLower) ||
      cleanQ.includes(categoryLabelLower)
    ) {
      score += 45;
      matchedReasons.push(`Category match`);
    }

    // F. CONTEXTUAL / BODY MATCH ("halka kicho mile")
    // Check description, problem, solution, features
    for (const t of tokens) {
      if (t.length >= 3) {
        if (descLower.includes(t)) {
          score += 35;
          matchedReasons.push(`Description match "${t}"`);
        } else if (solutionLower.includes(t)) {
          score += 25;
          matchedReasons.push(`Solution match "${t}"`);
        } else if (problemLower.includes(t)) {
          score += 20;
          matchedReasons.push(`Problem match "${t}"`);
        } else if (featuresLower.includes(t)) {
          score += 20;
          matchedReasons.push(`Feature match "${t}"`);
        }
      }
    }

    // Determine match confidence
    if (score >= 35) {
      let matchType: "exact" | "strong" | "partial" = "partial";
      if (score >= 120) {
        matchType = "exact";
      } else if (score >= 65) {
        matchType = "strong";
      }

      results.push({
        project: p,
        score,
        matchType,
        matchedReason: matchedReasons.join(", "),
      });
    }
  }

  // Sort by highest score first
  results.sort((a, b) => b.score - a.score);

  return results;
};

