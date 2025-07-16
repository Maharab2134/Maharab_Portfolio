import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { HiOutlineHandRaised } from 'react-icons/hi2';
import { TypeAnimation } from 'react-type-animation';
import { useState, useEffect } from 'react';

const Hero = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > window.innerHeight / 2);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative bg-gradient-to-tr from-[#0f172a] via-[#1e293b] to-[#0f172a] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight"
        >
          <div className="mb-4 text-2xl sm:text-3xl md:text-4xl font-medium">
            <motion.span 
              className="inline-block ml-2"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
            >
              {HiOutlineHandRaised({ size: 36 })}
            </motion.span> Hey there!
          </div>
          <div className="text-4xl sm:text-5xl md:text-6xl">
            I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">Md. Maharab Hosen</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="text-lg sm:text-xl md:text-2xl font-medium text-gray-300 mb-10 tracking-wide"
        >
          <div className="inline-flex items-center h-[2.5em]">
            <span className="mr-4 text-white/80 font-light">I specialize in</span>
            <TypeAnimation
              sequence={[
                'App Development',
                2000,
                'Web Development',
                2000,
                'ML Development',
                2000,
                'UI/UX Design',
                2000,
                'Full Stack Development',
                2000,
              ]}
              wrapper="span"
              speed={30}
              repeat={Infinity}
              className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 font-semibold whitespace-nowrap"
            />
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto mb-14 leading-relaxed font-light"
        >
          Passionate about crafting seamless digital solutions, blending code and design to create immersive web experiences that captivate and connect.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center space-y-6"
        >
          <div className="flex justify-center space-x-6 mb-8">
            <motion.a
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-white transition-all duration-300"
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              {FaGithub({ size: 28 })}
            </motion.a>
            <motion.a
              href="https://linkedin.com/in/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-white transition-all duration-300"
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              {FaLinkedin({ size: 28 })}
            </motion.a>
            <motion.a
              href="https://twitter.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-white transition-all duration-300"
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              {FaTwitter({ size: 28 })}
            </motion.a>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href="#about"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 20px rgba(168, 85, 247, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium text-lg transition-all duration-300 flex items-center gap-2"
            >
              <motion.span 
                className="inline-block"
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {HiOutlineHandRaised({ size: 20 })}
              </motion.span>
              About Me
            </motion.a>
          </div>
        </motion.div>
      </div>

      <motion.div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl -top-40 -left-40"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1],
            x: [-20, 20, -20],
            y: [-20, 20, -20]
          }}
          transition={{ duration: 16, repeat: Infinity, repeatType: 'reverse' }}
        />
        <motion.div
          className="absolute w-[600px] h-[600px] bg-pink-500/10 rounded-full blur-3xl -bottom-40 -right-40"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.1, 0.2],
            x: [20, -20, 20],
            y: [20, -20, 20]
          }}
          transition={{ duration: 16, repeat: Infinity, repeatType: 'reverse' }}
        />

        {/* Subtle Floating Particles */}
        <motion.div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-white rounded-full opacity-30 blur-[0.5px]"
              animate={{
                x: [0, (Math.random() - 0.5) * 50, 0],
                y: [0, (Math.random() - 0.5) * 50, 0],
                opacity: [0.2, 0.5, 0.2],
                scale: [0.6, 1, 0.6]
              }}
              transition={{
                duration: Math.random() * 8 + 8, // Duration between 8 and 16 seconds
                repeat: Infinity,
                repeatType: 'mirror',
                delay: i * 0.3
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll to Top Button */}
      <motion.div 
        className="fixed bottom-8 right-8 text-white/60 cursor-pointer z-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: showScrollTop ? 1 : 0,
          y: showScrollTop ? 0 : 20
        }}
        transition={{ duration: 0.3 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <motion.span 
          className="text-4xl block"
          animate={{ y: [0, -5, 0] }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          ⌃
        </motion.span>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 cursor-pointer z-50"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 1,
          y: [0, 10, 0]
        }}
        transition={{ 
          opacity: { duration: 1, delay: 1 },
          y: { 
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
      >
        <span className="text-4xl">⌄</span>
      </motion.div>
    </section>
  );
};

export default Hero;
 