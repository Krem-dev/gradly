'use client'

import {
  Badge as FluentBadge,
  Tooltip,
  makeStyles,
  mergeClasses,
  tokens,
  type BadgeProps,
  shorthands,
} from '@fluentui/react-components'
import { FlashRegular } from '@fluentui/react-icons'
import { gradlyTokens, hoverTransition } from '@/lib/fluent'

const useStyles = makeStyles({
  badge: { fontWeight: '500', letterSpacing: '-0.005em' },
  amber: {
    backgroundColor: gradlyTokens.amberSubtle,
    color: gradlyTokens.amberDark,
    ...shorthands.borderColor('rgba(245,158,11,0.32)'),
  },
  ink: {
    backgroundColor: gradlyTokens.ink900,
    color: '#FFFFFF',
    ...shorthands.borderColor('transparent'),
  },

  // ── Section label (the mono eyebrow with an amber dot) ───────────────────
  sectionLabel: {
    display: 'inline-flex',
    alignItems: 'center',
    columnGap: '8px',
    fontFamily: gradlyTokens.fontFamilyMono,
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.18em',
    color: gradlyTokens.ink500,
  },
  dot: {
    display: 'inline-block',
    width: '6px',
    height: '6px',
    borderRadius: gradlyTokens.radiusPill,
    backgroundColor: gradlyTokens.amber,
    flexShrink: 0,
  },
  labelNumber: { opacity: '0.6' },

  // ── Status dot + label ────────────────────────────────────────────────────
  status: {
    display: 'inline-flex',
    alignItems: 'center',
    columnGap: '6px',
    fontSize: tokens.fontSizeBase200,
    color: gradlyTokens.ink500,
  },
  dotSuccess: { backgroundColor: gradlyTokens.success },
  dotDanger: { backgroundColor: gradlyTokens.danger },
  dotNeutral: { backgroundColor: gradlyTokens.ink300 },

  // ── Credits pill ──────────────────────────────────────────────────────────
  pill: {
    display: 'inline-flex',
    alignItems: 'center',
    columnGap: '6px',
    height: '34px',
    paddingLeft: '12px',
    paddingRight: '12px',
    borderRadius: gradlyTokens.radiusPill,
    ...shorthands.borderWidth('1px'),
    ...shorthands.borderStyle('solid'),
    textDecorationLine: 'none',
    fontFamily: gradlyTokens.fontFamilyMono,
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    transition: hoverTransition,
    cursor: 'pointer',
  },
  pillNormal: {
    backgroundColor: gradlyTokens.ink50,
    color: gradlyTokens.ink700,
    ...shorthands.borderColor(gradlyTokens.ink100),
    ':hover': { ...shorthands.borderColor(gradlyTokens.ink300) },
  },
  pillEmpty: {
    backgroundColor: gradlyTokens.amberSubtle,
    color: gradlyTokens.amberDark,
    ...shorthands.borderColor('rgba(245,158,11,0.32)'),
    ':hover': { backgroundColor: 'rgba(245,158,11,0.2)' },
  },
})

export type GradlyBadgeTone = BadgeProps['color'] | 'amber' | 'ink'

/**
 * Status chip. Passes straight through to Fluent for its eight semantic colours,
 * and adds the two Gradly house tones (`amber`, `ink`) that Fluent's palette has
 * no slot for.
 */
export function GradlyBadge({
  tone = 'brand',
  className,
  ...rest
}: Omit<BadgeProps, 'color'> & { tone?: GradlyBadgeTone }) {
  const s = useStyles()
  const isCustom = tone === 'amber' || tone === 'ink'
  return (
    <FluentBadge
      appearance={rest.appearance ?? (isCustom ? 'filled' : 'tint')}
      color={isCustom ? undefined : (tone as BadgeProps['color'])}
      className={mergeClasses(
        s.badge,
        tone === 'amber' && s.amber,
        tone === 'ink' && s.ink,
        className
      )}
      {...rest}
    />
  )
}

/**
 * The uppercase mono eyebrow that opens most sections. `number` renders a muted
 * count in parentheses, e.g. "SUPPORTED COUNTRIES (12)".
 */
export function SectionLabel({
  children,
  number,
  className,
}: {
  children: React.ReactNode
  number?: string | number
  className?: string
}) {
  const s = useStyles()
  return (
    <div className={mergeClasses(s.sectionLabel, className)}>
      <span className={s.dot} aria-hidden />
      <span>
        {children}
        {number !== undefined && <span className={s.labelNumber}> ({number})</span>}
      </span>
    </div>
  )
}

/** Small coloured dot + text, for "All systems operational"-style lines. */
export function StatusDot({
  state = 'success',
  children,
}: {
  state?: 'success' | 'danger' | 'neutral'
  children: React.ReactNode
}) {
  const s = useStyles()
  return (
    <span className={s.status}>
      <span
        className={mergeClasses(
          s.dot,
          state === 'success' && s.dotSuccess,
          state === 'danger' && s.dotDanger,
          state === 'neutral' && s.dotNeutral
        )}
        aria-hidden
      />
      {children}
    </span>
  )
}

/**
 * Credit balance pill for the app header. Purely presentational — the balance and
 * the href come from the caller, so this stays usable in the component preview
 * without a signed-in user or a live API.
 */
export function CreditsPill({
  balance,
  href = '/pricing',
  onClick,
}: {
  balance: number
  href?: string
  onClick?: () => void
}) {
  const s = useStyles()
  const empty = balance <= 0
  const label = `${balance} ${balance === 1 ? 'credit' : 'credits'}`

  return (
    <Tooltip
      relationship="description"
      content={
        empty
          ? 'You have no credits — buy a Convert Pack'
          : `${label} remaining`
      }
      withArrow
    >
      <a
        href={href}
        onClick={onClick}
        className={mergeClasses(s.pill, empty ? s.pillEmpty : s.pillNormal)}
      >
        <FlashRegular fontSize={14} />
        <span>{label}</span>
      </a>
    </Tooltip>
  )
}

export { CounterBadge, PresenceBadge, Avatar, Tag, TagGroup } from '@fluentui/react-components'
