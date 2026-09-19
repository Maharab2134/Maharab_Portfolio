import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowDown } from "react-icons/fa";

const renderIcon = (Icon: any, props: any = {}) => {
  return <Icon {...props} />;
};

export const SmartScrollButton: React.FC = () => {
  // 'down' = pointing down (click to scroll down/bottom)
  // 'up' = pointing up (click to scroll to top)
  const [direction, setDirection] = useState<"down" | "up">("down");
  const [visible, setVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      const maxScroll = scrollHeight - clientHeight;

      // Show button if page is scrollable and user has scrolled at least 80px
      const isPageScrollable = maxScroll > 120;
      setVisible(isPageScrollable && (currentScrollY > 80 || maxScroll > 300));

      // Determine near bottom (within 280px of the footer)
      const isNearBottom = currentScrollY >= maxScroll - 280;
      // Determine near top (within first 250px)
      const isNearTop = currentScrollY <= 250;

      if (isNearBottom) {
        setDirection("up");
      } else if (isNearTop) {
        setDirection("down");
      } else {
        // While scrolling in the middle:
        // If scrolling down: arrow points DOWN
        // If scrolling up: arrow points UP
        if (currentScrollY > lastScrollY + 6) {
          setDirection("down");
        } else if (currentScrollY < lastScrollY - 6) {
          setDirection("up");
        }
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    if (direction === "down") {
      const scrollHeight = document.documentElement.scrollHeight;
      const currentScrollY = window.scrollY;
      const clientHeight = window.innerHeight;

      // If near top, smoothly scroll to next content section (1 viewport down)
      // Otherwise scroll all the way down
      if (currentScrollY < 300) {
        window.scrollTo({
          top: Math.min(clientHeight * 0.95, scrollHeight),
          behavior: "smooth",
        });
      } else {
        window.scrollTo({
          top: scrollHeight,
          behavior: "smooth",
        });
      }
    } else {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 12 }}
          transition={{ duration: 0.25 }}
          className="fixed z-40 bottom-20 sm:bottom-24 right-6 flex items-center gap-2 pointer-events-auto"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Action Tooltip */}
          <AnimatePresence>
            {isHovered && (
              <motion.span
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                className="hidden sm:inline-block px-2.5 py-1 text-[11px] font-semibold text-white rounded-lg bg-slate-900/90 border border-white/15 backdrop-blur-md shadow-lg pointer-events-none whitespace-nowrap"
              >
                {direction === "down" ? "Scroll Down ↓" : "Scroll to Top ↑"}
              </motion.span>
            )}
          </AnimatePresence>

          {/* Smart Floating Button */}
          <motion.button
            onClick={handleClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
            aria-label={direction === "down" ? "Scroll down" : "Scroll to top"}
            className="w-12 h-12 rounded-full border border-white/20 bg-slate-950/85 backdrop-blur-xl text-white shadow-xl shadow-black/50 flex items-center justify-center cursor-pointer transition-colors duration-300 hover:border-purple-400 hover:bg-purple-600/30 hover:shadow-purple-500/25"
          >
            <motion.div
              animate={{ rotate: direction === "down" ? 0 : 180 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="flex items-center justify-center text-white"
            >
              {renderIcon(FaArrowDown, { size: 15 })}
            </motion.div>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SmartScrollButton;
