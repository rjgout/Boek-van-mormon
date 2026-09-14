import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f2fbf4",
          100: "#e0f7e5",
          200: "#b9edc6",
          300: "#87dc9d",
          400: "#4fc370",
          500: "#2ba750",
          600: "#1c8a3f",
          700: "#186d34",
          800: "#17572c",
          900: "#144826",
        },
        gold: {
          400: "#f7c948",
          500: "#f0b429",
          600: "#de911d",
        },
        ice: {
          400: "#7dd3fc",
          500: "#38bdf8",
          600: "#0ea5e9",
        },
      },
      fontFamily: {
        display: ["Nunito", "system-ui", "sans-serif"],
      },
      keyframes: {
        pop: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-6px)" },
          "75%": { transform: "translateX(6px)" },
        },
        indeterminate: {
          "0%": { transform: "translateX(-60%) scaleX(0.4)" },
          "50%": { transform: "translateX(20%) scaleX(0.6)" },
          "100%": { transform: "translateX(110%) scaleX(0.4)" },
        },
      },
      animation: {
        pop: "pop 0.2s ease-out",
        shake: "shake 0.3s ease-in-out",
        indeterminate: "indeterminate 1.3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
