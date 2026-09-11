/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./public/index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#030014",
        secondary: "#38bdf8",
        tertiary: "#0f172a",
        textPrimary: "#f8fafc",
        textSecondary: "#94a3b8",
        brand: {
          dark: "#030014",
          surface: "#0a0f1e",
          card: "#0f172a",
          border: "rgba(255, 255, 255, 0.08)",
          purple: "#a855f7",
          pink: "#ec4899",
          cyan: "#06b6d4",
          blue: "#3b82f6",
          emerald: "#10b981",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      dropShadow: {
        glow: "0 0 16px rgba(168,85,247,0.35)",
        cyan: "0 0 16px rgba(6,182,212,0.35)",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        soft: "0 8px 30px rgba(0,0,0,0.35)",
        glow: "0 0 24px rgba(168,85,247,0.35)",
        card: "0 10px 30px -10px rgba(2, 6, 23, 0.7)",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: 0.4, transform: "scale(1)" },
          "50%": { opacity: 0.8, transform: "scale(1.05)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        pulseGlow: "pulseGlow 4s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
