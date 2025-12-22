import { motion } from "framer-motion";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState({
    type: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const message = `Name: ${formData.name}%0AEmail: ${formData.email}%0AMessage: ${formData.message}`;
    const phoneNumber = "8801586282609";

    const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;

    window.open(whatsappURL, "_blank");

    setFormData({ name: "", email: "", message: "" });
    setStatus({
      type: "success",
      message: "Opening WhatsApp...",
    });
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
          {/* Contact Info */}
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
                question or just want to say hi, I'll try my best to get back to
                you!
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
                  href="tel:+8801586282609"
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
                  Rupnagar R/A, Road - 08, Mirpur - 02, Dhaka - 1216
                </span>
              </motion.div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <motion.form
              onSubmit={handleSubmit}
              className="w-full max-w-md p-6 mx-auto space-y-4 border rounded-lg bg-tertiary/50 backdrop-blur-sm border-secondary/20"
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
                  className="w-full px-3 py-2 text-white border rounded-md bg-white/10 border-white/20 focus:outline-none focus:ring-secondary focus:border-secondary"
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
                  className="w-full px-3 py-2 text-white border rounded-md bg-white/10 border-white/20 focus:outline-none focus:ring-secondary focus:border-secondary"
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
                  className="w-full px-3 py-2 text-white border rounded-md resize-none bg-white/10 border-white/20 focus:outline-none focus:ring-secondary focus:border-secondary"
                  required
                ></textarea>
              </div>

              <motion.button
                type="submit"
                className="w-full px-4 py-2 font-semibold text-white transition-colors rounded-md bg-secondary/30 hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:ring-offset-2 focus:ring-offset-primary disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Send Message
              </motion.button>

              {status.message && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-4 text-center text-sm ${
                    status.type === "success" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {status.message}
                </motion.p>
              )}
            </motion.form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
