/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/renderer/index.html',
    './src/renderer/src/**/*.{js,ts,jsx,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Palette extraite de la capture Antigravity
        bg: {
          base: '#141414',    // fond principal quasi-noir
          sidebar: '#1a1a1a', // sidebar légèrement plus claire
          elevated: '#1e1e1e', // cartes, inputs
          hover: '#252525',    // état hover
          active: '#2a2a2a',   // état actif/sélectionné
          border: '#2a2a2a',   // séparateurs
        },
        text: {
          primary: '#e8e8e8',  // texte principal
          secondary: '#888888', // texte secondaire / labels
          muted: '#555555',    // très discret
          accent: '#a78bfa',   // violet doux (accent Antigravity)
        },
        accent: {
          DEFAULT: '#7c6aed',  // violet Antigravity
          hover: '#8b7af5',
          bg: '#2d2640',       // fond accent très discret
        }
      },
      fontSize: {
        '2xs': ['10px', '14px'],
        'xs': ['11px', '16px'],
        'sm': ['12px', '18px'],
        'base': ['13px', '20px'],
      }
    }
  },
  plugins: []
}
