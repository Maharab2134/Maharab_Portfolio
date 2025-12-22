import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaBars, 
  FaTimes, 
  FaHome, 
  FaUser, 
  FaGraduationCap, 
  FaCode, 
  FaProjectDiagram, 
  FaEnvelope,
  FaUserCircle 
} from 'react-icons/fa';
import { IconBaseProps } from 'react-icons';

interface NavbarProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}

const Navbar = ({ isMenuOpen, setIsMenuOpen }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = ['home', 'about', 'education', 'skills', 'projects', 'contact'];
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });

      if (currentSection) {
        setActiveLink(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home', icon: FaHome },
    { name: 'About', href: '#about', icon: FaUser },
    { name: 'Education', href: '#education', icon: FaGraduationCap },
    { name: 'Skills', href: '#skills', icon: FaCode },
    { name: 'Projects', href: '#projects', icon: FaProjectDiagram },
    { name: 'Contact', href: '#contact', icon: FaEnvelope },
  ];

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#0f172a]/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="px-6 mx-auto max-w-7xl">
        <div className="flex items-center justify-between w-full h-16">
          {/* Left: Brand with Person Icon */}
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
          >
            {/* Animated Person Icon */}
            <motion.div
              className="relative"
              whileHover={{ 
                scale: 1.2,
                rotate: [0, -10, 10, 0]
              }}
              transition={{ 
                duration: 0.6,
                rotate: { duration: 0.5 }
              }}
            >
              <motion.div
                className="p-2 border rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border-purple-500/30"
                animate={{
                  boxShadow: [
                    '0 0 0px rgba(168, 85, 247, 0.4)',
                    '0 0 10px rgba(168, 85, 247, 0.6)',
                    '0 0 0px rgba(168, 85, 247, 0.4)',
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.8, 1, 0.8],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  {FaUserCircle({ 
                    size: 20, 
                    className: "text-purple-400" 
                  } as IconBaseProps)}
                </motion.div>
              </motion.div>

              {/* Floating particles around icon */}
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-pink-400 rounded-full"
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                    x: [0, (i-1)*8, 0],
                    y: [0, (i-1)*8, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeInOut"
                  }}
                  style={{
                    left: '50%',
                    top: '50%',
                  }}
                />
              ))}
            </motion.div>

            {/* MH Text */}
            <motion.a
              href="#home"
              className="flex items-center gap-2 text-2xl font-bold"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span
                className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
                animate={{
                  backgroundPosition: ['0%', '100%', '0%']
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                style={{
                  backgroundSize: '200% 100%'
                }}
              >
                MH
              </motion.span>
              
              {/* Pulsing dot */}
              <motion.div
                className="w-1 h-1 bg-green-400 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            </motion.a>
          </motion.div>

          {/* Right: Navigation Links */}
          <div className="items-center hidden space-x-8 md:flex">
            {navLinks.map((link, index) => {
              const IconComponent = link.icon;
              const isActive = activeLink === link.href.substring(1);

              return (
                <motion.a
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-2 relative group ${
                    isActive ? "text-white" : "text-gray-300 hover:text-white"
                  }`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <motion.span
                    className="relative"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    {IconComponent({ size: 16 } as IconBaseProps)}
                    {isActive && (
                      <motion.span
                        className="absolute w-2 h-2 rounded-full -top-1 -right-1 bg-gradient-to-r from-purple-400 to-pink-500"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </motion.span>
                  <span>{link.name}</span>

                  <motion.span 
                    className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                  />
                </motion.a>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative p-2 text-gray-300 transition-all duration-300 rounded-lg hover:text-white focus:outline-none hover:bg-white/5"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              {isMenuOpen ? FaTimes({ size: 20 } as IconBaseProps) : FaBars({ size: 20 } as IconBaseProps)}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-[#0f172a]/95 backdrop-blur-md border-t border-white/10"
        >
          <div className="px-4 pt-4 pb-3 space-y-2">
            {navLinks.map((link, index) => {
              const IconComponent = link.icon;
              const isActive = activeLink === link.href.substring(1);

              return (
                <motion.a
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-3 rounded-md transition-all duration-300 relative group ${
                    isActive 
                      ? 'text-white bg-gradient-to-r from-purple-500/20 to-pink-500/20' 
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsMenuOpen(false)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <motion.span
                    className={`p-2 rounded-lg ${
                      isActive 
                        ? 'bg-gradient-to-r from-purple-400 to-pink-500 text-white' 
                        : 'bg-white/5 text-gray-300 group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-500 group-hover:text-white'
                    }`}
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {IconComponent({ size: 16 } as IconBaseProps)}
                  </motion.span>

                  <span className="font-medium">{link.name}</span>
                </motion.a>
              );
            })}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;