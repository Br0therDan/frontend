// tailwind.config.js
import defaultTheme from 'tailwindcss/defaultTheme'
import tailwindcssAnimate from 'tailwindcss-animate'
import tailwindcssTypography from '@tailwindcss/typography'
import tailwindcssForms from '@tailwindcss/forms'
import tailwindcssAspectRatio from '@tailwindcss/aspect-ratio'
import tailwindcssLineClamp from '@tailwindcss/line-clamp'

module.exports = {
  darkMode: ['class'],
  content: ['./src/**/*.{js,jsx,ts,tsx,css}'],
  safelist: ['ProseMirror'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      borderOpacity: {
        10: '0.1',
      },
      tailwindcssAnimate,
      tailwindcssTypography,
      tailwindcssForms,
      tailwindcssAspectRatio,
      tailwindcssLineClamp,
    },
  },
}
