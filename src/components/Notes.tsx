import { motion } from "framer-motion";
import {
  FaCertificate,
  FaExternalLinkAlt,
  FaHandsHelping,
} from "react-icons/fa";

const Certificates = () => {
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
      title: "AWS Cloud Practitioner Essentials",
      issuer: "Amazon Web Services",
      year: "2024",
      type: "Professional",
      link: "https://www.aws.training/Details/eLearning?id=60697",
      details:
        "Built core understanding of cloud architecture, security, and cost-aware service selection for deployment projects.",
    },
    {
      title: "Red Crescent Youth Volunteer Training",
      issuer: "Bangladesh Red Crescent Society",
      year: "2023",
      type: "Volunteer",
      link: "https://bdrcs.org/",
      details:
        "Participated in community response, first-aid awareness, and youth-led service initiatives in local events.",
    },
    {
      title: "Community Mentorship & STEM Outreach Certificate",
      issuer: "University Club Initiative",
      year: "2022",
      type: "Volunteer",
      link: "https://www.unicef.org/education/stem-education",
      details:
        "Supported junior students through peer mentoring and organized introductory STEM sessions for school learners.",
    },
  ];

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
          {certifications.map((cert, index) => (
            <motion.article
              key={cert.title}
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
      </div>
    </section>
  );
};

export default Certificates;
