export interface ProcessStep {
  id: string;
  stepNumber: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  badge: string;
  deliverables: string[];
  estimatedDuration?: string;
  colorTheme: string;
  glowColor: string;
}

export interface DevelopmentProcessConfig {
  enabled: boolean;
  badge: string;
  title: string;
  subtitle: string;
  steps: ProcessStep[];
}

export const DEFAULT_PROCESS_CONFIG: DevelopmentProcessConfig = {
  enabled: true,
  badge: "WORKFLOW TREE • 4 BRANCHES",
  title: "Engineering & Development Process",
  subtitle:
    "A clean 4-branch engineering roadmap designed to build scalable, resilient software from concept to production.",
  steps: [
    {
      id: "branch-1",
      stepNumber: "01",
      title: "Plan & Architect",
      subtitle: "System Architecture, Database ERD & Tech Stack",
      description: "Defining core requirements, database schemas, and clean architectural blueprints.",
      iconName: "FaDraftingCompass",
      badge: "BRANCH 1 • BLUEPRINT",
      deliverables: ["System Architecture", "Database Schema", "Tech Stack Strategy"],
      estimatedDuration: "Phase 1",
      colorTheme: "from-cyan-500 to-blue-600",
      glowColor: "rgba(6, 182, 212, 0.4)",
    },
    {
      id: "branch-2",
      stepNumber: "02",
      title: "Design & Prototype",
      subtitle: "Figma Wireframes, Design Tokens & Responsive UX",
      description: "Crafting pixel-perfect interactive mockups and accessible UI design systems.",
      iconName: "FaFigma",
      badge: "BRANCH 2 • DESIGN",
      deliverables: ["Figma Interactive UI", "Design Tokens", "Mobile-First UX"],
      estimatedDuration: "Phase 2",
      colorTheme: "from-purple-500 to-indigo-600",
      glowColor: "rgba(168, 85, 247, 0.4)",
    },
    {
      id: "branch-3",
      stepNumber: "03",
      title: "Code & Build",
      subtitle: "Strict TypeScript, Full-Stack & Clean APIs",
      description: "Engineering modular, type-safe full-stack apps and high-performance APIs.",
      iconName: "FaLaptopCode",
      badge: "BRANCH 3 • BUILD",
      deliverables: ["Clean Architecture", "Type-Safe APIs", "Secure State Sync"],
      estimatedDuration: "Phase 3",
      colorTheme: "from-emerald-500 to-teal-600",
      glowColor: "rgba(16, 185, 129, 0.4)",
    },
    {
      id: "branch-4",
      stepNumber: "04",
      title: "Deploy & Scale",
      subtitle: "Automated CI/CD, Cloud SSL & 95+ Speed",
      description: "Deploying production builds with automated pipelines and real-time monitoring.",
      iconName: "FaRocket",
      badge: "BRANCH 4 • LAUNCH",
      deliverables: ["Automated CI/CD", "Cloud Deployment", "95+ Lighthouse Score"],
      estimatedDuration: "Phase 4",
      colorTheme: "from-amber-500 to-rose-600",
      glowColor: "rgba(244, 63, 94, 0.4)",
    },
  ],
};
