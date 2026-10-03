'use client'

import {
  Card as FluentCard,
  makeStyles,
  mergeClasses,
  tokens,
  type CardProps,
  shorthands,
} from '@fluentui/react-components'
import { gradlyTokens, hoverTransition } from '@/lib/fluent'
import { Body, Display, Kicker, Stat } from './Text'
import { Stack } from './Layout'

const useStyles = makeStyles({
  card: {
    borderRadius: gradlyTokens.radiusCard,
    transition: hoverTransition,
    // Fluent Card defaults to a 12px gap flex column; most Gradly cards lay out
    // their own content, so neutralise it and let the consumer choose.
    rowGap: '0',
  },
  padSm: { padding: '16px' },
  padMd: { padding: '24px' },
  padLg: { padding: '24px', '@media (min-width: 640px)': { padding: '32px' } },
  padNone: { padding: '0' },

  toneSurface: {
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.border('1px', 'solid', gradlyTokens.ink100),
    boxShadow: gradlyTokens.shadowSoft,
  },
  toneMuted: {
    backgroundColor: gradlyTokens.surfaceMuted,
    ...shorthands.border('1px', 'solid', gradlyTokens.ink100),
    boxShadow: 'none',
  },
  toneOutline: {
    backgroundColor: 'transparent',
    ...shorthands.border('1px', 'solid', gradlyTokens.ink200),
    boxShadow: 'none',
  },
  toneInk: {
    backgroundColor: gradlyTokens.surfaceInk,
    color: '#FFFFFF',
    ...shorthands.border('1px', 'solid', 'rgba(255,255,255,0.10)'),
    boxShadow: 'none',
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
  toneAmber: {
    backgroundColor: gradlyTokens.amberSubtle,
    ...shorthands.border('1px', 'solid', 'rgba(245,158,11,0.3)'),
    boxShadow: 'none',
  },

  interactive: {
    cursor: 'pointer',
    ':hover': { boxShadow: gradlyTokens.shadowLift, transform: 'translateY(-2px)' },
    ':active': { transform: 'translateY(0)' },
  },

  // ── Stat tile ─────────────────────────────────────────────────────────────
  statTile: { display: 'flex', flexDirection: 'column', rowGap: '10px' },
  statDelta: { display: 'inline-flex', alignItems: 'center', columnGap: '4px', fontSize: tokens.fontSizeBase200 },
  deltaUp: { color: gradlyTokens.success },
  deltaDown: { color: gradlyTokens.danger },
  deltaFlat: { color: gradlyTokens.ink400 },

  // ── Empty state ───────────────────────────────────────────────────────────
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    rowGap: '12px',
    paddingTop: '48px',
    paddingBottom: '48px',
    paddingLeft: '24px',
    paddingRight: '24px',
  },
  emptyIcon: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '56px',
    height: '56px',
    borderRadius: gradlyTokens.radiusPill,
    backgroundColor: gradlyTokens.ink50,
    color: gradlyTokens.ink400,
    fontSize: '24px',
  },
})

export type GradlyCardTone = 'surface' | 'muted' | 'outline' | 'ink' | 'amber'
export type GradlyCardPadding = 'none' | 'sm' | 'md' | 'lg'

export type GradlyCardProps = Omit<CardProps, 'appearance' | 'size'> & {
  tone?: GradlyCardTone
  padding?: GradlyCardPadding
  /** Adds hover lift + pointer. Use for cards that navigate. */
  interactive?: boolean
}

/**
 * Surface primitive. Wraps Fluent's `Card`, which brings the roving-focus group
 * behaviour and `selected` state for free, and restyles it to the Gradly tones
 * (the four from the Tailwind build, plus an amber "needs attention" tone).
 */
export function GradlyCard({
  tone = 'surface',
  padding = 'md',
  interactive = false,
  className,
  children,
  ...rest
}: GradlyCardProps) {
  const s = useStyles()
  const toneClass = {
    surface: s.toneSurface,
    muted: s.toneMuted,
    outline: s.toneOutline,
    ink: s.toneInk,
    amber: s.toneAmber,
  }[tone]
  const padClass = { none: s.padNone, sm: s.padSm, md: s.padMd, lg: s.padLg }[padding]

  return (
    <FluentCard
      className={mergeClasses(
        s.card,
        toneClass,
        padClass,
        interactive && s.interactive,
        className
      )}
      {...rest}
    >
      {children}
    </FluentCard>
  )
}

/**
 * Dashboard metric tile. The number uses the serif display face and tabular
 * figures so a column of tiles doesn't jitter as values change.
 */
export function StatTile({
  label,
  value,
  hint,
  delta,
  icon,
  tone = 'surface',
}: {
  label: string
  value: React.ReactNode
  hint?: string
  /** e.g. `{ direction: 'up', text: '+2 this week' }` */
  delta?: { direction: 'up' | 'down' | 'flat'; text: string }
  icon?: React.ReactNode
  tone?: GradlyCardTone
}) {
  const s = useStyles()
  return (
    <GradlyCard tone={tone} padding="md">
      <div className={s.statTile}>
        <Stack direction="row" justify="between" align="center" gap={8}>
          <Kicker>{label}</Kicker>
          {icon}
        </Stack>
        <Stat>{value}</Stat>
        {delta && (
          <span
            className={mergeClasses(
              s.statDelta,
              delta.direction === 'up' && s.deltaUp,
              delta.direction === 'down' && s.deltaDown,
              delta.direction === 'flat' && s.deltaFlat
            )}
          >
            {delta.text}
          </span>
        )}
        {hint && <Body muted>{hint}</Body>}
      </div>
    </GradlyCard>
  )
}

/** Zero-data placeholder. Always give it an action — a dead end is a bug. */
export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}) {
  const s = useStyles()
  return (
    <div className={s.empty}>
      {icon && <span className={s.emptyIcon}>{icon}</span>}
      <Display size="md" as="p">
        {title}
      </Display>
      {description && <Body muted>{description}</Body>}
      {action && <div style={{ marginTop: 8 }}>{action}</div>}
    </div>
  )
}

export { CardHeader, CardFooter, CardPreview } from '@fluentui/react-components'
