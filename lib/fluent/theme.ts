import {
  webLightTheme,
  webDarkTheme,
  type Theme,
} from '@fluentui/react-components'

/**
 * Gradly uses Fluent's shipped web themes as-is.
 *
 * No brand override, no radius override, no font override. Earlier this file
 * re-skinned Fluent into the old Tailwind look (pill buttons, serif headings, an
 * amber focus ring) and the result stopped reading as Fluent at all — which is
 * the opposite of the point. Fluent's defaults are a complete, accessibility-
 * tested system; the way to stay consistent with it is to not fight it.
 *
 * To move to the Teams purple brand instead:
 *
 *   import { createLightTheme, createDarkTheme } from '@fluentui/react-components'
 *   import { brandTeams } from './brand'
 *   export const gradlyLightTheme = createLightTheme(brandTeams)
 *   export const gradlyDarkTheme  = createDarkTheme(brandTeams)
 *
 * That is the only edit required — nothing in the component layer names a colour.
 */
export const gradlyLightTheme: Theme = webLightTheme
export const gradlyDarkTheme: Theme = webDarkTheme

export type GradlyThemeMode = 'light' | 'dark'
