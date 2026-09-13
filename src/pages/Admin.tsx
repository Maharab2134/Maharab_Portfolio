import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaLock,
  FaSignOutAlt,
  FaPlus,
  FaTrash,
  FaEdit,
  FaFolder,
  FaUser,
  FaEnvelope,
  FaFilePdf,
  FaDatabase,
  FaArrowLeft,
  FaCheckCircle,
  FaExternalLinkAlt,
  FaSave,
  FaGraduationCap,
  FaCertificate,
  FaChartBar,
  FaSearch,
  FaGlobe,
  FaGithub,
  FaTimes,
  FaCheck,
  FaReply,
  FaCopy,
  FaMobileAlt,
  FaBrain,
  FaMicrochip,
  FaStar,
  FaCode,
  FaTags,
  FaMagic,
  FaLightbulb,
  FaSpinner,
  FaLayerGroup,
  FaListUl,
  FaExclamationTriangle,
  FaShieldAlt,
  FaCamera,
  FaUpload,
  FaUndo,
  FaVideo,
  FaPlay,
  FaEye,
  FaEyeSlash,
  FaBars,
  FaChartLine,
  FaSyncAlt,
  FaUsers,
  FaClock,
  FaPercentage,
  FaMapMarkerAlt,
  FaCrosshairs,
} from "react-icons/fa";
import { TypeAnimation } from "react-type-animation";
import {
  getLiveAnalytics,
  resetAnalyticsToSeed,
  AnalyticsSummary,
  TimeRangeFilter,
} from "../lib/analyticsService";
import { VisitorTrendChart } from "../components/analytics/VisitorTrendChart";
import { NewVsReturningChart } from "../components/analytics/NewVsReturningChart";
import { TopLocationsChart } from "../components/analytics/TopLocationsChart";
import { DeviceBreakdownChart } from "../components/analytics/DeviceBreakdownChart";
import { PageVisitsChart } from "../components/analytics/PageVisitsChart";
import { VisitorTable } from "../components/analytics/VisitorTable";
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
import { PROJECTS, toProxyImageUrl } from "../data/projectsData";
import {
  getLiveProjects,
  saveLiveProject,
  deleteLiveProject,
  getLiveProfile,
  saveLiveProfile,
  saveLiveResumeUrl,
  getLiveEducation,
  saveLiveEducation,
  getLiveCertificates,
  saveLiveCertificates,
  getVideoEmbedUrl,
  getLiveSkills,
  saveLiveSkills,
  getLiveSkillCategories,
  saveLiveSkillCategories,
  resolveSkillIcon,
  resolveCategoryIcon,
  AVAILABLE_SKILL_ICONS,
} from "../lib/portfolioService";

const renderIcon = (Icon: any, props: any = {}) => {
  const Comp: any = Icon || FaCode;
  return <Comp {...props} />;
};

interface ProjectCategoryDef {
  id: string;
  name: string;
  desc: string;
  icon: any;
  badge: string;
  borderActive: string;
}

const PROJECT_CATEGORIES: ProjectCategoryDef[] = [
  {
    id: "web",
    name: "Web Application",
    desc: "Full-Stack, SaaS & modern web portals",
    icon: FaGlobe,
    badge: "border-cyan-500/40 bg-cyan-500/10 text-cyan-300",
    borderActive: "border-cyan-400 ring-2 ring-cyan-500/30 bg-cyan-500/10",
  },
  {
    id: "mobile",
    name: "Mobile Application",
    desc: "Cross-platform iOS & Android mobile apps",
    icon: FaMobileAlt,
    badge: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
    borderActive: "border-emerald-400 ring-2 ring-emerald-500/30 bg-emerald-500/10",
  },
  {
    id: "ml",
    name: "AI & Machine Learning",
    desc: "Deep learning, neural models & computer vision",
    icon: FaBrain,
    badge: "border-purple-500/40 bg-purple-500/10 text-purple-300",
    borderActive: "border-purple-400 ring-2 ring-purple-500/30 bg-purple-500/10",
  },
  {
    id: "iot",
    name: "IoT & Hardware",
    desc: "Microcontrollers, robotics & telemetry",
    icon: FaMicrochip,
    badge: "border-amber-500/40 bg-amber-500/10 text-amber-300",
    borderActive: "border-amber-400 ring-2 ring-amber-500/30 bg-amber-500/10",
  },
];

interface TechSuggestion {
  name: string;
  category: "frontend" | "backend" | "db_cloud" | "ai_ml" | "mobile" | "iot";
  popular?: boolean;
}

const TECH_SUGGESTIONS: TechSuggestion[] = [
  // Frontend
  { name: "React", category: "frontend", popular: true },
  { name: "Next.js", category: "frontend", popular: true },
  { name: "TypeScript", category: "frontend", popular: true },
  { name: "JavaScript", category: "frontend", popular: true },
  { name: "Tailwind CSS", category: "frontend", popular: true },
  { name: "HTML5", category: "frontend" },
  { name: "CSS3", category: "frontend" },
  { name: "Vue.js", category: "frontend" },
  { name: "Angular", category: "frontend" },
  { name: "Redux", category: "frontend" },
  { name: "Framer Motion", category: "frontend", popular: true },
  { name: "Three.js", category: "frontend" },
  { name: "Vite", category: "frontend" },
  { name: "Bootstrap", category: "frontend" },
  { name: "Sass", category: "frontend" },

  // Backend
  { name: "Node.js", category: "backend", popular: true },
  { name: "Express.js", category: "backend", popular: true },
  { name: "NestJS", category: "backend" },
  { name: "Python", category: "backend", popular: true },
  { name: "Django", category: "backend" },
  { name: "FastAPI", category: "backend", popular: true },
  { name: "Go", category: "backend" },
  { name: "Rust", category: "backend" },
  { name: "Java", category: "backend" },
  { name: "Spring Boot", category: "backend" },
  { name: "GraphQL", category: "backend" },
  { name: "REST API", category: "backend", popular: true },
  { name: "Socket.io", category: "backend" },

  // DB & Cloud
  { name: "PostgreSQL", category: "db_cloud", popular: true },
  { name: "MongoDB", category: "db_cloud", popular: true },
  { name: "Supabase", category: "db_cloud", popular: true },
  { name: "Firebase", category: "db_cloud", popular: true },
  { name: "MySQL", category: "db_cloud" },
  { name: "Redis", category: "db_cloud", popular: true },
  { name: "Prisma", category: "db_cloud", popular: true },
  { name: "Docker", category: "db_cloud", popular: true },
  { name: "Kubernetes", category: "db_cloud" },
  { name: "AWS", category: "db_cloud" },
  { name: "Vercel", category: "db_cloud" },
  { name: "Netlify", category: "db_cloud" },

  // AI & ML
  { name: "TensorFlow", category: "ai_ml", popular: true },
  { name: "PyTorch", category: "ai_ml", popular: true },
  { name: "OpenCV", category: "ai_ml", popular: true },
  { name: "Scikit-learn", category: "ai_ml" },
  { name: "LangChain", category: "ai_ml", popular: true },
  { name: "OpenAI API", category: "ai_ml", popular: true },
  { name: "HuggingFace", category: "ai_ml" },
  { name: "YOLO", category: "ai_ml", popular: true },
  { name: "Pandas", category: "ai_ml" },
  { name: "NumPy", category: "ai_ml" },
  { name: "Keras", category: "ai_ml" },

  // Mobile
  { name: "Flutter", category: "mobile", popular: true },
  { name: "React Native", category: "mobile", popular: true },
  { name: "Dart", category: "mobile", popular: true },
  { name: "Swift", category: "mobile" },
  { name: "Kotlin", category: "mobile" },
  { name: "Android Studio", category: "mobile" },
  { name: "Expo", category: "mobile" },

  // IoT & Hardware
  { name: "Arduino", category: "iot", popular: true },
  { name: "ESP32", category: "iot", popular: true },
  { name: "Raspberry Pi", category: "iot", popular: true },
  { name: "C++", category: "iot", popular: true },
  { name: "Embedded C", category: "iot" },
  { name: "MQTT", category: "iot", popular: true },
  { name: "Sensors", category: "iot" },
  { name: "PlatformIO", category: "iot" },
  { name: "MicroPython", category: "iot" },
];

const STACK_PRESETS = [
  {
    name: "MERN Stack",
    desc: "MongoDB + Express + React + Node",
    icon: FaLayerGroup,
    techs: ["MongoDB", "Express.js", "React", "Node.js", "Tailwind CSS"],
    badgeColor: "from-emerald-500/20 to-cyan-500/20 border-emerald-500/30 text-emerald-300",
  },
  {
    name: "Next.js + Supabase",
    desc: "Modern Fullstack TypeScript",
    icon: FaMagic,
    techs: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase", "Prisma"],
    badgeColor: "from-purple-500/20 to-cyan-500/20 border-purple-500/30 text-purple-300",
  },
  {
    name: "Python AI & ML",
    desc: "Deep Learning & Vision Stack",
    icon: FaBrain,
    techs: ["Python", "PyTorch", "OpenCV", "TensorFlow", "FastAPI"],
    badgeColor: "from-pink-500/20 to-purple-500/20 border-pink-500/30 text-pink-300",
  },
  {
    name: "Mobile Cross-Platform",
    desc: "Flutter & Cloud Backend",
    icon: FaMobileAlt,
    techs: ["Flutter", "Dart", "Firebase", "REST API"],
    badgeColor: "from-cyan-500/20 to-blue-500/20 border-cyan-500/30 text-cyan-300",
  },
  {
    name: "IoT & Smart Robotics",
    desc: "Microcontrollers & Telemetry",
    icon: FaMicrochip,
    techs: ["ESP32", "Arduino", "C++", "MQTT", "Node.js"],
    badgeColor: "from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-300",
  },
];

const PRESET_COVERS = [
  {
    name: "Modern Web SaaS",
    url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
  },
  {
    name: "AI & Neural Tech",
    url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
  },
  {
    name: "Mobile App UI",
    url: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80",
  },
  {
    name: "IoT & Electronics",
    url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
  },
  {
    name: "Code & Terminal",
    url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
  },
];

type AdminNavTab =
  | "overview"
  | "analytics"
  | "projects"
  | "skills"
  | "profile"
  | "education"
  | "resume"
  | "messages"
  | "setup";

type ProjectViewMode = "list" | "editor";

const Admin: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<AdminNavTab>("overview");
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Projects in-page state (NO DIALOGS)
  const [projectsList, setProjectsList] = useState<any[]>([]);
  const [projectViewMode, setProjectViewMode] = useState<ProjectViewMode>("list");
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectSearch, setProjectSearch] = useState("");
  const [projectCategoryFilter, setProjectCategoryFilter] = useState("all");

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

  // Technology Suggestion & Studio Preview state
  const [techCategoryFilter, setTechCategoryFilter] = useState<string>("all");
  const [techSearchQuery, setTechSearchQuery] = useState("");
  const [customTechInput, setCustomTechInput] = useState("");
  const [studioPreviewTab, setStudioPreviewTab] = useState<"card" | "casestudy">("card");
  const [projectSaving, setProjectSaving] = useState(false);
  const [projectToast, setProjectToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: PORTFOLIO_INFO.name,
    short_name: PORTFOLIO_INFO.shortName,
    title: PORTFOLIO_INFO.title,
    tagline: PORTFOLIO_INFO.tagline,
    bio: PORTFOLIO_INFO.bio,
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
    years_experience: PORTFOLIO_INFO.stats.yearsExperience,
    projects_completed: PORTFOLIO_INFO.stats.projectsCompleted,
    satisfaction_rate: PORTFOLIO_INFO.stats.satisfactionRate,
    github: PORTFOLIO_INFO.socials.github,
    linkedin: PORTFOLIO_INFO.socials.linkedin,
    twitter: PORTFOLIO_INFO.socials.twitter,
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [profileImageUploading, setProfileImageUploading] = useState(false);
  const [adminVideoPreviewOpen, setAdminVideoPreviewOpen] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);

  // Education & Certificates State
  const [educationList, setEducationList] = useState<any[]>(EDUCATION_DATA);
  const [certsList, setCertsList] = useState<any[]>(CERTIFICATES_DATA);
  const [eduSaving, setEduSaving] = useState(false);
  const [eduToast, setEduToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Education Edit/Add Form State
  const [editingEduIndex, setEditingEduIndex] = useState<number | null>(null);
  const [isAddingEdu, setIsAddingEdu] = useState(false);
  const [eduForm, setEduForm] = useState({
    degree: "",
    institution: "",
    period: "",
    description: "",
    highlights: "",
  });

  // Certificate Edit/Add Form State
  const [editingCertIndex, setEditingCertIndex] = useState<number | null>(null);
  const [isAddingCert, setIsAddingCert] = useState(false);
  const [certForm, setCertForm] = useState({
    title: "",
    issuer: "",
    year: "",
    type: "Professional",
    link: "",
    details: "",
    verificationId: "",
  });

  // Skills & Categories State
  const [skillCategoriesList, setSkillCategoriesList] = useState<SkillCategory[]>(DEFAULT_SKILL_CATEGORIES);
  const [skillsList, setSkillsList] = useState<SkillItemData[]>(DEFAULT_SKILLS_DATA);
  const [skillSearch, setSkillSearch] = useState("");
  const [skillCategoryFilter, setSkillCategoryFilter] = useState("all");
  const [skillSaving, setSkillSaving] = useState(false);
  const [skillToast, setSkillToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Skill Form State
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [skillForm, setSkillForm] = useState<{
    name: string;
    category: string;
    level: string;
    color: string;
    iconName: string;
  }>({
    name: "",
    category: "frontend",
    level: "Core Production",
    color: "#61DAFB",
    iconName: "FaReact",
  });

  // Category Form State
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [categoryForm, setCategoryForm] = useState<{
    id: string;
    label: string;
    iconName: string;
  }>({
    id: "",
    label: "",
    iconName: "FaCode",
  });

  // Messages State
  const [messagesList, setMessagesList] = useState<any[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);

  // Storage / Upload status
  const [uploadStatus, setUploadStatus] = useState("");
  const [storageRlsError, setStorageRlsError] = useState<string | null>(null);
  const [storageRlsCopied, setStorageRlsCopied] = useState(false);
  const [databaseFixCopied, setDatabaseFixCopied] = useState(false);
  const [resumeCopied, setResumeCopied] = useState(false);
  const [resumeManualSaving, setResumeManualSaving] = useState(false);
  const [resumeSavedToast, setResumeSavedToast] = useState(false);

  // Visitor Analytics State
  const [analyticsFilter, setAnalyticsFilter] = useState<TimeRangeFilter>("30d");
  const [analyticsSummary, setAnalyticsSummary] = useState<AnalyticsSummary | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsToast, setAnalyticsToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showAnalyticsToast = (message: string, type: "success" | "error" = "success") => {
    setAnalyticsToast({ message, type });
    setTimeout(() => setAnalyticsToast(null), 3000);
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

  const handleResetAnalytics = async () => {
    if (window.confirm("Reset analytics dataset with a realistic 30-day traffic seed?")) {
      await resetAnalyticsToSeed();
      await loadAnalyticsData(analyticsFilter);
      showAnalyticsToast("Analytics reset to realistic 30-day baseline successfully!");
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

  // Fetch Messages from Supabase
  const fetchMessages = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) return;
    const { data } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) {
      setMessagesList(data);
      if (data.length > 0 && !selectedMessage) {
        setSelectedMessage(data[0]);
      }
    }
  }, [selectedMessage]);

  // Fetch Profile Live Data
  const fetchProfileData = useCallback(async () => {
    const liveProfile = await getLiveProfile();
    if (liveProfile) {
      setProfileForm({
        name: liveProfile.name || PORTFOLIO_INFO.name,
        short_name: liveProfile.shortName || PORTFOLIO_INFO.shortName,
        title: liveProfile.title || PORTFOLIO_INFO.title,
        tagline: liveProfile.tagline || PORTFOLIO_INFO.tagline,
        bio: liveProfile.bio || PORTFOLIO_INFO.bio,
        phone: liveProfile.phone || PORTFOLIO_INFO.phone,
        email: liveProfile.email || PORTFOLIO_INFO.email,
        location: liveProfile.location || PORTFOLIO_INFO.location,
        maps_url: (liveProfile as any).maps_url || (liveProfile as any).mapsUrl || (PORTFOLIO_INFO as any).mapsUrl || "",
        resume_url: liveProfile.resumeUrl || PORTFOLIO_INFO.resumeUrl,
        profile_image: (liveProfile as any).profile_image || liveProfile.profileImage || PORTFOLIO_INFO.profileImage,
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
        years_experience: liveProfile.stats?.yearsExperience || PORTFOLIO_INFO.stats.yearsExperience,
        projects_completed: liveProfile.stats?.projectsCompleted || PORTFOLIO_INFO.stats.projectsCompleted,
        satisfaction_rate: liveProfile.stats?.satisfactionRate || PORTFOLIO_INFO.stats.satisfactionRate,
        github: liveProfile.socials?.github || PORTFOLIO_INFO.socials.github,
        linkedin: liveProfile.socials?.linkedin || PORTFOLIO_INFO.socials.linkedin,
        twitter: liveProfile.socials?.twitter || PORTFOLIO_INFO.socials.twitter,
      });
    }
  }, []);

  // Fetch Education & Certificates Live Data
  const fetchEducationAndCerts = useCallback(async () => {
    const liveEdu = await getLiveEducation();
    if (liveEdu && liveEdu.length > 0) setEducationList(liveEdu);
    const liveCerts = await getLiveCertificates();
    if (liveCerts && liveCerts.length > 0) setCertsList(liveCerts);
  }, []);

  // Fetch Skills & Categories Live Data
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

  // Handle Login
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

  // Handle Logout
  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut();
    setSession(null);
  };

  // Helper Functions for Technology Tags & Presets
  const getSelectedTechs = (techStr: string): string[] => {
    if (!techStr) return [];
    return techStr
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  };

  const toggleTechTag = (techName: string) => {
    const current = getSelectedTechs(projectForm.technologies);
    const exists = current.some((t) => t.toLowerCase() === techName.toLowerCase());
    let next: string[];
    if (exists) {
      next = current.filter((t) => t.toLowerCase() !== techName.toLowerCase());
    } else {
      next = [...current, techName];
    }
    setProjectForm((prev) => ({ ...prev, technologies: next.join(", ") }));
  };

  const removeTechTag = (tagToRemove: string) => {
    const current = getSelectedTechs(projectForm.technologies);
    const next = current.filter((t) => t.toLowerCase() !== tagToRemove.toLowerCase());
    setProjectForm((prev) => ({ ...prev, technologies: next.join(", ") }));
  };

  const addCustomTechTag = (tag: string) => {
    const trimmed = tag.trim().replace(/^,+|,+$/g, "");
    if (!trimmed) return;
    const current = getSelectedTechs(projectForm.technologies);
    if (!current.some((t) => t.toLowerCase() === trimmed.toLowerCase())) {
      setProjectForm((prev) => ({
        ...prev,
        technologies: [...current, trimmed].join(", "),
      }));
    }
  };

  const handleCustomTechKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (customTechInput.trim()) {
        addCustomTechTag(customTechInput);
        setCustomTechInput("");
      }
    }
  };

  const applyStackPreset = (presetTechs: string[]) => {
    const current = getSelectedTechs(projectForm.technologies);
    const combined = [...current];
    presetTechs.forEach((t) => {
      if (!combined.some((c) => c.toLowerCase() === t.toLowerCase())) {
        combined.push(t);
      }
    });
    setProjectForm((prev) => ({ ...prev, technologies: combined.join(", ") }));
  };

  // In-Page Project Editor Actions
  const handleOpenCreateProject = () => {
    setEditingProjectId(null);
    setTechCategoryFilter("all");
    setTechSearchQuery("");
    setCustomTechInput("");
    setStudioPreviewTab("card");
    setProjectToast(null);
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

  const handleOpenEditProject = (project: any) => {
    const projId = project.project_id || project.id;
    setEditingProjectId(projId);
    setTechCategoryFilter("all");
    setTechSearchQuery("");
    setCustomTechInput("");
    setStudioPreviewTab("card");
    setProjectToast(null);

    let initialCat = "web";
    const rawCat = (project.category || "").toLowerCase();
    if (rawCat.includes("mobile")) initialCat = "mobile";
    else if (rawCat.includes("ai") || rawCat.includes("ml")) initialCat = "ml";
    else if (rawCat.includes("iot") || rawCat.includes("hardware")) initialCat = "iot";
    else initialCat = "web";

    setProjectForm({
      title: project.title || "",
      category: initialCat,
      short_desc: project.short_desc || project.shortDescription || project.description || "",
      full_desc: project.full_desc || project.fullDescription || project.description || "",
      image_url: project.image_url || project.image || "",
      technologies: Array.isArray(project.technologies)
        ? project.technologies.join(", ")
        : (typeof project.technologies === "string" ? project.technologies : ""),
      features: Array.isArray(project.features)
        ? project.features.join("\n")
        : (typeof project.features === "string" ? project.features : ""),
      github_url: project.github_url || project.github || "",
      live_url: project.live_url || project.link || project.live || "",
      featured: Boolean(project.featured),
    });
    setProjectViewMode("editor");
  };

  const handleSaveProject = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!projectForm.title.trim()) {
      alert("Please provide a project title.");
      return;
    }

    setProjectSaving(true);
    const targetId =
      editingProjectId ||
      projectForm.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const payload = {
      project_id: targetId,
      id: targetId,
      title: projectForm.title,
      category: projectForm.category,
      short_desc: projectForm.short_desc,
      full_desc: projectForm.full_desc,
      image_url: projectForm.image_url || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
      technologies: projectForm.technologies,
      features: projectForm.features,
      github_url: projectForm.github_url,
      live_url: projectForm.live_url,
      featured: projectForm.featured,
    };

    // Optimistically update projectsList immediately in UI
    setProjectsList((prev) => {
      const idx = prev.findIndex((p) => (p.project_id || p.id) === targetId);
      const updatedItem = {
        ...payload,
        technologies: payload.technologies.split(",").map((t: string) => t.trim()).filter(Boolean),
        features: payload.features.split("\n").map((f: string) => f.trim()).filter(Boolean),
      };
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], ...updatedItem };
        return copy;
      }
      return [updatedItem, ...prev];
    });

    try {
      const res = await saveLiveProject(payload);

      if (res.savedLocallyOnly) {
        setProjectToast({
          message: "Project saved in local cache! (Supabase returned RLS restriction: " + res.error + ")",
          type: "success",
        });
      } else {
        setProjectToast({
          message: "Project successfully updated and saved in live Supabase database!",
          type: "success",
        });
      }

      await fetchProjects();
      setTimeout(() => {
        setProjectToast(null);
        setProjectViewMode("list");
      }, 700);
    } catch (err: any) {
      alert("Failed to save project: " + err.message);
    } finally {
      setProjectSaving(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    setProjectsList((prev) => prev.filter((p) => (p.project_id || p.id) !== id));
    await deleteLiveProject(id);
    await fetchProjects();
  };

  const handleToggleFeatured = async (project: any) => {
    const updated = !project.featured;
    await saveLiveProject({ ...project, featured: updated });
    await fetchProjects();
  };

  // 1-Click Sync all initial projects to Supabase
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

    // If uploading a new resume or profile photo, delete previous files in that folder
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

      // If it's an image for a project or profile, load it as local base64 preview so user's work isn't blocked!
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
          setUploadStatus(
            `Upload failed (${uploadError.message}). Loaded as instant local image preview!`
          );
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
      setUploadStatus(`CV uploaded & activated! Old CV removed from cloud storage, and new CV is now live across the website.`);
      await saveLiveResumeUrl(newResumeUrl);
      await saveLiveProfile(updatedProfile);
    }
    setTimeout(() => setUploadStatus(""), 6000);
  };

  const STORAGE_RLS_FIX_SQL = `-- 1. Create 'portfolio-assets' bucket if not already created
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-assets', 'portfolio-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Allow public (anon) full access to upload, update, view, and delete in portfolio-assets
CREATE POLICY "Allow public all on portfolio-assets"
ON storage.objects
FOR ALL
TO public
USING (bucket_id = 'portfolio-assets')
WITH CHECK (bucket_id = 'portfolio-assets');`;

  const copyStorageRlsSql = () => {
    navigator.clipboard.writeText(STORAGE_RLS_FIX_SQL);
    setStorageRlsCopied(true);
    setTimeout(() => setStorageRlsCopied(false), 2500);
  };

  const renderStorageRlsBanner = () => {
    if (!storageRlsError) return null;
    return (
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5 rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-amber-500/10 backdrop-blur-md shadow-2xl space-y-3 relative text-xs mb-6"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 text-amber-300 font-bold text-sm">
            {renderIcon(FaShieldAlt, { size: 18, className: "text-amber-400 shrink-0" })}
            <span>Supabase Storage: Row-Level Security (RLS) Policy Required</span>
          </div>
          <button
            type="button"
            onClick={() => setStorageRlsError(null)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-all cursor-pointer"
            title="Dismiss notification"
          >
            {renderIcon(FaTimes, { size: 14 })}
          </button>
        </div>

        <p className="text-slate-300 leading-relaxed">
          Supabase Storage prevents anonymous client uploads by default with:{" "}
          <code className="text-rose-300 bg-rose-950/60 px-1.5 py-0.5 rounded font-mono text-[11px]">
            new row violates row-level security policy
          </code>
          . You just need to run this 2-step SQL command in your Supabase dashboard to enable uploads to the <strong className="text-white font-mono">portfolio-assets</strong> bucket.
        </p>

        <div className="p-3 rounded-xl bg-slate-950/90 border border-white/10 font-mono text-[11px] text-cyan-300 overflow-x-auto">
          <pre>{STORAGE_RLS_FIX_SQL}</pre>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            type="button"
            onClick={copyStorageRlsSql}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer"
          >
            {renderIcon(storageRlsCopied ? FaCheck : FaCopy, { size: 13 })}
            <span>{storageRlsCopied ? "SQL Copied to Clipboard!" : "Copy Storage RLS Fix SQL"}</span>
          </button>
          <span className="text-[11px] text-slate-400">
            Open <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-purple-400 underline font-semibold">Supabase Dashboard</a> ➔ <strong>SQL Editor</strong>, paste this command and click <strong>Run</strong>.
          </span>
        </div>
      </motion.div>
    );
  };

  // Save Profile Info
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

  // Auto-detect GPS Current Location
  const handleDetectLocation = async () => {
    if (!navigator.geolocation) {
      setLocationStatus("Geolocation is not supported by your browser.");
      setTimeout(() => setLocationStatus(null), 4000);
      return;
    }

    setDetectingLocation(true);
    setLocationStatus("Getting GPS coordinates...");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocationStatus("Resolving address details...");

        let resolvedLocation = "";
        const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

        try {
          // OpenStreetMap Nominatim reverse geocode
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 6000);
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=14&addressdetails=1`,
            {
              headers: { "Accept-Language": "en" },
              signal: controller.signal,
            }
          );
          clearTimeout(timeoutId);

          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            const neighborhood =
              addr.suburb ||
              addr.neighbourhood ||
              addr.residential ||
              addr.subdistrict ||
              addr.quarter;
            const city =
              addr.city ||
              addr.town ||
              addr.municipality ||
              addr.county ||
              addr.state_district;
            const country = addr.country;

            const parts = [neighborhood, city, country].filter(Boolean);
            if (parts.length >= 2) {
              resolvedLocation = parts.join(", ");
            } else if (data.display_name) {
              resolvedLocation = data.display_name
                .split(",")
                .slice(0, 3)
                .map((s: string) => s.trim())
                .join(", ");
            }
          }
        } catch (e) {
          console.warn("Reverse geocoding error, applying fallback", e);
        }

        // Fallback if reverse geocode didn't return a name
        if (!resolvedLocation) {
          try {
            const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
            if (tz && tz.includes("/")) {
              const [region, city] = tz.split("/");
              resolvedLocation = `${city.replace(/_/g, " ")}, ${region.replace(/_/g, " ")}`;
            } else {
              resolvedLocation = `${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°`;
            }
          } catch (e) {
            resolvedLocation = `${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°`;
          }
        }

        setProfileForm((prev) => ({
          ...prev,
          location: resolvedLocation,
          maps_url: mapsLink,
        }));

        setDetectingLocation(false);
        setLocationStatus(`Current location detected: ${resolvedLocation}`);
        setTimeout(() => setLocationStatus(null), 4500);
      },
      (err) => {
        setDetectingLocation(false);
        let msg = "Could not get current location.";
        if (err.code === 1) {
          msg = "Location permission denied in browser.";
        } else if (err.code === 2) {
          msg = "GPS position unavailable.";
        } else if (err.code === 3) {
          msg = "Location request timed out.";
        }
        setLocationStatus(msg);
        setTimeout(() => setLocationStatus(null), 4500);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  };

  // Delete message
  const handleDeleteMessage = async (id: string) => {
    if (!window.confirm("Delete this message?")) return;
    if (supabase) {
      await supabase.from("contact_messages").delete().eq("id", id);
      fetchMessages();
    } else {
      setMessagesList((prev) => prev.filter((m) => m.id !== id));
    }
    setSelectedMessage(null);
  };

  // ==========================================================================
  // Education (Degree Programs) Handlers
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
      highlights: eduForm.highlights
        .split("\n")
        .map((h) => h.trim())
        .filter(Boolean),
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

  // ==========================================================================
  // Certificates & Credentials Handlers
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

  // ==========================================================================
  // Skills & Categories Handlers & Presets
  // ==========================================================================
  const PROFICIENCY_OPTIONS = [
    {
      value: "Core Production",
      label: "Core Production",
      bengaliTag: "বেশি ভালো (Expert)",
      desc: "Primary production stack, architectural mastery, battle-tested in real systems",
      badgeColor: "border-purple-500/40 bg-purple-500/10 text-purple-300",
      borderActive: "border-purple-400 ring-2 ring-purple-500/30 bg-purple-500/10",
    },
    {
      value: "Advanced",
      label: "Advanced",
      bengaliTag: "ভালো (High Proficiency)",
      desc: "Strong daily engineering, clean production code, robust understanding",
      badgeColor: "border-cyan-500/40 bg-cyan-500/10 text-cyan-300",
      borderActive: "border-cyan-400 ring-2 ring-cyan-500/30 bg-cyan-500/10",
    },
    {
      value: "Proficient",
      label: "Proficient",
      bengaliTag: "মিডিয়াম (Working Knowledge)",
      desc: "Comfortable implementation, working integration knowledge, expanding",
      badgeColor: "border-amber-500/40 bg-amber-500/10 text-amber-300",
      borderActive: "border-amber-400 ring-2 ring-amber-500/30 bg-amber-500/10",
    },
  ];

  const TECH_COLOR_PRESETS = [
    { name: "React Cyan", hex: "#61DAFB" },
    { name: "TypeScript Blue", hex: "#3178C6" },
    { name: "Tailwind Cyan", hex: "#06B6D4" },
    { name: "Purple Accent", hex: "#a855f7" },
    { name: "Pink Accent", hex: "#ec4899" },
    { name: "Node Green", hex: "#339933" },
    { name: "MongoDB Green", hex: "#47A248" },
    { name: "JavaScript Yellow", hex: "#F7DF1E" },
    { name: "Python Blue", hex: "#3776AB" },
    { name: "Git Orange-Red", hex: "#F05032" },
    { name: "Linux Amber", hex: "#FCC624" },
    { name: "TensorFlow Orange", hex: "#FF6F00" },
    { name: "Flutter Blue", hex: "#02569B" },
    { name: "Pure White", hex: "#ffffff" },
  ];

  const handleOpenAddCategory = () => {
    setEditingCategoryId(null);
    setIsAddingCategory(true);
    setCategoryForm({
      id: "",
      label: "",
      iconName: "FaCode",
    });
  };

  const handleOpenEditCategory = (cat: SkillCategory) => {
    setIsAddingCategory(false);
    setEditingCategoryId(cat.id);
    setCategoryForm({
      id: cat.id,
      label: cat.label,
      iconName: cat.iconName || "FaCode",
    });
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.label.trim()) {
      alert("Please provide a Category Name / Label.");
      return;
    }

    const slug =
      categoryForm.id.trim() ||
      categoryForm.label
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    const newCat: SkillCategory = {
      id: slug,
      label: categoryForm.label.trim(),
      iconName: categoryForm.iconName || "FaCode",
    };

    let updatedList: SkillCategory[];
    if (editingCategoryId) {
      updatedList = skillCategoriesList.map((c) =>
        c.id === editingCategoryId ? { ...newCat, id: editingCategoryId } : c
      );
    } else {
      if (skillCategoriesList.some((c) => c.id === slug)) {
        alert("A category with this ID already exists. Please use a unique label.");
        return;
      }
      updatedList = [...skillCategoriesList, newCat];
    }

    setSkillCategoriesList(updatedList);
    setIsAddingCategory(false);
    setEditingCategoryId(null);
    setSkillSaving(true);

    try {
      const res = await saveLiveSkillCategories(updatedList);
      setSkillToast({
        message: res.error
          ? `Category saved locally! (Cloud note: ${res.error})`
          : "Category successfully saved and synced live!",
        type: "success",
      });
      setTimeout(() => setSkillToast(null), 4000);
    } catch (err: any) {
      setSkillToast({
        message: "Failed to sync category with cloud database.",
        type: "error",
      });
      setTimeout(() => setSkillToast(null), 4000);
    } finally {
      setSkillSaving(false);
    }
  };

  const handleDeleteCategory = async (catId: string) => {
    const skillsInCategory = skillsList.filter((s) => s.category === catId);
    const confirmMsg =
      skillsInCategory.length > 0
        ? `This category contains ${skillsInCategory.length} skills. Deleting it will reassign those skills to the first available category. Proceed?`
        : "Are you sure you want to delete this category?";

    if (!window.confirm(confirmMsg)) return;

    const updatedCats = skillCategoriesList.filter((c) => c.id !== catId);
    if (updatedCats.length === 0) {
      alert("You must keep at least one category.");
      return;
    }

    setSkillCategoriesList(updatedCats);

    if (skillsInCategory.length > 0) {
      const remappedSkills = skillsList.map((s) =>
        s.category === catId ? { ...s, category: updatedCats[0].id } : s
      );
      setSkillsList(remappedSkills);
      await saveLiveSkills(remappedSkills);
    }

    setSkillSaving(true);
    try {
      await saveLiveSkillCategories(updatedCats);
      setSkillToast({
        message: "Category removed successfully!",
        type: "success",
      });
      setTimeout(() => setSkillToast(null), 4000);
    } catch (e) {
      setSkillToast({
        message: "Failed to remove category from database.",
        type: "error",
      });
      setTimeout(() => setSkillToast(null), 4000);
    } finally {
      setSkillSaving(false);
    }
  };

  const handleOpenAddSkill = () => {
    setEditingSkillId(null);
    setIsAddingSkill(true);
    setSkillForm({
      name: "",
      category: skillCategoriesList[0]?.id || "frontend",
      level: "Core Production",
      color: "#61DAFB",
      iconName: "FaReact",
    });
  };

  const handleOpenEditSkill = (skill: SkillItemData) => {
    setIsAddingSkill(false);
    setEditingSkillId(skill.id);
    setSkillForm({
      name: skill.name || "",
      category: skill.category || "frontend",
      level: skill.level || "Core Production",
      color: skill.color || "#a855f7",
      iconName: skill.iconName || "",
    });
  };

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillForm.name.trim()) {
      alert("Please provide a Technology / Skill name.");
      return;
    }

    const newSkill: SkillItemData = {
      id:
        editingSkillId ||
        `skill-${skillForm.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")}-${Date.now()}`,
      name: skillForm.name.trim(),
      category: skillForm.category || "frontend",
      level: skillForm.level.trim() || "Core Production",
      color: skillForm.color || "#a855f7",
      iconName: skillForm.iconName || "",
    };

    let updatedList: SkillItemData[];
    if (editingSkillId) {
      updatedList = skillsList.map((s) => (s.id === editingSkillId ? newSkill : s));
    } else {
      updatedList = [newSkill, ...skillsList];
    }

    setSkillsList(updatedList);
    setIsAddingSkill(false);
    setEditingSkillId(null);
    setSkillSaving(true);

    try {
      const res = await saveLiveSkills(updatedList);
      setSkillToast({
        message: res.error
          ? `Skill saved locally! (Cloud notice: ${res.error})`
          : "Skill saved and synced to website live!",
        type: "success",
      });
      setTimeout(() => setSkillToast(null), 4000);
    } catch (err: any) {
      setSkillToast({
        message: "Failed to sync skills with cloud database.",
        type: "error",
      });
      setTimeout(() => setSkillToast(null), 4000);
    } finally {
      setSkillSaving(false);
    }
  };

  const handleDeleteSkill = async (skillId: string) => {
    if (!window.confirm("Are you sure you want to delete this technology from your stack?")) return;

    const updatedList = skillsList.filter((s) => s.id !== skillId);
    setSkillsList(updatedList);
    setSkillSaving(true);

    try {
      await saveLiveSkills(updatedList);
      setSkillToast({
        message: "Technology removed from stack.",
        type: "success",
      });
      setTimeout(() => setSkillToast(null), 4000);
    } catch (e) {
      setSkillToast({
        message: "Failed to remove skill from database.",
        type: "error",
      });
      setTimeout(() => setSkillToast(null), 4000);
    } finally {
      setSkillSaving(false);
    }
  };

  const handleResetSkillsDefaults = async () => {
    if (
      !window.confirm(
        "Are you sure you want to reset all skills and categories back to default 29 technologies and 6 standard categories?"
      )
    )
      return;

    setSkillCategoriesList(DEFAULT_SKILL_CATEGORIES);
    setSkillsList(DEFAULT_SKILLS_DATA);
    setSkillSaving(true);

    try {
      await saveLiveSkillCategories(DEFAULT_SKILL_CATEGORIES);
      await saveLiveSkills(DEFAULT_SKILLS_DATA);
      setSkillToast({
        message: "Stack reset to default 29 technologies & 6 categories!",
        type: "success",
      });
      setTimeout(() => setSkillToast(null), 4000);
    } catch (e) {
      setSkillToast({
        message: "Failed to reset stack in cloud.",
        type: "error",
      });
      setTimeout(() => setSkillToast(null), 4000);
    } finally {
      setSkillSaving(false);
    }
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
      <div className="relative min-h-screen px-4 bg-[#090d16] text-slate-200 flex items-center justify-center overflow-hidden">
        {/* Subtle Ambient Radial Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md p-7 sm:p-8 rounded-3xl bg-[#111726]/85 border border-white/[0.08] backdrop-blur-2xl shadow-2xl relative z-10"
        >
          <div className="text-center mb-7">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 mb-4 shadow-lg shadow-indigo-500/20 text-white">
              {renderIcon(FaLock, { size: 20 })}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Maharab Admin Console</h1>
            <p className="mt-1 text-xs text-slate-400">
              Sign in with your verified Supabase administrator credentials
            </p>
          </div>

          {/* Supabase Connection Status */}
          <div className="mb-5 p-3 rounded-xl border text-xs flex items-center justify-between bg-white/[0.02] border-white/[0.08]">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isSupabaseConfigured ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
              <span className={`font-medium ${isSupabaseConfigured ? "text-emerald-400" : "text-amber-300"}`}>
                {isSupabaseConfigured ? "Supabase Live Connected" : "Local Development Mode"}
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">v1.0.0</span>
          </div>

          {authError && (
            <div className="p-3 mb-5 text-xs text-rose-300 border rounded-xl bg-rose-500/10 border-rose-500/20">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 text-[11px] uppercase tracking-wider mb-1.5">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@maharab.dev"
                className="w-full px-4 py-2.5 text-sm text-white bg-[#0c101d] border border-white/10 rounded-xl focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30 transition-all font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 text-[11px] uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-2.5 text-sm text-white bg-[#0c101d] border border-white/10 rounded-xl focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30 transition-all font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3 mt-2 text-xs sm:text-sm font-semibold text-white transition-all rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:opacity-95 shadow-lg shadow-indigo-500/20 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              {authLoading ? "Authenticating..." : "Sign In to Admin Console"}
            </button>

            <button
              type="button"
              onClick={() => setSession({ user: { email: "admin@maharab.dev" } })}
              className="w-full py-2.5 text-xs font-semibold text-slate-300 hover:text-white transition-all rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] cursor-pointer"
            >
              ⚡ Instant Developer Access (Bypass Login)
            </button>
          </form>

          <div className="mt-7 pt-4 border-t border-white/[0.08] text-center">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = "";
                window.location.reload();
              }}
              className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors"
            >
              {renderIcon(FaArrowLeft, { size: 10 })}
              <span>Return to Portfolio Home</span>
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  // Filtered projects for list view
  const filteredProjects = projectsList.filter((p) => {
    const matchesCategory =
      projectCategoryFilter === "all" ||
      (p.category || "").toLowerCase() === projectCategoryFilter.toLowerCase();
    const matchesSearch =
      (p.title || "").toLowerCase().includes(projectSearch.toLowerCase()) ||
      (p.short_desc || "").toLowerCase().includes(projectSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Filtered skills for admin catalog view
  const filteredAdminSkills = skillsList.filter((skill) => {
    const matchesCategory =
      skillCategoryFilter === "all" || skill.category === skillCategoryFilter;
    const matchesSearch =
      !skillSearch.trim() ||
      skill.name.toLowerCase().includes(skillSearch.toLowerCase()) ||
      (skill.level || "").toLowerCase().includes(skillSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getTabInfo = (tab: AdminNavTab) => {
    switch (tab) {
      case "overview":
        return { title: "Dashboard Overview", section: "WORKSPACE" };
      case "analytics":
        return { title: "Visitor Intelligence & Traffic Analytics", section: "WORKSPACE" };
      case "projects":
        return { title: "Project Catalog & Studio", section: "CONTENT" };
      case "skills":
        return { title: "Skills & Technology Stack", section: "CONTENT" };
      case "profile":
        return { title: "Profile & Biography", section: "CONTENT" };
      case "education":
        return { title: "Education & Credentials", section: "CONTENT" };
      case "resume":
        return { title: "Resume & Cloud Storage", section: "ASSETS" };
      case "messages":
        return { title: "Contact Inquiries", section: "INBOX" };
      case "setup":
        return { title: "Supabase & Database SQL", section: "SYSTEM" };
      default:
        return { title: "Console", section: "WORKSPACE" };
    }
  };

  const navCategories = [
    {
      title: "WORKSPACE",
      items: [
        {
          id: "overview" as AdminNavTab,
          label: "Dashboard Overview",
          icon: FaChartBar,
          activeColor: "text-indigo-400",
        },
        {
          id: "analytics" as AdminNavTab,
          label: "Visitor Analytics",
          icon: FaChartLine,
          badge: analyticsSummary?.totalVisits || undefined,
          badgeColor: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
          activeColor: "text-cyan-400",
        },
      ],
    },
    {
      title: "CONTENT STUDIO",
      items: [
        {
          id: "projects" as AdminNavTab,
          label: "Project Catalog",
          icon: FaFolder,
          badge: projectsList.length,
          badgeColor: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
          activeColor: "text-indigo-400",
        },
        {
          id: "skills" as AdminNavTab,
          label: "Skills & Stack",
          icon: FaCode,
          badge: skillsList.length,
          badgeColor: "bg-purple-500/10 text-purple-300 border-purple-500/20",
          activeColor: "text-purple-400",
        },
        {
          id: "profile" as AdminNavTab,
          label: "Profile & Bio Settings",
          icon: FaUser,
          activeColor: "text-cyan-400",
        },
        {
          id: "education" as AdminNavTab,
          label: "Education & Credentials",
          icon: FaGraduationCap,
          badge: educationList.length + certsList.length,
          badgeColor: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
          activeColor: "text-cyan-400",
        },
      ],
    },
    {
      title: "ASSETS & COMMS",
      items: [
        {
          id: "resume" as AdminNavTab,
          label: "Resume & Cloud Storage",
          icon: FaFilePdf,
          activeColor: "text-pink-400",
        },
        {
          id: "messages" as AdminNavTab,
          label: "Contact Inquiries",
          icon: FaEnvelope,
          badge: messagesList.length > 0 ? messagesList.length : undefined,
          badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
          activeColor: "text-emerald-400",
        },
      ],
    },
    {
      title: "INFRASTRUCTURE",
      items: [
        {
          id: "setup" as AdminNavTab,
          label: "Supabase & Live SQL",
          icon: FaDatabase,
          activeColor: "text-amber-400",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col antialiased selection:bg-indigo-500/30 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b bg-[#090d16]/90 backdrop-blur-xl border-white/[0.08] px-4 sm:px-8 py-3 flex items-center justify-between transition-all">
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Mobile hamburger menu toggle */}
          <button
            type="button"
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white bg-white/[0.04] border border-white/[0.08] transition-colors cursor-pointer"
            title="Toggle Menu"
          >
            {renderIcon(isMobileNavOpen ? FaTimes : FaBars, { size: 14 })}
          </button>

          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 font-bold text-xs text-white shadow-md shadow-indigo-500/20 shrink-0">
            MH
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 font-mono hidden sm:inline-block">
                Console /
              </span>
              <h1 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                {getTabInfo(activeTab).title}
              </h1>
              {activeTab === "projects" && projectViewMode === "editor" && (
                <span className="px-2 py-0.5 text-[9px] font-mono font-bold rounded-md bg-indigo-500/15 border border-indigo-500/30 text-indigo-300">
                  {editingProjectId ? "EDIT" : "NEW"}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-mono rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{isSupabaseConfigured ? "Supabase Live" : "Local Reactivity"}</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono hidden md:inline-block">
                {session.user?.email || "admin@maharab.dev"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              window.location.hash = "";
              window.location.reload();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white border border-white/[0.08] hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.06] rounded-xl transition-all cursor-pointer"
          >
            {renderIcon(FaExternalLinkAlt, { size: 10, className: "text-slate-400" })}
            <span className="hidden sm:inline">View Live Site</span>
            <span className="sm:hidden">Site</span>
          </a>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-400 hover:text-rose-300 border border-rose-500/20 hover:border-rose-500/40 bg-rose-500/5 hover:bg-rose-500/10 rounded-xl transition-all cursor-pointer"
          >
            {renderIcon(FaSignOutAlt, { size: 11 })}
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Layout: Sidebar + In-Page Content */}
      <div className="flex-1 flex flex-col md:flex-row w-full px-4 sm:px-6 lg:px-8 py-6 gap-6 lg:gap-8 max-w-[1700px] mx-auto">
        
        {/* Left Navigation Sidebar (Desktop) */}
        <aside className="hidden md:flex w-64 lg:w-72 flex-shrink-0 flex-col justify-between self-start sticky top-20 rounded-2xl bg-[#111726]/75 border border-white/[0.08] p-3.5 shadow-xl backdrop-blur-xl space-y-6">
          <div className="space-y-5">
            {navCategories.map((group) => (
              <div key={group.title} className="space-y-1">
                <div className="px-3 py-1">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 font-mono">
                    {group.title}
                  </span>
                </div>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setActiveTab(item.id);
                          setProjectViewMode("list");
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group relative cursor-pointer ${
                          isActive
                            ? "bg-indigo-500/10 text-white border border-indigo-500/25 shadow-sm font-semibold"
                            : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent"
                        }`}
                      >
                        {isActive && (
                          <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r bg-gradient-to-b from-indigo-500 to-cyan-400" />
                        )}
                        <span className="flex items-center gap-2.5">
                          {renderIcon(item.icon, {
                            size: 14,
                            className: isActive ? item.activeColor : "text-slate-500 group-hover:text-slate-300 transition-colors",
                          })}
                          <span>{item.label}</span>
                        </span>
                        {item.badge !== undefined && (
                          <span
                            className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-full border ${
                              item.badgeColor || "bg-white/10 text-slate-300 border-white/10"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* User Profile Mini Footer */}
          <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between gap-3 p-2 rounded-xl bg-white/[0.02]">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/10 shrink-0 bg-slate-900">
                <img
                  src={toProxyImageUrl(profileForm.profile_image || PORTFOLIO_INFO.profileImage)}
                  alt="Admin"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/img.jpg";
                  }}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate leading-tight">
                  {profileForm.short_name || profileForm.name}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] text-emerald-400 font-mono">Super Admin</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
              title="Sign Out"
            >
              {renderIcon(FaSignOutAlt, { size: 12 })}
            </button>
          </div>
        </aside>

        {/* Mobile Navigation Drawer Dropdown */}
        <AnimatePresence>
          {isMobileNavOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden w-full overflow-hidden rounded-2xl bg-[#111726] border border-white/[0.08] p-4 mb-4 shadow-2xl space-y-4"
            >
              {navCategories.map((group) => (
                <div key={group.title} className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 font-mono">
                    {group.title}
                  </span>
                  <div className="grid grid-cols-1 gap-1 pt-1">
                    {group.items.map((item) => {
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setActiveTab(item.id);
                            setProjectViewMode("list");
                            setIsMobileNavOpen(false);
                          }}
                          className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                            isActive
                              ? "bg-indigo-500/15 text-white border border-indigo-500/30 font-semibold"
                              : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                          }`}
                        >
                          <span className="flex items-center gap-2.5">
                            {renderIcon(item.icon, {
                              size: 14,
                              className: isActive ? item.activeColor : "text-slate-500",
                            })}
                            <span>{item.label}</span>
                          </span>
                          {item.badge !== undefined && (
                            <span className="px-2 py-0.5 text-[10px] font-mono rounded-full bg-white/10 text-slate-300">
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right Main Page Content Area (Full in-page views, no dialog boxes) */}
        <main className="flex-1 min-w-0">
          
          {/* ============================================================== */}
          {/* VIEW 1: OVERVIEW DASHBOARD */}
          {/* ============================================================== */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Executive Welcome Hero Banner */}
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#111726] via-[#141c30] to-[#0c1220] border border-white/[0.08] relative overflow-hidden shadow-xl">
                {/* Subtle Ambient Radial Glow */}
                <div className="absolute -top-10 -right-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="space-y-3 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-mono font-medium flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Supabase Live Synchronized</span>
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-400 text-[11px] font-mono">
                        Session: {session.user?.email || "admin@maharab.dev"}
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                      Welcome back, {profileForm.short_name || PORTFOLIO_INFO.shortName}!
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
                      Your full-stack portfolio database is connected and reactive. You can update project case studies, customize your hero biography, publish new resume PDFs, and review incoming recruiter submissions in real time.
                    </p>

                    {/* Instant Action Chips */}
                    <div className="flex flex-wrap items-center gap-2.5 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab("projects");
                          handleOpenCreateProject();
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:opacity-95 shadow-md shadow-indigo-500/20 active:scale-95 transition-all cursor-pointer"
                      >
                        {renderIcon(FaPlus, { size: 10 })}
                        <span>New Project</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab("profile")}
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-all cursor-pointer"
                      >
                        {renderIcon(FaUser, { size: 11, className: "text-cyan-400" })}
                        <span>Edit Bio &amp; Photo</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab("skills")}
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-all cursor-pointer"
                      >
                        {renderIcon(FaCode, { size: 11, className: "text-purple-400" })}
                        <span>Manage Skills ({skillsList.length})</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab("messages")}
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-all cursor-pointer"
                      >
                        {renderIcon(FaEnvelope, { size: 11, className: "text-emerald-400" })}
                        <span>View Inquiries ({messagesList.length})</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab("analytics")}
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-cyan-300 hover:text-white bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition-all cursor-pointer"
                      >
                        {renderIcon(FaChartLine, { size: 11, className: "text-cyan-400" })}
                        <span>Visitor Analytics ({analyticsSummary?.totalVisits || 0})</span>
                      </button>
                    </div>
                  </div>

                  {/* Right Avatar Card */}
                  <div className="shrink-0 flex items-center gap-4 p-3.5 rounded-2xl bg-black/25 border border-white/[0.08] backdrop-blur-md self-start lg:self-auto">
                    <div className="w-16 h-16 rounded-2xl p-0.5 bg-gradient-to-br from-indigo-500 to-cyan-400 overflow-hidden shrink-0 shadow-lg shadow-indigo-500/20">
                      <img
                        src={toProxyImageUrl(profileForm.profile_image || PORTFOLIO_INFO.profileImage)}
                        alt={profileForm.name}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/images/img.jpg";
                        }}
                        className="w-full h-full object-cover rounded-[14px]"
                      />
                    </div>
                    <div className="pr-1 space-y-1">
                      <p className="text-xs font-bold text-white leading-tight">
                        {profileForm.name}
                      </p>
                      <p className="text-[11px] text-cyan-400 truncate max-w-[150px]">
                        {profileForm.title}
                      </p>
                      <button
                        type="button"
                        onClick={() => setActiveTab("profile")}
                        className="inline-flex items-center gap-1 text-[11px] text-indigo-300 hover:text-indigo-200 font-semibold cursor-pointer transition-colors"
                      >
                        <span>Change Avatar</span>
                        {renderIcon(FaEdit, { size: 9 })}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4 Metric KPI Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#111726]/60 hover:border-white/[0.15] transition-all shadow-sm group">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">Total Projects</span>
                    <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:scale-105 transition-transform">
                      {renderIcon(FaFolder, { size: 14 })}
                    </div>
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-2">{projectsList.length}</p>
                  <p className="text-[11px] text-indigo-400 font-mono mt-1 flex items-center gap-1">
                    <span>Live in catalog</span>
                  </p>
                </div>

                <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#111726]/60 hover:border-white/[0.15] transition-all shadow-sm group">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">Contact Inquiries</span>
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-105 transition-transform">
                      {renderIcon(FaEnvelope, { size: 14 })}
                    </div>
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-2">{messagesList.length}</p>
                  <p className="text-[11px] text-emerald-400 font-mono mt-1 flex items-center gap-1">
                    <span>Direct form submissions</span>
                  </p>
                </div>

                <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#111726]/60 hover:border-white/[0.15] transition-all shadow-sm group">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">Experience</span>
                    <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:scale-105 transition-transform">
                      {renderIcon(FaChartBar, { size: 14 })}
                    </div>
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-2">{profileForm.years_experience}</p>
                  <p className="text-[11px] text-cyan-400 font-mono mt-1 flex items-center gap-1">
                    <span>{profileForm.satisfaction_rate} Satisfaction</span>
                  </p>
                </div>

                <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#111726]/60 hover:border-white/[0.15] transition-all shadow-sm group">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">Work Status</span>
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-105 transition-transform">
                      {renderIcon(FaCheckCircle, { size: 14 })}
                    </div>
                  </div>
                  <p className="text-sm sm:text-base font-bold text-emerald-400 mt-3 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Available for Hire</span>
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono mt-1">
                    Homepage badge active
                  </p>
                </div>
              </div>

              {/* Lower 2-Column Section: Recent Messages & Cloud Infrastructure Status */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Recent Inquiries (7 cols) */}
                <div className="lg:col-span-7 p-6 rounded-2xl border border-white/[0.08] bg-[#111726]/60 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                        {renderIcon(FaEnvelope, { size: 14 })}
                      </div>
                      <h3 className="text-sm font-bold text-white">Recent Contact Submissions</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab("messages")}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
                    >
                      View All ({messagesList.length}) ➔
                    </button>
                  </div>

                  {messagesList.length === 0 ? (
                    <div className="p-8 text-center rounded-xl bg-white/[0.02] border border-white/[0.05] text-slate-400 text-xs">
                      No incoming messages recorded yet. Client submissions from the website contact section will appear here.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {messagesList.slice(0, 3).map((msg) => (
                        <div
                          key={msg.id}
                          onClick={() => {
                            setSelectedMessage(msg);
                            setActiveTab("messages");
                          }}
                          className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/15 transition-all cursor-pointer flex items-start justify-between gap-3"
                        >
                          <div className="min-w-0 space-y-0.5">
                            <div className="flex items-center gap-2">
                              <p className="text-xs font-bold text-white truncate">{msg.name}</p>
                              <span className="text-[10px] text-slate-500 font-mono truncate">{msg.email}</span>
                            </div>
                            <p className="text-xs text-slate-300 font-medium truncate">{msg.subject || "(No Subject)"}</p>
                            <p className="text-[11px] text-slate-400 line-clamp-1">{msg.message}</p>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono shrink-0">
                            {new Date(msg.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Cloud Infrastructure & Quick Sync (5 cols) */}
                <div className="lg:col-span-5 p-6 rounded-2xl border border-white/[0.08] bg-[#111726]/60 space-y-4 shadow-sm">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.08]">
                    <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                      {renderIcon(FaDatabase, { size: 14 })}
                    </div>
                    <h3 className="text-sm font-bold text-white">Cloud Infrastructure Status</h3>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                      <span className="text-slate-400">Supabase DB</span>
                      <span className="text-emerald-400 font-mono font-medium flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        {isSupabaseConfigured ? "Connected" : "Pending Keys"}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                      <span className="text-slate-400">Storage Bucket</span>
                      <span className="text-cyan-400 font-mono font-medium">portfolio-assets</span>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                      <span className="text-slate-400">Active Profile Sync</span>
                      <span className="text-indigo-300 font-mono font-medium">2-Way Reactive</span>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={handleSyncAllProjectsToSupabase}
                      className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-200 hover:text-white bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      {renderIcon(FaDatabase, { size: 11, className: "text-amber-400" })}
                      <span>Sync Project Catalog to Supabase</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("setup")}
                      className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors cursor-pointer text-center"
                    >
                      Inspect SQL Schema &amp; Storage Policies ➔
                    </button>
                  </div>
                </div>
              </div>

              {/* Overview Visitor Traffic Pulse Snapshot Card */}
              <div className="p-6 rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-[#111726] via-[#10182b] to-[#0c1220] shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.3)] shrink-0">
                    {renderIcon(FaChartLine, { className: "h-6 w-6" })}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white tracking-wide">
                        Visitor Traffic &amp; Audience Telemetry
                      </h3>
                      <span className="flex items-center gap-1 rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-cyan-400 border border-cyan-500/20">
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        Live
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {analyticsSummary?.totalVisits ?? 0} total hits recorded across {analyticsSummary?.uniqueVisitors ?? 0} verified unique visitors
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="hidden sm:flex items-center gap-4 text-xs font-mono pr-2 border-r border-white/10">
                    <div>
                      <span className="text-slate-400 text-[10px] block">Top Country</span>
                      <span className="text-white font-bold">
                        {analyticsSummary?.topLocations[0]?.country || "Global"}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Loyalty Rate</span>
                      <span className="text-purple-400 font-bold">
                        {analyticsSummary
                          ? `${Math.round(
                              (analyticsSummary.returningVisitors / (analyticsSummary.totalVisits || 1)) * 100
                            )}%`
                          : "0%"}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab("analytics")}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-black bg-gradient-to-r from-cyan-400 to-blue-500 hover:opacity-95 shadow-md shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer"
                  >
                    <span>Open Analytics Studio</span>
                    <span>➔</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* VIEW: VISITOR ANALYTICS & TRAFFIC INTELLIGENCE */}
          {/* ============================================================== */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              {/* Header Banner & Date Filter Toolbar */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#111726] via-[#141c30] to-[#0c1220] border border-cyan-500/20 shadow-2xl relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 space-y-2 max-w-xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-medium flex items-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.25)]">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      <span>Live Traffic Telemetry</span>
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[11px] font-mono flex items-center gap-1">
                      {renderIcon(FaShieldAlt, { className: "h-2.5 w-2.5" })}
                      100% Client-Side Anonymized
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    Visitor Analytics &amp; Audience Matrix
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
                    Interactive graph-based dashboard monitoring who is discovering your portfolio, geographic spread, hardware profiles, popular sections, and inbound referrals.
                  </p>
                </div>

                {/* Toolbar Controls */}
                <div className="relative z-10 flex flex-wrap items-center gap-3">
                  {/* Time Range Segmented Control */}
                  <div className="flex items-center rounded-xl border border-white/10 bg-[#090d16]/90 p-1 backdrop-blur-md">
                    {(["today", "7d", "30d", "all"] as TimeRangeFilter[]).map((filter) => {
                      const labels: Record<TimeRangeFilter, string> = {
                        today: "Today",
                        "7d": "7 Days",
                        "30d": "30 Days",
                        all: "All Time",
                      };

                      return (
                        <button
                          key={filter}
                          type="button"
                          onClick={() => setAnalyticsFilter(filter)}
                          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                            analyticsFilter === filter
                              ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                              : "text-slate-400 hover:text-white"
                          }`}
                        >
                          {labels[filter]}
                        </button>
                      );
                    })}
                  </div>

                  {/* Refresh Button */}
                  <button
                    type="button"
                    onClick={() => loadAnalyticsData(analyticsFilter)}
                    disabled={analyticsLoading}
                    title="Refresh Live Analytics"
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[#090d16] text-slate-300 transition-all hover:border-cyan-500/40 hover:text-cyan-400 disabled:opacity-50 active:scale-95 cursor-pointer"
                  >
                    {renderIcon(FaSyncAlt, { className: `h-3.5 w-3.5 ${analyticsLoading ? "animate-spin text-cyan-400" : ""}` })}
                  </button>

                  {/* Reset to Seed Button */}
                  <button
                    type="button"
                    onClick={handleResetAnalytics}
                    title="Reset with realistic 30-day baseline data"
                    className="flex items-center gap-1.5 rounded-xl border border-purple-500/30 bg-purple-500/10 px-3 py-2 text-xs font-semibold text-purple-300 transition-all hover:bg-purple-500/20 active:scale-95 cursor-pointer"
                  >
                    {renderIcon(FaMagic, { className: "h-3 w-3" })}
                    <span>Reset Seed Data</span>
                  </button>
                </div>
              </div>

              {/* Toast Notification */}
              {analyticsToast && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`p-3.5 rounded-xl text-xs font-semibold flex items-center justify-between shadow-lg ${
                    analyticsToast.type === "success"
                      ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300"
                      : "bg-red-500/15 border border-red-500/30 text-red-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {renderIcon(FaCheckCircle, { className: "h-4 w-4" })}
                    <span>{analyticsToast.message}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAnalyticsToast(null)}
                    className="text-slate-400 hover:text-white"
                  >
                    {renderIcon(FaTimes, { className: "h-3 w-3" })}
                  </button>
                </motion.div>
              )}

              {/* 4 Top KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Visitors */}
                <div className="p-5 rounded-2xl border border-cyan-500/20 bg-gradient-to-b from-[#111726]/80 to-[#090d16] hover:border-cyan-500/40 transition-all shadow-xl group">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">Total Visits</span>
                    <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
                      {renderIcon(FaChartLine, { className: "h-4 w-4" })}
                    </div>
                  </div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-2 font-mono">
                    {analyticsSummary?.totalVisits ?? 0}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-cyan-400 font-medium mt-2 pt-2 border-t border-white/5">
                    <span>In current window</span>
                    <span className="font-semibold">+18.2% vs avg</span>
                  </div>
                </div>

                {/* Unique Visitors */}
                <div className="p-5 rounded-2xl border border-purple-500/20 bg-gradient-to-b from-[#111726]/80 to-[#090d16] hover:border-purple-500/40 transition-all shadow-xl group">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">Unique Visitors</span>
                    <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform">
                      {renderIcon(FaUsers, { className: "h-4 w-4" })}
                    </div>
                  </div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-2 font-mono">
                    {analyticsSummary?.uniqueVisitors ?? 0}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-purple-400 font-medium mt-2 pt-2 border-t border-white/5">
                    <span>Verified reach</span>
                    <span className="font-semibold">
                      {analyticsSummary && analyticsSummary.totalVisits > 0
                        ? `${Math.round((analyticsSummary.uniqueVisitors / analyticsSummary.totalVisits) * 100)}% unique`
                        : "0%"}
                    </span>
                  </div>
                </div>

                {/* Avg Session Duration */}
                <div className="p-5 rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-[#111726]/80 to-[#090d16] hover:border-emerald-500/40 transition-all shadow-xl group">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">Avg. Session Time</span>
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
                      {renderIcon(FaClock, { className: "h-4 w-4" })}
                    </div>
                  </div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-2 font-mono">
                    {analyticsSummary
                      ? analyticsSummary.avgDurationSeconds < 60
                        ? `${analyticsSummary.avgDurationSeconds}s`
                        : `${Math.floor(analyticsSummary.avgDurationSeconds / 60)}m ${
                            analyticsSummary.avgDurationSeconds % 60
                          }s`
                      : "0s"}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-emerald-400 font-medium mt-2 pt-2 border-t border-white/5">
                    <span>Engaged attention</span>
                    <span className="font-semibold">Healthy</span>
                  </div>
                </div>

                {/* Bounce / Retention Rate */}
                <div className="p-5 rounded-2xl border border-amber-500/20 bg-gradient-to-b from-[#111726]/80 to-[#090d16] hover:border-amber-500/40 transition-all shadow-xl group">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">Bounce Rate</span>
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
                      {renderIcon(FaPercentage, { className: "h-4 w-4" })}
                    </div>
                  </div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-2 font-mono">
                    {analyticsSummary?.bounceRate ?? 25}%
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-amber-400 font-medium mt-2 pt-2 border-t border-white/5">
                    <span>
                      {analyticsSummary && 100 - analyticsSummary.bounceRate}% Multi-section Read
                    </span>
                    <span className="font-semibold">High Interest</span>
                  </div>
                </div>
              </div>

              {/* 1. Main Visitor Trend Chart */}
              {analyticsSummary && (
                <VisitorTrendChart
                  data={analyticsSummary.dailyTrends}
                  title={`Visitor Traffic Dynamics (${
                    analyticsFilter === "today"
                      ? "Today"
                      : analyticsFilter === "7d"
                      ? "Last 7 Days"
                      : analyticsFilter === "30d"
                      ? "Last 30 Days"
                      : "All Time"
                  })`}
                />
              )}

              {/* 2 & 3. Donut & Top Locations Grid */}
              {analyticsSummary && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-5 flex flex-col">
                    <NewVsReturningChart
                      newVisitors={analyticsSummary.newVisitors}
                      returningVisitors={analyticsSummary.returningVisitors}
                    />
                  </div>
                  <div className="lg:col-span-7 flex flex-col">
                    <TopLocationsChart locations={analyticsSummary.topLocations} />
                  </div>
                </div>
              )}

              {/* 4. Hardware & OS Matrix */}
              {analyticsSummary && (
                <DeviceBreakdownChart
                  deviceBreakdown={analyticsSummary.deviceBreakdown}
                  osBreakdown={analyticsSummary.osBreakdown}
                />
              )}

              {/* 5. Most Visited Pages & Referral Sources */}
              {analyticsSummary && (
                <PageVisitsChart
                  topPages={analyticsSummary.topPages}
                  topReferrers={analyticsSummary.topReferrers}
                />
              )}

              {/* 6. Detailed Visitor Activity Table */}
              {analyticsSummary && (
                <VisitorTable events={analyticsSummary.recentEvents} />
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* VIEW 2: PROJECTS MANAGER (FULL IN-PAGE, ZERO POPUP DIALOGS!) */}
          {/* ============================================================== */}
          {activeTab === "projects" && (
            <div>
              {/* MODE A: PROJECT LIST VIEW */}
              {projectViewMode === "list" ? (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Project Catalog</h2>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Manage, publish, and showcase your live portfolio applications and case studies
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={handleSyncAllProjectsToSupabase}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white border border-white/[0.08] hover:border-white/20 bg-white/[0.03] hover:bg-white/[0.06] rounded-xl transition-all cursor-pointer"
                        title="Seed all initial projects into your Supabase database"
                      >
                        {renderIcon(FaDatabase, { size: 11, className: "text-amber-400" })}
                        <span>Sync All to Supabase</span>
                      </button>

                      <button
                        onClick={handleOpenCreateProject}
                        className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:opacity-95 shadow-md shadow-indigo-500/20 active:scale-95 transition-all cursor-pointer"
                      >
                        {renderIcon(FaPlus, { size: 11 })}
                        <span>Add New Project</span>
                      </button>
                    </div>
                  </div>

                  {/* Search and Category Filters Toolbar */}
                  <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
                    <div className="relative w-full sm:w-80">
                      <span className="absolute left-3.5 top-3 text-slate-500">
                        {renderIcon(FaSearch, { size: 12 })}
                      </span>
                      <input
                        type="text"
                        value={projectSearch}
                        onChange={(e) => setProjectSearch(e.target.value)}
                        placeholder="Search projects by title, tech or summary..."
                        className="w-full pl-9 pr-8 py-2 text-xs text-white bg-[#0c101d] border border-white/10 rounded-xl focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30 transition-all placeholder:text-slate-500"
                      />
                      {projectSearch && (
                        <button
                          type="button"
                          onClick={() => setProjectSearch("")}
                          className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
                        >
                          {renderIcon(FaTimes, { size: 12 })}
                        </button>
                      )}
                    </div>

                    {/* Category Filter Pills with Item Counts */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                      {[
                        { id: "all", label: "All", count: projectsList.length },
                        { id: "web", label: "Web", count: projectsList.filter((p) => (p.category || "").toLowerCase() === "web").length },
                        { id: "mobile", label: "Mobile", count: projectsList.filter((p) => (p.category || "").toLowerCase() === "mobile").length },
                        { id: "ml", label: "AI & ML", count: projectsList.filter((p) => (p.category || "").toLowerCase() === "ml").length },
                        { id: "iot", label: "IoT", count: projectsList.filter((p) => (p.category || "").toLowerCase() === "iot").length },
                      ].map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setProjectCategoryFilter(cat.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                            projectCategoryFilter === cat.id
                              ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-semibold shadow-sm"
                              : "text-slate-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06]"
                          }`}
                        >
                          <span>{cat.label}</span>
                          <span className="text-[10px] font-mono opacity-70">({cat.count})</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Empty state when no projects match */}
                  {filteredProjects.length === 0 ? (
                    <div className="p-12 text-center rounded-2xl border border-white/[0.08] bg-[#111726]/60 space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-white/[0.04] text-slate-400 flex items-center justify-center mx-auto">
                        {renderIcon(FaFolder, { size: 20 })}
                      </div>
                      <h3 className="text-sm font-bold text-white">No projects found</h3>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto">
                        {projectSearch || projectCategoryFilter !== "all"
                          ? "No projects matched your search filters. Try adjusting your query or category filter."
                          : "Your catalog currently has no projects. Click 'Add New Project' or 'Sync All to Supabase' to get started."}
                      </p>
                      {(projectSearch || projectCategoryFilter !== "all") && (
                        <button
                          type="button"
                          onClick={() => {
                            setProjectSearch("");
                            setProjectCategoryFilter("all");
                          }}
                          className="px-4 py-2 text-xs font-semibold text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-xl transition-colors cursor-pointer"
                        >
                          Reset Filters
                        </button>
                      )}
                    </div>
                  ) : (
                    /* Projects Table / In-Page Cards (Full Screen Grid) */
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                      {filteredProjects.map((project) => (
                        <div
                          key={project.id || project.project_id}
                          className="p-4 rounded-2xl border border-white/[0.08] bg-[#111726]/70 hover:border-indigo-500/30 flex flex-col justify-between hover:shadow-xl hover:shadow-indigo-500/5 transition-all space-y-4 group"
                        >
                          <div className="space-y-3">
                            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-900 border border-white/10">
                              <img
                                src={project.image_url || project.image}
                                alt={project.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                onError={(e) => {
                                  e.currentTarget.src = "https://placehold.co/600x400/0f172a/cbd5e1?text=Preview";
                                }}
                              />
                              <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                                {project.featured && (
                                  <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-amber-400 text-slate-950 shadow-md">
                                    ★ FEATURED
                                  </span>
                                )}
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-950/80 backdrop-blur-md border border-white/10 text-cyan-300 capitalize">
                                  {project.category}
                                </span>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <h3 className="text-sm font-bold text-white truncate group-hover:text-indigo-300 transition-colors">
                                {project.title}
                              </h3>
                              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                                {project.short_desc || project.shortDescription || project.description}
                              </p>
                            </div>

                            {/* Tech stack tags */}
                            {project.technologies && (
                              <div className="flex flex-wrap gap-1 pt-1">
                                {getSelectedTechs(project.technologies).slice(0, 3).map((tech, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/[0.04] border border-white/[0.06] text-slate-300"
                                  >
                                    {tech}
                                  </span>
                                ))}
                                {getSelectedTechs(project.technologies).length > 3 && (
                                  <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono text-slate-500">
                                    +{getSelectedTechs(project.technologies).length - 3}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                            <button
                              type="button"
                              onClick={() => handleToggleFeatured(project)}
                              className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                                project.featured
                                  ? "border-amber-400/40 text-amber-300 bg-amber-400/10 font-medium"
                                  : "border-white/10 text-slate-400 hover:text-white hover:bg-white/5"
                              }`}
                            >
                              {project.featured ? "★ Featured" : "Set Featured"}
                            </button>

                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenEditProject(project)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 rounded-lg transition-colors cursor-pointer"
                              >
                                {renderIcon(FaEdit, { size: 11 })}
                                <span>Edit</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteProject(project.id || project.project_id)}
                                className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
                                title="Delete Project"
                              >
                                {renderIcon(FaTrash, { size: 11 })}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* MODE B: FULL IN-PAGE PROJECT STUDIO (BEAUTIFIED & WITH TECH SUGGESTIONS) */
                <div className="space-y-6">
                  {/* Editor Header Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.08]">
                    <div className="flex items-center gap-3.5">
                      <button
                        type="button"
                        onClick={() => setProjectViewMode("list")}
                        className="p-2.5 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] text-slate-300 hover:text-white transition-all"
                        title="Back to Projects Catalog"
                      >
                        {renderIcon(FaArrowLeft, { size: 14 })}
                      </button>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-semibold uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">
                            {editingProjectId ? "STUDIO • EDIT MODE" : "STUDIO • NEW DRAFT"}
                          </span>
                          {editingProjectId && (
                            <span className="text-[11px] font-mono text-slate-500">
                              ID: {editingProjectId}
                            </span>
                          )}
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                          {editingProjectId ? (projectForm.title || "Edit Project Details") : "Create New Project"}
                        </h2>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Fine-tune project identity, technologies, narrative, and deliverables with real-time preview.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => setProjectViewMode("list")}
                        className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-xl transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={projectSaving}
                        onClick={() => handleSaveProject()}
                        className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:opacity-95 shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
                      >
                        {projectSaving ? renderIcon(FaSpinner, { className: "animate-spin", size: 13 }) : renderIcon(FaSave, { size: 13 })}
                        <span>{projectSaving ? "Saving to Cloud..." : "Save to Database"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Toast notification banner */}
                  {projectToast && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3.5 rounded-2xl border text-xs flex items-center gap-3 ${
                        projectToast.type === "success"
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                          : "bg-rose-500/10 border-rose-500/30 text-rose-300"
                      }`}
                    >
                      {renderIcon(FaCheckCircle, { size: 16 })}
                      <span className="font-medium">{projectToast.message}</span>
                    </motion.div>
                  )}

                  {uploadStatus && (
                    <div className="p-3.5 text-xs text-cyan-300 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center gap-2.5">
                      {renderIcon(FaSpinner, { className: "animate-spin shrink-0", size: 13 })}
                      <span className="font-medium">{uploadStatus}</span>
                    </div>
                  )}

                  {renderStorageRlsBanner()}

                  {/* 2-Column Studio Grid: Left Form (7 cols), Right Sticky Live Preview (5 cols) */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left: Input Form (7 cols) */}
                    <form onSubmit={handleSaveProject} className="lg:col-span-7 space-y-6 text-xs">
                      
                      {/* CARD 1: Core Identity & Category */}
                      <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#111726]/75 backdrop-blur-sm space-y-5 shadow-xl">
                        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                          <div className="flex items-center gap-2.5">
                            <span className="w-6 h-6 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs font-mono">
                              1
                            </span>
                            <h3 className="text-xs font-bold text-white tracking-wider uppercase font-mono">
                              Project Identity &amp; Category
                            </h3>
                          </div>
                          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Core Metadata</span>
                        </div>

                        {/* Title */}
                        <div>
                          <label className="block font-semibold text-slate-200 mb-1.5 text-xs">
                            Project Title <span className="text-rose-400">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={projectForm.title}
                            onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                            placeholder="e.g. AI Financial Forecaster & Risk Analysis SaaS"
                            className="w-full px-4 py-2.5 text-xs text-white bg-[#0c101d] border border-white/[0.08] rounded-xl focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all font-medium placeholder:text-slate-500"
                          />
                        </div>

                        {/* Visual Category Selector */}
                        <div>
                          <label className="block font-semibold text-slate-200 mb-2 text-xs">
                            Select Category <span className="text-rose-400">*</span>
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {PROJECT_CATEGORIES.map((cat) => {
                              const isSelected = projectForm.category === cat.id;
                              return (
                                <button
                                  key={cat.id}
                                  type="button"
                                  onClick={() => setProjectForm({ ...projectForm, category: cat.id })}
                                  className={`p-3.5 rounded-xl border text-left transition-all relative cursor-pointer ${
                                    isSelected
                                      ? "border-indigo-500/60 bg-indigo-500/10 shadow-sm ring-1 ring-indigo-500/30"
                                      : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.12]"
                                  }`}
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-2.5">
                                      <div className={`p-2 rounded-lg ${cat.badge}`}>
                                        {renderIcon(cat.icon, { size: 14 })}
                                      </div>
                                      <div>
                                        <div className="font-bold text-white text-xs">{cat.name}</div>
                                        <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{cat.desc}</div>
                                      </div>
                                    </div>
                                    {isSelected && (
                                      <span className="p-1 rounded-full bg-cyan-400 text-slate-950">
                                        {renderIcon(FaCheck, { size: 9 })}
                                      </span>
                                    )}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Featured Project Switch */}
                        <div className="p-3.5 rounded-xl border border-white/[0.08] bg-[#0c101d]/60 hover:bg-[#0c101d] transition-colors flex items-center justify-between cursor-pointer" onClick={() => setProjectForm({ ...projectForm, featured: !projectForm.featured })}>
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${projectForm.featured ? "bg-amber-400/20 text-amber-300 border border-amber-400/30" : "bg-white/5 text-slate-400"}`}>
                              {renderIcon(FaStar, { size: 14 })}
                            </div>
                            <div>
                              <div className="font-bold text-white text-xs flex items-center gap-2">
                                <span>Feature on Portfolio Showcase</span>
                                {projectForm.featured && (
                                  <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                                    FEATURED
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                Displays prominently with a highlighted badge on the homepage hero and top of the showcase.
                              </p>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={projectForm.featured}
                            onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                            onClick={(e) => e.stopPropagation()}
                            className="w-4 h-4 rounded text-indigo-600 bg-white/10 border-white/20 focus:ring-0 cursor-pointer"
                          />
                        </div>
                      </div>

                      {/* CARD 2: Technology Stack Studio */}
                      <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#111726]/75 backdrop-blur-sm space-y-5 shadow-xl">
                        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                          <div className="flex items-center gap-2.5">
                            <span className="w-6 h-6 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs font-mono">
                              2
                            </span>
                            <div className="flex items-center gap-2">
                              {renderIcon(FaTags, { className: "text-indigo-400", size: 13 })}
                              <h3 className="text-xs font-bold text-white tracking-wider uppercase font-mono">
                                Technology Stack Studio
                              </h3>
                            </div>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">
                            {getSelectedTechs(projectForm.technologies).length} Selected
                          </span>
                        </div>

                        {/* Active Selected Tech Pills Container */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-200">
                              Active Technologies in this Project:
                            </span>
                            {getSelectedTechs(projectForm.technologies).length > 0 && (
                              <button
                                type="button"
                                onClick={() => setProjectForm({ ...projectForm, technologies: "" })}
                                className="text-[11px] text-rose-400 hover:text-rose-300 transition-colors"
                              >
                                Clear All
                              </button>
                            )}
                          </div>

                          <div className="min-h-[52px] p-3 rounded-xl border border-white/[0.08] bg-[#0c101d] flex flex-wrap items-center gap-2">
                            {getSelectedTechs(projectForm.technologies).length === 0 ? (
                              <p className="text-xs text-slate-500 italic flex items-center gap-2">
                                {renderIcon(FaLightbulb, { size: 12 })}
                                <span>No technologies added yet. Click suggestions below, use 1-click presets, or type your own!</span>
                              </p>
                            ) : (
                              getSelectedTechs(projectForm.technologies).map((tag) => (
                                <span
                                  key={tag}
                                  className="group inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg bg-indigo-500/15 border border-indigo-500/40 text-indigo-200 shadow-sm transition-all"
                                >
                                  <span>{tag}</span>
                                  <button
                                    type="button"
                                    onClick={() => removeTechTag(tag)}
                                    className="p-0.5 rounded hover:bg-rose-500/20 text-indigo-300 hover:text-rose-400 transition-colors"
                                    title={`Remove ${tag}`}
                                  >
                                    {renderIcon(FaTimes, { size: 10 })}
                                  </button>
                                </span>
                              ))
                            )}
                          </div>
                        </div>

                        {/* Custom Technology Input with Enter or Button */}
                        <div className="space-y-1.5">
                          <label className="block font-semibold text-slate-200 text-xs">
                            Add Custom Technology Tag:
                          </label>
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <input
                                type="text"
                                value={customTechInput}
                                onChange={(e) => setCustomTechInput(e.target.value)}
                                onKeyDown={handleCustomTechKeyDown}
                                placeholder="Type any technology and press Enter (e.g. GraphQL, Tailwind, Redis, FastAPI)..."
                                className="w-full pl-9 pr-3.5 py-2 text-xs text-white bg-[#0c101d] border border-white/[0.08] rounded-xl focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all placeholder:text-slate-500"
                              />
                              <span className="absolute left-3 top-2.5 text-slate-500">
                                {renderIcon(FaCode, { size: 12 })}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                if (customTechInput.trim()) {
                                  addCustomTechTag(customTechInput);
                                  setCustomTechInput("");
                                }
                              }}
                              className="px-4 py-2 text-xs font-semibold text-white rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] transition-all active:scale-95"
                            >
                              + Add Tag
                            </button>
                          </div>
                        </div>

                        {/* 1-Click Popular Stack Presets */}
                        <div className="p-3.5 rounded-xl border border-white/[0.06] bg-[#0c101d]/60 space-y-2.5">
                          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300">
                            {renderIcon(FaMagic, { size: 12 })}
                            <span>1-Click Popular Stack Presets (Click to append):</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {STACK_PRESETS.map((preset) => (
                              <button
                                key={preset.name}
                                type="button"
                                onClick={() => applyStackPreset(preset.techs)}
                                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border bg-gradient-to-r ${preset.badgeColor} hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer`}
                                title={`Appends: ${preset.techs.join(", ")}`}
                              >
                                {renderIcon(preset.icon, { size: 11 })}
                                <span>+ {preset.name}</span>
                                <span className="text-[10px] opacity-70">({preset.techs.length})</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Technology Suggestions Matrix */}
                        <div className="space-y-3 pt-2 border-t border-white/[0.06]">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2 font-semibold text-slate-200 text-xs">
                              {renderIcon(FaLightbulb, { className: "text-amber-400", size: 12 })}
                              <span>Curated Technology Suggestions (Click chip to toggle):</span>
                            </div>

                            {/* Search filter for suggestions */}
                            <div className="relative w-full sm:w-48">
                              <input
                                type="text"
                                value={techSearchQuery}
                                onChange={(e) => setTechSearchQuery(e.target.value)}
                                placeholder="Filter suggestions..."
                                className="w-full pl-7 pr-3 py-1 text-[11px] text-white bg-[#0c101d] border border-white/[0.08] rounded-lg focus:outline-none focus:border-indigo-500/60 placeholder:text-slate-500"
                              />
                              <span className="absolute left-2.5 top-1.5 text-slate-500">
                                {renderIcon(FaSearch, { size: 10 })}
                              </span>
                              {techSearchQuery && (
                                <button
                                  type="button"
                                  onClick={() => setTechSearchQuery("")}
                                  className="absolute right-2 top-1.5 text-slate-400 hover:text-white"
                                >
                                  {renderIcon(FaTimes, { size: 10 })}
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Category Filter Pills */}
                          <div className="flex flex-wrap gap-1.5 pb-1">
                            {[
                              { id: "all", label: "All (50+)" },
                              { id: "frontend", label: "Frontend" },
                              { id: "backend", label: "Backend" },
                              { id: "db_cloud", label: "DB & Cloud" },
                              { id: "ai_ml", label: "AI & ML" },
                              { id: "mobile", label: "Mobile" },
                              { id: "iot", label: "IoT & Hardware" },
                            ].map((f) => (
                              <button
                                key={f.id}
                                type="button"
                                onClick={() => setTechCategoryFilter(f.id)}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all cursor-pointer ${
                                  techCategoryFilter === f.id
                                    ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/40 font-semibold"
                                    : "bg-white/[0.03] text-slate-400 border-white/[0.06] hover:bg-white/[0.08] hover:text-slate-200"
                                }`}
                              >
                                {f.label}
                              </button>
                            ))}
                          </div>

                          {/* Filtered suggestions list */}
                          <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto pr-1 p-1">
                            {TECH_SUGGESTIONS.filter((item) => {
                              const matchesCat = techCategoryFilter === "all" || item.category === techCategoryFilter;
                              const matchesQuery = !techSearchQuery || item.name.toLowerCase().includes(techSearchQuery.toLowerCase());
                              return matchesCat && matchesQuery;
                            }).map((item) => {
                              const isAlreadySelected = getSelectedTechs(projectForm.technologies).some(
                                (t) => t.toLowerCase() === item.name.toLowerCase()
                              );
                              return (
                                <button
                                  key={item.name}
                                  type="button"
                                  onClick={() => toggleTechTag(item.name)}
                                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer active:scale-95 ${
                                    isAlreadySelected
                                      ? "bg-indigo-500/20 text-indigo-200 border-indigo-400/50 shadow-sm shadow-indigo-500/20 ring-1 ring-indigo-400/30"
                                      : "bg-white/[0.03] text-slate-300 border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.15] hover:text-white"
                                  }`}
                                  title={isAlreadySelected ? `Remove ${item.name}` : `Add ${item.name}`}
                                >
                                  {isAlreadySelected ? (
                                    renderIcon(FaCheck, { size: 10, className: "text-indigo-400" })
                                  ) : (
                                    <span className="text-slate-500 text-xs font-bold">+</span>
                                  )}
                                  <span>{item.name}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* CARD 3: Narrative & Case Study */}
                      <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#111726]/75 backdrop-blur-sm space-y-5 shadow-xl">
                        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                          <div className="flex items-center gap-2.5">
                            <span className="w-6 h-6 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs font-mono">
                              3
                            </span>
                            <h3 className="text-xs font-bold text-white tracking-wider uppercase font-mono">
                              Project Narrative &amp; Breakdown
                            </h3>
                          </div>
                          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Descriptions</span>
                        </div>

                        {/* Short Description */}
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="font-semibold text-slate-200 text-xs">
                              Short Description (Shown on Main Card) <span className="text-rose-400">*</span>
                            </label>
                            <span className="text-[10px] font-mono text-slate-400">
                              {projectForm.short_desc.length} chars
                            </span>
                          </div>
                          <input
                            type="text"
                            required
                            value={projectForm.short_desc}
                            onChange={(e) => setProjectForm({ ...projectForm, short_desc: e.target.value })}
                            placeholder="Brief 1-2 sentence compelling hook of what this project does and who it helps"
                            className="w-full px-4 py-2.5 text-xs text-white bg-[#0c101d] border border-white/[0.08] rounded-xl focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all placeholder:text-slate-500"
                          />
                        </div>

                        {/* Full Detailed Description */}
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="font-semibold text-slate-200 text-xs">
                              Full Case Study Description
                            </label>
                            <span className="text-[10px] font-mono text-slate-400">
                              Shown in detail modal &amp; case study view
                            </span>
                          </div>
                          <textarea
                            rows={4}
                            value={projectForm.full_desc}
                            onChange={(e) => setProjectForm({ ...projectForm, full_desc: e.target.value })}
                            placeholder="Comprehensive architectural overview: what problem this solves, architectural decisions, data flow, performance optimizations, and quantifiable impact."
                            className="w-full px-4 py-2.5 text-xs text-white bg-[#0c101d] border border-white/[0.08] rounded-xl focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all font-sans leading-relaxed placeholder:text-slate-500"
                          />
                        </div>
                      </div>

                      {/* CARD 4: Key Deliverables & Architecture Features */}
                      <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#111726]/75 backdrop-blur-sm space-y-4 shadow-xl">
                        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                          <div className="flex items-center gap-2.5">
                            <span className="w-6 h-6 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs font-mono">
                              4
                            </span>
                            <div className="flex items-center gap-2">
                              {renderIcon(FaListUl, { className: "text-emerald-400", size: 12 })}
                              <h3 className="text-xs font-bold text-white tracking-wider uppercase font-mono">
                                Key Deliverables &amp; Features
                              </h3>
                            </div>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                            {projectForm.features.split("\n").filter((f) => f.trim()).length} Features
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-400">
                          Enter one feature per line. These will render as structured bullet points with checkmark icons on the project detail modal.
                        </p>

                        <textarea
                          rows={4}
                          value={projectForm.features}
                          onChange={(e) => setProjectForm({ ...projectForm, features: e.target.value })}
                          placeholder="JWT Authentication &amp; Role-based Permissions&#10;Stripe Payment Gateway Integration&#10;Real-time Telemetry WebSocket Stream&#10;Automated CI/CD Pipeline with Docker"
                          className="w-full px-4 py-2.5 text-xs text-white bg-[#0c101d] border border-white/[0.08] rounded-xl focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all font-mono leading-relaxed placeholder:text-slate-500"
                        />
                      </div>

                      {/* CARD 5: Media & Deployment URLs */}
                      <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#111726]/75 backdrop-blur-sm space-y-5 shadow-xl">
                        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                          <div className="flex items-center gap-2.5">
                            <span className="w-6 h-6 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs font-mono">
                              5
                            </span>
                            <h3 className="text-xs font-bold text-white tracking-wider uppercase font-mono">
                              Media Assets &amp; Production Links
                            </h3>
                          </div>
                          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Assets &amp; URLs</span>
                        </div>

                        {/* Project Image */}
                        <div className="space-y-2.5">
                          <label className="block font-semibold text-slate-200 text-xs">
                            Project Cover Image URL
                          </label>
                          <input
                            type="text"
                            value={projectForm.image_url}
                            onChange={(e) => setProjectForm({ ...projectForm, image_url: e.target.value })}
                            placeholder="https://images.unsplash.com/... or pick preset below"
                            className="w-full px-4 py-2.5 text-xs text-white bg-[#0c101d] border border-white/[0.08] rounded-xl focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all placeholder:text-slate-500"
                          />

                          {/* Quick 1-click Preset Cover Images */}
                          <div className="p-3 rounded-xl border border-white/[0.06] bg-[#0c101d]/60 space-y-2">
                            <span className="text-[11px] font-semibold text-slate-400">
                              Quick Preset Cover Images (Click to apply):
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {PRESET_COVERS.map((cov) => (
                                <button
                                  key={cov.name}
                                  type="button"
                                  onClick={() => setProjectForm({ ...projectForm, image_url: cov.url })}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-lg bg-white/[0.04] hover:bg-indigo-500/20 border border-white/[0.08] hover:border-indigo-500/40 text-slate-300 hover:text-indigo-200 transition-all cursor-pointer"
                                >
                                  <span>{cov.name}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* File upload */}
                          <div className="flex flex-col gap-2 pt-1">
                            <div className="flex items-center gap-3">
                              <span className="text-slate-500 font-mono text-[10px]">OR UPLOAD IMAGE FILE:</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e, "project")}
                                className="text-[11px] text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:bg-white/[0.08] file:text-white hover:file:bg-white/[0.15] cursor-pointer"
                              />
                            </div>
                            {storageRlsError && (
                              <p className="text-[11px] text-amber-300 flex items-center gap-1.5">
                                {renderIcon(FaExclamationTriangle, { size: 11, className: "text-amber-400 shrink-0" })}
                                <span>Supabase Storage RLS blocked cloud upload. Loaded as local image preview. Run SQL fix below to enable Supabase Cloud storage.</span>
                              </p>
                            )}
                          </div>
                        </div>

                        {/* GitHub & Live URL */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                          <div>
                            <label className="block font-semibold text-slate-200 mb-1 flex items-center gap-1.5 text-xs">
                              {renderIcon(FaGithub, { size: 12 })}
                              <span>GitHub Repository URL</span>
                            </label>
                            <input
                              type="text"
                              value={projectForm.github_url}
                              onChange={(e) => setProjectForm({ ...projectForm, github_url: e.target.value })}
                              placeholder="https://github.com/your-username/repo"
                              className="w-full px-3.5 py-2 text-xs text-white bg-[#0c101d] border border-white/[0.08] rounded-xl focus:outline-none focus:border-indigo-500/60 transition-all placeholder:text-slate-500"
                            />
                          </div>

                          <div>
                            <label className="block font-semibold text-slate-200 mb-1 flex items-center gap-1.5 text-xs">
                              {renderIcon(FaGlobe, { size: 12 })}
                              <span>Live Deployment / Demo URL</span>
                            </label>
                            <input
                              type="text"
                              value={projectForm.live_url}
                              onChange={(e) => setProjectForm({ ...projectForm, live_url: e.target.value })}
                              placeholder="https://my-app.vercel.app"
                              className="w-full px-3.5 py-2 text-xs text-white bg-[#0c101d] border border-white/[0.08] rounded-xl focus:outline-none focus:border-indigo-500/60 transition-all placeholder:text-slate-500"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Bottom Save & Cancel Bar */}
                      <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
                        <button
                          type="button"
                          onClick={() => setProjectViewMode("list")}
                          className="px-5 py-2.5 text-xs font-semibold text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-xl transition-all"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={projectSaving}
                          className="inline-flex items-center gap-2 px-7 py-2.5 text-xs font-bold text-white rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:opacity-95 shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
                        >
                          {projectSaving ? renderIcon(FaSpinner, { className: "animate-spin", size: 13 }) : renderIcon(FaSave, { size: 13 })}
                          <span>{projectSaving ? "Saving..." : "Save Project to Supabase"}</span>
                        </button>
                      </div>
                    </form>

                    {/* Right: Live Interactive Card Preview (5 cols, sticky) */}
                    <div className="lg:col-span-5 sticky top-24 space-y-4">
                      {/* Preview Studio Header & View Switcher */}
                      <div className="p-3.5 rounded-2xl border border-white/[0.08] bg-[#111726]/85 backdrop-blur-sm flex items-center justify-between shadow-xl">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                            Live Studio Preview
                          </span>
                        </div>
                        <div className="flex items-center p-0.5 rounded-xl bg-[#0c101d] border border-white/[0.08] text-[11px]">
                          <button
                            type="button"
                            onClick={() => setStudioPreviewTab("card")}
                            className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                              studioPreviewTab === "card"
                                ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                                : "text-slate-400 hover:text-white"
                            }`}
                          >
                            Card View
                          </button>
                          <button
                            type="button"
                            onClick={() => setStudioPreviewTab("casestudy")}
                            className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                              studioPreviewTab === "casestudy"
                                ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                                : "text-slate-400 hover:text-white"
                            }`}
                          >
                            Case Study
                          </button>
                        </div>
                      </div>

                      {/* PREVIEW TAB 1: Grid Card View (Portfolio Home Card) */}
                      {studioPreviewTab === "card" && (
                        <div className="rounded-2xl border border-white/[0.08] bg-[#111726]/90 p-5 shadow-xl space-y-4 relative overflow-hidden group">
                          {/* Ambient Glow */}
                          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl -z-0 pointer-events-none" />

                          {/* Image preview */}
                          <div className="aspect-video rounded-xl overflow-hidden bg-[#0c101d] relative border border-white/[0.08] shadow-inner">
                            <img
                              src={projectForm.image_url || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"}
                              alt="Preview"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              onError={(e) => {
                                e.currentTarget.src = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80";
                              }}
                            />
                            {/* Category Pill */}
                            <div className="absolute top-3 right-3 flex items-center gap-1.5">
                              {projectForm.featured && (
                                <span className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-amber-500/90 text-slate-950 shadow-md flex items-center gap-1">
                                  {renderIcon(FaStar, { size: 9 })}
                                  <span>Featured</span>
                                </span>
                              )}
                              <span className="px-2.5 py-1 text-[10px] font-semibold rounded-lg bg-[#090d16]/80 backdrop-blur-md border border-white/15 text-indigo-200 capitalize">
                                {PROJECT_CATEGORIES.find((c) => c.id === projectForm.category)?.name || projectForm.category}
                              </span>
                            </div>
                          </div>

                          {/* Title & Short Description */}
                          <div className="space-y-1.5">
                            <h3 className="text-base font-bold text-white tracking-tight">
                              {projectForm.title || "Your Project Title Will Appear Here"}
                            </h3>
                            <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                              {projectForm.short_desc || "Your short project overview summary will appear right here..."}
                            </p>
                          </div>

                          {/* Technologies preview chips */}
                          <div className="pt-3 border-t border-white/[0.06] space-y-1.5">
                            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                              Tech Stack ({getSelectedTechs(projectForm.technologies).length})
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {getSelectedTechs(projectForm.technologies).length > 0 ? (
                                getSelectedTechs(projectForm.technologies).slice(0, 6).map((tech, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2.5 py-0.5 rounded-lg text-[10px] font-semibold bg-indigo-500/10 border border-indigo-500/30 text-indigo-300"
                                  >
                                    {tech}
                                  </span>
                                ))
                              ) : (
                                <span className="text-[11px] text-slate-500 italic">
                                  No technologies added yet
                                </span>
                              )}
                              {getSelectedTechs(projectForm.technologies).length > 6 && (
                                <span className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-white/[0.04] border border-white/[0.08] text-slate-400">
                                  +{getSelectedTechs(projectForm.technologies).length - 6} more
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Action links buttons */}
                          <div className="flex items-center gap-2 pt-2">
                            <div className="flex-1 py-2 text-center text-xs font-semibold rounded-xl bg-white/[0.06] border border-white/[0.08] text-white flex items-center justify-center gap-2 opacity-90">
                              {renderIcon(FaExternalLinkAlt, { size: 10 })}
                              <span>Live Preview</span>
                            </div>
                            <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-300 flex items-center justify-center opacity-90">
                              {renderIcon(FaGithub, { size: 14 })}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* PREVIEW TAB 2: Full Case Study Modal Preview */}
                      {studioPreviewTab === "casestudy" && (
                        <div className="rounded-2xl border border-white/[0.08] bg-[#111726]/90 p-5 shadow-xl space-y-4 max-h-[580px] overflow-y-auto">
                          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                            <span className="text-[11px] font-mono text-indigo-400 font-bold uppercase tracking-wider">
                              Case Study Detailed Preview
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/[0.06] text-slate-300 capitalize">
                              {projectForm.category}
                            </span>
                          </div>

                          <h3 className="text-lg font-bold text-white tracking-tight">
                            {projectForm.title || "Untitled Project"}
                          </h3>

                          {/* Case Study Image */}
                          <div className="aspect-video rounded-xl overflow-hidden bg-[#0c101d] relative border border-white/[0.08]">
                            <img
                              src={projectForm.image_url || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"}
                              alt="Case study"
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Overview section */}
                          <div className="space-y-1">
                            <h4 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wide">
                              Overview &amp; Architecture
                            </h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                              {projectForm.full_desc || projectForm.short_desc || "No full description provided yet."}
                            </p>
                          </div>

                          {/* Features list */}
                          {projectForm.features && (
                            <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                              <h4 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wide">
                                Key Deliverables
                              </h4>
                              <ul className="space-y-1.5">
                                {projectForm.features
                                  .split("\n")
                                  .map((f) => f.trim())
                                  .filter(Boolean)
                                  .map((feat, i) => (
                                    <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                                      <span className="text-emerald-400 mt-0.5">
                                        {renderIcon(FaCheckCircle, { size: 12 })}
                                      </span>
                                      <span>{feat}</span>
                                    </li>
                                  ))}
                              </ul>
                            </div>
                          )}

                          {/* Tech stack full view */}
                          <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                            <h4 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wide">
                              Technologies &amp; Tools Used
                            </h4>
                            <div className="flex flex-wrap gap-1.5">
                              {getSelectedTechs(projectForm.technologies).map((t, i) => (
                                <span key={i} className="px-2.5 py-0.5 rounded-lg text-xs font-medium bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Publication Health Checklist Card */}
                      <div className="p-4 rounded-2xl border border-white/[0.08] bg-[#111726]/75 space-y-2.5 text-xs shadow-xl">
                        <span className="font-mono uppercase font-bold text-slate-400 text-[11px] tracking-wider">
                          Publication Quality Checklist
                        </span>
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-300">Project Title Provided</span>
                            <span className={projectForm.title.trim() ? "text-emerald-400 font-bold" : "text-slate-600"}>
                              {projectForm.title.trim() ? "✓ Ready" : "Missing"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-300">Short Description Added</span>
                            <span className={projectForm.short_desc.trim() ? "text-emerald-400 font-bold" : "text-slate-600"}>
                              {projectForm.short_desc.trim() ? "✓ Ready" : "Missing"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-300">Technology Tags</span>
                            <span className={getSelectedTechs(projectForm.technologies).length > 0 ? "text-indigo-400 font-bold" : "text-slate-600"}>
                              {getSelectedTechs(projectForm.technologies).length} tags
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-300">Key Features Specified</span>
                            <span className={projectForm.features.trim() ? "text-emerald-400 font-bold" : "text-slate-500"}>
                              {projectForm.features.split("\n").filter((f) => f.trim()).length} points
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-300">Cover Image Asset</span>
                            <span className={projectForm.image_url ? "text-emerald-400 font-bold" : "text-amber-400"}>
                              {projectForm.image_url ? "✓ Configured" : "Default Used"}
                            </span>
                          </div>
                        </div>
                      </div>

                    </div>

                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* VIEW: SKILLS & TECHNOLOGY STACK STUDIO */}
          {/* ============================================================== */}
          {activeTab === "skills" && (
            <div className="space-y-8">
              {/* Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.08]">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Skills &amp; Technology Stack Studio
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Manage your tech stack, update &amp; create custom categories, set proficiency levels (Beshi Valo, Valo, Medium), and customize icons.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleResetSkillsDefaults}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-xl transition-all cursor-pointer"
                    title="Restore default 29 skills and 6 categories"
                  >
                    Reset Defaults
                  </button>
                  <button
                    type="button"
                    onClick={handleOpenAddCategory}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white rounded-xl bg-gradient-to-r from-purple-600 to-indigo-500 hover:opacity-95 shadow-md shadow-purple-500/20 active:scale-[0.98] transition-all cursor-pointer"
                  >
                    {renderIcon(FaPlus, { size: 10 })}
                    <span>+ Add Category</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleOpenAddSkill}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 hover:opacity-95 shadow-md shadow-cyan-500/20 active:scale-[0.98] transition-all cursor-pointer"
                  >
                    {renderIcon(FaPlus, { size: 10 })}
                    <span>+ Add Technology</span>
                  </button>
                </div>
              </div>

              {/* Status & Toast Notification */}
              {skillToast && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3.5 rounded-2xl border text-xs flex items-center gap-3 ${
                    skillToast.type === "success"
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                      : "bg-rose-500/10 border-rose-500/30 text-rose-300"
                  }`}
                >
                  {renderIcon(FaCheckCircle, { size: 16 })}
                  <span className="font-medium">{skillToast.message}</span>
                </motion.div>
              )}

              {/* ============================================================== */}
              {/* SECTION 1: CATEGORIES & DOMAINS */}
              {/* ============================================================== */}
              <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#111726]/75 space-y-5 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      {renderIcon(FaLayerGroup, { size: 14, className: "text-purple-400" })}
                      <span>Categories &amp; Filter Domains</span>
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Categories appear as filter tabs on your live portfolio. You can add new categories, rename them, or delete empty ones.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenAddCategory}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 transition-all cursor-pointer"
                  >
                    {renderIcon(FaPlus, { size: 9 })}
                    <span>New Category</span>
                  </button>
                </div>

                {/* Categories List Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {skillCategoriesList.map((cat) => {
                    const catIcon = resolveCategoryIcon(cat.id, cat.iconName);
                    const count = skillsList.filter((s) => s.category === cat.id).length;

                    return (
                      <div
                        key={cat.id}
                        className="flex items-center justify-between p-3.5 rounded-xl border border-white/[0.08] bg-black/20 hover:border-purple-500/30 transition-all group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
                            {renderIcon(catIcon, { size: 16 })}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-semibold text-white truncate">{cat.label}</h4>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] font-mono text-slate-400">ID: {cat.id}</span>
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-white/[0.06] text-slate-300 border border-white/[0.08]">
                                {count} {count === 1 ? "skill" : "skills"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0 ml-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEditCategory(cat)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-white/[0.06] transition-colors cursor-pointer"
                            title="Edit Category"
                          >
                            {renderIcon(FaEdit, { size: 12 })}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/[0.06] transition-colors cursor-pointer"
                            title="Delete Category"
                          >
                            {renderIcon(FaTrash, { size: 12 })}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Add / Edit Category Form (Inline Drawer) */}
                {(isAddingCategory || editingCategoryId !== null) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="p-5 rounded-xl border border-purple-500/30 bg-purple-950/20 space-y-4"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        {editingCategoryId ? "Edit Category" : "Add New Category"}
                      </h4>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingCategory(false);
                          setEditingCategoryId(null);
                        }}
                        className="text-slate-400 hover:text-white text-xs cursor-pointer"
                      >
                        {renderIcon(FaTimes, { size: 12 })}
                      </button>
                    </div>

                    <form onSubmit={handleSaveCategory} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block font-semibold text-slate-300 text-[11px] uppercase tracking-wider mb-1.5">
                            Category Label / Name *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Cloud & DevOps"
                            value={categoryForm.label}
                            onChange={(e) => setCategoryForm({ ...categoryForm, label: e.target.value })}
                            className="w-full px-3.5 py-2 text-xs text-white bg-[#0c101d] border border-white/10 rounded-xl focus:outline-none focus:border-purple-400 transition-all"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-slate-300 text-[11px] uppercase tracking-wider mb-1.5">
                            Category ID / Slug
                          </label>
                          <input
                            type="text"
                            placeholder="auto-generated from label (e.g. cloud-devops)"
                            value={categoryForm.id}
                            onChange={(e) => setCategoryForm({ ...categoryForm, id: e.target.value })}
                            disabled={Boolean(editingCategoryId)}
                            className="w-full px-3.5 py-2 text-xs text-white bg-[#0c101d] border border-white/10 rounded-xl focus:outline-none focus:border-purple-400 transition-all font-mono disabled:opacity-50"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-slate-300 text-[11px] uppercase tracking-wider mb-1.5">
                            Category Icon
                          </label>
                          <select
                            value={categoryForm.iconName}
                            onChange={(e) => setCategoryForm({ ...categoryForm, iconName: e.target.value })}
                            className="w-full px-3.5 py-2 text-xs text-white bg-[#0c101d] border border-white/10 rounded-xl focus:outline-none focus:border-purple-400 transition-all"
                          >
                            <option value="FaCode">FaCode (Code & Languages)</option>
                            <option value="FaReact">FaReact (Frontend & Web)</option>
                            <option value="FaMobileAlt">FaMobileAlt (Mobile Apps)</option>
                            <option value="FaServer">FaServer (Backend & API)</option>
                            <option value="FaDatabase">FaDatabase (Databases & DevOps)</option>
                            <option value="FaBrain">FaBrain (AI / Machine Learning)</option>
                            <option value="FaMicrochip">FaMicrochip (IoT & Hardware)</option>
                            <option value="FaCloud">FaCloud (Cloud Infrastructure)</option>
                            <option value="FaShieldAlt">FaShieldAlt (Security & Cybersecurity)</option>
                            <option value="FaTools">FaTools (Tools & Utilities)</option>
                            <option value="FaGlobe">FaGlobe (Web & Network)</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingCategory(false);
                            setEditingCategoryId(null);
                          }}
                          className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-xl transition-all cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={skillSaving}
                          className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white rounded-xl bg-gradient-to-r from-purple-600 to-indigo-500 hover:opacity-95 shadow-md shadow-purple-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                        >
                          {renderIcon(FaSave, { size: 11 })}
                          <span>{editingCategoryId ? "Update Category" : "Save Category"}</span>
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </div>

              {/* ============================================================== */}
              {/* SECTION 2: ADD / EDIT SKILL STUDIO (IN-PAGE FORM) */}
              {/* ============================================================== */}
              {(isAddingSkill || editingSkillId !== null) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 rounded-2xl border border-cyan-500/30 bg-[#111726]/90 space-y-6 shadow-2xl relative"
                >
                  {/* Decorative Glow */}
                  <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] relative z-10">
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                        {renderIcon(editingSkillId ? FaEdit : FaPlus, { size: 14, className: "text-cyan-400" })}
                        <span>{editingSkillId ? "Edit Technology Specification" : "Add New Technology to Arsenal"}</span>
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Configure technology name, assign category, pick proficiency tier, customize badge color, and select icon.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingSkill(false);
                        setEditingSkillId(null);
                      }}
                      className="text-slate-400 hover:text-white text-xs cursor-pointer p-1 rounded-lg hover:bg-white/[0.06]"
                    >
                      {renderIcon(FaTimes, { size: 14 })}
                    </button>
                  </div>

                  <form onSubmit={handleSaveSkill} className="space-y-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      {/* Left 8 cols: Form Inputs */}
                      <div className="lg:col-span-8 space-y-5">
                        {/* Row 1: Name and Category */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block font-semibold text-slate-300 text-[11px] uppercase tracking-wider mb-1.5">
                              Technology / Skill Name *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Next.js, Docker, Flutter, PostgreSQL"
                              value={skillForm.name}
                              onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                              className="w-full px-3.5 py-2.5 text-xs text-white bg-[#0c101d] border border-white/10 rounded-xl focus:outline-none focus:border-cyan-400 transition-all font-medium"
                            />
                          </div>

                          <div>
                            <label className="block font-semibold text-slate-300 text-[11px] uppercase tracking-wider mb-1.5">
                              Category Domain *
                            </label>
                            <select
                              value={skillForm.category}
                              onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                              className="w-full px-3.5 py-2.5 text-xs text-white bg-[#0c101d] border border-white/10 rounded-xl focus:outline-none focus:border-cyan-400 transition-all font-medium cursor-pointer"
                            >
                              {skillCategoriesList.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.label} ({c.id})
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Row 2: Proficiency Level Tier (USER REQUEST: "valo, beshi valo naki medium") */}
                        <div className="space-y-2">
                          <label className="block font-semibold text-slate-300 text-[11px] uppercase tracking-wider">
                            Proficiency Level Tier (কেমন পারি: বেশি ভালো / ভালো / মিডিয়াম) *
                          </label>
                          <p className="text-[11px] text-slate-400">
                            Select how well you know this skill. It controls the glowing badge on your live portfolio.
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                            {PROFICIENCY_OPTIONS.map((opt) => {
                              const isSelected = skillForm.level === opt.value;

                              return (
                                <button
                                  key={opt.value}
                                  type="button"
                                  onClick={() => setSkillForm({ ...skillForm, level: opt.value })}
                                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                                    isSelected
                                      ? opt.borderActive
                                      : "border-white/[0.08] bg-black/20 hover:border-white/20 hover:bg-black/30"
                                  }`}
                                >
                                  <div>
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-bold text-white">{opt.label}</span>
                                      {isSelected && (
                                        <div className="p-1 rounded-full bg-white/10 text-white">
                                          {renderIcon(FaCheck, { size: 10 })}
                                        </div>
                                      )}
                                    </div>
                                    <span className={`inline-block mt-1 px-2 py-0.5 text-[9px] font-bold rounded-md border ${opt.badgeColor}`}>
                                      {opt.bengaliTag}
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                                    {opt.desc}
                                  </p>
                                </button>
                              );
                            })}
                          </div>

                          {/* Optional Custom Level Input */}
                          <div className="pt-1.5 flex items-center gap-2">
                            <span className="text-[10px] text-slate-400 font-mono">Custom Level:</span>
                            <input
                              type="text"
                              placeholder="Or type custom level (e.g. Specialist, In Production)"
                              value={skillForm.level}
                              onChange={(e) => setSkillForm({ ...skillForm, level: e.target.value })}
                              className="flex-1 px-3 py-1.5 text-xs text-white bg-[#0c101d] border border-white/10 rounded-lg focus:outline-none focus:border-cyan-400 transition-all font-mono"
                            />
                          </div>
                        </div>

                        {/* Row 3: Color Palette Selection */}
                        <div className="space-y-2">
                          <label className="block font-semibold text-slate-300 text-[11px] uppercase tracking-wider">
                            Brand Accent Color (Card &amp; Icon Tint)
                          </label>
                          <div className="flex flex-wrap items-center gap-2">
                            {TECH_COLOR_PRESETS.map((preset) => (
                              <button
                                key={preset.hex}
                                type="button"
                                onClick={() => setSkillForm({ ...skillForm, color: preset.hex })}
                                className={`w-7 h-7 rounded-full transition-transform cursor-pointer relative ${
                                  skillForm.color.toLowerCase() === preset.hex.toLowerCase()
                                    ? "scale-125 ring-2 ring-white ring-offset-2 ring-offset-[#0c101d]"
                                    : "hover:scale-110 opacity-85 hover:opacity-100"
                                }`}
                                style={{ backgroundColor: preset.hex }}
                                title={`${preset.name} (${preset.hex})`}
                              />
                            ))}

                            <div className="flex items-center gap-2 ml-2">
                              <input
                                type="color"
                                value={skillForm.color.startsWith("#") ? skillForm.color : "#a855f7"}
                                onChange={(e) => setSkillForm({ ...skillForm, color: e.target.value })}
                                className="w-7 h-7 rounded-lg border border-white/10 bg-transparent cursor-pointer"
                                title="Custom Hex Color"
                              />
                              <input
                                type="text"
                                value={skillForm.color}
                                onChange={(e) => setSkillForm({ ...skillForm, color: e.target.value })}
                                placeholder="#a855f7"
                                className="w-24 px-2 py-1 text-xs text-white bg-[#0c101d] border border-white/10 rounded-lg focus:outline-none focus:border-cyan-400 font-mono"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Row 4: Icon Selector */}
                        <div className="space-y-2">
                          <label className="block font-semibold text-slate-300 text-[11px] uppercase tracking-wider">
                            Technology Icon
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <select
                                value={skillForm.iconName || ""}
                                onChange={(e) => setSkillForm({ ...skillForm, iconName: e.target.value })}
                                className="w-full px-3.5 py-2.5 text-xs text-white bg-[#0c101d] border border-white/10 rounded-xl focus:outline-none focus:border-cyan-400 transition-all font-medium cursor-pointer"
                              >
                                <option value="">Auto-resolve from Skill Name (Recommended)</option>
                                {AVAILABLE_SKILL_ICONS.map((ic) => (
                                  <option key={ic.id} value={ic.id}>
                                    {ic.label} ({ic.id})
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-slate-400">
                              <span>Currently resolved:</span>
                              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white font-mono">
                                {renderIcon(resolveSkillIcon(skillForm.name, skillForm.iconName, skillForm.category), {
                                  size: 14,
                                  style: { color: skillForm.color },
                                })}
                                <span>{skillForm.iconName || "Auto-detected"}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.06]">
                          <button
                            type="button"
                            onClick={() => {
                              setIsAddingSkill(false);
                              setEditingSkillId(null);
                            }}
                            className="px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-xl transition-all cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={skillSaving}
                            className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white rounded-xl bg-gradient-to-r from-cyan-600 via-cyan-500 to-indigo-500 hover:opacity-95 shadow-lg shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                          >
                            {renderIcon(FaSave, { size: 12 })}
                            <span>{editingSkillId ? "Update Technology" : "Save to Stack"}</span>
                          </button>
                        </div>
                      </div>

                      {/* Right 4 cols: Live Card Preview */}
                      <div className="lg:col-span-4 p-5 rounded-2xl border border-white/[0.08] bg-black/30 flex flex-col justify-between space-y-4">
                        <div className="border-b border-white/[0.06] pb-2">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                            Live Website Preview
                          </span>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Real-time rendering of how visitors see this card on your portfolio.
                          </p>
                        </div>

                        {/* Live Card */}
                        <div className="flex flex-col items-center justify-center p-6 text-center border rounded-2xl bg-white/[0.03] border-white/10 backdrop-blur-xl max-w-[200px] mx-auto shadow-xl">
                          <div
                            className="flex items-center justify-center w-12 h-12 mb-3 rounded-xl transition-transform duration-300"
                            style={{ backgroundColor: `${skillForm.color || "#a855f7"}18` }}
                          >
                            {renderIcon(
                              resolveSkillIcon(skillForm.name, skillForm.iconName, skillForm.category),
                              {
                                size: 26,
                                style: { color: skillForm.color || "#a855f7" },
                              }
                            )}
                          </div>

                          <h4 className="text-sm font-semibold text-white">
                            {skillForm.name || "Technology Name"}
                          </h4>

                          <span
                            className={`inline-block mt-2 px-2.5 py-0.5 text-[10px] font-semibold rounded-full border ${
                              skillForm.level === "Core Production" ||
                              skillForm.level.toLowerCase().includes("core") ||
                              skillForm.level.toLowerCase().includes("beshi")
                                ? "bg-purple-500/10 border-purple-500/30 text-purple-300"
                                : skillForm.level === "Advanced" ||
                                  skillForm.level.toLowerCase().includes("adv") ||
                                  skillForm.level.toLowerCase().includes("valo")
                                ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-300"
                                : "bg-amber-500/10 border-amber-500/30 text-amber-300"
                            }`}
                          >
                            {skillForm.level || "Core Production"}
                          </span>
                        </div>

                        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-[11px] text-slate-400 space-y-1 font-mono">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Category:</span>
                            <span className="text-slate-200">
                              {skillCategoriesList.find((c) => c.id === skillForm.category)?.label || skillForm.category}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Color:</span>
                            <span className="text-slate-200">{skillForm.color}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* ============================================================== */}
              {/* SECTION 3: SKILLS CATALOG & FILTER BAR */}
              {/* ============================================================== */}
              <div className="space-y-4">
                {/* Search & Filter Toolbar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
                  {/* Category Filter Tabs */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setSkillCategoryFilter("all")}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                        skillCategoryFilter === "all"
                          ? "bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-md shadow-purple-500/20"
                          : "bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.08]"
                      }`}
                    >
                      All ({skillsList.length})
                    </button>
                    {skillCategoriesList.map((cat) => {
                      const isActive = skillCategoryFilter === cat.id;
                      const count = skillsList.filter((s) => s.category === cat.id).length;

                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setSkillCategoryFilter(cat.id)}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                            isActive
                              ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
                              : "bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.08]"
                          }`}
                        >
                          <span>{cat.label}</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-white/[0.06] text-slate-400"}`}>
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Search Input */}
                  <div className="relative min-w-[220px]">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      {renderIcon(FaSearch, { size: 12 })}
                    </span>
                    <input
                      type="text"
                      placeholder="Search technologies..."
                      value={skillSearch}
                      onChange={(e) => setSkillSearch(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-1.5 text-xs text-white bg-[#0c101d] border border-white/10 rounded-xl focus:outline-none focus:border-cyan-400 transition-all placeholder:text-slate-500"
                    />
                  </div>
                </div>

                {/* Skills Grid */}
                {filteredAdminSkills.length === 0 ? (
                  <div className="p-12 text-center border rounded-2xl bg-white/[0.02] border-white/[0.08]">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/[0.04] text-slate-400 mb-3">
                      {renderIcon(FaSearch, { size: 20 })}
                    </div>
                    <p className="text-sm font-semibold text-white">No technologies found</p>
                    <p className="text-xs text-slate-400 mt-1">
                      No technology matched your filter or search query "{skillSearch}".
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSkillSearch("");
                        setSkillCategoryFilter("all");
                      }}
                      className="mt-3 px-3.5 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold text-white transition-colors cursor-pointer"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
                    {filteredAdminSkills.map((skill) => {
                      const skillIcon = resolveSkillIcon(skill.name, skill.iconName, skill.category);
                      const isExpert =
                        skill.level === "Core Production" ||
                        skill.level.toLowerCase().includes("core") ||
                        skill.level.toLowerCase().includes("beshi");
                      const isAdvanced =
                        skill.level === "Advanced" ||
                        skill.level.toLowerCase().includes("adv") ||
                        skill.level.toLowerCase().includes("valo");

                      return (
                        <div
                          key={skill.id}
                          className="flex flex-col items-center justify-between p-4 text-center border rounded-2xl bg-white/[0.03] border-white/10 hover:border-purple-500/40 hover:bg-white/[0.06] transition-all group relative shadow-md shadow-black/10"
                        >
                          {/* Quick Action Overlay Buttons */}
                          <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => handleOpenEditSkill(skill)}
                              className="p-1.5 rounded-lg bg-black/60 text-slate-300 hover:text-cyan-400 border border-white/10 hover:border-cyan-400/40 transition-colors cursor-pointer"
                              title="Edit Technology"
                            >
                              {renderIcon(FaEdit, { size: 10 })}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteSkill(skill.id)}
                              className="p-1.5 rounded-lg bg-black/60 text-slate-300 hover:text-rose-400 border border-white/10 hover:border-rose-400/40 transition-colors cursor-pointer"
                              title="Delete Technology"
                            >
                              {renderIcon(FaTrash, { size: 10 })}
                            </button>
                          </div>

                          {/* Icon Container */}
                          <div
                            className="flex items-center justify-center w-12 h-12 mb-3 rounded-xl transition-transform duration-300 group-hover:scale-110"
                            style={{ backgroundColor: `${skill.color || "#a855f7"}18` }}
                          >
                            {renderIcon(skillIcon, {
                              size: 26,
                              style: { color: skill.color || "#a855f7" },
                            })}
                          </div>

                          {/* Skill Name */}
                          <h4 className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                            {skill.name}
                          </h4>

                          {/* Category Tag */}
                          <span className="text-[10px] text-slate-400 mt-0.5 truncate max-w-full">
                            {skillCategoriesList.find((c) => c.id === skill.category)?.label || skill.category}
                          </span>

                          {/* Level Tag */}
                          <span
                            className={`inline-block mt-2 px-2.5 py-0.5 text-[10px] font-semibold rounded-full border ${
                              isExpert
                                ? "bg-purple-500/10 border-purple-500/30 text-purple-300"
                                : isAdvanced
                                ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-300"
                                : "bg-amber-500/10 border-amber-500/30 text-amber-300"
                            }`}
                          >
                            {skill.level}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* VIEW 3: PROFILE & BIO SETTINGS (FULL IN-PAGE) */}
          {/* ============================================================== */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Profile &amp; Biography Settings</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Customize your avatar photo, professional headline, bio narrative, video controls, and contact channels
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  disabled={profileSaving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:opacity-95 shadow-lg shadow-indigo-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                >
                  {renderIcon(FaSave, { size: 12 })}
                  <span>{profileSaving ? "Saving..." : "Save Profile Settings"}</span>
                </button>
              </div>

              {profileMessage && (
                <div className="p-3.5 text-xs text-emerald-300 border rounded-2xl bg-emerald-500/10 border-emerald-500/30 flex items-center gap-2.5">
                  {renderIcon(FaCheckCircle, { size: 15, className: "text-emerald-400 shrink-0" })}
                  <span className="font-medium">{profileMessage}</span>
                </div>
              )}

              {uploadStatus && (
                <div className="p-3.5 text-xs text-cyan-300 border rounded-2xl bg-cyan-500/10 border-cyan-500/30 flex items-center gap-2.5">
                  {renderIcon(FaSpinner, { size: 14, className: "animate-spin shrink-0" })}
                  <span className="font-medium">{uploadStatus}</span>
                </div>
              )}

              {renderStorageRlsBanner()}

              <form onSubmit={handleSaveProfile} className="space-y-6 text-xs">
                {/* Profile Photo & Avatar Upload Card */}
                <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#111726]/75 space-y-5 shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.06]">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        {renderIcon(FaCamera, { size: 14, className: "text-indigo-400" })}
                        <span>Profile Photo &amp; Avatar Studio</span>
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Upload or customize your official avatar image shown across the entire portfolio (Hero, About, Navigation, Footer).
                      </p>
                    </div>
                    {/* Source Status Pill */}
                    <span className="self-start sm:self-auto px-3 py-1 text-[10px] font-mono font-semibold rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                      <span>
                        {profileForm.profile_image?.startsWith("data:")
                          ? "Local Data URL"
                          : profileForm.profile_image?.includes("supabase.co")
                          ? "Supabase Cloud Stored"
                          : profileForm.profile_image === PORTFOLIO_INFO.profileImage
                          ? "Default Portfolio Photo"
                          : "Custom Image URL"}
                      </span>
                    </span>
                  </div>

                  <div className="flex flex-col md:flex-row items-center md:items-start gap-6 p-5 rounded-2xl bg-[#0c101d] border border-white/[0.06]">
                    {/* Left: Avatar Display Card with Glowing Gradient Ring */}
                    <div className="relative group shrink-0">
                      <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl p-1 bg-gradient-to-tr from-indigo-500 via-indigo-600 to-cyan-400 shadow-xl shadow-indigo-500/15 relative overflow-hidden transition-transform duration-300 group-hover:scale-105">
                        <img
                          src={toProxyImageUrl(profileForm.profile_image || PORTFOLIO_INFO.profileImage)}
                          alt="Profile Avatar"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/images/img.jpg";
                          }}
                          className="w-full h-full object-cover rounded-xl bg-slate-900"
                        />
                        <label
                          htmlFor="profile-photo-input"
                          className="absolute inset-1 rounded-xl bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 text-white cursor-pointer transition-opacity duration-200 backdrop-blur-xs"
                        >
                          {renderIcon(FaCamera, { size: 20 })}
                          <span className="text-[10px] font-semibold tracking-wide">Upload Photo</span>
                        </label>
                      </div>
                      <span className="absolute -bottom-2 -right-2 px-2 py-0.5 text-[9px] font-bold rounded-md bg-indigo-600 text-white shadow-md border border-indigo-400/30">
                        1:1 Square
                      </span>
                    </div>

                    {/* Right: Upload controls & Direct URL */}
                    <div className="flex-1 w-full space-y-3.5">
                      <div className="flex flex-wrap items-center gap-3">
                        <label
                          htmlFor="profile-photo-input"
                          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:opacity-95 shadow-md shadow-indigo-500/20 active:scale-95 transition-all cursor-pointer"
                        >
                          {profileImageUploading ? (
                            <>
                              {renderIcon(FaSpinner, { className: "animate-spin", size: 12 })}
                              <span>Uploading to Cloud...</span>
                            </>
                          ) : (
                            <>
                              {renderIcon(FaUpload, { size: 12 })}
                              <span>Upload New Photo</span>
                            </>
                          )}
                        </label>
                        <input
                          id="profile-photo-input"
                          type="file"
                          accept="image/*"
                          disabled={profileImageUploading}
                          onChange={(e) => handleFileUpload(e, "profile")}
                          className="hidden"
                        />

                        {profileForm.profile_image !== PORTFOLIO_INFO.profileImage && (
                          <button
                            type="button"
                            onClick={() => {
                              setProfileForm((prev) => ({
                                ...prev,
                                profile_image: PORTFOLIO_INFO.profileImage,
                              }));
                            }}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-xl transition-all cursor-pointer"
                          >
                            {renderIcon(FaUndo, { size: 11 })}
                            <span>Reset to Default Photo</span>
                          </button>
                        )}
                      </div>

                      {/* Direct Image URL input */}
                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-semibold text-slate-300">
                          Or enter Direct Image URL:
                        </label>
                        <input
                          type="text"
                          value={profileForm.profile_image || ""}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, profile_image: e.target.value })
                          }
                          placeholder="https://images.unsplash.com/... or upload directly from file above"
                          className="w-full px-3.5 py-2 text-xs text-white bg-[#090d16] border border-white/10 rounded-xl focus:outline-none focus:border-indigo-400 font-mono transition-all"
                        />
                      </div>

                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Supports PNG, JPG, JPEG, WEBP, or GIF. Uploads directly to Supabase Storage bucket (<code className="text-cyan-300 font-mono">portfolio-assets/profile/</code>) with instantaneous local fallback.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Introduction Video & "Watch Intro" Button Controls */}
                <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#111726]/75 space-y-5 shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        {renderIcon(FaVideo, { size: 14, className: "text-cyan-400" })}
                        <span>"Watch Intro" Video &amp; Visibility Controls</span>
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Control whether the "Watch Intro" button appears in the About section, and provide your custom video link or ID.
                      </p>
                    </div>

                    {/* Visibility Pill Badge */}
                    <span
                      className={`self-start sm:self-auto px-3 py-1 text-[10px] font-semibold rounded-full border flex items-center gap-1.5 transition-all ${
                        profileForm.show_intro_video
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                          : "border-slate-600/30 bg-slate-800/40 text-slate-400"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          profileForm.show_intro_video
                            ? "bg-emerald-400 animate-pulse"
                            : "bg-slate-500"
                        }`}
                      />
                      <span>
                        {profileForm.show_intro_video
                          ? "Visible on Website"
                          : "Hidden from Website"}
                      </span>
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#0c101d] border border-white/[0.06] space-y-5">
                    {/* Toggle Control Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.08]">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {renderIcon(profileForm.show_intro_video ? FaEye : FaEyeSlash, {
                            size: 13,
                            className: profileForm.show_intro_video ? "text-emerald-400" : "text-slate-400",
                          })}
                          <span className="text-xs font-bold text-white">
                            Show "Watch Intro" Button on Website
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          When turned <span className="text-emerald-400 font-semibold">ON</span>, visitors can click "Watch Intro" next to your resume in the About section. When turned <span className="text-rose-400 font-semibold">OFF</span>, it is completely hidden.
                        </p>
                      </div>

                      {/* Interactive Toggle Switch */}
                      <button
                        type="button"
                        onClick={() =>
                          setProfileForm((prev) => ({
                            ...prev,
                            show_intro_video: !prev.show_intro_video,
                          }))
                        }
                        className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          profileForm.show_intro_video
                            ? "bg-gradient-to-r from-indigo-600 to-cyan-500 shadow-md shadow-indigo-500/20"
                            : "bg-slate-800"
                        }`}
                        aria-label="Toggle Watch Intro visibility"
                      >
                        <span
                          className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                            profileForm.show_intro_video ? "translate-x-7" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Video URL or ID Input */}
                    <div className="space-y-2">
                      <label className="block text-[11px] font-semibold text-slate-300">
                        Introduction Video Link or ID:
                      </label>
                      <div className="flex flex-col sm:flex-row gap-2.5">
                        <input
                          type="text"
                          value={profileForm.intro_video_url}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              intro_video_url: e.target.value,
                            })
                          }
                          placeholder="e.g. https://drive.google.com/file/d/1BzSWgFEBgruUq-3wkTWfEiip3Rzxr-Pm/view or YouTube URL"
                          className="flex-1 px-3.5 py-2.5 text-xs text-white bg-[#090d16] border border-white/10 rounded-xl focus:outline-none focus:border-indigo-400 font-mono transition-all"
                        />

                        {profileForm.intro_video_url && (
                          <button
                            type="button"
                            onClick={() => setAdminVideoPreviewOpen(true)}
                            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white rounded-xl bg-indigo-600/80 hover:bg-indigo-500 border border-indigo-400/30 transition-all cursor-pointer shrink-0 active:scale-95"
                          >
                            {renderIcon(FaPlay, { size: 10 })}
                            <span>Preview Video</span>
                          </button>
                        )}

                        {profileForm.intro_video_url !== PORTFOLIO_INFO.introVideoUrl && (
                          <button
                            type="button"
                            onClick={() =>
                              setProfileForm((prev) => ({
                                ...prev,
                                intro_video_url: PORTFOLIO_INFO.introVideoUrl || PORTFOLIO_INFO.introVideoId,
                              }))
                            }
                            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-xl transition-all cursor-pointer shrink-0"
                            title="Reset to default intro video"
                          >
                            {renderIcon(FaUndo, { size: 10 })}
                            <span>Reset Default</span>
                          </button>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Supports <span className="text-cyan-300">Google Drive share links</span>, <span className="text-cyan-300">YouTube URLs</span> (watch or shorts), <span className="text-cyan-300">Loom videos</span>, direct MP4 video URLs, or Google Drive File IDs.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Hero Animated Headline & Typewriter Studio */}
                <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#111726]/75 space-y-4 shadow-xl">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white">Hero Typewriter Headline Studio</h3>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                          {renderIcon(FaCode, { size: 9 })}
                          100% Dynamic
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Customize the animated typing headline rendered on your Hero section. No static text — control the intro prefix and all cycling phrases.
                      </p>
                    </div>

                    {/* Reset to Default Headlines Button */}
                    <button
                      type="button"
                      onClick={() =>
                        setProfileForm((prev) => ({
                          ...prev,
                          typewriter_prefix: PORTFOLIO_INFO.typewriterPrefix,
                          typewriter_phrases: PORTFOLIO_INFO.typewriterPhrases.join("\n"),
                        }))
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-xl transition-all cursor-pointer"
                      title="Reset headline and phrases to default"
                    >
                      {renderIcon(FaUndo, { size: 10 })}
                      <span>Reset Defaults</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Left Column: Prefix and Phrases Input */}
                    <div className="space-y-3">
                      <div>
                        <label className="block font-semibold text-slate-300 text-[11px] uppercase tracking-wider mb-1.5">
                          Headline Prefix (Intro Word / Phrase)
                        </label>
                        <input
                          type="text"
                          value={profileForm.typewriter_prefix}
                          onChange={(e) => setProfileForm({ ...profileForm, typewriter_prefix: e.target.value })}
                          placeholder="e.g. I engineer, I build, Specialist in"
                          className="w-full px-3.5 py-2.5 text-sm text-white bg-[#0c101d] border border-white/10 rounded-xl focus:outline-none focus:border-cyan-400 placeholder:text-slate-600 font-medium"
                        />
                        <p className="text-[11px] text-slate-400 mt-1">
                          Appears static right before the animated typewriter text.
                        </p>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block font-semibold text-slate-300 text-[11px] uppercase tracking-wider">
                            Animated Roles / Phrases
                          </label>
                          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                            {
                              profileForm.typewriter_phrases
                                .split("\n")
                                .map((s: string) => s.trim())
                                .filter(Boolean).length
                            }{" "}
                            Phrases Active
                          </span>
                        </div>
                        <textarea
                          rows={5}
                          value={profileForm.typewriter_phrases}
                          onChange={(e) => setProfileForm({ ...profileForm, typewriter_phrases: e.target.value })}
                          placeholder="1 phrase per line...&#10;Scalable Full-Stack Web Apps&#10;Cross-Platform Mobile Experiences&#10;High-Throughput REST & GraphQL APIs"
                          className="w-full px-3.5 py-2.5 text-xs font-mono text-white bg-[#0c101d] border border-white/10 rounded-xl focus:outline-none focus:border-cyan-400 placeholder:text-slate-600 leading-relaxed resize-y"
                        />
                        <p className="text-[11px] text-slate-400 mt-1">
                          Enter 1 phrase per line. Each will type smoothly, pause for 2.4s, and loop continuously.
                        </p>
                      </div>
                    </div>

                    {/* Right Column: Real-time Live Animation Preview */}
                    <div className="flex flex-col">
                      <label className="block font-semibold text-slate-300 text-[11px] uppercase tracking-wider mb-1.5">
                        Live Animation Preview (Real-Time)
                      </label>
                      <div className="flex-1 min-h-[160px] p-4 rounded-xl border border-white/10 bg-[#090d16] flex flex-col justify-center relative overflow-hidden group">
                        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-[10px] text-slate-400 font-mono">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                          <span>Interactive Preview</span>
                        </div>

                        <div className="space-y-1.5 text-left">
                          <p className="font-mono text-[11px] text-slate-400 tracking-wider">
                            &lt;Hero Headline /&gt;
                          </p>
                          <div className="flex flex-wrap items-center gap-2 text-base sm:text-lg font-medium text-slate-400">
                            {profileForm.typewriter_prefix && (
                              <span className="text-white/80 font-normal">
                                {profileForm.typewriter_prefix}
                              </span>
                            )}
                            <div className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">
                              {(() => {
                                const phrases = profileForm.typewriter_phrases
                                  .split("\n")
                                  .map((s: string) => s.trim())
                                  .filter(Boolean);
                                if (phrases.length === 0) {
                                  return <span className="text-slate-600 italic">No phrases specified</span>;
                                }
                                const seq: (string | number)[] = [];
                                phrases.forEach((p: string) => {
                                  seq.push(p, 2000);
                                });
                                return (
                                  <TypeAnimation
                                    key={phrases.join("|")}
                                    sequence={seq}
                                    wrapper="span"
                                    speed={50}
                                    repeat={Infinity}
                                  />
                                );
                              })()}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-white/[0.06] flex flex-wrap items-center justify-between text-[11px] text-slate-400">
                          <span>Typing Speed: ~45ms</span>
                          <span>Cycle Delay: 2.4s</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Basic Personal Info */}
                <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#111726]/75 space-y-4 shadow-xl">
                  <div className="pb-3 border-b border-white/[0.06]">
                    <h3 className="text-sm font-bold text-white">Personal Identity</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">Your official name, professional tagline, and narrative biography</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-300 text-[11px] uppercase tracking-wider mb-1.5">Full Legal Name</label>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm text-white bg-[#0c101d] border border-white/10 rounded-xl focus:outline-none focus:border-indigo-400"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300 text-[11px] uppercase tracking-wider mb-1.5">Display Short Name</label>
                      <input
                        type="text"
                        value={profileForm.short_name}
                        onChange={(e) => setProfileForm({ ...profileForm, short_name: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm text-white bg-[#0c101d] border border-white/10 rounded-xl focus:outline-none focus:border-indigo-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 text-[11px] uppercase tracking-wider mb-1.5">Professional Title / Role</label>
                    <input
                      type="text"
                      value={profileForm.title}
                      onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm text-white bg-[#0c101d] border border-white/10 rounded-xl focus:outline-none focus:border-indigo-400"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block font-semibold text-slate-300 text-[11px] uppercase tracking-wider">
                        Hero Subtitle Tagline (Hero Section Under Name)
                      </label>
                      <span className="text-[10px] text-indigo-400/90 font-medium px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                        Live Dynamic Hero Subtitle
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      value={profileForm.tagline}
                      onChange={(e) => setProfileForm({ ...profileForm, tagline: e.target.value })}
                      placeholder="e.g. Software Engineering student at BUBT. I bridge architectural discipline with human-centered product design to build scalable digital systems."
                      className="w-full px-3.5 py-2.5 text-sm text-white bg-[#0c101d] border border-white/10 rounded-xl focus:outline-none focus:border-indigo-400 leading-relaxed placeholder:text-slate-600 transition-all"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      Controls the introductory statement beneath your name in the Hero section without any static fallback text.
                    </p>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 text-[11px] uppercase tracking-wider mb-1.5">About Me Story Narrative</label>
                    <textarea
                      rows={5}
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm text-white bg-[#0c101d] border border-white/10 rounded-xl focus:outline-none focus:border-indigo-400 leading-relaxed"
                    />
                  </div>
                </div>

                {/* Metrics & Experience Counters */}
                <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#111726]/75 space-y-4 shadow-xl">
                  <div className="pb-3 border-b border-white/[0.06]">
                    <h3 className="text-sm font-bold text-white">Display Statistics</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">Quantifiable counters rendered on the home page</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-300 text-[11px] uppercase tracking-wider mb-1.5">Years Experience</label>
                      <input
                        type="text"
                        value={profileForm.years_experience}
                        onChange={(e) => setProfileForm({ ...profileForm, years_experience: e.target.value })}
                        className="w-full px-3.5 py-2 text-sm text-white bg-[#0c101d] border border-white/10 rounded-xl focus:outline-none focus:border-indigo-400"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300 text-[11px] uppercase tracking-wider mb-1.5">Projects Completed</label>
                      <input
                        type="text"
                        value={profileForm.projects_completed}
                        onChange={(e) => setProfileForm({ ...profileForm, projects_completed: e.target.value })}
                        className="w-full px-3.5 py-2 text-sm text-white bg-[#0c101d] border border-white/10 rounded-xl focus:outline-none focus:border-indigo-400"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300 text-[11px] uppercase tracking-wider mb-1.5">Satisfaction / Quality</label>
                      <input
                        type="text"
                        value={profileForm.satisfaction_rate}
                        onChange={(e) => setProfileForm({ ...profileForm, satisfaction_rate: e.target.value })}
                        className="w-full px-3.5 py-2 text-sm text-white bg-[#0c101d] border border-white/10 rounded-xl focus:outline-none focus:border-indigo-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Info & Socials */}
                <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#111726]/75 space-y-4 shadow-xl">
                  <div className="pb-3 border-b border-white/[0.06]">
                    <h3 className="text-sm font-bold text-white">Contact &amp; Social Links</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">Reach channels and external developer profiles</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-300 text-[11px] uppercase tracking-wider mb-1.5">Email</label>
                      <input
                        type="text"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        className="w-full px-3.5 py-2 text-sm text-white bg-[#0c101d] border border-white/10 rounded-xl focus:outline-none focus:border-indigo-400"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-300 text-[11px] uppercase tracking-wider mb-1.5">Phone</label>
                      <input
                        type="text"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        className="w-full px-3.5 py-2 text-sm text-white bg-[#0c101d] border border-white/10 rounded-xl focus:outline-none focus:border-indigo-400"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block font-semibold text-slate-300 text-[11px] uppercase tracking-wider">
                          Current Location
                        </label>
                        <button
                          type="button"
                          onClick={handleDetectLocation}
                          disabled={detectingLocation}
                          className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 px-2 py-0.5 rounded-lg transition-all cursor-pointer disabled:opacity-50"
                          title="Click to auto-detect current location via GPS"
                        >
                          {detectingLocation ? (
                            <>
                              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                              <span>Detecting GPS...</span>
                            </>
                          ) : (
                            <>
                              {renderIcon(FaMapMarkerAlt, { size: 10 })}
                              <span>Auto Detect</span>
                            </>
                          )}
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          value={profileForm.location}
                          onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                          onClick={() => {
                            if (!detectingLocation) {
                              handleDetectLocation();
                            }
                          }}
                          placeholder="Click here to auto-detect current GPS location..."
                          className="w-full pl-3.5 pr-10 py-2 text-sm text-white bg-[#0c101d] border border-white/10 rounded-xl focus:outline-none focus:border-cyan-400 cursor-pointer hover:border-cyan-500/40 transition-colors"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDetectLocation();
                          }}
                          disabled={detectingLocation}
                          title="Click to auto-detect GPS location"
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
                        >
                          {renderIcon(FaCrosshairs, {
                            size: 14,
                            className: detectingLocation ? "animate-spin text-cyan-400" : "text-cyan-400",
                          })}
                        </button>
                      </div>
                      {locationStatus && (
                        <p
                          className={`mt-1.5 text-[11px] font-medium transition-all ${
                            locationStatus.includes("detected")
                              ? "text-emerald-400"
                              : locationStatus.includes("denied") || locationStatus.includes("timed out")
                              ? "text-rose-400"
                              : "text-cyan-300"
                          }`}
                        >
                          {locationStatus}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="block font-semibold text-slate-300 text-[11px] uppercase tracking-wider mb-1.5 flex items-center justify-between">
                      <span>Custom Google Maps URL (Optional)</span>
                      <span className="text-[10px] text-slate-400 normal-case font-normal">
                        Leave blank to automatically link to Current Location above
                      </span>
                    </label>
                    <input
                      type="text"
                      value={profileForm.maps_url}
                      onChange={(e) => setProfileForm({ ...profileForm, maps_url: e.target.value })}
                      placeholder="e.g. https://maps.google.com/?q=Mirpur+Dhaka+Bangladesh"
                      className="w-full px-3.5 py-2 text-xs text-white bg-[#0c101d] border border-white/10 rounded-xl focus:outline-none focus:border-indigo-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div>
                      <label className="block font-semibold text-slate-300 text-[11px] uppercase tracking-wider mb-1.5">GitHub Profile URL</label>
                      <input
                        type="text"
                        value={profileForm.github}
                        onChange={(e) => setProfileForm({ ...profileForm, github: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs text-white bg-[#0c101d] border border-white/10 rounded-xl focus:outline-none focus:border-indigo-400"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-300 text-[11px] uppercase tracking-wider mb-1.5">LinkedIn Profile URL</label>
                      <input
                        type="text"
                        value={profileForm.linkedin}
                        onChange={(e) => setProfileForm({ ...profileForm, linkedin: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs text-white bg-[#0c101d] border border-white/10 rounded-xl focus:outline-none focus:border-indigo-400"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-300 text-[11px] uppercase tracking-wider mb-1.5">Twitter / X URL</label>
                      <input
                        type="text"
                        value={profileForm.twitter}
                        onChange={(e) => setProfileForm({ ...profileForm, twitter: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs text-white bg-[#0c101d] border border-white/10 rounded-xl focus:outline-none focus:border-indigo-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={profileSaving}
                    className="px-8 py-3 text-xs font-semibold text-white rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:opacity-95 shadow-lg shadow-indigo-500/25 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {profileSaving ? "Saving..." : "Save All Profile Settings"}
                  </button>
                </div>
              </form>

              {/* Admin Intro Video Test Modal */}
              <AnimatePresence>
                {adminVideoPreviewOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setAdminVideoPreviewOpen(false)}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
                  >
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      transition={{ type: "spring", damping: 25, stiffness: 300 }}
                      onClick={(e) => e.stopPropagation()}
                      className="relative w-full max-w-3xl p-3 border shadow-2xl rounded-2xl bg-[#111726] border-white/15 backdrop-blur-xl space-y-3"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-white/10">
                        <div className="flex items-center gap-2">
                          {renderIcon(FaPlay, { size: 12, className: "text-indigo-400" })}
                          <h4 className="text-xs font-bold text-white">Introduction Video Test Preview</h4>
                        </div>
                        <button
                          type="button"
                          onClick={() => setAdminVideoPreviewOpen(false)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                        >
                          {renderIcon(FaTimes, { size: 14 })}
                        </button>
                      </div>

                      <div className="relative overflow-hidden rounded-xl aspect-video bg-black">
                        <iframe
                          src={getVideoEmbedUrl(profileForm.intro_video_url)}
                          title="Admin Preview Video"
                          className="w-full h-full"
                          allow="autoplay; encrypted-media; fullscreen"
                          allowFullScreen
                        />
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* ============================================================== */}
          {/* VIEW 4: EDUCATION & CERTIFICATES (FULL IN-PAGE STUDIO) */}
          {/* ============================================================== */}
          {activeTab === "education" && (
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
                        placeholder="Dean's List for Academic Performance&#10;BUBT IT Club Technical Contributor&#10;Winner of Regional Science Fair"
                        className="w-full px-3.5 py-2.5 text-xs text-white bg-[#0c101d] border border-white/[0.08] rounded-xl focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 font-mono leading-relaxed placeholder:text-slate-500"
                      />
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
                    educationList.map((edu, idx) => (
                      <div
                        key={idx}
                        className="p-5 rounded-2xl border border-white/[0.08] bg-[#111726]/75 backdrop-blur-sm space-y-3 shadow-lg hover:border-indigo-500/30 transition-all group"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                                {edu.degree}
                              </h4>
                              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">
                                {edu.period}
                              </span>
                            </div>
                            <p className="text-xs font-medium text-cyan-300 mt-0.5">{edu.institution}</p>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-auto">
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
                    ))
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
          )}

          {/* ============================================================== */}
          {/* VIEW 5: RESUME & STORAGE (FULL IN-PAGE) */}
          {/* ============================================================== */}
          {activeTab === "resume" && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-white/[0.08]">
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Resume &amp; Asset Cloud Storage</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Direct management of your primary curriculum vitae PDF and CDN portfolio media assets
                </p>
              </div>

              {uploadStatus && (
                <div className="p-3.5 text-xs text-cyan-300 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center gap-2.5">
                  {renderIcon(FaSpinner, { className: "animate-spin shrink-0", size: 13 })}
                  <span className="font-medium">{uploadStatus}</span>
                </div>
              )}

              {renderStorageRlsBanner()}

              {/* Current Resume Info Card */}
              <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#111726]/75 backdrop-blur-sm space-y-5 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="p-3.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {renderIcon(FaFilePdf, { size: 28 })}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white">Currently Active Resume Document</h3>
                      <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        LIVE ON PORTFOLIO
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono break-all mt-1 bg-[#0c101d] px-3 py-1.5 rounded-lg border border-white/[0.06]">
                      {profileForm.resume_url || "/PDF/Maharab_Hosen.pdf"}
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-200">
                      Live Resume / CV Hosted URL:
                    </label>
                    {resumeSavedToast && (
                      <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                        {renderIcon(FaCheckCircle, { size: 12 })}
                        <span>Live CV URL Updated &amp; Saved!</span>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2.5">
                    <input
                      type="text"
                      value={profileForm.resume_url}
                      onChange={(e) => setProfileForm({ ...profileForm, resume_url: e.target.value })}
                      placeholder="https://..."
                      className="flex-1 px-4 py-2.5 text-xs text-white bg-[#0c101d] border border-white/[0.08] rounded-xl focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 font-mono transition-all placeholder:text-slate-500"
                    />
                    <button
                      type="button"
                      disabled={resumeManualSaving}
                      onClick={async () => {
                        setResumeManualSaving(true);
                        await saveLiveProfile(profileForm);
                        setResumeManualSaving(false);
                        setResumeSavedToast(true);
                        setTimeout(() => setResumeSavedToast(false), 3000);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:opacity-95 text-xs font-bold text-white transition-all shadow-md shadow-indigo-500/20 active:scale-[0.98] disabled:opacity-50 cursor-pointer shrink-0"
                    >
                      {resumeManualSaving ? "Saving..." : "Save & Activate"}
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 pt-3 border-t border-white/[0.06]">
                  <a
                    href={profileForm.resume_url || "/PDF/Maharab_Hosen.pdf"}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white transition-colors cursor-pointer"
                  >
                    {renderIcon(FaExternalLinkAlt, { size: 10 })}
                    <span>Preview Live Resume</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(profileForm.resume_url || "/PDF/Maharab_Hosen.pdf");
                      setResumeCopied(true);
                      setTimeout(() => setResumeCopied(false), 2500);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    {renderIcon(resumeCopied ? FaCheck : FaCopy, { size: 10 })}
                    <span>{resumeCopied ? "Copied!" : "Copy URL"}</span>
                  </button>
                </div>
              </div>

              {/* Direct In-Page File Upload Card */}
              <div className="p-8 rounded-2xl border border-dashed border-white/[0.15] bg-[#111726]/40 hover:bg-[#111726]/60 transition-all space-y-3 text-center">
                <div className="p-3.5 w-fit mx-auto rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {renderIcon(FaFilePdf, { size: 24 })}
                </div>
                <h3 className="text-sm font-bold text-white">Upload New Resume PDF</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto font-light">
                  Select a new PDF from your computer. It will automatically upload to Supabase Storage and instantly become your live active resume.
                </p>

                <div className="pt-2">
                  <label className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-xs font-semibold text-white shadow-lg shadow-indigo-500/20 cursor-pointer hover:opacity-95 active:scale-[0.98] transition-all">
                    <span>Choose PDF File</span>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handleFileUpload(e, "resume")}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* VIEW 6: CONTACT INBOX (SPLIT IN-PAGE LAYOUT, NO MODAL) */}
          {/* ============================================================== */}
          {activeTab === "messages" && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-white/[0.08] flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Contact Inquiries</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Messages submitted directly by recruiters and clients via your Contact form
                  </p>
                </div>
                <button
                  onClick={fetchMessages}
                  className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white transition-all cursor-pointer"
                >
                  Refresh Inbox
                </button>
              </div>

              {messagesList.length === 0 ? (
                <div className="p-12 text-center rounded-2xl border border-white/[0.08] bg-[#111726]/50 text-slate-400 text-xs">
                  No incoming messages found. Form submissions from visitors will automatically appear here.
                </div>
              ) : (
                /* Split Inbox Layout: Messages List on Left, Selected Message Reader on Right */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Messages List (5 cols) */}
                  <div className="lg:col-span-5 space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
                    {messagesList.map((msg) => {
                      const isSelected = selectedMessage?.id === msg.id;
                      return (
                        <div
                          key={msg.id}
                          onClick={() => setSelectedMessage(msg)}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                            isSelected
                              ? "border-indigo-500/60 bg-indigo-500/10 text-white shadow-md ring-1 ring-indigo-500/30"
                              : "border-white/[0.06] bg-[#111726]/75 hover:bg-[#111726] text-slate-300 hover:border-white/[0.12]"
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs font-bold">
                            <span className="truncate text-white">{msg.name}</span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {new Date(msg.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-[11px] text-cyan-300 truncate mt-0.5 font-medium">{msg.email}</p>
                          <p className="text-xs text-slate-300 truncate mt-1.5 font-medium">
                            {msg.subject || "(No Subject)"}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Selected Message Viewer (7 cols) */}
                  <div className="lg:col-span-7 p-6 rounded-2xl border border-white/[0.08] bg-[#111726]/85 backdrop-blur-sm space-y-5 shadow-xl">
                    {selectedMessage ? (
                      <div className="space-y-4 text-xs">
                        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                          <div>
                            <h3 className="text-base font-bold text-white">{selectedMessage.name}</h3>
                            <a
                              href={`mailto:${selectedMessage.email}`}
                              className="text-cyan-400 hover:text-cyan-300 hover:underline text-xs font-medium"
                            >
                              {selectedMessage.email}
                            </a>
                          </div>

                          <div className="flex items-center gap-2">
                            <a
                              href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject || "Your Portfolio Inquiry")}`}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold transition-colors"
                            >
                              {renderIcon(FaReply, { size: 10 })}
                              <span>Reply Email</span>
                            </a>
                            <button
                              onClick={() => handleDeleteMessage(selectedMessage.id)}
                              className="p-2 text-slate-400 hover:text-rose-400 rounded-xl hover:bg-rose-500/10 transition-colors"
                              title="Delete Message"
                            >
                              {renderIcon(FaTrash, { size: 12 })}
                            </button>
                          </div>
                        </div>

                        <div>
                          <span className="text-slate-500 text-[10px] uppercase font-mono tracking-wider">Subject</span>
                          <p className="text-sm font-bold text-white mt-0.5">
                            {selectedMessage.subject || "General Inquiry"}
                          </p>
                        </div>

                        <div>
                          <span className="text-slate-500 text-[10px] uppercase font-mono tracking-wider">Message Content</span>
                          <div className="mt-1.5 p-4 rounded-xl bg-[#0c101d] border border-white/[0.08] text-slate-200 text-xs leading-relaxed whitespace-pre-wrap font-sans">
                            {selectedMessage.message}
                          </div>
                        </div>

                        <p className="text-[10px] text-slate-500 font-mono pt-2">
                          Received: {new Date(selectedMessage.created_at).toLocaleString()}
                        </p>
                      </div>
                    ) : (
                      <div className="p-8 text-center text-slate-500 text-xs">
                        Select a message from the list to view full transmission details.
                      </div>
                    )}
                  </div>

                </div>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* VIEW 7: SUPABASE DATABASE SETUP & SQL */}
          {/* ============================================================== */}
          {activeTab === "setup" && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-white/[0.08]">
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Supabase Setup &amp; Live SQL Schema</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Verify your database connection and deploy schema configurations in 1 click
                </p>
              </div>

              {/* Status Indicator */}
              <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#111726]/75 backdrop-blur-sm flex items-center justify-between shadow-xl">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Database Connection Active</h4>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      https://zcmeryxyifkxbxkmgvfe.supabase.co
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Ready &amp; Synced
                </span>
              </div>

              {/* Quick Fix for RLS Write Permissions */}
              <div className="p-6 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-4 shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                    {renderIcon(FaShieldAlt, { size: 15 })}
                    <span>Fix Edit, Save &amp; Upload Permissions (Supabase RLS Fix)</span>
                  </h3>
                  <button
                    onClick={() => {
                      const fullRlsSql = `-- 1. Disable RLS on all tables
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_info DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.education DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_analytics DISABLE ROW LEVEL SECURITY;

-- 2. Allow public uploads & access to 'portfolio-assets' bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio-assets', 'portfolio-assets', true) ON CONFLICT (id) DO UPDATE SET public = true;
CREATE POLICY "Allow public all on portfolio-assets" ON storage.objects FOR ALL TO public USING (bucket_id = 'portfolio-assets') WITH CHECK (bucket_id = 'portfolio-assets');`;
                      navigator.clipboard.writeText(fullRlsSql);
                      setDatabaseFixCopied(true);
                      setTimeout(() => setDatabaseFixCopied(false), 2500);
                    }}
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center gap-2 transition-all shadow-md active:scale-[0.98] cursor-pointer"
                  >
                    {renderIcon(databaseFixCopied ? FaCheck : FaCopy, { size: 12 })}
                    <span>{databaseFixCopied ? "Copied to Clipboard!" : "Copy Full RLS Fix SQL"}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  If editing says <code className="text-amber-300 bg-black/40 px-1 py-0.5 rounded font-mono">RLS error</code> or file uploading says <code className="text-amber-300 bg-black/40 px-1 py-0.5 rounded font-mono">new row violates row-level security policy</code>, simply copy and run this script in your <strong className="text-cyan-300">Supabase SQL Editor</strong>:
                </p>
                <pre className="p-4 rounded-xl bg-[#0c101d] border border-white/[0.08] text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed">
{`-- 1. Disable RLS on all tables
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_info DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.education DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills DISABLE ROW LEVEL SECURITY;

-- 2. Allow public uploads to 'portfolio-assets' bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio-assets', 'portfolio-assets', true) ON CONFLICT (id) DO UPDATE SET public = true;
CREATE POLICY "Allow public all on portfolio-assets" ON storage.objects FOR ALL TO public USING (bucket_id = 'portfolio-assets') WITH CHECK (bucket_id = 'portfolio-assets');`}
                </pre>
              </div>

              {/* Step by Step SQL Instructions */}
              <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#111726]/75 backdrop-blur-sm space-y-4 text-xs leading-relaxed text-slate-300 shadow-xl">
                <h3 className="text-sm font-bold text-white">How to initialize your tables in Supabase:</h3>
                <ol className="list-decimal pl-5 space-y-2 text-slate-400">
                  <li>
                    Open your project root file: <code className="text-cyan-400 font-mono">supabase_schema.sql</code>.
                  </li>
                  <li>
                    Go to your <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">Supabase Dashboard</a> ➔ <strong>SQL Editor</strong>.
                  </li>
                  <li>
                    Paste all the code from <code className="text-cyan-400 font-mono">supabase_schema.sql</code> and click <strong>Run</strong>.
                  </li>
                  <li>
                    In Supabase Dashboard, go to <strong>Storage ➔ New Bucket</strong>, name it: <code className="text-cyan-400 font-mono font-bold">portfolio-assets</code>, and toggle <strong>Public Bucket: ON</strong>.
                  </li>
                </ol>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default Admin;
