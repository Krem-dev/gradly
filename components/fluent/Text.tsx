'use client'

/**
 * Typography is Fluent's, unmodified.
 *
 * Fluent ships a complete type ramp as components — `Display`, `LargeTitle`,
 * `Title1..3`, `Subtitle1..2`, `Body1..2`, `Caption1..2` — each bound to the
 * theme's font tokens. The previous version of this file replaced that ramp with
 * a serif display face and a custom mono label, which is exactly what made the UI
 * stop looking like Fluent.
 *
 * Everything below is a re-export. The only additions are two tiny semantic
 * helpers that compose Fluent components rather than restyle them.
 */

import {
  Text,
  Display,
  LargeTitle,
  Title1,
  Title2,
  Title3,
  Subtitle1,
  Subtitle2,
  Body1,
  Body1Strong,
  Body1Stronger,
  Body2,
  Caption1,
  Caption1Strong,
  Caption1Stronger,
  Caption2,
  Caption2Strong,
  makeStyles,
  mergeClasses,
  tokens,
} from '@fluentui/react-components'

export {
  Text,
  Display,
  LargeTitle,
  Title1,
  Title2,
  Title3,
  Subtitle1,
  Subtitle2,
  Body1,
  Body1Strong,
  Body1Stronger,
  Body2,
  Caption1,
  Caption1Strong,
  Caption1Stronger,
  Caption2,
  Caption2Strong,
}

const useStyles = makeStyles({
  lead: { color: tokens.colorNeutralForeground2, display: 'block' },
  muted: { color: tokens.colorNeutralForeground3 },
  stat: {
    fontSize: tokens.fontSizeHero800,
    lineHeight: tokens.lineHeightHero800,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    // Tabular figures stop a column of stat tiles jittering as values change.
    fontVariantNumeric: 'tabular-nums',
    display: 'block',
  },
  block: { display: 'block' },
})

/**
 * Intro paragraph under a heading. Fluent's `Body1` at the secondary foreground —
 * a convention, not a new style.
 */
export function Lead({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const s = useStyles()
  return (
    <Body1 as="p" block className={mergeClasses(s.lead, className)}>
      {children}
    </Body1>
  )
}

/** Running text. `muted` drops to Fluent's tertiary foreground. */
export function Body({
  children,
  muted,
  className,
  as = 'p',
}: {
  children: React.ReactNode
  muted?: boolean
  className?: string
  as?: 'p' | 'span'
}) {
  const s = useStyles()
  return (
    <Body1 as={as} block={as !== 'span'} className={mergeClasses(muted && s.muted, className)}>
      {children}
    </Body1>
  )
}

/**
 * Big tabular number for stat tiles and conversion results.
 * Fluent's hero type size — the one piece of the ramp with no component wrapper.
 */
export function Stat({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const s = useStyles()
  return <span className={mergeClasses(s.stat, className)}>{children}</span>
}
