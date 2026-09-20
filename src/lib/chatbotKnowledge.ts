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
  getCachedReviewsSync, getCachedChatbotQASync,
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
  chatbotQA: any[];
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
  const reviews = getCachedReviewsSync();
  const chatbotQA = getCachedChatbotQASync();

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
    chatbotQA,
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
    // 1. Match in technologies array (strict word boundary or exact for short tokens)
    const techMatch = p.technologies.some((t) => {
      const tClean = t.toLowerCase().trim();
      if (tClean === clean) return true;
      const tWords = tClean.split(/[^a-z0-9.+]/).filter(Boolean);
      if (tWords.includes(clean)) return true;
      if (clean.length >= 4 && tClean.length >= 4) {
        return tClean.includes(clean) || clean.includes(tClean);
      }
      return false;
    });

    // 2. Direct title match (word boundary or min 4 chars)
    const titleLower = p.title.toLowerCase();
    const titleWords = titleLower.split(/[^a-z0-9.+]/).filter(Boolean);
    const titleMatch =
      titleWords.includes(clean) ||
      (clean.length >= 4 && titleLower.includes(clean));

    // 3. Category match if searching for general categories (e.g. "mobile", "iot", "web", "ml", "ai")
    const isCategory =
      clean === "mobile" ||
      clean === "web" ||
      clean === "iot" ||
      clean === "ml" ||
      clean === "ai";
    const catMatch =
      isCategory &&
      (p.category.toLowerCase() === clean ||
        (clean === "ai" && (p.category === "ml" || p.categoryLabel.toLowerCase().includes("ai"))) ||
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
    const techMatch = p.technologies.some((t) => {
      const tl = t.toLowerCase();
      if (tl === clean) return true;
      const tWords = tl.split(/[^a-z0-9.+]/).filter(Boolean);
      if (tWords.includes(clean)) return true;
      if (clean.length >= 4 && tl.length >= 4) return tl.includes(clean);
      return false;
    });
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

  const skillItem = skills.find((s) => {
    const sClean = s.name.toLowerCase().trim();
    if (sClean === clean) return true;
    const sWords = sClean.split(/[^a-z0-9.+]/).filter(Boolean);
    if (sWords.includes(clean)) return true;
    if (clean.length >= 4 && sClean.length >= 4) {
      return sClean.includes(clean) || clean.includes(sClean);
    }
    return false;
  });

  const projectsUsingIt = projects.filter((p) =>
    p.technologies.some((t) => {
      const tClean = t.toLowerCase().trim();
      if (tClean === clean) return true;
      const tWords = tClean.split(/[^a-z0-9.+]/).filter(Boolean);
      if (tWords.includes(clean)) return true;
      if (clean.length >= 4 && tClean.length >= 4) {
        return tClean.includes(clean) || clean.includes(tClean);
      }
      return false;
    })
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
      } else if (t.length >= 4) {
        // Substring match in title words (only for 4+ character tokens)
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
        // Word boundary check or 4+ char substring
        const partialTech = techsLower.find((tech) => {
          const techWords = tech.split(/[^a-z0-9.+]/).filter(Boolean);
          if (techWords.includes(t)) return true;
          if (t.length >= 4 && tech.length >= 4) {
            return tech.includes(t) || t.includes(tech);
          }
          return false;
        });
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

    const cleanTokens = cleanQ.split(/[^a-z0-9]/).filter(Boolean);
    const isCategoryMatch =
      tokens.some((t) => t === categoryLower || categoryLabelLower.split(/[^a-z0-9]/).includes(t)) ||
      cleanTokens.includes(categoryLower) ||
      (categoryLower === "ml" && (cleanTokens.includes("ai") || cleanTokens.includes("ml") || cleanQ.includes("machine learning") || cleanQ.includes("deep learning")));

    if (isCategoryMatch) {
      score += 70;
      matchedReasons.push(`Category match`);
    }

    // F. CONTEXTUAL / BODY MATCH ("halka kicho mile")
    // Check description, problem, solution, features with whole word boundary
    for (const t of tokens) {
      if (t.length >= 3) {
        const wordRegex = new RegExp(`\\b${t}\\b`, "i");
        if (wordRegex.test(descLower)) {
          score += 35;
          matchedReasons.push(`Description match "${t}"`);
        } else if (wordRegex.test(solutionLower)) {
          score += 25;
          matchedReasons.push(`Solution match "${t}"`);
        } else if (wordRegex.test(problemLower)) {
          score += 20;
          matchedReasons.push(`Problem match "${t}"`);
        } else if (wordRegex.test(featuresLower)) {
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

