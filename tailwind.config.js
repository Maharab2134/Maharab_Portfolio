/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0a192f",
        secondary: "#64ffda",
        tertiary: "#112240",
        textPrimary: "#ccd6f6",
        textSecondary: "#8892b0",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      dropShadow: {
        glow: "0 0 14px rgba(100,255,218,0.25)",
      },
      boxShadow: {
        soft: "0 8px 30px rgba(0,0,0,0.25)",
        glow: "0 0 24px rgba(168,85,247,0.35)",
      },
      keyframes: {
        wave: {
          "0%": { transform: "rotate(0deg)" },
          "10%": { transform: "rotate(14deg)" },
          "20%": { transform: "rotate(-8deg)" },
          "30%": { transform: "rotate(14deg)" },
          "40%": { transform: "rotate(-4deg)" },
          "50%": { transform: "rotate(10deg)" },
          "60%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
      },
      animation: {
        wave: "wave 2.5s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
      },
      backgroundImage: {
        "radial-fade":
          "radial-gradient(1000px 600px at 10% 10%, rgba(100,255,218,0.06), transparent 60%), radial-gradient(1000px 600px at 90% 90%, rgba(168,85,247,0.08), transparent 60%)",
      },
    },
  },
  plugins: [],
};
