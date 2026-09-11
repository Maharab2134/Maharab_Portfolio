import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
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
} from "react-icons/fa";
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";
import {
  PORTFOLIO_INFO,
  EDUCATION_DATA,
  CERTIFICATES_DATA,
} from "../data/portfolioData";
import { PROJECTS } from "../data/projectsData";
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
} from "../lib/portfolioService";

const renderIcon = (Icon: any, props: any = {}) => {
  return <Icon {...props} />;
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
  | "projects"
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
    bio: PORTFOLIO_INFO.bio,
    phone: PORTFOLIO_INFO.phone,
    email: PORTFOLIO_INFO.email,
    location: PORTFOLIO_INFO.location,
    resume_url: PORTFOLIO_INFO.resumeUrl,
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
        bio: liveProfile.bio || PORTFOLIO_INFO.bio,
        phone: liveProfile.phone || PORTFOLIO_INFO.phone,
        email: liveProfile.email || PORTFOLIO_INFO.email,
        location: liveProfile.location || PORTFOLIO_INFO.location,
        resume_url: liveProfile.resumeUrl || PORTFOLIO_INFO.resumeUrl,
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

  useEffect(() => {
    fetchProfileData();
    fetchEducationAndCerts();
    if (session) {
      fetchProjects();
      fetchMessages();
    }
  }, [session, fetchProjects, fetchMessages, fetchEducationAndCerts, fetchProfileData]);

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
    destination: "project" | "resume"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!supabase) {
      setUploadStatus("Please connect Supabase in .env to upload files directly to cloud storage.");
      setTimeout(() => setUploadStatus(""), 5000);
      return;
    }

    setUploadStatus("Uploading file to Supabase Storage...");
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${destination === "resume" ? "resumes" : "projects"}/${fileName}`;

    // If uploading a new resume, delete previous CV files from storage so old ones are automatically removed
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

      // If it's an image for a project, load it as local base64 preview so user's work isn't blocked!
      if (destination === "project" && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64Url = event.target?.result as string;
          if (base64Url) {
            setProjectForm((prev) => ({ ...prev, image_url: base64Url }));
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
      <div className="flex items-center justify-center min-h-screen px-4 bg-[#030014] text-slate-200">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md p-8 border rounded-3xl bg-slate-900/90 border-white/10 backdrop-blur-2xl shadow-2xl"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-500 to-cyan-400 mb-4 shadow-lg shadow-purple-500/25">
              {renderIcon(FaLock, { size: 22, className: "text-white" })}
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">Maharab Admin Console</h1>
            <p className="mt-1 text-xs text-slate-400">
              Sign in with your Supabase Admin Credentials
            </p>
          </div>

          {/* Supabase Connection Status */}
          <div className="mb-6 p-3 rounded-xl border text-xs flex items-center gap-2.5 bg-white/[0.03] border-white/10">
            {isSupabaseConfigured ? (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400 font-medium">Supabase API Keys Configured (.env)</span>
              </>
            ) : (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="text-amber-300 font-medium">Supabase Pending in .env</span>
              </>
            )}
          </div>

          {authError && (
            <div className="p-3 mb-5 text-xs text-rose-300 border rounded-xl bg-rose-500/10 border-rose-500/20">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@maharab.dev"
                className="w-full px-4 py-3 text-sm text-white bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 text-sm text-white bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3.5 mt-2 text-sm font-semibold text-white transition-all duration-200 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 hover:shadow-lg hover:shadow-purple-500/25 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {authLoading ? "Authenticating..." : "Sign In to Admin Console"}
            </button>

            <button
              type="button"
              onClick={() => setSession({ user: { email: "admin@maharab.dev" } })}
              className="w-full py-2.5 text-xs font-semibold text-slate-300 hover:text-white transition-all rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer"
            >
              ⚡ Instant Developer Access (Bypass Login)
            </button>
          </form>

          <div className="mt-8 pt-4 border-t border-white/10 text-center">
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

  return (
    <div className="min-h-screen bg-[#030014] text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b bg-[#030014]/95 backdrop-blur-xl border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-500 to-cyan-400 font-bold text-white shadow-lg shadow-purple-500/20">
            MH
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-white">Maharab Admin Console</h1>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                Live Database
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              {session.user?.email || "Super Administrator"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              window.location.hash = "";
              window.location.reload();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white border border-white/10 rounded-xl hover:bg-white/5 transition-colors"
          >
            {renderIcon(FaExternalLinkAlt, { size: 10 })}
            <span>View Live Site</span>
          </a>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-400 border border-rose-500/20 rounded-xl hover:bg-rose-500/10 transition-colors"
          >
            {renderIcon(FaSignOutAlt, { size: 12 })}
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Layout: Sidebar + In-Page Content (Full Width Edge-to-Edge, Zero Empty Gutters) */}
      <div className="flex-1 flex flex-col md:flex-row w-full px-4 sm:px-6 lg:px-8 py-6 gap-8">
        
        {/* Left Navigation Sidebar */}
        <aside className="w-full md:w-64 lg:w-72 flex-shrink-0 space-y-1.5">
          <div className="p-3 mb-2 rounded-2xl bg-white/[0.02] border border-white/5 text-xs text-slate-400">
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Navigation</span>
          </div>

          <button
            onClick={() => {
              setActiveTab("overview");
              setProjectViewMode("list");
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold transition-all ${
              activeTab === "overview"
                ? "bg-gradient-to-r from-purple-600/30 to-cyan-500/20 text-white border border-cyan-500/30 shadow-md"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {renderIcon(FaChartBar, { size: 14, className: activeTab === "overview" ? "text-cyan-400" : "" })}
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("projects");
              setProjectViewMode("list");
            }}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold transition-all ${
              activeTab === "projects"
                ? "bg-gradient-to-r from-purple-600/30 to-cyan-500/20 text-white border border-cyan-500/30 shadow-md"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <span className="flex items-center gap-3">
              {renderIcon(FaFolder, { size: 14, className: activeTab === "projects" ? "text-cyan-400" : "" })}
              <span>Projects Manager</span>
            </span>
            <span className="px-2 py-0.5 text-[10px] rounded-full bg-white/10 text-slate-300">
              {projectsList.length}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab("profile");
              setProjectViewMode("list");
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold transition-all ${
              activeTab === "profile"
                ? "bg-gradient-to-r from-purple-600/30 to-cyan-500/20 text-white border border-cyan-500/30 shadow-md"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {renderIcon(FaUser, { size: 14, className: activeTab === "profile" ? "text-purple-400" : "" })}
            <span>Profile &amp; Bio Settings</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("education");
              setProjectViewMode("list");
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold transition-all ${
              activeTab === "education"
                ? "bg-gradient-to-r from-purple-600/30 to-cyan-500/20 text-white border border-cyan-500/30 shadow-md"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {renderIcon(FaGraduationCap, { size: 14, className: activeTab === "education" ? "text-cyan-400" : "" })}
            <span>Education &amp; Certs</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("resume");
              setProjectViewMode("list");
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold transition-all ${
              activeTab === "resume"
                ? "bg-gradient-to-r from-purple-600/30 to-cyan-500/20 text-white border border-cyan-500/30 shadow-md"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {renderIcon(FaFilePdf, { size: 14, className: activeTab === "resume" ? "text-pink-400" : "" })}
            <span>Resume &amp; Storage</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("messages");
              setProjectViewMode("list");
            }}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold transition-all ${
              activeTab === "messages"
                ? "bg-gradient-to-r from-purple-600/30 to-cyan-500/20 text-white border border-cyan-500/30 shadow-md"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <span className="flex items-center gap-3">
              {renderIcon(FaEnvelope, { size: 14, className: activeTab === "messages" ? "text-emerald-400" : "" })}
              <span>Contact Messages</span>
            </span>
            {messagesList.length > 0 && (
              <span className="px-2 py-0.5 text-[10px] rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                {messagesList.length}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab("setup");
              setProjectViewMode("list");
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold transition-all ${
              activeTab === "setup"
                ? "bg-gradient-to-r from-purple-600/30 to-cyan-500/20 text-white border border-cyan-500/30 shadow-md"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {renderIcon(FaDatabase, { size: 14, className: activeTab === "setup" ? "text-amber-400" : "" })}
            <span>Supabase SQL Setup</span>
          </button>
        </aside>

        {/* Right Main Page Content Area (Full in-page views, no dialog boxes) */}
        <main className="flex-1 min-w-0">
          
          {/* ============================================================== */}
          {/* VIEW 1: OVERVIEW DASHBOARD */}
          {/* ============================================================== */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Welcome Banner */}
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950/40 via-slate-900/60 to-cyan-950/30 border border-white/10 relative overflow-hidden">
                <div className="relative z-10 space-y-2">
                  <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-medium">
                    Online &amp; Connected
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                    Welcome back, {PORTFOLIO_INFO.shortName}!
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-light leading-relaxed">
                    Everything you see here is synchronized with your Supabase database. You can add new projects, update your bio, upload a new resume PDF, and inspect visitor messages in real-time.
                  </p>
                </div>
              </div>

              {/* 4 Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.02]">
                  <p className="text-xs text-slate-400">Total Projects</p>
                  <p className="text-2xl font-black text-white mt-1">{projectsList.length}</p>
                  <p className="text-[11px] text-cyan-400 mt-1">Live in catalog</p>
                </div>
                <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.02]">
                  <p className="text-xs text-slate-400">Contact Inquiries</p>
                  <p className="text-2xl font-black text-white mt-1">{messagesList.length}</p>
                  <p className="text-[11px] text-emerald-400 mt-1">Direct submissions</p>
                </div>
                <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.02]">
                  <p className="text-xs text-slate-400">Years Experience</p>
                  <p className="text-2xl font-black text-white mt-1">{profileForm.years_experience}</p>
                  <p className="text-[11px] text-purple-400 mt-1">Production track</p>
                </div>
                <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.02]">
                  <p className="text-xs text-slate-400">Work Status</p>
                  <p className="text-sm font-bold text-emerald-400 mt-2 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    Available for Hire
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">Home banner active</p>
                </div>
              </div>

              {/* Quick Action Tiles */}
              <div>
                <h3 className="text-sm font-bold text-white mb-3">Quick In-Page Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => {
                      setActiveTab("projects");
                      handleOpenCreateProject();
                    }}
                    className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] text-left transition-all group"
                  >
                    <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 w-fit mb-2 group-hover:scale-110 transition-transform">
                      {renderIcon(FaPlus, { size: 14 })}
                    </div>
                    <h4 className="text-sm font-bold text-white">Add New Project</h4>
                    <p className="text-xs text-slate-400 mt-0.5 font-light">
                      Create a project in the in-page editor
                    </p>
                  </button>

                  <button
                    onClick={() => setActiveTab("profile")}
                    className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] text-left transition-all group"
                  >
                    <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 w-fit mb-2 group-hover:scale-110 transition-transform">
                      {renderIcon(FaUser, { size: 14 })}
                    </div>
                    <h4 className="text-sm font-bold text-white">Update Bio &amp; Info</h4>
                    <p className="text-xs text-slate-400 mt-0.5 font-light">
                      Edit title, about narrative, and socials
                    </p>
                  </button>

                  <button
                    onClick={() => setActiveTab("resume")}
                    className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] text-left transition-all group"
                  >
                    <div className="p-2.5 rounded-xl bg-pink-500/20 text-pink-400 w-fit mb-2 group-hover:scale-110 transition-transform">
                      {renderIcon(FaFilePdf, { size: 14 })}
                    </div>
                    <h4 className="text-sm font-bold text-white">Upload New Resume</h4>
                    <p className="text-xs text-slate-400 mt-0.5 font-light">
                      Store updated PDF in Supabase Cloud
                    </p>
                  </button>
                </div>
              </div>
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
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                    <div>
                      <h2 className="text-xl font-bold text-white">Project Catalog</h2>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Manage your live portfolio projects in real time
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={handleSyncAllProjectsToSupabase}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-slate-300 hover:text-white border border-white/10 rounded-xl hover:bg-white/5 transition-all"
                        title="Seed all initial projects into your Supabase database"
                      >
                        {renderIcon(FaDatabase, { size: 11, className: "text-amber-400" })}
                        <span>Sync All to Supabase</span>
                      </button>

                      <button
                        onClick={handleOpenCreateProject}
                        className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:shadow-lg hover:shadow-purple-500/25 active:scale-95 transition-all"
                      >
                        {renderIcon(FaPlus, { size: 11 })}
                        <span>Add New Project (In-Page)</span>
                      </button>
                    </div>
                  </div>

                  {/* Search and Filters */}
                  <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                    <div className="relative w-full sm:w-72">
                      {renderIcon(FaSearch, { size: 12, className: "absolute left-3.5 top-3.5 text-slate-500" })}
                      <input
                        type="text"
                        value={projectSearch}
                        onChange={(e) => setProjectSearch(e.target.value)}
                        placeholder="Search projects..."
                        className="w-full pl-9 pr-3 py-2 text-xs text-white bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
                      {["all", "web", "mobile", "ml", "iot"].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setProjectCategoryFilter(cat)}
                          className={`px-3 py-1.5 rounded-xl text-xs capitalize transition-all ${
                            projectCategoryFilter === cat
                              ? "bg-white/10 text-white font-semibold border border-white/20"
                              : "text-slate-400 hover:text-white"
                          }`}
                        >
                          {cat === "all" ? "All" : cat.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Projects Table / In-Page Cards (Full Screen Grid) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                    {filteredProjects.map((project) => (
                      <div
                        key={project.id || project.project_id}
                        className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] flex flex-col justify-between hover:border-white/20 transition-all space-y-4"
                      >
                        <div className="flex gap-4 items-start">
                          <div className="w-24 h-20 rounded-xl overflow-hidden bg-slate-900 flex-shrink-0 border border-white/10">
                            <img
                              src={project.image_url || project.image}
                              alt={project.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "https://placehold.co/600x400/0f172a/cbd5e1?text=Preview";
                              }}
                            />
                          </div>

                          <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/5 border border-white/10 text-cyan-300">
                                {project.category}
                              </span>
                              {project.featured && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-500/20 text-purple-300">
                                  ★ Featured
                                </span>
                              )}
                            </div>
                            <h3 className="text-sm font-bold text-white truncate">{project.title}</h3>
                            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                              {project.short_desc || project.shortDescription || project.description}
                            </p>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs">
                            <button
                              onClick={() => handleToggleFeatured(project)}
                              className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                                project.featured
                                  ? "border-purple-500/40 text-purple-300 bg-purple-500/10"
                                  : "border-white/10 text-slate-400 hover:text-white"
                              }`}
                            >
                              {project.featured ? "Featured on Home" : "Set as Featured"}
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleOpenEditProject(project)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 rounded-lg transition-colors"
                            >
                              {renderIcon(FaEdit, { size: 11 })}
                              <span>Edit In-Page</span>
                            </button>
                            <button
                              onClick={() => handleDeleteProject(project.id || project.project_id)}
                              className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
                            >
                              {renderIcon(FaTrash, { size: 12 })}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* MODE B: FULL IN-PAGE PROJECT STUDIO (BEAUTIFIED & WITH TECH SUGGESTIONS) */
                <div className="space-y-6">
                  {/* Editor Header Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
                    <div className="flex items-center gap-3.5">
                      <button
                        type="button"
                        onClick={() => setProjectViewMode("list")}
                        className="p-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 hover:text-white transition-colors"
                        title="Back to Projects List"
                      >
                        {renderIcon(FaArrowLeft, { size: 14 })}
                      </button>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 text-cyan-300">
                            {editingProjectId ? "PROJECT STUDIO • EDIT MODE" : "PROJECT STUDIO • NEW DRAFT"}
                          </span>
                          {editingProjectId && (
                            <span className="text-[11px] font-mono text-slate-500">
                              ID: {editingProjectId}
                            </span>
                          )}
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                          {editingProjectId ? (projectForm.title || "Edit Project Details") : "Create New Project"}
                        </h2>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Fine-tune project identity, technologies, narrative, and deliverables with live preview.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => setProjectViewMode("list")}
                        className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={projectSaving}
                        onClick={() => handleSaveProject()}
                        className="inline-flex items-center gap-2 px-6 py-2 text-xs font-bold text-white rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:opacity-95 shadow-lg shadow-purple-500/25 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
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
                    <div className="p-3 text-xs text-cyan-300 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center gap-2">
                      {renderIcon(FaSpinner, { className: "animate-spin", size: 12 })}
                      <span>{uploadStatus}</span>
                    </div>
                  )}

                  {renderStorageRlsBanner()}

                  {/* 2-Column Studio Grid: Left Form (7 cols), Right Sticky Live Preview (5 cols) */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left: Input Form (7 cols) */}
                    <form onSubmit={handleSaveProject} className="lg:col-span-7 space-y-6 text-xs">
                      
                      {/* CARD 1: Core Identity & Category */}
                      <div className="p-5 sm:p-6 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-sm space-y-5 shadow-xl">
                        <div className="flex items-center justify-between pb-3 border-b border-white/10">
                          <div className="flex items-center gap-2.5">
                            <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
                              1
                            </span>
                            <h3 className="text-sm font-bold text-white tracking-wide uppercase font-mono">
                              Project Identity &amp; Category
                            </h3>
                          </div>
                          <span className="text-[11px] text-slate-500">Core Metadata</span>
                        </div>

                        {/* Title */}
                        <div>
                          <label className="block font-semibold text-slate-200 mb-1.5">
                            Project Title <span className="text-rose-400">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={projectForm.title}
                            onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                            placeholder="e.g. AI Financial Forecaster & Risk Analysis SaaS"
                            className="w-full px-4 py-2.5 text-sm text-white bg-slate-950/70 border border-white/15 rounded-xl focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all font-medium"
                          />
                        </div>

                        {/* Visual Category Selector */}
                        <div>
                          <label className="block font-semibold text-slate-200 mb-2">
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
                                      ? cat.borderActive + " shadow-md"
                                      : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20"
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
                        <div className="p-3.5 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors flex items-center justify-between cursor-pointer" onClick={() => setProjectForm({ ...projectForm, featured: !projectForm.featured })}>
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${projectForm.featured ? "bg-amber-400/20 text-amber-300 border border-amber-400/30" : "bg-white/5 text-slate-400"}`}>
                              {renderIcon(FaStar, { size: 14 })}
                            </div>
                            <div>
                              <div className="font-bold text-white text-xs flex items-center gap-2">
                                <span>Feature on Portfolio Showcase</span>
                                {projectForm.featured && (
                                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                                    FEATURED
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                Displays prominently with a glowing badge on the homepage hero and top of the projects list.
                              </p>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={projectForm.featured}
                            onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                            onClick={(e) => e.stopPropagation()}
                            className="w-4 h-4 rounded text-purple-600 bg-white/10 border-white/20 focus:ring-0 cursor-pointer"
                          />
                        </div>
                      </div>

                      {/* CARD 2: Technology Stack Studio (THE KEY FEATURE) */}
                      <div className="p-5 sm:p-6 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-sm space-y-5 shadow-xl">
                        <div className="flex items-center justify-between pb-3 border-b border-white/10">
                          <div className="flex items-center gap-2.5">
                            <span className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs">
                              2
                            </span>
                            <div className="flex items-center gap-2">
                              {renderIcon(FaTags, { className: "text-purple-400", size: 13 })}
                              <h3 className="text-sm font-bold text-white tracking-wide uppercase font-mono">
                                Technology Stack Studio
                              </h3>
                            </div>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
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

                          <div className="min-h-[52px] p-3 rounded-xl border border-white/15 bg-slate-950/80 flex flex-wrap items-center gap-2">
                            {getSelectedTechs(projectForm.technologies).length === 0 ? (
                              <p className="text-xs text-slate-500 italic flex items-center gap-2">
                                {renderIcon(FaLightbulb, { size: 12 })}
                                <span>No technologies added yet. Click suggestions below, use 1-click presets, or type your own!</span>
                              </p>
                            ) : (
                              getSelectedTechs(projectForm.technologies).map((tag) => (
                                <span
                                  key={tag}
                                  className="group inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 shadow-sm shadow-cyan-500/10 hover:border-cyan-400 transition-all"
                                >
                                  <span>{tag}</span>
                                  <button
                                    type="button"
                                    onClick={() => removeTechTag(tag)}
                                    className="p-0.5 rounded hover:bg-rose-500/20 text-cyan-400 hover:text-rose-400 transition-colors"
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
                          <label className="block font-semibold text-slate-200">
                            Add Custom Technology Tag:
                          </label>
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <input
                                type="text"
                                value={customTechInput}
                                onChange={(e) => setCustomTechInput(e.target.value)}
                                onKeyDown={handleCustomTechKeyDown}
                                placeholder="Type any technology and press Enter or comma (e.g. GraphQL, Tailwind, Redis, FastAPI)..."
                                className="w-full pl-9 pr-3.5 py-2 text-xs text-white bg-slate-950/70 border border-white/15 rounded-xl focus:outline-none focus:border-cyan-400 transition-all"
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
                              className="px-4 py-2 text-xs font-bold text-white rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 transition-all active:scale-95"
                            >
                              + Add Tag
                            </button>
                          </div>
                        </div>

                        {/* 1-Click Popular Stack Presets */}
                        <div className="p-3.5 rounded-xl border border-white/10 bg-white/[0.02] space-y-2.5">
                          <div className="flex items-center gap-2 text-xs font-semibold text-purple-300">
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
                        <div className="space-y-3 pt-2 border-t border-white/10">
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
                                className="w-full pl-7 pr-3 py-1 text-[11px] text-white bg-slate-950/70 border border-white/10 rounded-lg focus:outline-none focus:border-cyan-400"
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
                                    ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-semibold"
                                    : "bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:text-slate-200"
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
                                      ? "bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-sm shadow-cyan-500/25 ring-1 ring-cyan-400/30"
                                      : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/15 hover:border-cyan-500/30 hover:text-white"
                                  }`}
                                  title={isAlreadySelected ? `Remove ${item.name}` : `Add ${item.name}`}
                                >
                                  {isAlreadySelected ? (
                                    renderIcon(FaCheck, { size: 10, className: "text-cyan-400" })
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
                      <div className="p-5 sm:p-6 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-sm space-y-5 shadow-xl">
                        <div className="flex items-center justify-between pb-3 border-b border-white/10">
                          <div className="flex items-center gap-2.5">
                            <span className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                              3
                            </span>
                            <h3 className="text-sm font-bold text-white tracking-wide uppercase font-mono">
                              Project Narrative &amp; Breakdown
                            </h3>
                          </div>
                          <span className="text-[11px] text-slate-500">Descriptions</span>
                        </div>

                        {/* Short Description */}
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="font-semibold text-slate-200">
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
                            className="w-full px-4 py-2.5 text-xs text-white bg-slate-950/70 border border-white/15 rounded-xl focus:outline-none focus:border-cyan-400 transition-all"
                          />
                        </div>

                        {/* Full Detailed Description */}
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="font-semibold text-slate-200">
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
                            className="w-full px-4 py-2.5 text-xs text-white bg-slate-950/70 border border-white/15 rounded-xl focus:outline-none focus:border-cyan-400 transition-all font-sans leading-relaxed"
                          />
                        </div>
                      </div>

                      {/* CARD 4: Key Deliverables & Architecture Features */}
                      <div className="p-5 sm:p-6 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-sm space-y-4 shadow-xl">
                        <div className="flex items-center justify-between pb-3 border-b border-white/10">
                          <div className="flex items-center gap-2.5">
                            <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                              4
                            </span>
                            <div className="flex items-center gap-2">
                              {renderIcon(FaListUl, { className: "text-emerald-400", size: 12 })}
                              <h3 className="text-sm font-bold text-white tracking-wide uppercase font-mono">
                                Key Deliverables &amp; Features
                              </h3>
                            </div>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                            {projectForm.features.split("\n").filter((f) => f.trim()).length} Features
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-400">
                          Enter one feature per line. These will render as bullet points with checkmark icons on the project detail modal.
                        </p>

                        <textarea
                          rows={4}
                          value={projectForm.features}
                          onChange={(e) => setProjectForm({ ...projectForm, features: e.target.value })}
                          placeholder="JWT Authentication &amp; Role-based Permissions&#10;Stripe Payment Gateway Integration&#10;Real-time Telemetry WebSocket Stream&#10;Automated CI/CD Pipeline with Docker"
                          className="w-full px-4 py-2.5 text-xs text-white bg-slate-950/70 border border-white/15 rounded-xl focus:outline-none focus:border-cyan-400 transition-all font-mono leading-relaxed"
                        />
                      </div>

                      {/* CARD 5: Media & Deployment URLs */}
                      <div className="p-5 sm:p-6 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-sm space-y-5 shadow-xl">
                        <div className="flex items-center justify-between pb-3 border-b border-white/10">
                          <div className="flex items-center gap-2.5">
                            <span className="w-6 h-6 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold text-xs">
                              5
                            </span>
                            <h3 className="text-sm font-bold text-white tracking-wide uppercase font-mono">
                              Media Assets &amp; Production Links
                            </h3>
                          </div>
                          <span className="text-[11px] text-slate-500">Assets &amp; URLs</span>
                        </div>

                        {/* Project Image */}
                        <div className="space-y-2.5">
                          <label className="block font-semibold text-slate-200">
                            Project Cover Image URL
                          </label>
                          <input
                            type="text"
                            value={projectForm.image_url}
                            onChange={(e) => setProjectForm({ ...projectForm, image_url: e.target.value })}
                            placeholder="https://images.unsplash.com/... or pick preset below"
                            className="w-full px-4 py-2 text-xs text-white bg-slate-950/70 border border-white/15 rounded-xl focus:outline-none focus:border-cyan-400 transition-all"
                          />

                          {/* Quick 1-click Preset Cover Images */}
                          <div className="p-3 rounded-xl border border-white/10 bg-white/[0.02] space-y-2">
                            <span className="text-[11px] font-semibold text-slate-400">
                              Quick Preset Cover Images (Click to apply):
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {PRESET_COVERS.map((cov) => (
                                <button
                                  key={cov.name}
                                  type="button"
                                  onClick={() => setProjectForm({ ...projectForm, image_url: cov.url })}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-lg bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-400/40 text-slate-300 hover:text-cyan-300 transition-all cursor-pointer"
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
                                className="text-[11px] text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:bg-white/10 file:text-white hover:file:bg-white/20 cursor-pointer"
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
                            <label className="block font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
                              {renderIcon(FaGithub, { size: 12 })}
                              <span>GitHub Repository URL</span>
                            </label>
                            <input
                              type="text"
                              value={projectForm.github_url}
                              onChange={(e) => setProjectForm({ ...projectForm, github_url: e.target.value })}
                              placeholder="https://github.com/your-username/repo"
                              className="w-full px-3.5 py-2 text-xs text-white bg-slate-950/70 border border-white/15 rounded-xl focus:outline-none focus:border-cyan-400 transition-all"
                            />
                          </div>

                          <div>
                            <label className="block font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
                              {renderIcon(FaGlobe, { size: 12 })}
                              <span>Live Deployment / Demo URL</span>
                            </label>
                            <input
                              type="text"
                              value={projectForm.live_url}
                              onChange={(e) => setProjectForm({ ...projectForm, live_url: e.target.value })}
                              placeholder="https://my-app.vercel.app"
                              className="w-full px-3.5 py-2 text-xs text-white bg-slate-950/70 border border-white/15 rounded-xl focus:outline-none focus:border-cyan-400 transition-all"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Bottom Save & Cancel Bar */}
                      <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                        <button
                          type="button"
                          onClick={() => setProjectViewMode("list")}
                          className="px-5 py-2.5 text-xs font-semibold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={projectSaving}
                          className="inline-flex items-center gap-2 px-7 py-2.5 text-xs font-bold text-white rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:opacity-95 shadow-lg shadow-purple-500/25 active:scale-95 transition-all cursor-pointer"
                        >
                          {projectSaving ? renderIcon(FaSpinner, { className: "animate-spin", size: 13 }) : renderIcon(FaSave, { size: 13 })}
                          <span>{projectSaving ? "Saving..." : "Save Project to Supabase"}</span>
                        </button>
                      </div>
                    </form>

                    {/* Right: Live Interactive Card Preview (5 cols, sticky) */}
                    <div className="lg:col-span-5 sticky top-24 space-y-4">
                      {/* Preview Studio Header & View Switcher */}
                      <div className="p-3.5 rounded-2xl border border-white/10 bg-slate-900/70 backdrop-blur-sm flex items-center justify-between shadow-xl">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                            Live Studio Preview
                          </span>
                        </div>
                        <div className="flex items-center p-0.5 rounded-xl bg-slate-950 border border-white/10 text-[11px]">
                          <button
                            type="button"
                            onClick={() => setStudioPreviewTab("card")}
                            className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                              studioPreviewTab === "card"
                                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
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
                                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                                : "text-slate-400 hover:text-white"
                            }`}
                          >
                            Case Study
                          </button>
                        </div>
                      </div>

                      {/* PREVIEW TAB 1: Grid Card View (Portfolio Home Card) */}
                      {studioPreviewTab === "card" && (
                        <div className="rounded-3xl border border-white/15 bg-gradient-to-b from-slate-900/95 to-slate-950 p-5 shadow-2xl space-y-4 relative overflow-hidden group">
                          {/* Ambient Glow */}
                          <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl -z-0 pointer-events-none" />

                          {/* Image preview */}
                          <div className="aspect-video rounded-2xl overflow-hidden bg-slate-950 relative border border-white/10 shadow-inner">
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
                              <span className="px-2.5 py-1 text-[10px] font-semibold rounded-lg bg-slate-950/80 backdrop-blur-md border border-white/15 text-cyan-300 capitalize">
                                {PROJECT_CATEGORIES.find((c) => c.id === projectForm.category)?.name || projectForm.category}
                              </span>
                            </div>
                          </div>

                          {/* Title & Short Description */}
                          <div className="space-y-1.5">
                            <h3 className="text-lg font-bold text-white tracking-tight">
                              {projectForm.title || "Your Project Title Will Appear Here"}
                            </h3>
                            <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                              {projectForm.short_desc || "Your short project overview summary will appear right here..."}
                            </p>
                          </div>

                          {/* Technologies preview chips */}
                          <div className="pt-3 border-t border-white/10 space-y-1.5">
                            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                              Tech Stack ({getSelectedTechs(projectForm.technologies).length})
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {getSelectedTechs(projectForm.technologies).length > 0 ? (
                                getSelectedTechs(projectForm.technologies).slice(0, 6).map((tech, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300"
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
                                <span className="px-2 py-1 rounded-lg text-[10px] font-semibold bg-white/5 border border-white/10 text-slate-400">
                                  +{getSelectedTechs(projectForm.technologies).length - 6} more
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Action links buttons */}
                          <div className="flex items-center gap-2 pt-2">
                            <div className="flex-1 py-2 text-center text-xs font-semibold rounded-xl bg-white/10 border border-white/10 text-white flex items-center justify-center gap-2 opacity-90">
                              {renderIcon(FaExternalLinkAlt, { size: 10 })}
                              <span>Live Preview</span>
                            </div>
                            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 flex items-center justify-center opacity-90">
                              {renderIcon(FaGithub, { size: 14 })}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* PREVIEW TAB 2: Full Case Study Modal Preview */}
                      {studioPreviewTab === "casestudy" && (
                        <div className="rounded-3xl border border-white/15 bg-gradient-to-b from-slate-900 to-slate-950 p-5 shadow-2xl space-y-4 max-h-[580px] overflow-y-auto">
                          <div className="flex items-center justify-between pb-2 border-b border-white/10">
                            <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase">
                              Case Study Detailed Preview
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/10 text-slate-300 capitalize">
                              {projectForm.category}
                            </span>
                          </div>

                          <h3 className="text-xl font-black text-white">
                            {projectForm.title || "Untitled Project"}
                          </h3>

                          {/* Case Study Image */}
                          <div className="aspect-video rounded-xl overflow-hidden bg-slate-950 relative border border-white/10">
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
                            <div className="space-y-2 pt-2 border-t border-white/10">
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
                          <div className="space-y-2 pt-2 border-t border-white/10">
                            <h4 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wide">
                              Technologies &amp; Tools Used
                            </h4>
                            <div className="flex flex-wrap gap-1.5">
                              {getSelectedTechs(projectForm.technologies).map((t, i) => (
                                <span key={i} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Publication Health Checklist Card */}
                      <div className="p-4 rounded-2xl border border-white/10 bg-slate-900/70 space-y-2.5 text-xs shadow-xl">
                        <span className="font-mono uppercase font-bold text-slate-400 text-[11px]">
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
                            <span className={getSelectedTechs(projectForm.technologies).length > 0 ? "text-cyan-400 font-bold" : "text-slate-600"}>
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
          {/* VIEW 3: PROFILE & BIO SETTINGS (FULL IN-PAGE) */}
          {/* ============================================================== */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Profile &amp; Biography Settings</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Customize your name, professional title, bio narrative, and contact channels
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  disabled={profileSaving}
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 shadow-md shadow-purple-500/25 active:scale-95 transition-all"
                >
                  {renderIcon(FaSave, { size: 12 })}
                  <span>{profileSaving ? "Saving..." : "Save Profile"}</span>
                </button>
              </div>

              {profileMessage && (
                <div className="p-3 text-xs text-emerald-300 border rounded-xl bg-emerald-500/10 border-emerald-500/30 flex items-center gap-2">
                  {renderIcon(FaCheckCircle, { size: 14 })}
                  <span>{profileMessage}</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-6 text-xs">
                {/* Basic Personal Info */}
                <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] space-y-4">
                  <h3 className="text-sm font-bold text-white mb-2">Personal Identity</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Full Legal Name</label>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm text-white bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Display Short Name</label>
                      <input
                        type="text"
                        value={profileForm.short_name}
                        onChange={(e) => setProfileForm({ ...profileForm, short_name: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm text-white bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Professional Title / Role</label>
                    <input
                      type="text"
                      value={profileForm.title}
                      onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm text-white bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">About Me Story Narrative</label>
                    <textarea
                      rows={5}
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm text-white bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                {/* Metrics & Experience Counters */}
                <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] space-y-4">
                  <h3 className="text-sm font-bold text-white mb-2">Display Statistics</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Years Experience</label>
                      <input
                        type="text"
                        value={profileForm.years_experience}
                        onChange={(e) => setProfileForm({ ...profileForm, years_experience: e.target.value })}
                        className="w-full px-3.5 py-2 text-sm text-white bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Projects Completed</label>
                      <input
                        type="text"
                        value={profileForm.projects_completed}
                        onChange={(e) => setProfileForm({ ...profileForm, projects_completed: e.target.value })}
                        className="w-full px-3.5 py-2 text-sm text-white bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Satisfaction / Quality</label>
                      <input
                        type="text"
                        value={profileForm.satisfaction_rate}
                        onChange={(e) => setProfileForm({ ...profileForm, satisfaction_rate: e.target.value })}
                        className="w-full px-3.5 py-2 text-sm text-white bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Info & Socials */}
                <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] space-y-4">
                  <h3 className="text-sm font-bold text-white mb-2">Contact &amp; Social Links</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Email</label>
                      <input
                        type="text"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        className="w-full px-3.5 py-2 text-sm text-white bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Phone</label>
                      <input
                        type="text"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        className="w-full px-3.5 py-2 text-sm text-white bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Location</label>
                      <input
                        type="text"
                        value={profileForm.location}
                        onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                        className="w-full px-3.5 py-2 text-sm text-white bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">GitHub Profile URL</label>
                      <input
                        type="text"
                        value={profileForm.github}
                        onChange={(e) => setProfileForm({ ...profileForm, github: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs text-white bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">LinkedIn Profile URL</label>
                      <input
                        type="text"
                        value={profileForm.linkedin}
                        onChange={(e) => setProfileForm({ ...profileForm, linkedin: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs text-white bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Twitter / X URL</label>
                      <input
                        type="text"
                        value={profileForm.twitter}
                        onChange={(e) => setProfileForm({ ...profileForm, twitter: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs text-white bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={profileSaving}
                    className="px-6 py-2.5 text-xs font-semibold text-white rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 shadow-md transition-all"
                  >
                    {profileSaving ? "Saving..." : "Save All Profile Settings"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ============================================================== */}
          {/* VIEW 4: EDUCATION & CERTIFICATES (FULL IN-PAGE STUDIO) */}
          {/* ============================================================== */}
          {activeTab === "education" && (
            <div className="space-y-8">
              {/* Header Bar with Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
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
                    className="px-3.5 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
                    title="Restore default sample degrees and certifications"
                  >
                    Reset Defaults
                  </button>
                  <button
                    type="button"
                    onClick={handleOpenAddDegree}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white rounded-xl bg-cyan-600/80 hover:bg-cyan-500 border border-cyan-400/40 shadow-md shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer"
                  >
                    {renderIcon(FaPlus, { size: 10 })}
                    <span>+ Add Degree</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleOpenAddCert}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 border border-purple-400/40 shadow-md shadow-purple-500/20 active:scale-95 transition-all cursor-pointer"
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
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                      {renderIcon(FaGraduationCap, { size: 18 })}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white tracking-wide">
                        Academic Degree Programs
                      </h3>
                      <p className="text-[11px] text-slate-400">Formal engineering degrees and milestones</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                    {educationList.length} Degrees
                  </span>
                </div>

                {/* In-Page Add / Edit Degree Form */}
                {(isAddingEdu || editingEduIndex !== null) && (
                  <motion.form
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleSaveDegree}
                    className="p-5 sm:p-6 rounded-2xl border border-cyan-500/40 bg-slate-900/90 shadow-2xl space-y-4 text-xs"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <span className="font-bold text-sm text-cyan-300 font-mono uppercase tracking-wider">
                        {editingEduIndex !== null ? "Edit Academic Degree" : "Add New Academic Degree"}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingEdu(false);
                          setEditingEduIndex(null);
                        }}
                        className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        {renderIcon(FaTimes, { size: 14 })}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block font-semibold text-slate-200 mb-1">
                          Degree / Program Title <span className="text-rose-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={eduForm.degree}
                          onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
                          placeholder="e.g. B.Sc. in Computer Science & Engineering"
                          className="w-full px-3.5 py-2.5 text-xs text-white bg-slate-950/70 border border-white/15 rounded-xl focus:outline-none focus:border-cyan-400 font-medium"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-200 mb-1">
                          University / Institution <span className="text-rose-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={eduForm.institution}
                          onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
                          placeholder="e.g. Bangladesh University of Business and Technology (BUBT)"
                          className="w-full px-3.5 py-2.5 text-xs text-white bg-slate-950/70 border border-white/15 rounded-xl focus:outline-none focus:border-cyan-400 font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-200 mb-1">
                        Timeline / Period <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={eduForm.period}
                        onChange={(e) => setEduForm({ ...eduForm, period: e.target.value })}
                        placeholder="e.g. 2022 - Present or 2019 - 2021"
                        className="w-full px-3.5 py-2.5 text-xs text-white bg-slate-950/70 border border-white/15 rounded-xl focus:outline-none focus:border-cyan-400 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-200 mb-1">
                        Program Description &amp; Academic Focus
                      </label>
                      <textarea
                        rows={3}
                        value={eduForm.description}
                        onChange={(e) => setEduForm({ ...eduForm, description: e.target.value })}
                        placeholder="Core focus areas, analytical foundation, major coursework, or achievements..."
                        className="w-full px-3.5 py-2.5 text-xs text-white bg-slate-950/70 border border-white/15 rounded-xl focus:outline-none focus:border-cyan-400 leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-200 mb-1">
                        Key Highlights &amp; Honors (One per line)
                      </label>
                      <textarea
                        rows={3}
                        value={eduForm.highlights}
                        onChange={(e) => setEduForm({ ...eduForm, highlights: e.target.value })}
                        placeholder="Dean's List for Academic Performance&#10;BUBT IT Club Technical Contributor&#10;Winner of Regional Science Fair"
                        className="w-full px-3.5 py-2.5 text-xs text-white bg-slate-950/70 border border-white/15 rounded-xl focus:outline-none focus:border-cyan-400 font-mono leading-relaxed"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/10">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingEdu(false);
                          setEditingEduIndex(null);
                        }}
                        className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={eduSaving}
                        className="inline-flex items-center gap-2 px-6 py-2 text-xs font-bold text-white rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:opacity-95 shadow-lg shadow-cyan-500/25 active:scale-95 transition-all cursor-pointer"
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
                        className="p-5 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-sm space-y-3 shadow-lg hover:border-cyan-500/30 transition-all group"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                                {edu.degree}
                              </h4>
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-white/5 border border-white/10 text-cyan-300">
                                {edu.period}
                              </span>
                            </div>
                            <p className="text-xs font-medium text-purple-300 mt-0.5">{edu.institution}</p>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-auto">
                            <button
                              type="button"
                              onClick={() => handleOpenEditDegree(idx)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-white/10 hover:border-cyan-400/40 transition-all cursor-pointer"
                            >
                              {renderIcon(FaEdit, { size: 11 })}
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteDegree(idx)}
                              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 bg-white/5 hover:bg-rose-500/15 border border-white/10 hover:border-rose-500/30 transition-all cursor-pointer"
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
                          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/10">
                            {edu.highlights.map((hl: string, hIdx: number) => (
                              <span
                                key={hIdx}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] bg-white/5 border border-white/10 text-slate-300"
                              >
                                <span className="text-cyan-400">✓</span>
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
              <div className="space-y-4 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                      {renderIcon(FaCertificate, { size: 18 })}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white tracking-wide">
                        Certifications &amp; Verified Credentials
                      </h3>
                      <p className="text-[11px] text-slate-400">Technical certifications, conference papers &amp; awards</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/10 border border-purple-500/30 text-purple-300">
                    {certsList.length} Certifications
                  </span>
                </div>

                {/* In-Page Add / Edit Certificate Form */}
                {(isAddingCert || editingCertIndex !== null) && (
                  <motion.form
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleSaveCert}
                    className="p-5 sm:p-6 rounded-2xl border border-purple-500/40 bg-slate-900/90 shadow-2xl space-y-4 text-xs"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <span className="font-bold text-sm text-purple-300 font-mono uppercase tracking-wider">
                        {editingCertIndex !== null ? "Edit Certification Details" : "Add New Certification"}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingCert(false);
                          setEditingCertIndex(null);
                        }}
                        className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        {renderIcon(FaTimes, { size: 14 })}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block font-semibold text-slate-200 mb-1">
                          Certificate / Award Title <span className="text-rose-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={certForm.title}
                          onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                          placeholder="e.g. Full Stack Development with MERN"
                          className="w-full px-3.5 py-2.5 text-xs text-white bg-slate-950/70 border border-white/15 rounded-xl focus:outline-none focus:border-purple-400 font-medium"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-200 mb-1">
                          Issuing Organization <span className="text-rose-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={certForm.issuer}
                          onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                          placeholder="e.g. HackerRank, IEEE, Grameenphone Academy"
                          className="w-full px-3.5 py-2.5 text-xs text-white bg-slate-950/70 border border-white/15 rounded-xl focus:outline-none focus:border-purple-400 font-medium"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block font-semibold text-slate-200 mb-1">
                          Credential Type
                        </label>
                        <select
                          value={certForm.type}
                          onChange={(e) => setCertForm({ ...certForm, type: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-xs text-white bg-slate-950/70 border border-white/15 rounded-xl focus:outline-none focus:border-purple-400 font-medium"
                        >
                          <option value="Professional">Professional Certification</option>
                          <option value="Achievement">Achievement &amp; Award</option>
                          <option value="Conference">Conference &amp; Publication</option>
                          <option value="Academic">Academic Honor</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-200 mb-1">
                          Year Issued
                        </label>
                        <input
                          type="text"
                          value={certForm.year}
                          onChange={(e) => setCertForm({ ...certForm, year: e.target.value })}
                          placeholder="e.g. 2026"
                          className="w-full px-3.5 py-2.5 text-xs text-white bg-slate-950/70 border border-white/15 rounded-xl focus:outline-none focus:border-purple-400 font-medium"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block font-semibold text-slate-200 mb-1">
                          Verification / Credential URL
                        </label>
                        <input
                          type="text"
                          value={certForm.link}
                          onChange={(e) => setCertForm({ ...certForm, link: e.target.value })}
                          placeholder="https://www.hackerrank.com/certificates/..."
                          className="w-full px-3.5 py-2.5 text-xs text-white bg-slate-950/70 border border-white/15 rounded-xl focus:outline-none focus:border-purple-400 font-medium"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-200 mb-1">
                          Verification ID / License Number
                        </label>
                        <input
                          type="text"
                          value={certForm.verificationId}
                          onChange={(e) => setCertForm({ ...certForm, verificationId: e.target.value })}
                          placeholder="e.g. 42cafa841d01"
                          className="w-full px-3.5 py-2.5 text-xs text-white bg-slate-950/70 border border-white/15 rounded-xl focus:outline-none focus:border-purple-400 font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-200 mb-1">
                        Details &amp; Competencies Covered
                      </label>
                      <textarea
                        rows={2}
                        value={certForm.details}
                        onChange={(e) => setCertForm({ ...certForm, details: e.target.value })}
                        placeholder="Key skills assessed, algorithms, full-stack architecture, or contribution details..."
                        className="w-full px-3.5 py-2.5 text-xs text-white bg-slate-950/70 border border-white/15 rounded-xl focus:outline-none focus:border-purple-400 leading-relaxed"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/10">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingCert(false);
                          setEditingCertIndex(null);
                        }}
                        className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={eduSaving}
                        className="inline-flex items-center gap-2 px-6 py-2 text-xs font-bold text-white rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-95 shadow-lg shadow-purple-500/25 active:scale-95 transition-all cursor-pointer"
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
                        className="p-5 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-sm space-y-2.5 shadow-lg hover:border-purple-500/30 transition-all flex flex-col justify-between group"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                              {cert.type}
                            </span>
                            <span className="text-xs text-slate-400 font-mono font-semibold">{cert.year}</span>
                          </div>

                          <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                            {cert.title}
                          </h4>
                          <p className="text-xs text-cyan-300 font-medium">{cert.issuer}</p>

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

                        <div className="flex items-center justify-between pt-3 border-t border-white/10">
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
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-white/5 hover:bg-purple-500/20 text-slate-300 hover:text-purple-300 border border-white/10 hover:border-purple-400/40 transition-all cursor-pointer"
                            >
                              {renderIcon(FaEdit, { size: 10 })}
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCert(idx)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 bg-white/5 hover:bg-rose-500/15 border border-white/10 hover:border-rose-500/30 transition-all cursor-pointer"
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
              <div className="pb-4 border-b border-white/10">
                <h2 className="text-xl font-bold text-white">Resume &amp; Asset Cloud Storage</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Direct upload and management of your resume PDF and portfolio media
                </p>
              </div>

              {uploadStatus && (
                <div className="p-3 text-xs text-cyan-300 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                  {uploadStatus}
                </div>
              )}

              {renderStorageRlsBanner()}

              {/* Current Resume Info Card */}
              <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-3.5 rounded-2xl bg-pink-500/20 text-pink-400">
                    {renderIcon(FaFilePdf, { size: 28 })}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Currently Active Resume</h3>
                    <p className="text-xs text-slate-400 font-mono break-all mt-0.5">
                      {profileForm.resume_url || "/PDF/Maharab_Hosen.pdf"}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-300">
                      Live Resume / CV File URL:
                    </label>
                    {resumeSavedToast && (
                      <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                        {renderIcon(FaCheckCircle, { size: 12 })}
                        <span>Live CV URL Updated &amp; Saved!</span>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={profileForm.resume_url}
                      onChange={(e) => setProfileForm({ ...profileForm, resume_url: e.target.value })}
                      placeholder="https://..."
                      className="flex-1 px-3.5 py-2.5 text-xs text-white bg-slate-950/80 border border-white/15 rounded-xl focus:outline-none focus:border-cyan-400 font-mono transition-all"
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
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-xs font-bold text-white transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer shrink-0"
                    >
                      {resumeManualSaving ? "Saving..." : "Save & Activate"}
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-white/10">
                  <a
                    href={profileForm.resume_url || "/PDF/Maharab_Hosen.pdf"}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
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
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    {renderIcon(resumeCopied ? FaCheck : FaCopy, { size: 10 })}
                    <span>{resumeCopied ? "Copied!" : "Copy URL"}</span>
                  </button>
                </div>
              </div>

              {/* Direct In-Page File Upload Card */}
              <div className="p-6 rounded-2xl border border-dashed border-white/20 bg-white/[0.01] space-y-3 text-center">
                <div className="p-3 w-fit mx-auto rounded-xl bg-purple-500/10 text-purple-400">
                  {renderIcon(FaFilePdf, { size: 24 })}
                </div>
                <h3 className="text-sm font-bold text-white">Upload Updated Resume PDF</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto font-light">
                  Select a new PDF from your computer. It will automatically upload to Supabase Storage and become your live active resume.
                </p>

                <div className="pt-2">
                  <label className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-xs font-semibold text-white shadow-lg cursor-pointer hover:opacity-90 active:scale-95 transition-all">
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
              <div className="pb-4 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Contact Inquiries</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Messages submitted directly by recruiters and clients via your Contact form
                  </p>
                </div>
                <button
                  onClick={fetchMessages}
                  className="px-3 py-1.5 text-xs rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 transition-colors"
                >
                  Refresh Inbox
                </button>
              </div>

              {messagesList.length === 0 ? (
                <div className="p-12 text-center rounded-2xl border border-white/10 bg-white/[0.02] text-slate-400 text-xs">
                  No incoming messages found. Form submissions will automatically appear here.
                </div>
              ) : (
                /* Split Inbox Layout: Messages List on Left, Selected Message Reader on Right */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Messages List (5 cols) */}
                  <div className="lg:col-span-5 space-y-2 max-h-[600px] overflow-y-auto pr-1">
                    {messagesList.map((msg) => {
                      const isSelected = selectedMessage?.id === msg.id;
                      return (
                        <div
                          key={msg.id}
                          onClick={() => setSelectedMessage(msg)}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                            isSelected
                              ? "border-cyan-500/50 bg-cyan-500/10 text-white shadow-md"
                              : "border-white/5 bg-white/[0.02] text-slate-300 hover:border-white/15"
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs font-bold">
                            <span className="truncate">{msg.name}</span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {new Date(msg.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">{msg.email}</p>
                          <p className="text-xs text-slate-300 truncate mt-1 font-medium">
                            {msg.subject || "(No Subject)"}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Selected Message Viewer (7 cols) */}
                  <div className="lg:col-span-7 p-6 rounded-2xl border border-white/10 bg-white/[0.02] space-y-4">
                    {selectedMessage ? (
                      <div className="space-y-4 text-xs">
                        <div className="flex items-center justify-between pb-3 border-b border-white/10">
                          <div>
                            <h3 className="text-base font-bold text-white">{selectedMessage.name}</h3>
                            <a
                              href={`mailto:${selectedMessage.email}`}
                              className="text-cyan-400 hover:underline text-xs"
                            >
                              {selectedMessage.email}
                            </a>
                          </div>

                          <div className="flex items-center gap-2">
                            <a
                              href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject || "Your Portfolio Inquiry")}`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-semibold transition-colors"
                            >
                              {renderIcon(FaReply, { size: 10 })}
                              <span>Reply Email</span>
                            </a>
                            <button
                              onClick={() => handleDeleteMessage(selectedMessage.id)}
                              className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
                            >
                              {renderIcon(FaTrash, { size: 12 })}
                            </button>
                          </div>
                        </div>

                        <div>
                          <span className="text-slate-500 text-[10px] uppercase font-mono">Subject</span>
                          <p className="text-sm font-bold text-white mt-0.5">
                            {selectedMessage.subject || "General Inquiry"}
                          </p>
                        </div>

                        <div>
                          <span className="text-slate-500 text-[10px] uppercase font-mono">Message Content</span>
                          <div className="mt-1 p-4 rounded-xl bg-black/40 border border-white/5 text-slate-200 text-xs leading-relaxed whitespace-pre-wrap">
                            {selectedMessage.message}
                          </div>
                        </div>

                        <p className="text-[10px] text-slate-500 font-mono pt-2">
                          Received: {new Date(selectedMessage.created_at).toLocaleString()}
                        </p>
                      </div>
                    ) : (
                      <div className="p-8 text-center text-slate-500 text-xs">
                        Select a message from the list to read it.
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
              <div className="pb-4 border-b border-white/10">
                <h2 className="text-xl font-bold text-white">Supabase Setup &amp; Live SQL Schema</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Verify your connection and run table schemas in 1 click
                </p>
              </div>

              {/* Status Indicator */}
              <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.02] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Connection Active</h4>
                    <p className="text-xs text-slate-400 font-mono">
                      https://zcmeryxyifkxbxkmgvfe.supabase.co
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Ready
                </span>
              </div>

              {/* Quick Fix for RLS Write Permissions */}
              <div className="p-6 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-4">
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

-- 2. Allow public uploads & access to 'portfolio-assets' bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio-assets', 'portfolio-assets', true) ON CONFLICT (id) DO UPDATE SET public = true;
CREATE POLICY "Allow public all on portfolio-assets" ON storage.objects FOR ALL TO public USING (bucket_id = 'portfolio-assets') WITH CHECK (bucket_id = 'portfolio-assets');`;
                      navigator.clipboard.writeText(fullRlsSql);
                      setDatabaseFixCopied(true);
                      setTimeout(() => setDatabaseFixCopied(false), 2500);
                    }}
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-2 transition-all shadow-md shadow-amber-500/20 active:scale-95 cursor-pointer"
                  >
                    {renderIcon(databaseFixCopied ? FaCheck : FaCopy, { size: 12 })}
                    <span>{databaseFixCopied ? "Copied to Clipboard!" : "Copy Full RLS Fix SQL"}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  If editing says <code className="text-amber-300 bg-black/40 px-1 py-0.5 rounded font-mono">RLS error</code> or file uploading says <code className="text-amber-300 bg-black/40 px-1 py-0.5 rounded font-mono">new row violates row-level security policy</code>, simply copy and run this script in your <strong className="text-cyan-300">Supabase SQL Editor</strong>:
                </p>
                <pre className="p-3.5 rounded-xl bg-black/70 border border-white/10 text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed">
{`-- 1. Disable RLS on all tables
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_info DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.education DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates DISABLE ROW LEVEL SECURITY;

-- 2. Allow public uploads to 'portfolio-assets' bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio-assets', 'portfolio-assets', true) ON CONFLICT (id) DO UPDATE SET public = true;
CREATE POLICY "Allow public all on portfolio-assets" ON storage.objects FOR ALL TO public USING (bucket_id = 'portfolio-assets') WITH CHECK (bucket_id = 'portfolio-assets');`}
                </pre>
              </div>

              {/* Step by Step SQL Instructions */}
              <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] space-y-4 text-xs leading-relaxed text-slate-300">
                <h3 className="text-sm font-bold text-white">How to initialize your tables in Supabase:</h3>
                <ol className="list-decimal pl-5 space-y-2 text-slate-400">
                  <li>
                    Open your project root file: <code className="text-cyan-400">supabase_schema.sql</code>.
                  </li>
                  <li>
                    Go to your <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-purple-400 underline">Supabase Dashboard</a> ➔ <strong>SQL Editor</strong>.
                  </li>
                  <li>
                    Paste all the code from <code className="text-cyan-400">supabase_schema.sql</code> and click <strong>Run</strong>.
                  </li>
                  <li>
                    In Supabase Dashboard, go to <strong>Storage ➔ New Bucket</strong>, name it: <code className="text-pink-400 font-bold">portfolio-assets</code>, and toggle <strong>Public Bucket: ON</strong>.
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
