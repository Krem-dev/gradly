'use client'

import {
  Badge,
  CounterBadge,
  PresenceBadge,
  Avatar,
  AvatarGroup,
  AvatarGroupItem,
  Tag,
  TagGroup,
  InteractionTag,
  Divider,
  Caption1,
  Caption1Strong,
  Tooltip,
  makeStyles,
  mergeClasses,
  tokens,
  type BadgeProps,
} from '@fluentui/react-components'
import { FlashRegular } from '@fluentui/react-icons'

/**
 * Status chrome, all Fluent.
 *
 * `Badge`, `CounterBadge`, `PresenceBadge`, `Avatar`, `Tag` are re-exported
 * unchanged — Fluent's eight semantic colours and four appearances cover
 * everything the app needs, so there is no Gradly badge variant.
 *
 * The three composites below are app patterns assembled from those parts.
 */

const useStyles = makeStyles({
  sectionLabel: {
    display: 'flex',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalS,
    color: tokens.colorBrandForeground1,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  rule: { flexGrow: 1, maxWidth: '64px' },
  count: { color: tokens.colorNeutralForeground3 },
  status: {
    display: 'inline-flex',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalXS,
    color: tokens.colorNeutralForeground2,
  },
})

/**
 * Section eyebrow: a short uppercase caption with a rule, used to open a section.
 * Fluent has no "eyebrow" component; this is `Caption1Strong` + `Divider`.
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
      <Caption1Strong>
        {children}
        {number !== undefined && <span className={s.count}> ({number})</span>}
      </Caption1Strong>
      <Divider className={s.rule} />
    </div>
  )
}

/**
 * "All systems operational"-style line. Uses Fluent's `PresenceBadge`, which is
 * the component actually designed for an availability dot.
 */
export function StatusDot({
  state = 'available',
  children,
}: {
  state?: 'available' | 'busy' | 'away' | 'offline'
  children: React.ReactNode
}) {
  const s = useStyles()
  return (
    <span className={s.status}>
      <PresenceBadge status={state} size="small" />
      <Caption1>{children}</Caption1>
    </span>
  )
}

/**
 * Credit balance chip for the app header.
 *
 * Presentational only — balance and href come from the caller, so it renders in
 * the component gallery without a signed-in user or a live API.
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
  const empty = balance <= 0
  const label = `${balance} ${balance === 1 ? 'credit' : 'credits'}`
  return (
    <Tooltip
      relationship="description"
      withArrow
      content={empty ? 'You have no credits — buy a Convert Pack' : `${label} remaining`}
    >
      <a href={href} onClick={onClick} style={{ textDecoration: 'none' }}>
        <Badge
          appearance="tint"
          color={empty ? 'warning' : 'informative'}
          size="large"
          icon={<FlashRegular />}
        >
          {label}
        </Badge>
      </a>
    </Tooltip>
  )
}

export {
  Badge,
  CounterBadge,
  PresenceBadge,
  Avatar,
  AvatarGroup,
  AvatarGroupItem,
  Tag,
  TagGroup,
  InteractionTag,
}
export type { BadgeProps }
