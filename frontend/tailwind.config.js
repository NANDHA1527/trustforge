/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#070C18',
        surface: {
          DEFAULT: '#0D1527',
          elevated: '#121D36',
          border: '#1E2D4A',
          hover: '#1A294A'
        },
        security: {
          blue: '#3B82F6',
          sky: '#38BDF8',
          cyan: '#06B6D4',
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#EF4444'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        glow: '0 0 20px -5px rgba(59, 130, 246, 0.3)',
        glowEmerald: '0 0 20px -5px rgba(16, 185, 129, 0.3)',
        glowRose: '0 0 20px -5px rgba(239, 68, 68, 0.3)',
        subtle: '0 4px 20px 0 rgba(0, 0, 0, 0.35)'
      }
    },
  },
  plugins: [],
}
