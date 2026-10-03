import {
  createLightTheme,
  createDarkTheme,
  type Theme,
} from '@fluentui/react-components'
import { gradlyBrand } from './brand'

const FONT_BASE =
  "var(--font-inter), Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
const FONT_MONO =
  "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace"

/**
 * Overrides applied on top of Fluent's generated theme, in both modes.
 *
 * Fluent's defaults are built for dense Microsoft product UI: 4px radii, Segoe UI,
 * tight type. Gradly is an editorial consumer product, so we widen the shape scale
 * and swap the type ramp onto Inter. Everything else (the 400-odd colour slots) is
 * left to Fluent's generator, which is the point of using it — hover, pressed,
 * selected, disabled and inverted states all stay internally consistent.
 */
const sharedOverrides = {
  fontFamilyBase: FONT_BASE,
  fontFamilyMonospace: FONT_MONO,
  fontFamilyNumeric: FONT_BASE,

  // Softer, more editorial shape language than Fluent's 2/4/6/8.
  borderRadiusNone: '0',
  borderRadiusSmall: '6px',
  borderRadiusMedium: '10px',
  borderRadiusLarge: '14px',
  borderRadiusXLarge: '20px',
  borderRadiusCircular: '9999px',

  // Fluent's stroke widths are 1/2/3px; keep 1px hairlines but make the focus
  // indicator 2px so the amber ring reads clearly on white.
  strokeWidthThin: '1px',
  strokeWidthThick: '2px',
} satisfies Partial<Theme>

export const gradlyLightTheme: Theme = {
  ...createLightTheme(gradlyBrand),
  ...sharedOverrides,
}

export const gradlyDarkTheme: Theme = {
  ...createDarkTheme(gradlyBrand),
  ...sharedOverrides,
}

/**
 * Fluent derives dark-mode brand colours from the ramp's light end, which on our
 * ramp is a pale lavender — too washed out for buttons on a near-black surface.
 * Pull the interactive brand slots back toward the mid ramp so dark-mode primary
 * buttons stay recognisably indigo.
 */
gradlyDarkTheme.colorBrandForeground1 = gradlyBrand[110]
gradlyDarkTheme.colorBrandForeground2 = gradlyBrand[120]
gradlyDarkTheme.colorNeutralForeground2BrandHover = gradlyBrand[110]
gradlyDarkTheme.colorNeutralForeground2BrandPressed = gradlyBrand[100]

export type GradlyThemeMode = 'light' | 'dark'
