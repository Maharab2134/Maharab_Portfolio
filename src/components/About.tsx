import { motion } from 'framer-motion';
import { FaDownload } from 'react-icons/fa';

const About = () => {
  return (
    <section id="about" className="py-20 bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] relative">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-textPrimary">About Me</h2>
          <motion.div 
            className="w-20 h-1 mx-auto bg-secondary"
            initial={{ width: 0 }}
            whileInView={{ width: "5rem" }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
        </motion.div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="relative flex justify-center"
          >
            {/* Main Image Container */}
            <motion.div
              className="relative w-full max-w-sm overflow-hidden rounded-3xl group"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="absolute inset-0 rounded-xl"
                animate={{
                  boxShadow: [
                    '0 0 0 0 rgba(147, 51, 234, 0)',
                    '0 0 0 10px rgba(147, 51, 234, 0.1)',
                    '0 0 0 0 rgba(147, 51, 234, 0)'
                  ]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              <motion.img
                src="/images/img.jpg"
                alt="Md. Maharab Hosen"
                className="object-contain w-full h-full transition-transform duration-700 group-hover:scale-110 group-hover:brightness-110"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true }}
                style={{ objectPosition: 'center center' }}
                whileHover={{ rotateY: 360 }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  console.error('Image failed to load:', target.src);
                  target.src = '/images/image.png'; // Fallback to the existing image
                }}
                loading="eager"
                decoding="async"
              />

              <motion.div
                className="absolute inset-0 transition-all duration-500 opacity-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent group-hover:opacity-100"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              />

              <motion.div
                className="absolute bottom-0 left-0 right-0 p-8 text-white transition-all duration-500 opacity-0 group-hover:opacity-100"
                initial={{ y: 20, opacity: 0 }}
                whileHover={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
                >
                  <h3 className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text">
                    Full Stack Developer
                  </h3>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-2xl font-semibold text-white"
            >
              <span className="text-3xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text">
                I am Md. Maharab Hosen
              </span>
            </motion.h3>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="leading-relaxed text-gray-300"
            >
              A passionate full-stack developer with expertise in creating beautiful and functional web applications. 
              With a strong foundation in both front-end and back-end development, I strive to build seamless user 
              experiences that combine aesthetic appeal with robust functionality.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="space-y-4"
            >
              <h4 className="text-xl font-semibold text-white">What I Do</h4>
              <ul className="space-y-3">
                {[
                  'Full Stack Web Development',
                  'Mobile App Development',
                  'UI/UX Design',
                  'Database Design & Management',
                  'API Development & Integration',
                  'Performance Optimization'
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    className="flex items-center space-x-2 text-gray-300"
                  >
                    <motion.span
                      className="w-2 h-2 rounded-full bg-secondary"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: index * 0.2 }}
                    />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="pt-4"
            >
              <motion.a
                href="/pdf/"
                download
                className="inline-flex items-center px-6 py-3 text-white transition-all duration-300 border-2 rounded-full border-secondary hover:bg-secondary/10"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span
                  className="mr-2"
                  animate={{ y: [0, -2, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {FaDownload({ size: 20 })}
                </motion.span>
                Download Resume
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Background Decoration */}
      <motion.div 
        className="absolute inset-0 -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-tertiary/50 to-primary/50"
          animate={{ 
            backgroundPosition: ['0% 0%', '100% 100%'],
            opacity: [0.5, 0.7, 0.5]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            repeatType: 'reverse'
          }}
        />
        
        {/* Subtle Floating Particles */}
        <motion.div className="absolute inset-0">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-secondary rounded-full opacity-50 blur-[0.5px]"
              animate={{
                x: [0, (Math.random() - 0.5) * 100, 0],
                y: [0, (Math.random() - 0.5) * 100, 0],
                opacity: [0.3, 0.6, 0.3],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{
                duration: Math.random() * 5 + 5, // Duration between 5 and 10 seconds
                repeat: Infinity,
                repeatType: 'mirror',
                delay: i * 0.5
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default About;
