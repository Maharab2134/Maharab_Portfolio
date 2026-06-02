import { useState, useEffect } from "react";
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
import MyJourney from "./pages/My Journey";
import Hire from "./pages/Hire";

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const searchParams = new URLSearchParams(window.location.search);
  const projectParam = searchParams.get("project");

  // showJourney and showHire state initialized from query param or hash
  const [showJourney, setShowJourney] = useState(() => {
    if (typeof window === "undefined") return false;
    const params = new URLSearchParams(window.location.search);
    return Boolean(
      params.get("journey") ||
      window.location.hash === "#journey" ||
      window.location.pathname === "/journey",
    );
  });

  const [showHire, setShowHire] = useState(() => {
    if (typeof window === "undefined") return false;
    return (
      window.location.hash === "#hire" || window.location.pathname === "/hire"
    );
  });

  // listen to hash changes so in-page navigation to #journey or #hire works
  useEffect(() => {
    const onHash = () => {
      setShowJourney(
        window.location.hash === "#journey" ||
          window.location.pathname === "/journey",
      );
      setShowHire(
        window.location.hash === "#hire" ||
          window.location.pathname === "/hire",
      );
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  if (projectParam) {
    return <ProjectDetails />;
  }

  if (showJourney) return <MyJourney />;
  if (showHire) return <Hire />;

  return (
    <div className="min-h-screen bg-primary">
      <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <main>
        <Hero />
        <About />
        <Education />
        <Certificates />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
