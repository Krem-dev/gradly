'use client'

import { makeStyles, mergeClasses, tokens } from '@fluentui/react-components'
import { gradlyTokens } from '@/lib/fluent'

const useStyles = makeStyles({
  // ── Container ─────────────────────────────────────────────────────────────
  container: {
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '100%',
    paddingLeft: '20px',
    paddingRight: '20px',
    '@media (min-width: 640px)': { paddingLeft: '32px', paddingRight: '32px' },
    '@media (min-width: 1024px)': { paddingLeft: '40px', paddingRight: '40px' },
  },
  narrow: { maxWidth: '768px' },
  default: { maxWidth: '1152px' },
  wide: { maxWidth: '1280px' },
  full: { maxWidth: '1600px' },

  // ── Section ───────────────────────────────────────────────────────────────
  section: {
    position: 'relative',
    width: '100%',
    paddingTop: '80px',
    paddingBottom: '80px',
    '@media (min-width: 768px)': { paddingTop: '128px', paddingBottom: '128px' },
  },
  sectionTight: {
    paddingTop: '48px',
    paddingBottom: '48px',
    '@media (min-width: 768px)': { paddingTop: '64px', paddingBottom: '64px' },
  },
  toneSurface: { backgroundColor: gradlyTokens.surface, color: gradlyTokens.ink800 },
  toneAlt: { backgroundColor: gradlyTokens.surfaceAlt, color: gradlyTokens.ink800 },
  toneMuted: { backgroundColor: gradlyTokens.surfaceMuted, color: gradlyTokens.ink800 },
  toneInk: {
    backgroundColor: gradlyTokens.surfaceInk,
    color: '#FFFFFF',
    // Re-point the ink scale so children written against `ink800` invert here
    // with no `tone` prop threading. This is the whole reason the custom tokens
    // are CSS properties rather than a JS object.
    '--gradly-ink-900': '#FFFFFF',
    '--gradly-ink-800': '#E2E8F0',
    '--gradly-ink-700': '#CBD5E1',
    '--gradly-ink-600': '#94A3B8',
    '--gradly-ink-500': '#94A3B8',
    '--gradly-ink-400': '#64748B',
    '--gradly-ink-300': '#475569',
    '--gradly-ink-200': '#334155',
    '--gradly-ink-100': 'rgba(255,255,255,0.12)',
    '--gradly-ink-50': 'rgba(255,255,255,0.06)',
  },

  // ── Stack ─────────────────────────────────────────────────────────────────
  stack: { display: 'flex', minWidth: 0 },
  row: { flexDirection: 'row' },
  col: { flexDirection: 'column' },
  wrap: { flexWrap: 'wrap' },
  alignStart: { alignItems: 'flex-start' },
  alignCenter: { alignItems: 'center' },
  alignEnd: { alignItems: 'flex-end' },
  alignStretch: { alignItems: 'stretch' },
  justifyStart: { justifyContent: 'flex-start' },
  justifyCenter: { justifyContent: 'center' },
  justifyEnd: { justifyContent: 'flex-end' },
  justifyBetween: { justifyContent: 'space-between' },

  // ── Grid ──────────────────────────────────────────────────────────────────
  grid: { display: 'grid', minWidth: 0 },

  // ── Page background decoration ────────────────────────────────────────────
  bgHost: { position: 'relative', isolation: 'isolate' },
  bgLayer: {
    position: 'absolute',
    inset: '0',
    pointerEvents: 'none',
    zIndex: -1,
    overflowX: 'hidden',
    overflowY: 'hidden',
  },
  bgGrid: {
    position: 'absolute',
    inset: '0',
    opacity: '0.04',
    backgroundImage: `linear-gradient(to right, ${gradlyTokens.ink900} 1px, transparent 1px), linear-gradient(to bottom, ${gradlyTokens.ink900} 1px, transparent 1px)`,
    backgroundSize: '64px 64px',
  },
  bgGlowAmber: {
    position: 'absolute',
    width: '460px',
    height: '460px',
    borderRadius: '9999px',
    backgroundColor: gradlyTokens.amber,
    opacity: '0.14',
    filter: 'blur(140px)',
  },
  bgGlowBrand: {
    position: 'absolute',
    width: '520px',
    height: '520px',
    borderRadius: '9999px',
    backgroundColor: tokens.colorBrandBackground,
    opacity: '0.12',
    filter: 'blur(150px)',
  },
  glowTopRight: { top: '-180px', right: '-120px' },
  glowBottomLeft: { bottom: '-200px', left: '-140px' },
})

type ContainerSize = 'narrow' | 'default' | 'wide' | 'full'

export function Container({
  children,
  size = 'default',
  className,
  as: Tag = 'div',
}: {
  children: React.ReactNode
  size?: ContainerSize
  className?: string
  as?: 'div' | 'main' | 'header' | 'footer' | 'section'
}) {
  const s = useStyles()
  return (
    <Tag className={mergeClasses(s.container, s[size], className)}>{children}</Tag>
  )
}

export type SectionTone = 'surface' | 'alt' | 'muted' | 'ink'

export function Section({
  children,
  tone = 'surface',
  tight = false,
  id,
  className,
}: {
  children: React.ReactNode
  tone?: SectionTone
  tight?: boolean
  id?: string
  className?: string
}) {
  const s = useStyles()
  const toneClass = {
    surface: s.toneSurface,
    alt: s.toneAlt,
    muted: s.toneMuted,
    ink: s.toneInk,
  }[tone]
  return (
    <section
      id={id}
      className={mergeClasses(s.section, tight && s.sectionTight, toneClass, className)}
    >
      {children}
    </section>
  )
}

/**
 * Flex helper. Fluent has no layout primitive in v9 (the v8 `Stack` was dropped in
 * favour of CSS), so this fills the gap without pulling a second styling system in.
 */
export function Stack({
  children,
  direction = 'column',
  gap = 12,
  align,
  justify,
  wrap = false,
  className,
  style,
  as: Tag = 'div',
}: {
  children: React.ReactNode
  direction?: 'row' | 'column'
  gap?: number
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between'
  wrap?: boolean
  className?: string
  style?: React.CSSProperties
  as?: 'div' | 'li' | 'ul' | 'nav' | 'form'
}) {
  const s = useStyles()
  return (
    <Tag
      className={mergeClasses(
        s.stack,
        direction === 'row' ? s.row : s.col,
        wrap && s.wrap,
        align === 'start' && s.alignStart,
        align === 'center' && s.alignCenter,
        align === 'end' && s.alignEnd,
        align === 'stretch' && s.alignStretch,
        justify === 'start' && s.justifyStart,
        justify === 'center' && s.justifyCenter,
        justify === 'end' && s.justifyEnd,
        justify === 'between' && s.justifyBetween,
        className
      )}
      style={{ gap: `${gap}px`, ...style }}
    >
      {children}
    </Tag>
  )
}

/**
 * Responsive grid. `min` is the smallest a column may get before the track count
 * drops — `auto-fit` + `minmax` means no breakpoint list to maintain.
 */
export function Grid({
  children,
  min = 260,
  gap = 20,
  columns,
  className,
  style,
}: {
  children: React.ReactNode
  min?: number
  gap?: number
  /** Fixed column count. Omit for auto-fit behaviour. */
  columns?: number
  className?: string
  style?: React.CSSProperties
}) {
  const s = useStyles()
  return (
    <div
      className={mergeClasses(s.grid, className)}
      style={{
        gap: `${gap}px`,
        gridTemplateColumns: columns
          ? `repeat(${columns}, minmax(0, 1fr))`
          : `repeat(auto-fit, minmax(min(${min}px, 100%), 1fr))`,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

/**
 * Decorative page background: faint graph-paper grid plus one or two colour glows.
 * Sits on its own `z-index: -1` layer inside an isolated stacking context, so it
 * can never intercept clicks or paint over content.
 */
export function PageBackground({
  children,
  grid = true,
  glow = 'amber',
  className,
}: {
  children: React.ReactNode
  grid?: boolean
  glow?: 'amber' | 'brand' | 'both' | 'none'
  className?: string
}) {
  const s = useStyles()
  return (
    <div className={mergeClasses(s.bgHost, className)}>
      <div className={s.bgLayer} aria-hidden>
        {grid && <div className={s.bgGrid} />}
        {(glow === 'amber' || glow === 'both') && (
          <div className={mergeClasses(s.bgGlowAmber, s.glowTopRight)} />
        )}
        {(glow === 'brand' || glow === 'both') && (
          <div className={mergeClasses(s.bgGlowBrand, s.glowBottomLeft)} />
        )}
      </div>
      {children}
    </div>
  )
}

export { Divider } from '@fluentui/react-components'
