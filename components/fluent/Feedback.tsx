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
  shorthands,
  tokens,
  type ToastIntent,
  Caption1,
  type MessageBarProps,
} from '@fluentui/react-components'
import { DismissRegular } from '@fluentui/react-icons'
import { IconButton } from './Button'
import { useGradlyTheme } from './GradlyProvider'
import { Body } from './Text'

const useStyles = makeStyles({
  loadingWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    rowGap: tokens.spacingVerticalM,
    paddingTop: tokens.spacingVerticalXXXL,
    paddingBottom: tokens.spacingVerticalXXXL,
  },
  inlineLoading: {
    display: 'inline-flex',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalS,
  },
  stepper: { display: 'flex', flexDirection: 'column', rowGap: tokens.spacingVerticalXS },
  stepperMeta: { color: tokens.colorNeutralForeground3 },
  /**
   * Fluent has no destructive Button appearance, so the primary button is
   * repainted with Fluent's own danger palette tokens rather than a hand-picked
   * red — hover/pressed stay in the same family.
   */
  destructive: {
    backgroundColor: tokens.colorPaletteRedBackground3,
    ...shorthands.borderColor('transparent'),
    color: tokens.colorNeutralForegroundOnBrand,
    ':hover': {
      backgroundColor: tokens.colorPaletteRedForeground1,
      color: tokens.colorNeutralForegroundOnBrand,
    },
    ':hover:active': {
      backgroundColor: tokens.colorPaletteRedForeground1,
      color: tokens.colorNeutralForegroundOnBrand,
    },
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
    <MessageBar intent={intent} className={className}>
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
                size="small"
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
      <DialogSurface>
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
              className={destructive ? s.destructive : undefined}
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
 * Multi-step progress indicator.
 *
 * Fluent's `ProgressBar` with a caption, rather than the custom segmented rail
 * this used to be: ProgressBar already carries `role="progressbar"` with the
 * correct `aria-valuenow`/`valuemin`/`valuemax`, so assistive tech reads the
 * position without a parallel text-only description.
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
    <div className={s.stepper}>
      <ProgressBar
        value={step / totalSteps}
        max={1}
        thickness="medium"
        shape="rounded"
        aria-label={`Step ${step} of ${totalSteps}${label ? `: ${label}` : ''}`}
      />
      <Caption1 className={s.stepperMeta}>
        Step {step} of {totalSteps}
        {label ? ` · ${label}` : ''}
      </Caption1>
    </div>
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
