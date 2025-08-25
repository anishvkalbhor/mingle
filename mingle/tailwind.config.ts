import type { Config } from "tailwindcss"
import defaultTheme from "tailwindcss/defaultTheme"

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pacifico: ["var(--font-pacifico)", ...defaultTheme.fontFamily.sans],
        satoshi: ['Satoshi', 'sans-serif'],
        sans: ['var(--font-outfit)', 'sans-serif'],
        jakarta: ['var(--font-jakarta)'],
        urbanist: ['var(--font-urbanist)'],
      },
    },
  },
  plugins: [],
}
export default config
