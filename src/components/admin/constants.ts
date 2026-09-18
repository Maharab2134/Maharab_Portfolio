import {
  FaGlobe,
  FaMobileAlt,
  FaBrain,
  FaMicrochip,
  FaLayerGroup,
  FaMagic,
} from "react-icons/fa";
import {
  ProjectCategoryDef,
  TechSuggestion,
  StackPreset,
  PresetCover,
} from "./types";

export const isDevLoginEnabled =
  String(process.env.REACT_APP_ENABLE_DEV_LOGIN || "").trim().toLowerCase() === "true" ||
  String(process.env.REACT_APP_ALLOW_DEV_BYPASS || "").trim().toLowerCase() === "true";

export const PROJECT_CATEGORIES: ProjectCategoryDef[] = [
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

export const TECH_SUGGESTIONS: TechSuggestion[] = [
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
  { name: "Cloudflare", category: "db_cloud", popular: true },

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

  // Tools & DevOps
  { name: "VS Code", category: "tools", popular: true },
  { name: "Git", category: "tools", popular: true },
  { name: "GitHub", category: "tools", popular: true },
  { name: "Postman", category: "tools", popular: true },
  { name: "Figma", category: "tools", popular: true },
  { name: "Linux", category: "tools", popular: true },
  { name: "Vim", category: "tools" },
  { name: "NPM", category: "tools" },
  { name: "Bun", category: "tools" },
];

export const STACK_PRESETS: StackPreset[] = [
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

export const PRESET_COVERS: PresetCover[] = [
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
