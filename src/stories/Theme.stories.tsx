import type { Meta, StoryObj } from '@storybook/nextjs-vite'

/**
 * Foundation swatch grid — verifies the carsickyak theme tokens resolve in both
 * light and dark (toggle via the toolbar Theme control). Feature component
 * stories land in later waves.
 */
function ThemeSwatches(): React.JSX.Element {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-serif text-2xl font-semibold">CarsickYak theme</h2>
      <p className="text-muted-foreground">Muted secondary text on the background token.</p>
      <div className="flex flex-wrap gap-3">
        <div className="bg-surface text-foreground border-border rounded-md border px-4 py-3">
          surface
        </div>
        <div className="bg-accent text-accent-foreground rounded-md px-4 py-3">accent</div>
        <div className="bg-ember rounded-md px-4 py-3 text-white">ember</div>
        <div className="bg-pine rounded-md px-4 py-3 text-white">pine</div>
        <div className="bg-gold-muted rounded-md px-4 py-3 text-black">gold</div>
      </div>
    </div>
  )
}

const meta: Meta<typeof ThemeSwatches> = {
  title: 'Foundation/Theme',
  component: ThemeSwatches,
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof ThemeSwatches>

export const Swatches: Story = {}
