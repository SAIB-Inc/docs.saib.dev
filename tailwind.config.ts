import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,md,mdx}',
    './docs/**/*.{md,mdx}',
    './blog/**/*.{md,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

export default config
