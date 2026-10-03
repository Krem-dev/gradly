'use client'

import { makeStyles, mergeClasses, tokens, Divider } from '@fluentui/react-components'

/**
 * Layout primitives.
 *
 * **These are not Fluent components** — Fluent v9 deliberately ships no layout
 * system (the v8 `Stack` was dropped in favour of plain CSS). They are written
 * with griffel (`makeStyles`, the same engine Fluent itself uses) and spaced
 * entirely with Fluent's spacing tokens, so they stay in step with the theme
 * rather than introducing a second scale.
 *
 * Section tones map onto Fluent's neutral background ramp — no custom colours.
 */

const useStyles = makeStyles({
  container: {
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '100%',
    paddingLeft: tokens.spacingHorizontalL,
    paddingRight: tokens.spacingHorizontalL,
    '@media (min-width: 640px)': {
      paddingLeft: tokens.spacingHorizontalXXL,
      paddingRight: tokens.spacingHorizontalXXL,
    },
  },
  narrow: { maxWidth: '768px' },
  default: { maxWidth: '1152px' },
  wide: { maxWidth: '1280px' },
  full: { maxWidth: '1600px' },

  section: {
    position: 'relative',
    width: '100%',
    paddingTop: '64px',
    paddingBottom: '64px',
    '@media (min-width: 768px)': { paddingTop: '96px', paddingBottom: '96px' },
  },
  sectionTight: {
    paddingTop: '32px',
    paddingBottom: '32px',
    '@media (min-width: 768px)': { paddingTop: '48px', paddingBottom: '48px' },
  },
  tone1: { backgroundColor: tokens.colorNeutralBackground1, color: tokens.colorNeutralForeground1 },
  tone2: { backgroundColor: tokens.colorNeutralBackground2, color: tokens.colorNeutralForeground1 },
  tone3: { backgroundColor: tokens.colorNeutralBackground3, color: tokens.colorNeutralForeground1 },
  toneInverted: {
    backgroundColor: tokens.colorNeutralBackgroundInverted,
    color: tokens.colorNeutralForegroundInverted,
  },
  toneBrand: {
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorNeutralForeground1,
  },

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

  grid: { display: 'grid', minWidth: 0 },
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
  return <Tag className={mergeClasses(s.container, s[size], className)}>{children}</Tag>
}

/** Fluent neutral background steps, named by role rather than by number. */
export type SectionTone = 'default' | 'subtle' | 'muted' | 'inverted' | 'brand'

export function Section({
  children,
  tone = 'default',
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
    default: s.tone1,
    subtle: s.tone2,
    muted: s.tone3,
    inverted: s.toneInverted,
    brand: s.toneBrand,
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

export function Stack({
  children,
  direction = 'column',
  gap = 'M',
  align,
  justify,
  wrap = false,
  className,
  style,
  as: Tag = 'div',
}: {
  children: React.ReactNode
  direction?: 'row' | 'column'
  /** A Fluent spacing step, or an explicit pixel number. */
  gap?: 'None' | 'XXS' | 'XS' | 'SNudge' | 'S' | 'MNudge' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL' | number
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between'
  wrap?: boolean
  className?: string
  style?: React.CSSProperties
  as?: 'div' | 'li' | 'ul' | 'nav' | 'form'
}) {
  const s = useStyles()
  const gapValue =
    typeof gap === 'number'
      ? `${gap}px`
      : (tokens[`spacingVertical${gap}` as keyof typeof tokens] as string)

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
      style={{ gap: gapValue, ...style }}
    >
      {children}
    </Tag>
  )
}

/**
 * Responsive grid. `min` is the narrowest a column may get before the track
 * count drops — `auto-fit` + `minmax` means no breakpoint list to maintain.
 */
export function Grid({
  children,
  min = 260,
  gap = 16,
  columns,
  className,
  style,
}: {
  children: React.ReactNode
  min?: number
  gap?: number
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

export { Divider }
