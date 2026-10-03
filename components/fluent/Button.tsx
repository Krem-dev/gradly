'use client'

import { forwardRef, type MouseEvent } from 'react'
import { useRouter } from 'next/navigation'
import {
  Button as FluentButton,
  Spinner,
  makeStyles,
  mergeClasses,
  tokens,
  type ButtonProps as FluentButtonProps,
  shorthands,
} from '@fluentui/react-components'
import { ArrowRightRegular } from '@fluentui/react-icons'
import { gradlyTokens, hoverTransition } from '@/lib/fluent'

export type GradlyButtonVariant =
  | 'primary'    // ink navy — the old default
  | 'brand'      // Fluent brand indigo
  | 'secondary'  // white with hairline ring
  | 'ghost'      // transparent until hover
  | 'pill'       // amber call-to-action
  | 'danger'

export type GradlyButtonSize = 'sm' | 'md' | 'lg'

const useStyles = makeStyles({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: '8px',
    fontWeight: '500',
    letterSpacing: '-0.01em',
    borderRadius: gradlyTokens.radiusPill,
    transition: hoverTransition,
    textDecorationLine: 'none',
    minWidth: 'auto',
    ':focus-visible': {
      outlineWidth: '2px',
      outlineStyle: 'solid',
      outlineColor: gradlyTokens.amber,
      outlineOffset: '2px',
    },
  },

  // ── Sizes (taller than Fluent's defaults — editorial, touch-friendly) ────
  sm: { height: '36px', paddingLeft: '16px', paddingRight: '16px', fontSize: tokens.fontSizeBase200 },
  md: { height: '44px', paddingLeft: '20px', paddingRight: '20px', fontSize: tokens.fontSizeBase300 },
  lg: { height: '56px', paddingLeft: '28px', paddingRight: '28px', fontSize: tokens.fontSizeBase400 },
  // With a trailing arrow pill the right padding tightens so the circle sits inset.
  smArrow: { paddingRight: '6px' },
  mdArrow: { paddingRight: '8px' },
  lgArrow: { paddingRight: '10px' },

  // ── Variants ──────────────────────────────────────────────────────────────
  primary: {
    backgroundColor: gradlyTokens.ink900,
    color: tokens.colorNeutralForegroundOnBrand,
    ...shorthands.borderColor('transparent'),
    boxShadow: gradlyTokens.shadowSoft,
    ':hover': {
      backgroundColor: gradlyTokens.ink800,
      color: tokens.colorNeutralForegroundOnBrand,
      boxShadow: gradlyTokens.shadowLift,
    },
    ':hover:active': { backgroundColor: gradlyTokens.ink700, color: tokens.colorNeutralForegroundOnBrand },
  },
  brand: {
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    ...shorthands.borderColor('transparent'),
    boxShadow: gradlyTokens.shadowSoft,
    ':hover': {
      backgroundColor: tokens.colorBrandBackgroundHover,
      color: tokens.colorNeutralForegroundOnBrand,
      boxShadow: gradlyTokens.shadowLift,
    },
    ':hover:active': { backgroundColor: tokens.colorBrandBackgroundPressed },
  },
  secondary: {
    backgroundColor: tokens.colorNeutralBackground1,
    color: gradlyTokens.ink900,
    ...shorthands.borderColor(gradlyTokens.ink100),
    boxShadow: gradlyTokens.shadowSoft,
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
      ...shorthands.borderColor(gradlyTokens.ink300),
    },
  },
  ghost: {
    backgroundColor: 'transparent',
    color: gradlyTokens.ink800,
    ...shorthands.borderColor('transparent'),
    boxShadow: 'none',
    ':hover': { backgroundColor: gradlyTokens.ink50, color: gradlyTokens.ink900 },
  },
  pill: {
    backgroundColor: gradlyTokens.amber,
    color: gradlyTokens.ink900,
    ...shorthands.borderColor('transparent'),
    boxShadow: gradlyTokens.shadowSoft,
    ':hover': {
      backgroundColor: gradlyTokens.amberLight,
      color: gradlyTokens.ink900,
      boxShadow: gradlyTokens.shadowLift,
    },
  },
  danger: {
    backgroundColor: gradlyTokens.danger,
    color: '#FFFFFF',
    ...shorthands.borderColor('transparent'),
    ':hover': { backgroundColor: '#DC2626', color: '#FFFFFF' },
  },

  fullWidth: { width: '100%' },

  /**
   * Fluent's `Button` sets `min-width: 96px` so labelled buttons line up in a
   * dialog footer. For an icon-only button that is 3x too wide — three of them in
   * a header is 288px, which overflows a 390px phone. Fluent's own icon-only
   * branch does not apply through our wrappers, so the square size is set here.
   */
  iconOnly: {
    minWidth: '0',
    maxWidth: 'none',
    paddingLeft: '0',
    paddingRight: '0',
    flexShrink: 0,
  },
  iconSm: { width: '32px', height: '32px' },
  iconMd: { width: '36px', height: '36px' },
  iconLg: { width: '44px', height: '44px' },

  // ── The trailing arrow pill ───────────────────────────────────────────────
  arrow: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: gradlyTokens.radiusPill,
    flexShrink: 0,
    transition: hoverTransition,
  },
  arrowSm: { width: '26px', height: '26px' },
  arrowMd: { width: '30px', height: '30px' },
  arrowLg: { width: '38px', height: '38px' },
  arrowOnDark: { backgroundColor: gradlyTokens.amber, color: gradlyTokens.ink900 },
  arrowOnAmber: { backgroundColor: gradlyTokens.ink900, color: gradlyTokens.amber },
  arrowOnLight: { backgroundColor: gradlyTokens.ink900, color: '#FFFFFF' },
  // Nudges the arrow right on hover. Scoped to the button's own hover so the
  // whole label doesn't shift with it.
  arrowShift: { transform: 'translateX(0)' },
  root: {
    ':hover .gradly-arrow': { transform: 'translateX(2px)' },
  },
})

type CommonProps = {
  variant?: GradlyButtonVariant
  size?: GradlyButtonSize
  /** Show the trailing circular arrow. Defaults to false — opt in per button. */
  withArrow?: boolean
  /** Swaps the arrow for a spinner and blocks interaction. */
  loading?: boolean
  fullWidth?: boolean
  className?: string
  children?: React.ReactNode
  disabled?: boolean
  /** Leading icon, rendered before the label. */
  icon?: React.ReactElement
}

/**
 * Forwarded DOM props are taken from the plain button element rather than from
 * Fluent's `ButtonProps`. Fluent's type is a union over the polymorphic `as` prop,
 * and intersecting it here leaks that union into `rest` — which then satisfies
 * neither branch when spread (handlers like `onToggle` are typed per element).
 * `appearance`, `size`, `icon` and `iconPosition` are intentionally not forwarded:
 * this component owns them.
 */
type ForwardedButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'className' | 'children' | 'disabled'
>

export type GradlyButtonProps = CommonProps &
  ForwardedButtonProps & {
    /** Fluent shape override — use for icon-only circular/square buttons. */
    shape?: FluentButtonProps['shape']
    href?: string
    target?: string
  }

/**
 * The one button in the system.
 *
 * Built on Fluent's `Button` so it inherits keyboard handling, the `aria-disabled`
 * treatment for `disabledFocusable`, high-contrast support and Fluent's ripple-free
 * press states — then restyled through `makeStyles` into the Gradly shape (pill,
 * taller, optional amber arrow).
 *
 * `href` renders a real anchor and intercepts the click for client-side navigation,
 * while leaving modifier-clicks (cmd/ctrl/shift/middle, `target="_blank"`) to the
 * browser. That keeps "open in new tab" working, which a plain `onClick={push}`
 * button breaks.
 */
export const GradlyButton = forwardRef<HTMLButtonElement, GradlyButtonProps>(
  function GradlyButton(
    {
      variant = 'primary',
      size = 'md',
      withArrow = false,
      loading = false,
      fullWidth = false,
      className,
      children,
      disabled,
      icon,
      href,
      target,
      onClick,
      ...rest
    },
    ref
  ) {
    const s = useStyles()
    const router = useRouter()
    const isDisabled = disabled || loading
    const showArrow = withArrow || loading

    const arrowTone =
      variant === 'pill'
        ? s.arrowOnAmber
        : variant === 'primary' || variant === 'brand' || variant === 'danger'
          ? s.arrowOnDark
          : s.arrowOnLight

    const arrowSize = { sm: s.arrowSm, md: s.arrowMd, lg: s.arrowLg }[size]

    const arrowNode = showArrow ? (
      <span
        className={mergeClasses('gradly-arrow', s.arrow, arrowSize, arrowTone, s.arrowShift)}
        aria-hidden={!loading}
      >
        {loading ? (
          <Spinner size="extra-tiny" appearance="inverted" />
        ) : (
          <ArrowRightRegular fontSize={16} />
        )}
      </span>
    ) : undefined

    const classes = mergeClasses(
      s.base,
      s.root,
      { sm: s.sm, md: s.md, lg: s.lg }[size],
      showArrow && { sm: s.smArrow, md: s.mdArrow, lg: s.lgArrow }[size],
      s[variant],
      fullWidth && s.fullWidth,
      className
    )

    const handleAnchorClick = (ev: MouseEvent<HTMLAnchorElement>) => {
      // Fluent types `onClick` as a union over the polymorphic `as` prop, so the
      // handler wants an intersection of both event shapes. Widen it for the call.
      ;(onClick as ((e: MouseEvent<HTMLAnchorElement>) => void) | undefined)?.(ev)
      if (!href || target === '_blank') return
      if (ev.defaultPrevented) return
      // Let the browser own modifier clicks so "open in new tab" still works.
      if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey || ev.button !== 0) return
      ev.preventDefault()
      router.push(href)
    }

    if (href && !isDisabled) {
      // `FluentButton` is polymorphic over `as`, which makes its props a union.
      // Spreading button-flavoured passthrough props into the anchor branch can't
      // be expressed in that union (`onToggle` et al. differ per element), so the
      // component is widened for this one call. The public `GradlyButtonProps`
      // surface stays fully typed.
      const AnchorButton = FluentButton as unknown as React.ComponentType<
        Record<string, unknown>
      >
      return (
        <AnchorButton
          as="a"
          href={href}
          target={target}
          rel={target === '_blank' ? 'noopener noreferrer' : undefined}
          className={classes}
          icon={arrowNode}
          iconPosition="after"
          onClick={handleAnchorClick}
          {...(rest as Record<string, unknown>)}
        >
          {icon}
          {children}
        </AnchorButton>
      )
    }

    return (
      <FluentButton
        ref={ref}
        className={classes}
        icon={arrowNode}
        iconPosition="after"
        // `disabledFocusable` keeps a loading button in the tab order and
        // announced, instead of silently vanishing from keyboard navigation.
        disabled={disabled && !loading}
        disabledFocusable={loading}
        onClick={onClick}
        {...rest}
      >
        {icon}
        {children}
      </FluentButton>
    )
  }
)

/**
 * Square icon-only button.
 *
 * Used for every control whose whole label is its icon — header actions, a row's
 * delete, a banner's dismiss. `label` is required because an icon-only control is
 * invisible to a screen reader without one, so the type makes it impossible to
 * forget rather than leaving it to review.
 */
export const IconButton = forwardRef<
  HTMLButtonElement,
  {
    icon: React.ReactElement
    /** Accessible name. Required — an icon alone announces nothing. */
    label: string
    size?: GradlyButtonSize
    appearance?: 'subtle' | 'transparent' | 'secondary' | 'primary'
    shape?: 'circular' | 'rounded' | 'square'
    className?: string
  } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'>
>(function IconButton(
  { icon, label, size = 'md', appearance = 'subtle', shape = 'circular', className, ...rest },
  ref
) {
  const s = useStyles()
  return (
    <FluentButton
      ref={ref}
      appearance={appearance}
      shape={shape}
      icon={icon}
      aria-label={label}
      className={mergeClasses(
        s.iconOnly,
        { sm: s.iconSm, md: s.iconMd, lg: s.iconLg }[size],
        className
      )}
      {...rest}
    />
  )
})

export {
  ToggleButton,
  MenuButton,
  SplitButton,
  CompoundButton,
} from '@fluentui/react-components'
