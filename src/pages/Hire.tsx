import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPaperPlane,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBriefcase,
  FaCalendarAlt,
  FaFileAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaLinkedin,
  FaGithub,
  FaTwitter,
  FaMapMarkerAlt,
  FaClock,
  FaRocket,
  FaCode,
  FaMobile,
  FaPalette,
} from "react-icons/fa";
import { IconBaseProps } from "react-icons";

const renderIcon = (
  Icon: React.ComponentType<IconBaseProps>,
  props: IconBaseProps = {},
) => {
  return <Icon {...props} />;
};

// Service options
const services = [
  {
    id: "web",
    name: "Web Development",
    icon: FaCode,
    color: "from-blue-400 to-cyan-400",
    description: "Full-stack web applications with modern technologies",
  },
  {
    id: "mobile",
    name: "Mobile App Development",
    icon: FaMobile,
    color: "from-green-400 to-emerald-400",
    description: "Cross-platform mobile apps using Flutter",
  },
  {
    id: "uiux",
    name: "UI/UX Design",
    icon: FaPalette,
    color: "from-pink-400 to-rose-400",
    description: "Beautiful and intuitive user interfaces",
  },
  {
    id: "other",
    name: "Other Services",
    icon: FaRocket,
    color: "from-purple-400 to-violet-400",
    description: "Custom solutions tailored to your needs",
  },
];

// Budget ranges
const budgetRanges = [
  "৳ 50,000",
  "৳ 50,000 - ৳ 1,00,000",
  "৳ 1,00,000 - ৳ 5,00,000",
  "৳ 5,00,000 - ৳ 10,00,000",
  "৳ 10,00,000+",
  "Not Sure Yet",
];

// Timeline options
const timelineOptions = [
  "ASAP",
  "Within 1 month",
  "1-3 months",
  "3-6 months",
  "Flexible",
];

const Hire = () => {
  useEffect(() => {
    const previousTitle = typeof document !== "undefined" ? document.title : "";

    if (typeof document !== "undefined") {
      document.title = "Maharab | Hire Me";
    }

    return () => {
      if (typeof document !== "undefined") {
        document.title = previousTitle;
      }
    };
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: [] as string[],
    budget: "",
    timeline: "",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle service selection (multiple)
  const toggleService = (serviceId: string) => {
    setFormData((prev) => ({
      ...prev,
      service: prev.service.includes(serviceId)
        ? prev.service.filter((s) => s !== serviceId)
        : [...prev.service, serviceId],
    }));
    if (errors.service) {
      setErrors((prev) => ({ ...prev, service: "" }));
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (formData.service.length === 0)
      newErrors.service = "Please select at least one service";
    if (!formData.budget) newErrors.budget = "Please select a budget range";
    if (!formData.timeline) newErrors.timeline = "Please select a timeline";
    if (!formData.message.trim())
      newErrors.message = "Please describe your project";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");

    const phoneNumber = "8801586282609";
    const serviceText = formData.service
      .map(
        (serviceId) =>
          services.find((service) => service.id === serviceId)?.name,
      )
      .filter(Boolean)
      .join(", ");

    const message = [
      `Name: ${formData.name}`,
      `Email: ${formData.email}`,
      `Phone: ${formData.phone || "N/A"}`,
      `Company: ${formData.company || "N/A"}`,
      `Services: ${serviceText || "N/A"}`,
      `Budget: ${formData.budget}`,
      `Timeline: ${formData.timeline}`,
      `Message: ${formData.message}`,
    ].join("%0A");

    const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;

    window.open(whatsappURL, "_blank", "noopener,noreferrer");

    setIsSubmitting(false);
    setSubmitStatus("success");

    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        service: [],
        budget: "",
        timeline: "",
        message: "",
      });
      setSubmitStatus("idle");
    }, 3000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0f1e] via-[#0f172a] to-[#0a0f1e] text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-[120px]"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/15 rounded-full blur-[140px]"
        animate={{
          x: [0, -30, 0],
          y: [0, 50, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative px-4 py-24 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium border rounded-full bg-white/5 border-white/10 backdrop-blur-xl"
          >
            <motion.span
              className="relative flex w-2.5 h-2.5"
              aria-hidden="true"
            >
              <span className="absolute inline-flex w-full h-full bg-green-400 rounded-full opacity-75 animate-ping" />
              <span className="relative inline-flex w-2.5 h-2.5 bg-green-500 rounded-full" />
            </motion.span>
            Available for New Projects
          </motion.div>

          <h1 className="mb-6 text-5xl font-bold md:text-7xl">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">
              Let's Work Together
            </span>
          </h1>

          <p className="max-w-2xl mx-auto mb-8 text-lg text-white/70 md:text-xl">
            Have a project in mind? Fill out the form below and I'll get back to
            you within 24 hours.
          </p>
        </motion.div>

        <div className="grid max-w-6xl grid-cols-1 gap-12 mx-auto lg:grid-cols-3">
          {/* Contact Info Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6 lg:col-span-1"
          >
            {/* Contact Card */}
            <div className="p-6 border shadow-xl backdrop-blur-xl bg-white/5 rounded-2xl border-white/10">
              <h3 className="mb-6 text-xl font-bold text-white">
                Contact Information
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full bg-purple-500/20">
                    {renderIcon(
                      FaEnvelope as React.ComponentType<IconBaseProps>,
                      {
                        size: 18,
                        className: "text-purple-400",
                      },
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-white/50">Email</p>
                    <a
                      href="mailto:maharab442@gmail.com"
                      className="text-sm font-medium text-white/90 hover:text-purple-400"
                    >
                      maharab442@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full bg-pink-500/20">
                    {renderIcon(
                      FaMapMarkerAlt as React.ComponentType<IconBaseProps>,
                      {
                        size: 18,
                        className: "text-pink-400",
                      },
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-white/50">Location</p>
                    <p className="text-sm font-medium text-white/90">
                      Dhaka, Bangladesh 🇧🇩
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full bg-cyan-500/20">
                    {renderIcon(FaClock as React.ComponentType<IconBaseProps>, {
                      size: 18,
                      className: "text-cyan-400",
                    })}
                  </div>
                  <div>
                    <p className="text-sm text-white/50">Response Time</p>
                    <p className="text-sm font-medium text-white/90">
                      Within 24 hours
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="p-6 border shadow-xl backdrop-blur-xl bg-white/5 rounded-2xl border-white/10">
              <h3 className="mb-4 text-xl font-bold text-white">
                Connect With Me
              </h3>
              <div className="flex gap-3">
                {[
                  {
                    icon: FaLinkedin,
                    href: "https://www.linkedin.com/in/md-maharab-hosen-679a70253/",
                    color: "hover:bg-blue-500/20 hover:text-blue-400",
                  },
                  {
                    icon: FaGithub,
                    href: "https://github.com/Maharab2134",
                    color: "hover:bg-gray-500/20 hover:text-gray-300",
                  },
                  {
                    icon: FaTwitter,
                    href: "https://x.com/Mahar22234",
                    color: "hover:bg-cyan-500/20 hover:text-cyan-400",
                  },
                ].map((social, i) => (
                  <motion.a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center w-12 h-12 border rounded-full bg-white/5 border-white/10 text-white/60 transition-all duration-300 ${social.color}`}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {renderIcon(
                      social.icon as React.ComponentType<IconBaseProps>,
                      { size: 20 },
                    )}
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Why Hire Me */}
            <div className="p-6 border shadow-xl backdrop-blur-xl bg-white/5 rounded-2xl border-white/10">
              <h3 className="mb-4 text-xl font-bold text-white">
                Why Choose Me?
              </h3>
              <ul className="space-y-3">
                {[
                  "2+ years of experience",
                  "50+ completed projects",
                  "Fast & reliable delivery",
                  "Clean, maintainable code",
                  "Ongoing support",
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="flex items-center gap-2 text-sm text-white/80"
                  >
                    {renderIcon(
                      FaCheckCircle as React.ComponentType<IconBaseProps>,
                      {
                        size: 14,
                        className: "text-green-400 flex-shrink-0",
                      },
                    )}
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Main Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <form
              onSubmit={handleSubmit}
              className="p-8 border shadow-xl backdrop-blur-xl bg-white/5 rounded-2xl border-white/10"
            >
              <h2 className="mb-8 text-2xl font-bold text-white">
                Project Details
              </h2>

              <div className="space-y-6">
                {/* Name & Email */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-white/90"
                    >
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        {renderIcon(
                          FaUser as React.ComponentType<IconBaseProps>,
                          {
                            size: 16,
                            className: "text-white/30",
                          },
                        )}
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-4 py-3 bg-white/5 border ${
                          errors.name ? "border-red-500" : "border-white/10"
                        } rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all`}
                        placeholder="John Doe"
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-400">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-white/90"
                    >
                      Email Address <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        {renderIcon(
                          FaEnvelope as React.ComponentType<IconBaseProps>,
                          {
                            size: 16,
                            className: "text-white/30",
                          },
                        )}
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-4 py-3 bg-white/5 border ${
                          errors.email ? "border-red-500" : "border-white/10"
                        } rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all`}
                        placeholder="john@example.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-400">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Phone & Company */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="block mb-2 text-sm font-medium text-white/90"
                    >
                      Phone Number (Optional)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        {renderIcon(
                          FaPhone as React.ComponentType<IconBaseProps>,
                          {
                            size: 16,
                            className: "text-white/30",
                          },
                        )}
                      </div>
                      <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        inputMode="numeric"
                        pattern="[0-9+\s-]*"
                        className="w-full py-3 pl-12 pr-4 text-white transition-all border bg-white/5 border-white/10 rounded-xl placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        placeholder="+880 1234567890"
                      />
                    </div>
                  </div>

                  {/* Company */}
                  <div>
                    <label
                      htmlFor="company"
                      className="block mb-2 text-sm font-medium text-white/90"
                    >
                      Company (Optional)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        {renderIcon(
                          FaBriefcase as React.ComponentType<IconBaseProps>,
                          {
                            size: 16,
                            className: "text-white/30",
                          },
                        )}
                      </div>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full py-3 pl-12 pr-4 text-white transition-all border bg-white/5 border-white/10 rounded-xl placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        placeholder="Your Company"
                      />
                    </div>
                  </div>
                </div>

                {/* Services */}
                <div>
                  <label className="block mb-3 text-sm font-medium text-white/90">
                    Services Needed <span className="text-red-400">*</span>
                  </label>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {services.map((service) => (
                      <motion.button
                        key={service.id}
                        type="button"
                        onClick={() => toggleService(service.id)}
                        className={`relative p-4 border rounded-xl transition-all duration-300 text-left ${
                          formData.service.includes(service.id)
                            ? "bg-white/10 border-purple-500/50"
                            : "bg-white/5 border-white/10 hover:bg-white/10"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br ${service.color} bg-opacity-20`}
                          >
                            {renderIcon(
                              service.icon as React.ComponentType<IconBaseProps>,
                              {
                                size: 20,
                                className: "text-white",
                              },
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="mb-1 text-sm font-semibold text-white">
                              {service.name}
                            </h4>
                            <p className="text-xs text-white/50">
                              {service.description}
                            </p>
                          </div>
                          {formData.service.includes(service.id) && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="flex-shrink-0"
                            >
                              {renderIcon(
                                FaCheckCircle as React.ComponentType<IconBaseProps>,
                                {
                                  size: 20,
                                  className: "text-green-400",
                                },
                              )}
                            </motion.div>
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                  {errors.service && (
                    <p className="mt-2 text-xs text-red-400">
                      {errors.service}
                    </p>
                  )}
                </div>

                {/* Budget & Timeline */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Budget */}
                  <div>
                    <label
                      htmlFor="budget"
                      className="block mb-2 text-sm font-medium text-white/90"
                    >
                      Budget Range <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <span className="text-lg font-semibold text-white/30">
                          ৳
                        </span>
                      </div>
                      <select
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-4 py-3 bg-white/5 border ${
                          errors.budget ? "border-red-500" : "border-white/10"
                        } rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all appearance-none cursor-pointer`}
                      >
                        <option value="" className="bg-[#0f172a]">
                          Select budget
                        </option>
                        {budgetRanges.map((range) => (
                          <option
                            key={range}
                            value={range}
                            className="bg-[#0f172a]"
                          >
                            {range}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.budget && (
                      <p className="mt-1 text-xs text-red-400">
                        {errors.budget}
                      </p>
                    )}
                  </div>

                  {/* Timeline */}
                  <div>
                    <label
                      htmlFor="timeline"
                      className="block mb-2 text-sm font-medium text-white/90"
                    >
                      Project Timeline <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        {renderIcon(
                          FaCalendarAlt as React.ComponentType<IconBaseProps>,
                          {
                            size: 16,
                            className: "text-white/30",
                          },
                        )}
                      </div>
                      <select
                        id="timeline"
                        name="timeline"
                        value={formData.timeline}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-4 py-3 bg-white/5 border ${
                          errors.timeline ? "border-red-500" : "border-white/10"
                        } rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all appearance-none cursor-pointer`}
                      >
                        <option value="" className="bg-[#0f172a]">
                          Select timeline
                        </option>
                        {timelineOptions.map((option) => (
                          <option
                            key={option}
                            value={option}
                            className="bg-[#0f172a]"
                          >
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.timeline && (
                      <p className="mt-1 text-xs text-red-400">
                        {errors.timeline}
                      </p>
                    )}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block mb-2 text-sm font-medium text-white/90"
                  >
                    Project Description <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute pointer-events-none top-3 left-4">
                      {renderIcon(
                        FaFileAlt as React.ComponentType<IconBaseProps>,
                        {
                          size: 16,
                          className: "text-white/30",
                        },
                      )}
                    </div>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className={`w-full pl-12 pr-4 py-3 bg-white/5 border ${
                        errors.message ? "border-red-500" : "border-white/10"
                      } rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all resize-none`}
                      placeholder="Tell me about your project, goals, and any specific requirements..."
                    />
                  </div>
                  {errors.message && (
                    <p className="mt-1 text-xs text-red-400">
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full px-8 py-4 text-base font-semibold text-white rounded-xl transition-all duration-300 ${
                    isSubmitting
                      ? "bg-white/10 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-[0_0_30px_rgba(147,51,234,0.5)]"
                  }`}
                  whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                  whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                >
                  <span className="flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <>
                        <motion.div
                          className="w-5 h-5 border-2 border-white rounded-full border-t-transparent"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                        Sending...
                      </>
                    ) : (
                      <>
                        {renderIcon(
                          FaPaperPlane as React.ComponentType<IconBaseProps>,
                          { size: 18 },
                        )}
                        Send Message
                      </>
                    )}
                  </span>
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>

        {/* Success/Error Modal */}
        <AnimatePresence>
          {submitStatus !== "idle" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm"
              onClick={() => setSubmitStatus("idle")}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative max-w-md p-8 text-center border shadow-2xl bg-white/5 rounded-2xl border-white/10 backdrop-blur-xl"
                onClick={(e) => e.stopPropagation()}
              >
                {submitStatus === "success" ? (
                  <>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 15,
                      }}
                      className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20"
                    >
                      {renderIcon(
                        FaCheckCircle as React.ComponentType<IconBaseProps>,
                        {
                          size: 48,
                          className: "text-green-400",
                        },
                      )}
                    </motion.div>
                    <h3 className="mb-3 text-2xl font-bold text-white">
                      WhatsApp Opened! 🎉
                    </h3>
                    <p className="mb-6 text-white/70">
                      Your message is ready in WhatsApp. Send it to complete the
                      request.
                    </p>
                  </>
                ) : (
                  <>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20"
                    >
                      {renderIcon(
                        FaTimesCircle as React.ComponentType<IconBaseProps>,
                        {
                          size: 48,
                          className: "text-red-400",
                        },
                      )}
                    </motion.div>
                    <h3 className="mb-3 text-2xl font-bold text-white">
                      Oops! Something went wrong
                    </h3>
                    <p className="mb-6 text-white/70">
                      Please try again or contact me directly via email.
                    </p>
                  </>
                )}
                <motion.button
                  onClick={() => setSubmitStatus("idle")}
                  className="px-6 py-2 text-sm font-semibold text-white transition-all duration-300 border rounded-full bg-white/10 border-white/20 hover:bg-white/20"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Close
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Decorative Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-20"
            style={{
              width: Math.random() * 4 + 2,
              height: Math.random() * 4 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.5, 0.1],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </main>
  );
};

export default Hire;
