export interface EducationItem {
  degree: string;
  institution: string;
  period: string;
  description: string;
  highlights: string[];
}

export interface CertificateItem {
  title: string;
  issuer: string;
  year: string;
  type: "Professional" | "Achievement" | "Conference";
  link: string;
  details: string;
  verificationId?: string;
}

export interface MilestoneItem {
  year: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  gradient: string;
}

export const PORTFOLIO_INFO = {
  name: "Md. Maharab Hosen",
  shortName: "Md. Maharab",
  initials: "MH",
  title: "Full Stack Software Engineer & Mobile Developer",
  tagline: "I build robust, high-performance web applications and mobile experiences.",
  typewriterPrefix: "I engineer",
  typewriterPhrases: [
    "Scalable Full-Stack Web Apps",
    "Cross-Platform Mobile Experiences",
    "High-Throughput REST & GraphQL APIs",
    "Secure Microservices Architecture",
  ],
  bio: "Passionate Software Engineering student at Bangladesh University of Business and Technology (BUBT). I bridge technical rigor with modern user experience, engineering scalable systems across React, Next.js, Node.js, Flutter, and cloud ecosystems.",
  footerBio: "Full-Stack Software Engineer & Mobile Developer dedicated to creating scalable, resilient digital experiences with thoughtful design.",
  email: "maharab442@gmail.com",
  phone: "+880 15862 82609",
  whatsappNumber: "8801586282609",
  whatsappUrl: "https://wa.me/8801586282609",
  location: "Rupnagar, Mirpur 2, Dhaka",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Rupnagar,+Mirpur+2,+Dhaka,+Bangladesh",
  resumeUrl:
    "https://zcmeryxyifkxbxkmgvfe.supabase.co/storage/v1/object/public/portfolio-assets/resumes/1789151663633_9bxyr9.pdf",
  introVideoId: "1BzSWgFEBgruUq-3wkTWfEiip3Rzxr-Pm",
  showIntroVideo: true,
  introVideoUrl: "https://drive.google.com/file/d/1BzSWgFEBgruUq-3wkTWfEiip3Rzxr-Pm/preview",
  profileImage: "/images/img.jpg",
  stats: {
    yearsExperience: "2+",
    projectsCompleted: "50+",
    techStacks: "12+",
    satisfactionRate: "100%",
  },
  socials: {
    github: "https://github.com/Maharab2134",
    linkedin: "https://www.linkedin.com/in/md-maharab-hosen-679a70253/",
    twitter: "https://x.com/Mahar22234",
  },
};

export const EDUCATION_DATA: EducationItem[] = [
  {
    degree: "B.Sc. in Computer Science & Engineering",
    institution: "Bangladesh University of Business and Technology (BUBT)",
    period: "2022 - Present",
    description:
      "Focusing on Software Engineering, Data Structures, Algorithms, Database Management, and Distributed Systems. Active participant in coding hackathons and technical community events.",
    highlights: [
      "Dean's List for Academic Performance",
      "BUBT IT Club Active Member & Technical Contributor",
      "Core coursework in Object-Oriented Programming, System Design, and Web Architectures",
    ],
  },
  {
    degree: "Higher Secondary Certificate (HSC) — Science",
    institution: "Bangla Bazar Fatema Khanam Degree College",
    period: "2019 - 2021",
    description:
      "Completed higher secondary education in the Science stream with distinction in Mathematics, Physics, and ICT.",
    highlights: [
      "Graduated with excellent GPA in Science division",
      "Member of Regional Science and Tech Club",
    ],
  },
  {
    degree: "Secondary School Certificate (SSC) — Science",
    institution: "Bhola Residential Cadet School & College",
    period: "2017 - 2018",
    description:
      "Built strong foundation in analytical thinking, mathematics, physics, and introductory computer logic.",
    highlights: [
      "Graduated with outstanding academic results",
      "Award winner in regional science and mathematics fairs",
    ],
  },
];

export const CERTIFICATES_DATA: CertificateItem[] = [
  {
    title: "Software Engineer Certificate",
    issuer: "HackerRank",
    year: "2026",
    type: "Professional",
    link: "https://www.hackerrank.com/certificates/42cafa841d01",
    details:
      "Verified competency in core software engineering, data structures, algorithms, problem solving, and production code quality.",
    verificationId: "42cafa841d01",
  },
  {
    title: "Full Stack Development with MERN",
    issuer: "Grameenphone Academy (CodersTrust)",
    year: "2026",
    type: "Professional",
    link: "https://www.grameenphone.academy/cert/456df50c843d",
    details:
      "Advanced certification in full-stack architecture with React, Node.js, Express, MongoDB, REST APIs, and modern deployment pipelines.",
    verificationId: "456df50c843d",
  },
  {
    title: "Certificate of Excellence — ICRCS 2024",
    issuer: "IEEE Computer Society Bangladesh Chapter",
    year: "2024",
    type: "Achievement",
    link: "https://drive.google.com/file/d/1x6UY3glacBcsp0fgFOH_kOof9YdhWDQQ/view?usp=drive_link",
    details:
      "Recognized for outstanding contribution and ambassadorship at the International Congress on Recent Trends in Computer Science (ICRCS 2024).",
  },
  {
    title: "Artificial Intelligence & Machine Learning Fundamentals",
    issuer: "Grameenphone Academy",
    year: "2024",
    type: "Professional",
    link: "https://drive.google.com/file/d/1z52WFHONp3pVKT2DnowztTDGY_LjDPiM/view?usp=drive_link",
    details:
      "Foundational program covering machine learning workflows, supervised/unsupervised algorithms, neural networks, and model evaluation.",
  },
  {
    title: "Recent Trends in Computer Science (ICRCS 2023)",
    issuer: "IEEE Computer Society Bangladesh Chapter",
    year: "2023",
    type: "Conference",
    link: "https://drive.google.com/file/d/1kb2uFVh9hzzgSbDjMfQa2PMjBpPQgIwX/view?usp=sharing",
    details:
      "Active participant in technical paper sessions, emerging AI architectures, and distributed systems discussions.",
  },
  {
    title: "BUBT Intra University Programming Contest",
    issuer: "BUBT IT Club & CSE Department",
    year: "2022",
    type: "Achievement",
    link: "https://drive.google.com/file/d/1i2jKUgi2Ziqb466Vlz6PpdSQav1f_vL8/view?usp=drive_link",
    details:
      "Competed in junior division algorithmic problem solving and time-constrained competitive programming challenges.",
  },
];

export const MILESTONES_DATA: MilestoneItem[] = [
  {
    year: "2022",
    title: "The Genesis",
    subtitle: "Foundations & Competitive Problem Solving",
    description:
      "Began my Computer Science journey at BUBT. Immersed myself in C, C++, and Python fundamentals, algorithms, and algorithmic contest programming.",
    highlights: [
      "Mastered low-level memory concepts and foundational data structures",
      "Built first CLI systems, algorithms, and interactive programs",
      "Participated in initial university programming contests",
    ],
    gradient: "from-amber-400 to-orange-500",
  },
  {
    year: "2023",
    title: "Full-Stack Expansion",
    subtitle: "Web & Mobile Engineering",
    description:
      "Transitioned theoretical foundations into building real applications. Mastered the MERN stack and adopted Flutter for cross-platform mobile apps.",
    highlights: [
      "Built 20+ personal and academic projects across React, Node.js, and Flutter",
      "Explored database architectures with MongoDB, PostgreSQL, and Firebase",
      "Started taking freelance client challenges and contributing to open source",
    ],
    gradient: "from-cyan-400 to-blue-500",
  },
  {
    year: "2024",
    title: "Production Engineering & Real Impact",
    subtitle: "Enterprise Clients & Advanced Systems",
    description:
      "Designed and deployed production platforms for real businesses (PurchifyShop, Midtown Aabashon Ltd, TripFly BD). Broadened scope into AI/ML and IoT hardware.",
    highlights: [
      "Crossed milestone of 50+ total projects engineered",
      "Built AuthNova security hardening and real-time WebSocket systems",
      "Awarded IEEE ICRCS Certificate of Excellence",
      "Engineered ESP32 IoT and machine learning computer vision pipelines",
    ],
    gradient: "from-purple-400 to-pink-500",
  },
  {
    year: "2025 - 2026",
    title: "Scale, Performance & Innovation",
    subtitle: "Modern Cloud & Production Resilience",
    description:
      "Focused on advanced software engineering architectures, microservices, cloud deployments, and building robust digital products with impeccable UX.",
    highlights: [
      "Earned HackerRank Software Engineer and MERN certifications",
      "Engineering high-converting, accessible, and resilient client software",
      "Available for high-impact full-time and contract engineering opportunities",
    ],
    gradient: "from-emerald-400 to-teal-500",
  },
];

// ============================================================================
// Skills & Technologies Interfaces & Default Data
// ============================================================================
export interface SkillCategory {
  id: string; // unique slug e.g. "frontend", "mobile"
  label: string; // e.g. "Frontend & Full Stack"
  iconName?: string;
  order_index?: number;
}

export interface SkillItemData {
  id: string;
  name: string;
  category: string; // references SkillCategory.id
  level: "Core Production" | "Advanced" | "Proficient" | string;
  color: string;
  iconName?: string;
  order_index?: number;
}

export const DEFAULT_SKILL_CATEGORIES: SkillCategory[] = [
  { id: "frontend", label: "Frontend & Full Stack", iconName: "FaReact", order_index: 0 },
  { id: "mobile", label: "Mobile Apps", iconName: "FaMobileAlt", order_index: 1 },
  { id: "backend", label: "Backend & Database", iconName: "FaServer", order_index: 2 },
  { id: "languages", label: "Programming Languages", iconName: "FaCode", order_index: 3 },
  { id: "aiml", label: "AI/ML & IoT", iconName: "FaBrain", order_index: 4 },
  { id: "tools", label: "Tools & DevOps", iconName: "FaDatabase", order_index: 5 },
];

export const DEFAULT_SKILLS_DATA: SkillItemData[] = [
  // Frontend & Full Stack
  { id: "skill-react", name: "React.js", category: "frontend", level: "Core Production", color: "#61DAFB", iconName: "FaReact" },
  { id: "skill-nextjs", name: "Next.js", category: "frontend", level: "Core Production", color: "#ffffff", iconName: "SiNextdotjs" },
  { id: "skill-typescript", name: "TypeScript", category: "frontend", level: "Core Production", color: "#3178C6", iconName: "SiTypescript" },
  { id: "skill-tailwind", name: "Tailwind CSS", category: "frontend", level: "Core Production", color: "#06B6D4", iconName: "SiTailwindcss" },
  { id: "skill-html5", name: "HTML5 / Semantic Web", category: "frontend", level: "Advanced", color: "#E34F26", iconName: "FaHtml5" },
  { id: "skill-css3", name: "Modern CSS3", category: "frontend", level: "Advanced", color: "#1572B6", iconName: "FaCss3Alt" },

  // Mobile
  { id: "skill-flutter", name: "Flutter", category: "mobile", level: "Core Production", color: "#02569B", iconName: "SiFlutter" },
  { id: "skill-android", name: "Android Native", category: "mobile", level: "Advanced", color: "#3DDC84", iconName: "FaAndroid" },
  { id: "skill-kotlin", name: "Kotlin", category: "mobile", level: "Advanced", color: "#7F52FF", iconName: "SiKotlin" },
  { id: "skill-java-android", name: "Java (Android)", category: "mobile", level: "Advanced", color: "#ED8B00", iconName: "FaJava" },

  // Backend & Database
  { id: "skill-nodejs", name: "Node.js", category: "backend", level: "Core Production", color: "#339933", iconName: "FaNodeJs" },
  { id: "skill-express", name: "Express.js", category: "backend", level: "Core Production", color: "#ffffff", iconName: "SiExpress" },
  { id: "skill-mongodb", name: "MongoDB & Mongoose", category: "backend", level: "Core Production", color: "#47A248", iconName: "SiMongodb" },
  { id: "skill-postgresql", name: "PostgreSQL", category: "backend", level: "Advanced", color: "#336791", iconName: "SiPostgresql" },
  { id: "skill-mysql", name: "MySQL", category: "backend", level: "Advanced", color: "#4479A1", iconName: "SiMysql" },
  { id: "skill-firebase", name: "Firebase (Auth/DB)", category: "backend", level: "Advanced", color: "#FFCA28", iconName: "SiFirebase" },

  // Languages
  { id: "skill-javascript", name: "JavaScript (ES6+)", category: "languages", level: "Core Production", color: "#F7DF1E", iconName: "SiJavascript" },
  { id: "skill-python", name: "Python", category: "languages", level: "Advanced", color: "#3776AB", iconName: "FaPython" },
  { id: "skill-cpp", name: "C++", category: "languages", level: "Advanced", color: "#00599C", iconName: "SiCplusplus" },
  { id: "skill-java", name: "Java", category: "languages", level: "Advanced", color: "#ED8B00", iconName: "FaJava" },

  // Tools & DevOps
  { id: "skill-git", name: "Git & GitHub", category: "tools", level: "Core Production", color: "#F05032", iconName: "FaGitAlt" },
  { id: "skill-postman", name: "Postman", category: "tools", level: "Core Production", color: "#FF6C37", iconName: "SiPostman" },
  { id: "skill-linux", name: "Linux Environments", category: "tools", level: "Advanced", color: "#FCC624", iconName: "FaLinux" },
  { id: "skill-docker", name: "Docker Basics", category: "tools", level: "Proficient", color: "#2496ED", iconName: "FaDocker" },
  { id: "skill-figma", name: "UI/UX & Figma", category: "tools", level: "Proficient", color: "#F24E1E", iconName: "FaFigma" },

  // AI & IoT
  { id: "skill-tensorflow", name: "TensorFlow & Keras", category: "aiml", level: "Advanced", color: "#FF6F00", iconName: "SiTensorflow" },
  { id: "skill-esp32", name: "ESP32 & IoT Embedded", category: "aiml", level: "Advanced", color: "#38BDF8", iconName: "FaMicrochip" },
  { id: "skill-arduino", name: "Arduino Hardware", category: "aiml", level: "Advanced", color: "#00979D", iconName: "SiArduino" },
];

