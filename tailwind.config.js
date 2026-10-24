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
        fc: {
          bg: '#1e1e1e',
          panel: '#282828',
          header: '#323232',
          toolbar: '#2a2a2a',
          border: '#3a3a3a',
          borderLight: '#4a4a4a',
          accent: '#007aff',
          timeline: '#181818',
          playhead: '#ff3b30',
          skimmer: '#ff9500',
          clipBlue: '#1e5f99',
          clipGreen: '#237344',
          clipPurple: '#7b3f94',
          clipCyan: '#1e808a',
          textMuted: '#999999',
          textMain: '#e6e6e6',
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Text"', '"SF Pro Display"', 'Helvetica Neue', 'sans-serif'],
        mono: ['"SF Mono"', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      }
    },
  },
  plugins: [],
}
