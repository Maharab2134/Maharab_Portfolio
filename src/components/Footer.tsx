import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaTwitter, FaHeart, FaEnvelope, FaPhone, FaMapMarkerAlt, FaArrowUp } from 'react-icons/fa';
import { IconBaseProps } from 'react-icons';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    {
      icon: FaGithub,
      href: "https://github.com/Maharab2134",
      color: "hover:text-gray-300",
      bgColor: "hover:bg-gray-700",
      name: "GitHub"
    },
    {
      icon: FaLinkedin,
      href: "https://www.linkedin.com/in/md-maharab-hosen-679a70253/",
      color: "hover:text-blue-400",
      bgColor: "hover:bg-blue-500/20",
      name: "LinkedIn"
    },
    {
      icon: FaTwitter,
      href: "https://twitter.com/yourusername",
      color: "hover:text-blue-300",
      bgColor: "hover:bg-blue-400/20",
      name: "Twitter"
    }
  ];

  const quickLinks = ['Home', 'About', 'Education', 'Skills', 'Projects', 'Contact'];

  return (
    <footer className="relative py-16 bg-gradient-to-b from-[#0f172a] via-[#1e1b4b] to-[#0f172a] overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Animated Gradient Orbs */}
        <motion.div
          className="absolute rounded-full -top-20 -left-20 w-72 h-72 bg-purple-500/10 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div
          className="absolute rounded-full -bottom-20 -right-20 w-72 h-72 bg-pink-500/10 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      <div className="relative z-10 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 lg:gap-16">
          {/* Brand & Social Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
                <span className="text-lg font-bold text-white">MH</span>
              </div>
              <h3 className="text-2xl font-bold text-white">Md. Maharab Hosen</h3>
            </motion.div>
            
            <p className="leading-relaxed text-gray-300">
              Passionate full-stack developer crafting digital experiences with cutting-edge technologies. 
              Turning ideas into reality through code and creativity.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 transition-all duration-300 ${social.color} ${social.bgColor}`}
                  whileHover={{ 
                    scale: 1.1, 
                    y: -5,
                    rotate: [0, -5, 5, 0]
                  }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  {social.icon({ size: 20 } as IconBaseProps)}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-xl font-semibold text-transparent text-white bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
              Quick Navigation
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((item, index) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <motion.a
                    href={`#${item.toLowerCase()}`}
                    className="flex items-center space-x-3 text-gray-300 transition-all duration-300 group hover:text-white"
                    whileHover={{ x: 10 }}
                  >
                    <motion.span
                      className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400"
                      whileHover={{ scale: 1.5 }}
                    />
                    <span className="group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text group-hover:text-transparent">
                      {item}
                    </span>
                  </motion.a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-xl font-semibold text-transparent text-white bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
              Get In Touch
            </h3>
            <ul className="space-y-4">
              {[
                {
                  icon: FaEnvelope,
                  content: "maharab442@gmail.com",
                  href: "mailto:maharab442@gmail.com",
                  color: "from-purple-400 to-pink-400"
                },
                {
                  icon: FaPhone,
                  content: "+880 15862 82609",
                  href: "tel:+8801586282609",
                  color: "from-green-400 to-blue-400"
                },
                {
                  icon: FaMapMarkerAlt,
                  content: "Rupnagar R/A Mirpur - 02, Dhaka, Bangladesh",
                  href: "#",
                  color: "from-orange-400 to-red-400"
                }
              ].map((contact, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start space-x-4 group"
                >
                  <motion.div
                    className={`p-2 rounded-lg bg-gradient-to-r ${contact.color} mt-1`}
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    {contact.icon({ size: 16, className: "text-white" } as IconBaseProps)}
                  </motion.div>
                  <a
                    href={contact.href}
                    className="text-gray-300 transition-all duration-300 group-hover:text-white group-hover:translate-x-2"
                  >
                    {contact.content}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Copyright & Back to Top */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="pt-12 mt-12 text-center border-t border-white/10"
        >
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <motion.p
              className="text-gray-400"
              whileHover={{ scale: 1.05 }}
            >
              © {currentYear} Md. Maharab Hosen. Crafted with{' '}
              <motion.span
                className="inline-block text-red-500"
                animate={{ 
                  scale: [1, 1.3, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                {FaHeart({ size: 16 } as IconBaseProps)}
              </motion.span>{' '}
              and{' '}
              <motion.span
                className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500"
                animate={{ 
                  backgroundPosition: ['0%', '100%', '0%'] 
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity 
                }}
                style={{ 
                  backgroundSize: '200% 100%' 
                }}
              >
                endless passion
              </motion.span>
            </motion.p>

            {/* Back to Top Button */}
            <motion.button
              onClick={scrollToTop}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all duration-300 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 ring-1 ring-white/20 hover:ring-white/30"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="inline-flex items-center justify-center w-5 h-5 bg-white/20 rounded-full">
                {FaArrowUp({ size: 12 } as IconBaseProps)}
              </span>
              Back to top
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-40"
            animate={{
              y: [0, -30, 0],
              x: [0, (Math.random() - 0.5) * 20, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>
    </footer>
  );
};

export default Footer;