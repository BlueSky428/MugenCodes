import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0f1c1a",
        surface: "#f6f7f5",
        accent: "#1f6f6b",
        accentSoft: "#e3f1ef",
        night: "#0b1413",
        nightSoft: "#121f1d"
      },
      boxShadow: {
        soft: "0 12px 32px rgba(15, 28, 26, 0.08)",
        card: "0 18px 40px rgba(15, 28, 26, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
