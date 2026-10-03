'use client'

import { useCallback } from 'react'
import {
  Toast,
  ToastTitle,
  ToastBody,
  useToastController,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  MessageBarActions,
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogTrigger,
  Spinner,
  ProgressBar,
  Button,
  makeStyles,
  mergeClasses,
  tokens,
  type ToastIntent,
  type MessageBarProps,
} from '@fluentui/react-components'
import { DismissRegular } from '@fluentui/react-icons'
import { gradlyTokens } from '@/lib/fluent'
import { IconButton } from './Button'
import { useGradlyTheme } from './GradlyProvider'
import { Body } from './Text'
import { Stack } from './Layout'

const useStyles = makeStyles({
  bar: {
    borderRadius: tokens.borderRadiusLarge,
    // Fluent's MessageBar lays out on one line until it is told it may reflow;
    // without this the title + body + action row overflows a phone viewport.
    minWidth: 0,
    flexWrap: 'wrap',
  },
  loadingWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    rowGap: '12px',
    paddingTop: '48px',
    paddingBottom: '48px',
  },
  inlineLoading: { display: 'inline-flex', alignItems: 'center', columnGap: '8px' },
  surface: { borderRadius: gradlyTokens.radiusCard, maxWidth: '480px' },
  // Fluent's step rail: a row of segments that fill as the user advances.
  stepRail: { display: 'flex', alignItems: 'center', columnGap: '6px' },
  stepSeg: {
    height: '4px',
    width: '40px',
    borderRadius: gradlyTokens.radiusPill,
    backgroundColor: gradlyTokens.ink100,
    transitionProperty: 'background-color',
    transitionDuration: '200ms',
  },
  stepSegDone: { backgroundColor: gradlyTokens.amber },
  stepMeta: {
    fontFamily: gradlyTokens.fontFamilyMono,
    fontSize: '10px',
    textTransform: 'uppercase',
    letterSpacing: '0.18em',
    color: gradlyTokens.ink500,
  },
})

/* ─────────────────────────── Toast ─────────────────────────── */

/**
 * Toast helpers bound to the single `<Toaster>` in `GradlyProvider`.
 *
 * Replaces the hand-rolled ToastContext: Fluent's toaster handles stacking,
 * timeout pausing on hover, focus management and `aria-live` politeness per
 * intent (errors are assertive, info is polite) — all of which the old one
 * silently skipped.
 */
export function useGradlyToast() {
  const { toasterId } = useGradlyTheme()
  const { dispatchToast } = useToastController(toasterId)

  const show = useCallback(
    (
      title: string,
      opts?: { body?: string; intent?: ToastIntent; timeout?: number }
    ) => {
      dispatchToast(
        <Toast>
          <ToastTitle>{title}</ToastTitle>
          {opts?.body && <ToastBody>{opts.body}</ToastBody>}
        </Toast>,
        { intent: opts?.intent ?? 'info', timeout: opts?.timeout ?? 4000 }
      )
    },
    [dispatchToast]
  )

  return {
    show,
    success: useCallback(
      (title: string, body?: string) => show(title, { body, intent: 'success' }),
      [show]
    ),
    error: useCallback(
      // Errors stay up longer — they usually need the user to read and act.
      (title: string, body?: string) =>
        show(title, { body, intent: 'error', timeout: 7000 }),
      [show]
    ),
    warning: useCallback(
      (title: string, body?: string) => show(title, { body, intent: 'warning' }),
      [show]
    ),
    info: useCallback(
      (title: string, body?: string) => show(title, { body, intent: 'info' }),
      [show]
    ),
  }
}

/* ─────────────────────────── Inline messages ─────────────────────────── */

export function MessageBanner({
  intent = 'info',
  title,
  children,
  onDismiss,
  actions,
  className,
}: {
  intent?: MessageBarProps['intent']
  title?: string
  children?: React.ReactNode
  onDismiss?: () => void
  actions?: React.ReactNode
  className?: string
}) {
  const s = useStyles()
  return (
    <MessageBar intent={intent} className={mergeClasses(s.bar, className)}>
      <MessageBarBody>
        {title && <MessageBarTitle>{title}</MessageBarTitle>}
        {children}
      </MessageBarBody>
      {(actions || onDismiss) && (
        <MessageBarActions
          containerAction={
            onDismiss ? (
              <IconButton
                appearance="transparent"
                icon={<DismissRegular />}
                onClick={onDismiss}
                label="Dismiss"
                size="sm"
              />
            ) : undefined
          }
        >
          {actions}
        </MessageBarActions>
      )}
    </MessageBar>
  )
}

/* ─────────────────────────── Loading ─────────────────────────── */

export function Loading({
  label = 'Loading',
  inline = false,
  size = 'medium',
}: {
  label?: string
  inline?: boolean
  size?: 'tiny' | 'extra-small' | 'small' | 'medium' | 'large'
}) {
  const s = useStyles()
  return inline ? (
    <span className={s.inlineLoading}>
      <Spinner size={size} />
      <Body muted as="span">
        {label}
      </Body>
    </span>
  ) : (
    <div className={s.loadingWrap}>
      <Spinner size={size} label={label} labelPosition="below" />
    </div>
  )
}

/* ─────────────────────────── Dialog ─────────────────────────── */

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  children,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  destructive = false,
  busy = false,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children?: React.ReactNode
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void | Promise<void>
  destructive?: boolean
  busy?: boolean
}) {
  const s = useStyles()
  return (
    <Dialog open={open} onOpenChange={(_, data) => onOpenChange(data.open)}>
      <DialogSurface className={s.surface}>
        <DialogBody>
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>{children}</DialogContent>
          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="secondary" disabled={busy}>
                {cancelLabel}
              </Button>
            </DialogTrigger>
            <Button
              appearance="primary"
              onClick={() => onConfirm()}
              disabled={busy}
              icon={busy ? <Spinner size="tiny" /> : undefined}
              style={
                destructive
                  ? { backgroundColor: gradlyTokens.danger, borderColor: 'transparent' }
                  : undefined
              }
            >
              {confirmLabel}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  )
}

/* ─────────────────────────── Stepper ─────────────────────────── */

/**
 * The segmented step indicator from the old AppShell header. Reads as
 * "Step 2 of 4 · Course selection" to assistive tech via the label, with the
 * segments marked decorative.
 */
export function Stepper({
  step,
  totalSteps,
  label,
}: {
  step: number
  totalSteps: number
  label?: string
}) {
  const s = useStyles()
  return (
    <Stack direction="row" align="center" gap={12}>
      <div className={s.stepRail} aria-hidden>
        {Array.from({ length: totalSteps }).map((_, i) => (
          <span
            key={i}
            className={mergeClasses(s.stepSeg, i < step && s.stepSegDone)}
          />
        ))}
      </div>
      <span className={s.stepMeta}>
        Step {step} of {totalSteps}
        {label ? ` · ${label}` : ''}
      </span>
    </Stack>
  )
}

export {
  Spinner,
  ProgressBar,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  MessageBarActions,
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogTrigger,
  Tooltip,
  Popover,
  PopoverTrigger,
  PopoverSurface,
} from '@fluentui/react-components'
