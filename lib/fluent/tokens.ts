/**
 * Gradly custom tokens.
 *
 * Fluent's own `tokens` export covers everything Fluent components theme themselves
 * with (surfaces, strokes, brand, radii, shadows, type ramp). This file adds the
 * things Fluent has no slot for but the Gradly design depends on:
 *
 *   - the `ink` neutral scale (the old navy-tinted greys)
 *   - the `amber` accent (Fluent allows one brand ramp only)
 *   - the editorial `display` type scale (clamp-based, serif)
 *   - the two signature shadows (`soft`, `lift`) and the pill radius
 *
 * These follow Fluent's own pattern exactly: each value is a `var(--…)` string, and
 * the matching custom properties are emitted once by `<GradlyProvider>`. That means
 * they participate in the cascade — a dark section can re-declare `--gradly-ink-*`
 * and everything downstream inverts without prop-drilling.
 */

export const gradlyTokens = {
  // ── Ink (navy-tinted neutral scale) ───────────────────────────────────────
  ink900: 'var(--gradly-ink-900)',
  ink800: 'var(--gradly-ink-800)',
  ink700: 'var(--gradly-ink-700)',
  ink600: 'var(--gradly-ink-600)',
  ink500: 'var(--gradly-ink-500)',
  ink400: 'var(--gradly-ink-400)',
  ink300: 'var(--gradly-ink-300)',
  ink200: 'var(--gradly-ink-200)',
  ink100: 'var(--gradly-ink-100)',
  ink50: 'var(--gradly-ink-50)',

  // ── Amber accent ──────────────────────────────────────────────────────────
  amber: 'var(--gradly-amber)',
  amberLight: 'var(--gradly-amber-light)',
  amberDark: 'var(--gradly-amber-dark)',
  amberSubtle: 'var(--gradly-amber-subtle)',

  // ── Status ────────────────────────────────────────────────────────────────
  success: 'var(--gradly-success)',
  danger: 'var(--gradly-danger)',

  // ── Surfaces ──────────────────────────────────────────────────────────────
  surface: 'var(--gradly-surface)',
  surfaceAlt: 'var(--gradly-surface-alt)',
  surfaceMuted: 'var(--gradly-surface-muted)',
  surfaceInk: 'var(--gradly-surface-ink)',

  // ── Type ──────────────────────────────────────────────────────────────────
  fontFamilyDisplay: 'var(--gradly-font-display)',
  fontFamilyMono: 'var(--gradly-font-mono)',

  displayXxl: 'var(--gradly-display-2xl)',
  displayXl: 'var(--gradly-display-xl)',
  displayLg: 'var(--gradly-display-lg)',
  displayMd: 'var(--gradly-display-md)',

  // ── Elevation + shape ─────────────────────────────────────────────────────
  shadowSoft: 'var(--gradly-shadow-soft)',
  shadowLift: 'var(--gradly-shadow-lift)',
  shadowRing: 'var(--gradly-shadow-ring)',
  radiusPill: 'var(--gradly-radius-pill)',
  radiusCard: 'var(--gradly-radius-card)',

  // ── Layout rhythm ─────────────────────────────────────────────────────────
  gutter: 'var(--gradly-gutter)',
  sectionPadY: 'var(--gradly-section-pad-y)',
} as const

export type GradlyTokens = typeof gradlyTokens

/** Light-mode values for the custom properties above. */
export const gradlyLightVars: Record<string, string> = {
  '--gradly-ink-900': '#0B1437',
  '--gradly-ink-800': '#0F172A',
  '--gradly-ink-700': '#1E293B',
  '--gradly-ink-600': '#334155',
  '--gradly-ink-500': '#475569',
  '--gradly-ink-400': '#64748B',
  '--gradly-ink-300': '#94A3B8',
  '--gradly-ink-200': '#CBD5E1',
  '--gradly-ink-100': '#E2E8F0',
  '--gradly-ink-50': '#F1F5F9',

  '--gradly-amber': '#F59E0B',
  '--gradly-amber-light': '#FBBF24',
  '--gradly-amber-dark': '#D97706',
  '--gradly-amber-subtle': 'rgba(245, 158, 11, 0.12)',

  '--gradly-success': '#10B981',
  '--gradly-danger': '#EF4444',

  '--gradly-surface': '#FFFFFF',
  '--gradly-surface-alt': '#FAFAFB',
  '--gradly-surface-muted': '#F4F5F7',
  '--gradly-surface-ink': '#0B1437',

  '--gradly-font-display':
    "var(--font-fraunces), Fraunces, 'Iowan Old Style', Georgia, serif",
  '--gradly-font-mono':
    "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace",

  '--gradly-display-2xl': 'clamp(3rem, 6.5vw, 5.5rem)',
  '--gradly-display-xl': 'clamp(2.5rem, 5vw, 4.25rem)',
  '--gradly-display-lg': 'clamp(2.25rem, 5vw, 3.75rem)',
  '--gradly-display-md': 'clamp(1.75rem, 3.5vw, 2.5rem)',

  '--gradly-shadow-soft':
    '0 1px 2px rgba(15, 23, 42, 0.04), 0 4px 16px rgba(15, 23, 42, 0.06)',
  '--gradly-shadow-lift': '0 8px 30px rgba(15, 23, 42, 0.08)',
  '--gradly-shadow-ring':
    '0 0 0 1px rgba(15, 23, 42, 0.08), 0 1px 2px rgba(15, 23, 42, 0.04)',
  '--gradly-radius-pill': '9999px',
  '--gradly-radius-card': '24px',

  '--gradly-gutter': '20px',
  '--gradly-section-pad-y': '80px',
}

/**
 * Dark-mode values. The ink scale inverts (900 becomes the lightest) so a component
 * written as `color: gradlyTokens.ink800` stays legible in both modes with no
 * conditional styling anywhere in the component layer.
 */
export const gradlyDarkVars: Record<string, string> = {
  ...gradlyLightVars,

  '--gradly-ink-900': '#F8FAFC',
  '--gradly-ink-800': '#E2E8F0',
  '--gradly-ink-700': '#CBD5E1',
  '--gradly-ink-600': '#94A3B8',
  '--gradly-ink-500': '#94A3B8',
  '--gradly-ink-400': '#64748B',
  '--gradly-ink-300': '#475569',
  '--gradly-ink-200': '#334155',
  '--gradly-ink-100': '#1E293B',
  '--gradly-ink-50': '#131C33',

  '--gradly-amber': '#FBBF24',
  '--gradly-amber-light': '#FCD34D',
  '--gradly-amber-dark': '#F59E0B',
  '--gradly-amber-subtle': 'rgba(251, 191, 36, 0.16)',

  '--gradly-surface': '#070B1A',
  '--gradly-surface-alt': '#0B1223',
  '--gradly-surface-muted': '#111A31',
  '--gradly-surface-ink': '#05070F',

  '--gradly-shadow-soft':
    '0 1px 2px rgba(0, 0, 0, 0.5), 0 4px 16px rgba(0, 0, 0, 0.4)',
  '--gradly-shadow-lift': '0 8px 30px rgba(0, 0, 0, 0.55)',
  '--gradly-shadow-ring':
    '0 0 0 1px rgba(255, 255, 255, 0.08), 0 1px 2px rgba(0, 0, 0, 0.4)',
}

/** Serialise a var map into a `style`-ready object for the provider root. */
export function cssVars(vars: Record<string, string>): React.CSSProperties {
  return vars as unknown as React.CSSProperties
}
