import React, { useState, useEffect, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";
import {
  PORTFOLIO_INFO,
  EDUCATION_DATA,
  CERTIFICATES_DATA,
  DEFAULT_SKILL_CATEGORIES,
  DEFAULT_SKILLS_DATA,
  SkillCategory,
  SkillItemData,
} from "../data/portfolioData";
import { PROJECTS } from "../data/projectsData";
import {
  getLiveProjects,
  saveLiveProject,
  getLiveMessages,
  markMessageAsRead,
  markAllMessagesAsRead,
  deleteLiveMessage,
  getLiveProfile,
  saveLiveProfile,
  saveLiveResumeUrl,
  getLiveEducation,
  getLiveCertificates,
  getLiveSkills,
  getLiveSkillCategories,
  ProjectReview,
  getProjectReviews,
  deleteProjectReview,
  useTestimonialsConfig,
  saveTestimonialsConfig,
  saveReviewsOrder,
  useDevelopmentProcessConfig,
} from "../lib/portfolioService";
import {
  getLiveAnalytics,
  clearAnalyticsHistory,
  AnalyticsSummary,
  TimeRangeFilter,
} from "../lib/analyticsService";
import {
  getLiveDynamicSitemap,
  triggerSitemapDownload,
} from "../lib/sitemapService";

// Admin Modular Components & Tabs
import { AdminNavTab, ProjectViewMode, AdminToast } from "../components/admin/types";
import { AdminHeader } from "../components/admin/AdminHeader";
import { AdminSidebar } from "../components/admin/AdminSidebar";
import { AdminLogin } from "../components/admin/AdminLogin";
import { AdminSitemapModal } from "../components/admin/AdminSitemapModal";
import { StorageRlsBanner } from "../components/admin/StorageRlsBanner";

import { OverviewTab } from "../components/admin/tabs/OverviewTab";
import { AnalyticsTab } from "../components/admin/tabs/AnalyticsTab";
import { ProjectsTab } from "../components/admin/tabs/ProjectsTab";
import { SkillsTab } from "../components/admin/tabs/SkillsTab";
import { ProcessTab } from "../components/admin/tabs/ProcessTab";
import { ProfileTab } from "../components/admin/tabs/ProfileTab";
import { EducationTab } from "../components/admin/tabs/EducationTab";
import { ResumeTab } from "../components/admin/tabs/ResumeTab";
import { MessagesTab } from "../components/admin/tabs/MessagesTab";
import { ReviewsTab } from "../components/admin/tabs/ReviewsTab";
import { SetupTab } from "../components/admin/tabs/SetupTab";

const getTabInfo = (tab: AdminNavTab): { title: string; section: string } => {
  switch (tab) {
    case "overview":
      return { title: "Dashboard Overview", section: "WORKSPACE" };
    case "analytics":
      return { title: "Visitor Intelligence & Traffic Analytics", section: "WORKSPACE" };
    case "projects":
      return { title: "Project Catalog & Studio", section: "CONTENT" };
    case "skills":
      return { title: "Skills & Technology Stack", section: "CONTENT" };
    case "process":
      return { title: "Development Process & Lifecycle", section: "CONTENT" };
    case "profile":
      return { title: "Profile & Biography", section: "CONTENT" };
    case "education":
      return { title: "Education & Credentials", section: "CONTENT" };
    case "resume":
      return { title: "Resume & Cloud Storage", section: "ASSETS" };
    case "messages":
      return { title: "Contact Inquiries", section: "INBOX" };
    case "reviews":
      return { title: "Project Reviews & Client Evaluations", section: "INBOX" };
    case "setup":
      return { title: "Supabase & Database SQL", section: "SYSTEM" };
    default:
      return { title: "Console", section: "WORKSPACE" };
  }
};

const Admin: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<AdminNavTab>("overview");
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const processConfig = useDevelopmentProcessConfig();

  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Projects state
  const [projectsList, setProjectsList] = useState<any[]>([]);
  const [projectViewMode, setProjectViewMode] = useState<ProjectViewMode>("list");
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState({
    title: "",
    category: "web",
    short_desc: "",
    full_desc: "",
    image_url: "",
    technologies: "",
    features: "",
    github_url: "",
    live_url: "",
    featured: false,
  });

  // Track review notifications seen by admin
  const [seenReviewIds, setSeenReviewIds] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem("admin_seen_review_ids");
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Profile state
  const [profileForm, setProfileForm] = useState({
    name: PORTFOLIO_INFO.name,
    short_name: PORTFOLIO_INFO.shortName,
    title: PORTFOLIO_INFO.title,
    tagline: PORTFOLIO_INFO.tagline,
    bio: PORTFOLIO_INFO.bio,
    footer_bio:
      (PORTFOLIO_INFO as any).footerBio ||
      "Full-Stack Software Engineer & Mobile Developer dedicated to creating scalable, resilient digital experiences with thoughtful design.",
    phone: PORTFOLIO_INFO.phone,
    email: PORTFOLIO_INFO.email,
    location: PORTFOLIO_INFO.location,
    maps_url: (PORTFOLIO_INFO as any).mapsUrl || "",
    resume_url: PORTFOLIO_INFO.resumeUrl,
    profile_image: PORTFOLIO_INFO.profileImage,
    show_intro_video: (PORTFOLIO_INFO as any).showIntroVideo ?? true,
    intro_video_url: (PORTFOLIO_INFO as any).introVideoUrl || PORTFOLIO_INFO.introVideoId || "",
    typewriter_prefix: (PORTFOLIO_INFO as any).typewriterPrefix || "I engineer",
    typewriter_phrases: Array.isArray((PORTFOLIO_INFO as any).typewriterPhrases)
      ? (PORTFOLIO_INFO as any).typewriterPhrases.join("\n")
      : "Scalable Full-Stack Web Apps\nCross-Platform Mobile Experiences\nHigh-Throughput REST & GraphQL APIs\nSecure Microservices Architecture",
    available_for_hire: true,
    about_stat1_val: (PORTFOLIO_INFO as any).aboutStats?.[0]?.value || "2+ Years",
    about_stat1_lbl: (PORTFOLIO_INFO as any).aboutStats?.[0]?.label || "Project Experience",
    about_stat2_val: (PORTFOLIO_INFO as any).aboutStats?.[1]?.value || "15+",
    about_stat2_lbl: (PORTFOLIO_INFO as any).aboutStats?.[1]?.label || "Projects",
    about_stat3_val: (PORTFOLIO_INFO as any).aboutStats?.[2]?.value || "10+",
    about_stat3_lbl: (PORTFOLIO_INFO as any).aboutStats?.[2]?.label || "Technologies",
    about_stat4_val: (PORTFOLIO_INFO as any).aboutStats?.[3]?.value || "CSE",
    about_stat4_lbl: (PORTFOLIO_INFO as any).aboutStats?.[3]?.label || "Academic Background",
    years_experience: PORTFOLIO_INFO.stats.yearsExperience,
    projects_completed: PORTFOLIO_INFO.stats.projectsCompleted,
    satisfaction_rate: PORTFOLIO_INFO.stats.satisfactionRate,
    github: PORTFOLIO_INFO.socials.github,
    linkedin: PORTFOLIO_INFO.socials.linkedin,
    twitter: PORTFOLIO_INFO.socials.twitter,
    work_hours_enabled: (PORTFOLIO_INFO as any).workingHours?.enabled ?? true,
    work_hours_mode: (PORTFOLIO_INFO as any).workingHours?.mode || "auto",
    work_start_time: (PORTFOLIO_INFO as any).workingHours?.startTime || "09:00",
    work_end_time: (PORTFOLIO_INFO as any).workingHours?.endTime || "22:00",
    work_timezone: (PORTFOLIO_INFO as any).workingHours?.timezone || "Asia/Dhaka",
    work_online_label: (PORTFOLIO_INFO as any).workingHours?.onlineLabel || "Available for Work",
    work_offline_label: (PORTFOLIO_INFO as any).workingHours?.offlineLabel || "Currently Away / Offline",
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [profileImageUploading, setProfileImageUploading] = useState(false);

  // Education & Certificates state
  const [educationList, setEducationList] = useState<any[]>(EDUCATION_DATA);
  const [certsList, setCertsList] = useState<any[]>(CERTIFICATES_DATA);

  // Skills & Categories state
  const [skillCategoriesList, setSkillCategoriesList] = useState<SkillCategory[]>(DEFAULT_SKILL_CATEGORIES);
  const [skillsList, setSkillsList] = useState<SkillItemData[]>(DEFAULT_SKILLS_DATA);

  // Messages state
  const [messagesList, setMessagesList] = useState<any[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);

  // Storage / Upload status
  const [uploadStatus, setUploadStatus] = useState("");
  const [storageRlsError, setStorageRlsError] = useState<string | null>(null);

  // Visitor Analytics state
  const [analyticsFilter, setAnalyticsFilter] = useState<TimeRangeFilter>("30d");
  const [analyticsSummary, setAnalyticsSummary] = useState<AnalyticsSummary | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsToast, setAnalyticsToast] = useState<AdminToast | null>(null);

  const showAnalyticsToast = (message: string, type: "success" | "error" = "success") => {
    setAnalyticsToast({ message, type });
    setTimeout(() => setAnalyticsToast(null), 3000);
  };

  // Dynamic Sitemap Automation state
  const [sitemapGenerating, setSitemapGenerating] = useState(false);
  const [showSitemapModal, setShowSitemapModal] = useState(false);
  const [sitemapXmlPreview, setSitemapXmlPreview] = useState("");
  const [sitemapCopied, setSitemapCopied] = useState(false);

  const handleGenerateSitemap = async (action: "download" | "view" | "copy") => {
    setSitemapGenerating(true);
    try {
      const { xml } = await getLiveDynamicSitemap();
      setSitemapXmlPreview(xml);

      if (action === "download") {
        triggerSitemapDownload(xml, "sitemap.xml");
        showAnalyticsToast("sitemap.xml with all live projects successfully generated & downloaded!");
      } else if (action === "copy") {
        await navigator.clipboard.writeText(xml);
        setSitemapCopied(true);
        setTimeout(() => setSitemapCopied(false), 2500);
        showAnalyticsToast("Sitemap XML copied to clipboard!");
      } else if (action === "view") {
        setShowSitemapModal(true);
      }
    } catch (err) {
      console.error("Error generating sitemap:", err);
      showAnalyticsToast("Failed to generate sitemap", "error");
    } finally {
      setSitemapGenerating(false);
    }
  };

  const loadAnalyticsData = useCallback(async (filter: TimeRangeFilter = analyticsFilter) => {
    setAnalyticsLoading(true);
    try {
      const summary = await getLiveAnalytics(filter);
      setAnalyticsSummary(summary);
    } catch (err) {
      console.error("Error loading analytics:", err);
    } finally {
      setAnalyticsLoading(false);
    }
  }, [analyticsFilter]);

  useEffect(() => {
    loadAnalyticsData(analyticsFilter);
  }, [analyticsFilter, loadAnalyticsData]);

  useEffect(() => {
    const handleUpdate = () => {
      loadAnalyticsData(analyticsFilter);
    };
    window.addEventListener("portfolio_analytics_updated", handleUpdate);
    return () => window.removeEventListener("portfolio_analytics_updated", handleUpdate);
  }, [analyticsFilter, loadAnalyticsData]);

  const handleResetAnalytics = async (skipConfirm = false) => {
    if (
      !skipConfirm &&
      !window.confirm(
        "Are you sure you want to delete all visitor analytics records from the database and local cache?"
      )
    ) {
      return;
    }
    setAnalyticsLoading(true);
    try {
      await clearAnalyticsHistory();
      await loadAnalyticsData(analyticsFilter);
      showAnalyticsToast("All visitor activity logs successfully removed from database & cache!");
    } catch (err) {
      showAnalyticsToast("Failed to delete analytics from database", "error");
    } finally {
      setAnalyticsLoading(false);
    }
  };

  // Check auth session
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch Projects from Supabase or Fallback
  const fetchProjects = useCallback(async () => {
    const liveList = await getLiveProjects();
    setProjectsList(
      liveList.map((p) => ({
        ...p,
        project_id: p.id,
        short_desc: p.description,
        full_desc: p.longDescription || p.description,
        image_url: p.image,
        github_url: p.github,
        live_url: p.link,
      }))
    );
  }, []);

  // Fetch Messages from Supabase + Local Cache
  const fetchMessages = useCallback(async () => {
    const list = await getLiveMessages();
    setMessagesList(list);
    if (list.length > 0 && !selectedMessage) {
      setSelectedMessage(list[0]);
    }
  }, [selectedMessage]);

  useEffect(() => {
    fetchMessages();
    window.addEventListener("portfolio_messages_updated", fetchMessages);
    window.addEventListener("portfolio_new_inquiry", fetchMessages);
    return () => {
      window.removeEventListener("portfolio_messages_updated", fetchMessages);
      window.removeEventListener("portfolio_new_inquiry", fetchMessages);
    };
  }, [fetchMessages]);

  const unreadMessagesCount = messagesList.filter((m) => !m.read).length;

  const handleSelectMessage = (msg: any) => {
    setSelectedMessage(msg);
    markMessageAsRead(msg.id);
    setMessagesList((prev) =>
      prev.map((m) => (m.id === msg.id ? { ...m, read: true } : m))
    );
  };

  const handleMarkAllRead = () => {
    const allIds = messagesList.map((m) => m.id);
    markAllMessagesAsRead(allIds);
    setMessagesList((prev) => prev.map((m) => ({ ...m, read: true })));
  };

  // Project Reviews state
  const [reviewsList, setReviewsList] = useState<ProjectReview[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  const fetchReviews = useCallback(async () => {
    setReviewsLoading(true);
    try {
      const list = await getProjectReviews();
      setReviewsList(list);
    } catch (e) {
      console.warn("Failed to fetch reviews:", e);
    } finally {
      setReviewsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
    window.addEventListener("portfolio_reviews_updated", fetchReviews);
    return () => {
      window.removeEventListener("portfolio_reviews_updated", fetchReviews);
    };
  }, [fetchReviews]);

  const newReviews = reviewsList.filter((r) => !seenReviewIds.has(r.id));
  const newReviewsCount = newReviews.length;

  const handleMarkReviewsSeen = () => {
    const allIds = reviewsList.map((r) => r.id);
    const merged = Array.from(seenReviewIds).concat(allIds);
    const updated = new Set(merged);
    setSeenReviewIds(updated);
    try {
      localStorage.setItem("admin_seen_review_ids", JSON.stringify(Array.from(updated)));
    } catch {}
  };

  const handleDeleteReview = async (id: string) => {
    const target = reviewsList.find((r) => r.id === id);
    if (
      !window.confirm(
        `Are you sure you want to permanently delete the review from "${target?.name || "this reviewer"}"?`
      )
    )
      return;
    setReviewsList((prev) => prev.filter((r) => r.id !== id));
    try {
      await deleteProjectReview(id, target);
    } catch (err) {
      console.warn("Delete review notice:", err);
    }
    await fetchReviews();
  };

  const testimonialsConfig = useTestimonialsConfig();
  const [testimonialsToggling, setTestimonialsToggling] = useState(false);
  const [reviewReordering, setReviewReordering] = useState(false);

  const handleToggleTestimonials = async (enable: boolean) => {
    setTestimonialsToggling(true);
    try {
      await saveTestimonialsConfig({ enabled: enable });
    } catch (e) {
      console.warn("Failed to toggle testimonials:", e);
    } finally {
      setTestimonialsToggling(false);
    }
  };

  const handleMoveReview = async (id: string, direction: "up" | "down") => {
    const currentIndex = reviewsList.findIndex((r) => r.id === id);
    if (currentIndex === -1) return;
    if (direction === "up" && currentIndex === 0) return;
    if (direction === "down" && currentIndex === reviewsList.length - 1) return;

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const copy = [...reviewsList];
    const [moved] = copy.splice(currentIndex, 1);
    copy.splice(targetIndex, 0, moved);

    setReviewsList(copy);
    setReviewReordering(true);
    await saveReviewsOrder(copy);
    setReviewReordering(false);
  };

  const handleMoveReviewToTop = async (id: string) => {
    const currentIndex = reviewsList.findIndex((r) => r.id === id);
    if (currentIndex <= 0) return;

    const copy = [...reviewsList];
    const [moved] = copy.splice(currentIndex, 1);
    copy.unshift(moved);

    setReviewsList(copy);
    setReviewReordering(true);
    await saveReviewsOrder(copy);
    setReviewReordering(false);
  };

  const fetchProfileData = useCallback(async () => {
    const liveProfile = await getLiveProfile();
    if (liveProfile) {
      setProfileForm({
        name: liveProfile.name || PORTFOLIO_INFO.name,
        short_name: liveProfile.shortName || PORTFOLIO_INFO.shortName,
        title: liveProfile.title || PORTFOLIO_INFO.title,
        tagline: liveProfile.tagline || PORTFOLIO_INFO.tagline,
        bio: liveProfile.bio || PORTFOLIO_INFO.bio,
        footer_bio:
          (liveProfile as any).footer_bio ||
          (liveProfile as any).footerBio ||
          (PORTFOLIO_INFO as any).footerBio ||
          "Full-Stack Software Engineer & Mobile Developer dedicated to creating scalable, resilient digital experiences with thoughtful design.",
        phone: liveProfile.phone || PORTFOLIO_INFO.phone,
        email: liveProfile.email || PORTFOLIO_INFO.email,
        location: liveProfile.location || PORTFOLIO_INFO.location,
        maps_url:
          (liveProfile as any).maps_url ||
          (liveProfile as any).mapsUrl ||
          (PORTFOLIO_INFO as any).mapsUrl ||
          "",
        resume_url: liveProfile.resumeUrl || PORTFOLIO_INFO.resumeUrl,
        profile_image:
          (liveProfile as any).profile_image || liveProfile.profileImage || PORTFOLIO_INFO.profileImage,
        show_intro_video:
          (liveProfile as any).show_intro_video !== undefined
            ? Boolean((liveProfile as any).show_intro_video)
            : (liveProfile as any).showIntroVideo !== undefined
            ? Boolean((liveProfile as any).showIntroVideo)
            : true,
        intro_video_url:
          (liveProfile as any).intro_video_url ||
          (liveProfile as any).introVideoUrl ||
          (liveProfile as any).introVideoId ||
          (PORTFOLIO_INFO as any).introVideoUrl ||
          "",
        typewriter_prefix:
          (liveProfile as any).typewriter_prefix ??
          (liveProfile as any).typewriterPrefix ??
          PORTFOLIO_INFO.typewriterPrefix,
        typewriter_phrases: Array.isArray((liveProfile as any).typewriterPhrases)
          ? (liveProfile as any).typewriterPhrases.join("\n")
          : Array.isArray((liveProfile as any).typewriter_phrases)
          ? (liveProfile as any).typewriter_phrases.join("\n")
          : typeof (liveProfile as any).typewriter_phrases === "string"
          ? (liveProfile as any).typewriter_phrases
          : PORTFOLIO_INFO.typewriterPhrases.join("\n"),
        available_for_hire: true,
        about_stat1_val:
          (liveProfile as any).about_stat1_val ||
          (liveProfile as any).aboutStats?.[0]?.value ||
          (PORTFOLIO_INFO as any).aboutStats?.[0]?.value ||
          "2+ Years",
        about_stat1_lbl:
          (liveProfile as any).about_stat1_lbl ||
          (liveProfile as any).aboutStats?.[0]?.label ||
          (PORTFOLIO_INFO as any).aboutStats?.[0]?.label ||
          "Project Experience",
        about_stat2_val:
          (liveProfile as any).about_stat2_val ||
          (liveProfile as any).aboutStats?.[1]?.value ||
          (PORTFOLIO_INFO as any).aboutStats?.[1]?.value ||
          "15+",
        about_stat2_lbl:
          (liveProfile as any).about_stat2_lbl ||
          (liveProfile as any).aboutStats?.[1]?.label ||
          (PORTFOLIO_INFO as any).aboutStats?.[1]?.label ||
          "Projects",
        about_stat3_val:
          (liveProfile as any).about_stat3_val ||
          (liveProfile as any).aboutStats?.[2]?.value ||
          (PORTFOLIO_INFO as any).aboutStats?.[2]?.value ||
          "10+",
        about_stat3_lbl:
          (liveProfile as any).about_stat3_lbl ||
          (liveProfile as any).aboutStats?.[2]?.label ||
          (PORTFOLIO_INFO as any).aboutStats?.[2]?.label ||
          "Technologies",
        about_stat4_val:
          (liveProfile as any).about_stat4_val ||
          (liveProfile as any).aboutStats?.[3]?.value ||
          (PORTFOLIO_INFO as any).aboutStats?.[3]?.value ||
          "CSE",
        about_stat4_lbl:
          (liveProfile as any).about_stat4_lbl ||
          (liveProfile as any).aboutStats?.[3]?.label ||
          (PORTFOLIO_INFO as any).aboutStats?.[3]?.label ||
          "Academic Background",
        years_experience: liveProfile.stats?.yearsExperience || PORTFOLIO_INFO.stats.yearsExperience,
        projects_completed: liveProfile.stats?.projectsCompleted || PORTFOLIO_INFO.stats.projectsCompleted,
        satisfaction_rate: liveProfile.stats?.satisfactionRate || PORTFOLIO_INFO.stats.satisfactionRate,
        github: liveProfile.socials?.github || PORTFOLIO_INFO.socials.github,
        linkedin: liveProfile.socials?.linkedin || PORTFOLIO_INFO.socials.linkedin,
        twitter: liveProfile.socials?.twitter || PORTFOLIO_INFO.socials.twitter,
        work_hours_enabled:
          (liveProfile as any).workingHours?.enabled ?? (liveProfile as any).work_hours_enabled ?? true,
        work_hours_mode:
          (liveProfile as any).workingHours?.mode || (liveProfile as any).work_hours_mode || "auto",
        work_start_time:
          (liveProfile as any).workingHours?.startTime || (liveProfile as any).work_start_time || "09:00",
        work_end_time:
          (liveProfile as any).workingHours?.endTime || (liveProfile as any).work_end_time || "22:00",
        work_timezone:
          (liveProfile as any).workingHours?.timezone || (liveProfile as any).work_timezone || "Asia/Dhaka",
        work_online_label:
          (liveProfile as any).workingHours?.onlineLabel ||
          (liveProfile as any).work_online_label ||
          "Available for Work",
        work_offline_label:
          (liveProfile as any).workingHours?.offlineLabel ||
          (liveProfile as any).work_offline_label ||
          "Currently Away / Offline",
      });
    }
  }, []);

  const fetchEducationAndCerts = useCallback(async () => {
    const liveEdu = await getLiveEducation();
    if (liveEdu && liveEdu.length > 0) setEducationList(liveEdu);
    const liveCerts = await getLiveCertificates();
    if (liveCerts && liveCerts.length > 0) setCertsList(liveCerts);
  }, []);

  const fetchSkillsAndCategories = useCallback(async () => {
    const liveCats = await getLiveSkillCategories();
    if (liveCats && liveCats.length > 0) setSkillCategoriesList(liveCats);
    const liveSkills = await getLiveSkills();
    if (liveSkills && liveSkills.length > 0) setSkillsList(liveSkills);
  }, []);

  useEffect(() => {
    fetchProfileData();
    fetchEducationAndCerts();
    fetchSkillsAndCategories();
    if (session) {
      fetchProjects();
      fetchMessages();
    }
  }, [session, fetchProjects, fetchMessages, fetchEducationAndCerts, fetchProfileData, fetchSkillsAndCategories]);

  // Auth Handlers
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured || !supabase) {
      setAuthError(
        "Supabase credentials missing in .env! Add REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY and restart npm start."
      );
      return;
    }

    setAuthLoading(true);
    setAuthError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setAuthError(error.message);
    }
    setAuthLoading(false);
  };

  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut();
    setSession(null);
  };

  // Open Create Project Studio
  const handleOpenCreateProject = () => {
    setEditingProjectId(null);
    setProjectForm({
      title: "",
      category: "web",
      short_desc: "",
      full_desc: "",
      image_url: "",
      technologies: "",
      features: "",
      github_url: "",
      live_url: "",
      featured: false,
    });
    setProjectViewMode("editor");
  };

  // Sync All Projects to Supabase
  const handleSyncAllProjectsToSupabase = async () => {
    if (!isSupabaseConfigured || !supabase) {
      alert("Please configure Supabase in .env first.");
      return;
    }
    if (!window.confirm("Sync all 7 default projects into your Supabase database?")) return;

    let successCount = 0;
    for (const p of PROJECTS) {
      const res = await saveLiveProject(p);
      if (res.success) successCount++;
    }
    alert(`Successfully synced ${successCount} projects to Supabase!`);
    await fetchProjects();
  };

  // Save Profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMessage("");

    const res = await saveLiveProfile(profileForm);
    setProfileSaving(false);
    if (res.error) {
      setProfileMessage("Saved to local storage! (Supabase notice: " + res.error + ")");
    } else {
      setProfileMessage("Profile successfully saved and synchronized!");
    }
    setTimeout(() => setProfileMessage(""), 4000);
  };

  // Upload Asset (Image or PDF)
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    destination: "project" | "resume" | "profile"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (destination === "profile") {
      setProfileImageUploading(true);
    }

    if (!supabase) {
      if ((destination === "project" || destination === "profile") && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const base64Url = event.target?.result as string;
          if (base64Url) {
            if (destination === "profile") {
              const updatedProfile = {
                ...profileForm,
                profile_image: base64Url,
                profileImage: base64Url,
              };
              setProfileForm(updatedProfile);
              await saveLiveProfile(updatedProfile);
              setUploadStatus("Profile image updated locally!");
              setProfileImageUploading(false);
            } else {
              setProjectForm((prev) => ({ ...prev, image_url: base64Url }));
              setUploadStatus("Project image updated locally!");
            }
            setTimeout(() => setUploadStatus(""), 5000);
          }
        };
        reader.readAsDataURL(file);
        return;
      }
      if (destination === "profile") setProfileImageUploading(false);
      setUploadStatus("Please connect Supabase in .env to upload files directly to cloud storage.");
      setTimeout(() => setUploadStatus(""), 5000);
      return;
    }

    setUploadStatus(
      destination === "profile"
        ? "Uploading profile photo to Supabase Storage..."
        : destination === "resume"
        ? "Uploading resume to Supabase Storage..."
        : "Uploading project image to Supabase Storage..."
    );
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${destination === "resume" ? "resumes" : destination === "profile" ? "profile" : "projects"}/${fileName}`;

    if (destination === "resume") {
      try {
        const { data: existingFiles } = await supabase.storage
          .from("portfolio-assets")
          .list("resumes");

        if (existingFiles && existingFiles.length > 0) {
          const filesToRemove = existingFiles.map((f) => `resumes/${f.name}`);
          await supabase.storage.from("portfolio-assets").remove(filesToRemove);
        }
      } catch (cleanupErr) {
        console.warn("Storage cleanup note:", cleanupErr);
      }
    } else if (destination === "profile") {
      try {
        const { data: existingFiles } = await supabase.storage
          .from("portfolio-assets")
          .list("profile");

        if (existingFiles && existingFiles.length > 0) {
          const filesToRemove = existingFiles.map((f) => `profile/${f.name}`);
          await supabase.storage.from("portfolio-assets").remove(filesToRemove);
        }
      } catch (cleanupErr) {
        console.warn("Storage profile cleanup note:", cleanupErr);
      }
    }

    const { error: uploadError } = await supabase.storage
      .from("portfolio-assets")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      const isRls =
        uploadError.message.toLowerCase().includes("row-level security") ||
        uploadError.message.toLowerCase().includes("violates") ||
        uploadError.message.toLowerCase().includes("policy");

      if (isRls) {
        setStorageRlsError(uploadError.message);
      }

      if ((destination === "project" || destination === "profile") && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const base64Url = event.target?.result as string;
          if (base64Url) {
            if (destination === "project") {
              setProjectForm((prev) => ({ ...prev, image_url: base64Url }));
            } else {
              const updatedProfile = {
                ...profileForm,
                profile_image: base64Url,
                profileImage: base64Url,
              };
              setProfileForm(updatedProfile);
              await saveLiveProfile(updatedProfile);
            }
          }
        };
        reader.readAsDataURL(file);

        if (isRls) {
          setUploadStatus(
            "Supabase Storage blocked by RLS. Applied as instant local image preview! Run the Storage SQL fix below to enable cloud storage."
          );
        } else {
          setUploadStatus(`Upload failed (${uploadError.message}). Loaded as instant local image preview!`);
        }
      } else {
        setUploadStatus(
          `Upload failed: ${uploadError.message}. Make sure 'portfolio-assets' bucket and RLS policies are created.`
        );
      }
      if (destination === "profile") setProfileImageUploading(false);
      setTimeout(() => setUploadStatus(""), 8000);
      return;
    }

    // Success
    setStorageRlsError(null);
    const { data: publicData } = supabase.storage
      .from("portfolio-assets")
      .getPublicUrl(filePath);

    if (destination === "project") {
      setProjectForm((prev) => ({ ...prev, image_url: publicData.publicUrl }));
      setUploadStatus("Image uploaded successfully to Supabase Storage!");
    } else if (destination === "profile") {
      const newImageUrl = publicData.publicUrl;
      const updatedProfile = {
        ...profileForm,
        profile_image: newImageUrl,
        profileImage: newImageUrl,
      };
      setProfileForm(updatedProfile);
      setUploadStatus("Profile image uploaded and activated in Supabase!");
      await saveLiveProfile(updatedProfile);
      setProfileImageUploading(false);
    } else {
      const newResumeUrl = publicData.publicUrl;
      const updatedProfile = {
        ...profileForm,
        resume_url: newResumeUrl,
        resumeUrl: newResumeUrl,
      };
      setProfileForm(updatedProfile);
      setUploadStatus(
        `CV uploaded & activated! Old CV removed from cloud storage, and new CV is now live across the website.`
      );
      await saveLiveResumeUrl(newResumeUrl);
      await saveLiveProfile(updatedProfile);
    }
    setTimeout(() => setUploadStatus(""), 6000);
  };

  // Delete message
  const handleDeleteMessage = async (id: string, msgObj?: any) => {
    if (!window.confirm("Delete this message?")) return;
    setMessagesList((prev) => prev.filter((m) => m.id !== id));
    if (selectedMessage?.id === id) {
      setSelectedMessage(null);
    }
    await deleteLiveMessage(id, msgObj || selectedMessage);
    await fetchMessages();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#030014] text-white">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If Not Authenticated -> Show Full-Page Login Screen
  if (!session) {
    return (
      <AdminLogin
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        authError={authError}
        authLoading={authLoading}
        isSupabaseConfigured={isSupabaseConfigured}
        onLogin={handleLogin}
        onBypass={() => setSession({ user: { email: "admin@maharab.dev" } })}
      />
    );
  }

  return (
    <div className="min-h-screen md:h-screen md:overflow-hidden bg-[#090d16] text-slate-100 flex flex-col antialiased selection:bg-indigo-500/30 selection:text-white">
      {/* Top Header */}
      <AdminHeader
        activeTab={activeTab}
        tabTitle={getTabInfo(activeTab).title}
        isSupabaseConfigured={isSupabaseConfigured}
        userEmail={session.user?.email || "admin@maharab.dev"}
        isMobileNavOpen={isMobileNavOpen}
        setIsMobileNavOpen={setIsMobileNavOpen}
        projectViewMode={projectViewMode}
        editingProjectId={editingProjectId}
        messagesList={messagesList}
        unreadMessagesCount={unreadMessagesCount}
        newReviews={newReviews}
        newReviewsCount={newReviewsCount}
        onSelectMessage={handleSelectMessage}
        onMarkAllMessagesRead={handleMarkAllRead}
        onMarkReviewsSeen={handleMarkReviewsSeen}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      {/* Main Studio Body: Sidebar + Dynamic Tab View */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        <AdminSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          counts={{
            analyticsTotal: analyticsSummary?.totalVisits,
            projects: projectsList.length,
            skills: skillsList.length,
            process: processConfig.steps.length,
            education: educationList.length + certsList.length,
            messages: messagesList.length,
            reviews: reviewsList.length,
          }}
          profileImage={profileForm.profile_image || PORTFOLIO_INFO.profileImage}
          profileName={profileForm.name || PORTFOLIO_INFO.name}
          onLogout={handleLogout}
          isMobileNavOpen={isMobileNavOpen}
          setIsMobileNavOpen={setIsMobileNavOpen}
        />

        <main className="flex-1 min-w-0 md:h-full md:overflow-y-auto p-4 sm:p-6 lg:p-8 min-h-0 pb-16">
          {/* Storage RLS Banner */}
          <StorageRlsBanner
            storageRlsError={storageRlsError}
            setStorageRlsError={setStorageRlsError}
          />

          {activeTab === "overview" && (
            <OverviewTab
              session={session}
              profileForm={profileForm}
              skillsList={skillsList}
              messagesList={messagesList}
              projectsList={projectsList}
              analyticsSummary={analyticsSummary}
              isSupabaseConfigured={isSupabaseConfigured}
              setActiveTab={setActiveTab}
              handleOpenCreateProject={handleOpenCreateProject}
              setSelectedMessage={setSelectedMessage}
              handleSyncAllProjectsToSupabase={handleSyncAllProjectsToSupabase}
            />
          )}

          {activeTab === "analytics" && (
            <AnalyticsTab
              analyticsFilter={analyticsFilter}
              setAnalyticsFilter={setAnalyticsFilter}
              loadAnalyticsData={loadAnalyticsData}
              analyticsLoading={analyticsLoading}
              handleResetAnalytics={handleResetAnalytics}
              analyticsToast={analyticsToast}
              setAnalyticsToast={setAnalyticsToast}
              analyticsSummary={analyticsSummary}
            />
          )}

          {activeTab === "projects" && (
            <ProjectsTab
              projectsList={projectsList}
              setProjectsList={setProjectsList}
              projectViewMode={projectViewMode}
              setProjectViewMode={setProjectViewMode}
              editingProjectId={editingProjectId}
              setEditingProjectId={setEditingProjectId}
              projectForm={projectForm}
              setProjectForm={setProjectForm}
              handleFileUpload={handleFileUpload}
              uploadStatus={uploadStatus}
              storageRlsError={storageRlsError}
              setStorageRlsError={setStorageRlsError}
              sitemapGenerating={sitemapGenerating}
              handleGenerateSitemap={handleGenerateSitemap}
              sitemapCopied={sitemapCopied}
              fetchProjects={fetchProjects}
            />
          )}

          {activeTab === "skills" && (
            <SkillsTab
              skillsList={skillsList}
              setSkillsList={setSkillsList}
              skillCategoriesList={skillCategoriesList}
              setSkillCategoriesList={setSkillCategoriesList}
            />
          )}

          {activeTab === "process" && <ProcessTab />}

          {activeTab === "profile" && (
            <ProfileTab
              profileForm={profileForm}
              setProfileForm={setProfileForm}
              handleFileUpload={handleFileUpload}
              profileImageUploading={profileImageUploading}
              profileSaving={profileSaving}
              profileMessage={profileMessage}
              uploadStatus={uploadStatus}
              storageRlsError={storageRlsError}
              setStorageRlsError={setStorageRlsError}
              handleSaveProfile={handleSaveProfile}
            />
          )}

          {activeTab === "education" && (
            <EducationTab
              educationList={educationList}
              setEducationList={setEducationList}
              certsList={certsList}
              setCertsList={setCertsList}
            />
          )}

          {activeTab === "resume" && (
            <ResumeTab
              uploadStatus={uploadStatus}
              renderStorageRlsBanner={() => (
                <StorageRlsBanner
                  storageRlsError={storageRlsError}
                  setStorageRlsError={setStorageRlsError}
                />
              )}
              profileForm={profileForm}
              setProfileForm={setProfileForm}
              saveLiveProfile={saveLiveProfile}
              handleFileUpload={(e) => handleFileUpload(e, "resume")}
            />
          )}

          {activeTab === "messages" && (
            <MessagesTab
              messagesList={messagesList}
              unreadMessagesCount={unreadMessagesCount}
              selectedMessage={selectedMessage}
              handleSelectMessage={handleSelectMessage}
              handleMarkAllRead={handleMarkAllRead}
              fetchMessages={fetchMessages}
              handleDeleteMessage={handleDeleteMessage}
            />
          )}

          {activeTab === "reviews" && (
            <ReviewsTab
              reviewsList={reviewsList}
              fetchReviews={fetchReviews}
              reviewsLoading={reviewsLoading}
              testimonialsConfig={testimonialsConfig}
              testimonialsToggling={testimonialsToggling}
              handleToggleTestimonials={handleToggleTestimonials}
              handleMoveReview={handleMoveReview}
              handleMoveReviewToTop={handleMoveReviewToTop}
              handleDeleteReview={handleDeleteReview}
              reviewReordering={reviewReordering}
              projectsList={projectsList}
            />
          )}

          {activeTab === "setup" && <SetupTab />}
        </main>
      </div>

      {/* Dynamic Sitemap XML Modal */}
      <AdminSitemapModal
        isOpen={showSitemapModal}
        onClose={() => setShowSitemapModal(false)}
        sitemapXmlPreview={sitemapXmlPreview}
        sitemapCopied={sitemapCopied}
        onCopy={() => handleGenerateSitemap("copy")}
        onDownload={() => handleGenerateSitemap("download")}
      />
    </div>
  );
};

export default Admin;
