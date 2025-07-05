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
      },
    },
  },
  plugins: [],
}
export default config
