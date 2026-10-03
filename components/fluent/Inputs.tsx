'use client'

import { forwardRef, useId, useRef, useState } from 'react'
import {
  Field,
  Label,
  Input,
  Textarea,
  Dropdown,
  Option,
  OptionGroup,
  Combobox,
  SpinButton,
  Slider,
  Switch,
  Checkbox,
  Radio,
  RadioGroup,
  SearchBox,
  InfoLabel,
  makeStyles,
  mergeClasses,
  shorthands,
  tokens,
  type FieldProps,
  type InputProps,
  type TextareaProps,
  type DropdownProps,
  type SliderProps,
  type SwitchProps,
  type CheckboxProps,
  type SpinButtonProps,
} from '@fluentui/react-components'
import { EyeRegular, EyeOffRegular } from '@fluentui/react-icons'
import { IconButton } from './Button'

/**
 * Form controls.
 *
 * Every one of these is Fluent's `Field` paired with a Fluent control, with no
 * restyling of either. `Field` owns the label, hint, validation message, the
 * required marker and the `aria-describedby` / `aria-invalid` wiring; the control
 * keeps Fluent's own sizes, focus indicator and high-contrast behaviour.
 *
 * The wrappers exist only to collapse the `<Field><Control/></Field>` pair into
 * one call with a flat prop list, so a form is a list of fields rather than a
 * tree. Each raw Fluent component is re-exported at the bottom for the cases
 * where a page needs the full API.
 *
 * Two are genuine compositions, because Fluent has no equivalent: the card
 * variant of `RadioField`, and `OTPField`.
 */

const useStyles = makeStyles({
  fullWidth: { width: '100%' },

  choiceCard: {
    display: 'flex',
    alignItems: 'flex-start',
    columnGap: tokens.spacingHorizontalM,
    paddingTop: tokens.spacingVerticalM,
    paddingBottom: tokens.spacingVerticalM,
    paddingLeft: tokens.spacingHorizontalM,
    paddingRight: tokens.spacingHorizontalM,
    borderRadius: tokens.borderRadiusMedium,
    ...shorthands.border(tokens.strokeWidthThin, 'solid', tokens.colorNeutralStroke1),
    backgroundColor: tokens.colorNeutralBackground1,
    cursor: 'pointer',
    width: '100%',
    ':hover': { backgroundColor: tokens.colorNeutralBackground1Hover },
  },
  choiceCardChecked: {
    ...shorthands.borderColor(tokens.colorBrandStroke1),
    backgroundColor: tokens.colorBrandBackground2,
  },
  choiceText: { display: 'flex', flexDirection: 'column', rowGap: '2px' },
  choiceDesc: { color: tokens.colorNeutralForeground3, fontSize: tokens.fontSizeBase200 },

  otpWrap: { display: 'flex', flexDirection: 'column', rowGap: tokens.spacingVerticalS },
  otpRow: { display: 'flex', columnGap: tokens.spacingHorizontalS },
  otpCell: {
    width: '48px',
    '& input': {
      textAlign: 'center',
      fontSize: tokens.fontSizeBase500,
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
  otpError: { color: tokens.colorPaletteRedForeground1, fontSize: tokens.fontSizeBase200 },

  sliderRow: {
    display: 'flex',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalM,
    width: '100%',
  },
  slider: { flexGrow: 1, minWidth: 0 },
  sliderReadout: {
    minWidth: '48px',
    textAlign: 'right',
    flexShrink: 0,
    fontVariantNumeric: 'tabular-nums',
    color: tokens.colorNeutralForeground1,
    fontSize: tokens.fontSizeBase300,
  },
  sliderScale: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: tokens.spacingVerticalXXS,
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
  },
})

/** Fluent's `Field` renders its label through a slot, narrower than ReactNode. */
type FieldLabel = FieldProps['label']

/* ─────────────────────────── Text ─────────────────────────── */

export type TextFieldProps = Omit<InputProps, 'size'> & {
  label?: FieldLabel
  hint?: string
  error?: string
  /** Renders a show/hide toggle. Implied by `type="password"`. */
  togglePassword?: boolean
  required?: boolean
  size?: InputProps['size']
  className?: string
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField(
    { label, hint, error, togglePassword, required, className, type = 'text', ...rest },
    ref
  ) {
    const s = useStyles()
    const [show, setShow] = useState(false)
    const isPassword = type === 'password' || togglePassword

    return (
      <Field
        label={label}
        hint={error ? undefined : hint}
        validationMessage={error}
        validationState={error ? 'error' : 'none'}
        required={required}
        className={mergeClasses(s.fullWidth, className)}
      >
        <Input
          ref={ref}
          type={isPassword ? (show ? 'text' : 'password') : type}
          contentAfter={
            isPassword ? (
              <IconButton
                appearance="transparent"
                size="small"
                shape="rounded"
                icon={show ? <EyeOffRegular /> : <EyeRegular />}
                onClick={() => setShow((v) => !v)}
                // Out of the tab order: the input is the control, this is a
                // convenience, and tabbing into it mid-form is noise.
                tabIndex={-1}
                label={show ? 'Hide password' : 'Show password'}
              />
            ) : undefined
          }
          {...rest}
        />
      </Field>
    )
  }
)

export type TextAreaFieldProps = Omit<TextareaProps, 'size'> & {
  label?: FieldLabel
  hint?: string
  error?: string
  required?: boolean
  className?: string
}

export const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
  function TextAreaField({ label, hint, error, required, className, ...rest }, ref) {
    const s = useStyles()
    return (
      <Field
        label={label}
        hint={error ? undefined : hint}
        validationMessage={error}
        validationState={error ? 'error' : 'none'}
        required={required}
        className={mergeClasses(s.fullWidth, className)}
      >
        <Textarea ref={ref} resize="vertical" {...rest} />
      </Field>
    )
  }
)

/* ─────────────────────────── Choice ─────────────────────────── */

export type SelectOption = { value: string; label: string; disabled?: boolean }

export type SelectFieldProps = Omit<DropdownProps, 'children'> & {
  label?: FieldLabel
  hint?: string
  error?: string
  required?: boolean
  options: SelectOption[]
  className?: string
}

/**
 * Fluent's `Dropdown` (a listbox with a real popover), not a native `<select>`:
 * option text renders and truncates identically across browsers and it keeps
 * Fluent's focus indicator.
 *
 * Fluent drives it with `selectedOptions` (an array) *and* a display `value` —
 * passing only `value` looks right but leaves nothing checked in the list.
 */
export function SelectField({
  label,
  hint,
  error,
  required,
  options,
  className,
  ...rest
}: SelectFieldProps) {
  const s = useStyles()
  return (
    <Field
      label={label}
      hint={error ? undefined : hint}
      validationMessage={error}
      validationState={error ? 'error' : 'none'}
      required={required}
      className={mergeClasses(s.fullWidth, className)}
    >
      <Dropdown {...rest}>
        {options.map((o) => (
          <Option key={o.value} value={o.value} text={o.label} disabled={o.disabled}>
            {o.label}
          </Option>
        ))}
      </Dropdown>
    </Field>
  )
}

export type NumberFieldProps = Omit<SpinButtonProps, 'size'> & {
  label?: FieldLabel
  hint?: string
  error?: string
  required?: boolean
  className?: string
}

export function NumberField({
  label,
  hint,
  error,
  required,
  className,
  ...rest
}: NumberFieldProps) {
  const s = useStyles()
  return (
    <Field
      label={label}
      hint={error ? undefined : hint}
      validationMessage={error}
      validationState={error ? 'error' : 'none'}
      required={required}
      className={mergeClasses(s.fullWidth, className)}
    >
      <SpinButton {...rest} />
    </Field>
  )
}

export function SearchField({
  label,
  placeholder = 'Search',
  className,
  ...rest
}: { label?: FieldLabel; placeholder?: string; className?: string } & React.ComponentProps<
  typeof SearchBox
>) {
  const s = useStyles()
  return label ? (
    <Field label={label} className={mergeClasses(s.fullWidth, className)}>
      <SearchBox placeholder={placeholder} {...rest} />
    </Field>
  ) : (
    <SearchBox className={className} placeholder={placeholder} {...rest} />
  )
}

/* ─────────────────────────── Toggles ─────────────────────────── */

export function CheckboxField({
  error,
  className,
  ...rest
}: CheckboxProps & { error?: string; className?: string }) {
  return error ? (
    <Field validationMessage={error} validationState="error" className={className}>
      <Checkbox {...rest} />
    </Field>
  ) : (
    <Checkbox className={className} {...rest} />
  )
}

export function SwitchField({
  hint,
  className,
  ...rest
}: SwitchProps & { hint?: string; className?: string }) {
  return hint ? (
    <Field hint={hint} className={className}>
      <Switch {...rest} />
    </Field>
  ) : (
    <Switch className={className} {...rest} />
  )
}

export type RadioOption = {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

/**
 * Radio group, with an optional card treatment for the big tappable choice rows
 * the onboarding and course-selection flows use.
 *
 * The card chrome is custom (Fluent has no choice-card component) but each row
 * is still a Fluent `Radio`, so arrow-key navigation, the roving tab index and
 * the checked indicator are Fluent's, not a re-implementation.
 */
export function RadioField({
  label,
  hint,
  error,
  options,
  value,
  onValueChange,
  cards = false,
  className,
}: {
  label?: FieldLabel
  hint?: string
  error?: string
  options: RadioOption[]
  value?: string
  onValueChange?: (value: string) => void
  cards?: boolean
  className?: string
}) {
  const s = useStyles()
  return (
    <Field
      label={label}
      hint={error ? undefined : hint}
      validationMessage={error}
      validationState={error ? 'error' : 'none'}
      className={mergeClasses(s.fullWidth, className)}
    >
      <RadioGroup
        value={value}
        onChange={(_, data) => onValueChange?.(data.value)}
        style={cards ? { gap: tokens.spacingVerticalS } : undefined}
      >
        {options.map((o) =>
          cards ? (
            <label
              key={o.value}
              className={mergeClasses(s.choiceCard, value === o.value && s.choiceCardChecked)}
            >
              <Radio value={o.value} disabled={o.disabled} />
              <span className={s.choiceText}>
                <span>{o.label}</span>
                {o.description && <span className={s.choiceDesc}>{o.description}</span>}
              </span>
            </label>
          ) : (
            <Radio key={o.value} value={o.value} label={o.label} disabled={o.disabled} />
          )
        )}
      </RadioGroup>
    </Field>
  )
}

/* ─────────────────────────── Slider ─────────────────────────── */

export type SliderFieldProps = Omit<SliderProps, 'size'> & {
  label?: FieldLabel
  hint?: string
  /** Formats the readout, e.g. `v => v + '%'`. */
  format?: (value: number) => string
  /** Shows min/max captions under the track. */
  showScale?: boolean
  className?: string
}

/**
 * Fluent's `Slider` with a live value readout — Fluent has no built-in display,
 * and a slider without one makes the user guess, so it is part of the field
 * rather than something each page re-adds.
 */
export function SliderField({
  label,
  hint,
  format = (v) => String(v),
  showScale = false,
  className,
  min = 0,
  max = 100,
  value,
  defaultValue,
  onChange,
  ...rest
}: SliderFieldProps) {
  const s = useStyles()
  const [internal, setInternal] = useState<number>(value ?? defaultValue ?? min)
  const current = value ?? internal

  return (
    <Field label={label} hint={hint} className={mergeClasses(s.fullWidth, className)}>
      <div>
        <div className={s.sliderRow}>
          <Slider
            className={s.slider}
            min={min}
            max={max}
            value={current}
            onChange={(ev, data) => {
              setInternal(data.value)
              onChange?.(ev, data)
            }}
            {...rest}
          />
          <span className={s.sliderReadout} aria-hidden>
            {format(current)}
          </span>
        </div>
        {showScale && (
          <div className={s.sliderScale}>
            <span>{format(min)}</span>
            <span>{format(max)}</span>
          </div>
        )}
      </div>
    </Field>
  )
}

/* ─────────────────────────── OTP ─────────────────────────── */

/**
 * Fixed-length code entry. Fluent has no OTP component, so this composes one
 * from Fluent `Input` cells plus a Fluent `Label`.
 *
 * Deliberately not wrapped in `Field`: Field assigns its generated control id to
 * the input it labels, and several inputs inside one Field all end up sharing it.
 * The group is tied together with `role="group"` + `aria-labelledby` instead,
 * which is what a screen reader needs to announce "Verification code, Digit 1 of 4".
 */
export function OTPField({
  length = 4,
  value,
  onChange,
  error,
  label,
  autoFocus = false,
}: {
  length?: number
  value: string
  onChange: (v: string) => void
  error?: string
  label?: React.ReactNode
  autoFocus?: boolean
}) {
  const s = useStyles()
  const baseId = useId()
  const labelId = `${baseId}-label`
  const errorId = `${baseId}-error`
  const refs = useRef<Array<HTMLInputElement | null>>([])

  const focusCell = (i: number) => refs.current[i]?.focus()

  const setAt = (i: number, char: string) => {
    const chars = value.padEnd(length, ' ').split('')
    chars[i] = char || ' '
    onChange(chars.join('').replace(/ /g, '').slice(0, length))
  }

  return (
    <div className={s.otpWrap}>
      {label && <Label id={labelId}>{label}</Label>}
      <div
        className={s.otpRow}
        role="group"
        aria-labelledby={label ? labelId : undefined}
        aria-describedby={error ? errorId : undefined}
      >
        {Array.from({ length }).map((_, i) => (
          <Input
            key={i}
            id={`${baseId}-${i}`}
            className={s.otpCell}
            appearance={error ? 'outline' : undefined}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus={autoFocus && i === 0}
            inputMode="numeric"
            maxLength={1}
            aria-label={`Digit ${i + 1} of ${length}`}
            aria-invalid={error ? true : undefined}
            value={value[i] ?? ''}
            input={{
              ref: (el: HTMLInputElement | null) => {
                refs.current[i] = el
              },
            }}
            onChange={(_, data) => {
              const digit = data.value.replace(/\D/g, '').slice(-1)
              setAt(i, digit)
              if (digit && i < length - 1) focusCell(i + 1)
            }}
            onKeyDown={(ev) => {
              if (ev.key === 'Backspace' && !value[i] && i > 0) {
                focusCell(i - 1)
                setAt(i - 1, '')
              }
              if (ev.key === 'ArrowLeft' && i > 0) focusCell(i - 1)
              if (ev.key === 'ArrowRight' && i < length - 1) focusCell(i + 1)
            }}
            onPaste={(ev) => {
              const pasted = ev.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
              if (!pasted) return
              ev.preventDefault()
              onChange(pasted)
              focusCell(Math.min(pasted.length, length - 1))
            }}
          />
        ))}
      </div>
      {error && (
        <div id={errorId} role="alert" className={s.otpError}>
          {error}
        </div>
      )}
    </div>
  )
}

export {
  Field,
  Label,
  Input,
  Textarea,
  Dropdown,
  Option,
  OptionGroup,
  Combobox,
  SpinButton,
  Slider,
  Switch,
  Checkbox,
  Radio,
  RadioGroup,
  SearchBox,
  InfoLabel,
}
export type { FieldProps }
