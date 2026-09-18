import React, { useState, useEffect, useLayoutEffect, useCallback } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import { DevelopmentProcess } from "./components/DevelopmentProcess";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Education from "./components/Education";
import Experience from "./components/Experience";
import Certificates from "./components/Certificates";
import ProjectDetails from "./pages/ProjectDetails";
import MyJourney from "./pages/MyJourney";
import Hire from "./pages/Hire";
import Admin from "./pages/Admin";
import CaseStudies from "./pages/CaseStudies";
import SmartScrollButton from "./components/SmartScrollButton";
import Testimonials from "./components/Testimonials";
import SplashScreen from "./components/SplashScreen";
import { Project, getAllProjectsSync } from "./data/projectsData";
import { trackVisitorHit } from "./lib/analyticsService";

type ActiveView = "home" | "hire" | "journey" | "project" | "admin" | "case-studies";

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeView, setActiveView] = useState<ActiveView>("home");

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Track telemetry hit when visitor navigates across views
  useEffect(() => {
    if (activeView !== "admin") {
      let pagePath: string = activeView;
      let pageTitle = "Home";
      if (activeView === "hire") {
        pageTitle = "Hire";
      } else if (activeView === "journey") {
        pageTitle = "Journey";
      } else if (activeView === "case-studies") {
        pageTitle = "Case Studies Blueprint";
        pagePath = "case-studies";
      } else if (activeView === "project") {
        const params = new URLSearchParams(window.location.search);
        const projSlug = params.get("project") || (selectedProject ? selectedProject.id : "Project");
        pageTitle = selectedProject?.title || projSlug || "Project";
        pagePath = `project:${projSlug}`;
      }
      trackVisitorHit(pagePath, pageTitle);
    }
  }, [activeView, selectedProject]);

  const syncViewFromLocation = useCallback(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const hash = window.location.hash.toLowerCase();
    const path = window.location.pathname.toLowerCase();

    if (hash === "#admin" || path === "/admin" || params.get("admin") !== null) {
      setActiveView("admin");
      return;
    }

    if (params.get("project")) {
      setActiveView("project");
      return;
    } else {
      setSelectedProject(null);
    }

    if (hash === "#hire" || path === "/hire" || params.get("hire")) {
      setActiveView("hire");
      return;
    }

    if (hash === "#journey" || path === "/journey" || params.get("journey")) {
      setActiveView("journey");
      return;
    }

    if (hash === "#case-studies" || path === "/case-studies" || params.get("case-studies") !== null) {
      setActiveView("case-studies");
      return;
    }

    setActiveView("home");
  }, []);

  useEffect(() => {
    syncViewFromLocation();

    const handleHashAndPopState = () => {
      syncViewFromLocation();
      const hash = window.location.hash;
      if (hash && hash.startsWith("#") && hash.length > 1) {
        const targetId = hash.substring(1);
        if (!["admin", "hire", "journey", "case-studies"].includes(targetId)) {
          const scrollToHashEl = () => {
            const el = document.getElementById(targetId);
            if (el) {
              const targetTop = el.getBoundingClientRect().top + window.scrollY - 70;
              window.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
            }
          };
          requestAnimationFrame(scrollToHashEl);
          setTimeout(scrollToHashEl, 80);
        }
      }
    };

    window.addEventListener("hashchange", handleHashAndPopState);
    window.addEventListener("popstate", handleHashAndPopState);

    return () => {
      window.removeEventListener("hashchange", handleHashAndPopState);
      window.removeEventListener("popstate", handleHashAndPopState);
    };
  }, [syncViewFromLocation]);

  useLayoutEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.style.scrollBehavior = "auto";
      document.body.style.scrollBehavior = "auto";
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }

      // Check if returning from a project back to homepage
      const savedY = sessionStorage.getItem("portfolio_home_scroll_y");
      if (activeView === "home" && savedY !== null) {
        sessionStorage.removeItem("portfolio_home_scroll_y");
        const targetY = parseFloat(savedY);

        const restoreProjectsScroll = () => {
          const projectsEl = document.getElementById("projects");
          if (projectsEl) {
            const projectsTop =
              projectsEl.getBoundingClientRect().top + window.scrollY;
            const finalY =
              targetY > 300 ? targetY : Math.max(0, projectsTop - 60);
            window.scrollTo({ top: finalY, left: 0, behavior: "instant" as any });
          } else if (targetY > 0) {
            window.scrollTo({ top: targetY, left: 0, behavior: "instant" as any });
          }
        };

        restoreProjectsScroll();
        const raf = requestAnimationFrame(restoreProjectsScroll);
        const timer1 = setTimeout(restoreProjectsScroll, 20);
        const timer2 = setTimeout(restoreProjectsScroll, 80);
        const timer3 = setTimeout(restoreProjectsScroll, 200);

        return () => {
          cancelAnimationFrame(raf);
          clearTimeout(timer1);
          clearTimeout(timer2);
          clearTimeout(timer3);
        };
      }

      // If there's an anchor hash (e.g. #projects, #about, #skills, #contact), check if target element exists
      const currentHash = window.location.hash;
      if (activeView === "home" && currentHash && currentHash.startsWith("#") && currentHash.length > 1) {
        const targetId = currentHash.substring(1);
        if (!["admin", "hire", "journey"].includes(targetId)) {
          if (targetId === "home") {
            window.scrollTo({ top: 0, left: 0, behavior: "instant" as any });
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
            window.history.replaceState(null, "", window.location.pathname + window.location.search);
            return;
          }
          const scrollAnchor = () => {
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
              const targetTop = targetEl.getBoundingClientRect().top + window.scrollY;
              window.scrollTo({ top: Math.max(0, targetTop - 70), left: 0, behavior: "instant" as any });
            }
          };
          scrollAnchor();
          const t1 = setTimeout(scrollAnchor, 60);
          const t2 = setTimeout(scrollAnchor, 200);
          return () => {
            clearTimeout(t1);
            clearTimeout(t2);
          };
        }
      }

      // Default: Reset scroll to top for other view changes and ensure Hero URL is clean
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as any });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      if (activeView === "home" && window.location.hash && !["#admin", "#hire", "#journey"].includes(window.location.hash)) {
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
      }

      const raf = requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" as any });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      });

      const timer1 = setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" as any });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }, 30);

      const timer2 = setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" as any });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }, 120);

      return () => {
        cancelAnimationFrame(raf);
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [activeView]);

  const handleNavigatePage = (page: "home" | "hire" | "journey", targetSection?: string) => {
    setSelectedProject(null);
    if (page === "home") {
      // If a specific section on home was targeted, navigate directly to it without jumping to Hero or clearing hash
      if (targetSection && targetSection !== "home") {
        setActiveView("home");
        const url = new URL(window.location.href);
        url.searchParams.delete("project");
        url.hash = `#${targetSection}`;
        window.history.replaceState({}, "", url.toString());

        setTimeout(() => {
          const targetEl = document.getElementById(targetSection);
          if (targetEl) {
            const targetTop = targetEl.getBoundingClientRect().top + window.scrollY - 70;
            window.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
          }
        }, 50);
        return;
      }

      // If user specifically requested Home / Hero section
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("portfolio_home_scroll_y");
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        const url = new URL(window.location.href);
        url.searchParams.delete("project");
        url.hash = "";
        window.history.replaceState({}, "", url.pathname);
      }
      setActiveView("home");
      return;
    }

    if (typeof window !== "undefined") {
      sessionStorage.removeItem("portfolio_home_scroll_y");
      document.documentElement.style.scrollBehavior = "auto";
      document.body.style.scrollBehavior = "auto";
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as any });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }

    if (page === "hire") {
      window.location.hash = "#hire";
      setActiveView("hire");
    } else if (page === "journey") {
      window.location.hash = "#journey";
      setActiveView("journey");
    }
  };

  const handleSelectProject = (project: Project) => {
    if (typeof window !== "undefined") {
      // 1. Save current homepage scroll position so returning lands right back in the Projects section
      const currentScrollY =
        window.scrollY || document.documentElement.scrollTop || 0;
      sessionStorage.setItem("portfolio_home_scroll_y", String(currentScrollY));

      document.documentElement.style.scrollBehavior = "auto";
      document.body.style.scrollBehavior = "auto";
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as any });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      setSelectedProject(project);
      const url = new URL(window.location.href);
      url.hash = "";
      url.searchParams.set("project", project.id);
      window.history.pushState({}, "", url.toString());
      setActiveView("project");
    }
  };

  const handleSelectProjectReview = (
    projectId: string,
    reviewAnchor?: string
  ) => {
    if (typeof window !== "undefined") {
      const currentScrollY =
        window.scrollY || document.documentElement.scrollTop || 0;
      sessionStorage.setItem("portfolio_home_scroll_y", String(currentScrollY));

      document.documentElement.style.scrollBehavior = "auto";
      document.body.style.scrollBehavior = "auto";
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }

      const allProjects = getAllProjectsSync();
      const matched = allProjects.find(
        (p) =>
          p.id.toLowerCase() === projectId.toLowerCase() ||
          p.title.toLowerCase() === projectId.toLowerCase() ||
          p.id.toLowerCase().replace(/[^a-z0-9]+/g, "-") ===
            projectId.toLowerCase().replace(/[^a-z0-9]+/g, "-")
      );
      if (matched) {
        setSelectedProject(matched);
      }
      const anchor =
        reviewAnchor ||
        (projectId === "saytica" ? "saytica-review" : `${projectId}-review`);
      const url = new URL(window.location.href);
      url.searchParams.set("project", projectId);
      url.hash = anchor;
      window.history.pushState({}, "", url.toString());
      setActiveView("project");
    }
  };

  const handleBackFromCaseStudies = () => {
    if (typeof window !== "undefined") {
      document.documentElement.style.scrollBehavior = "auto";
      document.body.style.scrollBehavior = "auto";
      const url = new URL(window.location.href);
      url.searchParams.delete("case-studies");
      url.hash = "projects";
      window.history.pushState({}, "", url.toString());
      setActiveView("home");
      setTimeout(() => {
        const el = document.getElementById("projects");
        if (el) {
          const targetTop = el.getBoundingClientRect().top + window.scrollY - 70;
          window.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
        }
      }, 60);
    }
  };

  const handleBackFromProject = () => {
    setSelectedProject(null);
    if (typeof window !== "undefined") {
      document.documentElement.style.scrollBehavior = "auto";
      document.body.style.scrollBehavior = "auto";
      const url = new URL(window.location.href);
      url.searchParams.delete("project");
      url.hash = "projects";
      window.history.pushState({}, "", url.toString());
      setActiveView("home");
    }
  };

  if (activeView === "admin") {
    return <Admin />;
  }

  return (
    <>
      <SplashScreen
        onComplete={() => {
          const hash = window.location.hash;
          if (hash && hash.startsWith("#") && hash.length > 1) {
            const targetId = hash.substring(1);
            if (!["admin", "hire", "journey"].includes(targetId)) {
              const el = document.getElementById(targetId);
              if (el) {
                const targetTop = el.getBoundingClientRect().top + window.scrollY - 70;
                window.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
              }
            }
          }
        }}
      />
      {activeView === "project" && (
        <ProjectDetails
          initialProject={selectedProject}
          onBack={handleBackFromProject}
        />
      )}
      {activeView === "hire" && <Hire />}
      {activeView === "journey" && <MyJourney />}
      {activeView === "case-studies" && (
        <CaseStudies
          onBack={handleBackFromCaseStudies}
          onSelectProject={handleSelectProject}
        />
      )}
      {activeView === "home" && (
        <div className="min-h-screen bg-[#030014] text-slate-100 flex flex-col selection:bg-purple-500/30 selection:text-white">
          <Navbar
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
            onNavigatePage={handleNavigatePage}
          />
          <main className="flex-1">
            <Hero />
            <About />
            <Education />
            <Experience />
            <Certificates />
            <Skills />
            <DevelopmentProcess />
            <Projects onSelectProject={handleSelectProject} />
            <Testimonials onSelectProjectReview={handleSelectProjectReview} />
            <Contact />
          </main>
          <Footer />
        </div>
      )}
      <SmartScrollButton />
    </>
  );
}

export default App;
