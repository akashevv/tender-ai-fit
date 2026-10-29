// tailwind.config.cjs
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2b6cb0', // teal/blue accent
        secondary: '#38a169', // emerald accent
        success: '#48bb78', // green
        warning: '#ed8936', // orange
        danger: '#e53e3e', // red
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
