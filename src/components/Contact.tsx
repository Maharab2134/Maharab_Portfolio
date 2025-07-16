import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState({
    type: '',
    message: '',
  });

  useEffect(() => {
    // Initialize EmailJS with your public key
    emailjs.init('YOUR_PUBLIC_KEY');
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: 'Sending message...' });

    try {
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        to_name: 'Md. Maharab Hosen',
        to_email: 'maharabhosen365@gmail.com',
        message: formData.message,
      };

      const response = await emailjs.send(
        'YOUR_SERVICE_ID',
        'YOUR_TEMPLATE_ID',
        templateParams,
        'YOUR_PUBLIC_KEY'
      );

      if (response.status === 200) {
        setStatus({ 
          type: 'success', 
          message: 'Message sent successfully! I will get back to you soon.' 
        });
        setFormData({ name: '', email: '', message: '' });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setStatus({
        type: 'error',
        message: 'Failed to send message. Please try again later or contact me directly via email.',
      });
    }
  };

  return (
    <section id="contact" className="relative py-20">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-textPrimary">
            Get In Touch
          </h2>
          <motion.div 
            className="w-20 h-1 mx-auto bg-secondary"
            initial={{ width: 0 }}
            whileInView={{ width: "5rem" }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
        </motion.div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="mb-6 text-2xl font-semibold text-textPrimary">
                Let's Connect
              </h3>
              <p className="text-lg text-textSecondary">
                I'm currently looking for new opportunities. Whether you have a
                question or just want to say hi, I'll try my best to get back to you!
              </p>
            </div>

            <div className="space-y-4">
              <motion.div 
                className="flex items-center space-x-4"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div 
                  className="w-6 h-6 text-secondary"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  {FaEnvelope({ size: 24 })}
                </motion.div>
                <a
                  href="mailto:maharab442@gmail.com"
                  className="transition-colors duration-300 text-textSecondary hover:text-secondary"
                >
                  maharab442@gmail.com
                </a>
              </motion.div>
              <motion.div 
                className="flex items-center space-x-4"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div 
                  className="w-6 h-6 text-secondary"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  {FaPhone({ size: 24 })}
                </motion.div>
                <a
                  href="tel:+880 15862 82609"
                  className="transition-colors duration-300 text-textSecondary hover:text-secondary"
                >
                  +880 15862 82609
                </a>
              </motion.div>
              <motion.div 
                className="flex items-center space-x-4"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div 
                  className="w-6 h-6 text-secondary"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  {FaMapMarkerAlt({ size: 24 })}
                </motion.div>
                <span className="text-textSecondary">
                  Your Location, City, Country
                </span>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              onSubmit={handleSubmit}
              className="w-full max-w-md mx-auto space-y-4 p-6 bg-tertiary/50 backdrop-blur-sm rounded-lg border border-secondary/20"
            >
              <div>
                <label htmlFor="name" className="block mb-1 text-sm font-medium text-white">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-white bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-secondary focus:border-secondary"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block mb-1 text-sm font-medium text-white">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-white bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-secondary focus:border-secondary"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block mb-1 text-sm font-medium text-white">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 text-white bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-secondary focus:border-secondary resize-none"
                  required
                ></textarea>
              </div>

              <motion.button
                type="submit"
                className="w-full px-4 py-2 font-semibold text-white transition-colors rounded-md bg-secondary/30 hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:ring-offset-2 focus:ring-offset-primary disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={status.type === 'loading'}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {status.type === 'loading' ? 'Sending...' : 'Send Message'}
              </motion.button>

              {status.message && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={
                    `mt-4 text-center text-sm ` +
                    (status.type === 'success' ? 'text-green-500' : 'text-red-500')
                  }
                >
                  {status.message}
                </motion.p>
              )}
            </motion.form>
          </motion.div>
        </div>
      </div>

      {/* Background decoration */}
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
      </motion.div>
    </section>
  );
};

export default Contact; 