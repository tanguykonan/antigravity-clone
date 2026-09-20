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
        // Palette exacte extraite de l'interface réelle Antigravity (warm dark)
        bg: {
          base: '#181a17',      // fond chat/principal
          sidebar: '#1e201d',   // fond sidebar
          elevated: '#282a26',  // cartes, inputs
          hover: '#252723',     // survol
          active: '#343632',    // pill active
          border: '#282a26',    // séparateurs et bordures
        },
        text: {
          primary: '#eceee9',   // texte principal blanc cassé
          secondary: '#9e9e9a', // texte de projets et navigation
          muted: '#7a7c78',     // sous-titres, dates
          accent: '#a78bfa',    // violet d'accentuation
        },
        accent: {
          DEFAULT: '#7c6aed',
          hover: '#8b7af5',
          bg: '#2d2640',
        }
      },
      fontSize: {
        '2xs': ['11px', '15px'],
        'xs': ['12px', '16px'],
        'sm': ['13px', '18px'],
        'base': ['14px', '20px'],
      }
    }
  },
  plugins: []
}
