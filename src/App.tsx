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
import { Project } from "./data/projectsData";
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
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as any });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

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

  const handleBackFromProject = () => {
    setSelectedProject(null);
    if (typeof window !== "undefined") {
      document.documentElement.style.scrollBehavior = "auto";
      document.body.style.scrollBehavior = "auto";
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as any });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      const url = new URL(window.location.href);
      url.searchParams.delete("project");
      window.history.pushState({}, "", url.pathname);
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
