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
        bg: 'var(--bg)',
        card: 'var(--card)',
        primary: 'var(--primary)',
        'primary-contrast': 'var(--primary-contrast)',
        accent: 'var(--accent)',
        warn: 'var(--warn)',
        danger: 'var(--danger)',
        text: 'var(--text)',
        muted: 'var(--muted)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config 