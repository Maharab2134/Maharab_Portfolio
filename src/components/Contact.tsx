import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaWhatsapp,
  FaCopy,
  FaCheck,
  FaPaperPlane,
} from "react-icons/fa";
import { PORTFOLIO_INFO } from "../data/portfolioData";

const renderIcon = (Icon: any, props: any = {}) => {
  return <Icon {...props} />;
};

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [copiedEmail, setCopiedEmail] = useState(false);
  const [submittedStatus, setSubmittedStatus] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PORTFOLIO_INFO.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleSubmitWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.message.trim()) return;

    const messageText = `Hi Maharab,%0A%0AMy name is ${encodeURIComponent(
      formData.name
    )} (${encodeURIComponent(formData.email || "No email provided")}).%0A%0ASubject: ${encodeURIComponent(
      formData.subject || "General Inquiry"
    )}%0A%0AMessage:%0A${encodeURIComponent(formData.message)}`;

    const url = `https://wa.me/${PORTFOLIO_INFO.whatsappNumber}?text=${messageText}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setSubmittedStatus("Opening WhatsApp chat with your pre-filled inquiry...");
  };

  const handleSubmitEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.message.trim()) return;

    const subject = encodeURIComponent(formData.subject || `Inquiry from ${formData.name}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    );
    window.location.href = `mailto:${PORTFOLIO_INFO.email}?subject=${subject}&body=${body}`;
    setSubmittedStatus("Opening your default email client...");
  };

  return (
    <section
      id="contact"
      className="relative py-12 sm:py-16 overflow-hidden bg-gradient-to-b from-[#030014] via-[#090e1f] to-[#030014]"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="relative px-4 mx-auto max-w-6xl sm:px-6 lg:px-8">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 sm:mb-12 text-center"
        >
          <span className="text-xs font-semibold tracking-widest uppercase text-cyan-400">
            Start A Conversation
          </span>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
            Get In Touch
          </h2>
          <div className="w-20 h-1 mx-auto mt-4 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400" />
          <p className="max-w-xl mx-auto mt-4 text-sm sm:text-base text-slate-400">
            Have a project in mind, hiring opportunity, or technical question? I'm readily available to connect.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Left Column: Direct Channels */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6 lg:col-span-5"
          >
            <div className="p-6 sm:p-7 border rounded-2xl bg-white/[0.03] border-white/10 backdrop-blur-xl shadow-xl shadow-black/20">
              <h3 className="text-xl font-bold text-white mb-2">
                Let's discuss your vision
              </h3>
              <p className="text-sm leading-relaxed text-slate-300/80 mb-6">
                Whether you need a full-stack engineer for a production system, a mobile app prototype, or team collaboration, feel free to reach out.
              </p>

              <div className="space-y-4">
                {/* Email Item */}
                <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400">
                    {renderIcon(FaEnvelope, { size: 16 })}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Email Address
                    </p>
                    <a
                      href={`mailto:${PORTFOLIO_INFO.email}`}
                      className="text-sm font-semibold text-white hover:text-cyan-300 transition-colors truncate block"
                    >
                      {PORTFOLIO_INFO.email}
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    title="Copy Email"
                    className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                  >
                    {copiedEmail ? renderIcon(FaCheck, { size: 14, className: "text-emerald-400" }) : renderIcon(FaCopy, { size: 14 })}
                  </button>
                </div>

                {/* WhatsApp Item */}
                <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400">
                    {renderIcon(FaWhatsapp, { size: 18 })}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      WhatsApp Chat
                    </p>
                    <a
                      href={PORTFOLIO_INFO.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-white hover:text-emerald-300 transition-colors truncate block"
                    >
                      {PORTFOLIO_INFO.phone}
                    </a>
                  </div>
                </div>

                {/* Phone Item */}
                <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400">
                    {renderIcon(FaPhoneAlt, { size: 15 })}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Phone Number
                    </p>
                    <a
                      href={`tel:${PORTFOLIO_INFO.phone.replace(/\s+/g, "")}`}
                      className="text-sm font-semibold text-white hover:text-cyan-300 transition-colors truncate block"
                    >
                      {PORTFOLIO_INFO.phone}
                    </a>
                  </div>
                </div>

                {/* Location Item */}
                <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400">
                    {renderIcon(FaMapMarkerAlt, { size: 16 })}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Location
                    </p>
                    <a
                      href={PORTFOLIO_INFO.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-white hover:text-pink-300 transition-colors block"
                    >
                      {PORTFOLIO_INFO.location}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Interactive Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7"
          >
            <form
              onSubmit={handleSubmitWhatsApp}
              className="p-6 sm:p-8 border rounded-2xl bg-white/[0.03] border-white/10 backdrop-blur-xl shadow-xl shadow-black/20 space-y-4"
            >
              <h3 className="text-xl font-bold text-white mb-2">
                Send a message
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="contact-name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g. John Doe"
                    className="w-full px-4 py-2.5 text-sm text-white bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-colors placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    id="contact-email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="john@example.com"
                    className="w-full px-4 py-2.5 text-sm text-white bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-colors placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-subject" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Subject
                </label>
                <input
                  type="text"
                  id="contact-subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g. Project Inquiry / Full-Time Role"
                  className="w-full px-4 py-2.5 text-sm text-white bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-colors placeholder:text-slate-500"
                />
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Message *
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Describe your project, timeline, or inquiry..."
                  className="w-full px-4 py-2.5 text-sm text-white bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-colors resize-none placeholder:text-slate-500"
                />
              </div>

              {/* Action Buttons: WhatsApp and Direct Email */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 w-full sm:flex-1 py-3 px-5 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                >
                  {renderIcon(FaWhatsapp, { size: 16 })}
                  <span>Send via WhatsApp Fast-Track</span>
                </button>

                <button
                  type="button"
                  onClick={handleSubmitEmail}
                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto py-3 px-5 text-sm font-semibold text-slate-200 rounded-xl bg-white/5 border border-white/15 hover:bg-white/10 hover:text-white hover:border-purple-400/40 active:scale-[0.98] transition-all duration-200"
                >
                  {renderIcon(FaPaperPlane, { size: 13, className: "text-purple-400" })}
                  <span>Open in Email</span>
                </button>
              </div>

              {submittedStatus && (
                <p className="mt-2 text-xs text-center text-cyan-300 animate-pulse">
                  {submittedStatus}
                </p>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
