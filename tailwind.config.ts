import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      zIndex: {
        max: "9999",
      },
      colors: {
        "spotify-green": "#1DB954",
        "spotify-green-dark": "#1aa34a",
        "spotify-green-light": "#1ed760",
        "spotify-black": "#191414",
        "spotify-black-light": "#282828",
        "spotify-black-lighter": "#121212",
        "spotify-white": "#FFFFFF",
        "spotify-white-light": "#F5F5F5",
        "spotify-white-lighter": "#F0F0F0",
        "spotify-gray": "#535353",
        "spotify-gray-light": "#B3B3B3",
        "spotify-gray-lighter": "#E5E5E5",
        "spotify-gray-lightest": "#F5F5F5",
        "min-blue":
          "linear-gradient(90deg, #417B94 3.82%, rgba(74, 163, 199, 0.71) 95.66%)",
      },
      fontSize: {
        "400px": "400px",
      },
    },
  },
  plugins: [],
};
export default config;
