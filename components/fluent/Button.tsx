'use client'

import { forwardRef, type MouseEvent } from 'react'
import { useRouter } from 'next/navigation'
import {
  Button as FluentButton,
  Spinner,
  makeStyles,
  mergeClasses,
  type ButtonProps as FluentButtonProps,
} from '@fluentui/react-components'

/**
 * Thin wrappers over Fluent's `Button`.
 *
 * Fluent's five appearances (`primary`, `secondary`, `outline`, `subtle`,
 * `transparent`) and three sizes are used as-is — no restyling. The wrapper exists
 * for three things Fluent leaves to the app:
 *
 *   - `href` that navigates client-side instead of reloading the page
 *   - a `loading` state (Fluent has `Spinner`, but no "button is busy" prop)
 *   - `fullWidth`, which is a layout decision Fluent deliberately omits
 *
 * Anything else should use Fluent's `Button` directly; it is re-exported below.
 */

const useStyles = makeStyles({
  fullWidth: { width: '100%' },
  /**
   * Fluent sets `min-width: 96px` so labelled buttons align in a dialog footer.
   * An icon-only button wants to be square, and Fluent's own icon-only branch
   * doesn't trigger through a wrapper, so it is set explicitly here.
   */
  iconOnly: { minWidth: 'auto', maxWidth: 'none' },
})

export type GradlyButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'className' | 'children'
> & {
  appearance?: FluentButtonProps['appearance']
  size?: FluentButtonProps['size']
  shape?: FluentButtonProps['shape']
  icon?: React.ReactElement
  iconPosition?: 'before' | 'after'
  /** Swaps the icon for a spinner and blocks interaction. */
  loading?: boolean
  fullWidth?: boolean
  href?: string
  target?: string
  className?: string
  children?: React.ReactNode
}

export const GradlyButton = forwardRef<HTMLButtonElement, GradlyButtonProps>(
  function GradlyButton(
    {
      appearance = 'secondary',
      size = 'medium',
      shape,
      icon,
      iconPosition = 'before',
      loading = false,
      fullWidth = false,
      href,
      target,
      className,
      children,
      disabled,
      onClick,
      ...rest
    },
    ref
  ) {
    const s = useStyles()
    const router = useRouter()
    const classes = mergeClasses(fullWidth && s.fullWidth, className)
    const resolvedIcon = loading ? <Spinner size="tiny" /> : icon

    const handleAnchorClick = (ev: MouseEvent<HTMLAnchorElement>) => {
      ;(onClick as ((e: MouseEvent<HTMLAnchorElement>) => void) | undefined)?.(ev)
      if (!href || target === '_blank' || ev.defaultPrevented) return
      // Leave modifier clicks to the browser so "open in new tab" still works.
      if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey || ev.button !== 0) return
      ev.preventDefault()
      router.push(href)
    }

    if (href && !disabled && !loading) {
      // Fluent's Button is polymorphic over `as`, which makes its props a union
      // that button-flavoured passthrough props can't satisfy. Widened for this
      // one call; the exported prop type stays fully checked.
      const AnchorButton = FluentButton as unknown as React.ComponentType<
        Record<string, unknown>
      >
      return (
        <AnchorButton
          as="a"
          href={href}
          target={target}
          rel={target === '_blank' ? 'noopener noreferrer' : undefined}
          appearance={appearance}
          size={size}
          shape={shape}
          icon={resolvedIcon}
          iconPosition={iconPosition}
          className={classes}
          onClick={handleAnchorClick}
          {...(rest as Record<string, unknown>)}
        >
          {children}
        </AnchorButton>
      )
    }

    return (
      <FluentButton
        ref={ref}
        appearance={appearance}
        size={size}
        shape={shape}
        icon={resolvedIcon}
        iconPosition={iconPosition}
        className={classes}
        disabled={disabled && !loading}
        // `disabledFocusable` keeps a busy button in the tab order and announced,
        // instead of silently dropping out of keyboard navigation.
        disabledFocusable={loading}
        onClick={onClick}
        {...rest}
      >
        {children}
      </FluentButton>
    )
  }
)

/**
 * Square icon-only button.
 *
 * `label` is required: an icon-only control announces nothing without an
 * accessible name, so the type makes it impossible to forget.
 */
export const IconButton = forwardRef<
  HTMLButtonElement,
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & {
    icon: React.ReactElement
    label: string
    appearance?: FluentButtonProps['appearance']
    size?: FluentButtonProps['size']
    shape?: FluentButtonProps['shape']
    className?: string
  }
>(function IconButton(
  { icon, label, appearance = 'subtle', size = 'medium', shape = 'circular', className, ...rest },
  ref
) {
  const s = useStyles()
  return (
    <FluentButton
      ref={ref}
      appearance={appearance}
      size={size}
      shape={shape}
      icon={icon}
      aria-label={label}
      className={mergeClasses(s.iconOnly, className)}
      {...rest}
    />
  )
})

export {
  Button,
  ToggleButton,
  MenuButton,
  SplitButton,
  CompoundButton,
  Link,
} from '@fluentui/react-components'
export type { FluentButtonProps }
