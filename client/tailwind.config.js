/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Architectural Dark Navy & Cinematic Palette from bg_image
        navy: {
          dark: '#0D1A28',       // Primary Background
          deep: '#101C2C',       // Secondary Dark Navy
          midnight: '#15283A',   // Shell / Container
          glass: 'rgba(15, 28, 42, 0.78)', // Floating Translucent Card
        },
        surface: {
          dark: '#17283A',       // Dark Surface
          subDark: '#1A2E42',    // Sub Surface
        },
        // Orangish / Warm Amber Dusk Accent Palette
        orange: {
          muted: '#E88D38',      // Warm Dusk Orange Accent
          hover: '#F09B48',      // Orange Hover
          glow: 'rgba(232, 141, 56, 0.25)',
          border: 'rgba(232, 141, 56, 0.2)',
        },
        teal: {
          muted: '#E88D38',      // Mapped to Warm Dusk Orange per user request
          hover: '#F09B48',      // Hover State
          soft: '#F3C082',       // Soft Amber
        },
        cream: {
          warm: '#E9E3D2',       // Warm Cream Headings
          sand: '#D8D1BF',       // Soft Sand Text
          border: 'rgba(232, 141, 56, 0.2)', // Warm Glassmorphism Border
        },
        txt: {
          main: '#F3F0E8',       // Main Body Text
          muted: '#A7B1B5',      // Muted Copy
        },
        semantic: {
          success: '#5FAF9A',
          warning: '#E88D38',
          danger: '#C96A6A',
          info: '#6F9FB2',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Playfair Display', 'Cormorant Garamond', 'Georgia', 'serif'],
      },
      boxShadow: {
        glass: '0 25px 80px rgba(0, 0, 0, 0.45)',
        card: '0 4px 20px -2px rgba(0, 0, 0, 0.25)',
        orangeGlow: '0 0 25px rgba(232, 141, 56, 0.15)',
      },
    },
  },
  plugins: [],
};
