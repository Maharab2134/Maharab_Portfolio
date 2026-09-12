import { useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "./supabaseClient";
import { PROJECTS, Project } from "../data/projectsData";
import {
  PORTFOLIO_INFO,
  EDUCATION_DATA,
  CERTIFICATES_DATA,
  EducationItem,
  CertificateItem,
} from "../data/portfolioData";

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

// Fetch live projects (Supabase + LocalStorage Smart Merge)
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
            // Local edit exists: prioritize the locally edited version
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

        try {
          localStorage.setItem("maharab_cached_projects", JSON.stringify(merged));
        } catch (e) {}

        return merged;
      }
    } catch (err) {
      console.warn("Supabase fetch failed, falling back to local data:", err);
    }
  }

  // If Supabase is empty or failed, use cached list if available
  if (cachedList.length > 0) {
    return cachedList;
  }

  // Fallback to static PROJECTS data
  return PROJECTS.map((p) => ({ ...p, _local_updated_at: 0 }));
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
      ? payload.technologies
      : (payload.technologies || "")
          .split(",")
          .map((t: string) => t.trim())
          .filter(Boolean),
    features: Array.isArray(payload.features)
      ? payload.features
      : (payload.features || "")
          .split("\n")
          .map((f: string) => f.trim())
          .filter(Boolean),
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
          bio: parsed.bio || PORTFOLIO_INFO.bio,
          email: parsed.email || PORTFOLIO_INFO.email,
          phone: parsed.phone || PORTFOLIO_INFO.phone,
          location: parsed.location || PORTFOLIO_INFO.location,
          resumeUrl: parsed.resume_url || parsed.resumeUrl || PORTFOLIO_INFO.resumeUrl,
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
          bio: row.bio || PORTFOLIO_INFO.bio,
          email: row.email || PORTFOLIO_INFO.email,
          phone: row.phone || PORTFOLIO_INFO.phone,
          whatsappNumber: (row.phone || PORTFOLIO_INFO.phone).replace(/[^0-9]/g, ""),
          whatsappUrl: `https://wa.me/${(row.phone || PORTFOLIO_INFO.phone).replace(/[^0-9]/g, "")}`,
          location: row.location || PORTFOLIO_INFO.location,
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

  // Normalize and cache
  const toCache = {
    ...profileData,
    ...(resumeUrl ? { resume_url: resumeUrl, resumeUrl } : {}),
    ...(profileImage ? { profile_image: profileImage, profileImage } : {}),
    show_intro_video: showIntroVideo,
    showIntroVideo: showIntroVideo,
    intro_video_url: introVideoUrl,
    introVideoUrl: introVideoUrl,
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
        bio: profileData.bio,
        email: profileData.email,
        phone: profileData.phone,
        location: profileData.location,
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
          delete safeDb.tagline;
          await supabase.from("profile_info").update(safeDb).eq("id", existing[0].id);
        }
      } else {
        const { error: insErr } = await supabase.from("profile_info").insert([dbProfile]);
        if (insErr) {
          const safeDb = { ...dbProfile };
          delete safeDb.show_intro_video;
          delete safeDb.intro_video_url;
          delete safeDb.tagline;
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
            bio: parsed.bio || PORTFOLIO_INFO.bio,
            email: parsed.email || PORTFOLIO_INFO.email,
            phone: parsed.phone || PORTFOLIO_INFO.phone,
            whatsappNumber: (parsed.phone || PORTFOLIO_INFO.phone).replace(/[^0-9]/g, ""),
            whatsappUrl: `https://wa.me/${(parsed.phone || PORTFOLIO_INFO.phone).replace(/[^0-9]/g, "")}`,
            location: parsed.location || PORTFOLIO_INFO.location,
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
