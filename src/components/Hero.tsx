import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { HiOutlineHandRaised } from "react-icons/hi2";
import { IconBaseProps } from "react-icons";
import { TypeAnimation } from "react-type-animation";
import { useState, useEffect } from "react";

const renderIcon = (
  Icon: React.ComponentType<IconBaseProps>,
  props: IconBaseProps = {},
) => {
  return <Icon {...props} />;
};

// ✅ Pre-calculated particle data (fixes random re-render bug)
const PARTICLES = [...Array(15)].map((_, i) => ({
  x: (Math.random() - 0.5) * 50,
  y: (Math.random() - 0.5) * 50,
  duration: Math.random() * 8 + 8,
  delay: i * 0.3,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
}));

// ✅ Social links data array (cleaner & scalable)
const SOCIAL_LINKS = [
  {
    href: "https://github.com/Maharab2134",
    label: "Visit GitHub Profile",
    icon: FaGithub,
  },
  {
    href: "https://www.linkedin.com/in/md-maharab-hosen-679a70253/",
    label: "Visit LinkedIn Profile",
    icon: FaLinkedin,
  },
  {
    href: "https://x.com/Mahar22234",
    label: "Visit Twitter Profile",
    icon: FaTwitter,
  },
];

const Hero = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > window.innerHeight / 2);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      id="home"
      className="relative flex items-center justify-center min-h-screen 
      overflow-hidden bg-gradient-to-tr from-[#0f172a] via-[#1e293b] to-[#0f172a]"
    >
      <div className="px-4 py-24 mx-auto text-center max-w-7xl sm:px-6 sm:py-32">
        {/* ✅ Greeting & Name */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl"
        >
          <div className="mb-4 text-xl font-medium sm:text-3xl md:text-4xl">
            {/* ✅ Fixed: use as JSX component */}
            <motion.span
              className="inline-block ml-1 sm:ml-2"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
            >
              {renderIcon(
                HiOutlineHandRaised as React.ComponentType<IconBaseProps>,
                { size: 28 },
              )}
            </motion.span>{" "}
            Hey there!
          </div>

          <div className="text-3xl break-words sm:text-5xl md:text-6xl">
            I'm{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
              Md. Maharab Hosen
            </span>
          </div>
        </motion.div>

        {/* ✅ Type Animation */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 text-lg font-medium tracking-wide text-gray-300 sm:text-xl md:text-2xl"
        >
          <div
            className="flex flex-col items-center min-h-[5em] gap-2 
            sm:inline-flex sm:h-[2.5em] sm:flex-row sm:gap-0"
          >
            <span className="font-light text-white/80 sm:mr-4">
              I specialize in
            </span>
            <TypeAnimation
              sequence={[
                "Full Stack Development",
                2000,
                "Mobile App Development",
                2000,
                "Software Testing (QA)",
                2000,
                "UI/UX Design",
                2000,
              ]}
              wrapper="span"
              speed={30}
              repeat={Infinity}
              className="max-w-full font-semibold text-center text-transparent break-words bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 sm:text-left"
            />
          </div>
        </motion.div>

        {/* ✅ Description */}
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl mx-auto mb-12 text-base font-light leading-relaxed text-gray-400 sm:text-xl sm:mb-14"
        >
          Passionate about crafting seamless digital solutions, blending code
          and design to create immersive web experiences that captivate and
          connect.
        </motion.p>

        {/* ✅ Social Links & CTA */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center space-y-6"
        >
          {/* ✅ Social Icons - with aria-labels */}
          <div className="flex justify-center mb-8 space-x-5 sm:space-x-6">
            {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="transition-all duration-300 text-white/80 hover:text-white"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                {/* ✅ Fixed: proper JSX usage */}
                {renderIcon(Icon as React.ComponentType<IconBaseProps>, {
                  size: 28,
                })}
              </motion.a>
            ))}
          </div>

          {/* ✅ CTA Button */}
          <div className="flex flex-col justify-center w-full gap-4 sm:w-auto sm:flex-row">
            <motion.a
              href="#about"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 20px rgba(168, 85, 247, 0.4)",
              }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center w-full gap-2 px-8 py-3 text-lg font-medium text-white transition-all duration-300 rounded-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 ring-1 ring-white/20 hover:ring-white/30"
            >
              <motion.span
                className="inline-block"
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {/* ✅ Fixed: proper JSX usage */}
                {renderIcon(
                  HiOutlineHandRaised as React.ComponentType<IconBaseProps>,
                  { size: 20 },
                )}
              </motion.span>
              About Me
            </motion.a>
          </div>
        </motion.div>
      </div>

      {/* ✅ Background Blobs */}
      <motion.div className="absolute inset-0 overflow-hidden -z-10">
        <motion.div
          className="absolute w-[600px] h-[600px] bg-purple-500/10 
          rounded-full blur-3xl -top-40 -left-40"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1],
            x: [-20, 20, -20],
            y: [-20, 20, -20],
          }}
          transition={{ duration: 16, repeat: Infinity, repeatType: "reverse" }}
        />
        <motion.div
          className="absolute w-[600px] h-[600px] bg-pink-500/10 
          rounded-full blur-3xl -bottom-40 -right-40"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.1, 0.2],
            x: [20, -20, 20],
            y: [20, -20, 20],
          }}
          transition={{ duration: 16, repeat: Infinity, repeatType: "reverse" }}
        />

        {/* ✅ Fixed Particles - no random re-renders */}
        <motion.div className="absolute inset-0">
          {PARTICLES.map((particle, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-white rounded-full 
              opacity-30 blur-[0.5px]"
              animate={{
                x: [0, particle.x, 0],
                y: [0, particle.y, 0],
                opacity: [0.2, 0.5, 0.2],
                scale: [0.6, 1, 0.6],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                repeatType: "mirror",
                delay: particle.delay,
              }}
              style={{
                left: particle.left,
                top: particle.top,
              }}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* ✅ Scroll to Top - visible on all screens */}
      <motion.button
        aria-label="Scroll to top"
        className="fixed z-50 cursor-pointer bottom-6 right-4 text-white/60 sm:bottom-8 sm:right-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: showScrollTop ? 1 : 0,
          y: showScrollTop ? 0 : 20,
          pointerEvents: showScrollTop ? "auto" : "none",
        }}
        transition={{ duration: 0.3 }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <motion.span
          className="block text-4xl"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          ⌃
        </motion.span>
      </motion.button>

      {/* ✅ Scroll Down Indicator */}
      <motion.button
        aria-label="Scroll down"
        className="absolute z-50 transform -translate-x-1/2 cursor-pointer bottom-8 left-1/2 text-white/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{
          opacity: { duration: 1, delay: 1 },
          y: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
        }}
        onClick={() =>
          window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
        }
      >
        <span className="text-4xl">⌄</span>
      </motion.button>
    </section>
  );
};

export default Hero;
