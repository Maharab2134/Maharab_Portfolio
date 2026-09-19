/**
 * Dynamic Portfolio Chatbot Engine
 *
 * Provides natural language intent understanding, real-time context awareness,
 * and zero-hallucination answers strictly derived from the portfolio's live data.
 */

import {
  ActiveContext,
  getDynamicPortfolioSnapshot,
  findSkillInPortfolio,
  searchProjects,
} from "./chatbotKnowledge";
import { Project } from "../data/projectsData";

export interface ChatAction {
  label: string;
  type: "scroll" | "project" | "view" | "url";
  target: string;
  primary?: boolean;
  projectData?: Project;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  actions?: ChatAction[];
  contextTag?: string;
  projectsList?: Project[];
  showQuickActionGrid?: boolean;
}

/**
 * Formats a project description into strictly 1 concise line ending with "..."
 * Ensures chatbot acts as a streamlined guide-liner without overwhelming users with text.
 */
export const formatOneLineDescription = (desc?: string, maxChars: number = 72): string => {
  if (!desc) return "...";
  let clean = desc.replace(/^[#\-*\s]+/, "").trim();
  const firstSentenceEnd = clean.search(/[.!?](\s|$)/);
  if (firstSentenceEnd > 20 && firstSentenceEnd <= maxChars) {
    clean = clean.slice(0, firstSentenceEnd);
  } else if (clean.length > maxChars) {
    clean = clean.slice(0, maxChars).trim();
  }
  clean = clean.replace(/[.,\s]+$/, "");
  return clean + "...";
};

// Common technology keywords for entity extraction
const TECH_KEYWORDS = [
  "react",
  "next.js",
  "nextjs",
  "flutter",
  "dart",
  "node",
  "nodejs",
  "node.js",
  "python",
  "typescript",
  "javascript",
  "supabase",
  "firebase",
  "mongodb",
  "postgresql",
  "postgres",
  "tailwind",
  "tailwindcss",
  "docker",
  "graphql",
  "express",
  "expressjs",
  "redux",
  "zustand",
  "git",
  "linux",
  "iot",
  "arduino",
  "esp32",
  "fastapi",
  "django",
  "machine learning",
  "ml",
  "ai",
  "deep learning",
  "opencv",
  "socket.io",
];

export class PortfolioChatbotEngine {
  /**
   * Generates a context-aware welcome message when the chat opens
   */
  public static getInitialMessage(context: ActiveContext): ChatMessage {
    const snapshot = getDynamicPortfolioSnapshot(context);
    const { profile, context: ctx } = snapshot;

    let welcomeText = `Hi! 👋 I'm **${profile.shortName || profile.name}'s AI Assistant**.\n\nYou can ask me anything about my portfolio — projects, skills, experience, or just explore around.`;

    if (ctx.project) {
      welcomeText = `Hi! 👋 You are currently viewing the **${ctx.project.title}** (${ctx.project.categoryLabel}) project.\n\nAsk me anything about its architecture, stack, features, or live demo!`;
    }

    const defaultActions: ChatAction[] = ctx.project
      ? [
          {
            label: "Tell me about this project",
            type: "scroll",
            target: "projects",
          },
          ...(ctx.project.link
            ? [
                {
                  label: "Live Demo",
                  type: "url" as const,
                  target: ctx.project.link,
                  primary: true,
                },
              ]
            : []),
          ...(ctx.project.github
            ? [
                {
                  label: "GitHub Code",
                  type: "url" as const,
                  target: ctx.project.github,
                },
              ]
            : []),
          { label: "View All Projects", type: "scroll", target: "projects" },
        ]
      : [];

    return {
      id: `bot_${Date.now()}_init`,
      sender: "bot",
      text: welcomeText,
      timestamp: new Date().toISOString(),
      actions: defaultActions,
      contextTag: ctx.project ? `Project: ${ctx.project.title}` : undefined,
      showQuickActionGrid: !ctx.project,
    };
  }

  /**
   * Processes a user question and generates an accurate, dynamic, zero-hallucination reply
   */
  public static processQuery(
    rawQuery: string,
    context: ActiveContext
  ): ChatMessage {
    const q = rawQuery.toLowerCase().trim();
    const snapshot = getDynamicPortfolioSnapshot(context);
    const { profile, projects, skills, experience, education, certificates, process, reviews, context: ctx } = snapshot;

    // ------------------------------------------------------------------------
    // 1. Context-Aware Relative Query ("this project", "this app", "this", "eita", "ei project")
    // ------------------------------------------------------------------------
    const isRelativeProjectQuery =
      q.includes("this project") ||
      q.includes("this app") ||
      q.includes("this one") ||
      q.includes("about this") ||
      q.includes("ei project") ||
      q.includes("eita") ||
      q.includes("current project");

    if (isRelativeProjectQuery) {
      if (ctx.project) {
        const p = ctx.project;
        let text = `### **${p.title}** (${p.categoryLabel})\n\n`;
        if (p.subtitle) text += `*${p.subtitle}*\n\n`;
        text += `${p.description}\n\n`;
        if (p.problem) {
          text += `**Problem Addressed:**\n${p.problem}\n\n`;
        }
        if (p.solution) {
          text += `**Engineered Solution:**\n${p.solution}\n\n`;
        }
        if (p.technologies && p.technologies.length > 0) {
          text += `**Technologies:** ${p.technologies.join(", ")}\n\n`;
        }
        if (p.features && p.features.length > 0) {
          text += `**Key Features:**\n${p.features.slice(0, 4).map((f) => `- ${f}`).join("\n")}\n\n`;
        }
        if (p.results && p.results.length > 0) {
          text += `**Results & Impact:**\n${p.results.slice(0, 3).map((r) => `- ${r}`).join("\n")}\n\n`;
        }

        return {
          id: `bot_${Date.now()}`,
          sender: "bot",
          text,
          timestamp: new Date().toISOString(),
          projectsList: [p],
          actions: [
            ...(p.link ? [{ label: "🌐 Live Demo", type: "url" as const, target: p.link, primary: true }] : []),
            ...(p.github ? [{ label: "💻 GitHub Code", type: "url" as const, target: p.github }] : []),
            { label: "🔍 Full Case Study", type: "project" as const, target: p.id, projectData: p },
            { label: "Browse All Projects", type: "scroll" as const, target: "projects" },
          ],
          contextTag: `Project: ${p.title}`,
        };
      } else {
        return {
          id: `bot_${Date.now()}`,
          sender: "bot",
          text: `You are currently viewing the main portfolio overview. Which project would you like to know about? For example: **MedAlert**, **StockPulse**, **QuickBite**, **DevFlow**, or ask *"Show Flutter projects"*!`,
          timestamp: new Date().toISOString(),
          actions: [
            { label: "Browse Projects", type: "scroll", target: "projects", primary: true },
            { label: "Flutter Projects", type: "scroll", target: "projects" },
            { label: "Web Projects", type: "scroll", target: "projects" },
          ],
        };
      }
    }

    // ------------------------------------------------------------------------
    // 2. Resume / CV Query
    // ------------------------------------------------------------------------
    if (
      q.includes("cv") ||
      q.includes("resume") ||
      q.includes("curriculum vitae") ||
      q.includes("download cv") ||
      q.includes("pdf")
    ) {
      const url = profile.resumeUrl || "";
      const text = `You can view and download **${profile.name}'s official resume (CV)** directly.\n\nIt outlines his full software engineering background, B.Sc. in CSE at BUBT, published projects, and technical proficiencies.`;
      return {
        id: `bot_${Date.now()}`,
        sender: "bot",
        text,
        timestamp: new Date().toISOString(),
        actions: [
          { label: "📄 Download / View CV", type: "url", target: url, primary: true },
          { label: "💼 View Experience", type: "scroll", target: "experience" },
          { label: "📬 Contact Directly", type: "scroll", target: "contact" },
        ],
      };
    }

    // ------------------------------------------------------------------------
    // 3. Contact / Social / Hire / Availability Query
    // ------------------------------------------------------------------------
    if (
      q.includes("contact") ||
      q.includes("email") ||
      q.includes("phone") ||
      q.includes("whatsapp") ||
      q.includes("hire") ||
      q.includes("available") ||
      q.includes("working hours") ||
      q.includes("social") ||
      q.includes("linkedin") ||
      q.includes("github") ||
      q.includes("reach") ||
      q.includes("jogajog")
    ) {
      let text = `### **Contact & Availability**\n\n`;
      text += `**Name:** ${profile.name}\n`;
      text += `**Title:** ${profile.title}\n`;
      text += `**Email:** [${profile.email}](mailto:${profile.email})\n`;
      if (profile.whatsappNumber) {
        text += `**WhatsApp:** [+880 15862 82609](${profile.whatsappUrl || `https://wa.me/${profile.whatsappNumber}`})\n`;
      }
      text += `**Location:** ${profile.location}\n`;
      if (profile.workingHours?.enabled) {
        text += `**Status:** ${profile.workingHours.onlineLabel || "Available for Work"} (Timezone: ${profile.workingHours.timezone || "Asia/Dhaka"})\n`;
      }
      text += `\n**Social Profiles:**\n`;
      if (profile.socials?.github) text += `- GitHub: [github.com/Maharab2134](${profile.socials.github})\n`;
      if (profile.socials?.linkedin) text += `- LinkedIn: [LinkedIn Profile](${profile.socials.linkedin})\n`;

      const actions: ChatAction[] = [
        { label: "📬 Open Contact Section", type: "scroll", target: "contact", primary: true },
        { label: "✉️ Email Maharab", type: "url", target: `mailto:${profile.email}` },
      ];
      if (profile.whatsappUrl) {
        actions.push({ label: "💬 WhatsApp Chat", type: "url", target: profile.whatsappUrl });
      }
      actions.push({ label: "💼 Hire Page", type: "view", target: "hire" });

      return {
        id: `bot_${Date.now()}`,
        sender: "bot",
        text,
        timestamp: new Date().toISOString(),
        actions,
      };
    }

    // ------------------------------------------------------------------------
    // 4. About / Who is Maharab / Bio / Intro Query
    // ------------------------------------------------------------------------
    if (
      q.includes("who are you") ||
      q.includes("who is") ||
      q.includes("about") ||
      q.includes("tell me about him") ||
      q.includes("bio") ||
      q.includes("summary") ||
      q.includes("intro") ||
      q.includes("profile") ||
      q.includes("ke tumi") ||
      q.includes("maharab ke")
    ) {
      let text = `### **About ${profile.name}**\n\n`;
      text += `**${profile.title}** based in **${profile.location}**.\n\n`;
      text += `${profile.bio}\n\n`;
      text += `**Key Highlights:**\n`;
      text += `- **Experience:** ${profile.stats.yearsExperience} in production full-stack & mobile engineering\n`;
      text += `- **Projects Delivered:** ${profile.stats.projectsCompleted} across web, mobile, ML, and IoT\n`;
      text += `- **Satisfaction Rate:** ${profile.stats.satisfactionRate}\n`;
      text += `- **Education:** B.Sc. in Computer Science & Engineering at BUBT\n`;

      return {
        id: `bot_${Date.now()}`,
        sender: "bot",
        text,
        timestamp: new Date().toISOString(),
        actions: [
          { label: "🔍 View About Section", type: "scroll", target: "about", primary: true },
          { label: "🚀 View Projects", type: "scroll", target: "projects" },
          { label: "📄 Download CV", type: "url", target: profile.resumeUrl },
          { label: "📬 Contact Him", type: "scroll", target: "contact" },
        ],
      };
    }

    // ------------------------------------------------------------------------
    // 5. Specific Named Project Search ("tell me about MedAlert", "StockPulse", etc.)
    // ------------------------------------------------------------------------
    const matchedProject = projects.find(
      (p) =>
        q.includes(p.title.toLowerCase()) ||
        q.includes(p.id.toLowerCase()) ||
        p.title.toLowerCase().split(" ").some((word) => word.length > 3 && q.includes(word))
    );

    if (matchedProject) {
      const p = matchedProject;
      let text = `### **${p.title}** (${p.categoryLabel})\n\n`;
      if (p.subtitle) text += `*${p.subtitle}*\n\n`;
      text += `${p.description}\n\n`;
      if (p.problem) {
        text += `**Problem Addressed:**\n${p.problem}\n\n`;
      }
      if (p.solution) {
        text += `**Engineered Solution:**\n${p.solution}\n\n`;
      }
      if (p.technologies && p.technologies.length > 0) {
        text += `**Technologies:** ${p.technologies.join(", ")}\n\n`;
      }
      if (p.features && p.features.length > 0) {
        text += `**Key Features:**\n${p.features.slice(0, 4).map((f) => `- ${f}`).join("\n")}\n\n`;
      }
      if (p.results && p.results.length > 0) {
        text += `**Results & Impact:**\n${p.results.slice(0, 3).map((r) => `- ${r}`).join("\n")}\n\n`;
      }

      const actions: ChatAction[] = [];
      if (p.link) {
        actions.push({ label: "🌐 Live Demo", type: "url", target: p.link, primary: true });
      }
      if (p.github) {
        actions.push({ label: "💻 GitHub Repository", type: "url", target: p.github });
      }
      actions.push({ label: "🔍 Open Case Study", type: "project", target: p.id, projectData: p });
      actions.push({ label: "Browse All Projects", type: "scroll", target: "projects" });

      return {
        id: `bot_${Date.now()}`,
        sender: "bot",
        text,
        timestamp: new Date().toISOString(),
        projectsList: [p],
        actions,
      };
    }

    // ------------------------------------------------------------------------
    // 6. Technology / Skill Filtering on Projects ("Show me Flutter projects", "React apps", etc.)
    // ------------------------------------------------------------------------
    const foundTechKeyword = TECH_KEYWORDS.find((t) => q.includes(t));

    if (
      (q.includes("project") || q.includes("app") || q.includes("work") || q.includes("built")) &&
      foundTechKeyword
    ) {
      const matchingProjects = searchProjects(projects, foundTechKeyword);
      if (matchingProjects.length > 0) {
        let text = `### **${foundTechKeyword.toUpperCase()} Projects** (${matchingProjects.length} Found)\n\n`;
        text += `Here are the engineering projects built with **${foundTechKeyword.toUpperCase()}**:\n\n`;
        matchingProjects.slice(0, 4).forEach((proj) => {
          text += `- **${proj.title}** (${proj.categoryLabel}) — *${proj.technologies.slice(0, 3).join(", ")}*\n`;
        });

        return {
          id: `bot_${Date.now()}`,
          sender: "bot",
          text,
          timestamp: new Date().toISOString(),
          projectsList: matchingProjects.slice(0, 4),
          actions: [
            { label: "Browse All Projects", type: "scroll", target: "projects", primary: true },
            { label: "View Skills", type: "scroll", target: "skills" },
          ],
        };
      } else {
        return {
          id: `bot_${Date.now()}`,
          sender: "bot",
          text: `No specific projects built with **${foundTechKeyword}** are currently published in the portfolio.\n\nAvailable technology categories include **React, Next.js, Flutter, Node.js, Python, Supabase, and TypeScript**.`,
          timestamp: new Date().toISOString(),
          actions: [{ label: "Browse All Projects", type: "scroll", target: "projects", primary: true }],
        };
      }
    }

    // ------------------------------------------------------------------------
    // 7. General Projects Query ("What projects are available?", "Projects overview", "My projects")
    // ------------------------------------------------------------------------
    if (
      q.includes("project") ||
      q.includes("portfolio") ||
      q.includes("what did he build") ||
      q.includes("what did you build") ||
      q.includes("works") ||
      q.includes("case studies")
    ) {
      let text = `### **Engineering Projects Portfolio** (${projects.length} Total)\n\n`;
      text += `Maharab has developed **${projects.length} verified projects** spanning Mobile (Flutter), Full-Stack Web (Next.js/React), Machine Learning, and IoT. Featured projects include:\n\n`;
      projects.slice(0, 4).forEach((proj) => {
        text += `- **${proj.title}** (${proj.categoryLabel}) — *${proj.technologies.slice(0, 3).join(", ")}*\n`;
      });

      return {
        id: `bot_${Date.now()}`,
        sender: "bot",
        text,
        timestamp: new Date().toISOString(),
        projectsList: projects.slice(0, 4),
        actions: [
          { label: "🚀 Browse All Projects", type: "scroll", target: "projects", primary: true },
          { label: "📐 Case Studies Blueprint", type: "view", target: "case-studies" },
        ],
      };
    }

    // ------------------------------------------------------------------------
    // 8. Specific Technology Inquiry ("Do you know Python?", "Flutter skill", etc.)
    // ------------------------------------------------------------------------
    if (foundTechKeyword) {
      const result = findSkillInPortfolio(skills, projects, foundTechKeyword);
      if (result.found) {
        let text = `### **${foundTechKeyword.toUpperCase()} Expertise**\n\n`;
        if (result.skillItem) {
          text += `**Status:** Verified in portfolio skills (${result.skillItem.level} level, Category: ${result.skillItem.category}).\n\n`;
        }
        if (result.projectsUsingIt.length > 0) {
          text += `**Used in ${result.projectsUsingIt.length} Project(s):**\n`;
          text += result.projectsUsingIt
            .slice(0, 3)
            .map((p) => `- **${p.title}** (${p.categoryLabel})`)
            .join("\n");
          text += "\n\n";
        }

        const actions: ChatAction[] = result.projectsUsingIt.slice(0, 2).map((p) => ({
          label: `View ${p.title}`,
          type: "project",
          target: p.id,
          projectData: p,
        }));
        actions.push({ label: "View All Skills", type: "scroll", target: "skills" });

        return {
          id: `bot_${Date.now()}`,
          sender: "bot",
          text,
          timestamp: new Date().toISOString(),
          actions,
        };
      }
    }

    // ------------------------------------------------------------------------
    // 9. Skills Overview Query
    // ------------------------------------------------------------------------
    if (
      q.includes("skill") ||
      q.includes("technology") ||
      q.includes("technologies") ||
      q.includes("stack") ||
      q.includes("tools") ||
      q.includes("dokhota")
    ) {
      const frontend = skills.filter((s) => s.category === "frontend").map((s) => s.name);
      const mobile = skills.filter((s) => s.category === "mobile").map((s) => s.name);
      const backend = skills.filter((s) => s.category === "backend").map((s) => s.name);
      const database = skills.filter((s) => s.category === "database").map((s) => s.name);
      const tools = skills.filter((s) => s.category === "tools" || s.category === "devops").map((s) => s.name);

      let text = `### **Technical Skills & Stack**\n\n`;
      if (frontend.length > 0) text += `**Frontend:** ${frontend.slice(0, 6).join(", ")}\n`;
      if (mobile.length > 0) text += `**Mobile:** ${mobile.join(", ")}\n`;
      if (backend.length > 0) text += `**Backend & APIs:** ${backend.slice(0, 6).join(", ")}\n`;
      if (database.length > 0) text += `**Databases & Cloud:** ${database.slice(0, 5).join(", ")}\n`;
      if (tools.length > 0) text += `**Tools & DevOps:** ${tools.slice(0, 6).join(", ")}\n`;
      text += `\nTotal verified skills cataloged: **${skills.length}**.`;

      return {
        id: `bot_${Date.now()}`,
        sender: "bot",
        text,
        timestamp: new Date().toISOString(),
        actions: [
          { label: "🛠️ Explore Skills Section", type: "scroll", target: "skills", primary: true },
          { label: "🚀 View Projects", type: "scroll", target: "projects" },
        ],
      };
    }

    // ------------------------------------------------------------------------
    // 10. Experience & Work History Query
    // ------------------------------------------------------------------------
    if (
      q.includes("experience") ||
      q.includes("work history") ||
      q.includes("career") ||
      q.includes("company") ||
      q.includes("companies") ||
      q.includes("jobs") ||
      q.includes("job") ||
      q.includes("roles")
    ) {
      if (experience.length === 0) {
        return {
          id: `bot_${Date.now()}`,
          sender: "bot",
          text: `Maharab has **${profile.stats.yearsExperience}** of software engineering experience focusing on building production web and mobile solutions. Detailed corporate history is available upon request or via resume.`,
          timestamp: new Date().toISOString(),
          actions: [
            { label: "📄 Download CV", type: "url", target: profile.resumeUrl, primary: true },
            { label: "📬 Contact Him", type: "scroll", target: "contact" },
          ],
        };
      }

      let text = `### **Career Experience & Roles**\n\n`;
      text += experience
        .map((exp) => {
          let item = `**${exp.role}** at **${exp.company}**\n`;
          item += `*${exp.period} • ${exp.location || "Remote / On-site"}*\n`;
          item += `${exp.description}\n`;
          if (exp.technologies && exp.technologies.length > 0) {
            item += `**Tech:** ${exp.technologies.join(", ")}\n`;
          }
          return item;
        })
        .join("\n");

      return {
        id: `bot_${Date.now()}`,
        sender: "bot",
        text,
        timestamp: new Date().toISOString(),
        actions: [
          { label: "💼 View Experience Section", type: "scroll", target: "experience", primary: true },
          { label: "📄 Download Resume", type: "url", target: profile.resumeUrl },
          { label: "📬 Contact", type: "scroll", target: "contact" },
        ],
      };
    }

    // ------------------------------------------------------------------------
    // 11. Education & Academic Background Query
    // ------------------------------------------------------------------------
    if (
      q.includes("education") ||
      q.includes("degree") ||
      q.includes("university") ||
      q.includes("college") ||
      q.includes("academic") ||
      q.includes("study") ||
      q.includes("bubt") ||
      q.includes("school") ||
      q.includes("cgpa")
    ) {
      let text = `### **Academic Background & Education**\n\n`;
      text += education
        .map((edu) => {
          let item = `**${edu.degree}**\n`;
          item += `*${edu.institution} (${edu.period})*\n`;
          item += `${edu.description}\n`;
          if (edu.highlights && edu.highlights.length > 0) {
            item += `**Highlights:**\n${edu.highlights.map((h) => `- ${h}`).join("\n")}\n`;
          }
          return item;
        })
        .join("\n");

      return {
        id: `bot_${Date.now()}`,
        sender: "bot",
        text,
        timestamp: new Date().toISOString(),
        actions: [
          { label: "🎓 View Education Section", type: "scroll", target: "education", primary: true },
          { label: "📄 Download CV", type: "url", target: profile.resumeUrl },
        ],
      };
    }

    // ------------------------------------------------------------------------
    // 12. Certifications & Credentials Query
    // ------------------------------------------------------------------------
    if (
      q.includes("certif") ||
      q.includes("credential") ||
      q.includes("achievement") ||
      q.includes("awards") ||
      q.includes("licenses")
    ) {
      let text = `### **Certificates & Credentials** (${certificates.length} Total)\n\n`;
      text += certificates
        .slice(0, 4)
        .map((c) => `- **${c.title}** issued by **${c.issuer}** (${c.year}) • *${c.type}*`)
        .join("\n");

      const actions: ChatAction[] = [
        { label: "🏆 View Certificates Section", type: "scroll", target: "certificates", primary: true },
      ];
      if (certificates[0]?.link) {
        actions.push({ label: `Verify: ${certificates[0].title}`, type: "url", target: certificates[0].link });
      }

      return {
        id: `bot_${Date.now()}`,
        sender: "bot",
        text,
        timestamp: new Date().toISOString(),
        actions,
      };
    }

    // ------------------------------------------------------------------------
    // 13. Development Methodology / Engineering Process / Services
    // ------------------------------------------------------------------------
    if (
      q.includes("process") ||
      q.includes("methodology") ||
      q.includes("how do you work") ||
      q.includes("workflow") ||
      q.includes("services") ||
      q.includes("engineering flow")
    ) {
      let text = `### **Engineering Methodology & Workflow**\n\n`;
      text += `Maharab follows a disciplined 5-stage lifecycle for every project:\n\n`;
      text += process.steps
        .map((s, idx) => `${idx + 1}. **${s.title}** (${s.estimatedDuration || "Phase"}): ${s.description}`)
        .join("\n\n");

      return {
        id: `bot_${Date.now()}`,
        sender: "bot",
        text,
        timestamp: new Date().toISOString(),
        actions: [
          { label: "⚡ View Process Section", type: "scroll", target: "development-process", primary: true },
          { label: "💼 Hire Maharab", type: "view", target: "hire" },
        ],
      };
    }

    // ------------------------------------------------------------------------
    // 14. Reviews & Testimonials Query
    // ------------------------------------------------------------------------
    if (
      q.includes("review") ||
      q.includes("testimonial") ||
      q.includes("feedback") ||
      q.includes("rating") ||
      q.includes("client")
    ) {
      let text = `### **Client Reviews & Feedback**\n\n`;
      text += `Maharab maintains a **${profile.stats.satisfactionRate} satisfaction rate** with verified project reviews.\n\n`;
      if (reviews.length > 0) {
        text += `**Recent Feedback:**\n`;
        text += reviews
          .slice(0, 3)
          .map((r) => `> "${r.message}"\n> — **${r.name}** (Rating: ${"★".repeat(r.rating || 5)})`)
          .join("\n\n");
      }

      return {
        id: `bot_${Date.now()}`,
        sender: "bot",
        text,
        timestamp: new Date().toISOString(),
        actions: [
          { label: "⭐ View All Testimonials", type: "scroll", target: "testimonials", primary: true },
          { label: "📬 Leave a Review / Contact", type: "scroll", target: "contact" },
        ],
      };
    }

    // ------------------------------------------------------------------------
    // 15. Navigation Request ("Take me to...", "Go to...")
    // ------------------------------------------------------------------------
    if (q.includes("go to") || q.includes("take me to") || q.includes("open") || q.includes("scroll to")) {
      if (q.includes("project")) {
        return {
          id: `bot_${Date.now()}`,
          sender: "bot",
          text: `Navigating to the **Projects** section!`,
          timestamp: new Date().toISOString(),
          actions: [{ label: "Scroll to Projects", type: "scroll", target: "projects", primary: true }],
        };
      }
      if (q.includes("contact")) {
        return {
          id: `bot_${Date.now()}`,
          sender: "bot",
          text: `Navigating to the **Contact** section!`,
          timestamp: new Date().toISOString(),
          actions: [{ label: "Scroll to Contact", type: "scroll", target: "contact", primary: true }],
        };
      }
      if (q.includes("skill")) {
        return {
          id: `bot_${Date.now()}`,
          sender: "bot",
          text: `Navigating to the **Skills** section!`,
          timestamp: new Date().toISOString(),
          actions: [{ label: "Scroll to Skills", type: "scroll", target: "skills", primary: true }],
        };
      }
      if (q.includes("experience")) {
        return {
          id: `bot_${Date.now()}`,
          sender: "bot",
          text: `Navigating to the **Experience** section!`,
          timestamp: new Date().toISOString(),
          actions: [{ label: "Scroll to Experience", type: "scroll", target: "experience", primary: true }],
        };
      }
      if (q.includes("hire")) {
        return {
          id: `bot_${Date.now()}`,
          sender: "bot",
          text: `Opening the **Hire** page!`,
          timestamp: new Date().toISOString(),
          actions: [{ label: "Open Hire Page", type: "view", target: "hire", primary: true }],
        };
      }
      if (q.includes("journey")) {
        return {
          id: `bot_${Date.now()}`,
          sender: "bot",
          text: `Opening the **Journey** page!`,
          timestamp: new Date().toISOString(),
          actions: [{ label: "Open Journey Page", type: "view", target: "journey", primary: true }],
        };
      }
    }

    // ------------------------------------------------------------------------
    // 16. What information is available / Help / Guide me
    // ------------------------------------------------------------------------
    if (
      q.includes("guide") ||
      q.includes("explore") ||
      q.includes("tour") ||
      q.includes("what information is available") ||
      q.includes("help") ||
      q.includes("what can you do") ||
      q.includes("options") ||
      q.includes("ki ache")
    ) {
      return {
        id: `bot_${Date.now()}`,
        sender: "bot",
        text: `I'm your personal interactive guide to Maharab's portfolio! Select any topic below or ask me directly:`,
        timestamp: new Date().toISOString(),
        showQuickActionGrid: true,
      };
    }

    // ------------------------------------------------------------------------
    // 17. STRICT ZERO-HALLUCINATION FALLBACK
    // ------------------------------------------------------------------------
    const fallbackText =
      `I don't have that specific information because my knowledge is strictly limited to the verified content on **Maharab's portfolio**.\n\n` +
      `I do not invent external facts or unconfirmed details. Here is what I can assist you with:\n` +
      `- **Projects & Case Studies** (e.g. *"Show mobile apps"*, *"Tell me about MedAlert"*)\n` +
      `- **Technical Skills & Tools** (e.g. *"What skills does he have?"*, *"Does he know Python?"*)\n` +
      `- **Work Experience & Education** (e.g. *"Where did he study?"*, *"Career history"*)\n` +
      `- **Resume & Contact** (e.g. *"Download CV"*, *"How to contact?"*)`;

    return {
      id: `bot_${Date.now()}`,
      sender: "bot",
      text: fallbackText,
      timestamp: new Date().toISOString(),
      actions: [
        { label: "🚀 Browse Projects", type: "scroll", target: "projects" },
        { label: "🛠️ View Skills", type: "scroll", target: "skills" },
        { label: "📄 Download CV", type: "url", target: profile.resumeUrl },
        { label: "📬 Contact Maharab", type: "scroll", target: "contact", primary: true },
      ],
    };
  }
}
