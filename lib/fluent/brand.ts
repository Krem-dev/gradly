import type { BrandVariants } from '@fluentui/react-components'

/**
 * Fluent's own brand ramps, re-exported so the theme reads from one place.
 *
 * These are Microsoft's shipped ramps, not a Gradly-tinted copy. Fluent derives
 * roughly 460 colour slots from whichever ramp the theme is built with — every
 * hover, pressed, selected, disabled and inverted state included — so using an
 * official ramp is what makes the rest of the palette internally consistent.
 *
 * `brandWeb` is the Fluent default (the blue at shade 80, #0f6cbd).
 * `brandTeams` is the Teams purple (#5b5fc7), if a warmer brand is wanted later.
 *
 * Swapping brand is a one-line change in `theme.ts` — nothing else references a
 * brand colour directly.
 */

export const brandWeb: BrandVariants = {
  10: '#061724',
  20: '#082338',
  30: '#0a2e4a',
  40: '#0c3b5e',
  50: '#0e4775',
  60: '#0f548c',
  70: '#115ea3',
  80: '#0f6cbd',
  90: '#2886de',
  100: '#479ef5',
  110: '#62abf5',
  120: '#77b7f7',
  130: '#96c6fa',
  140: '#b4d6fa',
  150: '#cfe4fa',
  160: '#ebf3fc',
}

export const brandTeams: BrandVariants = {
  10: '#2b2b40',
  20: '#2f2f4a',
  30: '#333357',
  40: '#383966',
  50: '#3d3e78',
  60: '#444791',
  70: '#4f52b2',
  80: '#5b5fc7',
  90: '#7579eb',
  100: '#7f85f5',
  110: '#9299f7',
  120: '#aab1fa',
  130: '#b6bcfa',
  140: '#c5cbfa',
  150: '#dce0fa',
  160: '#e8ebfa',
}
