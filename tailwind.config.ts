import type { Config } from 'tailwindcss';

// Locked design tokens — Direction B (Cultured Gulf Executive)
// See ~/Library/Application Support/Claude/...spaces/.../memory/project_website_design_tokens.md
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        // Emerald (primary)
        emerald: {
          50: '#ecf5f1',
          200: '#b3d4c8',
          500: '#2d7860',
          700: '#0e4a3e', // primary
          900: '#0a3329'  // darkest text
        },
        // Cream (backgrounds)
        cream: {
          50: '#faf6ee',  // page background
          100: '#fbf8f2', // alt section / cards
          200: '#e8dcc4', // sand cream / hero photo column
          400: '#d4cdb8'  // muted border / hover
        },
        // Gold (accents)
        gold: {
          400: '#a17b3a', // primary accent
          600: '#856229'  // gold deep / hover
        },
        // Body text on cream
        ink: {
          DEFAULT: '#3a3a36',
          muted: '#8b7d5f'
        }
      },
      fontFamily: {
        // English serif headlines
        serif: ['var(--font-playfair)', 'Georgia', 'Times New Roman', 'serif'],
        // English body
        sans: ['var(--font-inter)', 'Helvetica Neue', 'Arial', 'sans-serif'],
        // Arabic headlines (calligraphic / formal)
        'serif-ar': ['var(--font-naskh)', 'Times New Roman', 'serif'],
        // Arabic body
        'sans-ar': ['var(--font-plex-ar)', 'sans-serif']
      },
      letterSpacing: {
        eyebrow: '0.18em'
      },
      borderRadius: {
        card: '12px'
      }
    }
  },
  plugins: []
};

export default config;
