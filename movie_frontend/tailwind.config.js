/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#8B5CF6",   // Royal Purple primary
        secondary: "#6B7280", // Gray secondary
        background: "#F3E8FF",
        surface: "#FFFFFF",
        text: "#374151",
        success: "#10B981",
        error: "#EF4444"
      },
      gradientColorStops: {
        "royal-start": "rgb(243 232 255)", // purple-100
        "royal-end": "rgb(216 180 254)"    // purple-300
      },
      boxShadow: {
        "soft": "0 6px 20px rgba(139, 92, 246, 0.15)"
      },
      borderRadius: {
        "lgx": "14px"
      }
    },
  },
  plugins: [],
};
