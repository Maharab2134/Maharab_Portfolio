import React, { useState, useEffect, useLayoutEffect, useCallback } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Education from "./components/Education";
import Certificates from "./components/Certificates";
import ProjectDetails from "./pages/ProjectDetails";
import MyJourney from "./pages/MyJourney";
import Hire from "./pages/Hire";
import Admin from "./pages/Admin";
import SmartScrollButton from "./components/SmartScrollButton";
import Testimonials from "./components/Testimonials";
import { Project, getAllProjectsSync } from "./data/projectsData";
import { trackVisitorHit } from "./lib/analyticsService";

type ActiveView = "home" | "hire" | "journey" | "project" | "admin";

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeView, setActiveView] = useState<ActiveView>("home");

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Track telemetry hit when visitor navigates across views
  useEffect(() => {
    if (activeView !== "admin") {
      trackVisitorHit(activeView);
    }
  }, [activeView]);

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

    setActiveView("home");
  }, []);

  useEffect(() => {
    syncViewFromLocation();

    const handleHashAndPopState = () => {
      syncViewFromLocation();
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
          const targetEl = document.getElementById(targetId);
          if (targetEl) {
            const targetTop = targetEl.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({ top: Math.max(0, targetTop - 70), left: 0, behavior: "instant" as any });
            return;
          }
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

  const handleNavigatePage = (page: "home" | "hire" | "journey") => {
    setSelectedProject(null);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("portfolio_home_scroll_y");
      document.documentElement.style.scrollBehavior = "auto";
      document.body.style.scrollBehavior = "auto";
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as any });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
    if (page === "home") {
      window.location.hash = "";
      const url = new URL(window.location.href);
      url.searchParams.delete("project");
      window.history.pushState({}, "", url.pathname);
      setActiveView("home");
    } else if (page === "hire") {
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
      {activeView === "project" && (
        <ProjectDetails
          initialProject={selectedProject}
          onBack={handleBackFromProject}
        />
      )}
      {activeView === "hire" && <Hire />}
      {activeView === "journey" && <MyJourney />}
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
            <Certificates />
            <Skills />
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
