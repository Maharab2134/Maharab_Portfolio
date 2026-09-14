import React, { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaPaperPlane,
  FaWhatsapp,
  FaCheckCircle,
  FaCode,
  FaMobileAlt,
  FaServer,
  FaRocket,
  FaShieldAlt,
  FaClock,
} from "react-icons/fa";
import { PORTFOLIO_INFO } from "../data/portfolioData";
import { useLiveProfile, recordContactInquiry } from "../lib/portfolioService";

const renderIcon = (Icon: any, props: any = {}) => {
  return <Icon {...props} />;
};

const SERVICES = [
  {
    id: "web",
    name: "Full-Stack Web App",
    icon: FaCode,
    desc: "React, Next.js, Node.js, and database architecture",
  },
  {
    id: "mobile",
    name: "Mobile App Development",
    icon: FaMobileAlt,
    desc: "Cross-platform iOS and Android apps with Flutter",
  },
  {
    id: "api",
    name: "Backend & RESTful API",
    icon: FaServer,
    desc: "Scalable microservices, database schemas, and auth security",
  },
  {
    id: "consulting",
    name: "Technical Consultation",
    icon: FaRocket,
    desc: "Architecture review, code optimization, and MVP design",
  },
];

const Hire: React.FC = () => {
  const profile = useLiveProfile();
  const name = profile.name || PORTFOLIO_INFO.name;
  const email = profile.email || PORTFOLIO_INFO.email;
  const rawWhatsapp = profile.whatsappNumber || PORTFOLIO_INFO.whatsappNumber || profile.phone || PORTFOLIO_INFO.phone;
  const whatsappNumber = rawWhatsapp.replace(/\D+/g, "");

  useEffect(() => {
    document.title = `Hire ${name} | Software Engineer`;
    window.scrollTo({ top: 0, behavior: "smooth" });
    return () => {
      document.title = `${name} | Portfolio`;
    };
  }, [name]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    selectedServices: [] as string[],
    timeline: "1-3 months",
    budget: "$1,000 - $3,000",
    description: "",
  });

  const [submittedStatus, setSubmittedStatus] = useState<string | null>(null);

  const toggleService = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(id)
        ? prev.selectedServices.filter((s) => s !== id)
        : [...prev.selectedServices, id],
    }));
  };

  const handleReturnHome = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.hash = "";
    window.location.href = "/";
  };

  const handleSubmitWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.description.trim()) {
      alert("Please fill in your name, email, and project description.");
      return;
    }

    const servicesText = formData.selectedServices
      .map((sid) => SERVICES.find((s) => s.id === sid)?.name)
      .filter(Boolean)
      .join(", ");

    recordContactInquiry({
      name: formData.name,
      email: formData.email,
      subject: `[Let's Collaborate - WhatsApp] ${formData.timeline} (${formData.budget})`,
      message: `Company: ${formData.company || "Independent"}\nServices: ${servicesText || "General Engineering"}\nTimeline: ${formData.timeline}\nBudget: ${formData.budget}\n\nProject Scope:\n${formData.description}`,
      source: "hire",
    });

    const text = [
      `*New Project Inquiry via Portfolio*`,
      `*Name:* ${formData.name}`,
      `*Email:* ${formData.email}`,
      `*Company:* ${formData.company || "Independent"}`,
      `*Services:* ${servicesText || "General Engineering"}`,
      `*Estimated Timeline:* ${formData.timeline}`,
      `*Budget Range:* ${formData.budget}`,
      `*Project Scope:* ${formData.description}`,
    ].join("%0A%0A");

    const url = `https://wa.me/${whatsappNumber}?text=${text}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setSubmittedStatus("Inquiry recorded! Redirecting to WhatsApp to send your brief...");
  };

  const handleSubmitEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.description.trim()) {
      setSubmittedStatus("Please fill in your name, email, and project description.");
      return;
    }

    const servicesText = formData.selectedServices
      .map((sid) => SERVICES.find((s) => s.id === sid)?.name)
      .filter(Boolean)
      .join(", ");

    recordContactInquiry({
      name: formData.name,
      email: formData.email,
      subject: `[Let's Collaborate - Email] Project Proposal from ${formData.name}`,
      message: `Company: ${formData.company || "Independent"}\nServices: ${servicesText || "General Engineering"}\nTimeline: ${formData.timeline}\nBudget: ${formData.budget}\n\nProject Scope:\n${formData.description}`,
      source: "hire",
    });

    const subject = encodeURIComponent(`Project Proposal from ${formData.name}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nCompany: ${formData.company || "N/A"}\n` +
      `Services: ${servicesText || "General Engineering"}\nTimeline: ${formData.timeline}\nBudget: ${formData.budget}\n\n` +
      `Project Scope:\n${formData.description}`
    );

    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    setSubmittedStatus("Proposal recorded! Opening your email client with your prefilled brief...");
  };

  return (
    <main className="relative min-h-screen py-10 sm:py-16 bg-[#030014] text-white overflow-x-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none opacity-20 -z-0">
        <div className="absolute top-0 right-1/3 w-[600px] h-[600px] rounded-full bg-purple-600/15 blur-[150px]" />
        <div className="absolute bottom-0 left-1/3 w-[600px] h-[600px] rounded-full bg-cyan-600/15 blur-[150px]" />
      </div>

      <div className="relative z-10 px-4 mx-auto max-w-5xl sm:px-6 lg:px-8">
        {/* Top Return Navigation */}
        <div className="flex items-center justify-between gap-4 mb-10">
          <a
            href="/"
            onClick={handleReturnHome}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-300 transition-colors border rounded-full bg-white/5 border-white/10 hover:text-white hover:bg-white/10 hover:border-white/25 backdrop-blur-md"
          >
            {renderIcon(FaArrowLeft, { size: 12 })}
            <span>Back to Portfolio</span>
          </a>

          <span className="text-xs font-semibold tracking-wider text-emerald-400 uppercase">
            ● Available For Opportunities
          </span>
        </div>

        {/* Header Title */}
        <header className="mb-12 text-center max-w-2xl mx-auto">
          <span className="text-xs font-semibold tracking-widest uppercase text-cyan-400">
            Let's Collaborate
          </span>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
            Start Your Next Project
          </h1>
          <div className="w-20 h-1 mx-auto mt-4 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400" />
          <p className="mt-4 text-sm sm:text-base text-slate-300/90 leading-relaxed">
            Fill out the brief below to discuss your project scope, timeline, and deliverables. I respond to inquiries within 24 hours.
          </p>
        </header>

        {/* 2-Column Grid: Form & Value Props */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Interactive Proposal Form */}
          <div className="lg:col-span-8">
            <form
              onSubmit={handleSubmitWhatsApp}
              className="p-6 sm:p-8 border rounded-3xl bg-white/[0.03] border-white/10 backdrop-blur-xl shadow-2xl space-y-6"
            >
              {/* Service Selection */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">
                  1. What services do you need?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SERVICES.map((s) => {
                    const isSelected = formData.selectedServices.includes(s.id);
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => toggleService(s.id)}
                        className={`p-3.5 text-left rounded-xl border transition-all duration-200 flex items-start gap-3 ${
                          isSelected
                            ? "bg-purple-600/20 border-purple-500 text-white shadow-md shadow-purple-500/10"
                            : "bg-white/[0.02] border-white/10 text-slate-400 hover:text-white hover:border-white/20"
                        }`}
                      >
                        <div className={`p-2 rounded-lg mt-0.5 ${isSelected ? "bg-purple-500 text-white" : "bg-white/5 text-slate-400"}`}>
                          {renderIcon(s.icon, { size: 14 })}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">
                            {s.name}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {s.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="hire-name" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="hire-name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Alex Smith"
                    className="w-full px-4 py-2.5 text-sm text-white bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-colors placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label htmlFor="hire-email" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    id="hire-email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="alex@company.com"
                    className="w-full px-4 py-2.5 text-sm text-white bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-colors placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* Company & Timeline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="hire-company" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    id="hire-company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Startup Inc."
                    className="w-full px-4 py-2.5 text-sm text-white bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-colors placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label htmlFor="hire-timeline" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Estimated Timeline
                  </label>
                  <select
                    id="hire-timeline"
                    value={formData.timeline}
                    onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm text-white bg-slate-900 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-colors"
                  >
                    <option value="ASAP (Within 2 weeks)">ASAP (Within 2 weeks)</option>
                    <option value="Within 1 month">Within 1 month</option>
                    <option value="1-3 months">1-3 months</option>
                    <option value="Long-term / Flexible">Long-term / Flexible</option>
                  </select>
                </div>
              </div>

              {/* Project Description */}
              <div>
                <label htmlFor="hire-desc" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Project Scope &amp; Deliverables *
                </label>
                <textarea
                  id="hire-desc"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Outline your project requirements, target users, or key deliverables..."
                  className="w-full px-4 py-2.5 text-sm text-white bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-colors resize-none placeholder:text-slate-500"
                />
              </div>

              {/* Submission Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 w-full sm:flex-1 py-3.5 px-6 font-semibold text-sm text-white rounded-xl shadow-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                >
                  {renderIcon(FaWhatsapp, { size: 16 })}
                  <span>Send via WhatsApp Fast-Track</span>
                </button>

                <button
                  type="button"
                  onClick={handleSubmitEmail}
                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto py-3.5 px-6 font-semibold text-sm text-slate-200 rounded-xl bg-white/5 border border-white/15 hover:bg-white/10 hover:text-white hover:border-purple-400/40 active:scale-[0.98] transition-all duration-200"
                >
                  {renderIcon(FaPaperPlane, { size: 13, className: "text-purple-400" })}
                  <span>Send via Email</span>
                </button>
              </div>

              {submittedStatus && (
                <p className="text-xs text-center text-cyan-300 animate-pulse">
                  {submittedStatus}
                </p>
              )}
            </form>
          </div>

          {/* Right Column: Why Work With Me */}
          <div className="space-y-6 lg:col-span-4">
            <div className="p-6 border rounded-3xl bg-white/[0.03] border-white/10 backdrop-blur-xl space-y-5">
              <h3 className="text-base font-bold text-white uppercase tracking-wider text-purple-400">
                Why Work With Me
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400 mt-0.5">
                    {renderIcon(FaCheckCircle, { size: 14 })}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">
                      Modern Full-Stack Standards
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      Clean TypeScript, modular components, optimized database queries, and resilient REST APIs.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 mt-0.5">
                    {renderIcon(FaClock, { size: 14 })}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">
                      Rapid Iteration &amp; Delivery
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      Frequent status updates, continuous deployment previews, and disciplined milestone completion.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-pink-500/20 text-pink-400 mt-0.5">
                    {renderIcon(FaShieldAlt, { size: 14 })}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">
                      Security &amp; Performance
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      Token security, input sanitization, rate limiting, and 60fps responsive interfaces.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Channel Card */}
            <div className="p-6 border rounded-3xl bg-white/[0.03] border-white/10 backdrop-blur-xl text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Prefer a quick chat?
              </p>
              <p className="text-sm font-bold text-white mt-1">
                Reach out directly at
              </p>
              <a
                href={`mailto:${email}`}
                className="inline-block mt-2 text-sm font-semibold text-cyan-400 hover:underline"
              >
                {email}
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Hire;
