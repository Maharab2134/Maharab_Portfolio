import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaCertificate,
  FaChevronDown,
  FaChevronUp,
  FaExternalLinkAlt,
  FaHandsHelping,
} from "react-icons/fa";

const Certificates = () => {
  const [showAll, setShowAll] = useState(false);
  const initialVisibleCount = 4;

  const certifications = [
    {
      title: "Google Project Management Professional Certificate",
      issuer: "Google / Coursera",
      year: "2025",
      type: "Professional",
      link: "https://www.coursera.org/professional-certificates/google-project-management",
      details:
        "Completed training on project planning, risk management, stakeholder communication, and agile delivery fundamentals.",
    },
    {
      title: "BUBT Intra University Programming Contest 2022",
      issuer: "Bangladesh University of Business and Technology (BUBT)",
      year: "2022",
      type: "Achievement",
      link: "https://drive.google.com/file/d/1i2jKUgi2Ziqb466Vlz6PpdSQav1f_vL8/view?usp=drive_link",
      details:
        "Participated in Junior Division at BUBT Intra University Programming Contest 2022 organized by CSE Department & BUBT IT Club.",
    },
    {
      title:
        "International Congress on Recent Trends in Computer Science (ICRCS 2023)",
      issuer: "IEEE Computer Society Bangladesh Chapter",
      year: "2023",
      type: "Participation",
      link: "https://drive.google.com/file/d/1kb2uFVh9hzzgSbDjMfQa2PMjBpPQgIwX/view?usp=sharing",
      details:
        "Successfully participated in International Congress on Recent Trends in Computer Science (ICRCS 2023) held from 16th to 17th March 2023.",
    },
    {
      title: "Certificate of Excellence - ICRCS 2024",
      issuer: "IEEE Computer Society Bangladesh Chapter",
      year: "2024",
      type: "Achievement",
      link: "https://drive.google.com/file/d/1x6UY3glacBcsp0fgFOH_kOof9YdhWDQQ/view?usp=drive_link",
      details:
        "Awarded Certificate of Excellence for outstanding dedication and contribution as an Ambassador at International Congress on Recent Trends in Computer Science (ICRCS 2024).",
    },
    {
      title: "Artificial Intelligence & Machine Learning Fundamentals",
      issuer: "Grameenphone Academy (CodersTrust)",
      year: "2024",
      type: "Professional",
      link: "https://drive.google.com/file/d/1z52WFHONp3pVKT2DnowztTDGY_LjDPiM/view?usp=drive_link",
      details:
        "Successfully completed Artificial Intelligence & Machine Learning Fundamentals program under Grameenphone Academy, gaining foundational knowledge in AI concepts and ML techniques.",
    },
    {
      title: "Full Stack Development with MERN",
      issuer: "Professional Training Program",
      year: "2026",
      type: "Professional",
      link: "https://www.grameenphone.academy/cert/456df50c843d",
      details:
        "Completed Full Stack Development using MERN stack (MongoDB, Express.js, React.js, Node.js), building scalable web applications and REST APIs.",
    },
  ];

  const visibleCertifications = showAll
    ? certifications
    : certifications.slice(0, initialVisibleCount);

  const hasMoreThanInitial = certifications.length > initialVisibleCount;

  return (
    <section
      id="certificates"
      className="py-20 bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a]"
    >
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-textPrimary md:text-4xl">
            Certificates
          </h2>
          <motion.div
            className="w-20 h-1 mx-auto bg-secondary"
            initial={{ width: 0 }}
            whileInView={{ width: "5rem" }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          />
          <p className="max-w-2xl mx-auto mt-4 text-gray-300">
            A few professional and volunteer certifications that reflect
            continuous learning and community contribution.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {visibleCertifications.map((cert, index) => (
            <motion.article
              key={`${cert.title}-${cert.year}-${index}`}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              viewport={{ once: true }}
              className="p-6 border rounded-xl border-secondary/20 bg-tertiary/50 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-full bg-secondary/15 text-secondary">
                  {cert.type === "Professional"
                    ? FaCertificate({ size: 14 })
                    : FaHandsHelping({ size: 14 })}
                  {cert.type}
                </span>
                <span className="text-sm text-gray-400">{cert.year}</span>
              </div>

              <h3 className="mb-2 text-lg font-semibold">
                <a
                  href={cert.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-white transition-colors duration-300 hover:text-secondary"
                >
                  {cert.title}
                  {FaExternalLinkAlt({ size: 12 })}
                </a>
              </h3>
              <p className="mb-3 text-sm text-secondary">{cert.issuer}</p>
              <p className="text-sm leading-relaxed text-gray-300">
                {cert.details}
              </p>
              <a
                href={cert.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 text-sm font-medium transition-colors duration-300 text-secondary hover:text-white"
              >
                View Certificate
                {FaExternalLinkAlt({ size: 11 })}
              </a>
            </motion.article>
          ))}
        </div>

        {hasMoreThanInitial && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            viewport={{ once: true }}
            className="flex justify-center mt-10"
          >
            <motion.button
              type="button"
              onClick={() => setShowAll((prev) => !prev)}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-full border border-secondary/40 text-secondary hover:text-white hover:bg-secondary/20 transition-colors duration-300"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              {showAll ? "Show Less" : "Show More"}
              {showAll
                ? FaChevronUp({ size: 12 })
                : FaChevronDown({ size: 12 })}
            </motion.button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Certificates;
