'use client'

import {
  Text as FluentText,
  makeStyles,
  mergeClasses,
  tokens,
  typographyStyles,
  type TextProps,
} from '@fluentui/react-components'
import { gradlyTokens } from '@/lib/fluent'

const useStyles = makeStyles({
  // ── Editorial display scale (serif, clamped, tight tracking) ──────────────
  display: {
    fontFamily: gradlyTokens.fontFamilyDisplay,
    fontWeight: '600',
    color: gradlyTokens.ink900,
    margin: '0',
    textWrap: 'balance',
    fontFeatureSettings: "'ss01'",
  },
  d2xl: { fontSize: gradlyTokens.displayXxl, lineHeight: '0.95', letterSpacing: '-0.035em' },
  dxl: { fontSize: gradlyTokens.displayXl, lineHeight: '1.02', letterSpacing: '-0.03em' },
  dlg: { fontSize: gradlyTokens.displayLg, lineHeight: '1.05', letterSpacing: '-0.03em' },
  dmd: { fontSize: gradlyTokens.displayMd, lineHeight: '1.1', letterSpacing: '-0.02em' },

  // ── Body copy ─────────────────────────────────────────────────────────────
  lead: {
    ...typographyStyles.body1,
    fontSize: tokens.fontSizeBase400,
    lineHeight: tokens.lineHeightBase500,
    color: gradlyTokens.ink500,
    margin: '0',
  },
  body: {
    ...typographyStyles.body1,
    color: gradlyTokens.ink700,
    margin: '0',
  },
  muted: { color: gradlyTokens.ink500 },

  // ── Mono kicker (the uppercase tracked label used all over the old UI) ────
  kicker: {
    fontFamily: gradlyTokens.fontFamilyMono,
    fontSize: '10px',
    lineHeight: '1.4',
    textTransform: 'uppercase',
    letterSpacing: '0.18em',
    color: gradlyTokens.ink500,
    margin: '0',
  },

  // ── Numeric display (stat tiles, results) ────────────────────────────────
  stat: {
    fontFamily: gradlyTokens.fontFamilyDisplay,
    fontSize: '44px',
    lineHeight: '1',
    letterSpacing: '-0.03em',
    fontWeight: '600',
    color: gradlyTokens.ink900,
    fontVariantNumeric: 'tabular-nums',
    margin: '0',
  },
})

type DisplaySize = '2xl' | 'xl' | 'lg' | 'md'

export type DisplayProps = {
  size?: DisplaySize
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div'
  className?: string
  children: React.ReactNode
}

/**
 * The serif editorial headline. Replaces every `font-display text-display-*`
 * combination from the Tailwind build.
 *
 * `as` is separate from `size` on purpose: heading level is a document-structure
 * decision (one h1 per page) and size is a visual one. Coupling them is how pages
 * end up with three h1s because the designer wanted big text.
 */
export function Display({
  size = 'lg',
  as: Tag = 'h2',
  className,
  children,
}: DisplayProps) {
  const s = useStyles()
  const sizeClass = { '2xl': s.d2xl, xl: s.dxl, lg: s.dlg, md: s.dmd }[size]
  return <Tag className={mergeClasses(s.display, sizeClass, className)}>{children}</Tag>
}

/** Intro paragraph under a Display. Larger and lighter than body copy. */
export function Lead({
  className,
  children,
  as: Tag = 'p',
}: {
  className?: string
  children: React.ReactNode
  as?: 'p' | 'div'
}) {
  const s = useStyles()
  return <Tag className={mergeClasses(s.lead, className)}>{children}</Tag>
}

/** Default running text. */
export function Body({
  className,
  muted,
  children,
  as: Tag = 'p',
}: {
  className?: string
  muted?: boolean
  children: React.ReactNode
  as?: 'p' | 'div' | 'span'
}) {
  const s = useStyles()
  return (
    <Tag className={mergeClasses(s.body, muted && s.muted, className)}>{children}</Tag>
  )
}

/** Uppercase mono label — section eyebrows, field labels, table headers. */
export function Kicker({
  className,
  children,
  as: Tag = 'span',
}: {
  className?: string
  children: React.ReactNode
  as?: 'span' | 'div' | 'p' | 'label'
}) {
  const s = useStyles()
  return <Tag className={mergeClasses(s.kicker, className)}>{children}</Tag>
}

/** Big tabular number for stat tiles and conversion results. */
export function Stat({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  const s = useStyles()
  return <div className={mergeClasses(s.stat, className)}>{children}</div>
}

/**
 * Re-exported so pages never import from `@fluentui/react-components` directly —
 * one import surface means one place to restyle later.
 */
export function GradlyText(props: TextProps) {
  return <FluentText {...props} />
}

export {
  Title1,
  Title2,
  Title3,
  Subtitle1,
  Subtitle2,
  Body1,
  Body1Strong,
  Body2,
  Caption1,
  Caption1Strong,
  LargeTitle,
} from '@fluentui/react-components'
