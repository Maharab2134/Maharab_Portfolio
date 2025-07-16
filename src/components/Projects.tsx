import { motion, AnimatePresence } from 'framer-motion';
import { FaMobile, FaGlobe, FaBrain, FaGithub, FaArrowDown } from 'react-icons/fa';
import { IconBaseProps } from 'react-icons';
import { useState } from 'react';

interface Project {
  title: string;
  description: string;
  technologies: string[];
  image: string;
  link: string;
  github?: string;
  featured?: boolean;
}

interface ProjectCardProps {
  project: Project;
  index: number;
}

const ProjectCard = ({ project, index }: ProjectCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: index * 0.1 }}
    whileHover={{ y: -5 }}
    className={`bg-white/5 rounded-xl backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 p-4 ${
      project.featured ? 'ring-2 ring-purple-500/50' : ''
    } hover:shadow-lg hover:shadow-purple-500/10`}
  >
    <div className="relative mb-3 overflow-hidden bg-gray-800 rounded-xl group aspect-video">
      <motion.img
        src={project.image}
        alt={project.title}
        className="object-cover object-center w-full h-full transition-transform duration-300 group-hover:scale-105"
        onError={(e) => { e.currentTarget.src = '/images/placeholder.png'; }}
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
    </div>
    <motion.h3 
      className="mb-1 text-lg font-semibold text-white group-hover:text-purple-400"
      whileHover={{ x: 5 }}
      transition={{ duration: 0.2 }}
    >
      {project.title}
    </motion.h3>
    <p className="mb-3 text-sm text-gray-400 line-clamp-2">{project.description}</p>
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
    {project.github && (
      <motion.a
        href={project.github}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center text-sm text-gray-400 transition-colors hover:text-white"
        whileHover={{ x: 5 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.span 
          className="mr-1.5"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          {FaGithub({ size: 14 } as IconBaseProps)}
        </motion.span>
        Source Code
      </motion.a>
    )}
  </motion.div>
);

const ShowMoreButton = ({ onClick, isExpanded }: { onClick: () => void; isExpanded: boolean }) => (
  <motion.button
    onClick={onClick}
    className="relative px-8 py-3 overflow-hidden text-purple-400 transition-all duration-300 rounded-full group bg-purple-500/20 hover:bg-purple-500/30"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <motion.span 
      className="relative z-10 flex items-center gap-2"
      animate={{ y: isExpanded ? 0 : [0, 5, 0] }}
      transition={{ duration: 1.5, repeat: isExpanded ? 0 : Infinity }}
    >
      {isExpanded ? 'Show Less' : 'Show More'}
      <motion.span 
        animate={{ rotate: isExpanded ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {FaArrowDown({} as IconBaseProps)}
      </motion.span>
    </motion.span>
  </motion.button>
);

const ProjectGrid = ({ projects, showAll }: { projects: Project[]; showAll: boolean }) => (
  <AnimatePresence mode="wait">
    <motion.div
      key={showAll ? 'expanded' : 'collapsed'}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`grid gap-6 ${
        showAll 
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
          : 'grid-cols-1 sm:grid-cols-2'
      }`}
    >
      {projects.slice(0, showAll ? undefined : 2).map((project, index) => (
        <ProjectCard 
          key={index} 
          project={project} 
          index={index} 
        />
      ))}
    </motion.div>
  </AnimatePresence>
);

const Projects = () => {
  const [showAllApps, setShowAllApps] = useState(false);
  const [showAllWeb, setShowAllWeb] = useState(false);
  const [showAllML, setShowAllML] = useState(false);

  const appProjects = [
    {
      title: "E-Commerce Mobile App",
      description: "A full-featured e-commerce mobile application with real-time inventory management, secure payment integration, and AR product visualization.",
      technologies: ["React Native", "Node.js", "MongoDB", "Redux", "Stripe", "AR Kit"],
      image: "/icons/app-icon.svg",
      link: "https://ecommerce-app.com",
      github: "https://github.com/yourusername/ecommerce-app",
      featured: true
    },
    {
      title: "BachLife Mobile App",
      description: "BachLife is a Flutter-based mobile application designed to help users manage their personal finances efficiently. The app allows users to track income, expenses, and savings, providing insightful analytics to support better budgeting and financial planning.",
      technologies: ["Flutter", "Firebase", "Dart", "Provider", "HTTP/Dio", "Shared Preferences"],
      image: "/images/BachLife.png",
      link: "https://BachLife-app.co",
      github: "https://github.com/yourusername/BachLife-app"
    },
    {
      title: "Social Media Platform",
      description: "A social networking app with real-time chat, story features, and content sharing capabilities.",
      technologies: ["React Native", "Socket.io", "AWS", "GraphQL"],
      image: "/icons/app-icon.svg",
      link: "https://social-app.com",
      github: "https://github.com/yourusername/social-app"
    },
    {
      title: "Food Delivery App",
      description: "On-demand food delivery platform with real-time order tracking and restaurant management system.",
      technologies: ["Flutter", "Node.js", "MongoDB", "Google Maps API"],
      image: "/icons/app-icon.svg",
      link: "https://food-delivery.com",
      github: "https://github.com/yourusername/food-delivery"
    }
  ];

  const webProjects = [
    {
      title: "Portfolio Website",
      description: "Modern portfolio website with smooth animations, dark mode, and responsive design.",
      technologies: ["React", "Tailwind CSS", "Framer Motion", "TypeScript"],
      image: "/images/w1.png",
      link: "https://portfolio.com",
      github: "https://github.com/Maharab2134/Maharab_Portfolio",
      featured: true
    },
    {
      title: "Task Management System",
      description: "Full-stack web application for project and task management with real-time updates and team collaboration features.",
      technologies: ["React", "Node.js", "Express", "PostgreSQL", "Socket.io"],
      image: "/images/task-manager.jpg",
      link: "https://task-manager.com",
      github: "https://github.com/yourusername/task-manager"
    },
    {
      title: "E-Learning Platform",
      description: "Interactive learning platform with video courses, quizzes, and progress tracking.",
      technologies: ["Next.js", "Django", "PostgreSQL", "AWS S3"],
      image: "/projects/elearning.jpg",
      link: "https://elearning.com",
      github: "https://github.com/yourusername/elearning"
    },
    {
      title: "Real Estate Marketplace",
      description: "Property listing platform with advanced search, virtual tours, and mortgage calculator.",
      technologies: ["React", "Node.js", "MongoDB", "Three.js"],
      image: "/projects/real-estate.jpg",
      link: "https://real-estate.com",
      github: "https://github.com/yourusername/real-estate"
    }
  ];

  const mlProjects = [
    {
      title: "Image Classification Model",
      description: "Deep learning model for image classification using transfer learning and custom dataset with 95% accuracy.",
      technologies: ["TensorFlow", "Python", "OpenCV", "NumPy", "Keras"],
      image: "/projects/image-classifier.jpg",
      link: "https://image-classifier.com",
      github: "https://github.com/yourusername/image-classifier",
      featured: true
    },
    {
      title: "Sentiment Analysis Tool",
      description: "NLP-based sentiment analysis tool for social media content and reviews with multi-language support.",
      technologies: ["PyTorch", "NLTK", "BERT", "Python", "FastAPI"],
      image: "/projects/sentiment-analyzer.jpg",
      link: "https://sentiment-analyzer.com",
      github: "https://github.com/yourusername/sentiment-analyzer"
    },
    {
      title: "Recommendation System",
      description: "Personalized content recommendation engine using collaborative filtering and content-based approaches.",
      technologies: ["Scikit-learn", "Pandas", "NumPy", "Flask", "Redis"],
      image: "/projects/recommender.jpg",
      link: "https://recommender.com",
      github: "https://github.com/yourusername/recommender"
    },
    {
      title: "Time Series Forecasting",
      description: "Advanced time series forecasting model for financial data prediction and analysis.",
      technologies: ["TensorFlow", "Prophet", "Pandas", "Plotly", "FastAPI"],
      image: "/projects/forecasting.jpg",
      link: "https://forecasting.com",
      github: "https://github.com/yourusername/forecasting"
    }
  ];

  return (
    <section id="projects" className="py-20 bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a]">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-textPrimary">
            My Projects
          </h2>
          <div className="w-20 h-1 mx-auto bg-secondary">
            
          </div>
          <p className="max-w-2xl mx-auto mt-3 text-lg text-gray-400">
            Explore my work across different domains of development, from mobile apps to machine learning solutions
          </p>
        </motion.div>
    
        {[{
          icon: FaMobile,
          title: 'App Development',
          projects: appProjects,
          showAll: showAllApps,
          setShowAll: setShowAllApps
        }, {
          icon: FaGlobe,
          title: 'Web Development',
          projects: webProjects,
          showAll: showAllWeb,
          setShowAll: setShowAllWeb
        }, {
          icon: FaBrain,
          title: 'Machine Learning',
          projects: mlProjects,
          showAll: showAllML,
          setShowAll: setShowAllML
        }].map((section, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="flex items-center gap-4 mb-8">
              <span className="text-3xl text-purple-400">{section.icon({ size: 28 })}</span>
              <h3 className="text-2xl font-semibold text-white">{section.title}</h3>
            </div>
            <ProjectGrid projects={section.projects} showAll={section.showAll} />
            {section.projects.length > 2 && (
              <div className="mt-8 text-center">
                <ShowMoreButton
                  onClick={() => section.setShowAll(!section.showAll)}
                  isExpanded={section.showAll}
                />
              </div>
            )}
          </motion.div>
        ))}
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
                scale: [0.7, 1.1, 0.7]
              }}
              transition={{
                duration: Math.random() * 6 + 6, // Duration between 6 and 12 seconds
                repeat: Infinity,
                repeatType: 'mirror',
                delay: i * 0.4
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

export default Projects;
 