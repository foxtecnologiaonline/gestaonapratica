import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.mdx",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#1e3a5f",
          light: "#2d5583",
          dark: "#14273f",
        },
      },
    },
  },
  plugins: [],
};

export default config;
