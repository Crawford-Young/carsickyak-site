import type { Decorator, Preview } from '@storybook/nextjs-vite'

import '../src/app/globals.css'

/**
 * Wraps every story in the carsickyak theme scope and toggles the `.dark` class
 * from the toolbar Theme control (light-first, matching the site default).
 */
const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme === 'dark' ? 'dark' : ''
  return (
    <div
      className={`theme-carsickyak ${theme} bg-background text-foreground`}
      style={{ minHeight: '100vh', padding: '2rem' }}
    >
      <Story />
    </div>
  )
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
  },
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [withTheme],
}

export default preview
