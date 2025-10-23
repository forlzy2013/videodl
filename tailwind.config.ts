import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        apple: {
          bg: '#FFFFFF',
          'bg-secondary': '#F5F5F7',
          'text-primary': '#1D1D1F',
          'text-secondary': '#6E6E73',
          accent: '#0071E3',
          success: '#34C759',
          error: '#FF3B30',
          border: '#D2D2D7',
          'hover-bg': '#E8E8ED',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      fontSize: {
        heading: ['32px', { lineHeight: '1.2', fontWeight: '600' }],
        body: ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        button: ['14px', { lineHeight: '1.4', fontWeight: '500' }],
      },
      spacing: {
        'section-y': '48px',
        'section-x': '24px',
        'component': '16px',
      },
      borderRadius: {
        apple: '12px',
      },
    },
  },
  plugins: [],
}
export default config
