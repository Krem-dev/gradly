import type { BrandVariants } from '@fluentui/react-components'

/**
 * Gradly brand ramp.
 *
 * Fluent expects 16 perceptual steps, 10 (darkest) → 160 (lightest). This ramp is
 * generated in HSL with a tuned lightness curve and a slight hue drift (228° at the
 * dark end → 240° at the light end) so it stays smooth instead of banding.
 *
 * Two anchors keep it tied to the old design:
 *   - shade 80  = #4F46E5 — the legacy `indigo` DEFAULT. Fluent maps shade 80 to
 *     `colorBrandBackground`, so primary buttons/links land on exactly the old indigo.
 *   - shade 20  ≈ #0B133D — within a hair of the legacy `ink-900` (#0B1437), so dark
 *     sections keep the same navy without a second ramp.
 *
 * Do not hand-edit single steps: regenerate the whole ramp, or the curve breaks and
 * hover/pressed states (shades 70/40) stop reading as the same colour family.
 */
export const gradlyBrand: BrandVariants = {
  10: '#080E26',
  20: '#0B133D',
  30: '#0E1753',
  40: '#11186F',
  50: '#141B8F',
  60: '#191CB3',
  70: '#221FDB',
  80: '#4F46E5',
  90: '#675DE9',
  100: '#7F78ED',
  110: '#9892F2',
  120: '#ACA8F5',
  130: '#C1BEF9',
  140: '#D1D0FB',
  150: '#E0E0FD',
  160: '#EEEEFE',
}

/**
 * Amber accent ramp. Fluent only supports ONE brand ramp per theme, so amber lives
 * outside the theme object as custom tokens (see `tokens.ts`). It carries the same
 * role it did before: focus rings, the dot in a section label, the arrow pill inside
 * a primary button, "needs attention" states.
 */
export const gradlyAmber = {
  10: '#2A1A00',
  20: '#452B00',
  30: '#613C00',
  40: '#7D4E00',
  50: '#9A6000',
  60: '#B87300',
  70: '#D97706',
  80: '#F59E0B',
  90: '#FBBF24',
  100: '#FCD34D',
  110: '#FDE68A',
  120: '#FEF3C7',
  130: '#FFFBEB',
} as const
