import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaMobile,
  FaGlobe,
  FaBrain,
  FaGithub,
  FaArrowDown,
  FaExternalLinkAlt,
  FaTimes,
  FaMicrochip,
  FaLock,
} from "react-icons/fa";
import { IconBaseProps } from "react-icons";
import { useEffect, useState } from "react";

// Small helper to render react-icons with correct typing for JSX
const renderIcon = (
  Icon: React.ComponentType<IconBaseProps>,
  props: IconBaseProps = {},
) => {
  return <Icon {...props} />;
};

const toProxyImageUrl = (url: string) => {
  if (!url || typeof url !== "string") return url;

  if (url.includes("images.weserv.nl/?url=")) {
    return url;
  }

  const driveShareMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (driveShareMatch?.[1]) {
    const fileId = driveShareMatch[1];
    return `https://images.weserv.nl/?url=drive.google.com/uc?export=view%26id=${fileId}`;
  }

  const driveUcMatch = url.match(/drive\.google\.com\/uc\?[^\s]*id=([^&]+)/);
  if (driveUcMatch?.[1]) {
    const fileId = driveUcMatch[1];
    return `https://images.weserv.nl/?url=drive.google.com/uc?export=view%26id=${fileId}`;
  }

  return url;
};

interface Project {
  title: string;
  description: string;
  technologies: string[];
  image: string;
  link?: string;
  github?: string;
  sourceCodePrivate?: boolean;
  featured?: boolean;
  longDescription?: string;
}

interface ProjectCardProps {
  project: Project;
  index: number;
  onProjectClick: (project: Project) => void;
}

const ProjectCard = ({ project, index, onProjectClick }: ProjectCardProps) => {
  const [imgSrc, setImgSrc] = useState(() => toProxyImageUrl(project.image));
  const isSourceCodePrivate = project.sourceCodePrivate === true;
  const hasGithubLink = Boolean(project.github?.trim());
  const hasLiveLink = Boolean(project.link?.trim());

  useEffect(() => {
    setImgSrc(toProxyImageUrl(project.image));
  }, [project.image]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      onClick={() => onProjectClick(project)}
      className={`bg-white/5 rounded-xl backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 p-4 cursor-pointer group ${
        project.featured ? "ring-2 ring-purple-500/50" : ""
      } hover:shadow-lg hover:shadow-purple-500/10`}
    >
      <div className="relative mb-3 overflow-hidden bg-gray-800 rounded-xl group aspect-video">
        <motion.img
          src={imgSrc}
          alt={project.title}
          className="object-cover object-center w-full h-full transition-transform duration-300 group-hover:scale-105"
          onError={() => setImgSrc("/images/placeholder.png")}
          loading="lazy"
        />
        <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-black/60 to-transparent group-hover:opacity-100" />
        {project.featured && (
          <motion.div
            className="absolute top-2 right-2 bg-purple-500 text-white px-2 py-0.5 rounded-full text-xs font-medium backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            Featured
          </motion.div>
        )}
        <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-0 group-hover:opacity-100">
          <motion.div
            initial={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            className="px-4 py-2 text-sm font-medium text-white rounded-full bg-white/20 backdrop-blur-sm"
          >
            Click for Details
          </motion.div>
        </div>
      </div>
      <motion.h3
        className="mb-1 text-lg font-semibold text-white group-hover:text-purple-400"
        whileHover={{ x: 5 }}
        transition={{ duration: 0.2 }}
      >
        {project.title}
      </motion.h3>
      <p className="mb-3 text-sm text-gray-400 line-clamp-2">
        {project.description}
      </p>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {project.technologies.slice(0, 3).map((tech, i) => (
          <motion.span
            key={i}
            className="px-2 py-0.5 rounded-full text-white/80 hover:bg-white/20 transition-colors text-xs bg-white/10"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {tech}
          </motion.span>
        ))}

        {project.technologies.length > 3 && (
          <motion.span
            className="px-2 py-0.5 rounded-full text-white/60 text-xs"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            +{project.technologies.length - 3}
          </motion.span>
        )}
      </div>
      <div className="flex items-center justify-between gap-3 pt-1">
        {!isSourceCodePrivate && hasGithubLink && (
          <motion.a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm text-gray-400 transition-colors hover:text-white"
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.span
              className="mr-1.5"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              {renderIcon(FaGithub as React.ComponentType<IconBaseProps>, {
                size: 14,
              })}
            </motion.span>
            Source Code
          </motion.a>
        )}

        {isSourceCodePrivate && (
          <div className="inline-flex items-center text-sm text-amber-300/90">
            <span className="mr-1.5">
              {renderIcon(FaLock as React.ComponentType<IconBaseProps>, {
                size: 13,
              })}
            </span>
            Source Code Private
          </div>
        )}

        {hasLiveLink && (
          <motion.a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm transition-colors text-cyan-300 hover:text-cyan-200"
            whileHover={{ x: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
          >
            View Live
            <span className="ml-1.5">
              {renderIcon(
                FaExternalLinkAlt as React.ComponentType<IconBaseProps>,
                {
                  size: 12,
                },
              )}
            </span>
          </motion.a>
        )}
      </div>
    </motion.div>
  );
};

const ProjectModal = ({
  project,
  isOpen,
  onClose,
}: {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!project || !isOpen) return null;
  const isSourceCodePrivate = project.sourceCodePrivate === true;
  const hasGithubLink = Boolean(project.github?.trim());
  const hasLiveLink = Boolean(project.link?.trim());

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-sm sm:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-4xl max-h-[85vh] overflow-y-auto bg-gray-900 border rounded-xl sm:max-h-[90vh] border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative p-4 border-b sm:p-6 border-white/10">
              <motion.button
                onClick={onClose}
                className="absolute p-2 text-gray-400 transition-colors rounded-full top-3 right-3 sm:top-4 sm:right-4 hover:text-white hover:bg-white/10"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {renderIcon(FaTimes as React.ComponentType<IconBaseProps>, {
                  size: 20,
                })}
              </motion.button>

              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2 sm:gap-3">
                    <h2 className="text-xl font-bold leading-tight text-white sm:text-2xl">
                      {project.title}
                    </h2>
                    {project.featured && (
                      <span className="px-3 py-1 text-sm font-medium text-white bg-purple-500 rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-base text-gray-300 sm:text-lg">
                    {project.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6">
              {/* Image */}
              <div className="mb-6 overflow-hidden bg-gray-800 rounded-xl">
                <img
                  src={toProxyImageUrl(project.image)}
                  alt={project.title}
                  className="object-cover w-full h-52 sm:h-64"
                  onError={(e) => {
                    e.currentTarget.src = "/images/placeholder.png";
                  }}
                />
              </div>

              {/* Long Description */}
              {(project.longDescription || project.description) && (
                <div className="mb-6">
                  <h3 className="mb-3 text-xl font-semibold text-white">
                    Project Overview
                  </h3>
                  <p className="leading-relaxed text-gray-300">
                    {project.longDescription || project.description}
                  </p>
                </div>
              )}

              {/* Technologies */}
              <div className="mb-6">
                <h3 className="mb-3 text-xl font-semibold text-white">
                  Technologies Used
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="px-3 py-1.5 bg-purple-500/20 text-purple-300 rounded-full text-sm border border-purple-500/30"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                {!isSourceCodePrivate && hasGithubLink && (
                  <motion.a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full gap-2 px-6 py-3 font-medium text-white transition-colors bg-gray-700 rounded-lg sm:w-auto hover:bg-gray-600"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {renderIcon(
                      FaGithub as React.ComponentType<IconBaseProps>,
                      { size: 16 },
                    )}
                    Source Code
                  </motion.a>
                )}

                {isSourceCodePrivate && (
                  <div className="flex items-center justify-center w-full gap-2 px-6 py-3 font-medium border rounded-lg sm:w-auto text-amber-200 bg-amber-500/10 border-amber-500/30">
                    {renderIcon(FaLock as React.ComponentType<IconBaseProps>, {
                      size: 16,
                    })}
                    Source Code Private
                  </div>
                )}

                {hasLiveLink && (
                  <motion.a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full gap-2 px-6 py-3 font-medium text-white transition-colors bg-purple-500 rounded-lg sm:w-auto hover:bg-purple-600"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {renderIcon(
                      FaExternalLinkAlt as React.ComponentType<IconBaseProps>,
                      { size: 16 },
                    )}
                    View Live
                  </motion.a>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ProjectGrid = ({
  projects,
  showAll,
  onProjectClick,
}: {
  projects: Project[];
  showAll: boolean;
  onProjectClick: (project: Project) => void;
}) => (
  <AnimatePresence mode="wait">
    <motion.div
      key={showAll ? "expanded" : "collapsed"}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`grid gap-6 ${
        showAll
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          : "grid-cols-1 sm:grid-cols-2"
      }`}
    >
      {projects.slice(0, showAll ? undefined : 2).map((project, index) => (
        <ProjectCard
          key={project.title}
          project={project}
          index={index}
          onProjectClick={onProjectClick}
        />
      ))}
    </motion.div>
  </AnimatePresence>
);

const Projects = () => {
  const [showAllApps, setShowAllApps] = useState(false);
  const [showAllWeb, setShowAllWeb] = useState(false);
  const [showAllML, setShowAllML] = useState(false);
  const [showAllIoT, setShowAllIoT] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const appProjects: Project[] = [
    {
      title: "NetBagZ Mobile App",
      description:
        "A full-featured e-commerce mobile application with real-time inventory management and secure payment integration.",
      longDescription:
        "NetBagZ is a comprehensive e-commerce solution built with React Native that provides users with a seamless shopping experience. The app includes features like real-time inventory tracking, secure payment processing with Stripe, AR product visualization, user authentication, order management, and push notifications. The backend is built with Node.js and MongoDB, ensuring scalability and reliability.",
      technologies: [
        "React Native",
        "Node.js",
        "MongoDB",
        "Redux",
        "Stripe",
        "AR Kit",
        "Firebase",
        "Express.js",
      ],
      image:
        "https://images.weserv.nl/?url=drive.google.com/uc?export=view%26id=1N_z7JZcts-Le2hgJPR9qSytTxMoTzgv2",
      link: "https://ecommerce-app.com",
      github: "https://github.com/Maharab2134/NetBagZ",
      featured: true,
    },
    {
      title: "BachLife Mobile App",
      description:
        "Flutter-based personal finance management app for tracking income, expenses, and savings.",
      longDescription:
        "BachLife helps users take control of their finances through intuitive budgeting tools and insightful analytics. The app features expense categorization, savings goals tracking, financial reports, bill reminders, and investment tracking. Built with Flutter and Firebase, it offers cross-platform compatibility with a beautiful Material Design interface.",
      technologies: [
        "Flutter",
        "Firebase",
        "Dart",
        "Provider",
        "HTTP/Dio",
        "Shared Preferences",
        "Chart.js",
      ],
      image:
        "https://images.weserv.nl/?url=drive.google.com/uc?export=view%26id=1uTZCWKh6PftTikrXZOde-l4spvCPWBEM",
      link: "https://BachLife-app.co",
      github: "https://github.com/Maharab2134/BachLife-app",
    },
    {
      title: "Social Media App",
      description:
        "A social networking app with real-time chat, story features, and content sharing capabilities.",
      longDescription:
        "This social media platform enables users to connect, share content, and communicate in real-time. Features include user profiles, post creation with images/videos, real-time messaging with Socket.io, story sharing, likes/comments, push notifications, and content moderation. The app uses AWS for scalable cloud infrastructure and GraphQL for efficient data fetching.",
      technologies: [
        "React Native",
        "Socket.io",
        "AWS",
        "GraphQL",
        "Node.js",
        "MongoDB",
        "Redis",
      ],
      image:
        "https://images.weserv.nl/?url=drive.google.com/uc?export=view%26id=1Kq8wcbRws98TnO3lqmRSNYx04NlR1oXk",
      link: "https://social-app.com",
      github: "https://github.com/Maharab2134/Social_Media_App",
    },
    {
      title: "Food Delivery App",
      description:
        "On-demand food delivery platform with real-time order tracking and restaurant management.",
      longDescription:
        "A comprehensive food delivery solution connecting customers with local restaurants. The app includes features like real-time order tracking, restaurant listings with menus, secure payments, delivery person tracking, ratings and reviews, and admin dashboard for restaurant management. Integrated with Google Maps API for accurate delivery tracking.",
      technologies: [
        "Flutter",
        "Node.js",
        "MongoDB",
        "Google Maps API",
        "Stripe",
        "Firebase",
        "Express.js",
      ],
      image:
        "https://images.weserv.nl/?url=drive.google.com/uc?export=view%26id=1ayPzSd5py__Qx1tssMfoCvckFkKrEBOZ",
      link: "https://food-delivery.com",
      github: "https://github.com/Maharab2134/food-delivery",
    },
    {
      title: "Smart IoT",
      description:
        "Flutter-based smart device controller with Bluetooth, WiFi, and cloud connectivity for real-time IoT/car control and sensor monitoring.",
      longDescription:
        "A cross-platform mobile app for controlling smart cars and IoT systems via multiple transports—Bluetooth, direct WiFi, and Blynk cloud. Features device discovery, real-time control interfaces, sensor dashboards, and smooth animations. Built with Flutter for robust performance on iOS and Android.",
      technologies: [
        "Flutter",
        "Dart",
        "Bluetooth",
        "WiFi TCP Socket",
        "Blynk",
        "SharedPreferences",
      ],
      image: "/images/",
      link: "https://food-delivery.com",
      github: "https://github.com/Maharab2134/food-delivery",
    },
  ];

  const webProjects: Project[] = [
    {
      title: "PurchifyShop – E-commerce Web Application",
      description:
        "A modern e-commerce platform with responsive UI, product browsing, and smooth user experience.",
      longDescription:
        "Designed and developed a scalable e-commerce system focusing on usability, performance, and clean UI. Ensured seamless navigation, product management, and enhanced user engagement through optimized frontend design.",
      technologies: [
        "React",
        "Tailwind CSS",
        "Framer Motion",
        "Laravel",
        "Vite",
        "ESLint",
      ],
      image:
        "https://images.weserv.nl/?url=drive.google.com/uc?export=view%26id=1Yi9rhaY5ROKTlV_aIaGql7emshK640Dc",
      link: "https://purchifyshop.com/",
      github: "https://github.com/Maharab2134/Maharab_Portfolio",
      featured: true,
      sourceCodePrivate: true,
    },
    {
      title: "Amin WebTech – Business Website",
      description:
        "A professional business website designed to showcase services with a clean and responsive interface.",
      longDescription:
        "Developed a visually appealing website with structured layout and optimized performance for better client engagement. Focused on responsive design and user experience to enhance brand presence and credibility.",
      technologies: [
        "React",
        "Tailwind CSS",
        "Framer Motion",
        "Node.js",
        "Vite",
        "ESLint",
      ],
      image:
        "https://images.weserv.nl/?url=drive.google.com/uc?export=view%26id=1gey8dyGWWP3PkATaZyOo5izsiqoEuNL0",
      link: "https://aminwebtech.com/",
      github: "https://github.com/Maharab2134/Maharab_Portfolio",
      featured: true,
      sourceCodePrivate: true,
    },
    {
      title: "Portfolio Website",
      description:
        "Modern portfolio website with smooth animations, dark mode, and responsive design.",
      longDescription:
        "A cutting-edge portfolio website showcasing modern web development practices. Features include smooth page transitions with Framer Motion, dark/light mode toggle, responsive design that works perfectly on all devices, optimized performance with lazy loading, and SEO optimization. Built with React and TypeScript for type safety and maintainability.",
      technologies: [
        "React",
        "Tailwind CSS",
        "Framer Motion",
        "TypeScript",
        "Vite",
        "ESLint",
      ],
      image:
        "https://images.weserv.nl/?url=drive.google.com/uc?export=view%26id=1hnUPDafxEWl6xPWkNisXKu6WSG3eQu3p",
      link: "https://portfolio.com",
      github: "https://github.com/Maharab2134/Maharab_Portfolio",
      featured: true,
    },
    {
      title: "Smart Working Habits",
      description:
        "Full-stack web application for project and task management with real-time updates.",
      longDescription:
        "Smart Working Habits is a productivity platform designed to help teams and individuals manage projects efficiently. It includes task management, team collaboration, time tracking, progress analytics, real-time notifications, and file sharing. The application uses WebSockets for real-time updates and features a clean, intuitive interface built with modern React patterns.",
      technologies: [
        "React",
        "Node.js",
        "Express",
        "PostgreSQL",
        "Socket.io",
        "JWT",
        "Chart.js",
      ],
      image:
        "https://images.weserv.nl/?url=drive.google.com/uc?export=view%26id=12D1PINGBSmaXEH2bOdVD7zQ-ayGvtJao",
      link: "https://task-manager.com",
      github: "https://github.com/Maharab2134/task-manager",
    },
    {
      title: "E-Learning Platform",
      description:
        "Interactive learning platform with video courses, quizzes, and progress tracking.",
      longDescription:
        "A comprehensive e-learning platform that provides interactive courses with video lessons, quizzes, assignments, and certification. Features include user progress tracking, course recommendations, discussion forums, instructor dashboards, payment integration, and mobile-responsive design. Built with Next.js for optimal SEO and performance.",
      technologies: [
        "Next.js",
        "Django",
        "PostgreSQL",
        "AWS S3",
        "Stripe",
        "Redis",
        "Docker",
      ],
      image:
        "https://images.weserv.nl/?url=drive.google.com/uc?export=view%26id=1H6jas_QgY48qzTZS_K_ANrxz8Chb5L_E",
      link: "https://elearning.com",
      github: "https://github.com/Maharab2134/elearning",
    },
    {
      title: "deshiShop E-commerce",
      description:
        "A scalable e-commerce platform with product management and payment gateway integration.",
      longDescription:
        "deshiShop is a full-featured e-commerce platform supporting multiple vendors and product categories. It includes advanced product filtering, shopping cart, wishlist, user reviews and ratings, order management, inventory tracking, and admin dashboard. The platform is built with scalability in mind and can handle high traffic with optimized database queries and caching.",
      technologies: [
        "React",
        "Node.js",
        "MongoDB",
        "Stripe",
        "Redux",
        "Express.js",
        "JWT",
      ],
      image:
        "https://images.weserv.nl/?url=drive.google.com/uc?export=view%26id=1hrg0W_SWuACCeCDxzxp2N4zSO6HzJsvr",
      link: "https://elearning.com",
      github: "https://github.com/Maharab2134/deshiShop",
    },
    {
      title: "Student Projects Platform",
      description:
        "A collaborative platform for students to showcase and manage academic projects.",
      longDescription:
        "This platform enables students to showcase their academic projects, collaborate with peers, and receive feedback. Features include project submission, peer reviews, rating system, project categorization, search and filtering, user profiles, and admin moderation. Built with a focus on educational institutions and student communities.",
      technologies: [
        "React",
        "Node.js",
        "Express.js",
        "MongoDB",
        "Stripe",
        "JWT",
        "Multer",
      ],
      image:
        "https://images.weserv.nl/?url=drive.google.com/uc?export=view%26id=11QTjup6nMFBZPFJfcZvU9onSz9zc5tqm",
      link: "https://student-projects-platform.vercel.app/",
      github: "https://github.com/Maharab2134/student-projects-platform",
    },
    {
      title: "FoodShare",
      description:
        "Platform connecting food donors with volunteers to reduce food waste and fight hunger.",
      longDescription:
        "FoodShare addresses food waste and hunger by creating a network of food donors, volunteers, and recipients. The platform features real-time food donation listings, volunteer coordination, route optimization for deliveries, donor recognition system, and impact tracking. Integrated with Google Maps API for efficient delivery routing and real-time tracking.",
      technologies: [
        "React",
        "Node.js",
        "MongoDB",
        "Stripe",
        "Socket.io",
        "Google Maps API",
        "Express.js",
      ],
      image:
        "https://images.weserv.nl/?url=drive.google.com/uc?export=view%26id=1oGgvwPBWbmULSUlN6DFac668_CuyVD-i",
      link: "https://foodshare.com",
      github: "https://github.com/Maharab2134/FoodShare_Web",
    },
    {
      title: "PathPilot",
      description:
        "Intelligent career assessment platform helping users discover ideal career paths.",
      longDescription:
        "PathPilot uses advanced assessment algorithms to help users discover suitable career paths based on their skills, interests, and personality. The platform includes interactive quizzes, personalized recommendations, career roadmaps, skill gap analysis, progress tracking, and comprehensive admin tools for content management and analytics.",
      technologies: [
        "React",
        "Node.js",
        "Express",
        "TypeScript",
        "MongoDB",
        "Socket.io",
        "Chart.js",
      ],
      image:
        "https://images.weserv.nl/?url=drive.google.com/uc?export=view%26id=1Mue_kK8G70L_hojQijfp5jVlX8yJYHV-",
      link: "https://pathpilot.com",
      github: "https://github.com/Maharab2134/PathPilot",
    },
    {
      title: "Real Estate Marketplace",
      description:
        "Property listing platform with advanced search, virtual tours, and mortgage calculator.",
      longDescription:
        "A modern real estate platform that connects buyers, sellers, and agents. Features include advanced property search with filters, virtual property tours using Three.js, mortgage calculator, property comparisons, saved searches, agent profiles, and secure messaging. The platform provides a comprehensive solution for property discovery and transaction management.",
      technologies: [
        "React",
        "Node.js",
        "MongoDB",
        "Three.js",
        "Stripe",
        "Express.js",
        "JWT",
      ],
      image:
        "https://images.weserv.nl/?url=drive.google.com/uc?export=view%26id=1nV3zKlPlP0YJFf_KYOaiOAuugrd0Zrhy",
      link: "https://real-estate.com",
      github: "https://github.com/Maharab2134/real-estate",
    },
  ];

  const mlProjects: Project[] = [
    {
      title: "Image Classification Model",
      description:
        "Deep learning model for image classification using transfer learning with 95% accuracy.",
      longDescription:
        "This computer vision project implements a sophisticated image classification system using transfer learning with pre-trained models. The model achieves 95% accuracy on custom datasets and can classify images across multiple categories. The system includes data preprocessing, model training, evaluation metrics, and a Flask API for integration with web applications. Perfect for applications requiring visual recognition capabilities.",
      technologies: [
        "TensorFlow",
        "Python",
        "OpenCV",
        "NumPy",
        "Flask",
        "Keras",
        "Pandas",
      ],
      image:
        "https://images.weserv.nl/?url=drive.google.com/uc?export=view%26id=1u94a_6dY2HjrRldtcVg2YaHaaifNI42t",
      link: "https://image-classifier.com",
      github: "https://github.com/Maharab2134/image-classifier",
      featured: true,
      sourceCodePrivate: true,
    },
    {
      title: "Sentiment Analysis Tool",
      description:
        "NLP-based sentiment analysis for social media content with multi-language support.",
      longDescription:
        "A natural language processing tool that analyzes sentiment in text data from various sources including social media, reviews, and customer feedback. The system uses BERT and other transformer models for accurate sentiment classification across multiple languages. Features include real-time analysis, batch processing, sentiment trends visualization, and API integration for developers.",
      technologies: [
        "PyTorch",
        "NLTK",
        "BERT",
        "Python",
        "FastAPI",
        "Transformers",
        "Scikit-learn",
      ],
      image:
        "https://images.weserv.nl/?url=drive.google.com/uc?export=view%26id=1rpRFs4UedKCCcHdYL_v0wGPfdOZ0qg9E",
      link: "https://sentiment-analyzer.com",
      github: "https://github.com/Maharab2134/sentiment-analyzer",
      sourceCodePrivate: true,
    },
    {
      title: "Recommendation System",
      description:
        "Personalized content recommendation engine using collaborative filtering.",
      longDescription:
        "An advanced recommendation system that provides personalized content suggestions using collaborative filtering and content-based approaches. The system analyzes user behavior and preferences to deliver accurate recommendations. Features include real-time recommendation generation, A/B testing framework, user preference learning, and integration with various content types including products, articles, and media.",
      technologies: [
        "Scikit-learn",
        "Pandas",
        "NumPy",
        "Flask",
        "Redis",
        "Surprise",
        "Matplotlib",
      ],
      image: "/images/recommender.jpg",
      link: "https://recommender.com",
      github: "https://github.com/Maharab2134/recommender",
      sourceCodePrivate: true,
    },
    {
      title: "Time Series Forecasting",
      description:
        "Advanced time series forecasting model for financial data prediction and analysis.",
      longDescription:
        "A comprehensive time series forecasting solution designed for financial markets and business analytics. The system uses advanced algorithms including LSTM networks, Prophet, and ARIMA models to predict future trends based on historical data. Features include multi-variate analysis, confidence intervals, anomaly detection, and interactive visualization of predictions and historical data.",
      technologies: [
        "TensorFlow",
        "Prophet",
        "Pandas",
        "Plotly",
        "FastAPI",
        "LSTM",
        "Statsmodels",
      ],
      image:
        "https://drive.google.com/file/d/1uL9IaOAvIIUeMriPFY9gB5dZDh3KImrE/view?usp=drive_link",
      link: "https://forecasting.com",
      github: "https://github.com/Maharab2134/forecasting",
      sourceCodePrivate: true,
    },
  ];

  const iotProjects: Project[] = [
    {
      title: "Smart Home Automation System",
      description:
        "IoT-based smart home system with remote control, energy monitoring, and automation.",
      longDescription:
        "A comprehensive smart home automation system that enables users to control their home appliances remotely via a mobile app. The system includes features like real-time energy consumption monitoring, automated scheduling, voice control integration, security alerts, and environmental monitoring. Built with ESP32 microcontrollers and cloud integration for seamless remote access.",
      technologies: [
        "ESP32",
        "Arduino",
        "MQTT",
        "Node.js",
        "React Native",
        "Firebase",
        "Python",
      ],
      image:
        "https://drive.google.com/file/d/1-n_olWQeEIS10Ng2-xCdVTGiBdmbwOJA/view?usp=drive_link",
      link: "https://smart-home-demo.com",
      github: "https://github.com/Maharab2134/smart-home-iot",
      featured: true,
      sourceCodePrivate: true,
    },
    {
      title: "Agricultural Monitoring System",
      description:
        "IoT solution for precision agriculture with soil monitoring and automated irrigation.",
      longDescription:
        "An intelligent agricultural monitoring system that helps farmers optimize crop production. The system uses various sensors to monitor soil moisture, temperature, humidity, and nutrient levels. It features automated irrigation control, crop health monitoring, weather prediction integration, and a dashboard for real-time data visualization and alerts.",
      technologies: [
        "Raspberry Pi",
        "Arduino",
        "Python",
        "MQTT",
        "React",
        "MongoDB",
        "Django",
      ],
      image:
        "https://drive.google.com/file/d/1bTt2507LWcYpotpPHVEwLg5zu4G8s2-z/view?usp=drive_link",
      link: "https://agri-monitoring.com",
      github: "https://github.com/Maharab2134/agriculture-iot",
    },
    {
      title: "Industrial Asset Tracking",
      description:
        "Real-time asset tracking and monitoring system for industrial applications.",
      longDescription:
        "An industrial-grade IoT solution for tracking and monitoring valuable assets in real-time. The system uses GPS, RFID, and various sensors to provide location tracking, environmental condition monitoring, predictive maintenance alerts, and asset utilization analytics. Features include geofencing, tamper detection, and comprehensive reporting dashboards.",
      technologies: [
        "LoRaWAN",
        "GPS",
        "RFID",
        "Node.js",
        "React",
        "PostgreSQL",
        "AWS IoT",
      ],
      image: "/images/asset-tracking.jpg",
      link: "https://asset-tracker.com",
      github: "https://github.com/Maharab2134/industrial-iot",
    },
    {
      title: "Health Monitoring Wearable",
      description:
        "IoT wearable device for continuous health monitoring and emergency alerts.",
      longDescription:
        "A smart wearable device that continuously monitors vital signs including heart rate, blood oxygen levels, body temperature, and physical activity. The system features real-time health analytics, emergency alert notifications to caregivers, medication reminders, and integration with healthcare provider systems. Designed with focus on elderly care and chronic disease management.",
      technologies: [
        "ESP32",
        "Bluetooth",
        "Python",
        "React Native",
        "Firebase",
        "TensorFlow Lite",
        "MQTT",
      ],
      image: "/images/health-wearable.jpg",
      link: "https://health-wearable.com",
      github: "https://github.com/Maharab2134/health-monitoring-iot",
    },
  ];

  // Different colors for each section
  const sectionConfigs = [
    {
      icon: FaMobile,
      title: "App Development",
      projects: appProjects,
      showAll: showAllApps,
      setShowAll: setShowAllApps,
      color: "text-blue-400",
      hoverColor: "hover:text-blue-300",
      buttonColor: "bg-blue-500/20 hover:bg-blue-500/30 text-blue-400",
    },
    {
      icon: FaGlobe,
      title: "Web Development",
      projects: webProjects,
      showAll: showAllWeb,
      setShowAll: setShowAllWeb,
      color: "text-green-400",
      hoverColor: "hover:text-green-300",
      buttonColor: "bg-green-500/20 hover:bg-green-500/30 text-green-400",
    },
    {
      icon: FaBrain,
      title: "Machine Learning",
      projects: mlProjects,
      showAll: showAllML,
      setShowAll: setShowAllML,
      color: "text-orange-400",
      hoverColor: "hover:text-orange-300",
      buttonColor: "bg-orange-500/20 hover:bg-orange-500/30 text-orange-400",
    },
    {
      icon: FaMicrochip,
      title: "IoT Projects",
      projects: iotProjects,
      showAll: showAllIoT,
      setShowAll: setShowAllIoT,
      color: "text-purple-400",
      hoverColor: "hover:text-purple-300",
      buttonColor: "bg-purple-500/20 hover:bg-purple-500/30 text-purple-400",
    },
  ];

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
  };

  return (
    <section
      id="projects"
      className="py-20 bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] relative overflow-hidden"
    >
      <div className="relative z-10 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-textPrimary">
            My Projects
          </h2>
          <div className="w-20 h-1 mx-auto bg-secondary" />
          <p className="max-w-2xl mx-auto mt-3 text-lg text-gray-400">
            Explore my work across different domains of development, from mobile
            apps to IoT solutions
          </p>
        </motion.div>

        {sectionConfigs.map((section, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="flex items-center gap-4 mb-8">
              <span
                className={`text-3xl ${section.color} ${section.hoverColor} transition-colors`}
              >
                {renderIcon(
                  section.icon as React.ComponentType<IconBaseProps>,
                  { size: 28 },
                )}
              </span>
              <h3 className="text-2xl font-semibold text-white">
                {section.title}
              </h3>
            </div>
            <ProjectGrid
              projects={section.projects}
              showAll={section.showAll}
              onProjectClick={handleProjectClick}
            />
            {section.projects.length > 2 && (
              <div className="mt-8 text-center">
                <motion.button
                  onClick={() => section.setShowAll(!section.showAll)}
                  className={`relative px-8 py-3 overflow-hidden transition-all duration-300 rounded-full group ${section.buttonColor}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.span
                    className="relative z-10 flex items-center gap-2"
                    animate={{ y: section.showAll ? 0 : [0, 5, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: section.showAll ? 0 : Infinity,
                    }}
                  >
                    {section.showAll ? "Show Less" : "Show More"}
                    <motion.span
                      animate={{ rotate: section.showAll ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {renderIcon(
                        FaArrowDown as React.ComponentType<IconBaseProps>,
                        {},
                      )}
                    </motion.span>
                  </motion.span>
                </motion.button>
              </div>
            )}
          </motion.div>
        ))}

        {/* Project Modal */}
        <ProjectModal
          project={selectedProject}
          isOpen={!!selectedProject}
          onClose={handleCloseModal}
        />
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
            backgroundPosition: ["0% 0%", "100% 100%"],
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />

        {/* Subtle Floating Particles */}
        <motion.div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-secondary rounded-full opacity-40 blur-[0.5px]"
              animate={{
                x: [0, (Math.random() - 0.5) * 80, 0],
                y: [0, (Math.random() - 0.5) * 80, 0],
                opacity: [0.2, 0.5, 0.2],
                scale: [0.7, 1.1, 0.7],
              }}
              transition={{
                duration: Math.random() * 6 + 6,
                repeat: Infinity,
                repeatType: "mirror",
                delay: i * 0.4,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Projects;
