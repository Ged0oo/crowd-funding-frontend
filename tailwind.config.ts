import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background:                  '#f7f9fb',
        surface:                     '#f7f9fb',
        'surface-bright':            '#f7f9fb',
        'surface-dim':               '#d8dadc',
        'surface-container-lowest':  '#ffffff',
        'surface-container-low':     '#f2f4f6',
        'surface-container':         '#eceef0',
        'surface-container-high':    '#e6e8ea',
        'surface-container-highest': '#e0e3e5',
        'surface-variant':           '#e0e3e5',
        'surface-tint':              '#006c49',
        'inverse-surface':           '#2d3133',

        primary:                     '#006c49',
        'primary-container':         '#10b981',
        'primary-fixed':             '#6ffbbe',
        'primary-fixed-dim':         '#4edea3',
        'inverse-primary':           '#4edea3',
        'on-primary':                '#ffffff',
        'on-primary-container':      '#00422b',
        'on-primary-fixed':          '#002113',
        'on-primary-fixed-variant':  '#005236',

        secondary:                   '#505f76',
        'secondary-container':       '#d0e1fb',
        'on-secondary':              '#ffffff',
        'on-secondary-container':    '#54647a',

        tertiary:                    '#a43a3a',
        'tertiary-container':        '#fc7c78',
        'on-tertiary':               '#ffffff',
        'on-tertiary-container':     '#711419',
        'on-surface':                '#191c1e',
        'on-surface-variant':        '#3c4a42',
        'on-background':             '#191c1e',
        'inverse-on-surface':        '#eff1f3',

        outline:                     '#6c7a71',
        'outline-variant':           '#bbcabf',
        
        error:                       '#ba1a1a',
        'error-container':           '#ffdad6',
        'on-error':                  '#ffffff',
        'on-error-container':        '#93000a',
      },

      fontFamily: {
        headline: ['Manrope', 'sans-serif'],
        body:     ['Inter', 'sans-serif'],
        label:    ['Inter', 'sans-serif'],
        sans:     ['Inter', 'sans-serif'],
      },

      borderRadius: {
        xl:  '0.75rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        '4xl': '2.5rem',
      },

      boxShadow: {
        soft:  '0 10px 30px -12px rgba(25, 28, 30, 0.08)',
        card:  '0 2px 16px -4px rgba(25, 28, 30, 0.06)',
        float: '0 8px 48px -8px rgba(25, 28, 30, 0.12)',
      },
    },
  },
  plugins: [],
}

export default config
