import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaTwitter, FaHeart, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative py-12 bg-gradient-to-b from-[#0f172a] to-[#020617]">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* About Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="text-xl font-semibold text-white">About Me</h3>
            <p className="text-gray-400">
              A passionate full-stack developer dedicated to creating beautiful and functional web applications.
            </p>
            <div className="flex space-x-4">
              <motion.a
                href="https://github.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                {FaGithub({ size: 20 })}
              </motion.a>
              <motion.a
                href="https://linkedin.com/in/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                {FaLinkedin({ size: 20 })}
              </motion.a>
              <motion.a
                href="https://twitter.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                {FaTwitter({ size: 20 })}
              </motion.a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="text-xl font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2">
              {['Home', 'About', 'Projects', 'Skills', 'Contact'].map((item, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {item}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="text-xl font-semibold text-white">Contact Info</h3>
            <ul className="space-y-4">
              <motion.li
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
                className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors"
              >
                <motion.span
                  className="text-secondary"
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.2 }}
                >
                  {FaEnvelope({ size: 20 })}
                </motion.span>
                <a href="mailto:maharab442@gmail.com" className="hover:text-white transition-colors">
                  maharab442@gmail.com
                </a>
              </motion.li>
              <motion.li
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
                className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors"
              >
                <motion.span
                  className="text-secondary"
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.2 }}
                >
                  {FaPhone({ size: 20 })}
                </motion.span>
                <a href="tel:+8801586282609" className="hover:text-white transition-colors">
                  +880 15862 82609
                </a>
              </motion.li>
              <motion.li
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
                className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors"
              >
                <motion.span
                  className="text-secondary"
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.2 }}
                >
                  {FaMapMarkerAlt({ size: 20 })}
                </motion.span>
                <span>Your Location, City, Country</span>
              </motion.li>
            </ul>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="pt-8 mt-8 text-center border-t border-gray-800"
        >
          <p className="text-gray-400">
            © {currentYear} Md. Maharab Hosen. Made with{' '}
            <motion.span
              className="inline-block text-red-500"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              {FaHeart({ size: 16 })}
            </motion.span>{' '}
            and{' '}
            <motion.span
              className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              passion
            </motion.span>
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer; 