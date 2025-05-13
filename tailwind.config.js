/** @type {import('@tailwindcss/postcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // darkMode is now configured directly in globals.css using @custom-variant
  theme: {
    extend: {
      colors: {
        // You can define custom colors here if needed
      },
    },
  },
  plugins: [],
  future: {
    hoverOnlyWhenSupported: true,
  },
};
