/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        soc: {
          bg: '#070b14',
          surface: '#0d1527',
          card: '#111b33',
          cardHover: '#162240',
          border: '#1e2e4f',
          borderLight: '#2a3f6c',
          text: '#f1f5f9',
          muted: '#8b9bb4',
        },
        cyber: {
          safe: '#10b981',      // Emerald green
          safeBg: 'rgba(16, 185, 129, 0.1)',
          warning: '#f59e0b',   // Amber
          warningBg: 'rgba(245, 158, 11, 0.1)',
          danger: '#ef4444',    // Red / High
          dangerBg: 'rgba(239, 68, 68, 0.1)',
          critical: '#dc2626',  // Deep Red / Critical
          criticalBg: 'rgba(220, 38, 38, 0.15)',
          info: '#0ea5e9',      // Sky Blue / Monitoring
          infoBg: 'rgba(14, 165, 233, 0.1)',
          accent: '#6366f1',    // Indigo accent
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glow-safe': '0 0 15px -3px rgba(16, 185, 129, 0.3)',
        'glow-danger': '0 0 20px -3px rgba(239, 68, 68, 0.4)',
        'glow-info': '0 0 15px -3px rgba(14, 165, 233, 0.3)',
        'soc-card': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}
