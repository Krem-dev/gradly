'use client'

import { forwardRef, useId, useRef, useState } from 'react'
import {
  Field,
  fieldClassNames,
  Label,
  Input,
  Textarea,
  Dropdown,
  Option,
  Combobox,
  SpinButton,
  Slider,
  Switch,
  Checkbox,
  Radio,
  RadioGroup,
  SearchBox,
  Button,
  makeStyles,
  mergeClasses,
  tokens,
  type FieldProps,
  type InputProps,
  type TextareaProps,
  type DropdownProps,
  type SliderProps,
  type SwitchProps,
  type CheckboxProps,
  type SpinButtonProps,
  shorthands,
} from '@fluentui/react-components'
import { EyeRegular, EyeOffRegular } from '@fluentui/react-icons'
import { gradlyTokens } from '@/lib/fluent'

/**
 * Fluent's `Field` renders its label through a slot, whose type is narrower than
 * `ReactNode` (no bigint, no Promise). Aliasing it keeps our field props exactly as
 * permissive as what Fluent will actually accept.
 */
type FieldLabel = FieldProps['label']

const useStyles = makeStyles({
  /**
   * Field labels in the old design were 10px mono, uppercase, letter-spaced — not
   * Fluent's 14px sentence-case. Fluent exposes the label as a slot, so rather than
   * re-implement Field (and lose its aria-describedby / validation wiring) we
   * restyle the rendered label from the Field root.
   *
   * Scoped to `fieldClassNames.label`, NOT to the `label` element: a bare
   * `& label` also matches every nested <label> — Radio/Switch/Checkbox labels and
   * the choice-card rows — which rendered their body copy as 10px uppercase mono.
   */
  field: {
    [`& .${fieldClassNames.label}`]: {
      fontFamily: gradlyTokens.fontFamilyMono,
      fontSize: '10px',
      lineHeight: '1.4',
      textTransform: 'uppercase',
      letterSpacing: '0.18em',
      color: gradlyTokens.ink500,
      fontWeight: '400',
      paddingBottom: '8px',
    },
  },
  control: {
    width: '100%',
    height: '48px',
    borderRadius: tokens.borderRadiusLarge,
    fontSize: tokens.fontSizeBase300,
    backgroundColor: tokens.colorNeutralBackground1,
    ':hover': { ...shorthands.borderColor(gradlyTokens.ink300) },
    // Fluent draws focus with a bottom "focus bar"; swap it for the amber ring
    // the rest of the system uses.
    ':focus-within': {
      outlineWidth: '2px',
      outlineStyle: 'solid',
      outlineColor: gradlyTokens.amber,
      outlineOffset: '1px',
    },
    '::after': { display: 'none' },
  },
  textarea: { height: 'auto', minHeight: '120px', paddingTop: '12px', paddingBottom: '12px' },
  fullWidth: { width: '100%' },
  revealBtn: { minWidth: '32px', height: '32px', padding: '0' },

  // ── Slider ────────────────────────────────────────────────────────────────
  sliderRow: { display: 'flex', alignItems: 'center', columnGap: '16px', width: '100%' },
  sliderReadout: {
    fontFamily: gradlyTokens.fontFamilyMono,
    fontSize: '13px',
    fontVariantNumeric: 'tabular-nums',
    color: gradlyTokens.ink900,
    minWidth: '48px',
    textAlign: 'right',
    flexShrink: 0,
  },
  slider: { flexGrow: 1, minWidth: '0' },
  sliderScale: {
    display: 'flex',
    justifyContent: 'space-between',
    fontFamily: gradlyTokens.fontFamilyMono,
    fontSize: '10px',
    color: gradlyTokens.ink400,
    marginTop: '6px',
  },

  // ── Choice groups ─────────────────────────────────────────────────────────
  choiceCard: {
    display: 'flex',
    alignItems: 'flex-start',
    columnGap: '12px',
    padding: '14px 16px',
    borderRadius: tokens.borderRadiusLarge,
    ...shorthands.border('1px', 'solid', gradlyTokens.ink100),
    cursor: 'pointer',
    width: '100%',
    backgroundColor: tokens.colorNeutralBackground1,
    ':hover': { ...shorthands.borderColor(gradlyTokens.ink300) },
  },
  choiceCardChecked: {
    ...shorthands.borderColor(tokens.colorBrandBackground),
    backgroundColor: tokens.colorBrandBackground2,
  },

  // ── OTP ───────────────────────────────────────────────────────────────────
  otpWrap: { display: 'flex', flexDirection: 'column', rowGap: '8px' },
  otpLabel: {
    fontFamily: gradlyTokens.fontFamilyMono,
    fontSize: '10px',
    lineHeight: '1.4',
    textTransform: 'uppercase',
    letterSpacing: '0.18em',
    color: gradlyTokens.ink500,
    fontWeight: '400',
  },
  otpRow: { display: 'flex', justifyContent: 'center', columnGap: '10px' },
  otpCellError: { ...shorthands.borderColor(gradlyTokens.danger) },
  otpError: { fontSize: tokens.fontSizeBase200, color: gradlyTokens.danger },
  otpCell: {
    width: '52px',
    height: '60px',
    '& input': {
      textAlign: 'center',
      fontFamily: gradlyTokens.fontFamilyDisplay,
      fontSize: '26px',
      paddingLeft: '0',
      paddingRight: '0',
    },
  },
})

/* ─────────────────────────── Text ─────────────────────────── */

export type TextFieldProps = Omit<InputProps, 'size'> & {
  label?: FieldLabel
  hint?: string
  error?: string
  /** Renders a show/hide toggle. Implied by `type="password"`. */
  togglePassword?: boolean
  required?: boolean
  className?: string
}

/**
 * Single-line text input. Fluent's `Field` owns the label/hint/error association
 * (`aria-describedby`, `aria-invalid`, the required marker), so none of that is
 * re-implemented here — this only adds the Gradly label style, the 48px control
 * height, and the password reveal.
 */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField(
    { label, hint, error, togglePassword, required, className, type = 'text', ...rest },
    ref
  ) {
    const s = useStyles()
    const [show, setShow] = useState(false)
    const isPassword = type === 'password' || togglePassword
    const resolvedType = isPassword ? (show ? 'text' : 'password') : type

    return (
      <Field
        label={label}
        hint={error ? undefined : hint}
        validationMessage={error}
        validationState={error ? 'error' : 'none'}
        required={required}
        className={mergeClasses(s.field, s.fullWidth, className)}
      >
        <Input
          ref={ref}
          type={resolvedType}
          className={s.control}
          contentAfter={
            isPassword ? (
              <Button
                appearance="transparent"
                className={s.revealBtn}
                icon={show ? <EyeOffRegular /> : <EyeRegular />}
                onClick={() => setShow((v) => !v)}
                // Keep it out of the tab order: the input is the control, this is
                // a convenience affordance, and tabbing into it mid-form is noise.
                tabIndex={-1}
                aria-label={show ? 'Hide password' : 'Show password'}
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
        className={mergeClasses(s.field, s.fullWidth, className)}
      >
        <Textarea
          ref={ref}
          className={mergeClasses(s.control, s.textarea)}
          resize="vertical"
          {...rest}
        />
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
 * Uses Fluent's `Dropdown` (a listbox) rather than a native `<select>`: it renders
 * a real popover, so option text can be styled and truncated consistently across
 * browsers, and it keeps the same focus ring as every other control here.
 *
 * Fluent's Dropdown is controlled by `selectedOptions` (an array) plus a display
 * `value` — passing only `value` looks right but leaves the list with nothing
 * checked, so callers should set both, or use `defaultSelectedOptions`.
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
      className={mergeClasses(s.field, s.fullWidth, className)}
    >
      <Dropdown className={s.control} {...rest}>
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

/** Credit hours, scores, counts — anything with steppers and a numeric range. */
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
      className={mergeClasses(s.field, s.fullWidth, className)}
    >
      <SpinButton className={s.control} {...rest} />
    </Field>
  )
}

export function SearchField({
  label,
  placeholder = 'Search',
  className,
  ...rest
}: {
  label?: FieldLabel
  placeholder?: string
  className?: string
} & React.ComponentProps<typeof SearchBox>) {
  const s = useStyles()
  return label ? (
    <Field label={label} className={mergeClasses(s.field, s.fullWidth, className)}>
      <SearchBox className={s.control} placeholder={placeholder} {...rest} />
    </Field>
  ) : (
    <SearchBox
      className={mergeClasses(s.control, className)}
      placeholder={placeholder}
      {...rest}
    />
  )
}

/* ─────────────────────────── Toggles ─────────────────────────── */

export function CheckboxField({
  label,
  error,
  className,
  ...rest
}: CheckboxProps & { label?: React.ReactNode; error?: string; className?: string }) {
  const s = useStyles()
  return error ? (
    <Field
      validationMessage={error}
      validationState="error"
      className={mergeClasses(s.field, className)}
    >
      <Checkbox label={label} {...rest} />
    </Field>
  ) : (
    <Checkbox className={className} label={label} {...rest} />
  )
}

export function SwitchField({
  label,
  hint,
  className,
  ...rest
}: SwitchProps & { label?: React.ReactNode; hint?: string; className?: string }) {
  const s = useStyles()
  return hint ? (
    <Field hint={hint} className={mergeClasses(s.field, className)}>
      <Switch label={label} {...rest} />
    </Field>
  ) : (
    <Switch className={className} label={label} {...rest} />
  )
}

export type RadioOption = { value: string; label: string; description?: string; disabled?: boolean }

/**
 * Radio group with an optional card treatment — the big tappable choice rows the
 * onboarding and course-selection flows use. `cards` keeps Fluent's `Radio` (and
 * therefore its roving focus and arrow-key handling) and only changes the chrome.
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
      className={mergeClasses(s.field, s.fullWidth, className)}
    >
      <RadioGroup
        value={value}
        onChange={(_, data) => onValueChange?.(data.value)}
        style={cards ? { gap: 10 } : undefined}
      >
        {options.map((o) =>
          cards ? (
            <label
              key={o.value}
              className={mergeClasses(
                s.choiceCard,
                value === o.value && s.choiceCardChecked
              )}
            >
              <Radio value={o.value} disabled={o.disabled} label={undefined} />
              <span>
                <span style={{ display: 'block', fontWeight: 500 }}>{o.label}</span>
                {o.description && (
                  <span
                    style={{
                      display: 'block',
                      fontSize: 13,
                      color: 'var(--gradly-ink-500)',
                      marginTop: 2,
                    }}
                  >
                    {o.description}
                  </span>
                )}
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
 * Slider with a live readout. Fluent's `Slider` has no built-in value display, and
 * a slider without one forces the user to guess — so the readout is part of the
 * field rather than something each page re-adds.
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
  const [internal, setInternal] = useState<number>(
    value ?? defaultValue ?? min
  )
  const current = value ?? internal

  return (
    <Field
      label={label}
      hint={hint}
      className={mergeClasses(s.field, s.fullWidth, className)}
    >
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
 * Fixed-length numeric code entry.
 *
 * Each cell is a Fluent `Input`, so focus styling and high-contrast behaviour
 * match every other field; the per-cell focus moves, backspace walk-back and
 * full-code paste are handled here.
 *
 * Deliberately NOT wrapped in `Field`: Field assigns its generated control id to
 * the input it labels, and with several inputs inside one Field all of them end up
 * sharing that id — invalid, and it breaks every `aria-describedby` pointing at it.
 * So the label and error text are rendered directly and the group is tied together
 * with `role="group"` + `aria-labelledby`, which is what a screen reader needs to
 * announce "Verification code, Digit 1 of 4".
 */
export function OTPField({
  length = 4,
  value,
  onChange,
  error,
  label,
  autoFocus = true,
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
      {label && (
        <Label id={labelId} className={s.otpLabel}>
          {label}
        </Label>
      )}
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
            className={mergeClasses(s.control, s.otpCell, error && s.otpCellError)}
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
              const pasted = ev.clipboardData
                .getData('text')
                .replace(/\D/g, '')
                .slice(0, length)
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
  Input,
  Textarea,
  Dropdown,
  Option,
  Combobox,
  SpinButton,
  Slider,
  Switch,
  Checkbox,
  Radio,
  RadioGroup,
  SearchBox,
  InfoLabel,
} from '@fluentui/react-components'
export type { FieldProps }
