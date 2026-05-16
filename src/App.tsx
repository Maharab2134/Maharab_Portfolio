import { useState } from "react";
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

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const projectParam = new URLSearchParams(window.location.search).get(
    "project",
  );

  if (projectParam) {
    return <ProjectDetails />;
  }

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
