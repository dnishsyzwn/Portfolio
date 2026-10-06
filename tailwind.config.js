/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "rgb(var(--navy-rgb) / <alpha-value>)",
          deep: "#0d2640",
          dim: "rgba(27, 76, 120, 0.65)",
          ghost: "rgba(27, 76, 120, 0.08)",
        },
        sky: {
          DEFAULT: "#3f6aa6",
          strong: "#2e5189",
          soft: "#a4cff0",
          pale: "#e6f2fc",
        },
        silk: {
          1: "#c8e4f8",
          2: "#edf6ff",
          3: "#a4cff0",
          deep: "#7cb8e8",
        },
        paper: "#f4f8fc",
        surface: "#eef3f9",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Plus Jakarta Sans", "Inter Tight", "Geist", "-apple-system", "sans-serif"],
        display: ["var(--font-display)", "Playfair Display", "Cormorant Garamond", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Geist", "Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-mono)", "Geist Mono", "JetBrains Mono", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        tighter: "-0.04em",
        tight: "-0.02em",
        normal: "-0.01em",
        tracked: "0.08em",
      },
      animation: {
        marquee: "marquee 32s linear infinite",
        "glass-sweep": "glass-sweep 9s ease-in-out infinite",
        swim: "swim 15s linear infinite",
        drift: "drift 8s ease-in-out infinite alternate",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "glass-sweep": {
          "0%, 58%": { backgroundPosition: "0% 0" },
          "88%, 100%": { backgroundPosition: "100% 0" },
        },
        swim: {
          "0%": { transform: "translateX(-150px) translateY(0) scaleX(1)" },
          "25%": { transform: "translateX(25vw) translateY(20px) scaleX(1)" },
          "50%": { transform: "translateX(50vw) translateY(-10px) scaleX(1)" },
          "75%": { transform: "translateX(75vw) translateY(15px) scaleX(1)" },
          "100%": { transform: "translateX(calc(100vw + 150px)) translateY(0) scaleX(1)" },
        },
        drift: {
          "0%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-10px) rotate(2deg)" },
          "100%": { transform: "translateY(5px) rotate(-2deg)" },
        },
      },
    },
  },
  plugins: [],
};
