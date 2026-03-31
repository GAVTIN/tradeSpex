/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        bg: {
          primary:   '#07090f',
          secondary: '#0c1018',
          tertiary:  '#111827',
          elevated:  '#192236',
        },
        border: {
          subtle: 'rgba(255,255,255,0.06)',
          dim:    'rgba(255,255,255,0.10)',
        },
        tx: {
          primary: '#c5d3e8',
          muted:   '#5b7191',
          faint:   '#3a5272',
        },
        brand: {
          blue:   '#2563eb',
          blueBg: 'rgba(37,99,235,0.12)',
          gold:   '#f4c430',
        },
        status: {
          green:  '#22d68a',
          red:    '#ff4f6a',
          amber:  '#f4b942',
        },
      },
    },
  },
  plugins: [],
};

