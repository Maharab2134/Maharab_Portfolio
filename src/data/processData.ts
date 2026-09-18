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
  badge: "ENGINEERING LIFECYCLE",
  title: "Development & Engineering Process",
  subtitle:
    "A disciplined, battle-tested engineering methodology that transforms complex ideas into scalable, secure, and production-ready digital software.",
  steps: [
    {
      id: "step-1",
      stepNumber: "01",
      title: "Discovery & System Architecture",
      subtitle: "Requirements analysis, schema design & technical roadmap",
      description:
        "Deep exploration into core business objectives, technical constraints, and scalability targets. Defining clean relational/NoSQL schemas, data modeling, API contracts, and choosing the optimal technology stack.",
      iconName: "FaDraftingCompass",
      badge: "PHASE 1 • BLUEPRINT",
      deliverables: [
        "System Architecture Diagram",
        "Database ERD & Schema Spec",
        "Technical Stack Decision Matrix",
        "Sprint & Milestone Roadmap",
      ],
      estimatedDuration: "1 - 2 Days",
      colorTheme: "from-cyan-500 to-blue-600",
      glowColor: "rgba(6, 182, 212, 0.35)",
    },
    {
      id: "step-2",
      stepNumber: "02",
      title: "UI/UX Design Systems & Prototyping",
      subtitle: "High-fidelity mockups, design tokens & micro-interactions",
      description:
        "Translating specifications into intuitive, accessible, and high-converting visual workflows. Establishing consistent typography, color palettes, atomic UI components, and fluid responsive layouts before writing production code.",
      iconName: "FaFigma",
      badge: "PHASE 2 • PROTOTYPE",
      deliverables: [
        "Figma Wireframes & Interactive UI",
        "Atomic Design Token Hierarchy",
        "Mobile-First Responsive Layouts",
        "WCAG Accessibility Compliance",
      ],
      estimatedDuration: "2 - 3 Days",
      colorTheme: "from-purple-500 to-indigo-600",
      glowColor: "rgba(168, 85, 247, 0.35)",
    },
    {
      id: "step-3",
      stepNumber: "03",
      title: "Full-Stack Development & Clean APIs",
      subtitle: "Modular architecture, type-safety & high throughput",
      description:
        "Engineering high-performance web and mobile applications using modern frameworks. Writing strict TypeScript code, modular React components, high-throughput REST/GraphQL endpoints, and secure database integrations.",
      iconName: "FaLaptopCode",
      badge: "PHASE 3 • BUILD",
      deliverables: [
        "Modular Full-Stack Application",
        "Strict Type-Safe API Services",
        "Secure Authentication (JWT/OAuth)",
        "Real-Time WebSockets / State Sync",
      ],
      estimatedDuration: "1 - 2 Weeks",
      colorTheme: "from-emerald-500 to-teal-600",
      glowColor: "rgba(16, 185, 129, 0.35)",
    },
    {
      id: "step-4",
      stepNumber: "04",
      title: "Testing, Security & Core Web Vitals",
      subtitle: "Zero regressions, code reviews & lighthouse 95+ speed",
      description:
        "Comprehensive validation covering edge cases, unit tests, integration pipelines, and strict security audits (RLS, CORS, SQL injection prevention). Fine-tuning asset sizes, lazy loading, and caching for sub-second load times.",
      iconName: "FaShieldAlt",
      badge: "PHASE 4 • HARDENING",
      deliverables: [
        "End-to-End & Integration Testing",
        "Database RLS & Security Policies",
        "Lighthouse 95+ Performance Score",
        "Cross-Browser & Cross-Device QA",
      ],
      estimatedDuration: "2 - 4 Days",
      colorTheme: "from-amber-500 to-orange-600",
      glowColor: "rgba(245, 158, 11, 0.35)",
    },
    {
      id: "step-5",
      stepNumber: "05",
      title: "Cloud Deployment, CI/CD & Launch",
      subtitle: "Zero-downtime deployment, telemetry & documentation",
      description:
        "Automated CI/CD pipelines deploying to production cloud infrastructure (Vercel, AWS, Docker, Supabase). Setting up custom domain routing, SSL certificates, real-time analytics monitoring, and thorough technical handoff.",
      iconName: "FaRocket",
      badge: "PHASE 5 • RELEASE",
      deliverables: [
        "Automated CI/CD Pipeline (GitHub Actions)",
        "Production Cloud Deployment & SSL",
        "Live Visitor Telemetry & Analytics",
        "Handover Documentation & Post-Launch Care",
      ],
      estimatedDuration: "1 - 2 Days",
      colorTheme: "from-pink-500 to-rose-600",
      glowColor: "rgba(244, 63, 94, 0.35)",
    },
  ],
};
