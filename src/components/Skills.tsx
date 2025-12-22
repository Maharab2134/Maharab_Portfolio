import { motion } from 'framer-motion';
import type { ComponentType, CSSProperties } from 'react';
import { IconType } from 'react-icons';
import { 
  FaReact, 
  FaNodeJs, 
  FaDatabase, 
  FaCode, 
  FaTools, 
  FaGitAlt, 
  FaMobile, 
  FaPython,
  FaJava,
  FaAndroid,
  FaFigma
} from 'react-icons/fa';
import { 
  SiMongodb, 
  SiExpress, 
  SiJira, 
  SiPostman, 
  SiVsco, 
  SiTensorflow, 
  SiPytorch,
  SiFlutter,
  SiKotlin,
  SiMysql,
  SiFirebase,
  SiArduino,
  SiC,
  SiCplusplus,
  SiDart,
  SiTypescript,
  SiJavascript
} from 'react-icons/si';

// Define types for our data
type IconProps = { className?: string; size?: number; style?: CSSProperties };

interface Skill {
  icon: IconType;
  name: string;
  color: string;
  level: number;
}

interface SkillCategory {
  title: string;
  icon: IconType;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'cyan';
  skills: Skill[];
}

const Skills = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  const skillCategories: SkillCategory[] = [
    {
      title: "Programming Languages",
      icon: FaCode,
      color: "blue",
      skills: [
        { icon: SiC, name: 'C', color: '#A8B9CC', level: 95 },
        { icon: SiCplusplus, name: 'C++', color: '#00599C', level: 90 },
        { icon: FaJava, name: 'Java', color: '#ED8B00', level: 95 },
        { icon: FaPython, name: 'Python', color: '#3776AB', level: 85 },
        { icon: SiJavascript, name: 'JavaScript', color: '#F7DF1E', level: 88 },
        { icon: SiTypescript, name: 'TypeScript', color: '#3178C6', level: 85 },
        { icon: SiDart, name: 'Dart', color: '#0175C2', level: 75 },
        { icon: SiKotlin, name: 'Kotlin', color: '#7F52FF', level: 70 },
      ]
    },
    {
      title: "Development Frameworks",
      icon: FaMobile,
      color: "green",
      skills: [
        { icon: FaMobile, name: 'Mobile Development', color: '#4CAF50', level: 95 },
        { icon: FaReact, name: 'React', color: '#61DAFB', level: 85 },
        { icon: SiFlutter, name: 'Flutter', color: '#02569B', level: 88 },
        { icon: FaAndroid, name: 'Android Native', color: '#3DDC84', level: 95 },
        { icon: FaNodeJs, name: 'Node.js', color: '#339933', level: 85 },
        { icon: SiExpress, name: 'Express.js', color: '#000000', level: 80 },
      ]
    },
    {
      title: "Database & Storage",
      icon: FaDatabase,
      color: "purple",
      skills: [
        { icon: SiMysql, name: 'MySQL', color: '#4479A1', level: 85 },
        { icon: SiMongodb, name: 'MongoDB', color: '#47A248', level: 85 },
        { icon: FaDatabase, name: 'SQLite', color: '#003B57', level: 80 },
        { icon: SiFirebase, name: 'Firebase', color: '#FFCA28', level: 75 },
        { icon: SiMongodb, name: 'PostgreSQL', color: '#336791', level: 70 },
      ]
    },
    {
      title: "Tools & Platforms",
      icon: FaTools,
      color: "orange",
      skills: [
        { icon: FaGitAlt, name: 'Git', color: '#F05032', level: 90 },
        { icon: SiVsco, name: 'VS Code', color: '#007ACC', level: 95 },
        { icon: FaAndroid, name: 'Android Studio', color: '#3DDC84', level: 95 },
        { icon: SiPostman, name: 'Postman', color: '#FF6C37', level: 85 },
        { icon: FaFigma, name: 'Figma', color: '#F24E1E', level: 70 },
        { icon: SiArduino, name: 'Arduino', color: '#00979D', level: 65 },
      ]
    },
    {
      title: "Machine Learning & AI",
      icon: SiTensorflow,
      color: "cyan",
      skills: [
        { icon: SiTensorflow, name: 'TensorFlow', color: '#FF6F00', level: 70 },
        { icon: SiPytorch, name: 'PyTorch', color: '#EE4C2C', level: 65 },
        { icon: FaPython, name: 'Machine Learning', color: '#3776AB', level: 75 },
        { icon: FaCode, name: 'Data Analysis', color: '#61DAFB', level: 70 },
      ]
    }
  ];

  const getGradientColors = (color: string) => {
    const gradients: Record<string, string> = {
      blue: "from-blue-500 to-cyan-500",
      green: "from-green-500 to-emerald-500",
      purple: "from-purple-500 to-pink-500",
      orange: "from-orange-500 to-red-500",
      cyan: "from-cyan-500 to-blue-500"
    };
    return gradients[color] || gradients.blue;
  };

  const getIconColor = (color: string) => {
    const colors: Record<string, string> = {
      blue: "text-blue-400",
      green: "text-green-400",
      purple: "text-purple-400",
      orange: "text-orange-400",
      cyan: "text-cyan-400"
    };
    return colors[color] || colors.blue;
  };

  // Create icon components with proper typing
  const renderIcon = (Icon: IconType, props: IconProps) => {
    // Some versions of react-icons type IconType's return as ReactNode which
    // causes TS2786 when used directly in JSX. Cast to ComponentType to
    // satisfy the JSX typing contract.
    const IconComponent = Icon as unknown as ComponentType<IconProps>;
    return <IconComponent {...props} />;
  };

  return (
    <section id="skills" className="py-16 bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a]">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            Technical Skills
          </h2>
          <motion.div 
            className="w-24 h-1.5 mx-auto bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: "6rem" }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="max-w-2xl mx-auto mt-4 text-lg text-gray-300 md:text-xl"
          >
            A comprehensive overview of my technical expertise across various domains
          </motion.p>
        </motion.div>

        {/* Skills Grid */}
        <div className="space-y-8">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="p-6 transition-all duration-300 border bg-white/5 rounded-2xl backdrop-blur-sm border-white/10 hover:border-white/20"
            >
              {/* Category Header */}
              <motion.div 
                variants={itemVariants}
                className="flex items-center gap-4 mb-6"
              >
                <motion.div 
                  className={`p-3 rounded-2xl bg-gradient-to-br ${getGradientColors(category.color)}`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {renderIcon(category.icon, {
                    className: `text-2xl ${getIconColor(category.color)}`
                  })}
                </motion.div>
                <h3 className="text-2xl font-bold text-white md:text-3xl">
                  {category.title}
                </h3>
              </motion.div>

              {/* Skills Grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {category.skills.map((skill, skillIndex) => (
                  <motion.div
                    key={skill.name}
                    variants={itemVariants}
                    whileHover={{ 
                      scale: 1.02, 
                      y: -2,
                      transition: { type: "spring", stiffness: 300 }
                    }}
                    className="p-4 transition-all duration-300 cursor-pointer rounded-xl bg-white/5 hover:bg-white/10 group"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <motion.div
                        className="flex items-center justify-center w-10 h-10 rounded-xl"
                        style={{ backgroundColor: `${skill.color}15` }}
                        whileHover={{ scale: 1.1 }}
                      >
                        {renderIcon(skill.icon, {
                          size: 20,
                          style: { color: skill.color }
                        })}
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-white truncate md:text-base">
                          {skill.name}
                        </h4>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Proficiency</span>
                        <span>{skill.level}%</span>
                      </div>
                      <div className="w-full h-2 overflow-hidden rounded-full bg-white/10">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ 
                            background: `linear-gradient(90deg, ${skill.color}80, ${skill.color})`
                          }}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          transition={{ 
                            duration: 1, 
                            delay: (categoryIndex * 0.1) + (skillIndex * 0.05),
                            ease: "easeOut"
                          }}
                          viewport={{ once: true }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;