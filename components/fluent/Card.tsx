'use client'

import {
  Card,
  CardHeader,
  CardFooter,
  CardPreview,
  Caption1,
  Button,
  makeStyles,
  mergeClasses,
  tokens,
  type CardProps,
} from '@fluentui/react-components'
import { Body, Stat, Title3 } from './Text'

/**
 * Surfaces are Fluent's `Card`.
 *
 * Fluent ships four appearances — `filled`, `filled-alternative`, `outline`,
 * `subtle` — plus `selected`, `focusMode` and the roving-focus behaviour that
 * comes with them. Those are used directly; `Card` is re-exported unchanged.
 *
 * The two composites below (`StatTile`, `EmptyState`) are app patterns Fluent has
 * no component for. Both are assembled from Fluent parts and Fluent tokens.
 */

const useStyles = makeStyles({
  statTile: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalXS,
  },
  statHead: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    columnGap: tokens.spacingHorizontalS,
  },
  label: { color: tokens.colorNeutralForeground3 },
  deltaUp: { color: tokens.colorStatusSuccessForeground1 },
  deltaDown: { color: tokens.colorStatusDangerForeground1 },
  deltaFlat: { color: tokens.colorNeutralForeground3 },

  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    rowGap: tokens.spacingVerticalM,
    paddingTop: tokens.spacingVerticalXXXL,
    paddingBottom: tokens.spacingVerticalXXXL,
    paddingLeft: tokens.spacingHorizontalXL,
    paddingRight: tokens.spacingHorizontalXL,
  },
  emptyIcon: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    height: '48px',
    borderRadius: tokens.borderRadiusCircular,
    backgroundColor: tokens.colorNeutralBackground3,
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase600,
  },
})

/** Dashboard metric tile: a Fluent Card with a label, a hero number and a delta. */
export function StatTile({
  label,
  value,
  hint,
  delta,
  icon,
  appearance = 'outline',
}: {
  label: string
  value: React.ReactNode
  hint?: string
  delta?: { direction: 'up' | 'down' | 'flat'; text: string }
  icon?: React.ReactNode
  appearance?: CardProps['appearance']
}) {
  const s = useStyles()
  return (
    <Card appearance={appearance}>
      <div className={s.statTile}>
        <div className={s.statHead}>
          <Caption1 className={s.label}>{label}</Caption1>
          {icon}
        </div>
        <Stat>{value}</Stat>
        {delta && (
          <Caption1
            className={mergeClasses(
              delta.direction === 'up' && s.deltaUp,
              delta.direction === 'down' && s.deltaDown,
              delta.direction === 'flat' && s.deltaFlat
            )}
          >
            {delta.text}
          </Caption1>
        )}
        {hint && <Caption1 className={s.label}>{hint}</Caption1>}
      </div>
    </Card>
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
      <Title3>{title}</Title3>
      {description && <Body muted>{description}</Body>}
      {action}
    </div>
  )
}

export { Card, CardHeader, CardFooter, CardPreview }
export type { CardProps }
