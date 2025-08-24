import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    screens: {
      sm: "375px", // phones (iPhone SE and up)
      md: "768px", // tablets
      lg: "1024px", // small laptops / iPad landscape
      xl: "1280px", // laptops
      "2xl": "1440px", // large laptops (MacBook Pro 15/16)
      "3xl": "1920px", // full HD monitors
       'h-md': { 'raw': '(min-height: 800px) and (max-height: 1000px)' },
    },
    extend: {
      fontFamily: {
        pacifico: ["var(--font-pacifico)", ...defaultTheme.fontFamily.sans],
        satoshi: ["Satoshi", "sans-serif"],
        sans: ["var(--font-outfit)", "sans-serif"],
        jakarta: ["var(--font-jakarta)"],
        urbanist: ["var(--font-urbanist)"],
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "88": "22rem",
        "128": "32rem",
        "safe-top": "env(safe-area-inset-top)",
        "safe-bottom": "env(safe-area-inset-bottom)",
      },
      minHeight: {
        "screen-small": "100vh",
        "screen-safe":
          "calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))",
      },
    },
  },
  plugins: [],
};
export default config;
