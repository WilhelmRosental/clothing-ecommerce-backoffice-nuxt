/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
    './app.vue'
  ],
  theme: {
    extend: {
      zIndex: {
        100: '100'
      },
      maxHeight: {
        128: '32rem'
      },
      maxWidth: {
        '1/4': '25%',
        '1/2': '50%',
        '2/3': '66%',
        '3/4': '75%'
      },
      height: {
        card: '420px',
        look: '320px'
      },
      keyframes: theme => ({
        'fade-in': {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)'
          },
          '50%': {
            opacity: '0.5'
          },
          '75%': {
            opacity: '0.75'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0px)'
          }
        }
      }),
      animation: {
        'fade-in': 'fade-in 0.5s ease-out'
      }
    }
  },
  plugins: []
}
