'use client'

import { useCallback, useRef, useState } from 'react'
import {
  Button,
  ProgressBar,
  Field,
  makeStyles,
  mergeClasses,
  tokens,
  shorthands,
  Caption1,
  Body1Strong,
} from '@fluentui/react-components'
import {
  ArrowUploadRegular,
  DocumentPdfRegular,
  ImageRegular,
  DismissRegular,
} from '@fluentui/react-icons'
import { IconButton } from './Button'
import { Body } from './Text'
import { Stack } from './Layout'

const useStyles = makeStyles({
  /**
   * Fluent has no dropzone component, so the chrome here is custom — but every
   * value comes from a Fluent token, and the interactive parts (the browse
   * button, the progress bar, the validation message) are Fluent components.
   */
  zone: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    rowGap: tokens.spacingVerticalM,
    paddingTop: tokens.spacingVerticalXXXL,
    paddingBottom: tokens.spacingVerticalXXXL,
    paddingLeft: tokens.spacingHorizontalXL,
    paddingRight: tokens.spacingHorizontalXL,
    textAlign: 'center',
    borderRadius: tokens.borderRadiusMedium,
    ...shorthands.border(tokens.strokeWidthThick, 'dashed', tokens.colorNeutralStroke2),
    backgroundColor: tokens.colorNeutralBackground2,
    cursor: 'pointer',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground2Hover,
      ...shorthands.borderColor(tokens.colorNeutralStroke1),
    },
    ':focus-visible': {
      outlineWidth: tokens.strokeWidthThick,
      outlineStyle: 'solid',
      outlineColor: tokens.colorStrokeFocus2,
      outlineOffset: '2px',
    },
  },
  dragging: {
    ...shorthands.borderColor(tokens.colorBrandStroke1),
    backgroundColor: tokens.colorBrandBackground2,
  },
  invalid: { ...shorthands.borderColor(tokens.colorPaletteRedBorder2) },
  icon: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '44px',
    height: '44px',
    borderRadius: tokens.borderRadiusCircular,
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    fontSize: tokens.fontSizeBase500,
  },
  hiddenInput: {
    position: 'absolute',
    width: '1px',
    height: '1px',
    opacity: 0,
    pointerEvents: 'none',
  },
  filecard: {
    display: 'flex',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalM,
    paddingTop: tokens.spacingVerticalM,
    paddingBottom: tokens.spacingVerticalM,
    paddingLeft: tokens.spacingHorizontalM,
    paddingRight: tokens.spacingHorizontalM,
    borderRadius: tokens.borderRadiusMedium,
    ...shorthands.border(tokens.strokeWidthThin, 'solid', tokens.colorNeutralStroke2),
    backgroundColor: tokens.colorNeutralBackground1,
  },
  fileIcon: { fontSize: tokens.fontSizeBase600, color: tokens.colorBrandForeground1, flexShrink: 0 },
  fileMeta: { minWidth: 0, flexGrow: 1 },
  fileName: {
    whiteSpace: 'nowrap',
    overflowX: 'hidden',
    textOverflow: 'ellipsis',
  },
})

const DEFAULT_ACCEPT = ['application/pdf', 'image/jpeg', 'image/png']

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export type FileDropzoneProps = {
  onFile: (file: File) => void
  onClear?: () => void
  /** MIME types. Defaults to PDF/JPEG/PNG — what the transcript parser accepts. */
  accept?: string[]
  maxBytes?: number
  file?: File | null
  /** 0–100 while uploading; omit when idle. */
  progress?: number
  hint?: string
  disabled?: boolean
  className?: string
}

/**
 * Drag-and-drop file input.
 *
 * Fluent has no dropzone component, so this is composed from Fluent parts
 * (`Button`, `ProgressBar`, `Field`) over a hidden native file input. The native
 * input stays in the DOM and keeps its label association, which is what makes the
 * zone keyboard- and screen-reader-operable rather than mouse-only.
 *
 * Validation (type + size) happens here so the caller gets either a usable `File`
 * or a visible error, never a silent no-op.
 */
export function FileDropzone({
  onFile,
  onClear,
  accept = DEFAULT_ACCEPT,
  maxBytes = 10 * 1024 * 1024,
  file,
  progress,
  hint,
  disabled = false,
  className,
}: FileDropzoneProps) {
  const s = useStyles()
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState<string | undefined>()

  const validate = useCallback(
    (f: File): string | undefined => {
      if (accept.length && !accept.includes(f.type)) {
        const names = accept
          .map((a) => a.split('/')[1]?.toUpperCase().replace('JPEG', 'JPG'))
          .join(', ')
        return `That's a ${f.type || 'unknown'} file. Use ${names}.`
      }
      if (f.size > maxBytes) {
        return `That file is ${formatBytes(f.size)}. The limit is ${formatBytes(maxBytes)}.`
      }
      return undefined
    },
    [accept, maxBytes]
  )

  const handleFiles = useCallback(
    (files: FileList | null) => {
      const f = files?.[0]
      if (!f) return
      const problem = validate(f)
      setError(problem)
      if (!problem) onFile(f)
    },
    [onFile, validate]
  )

  if (file) {
    const isPdf = file.type === 'application/pdf'
    return (
      <Stack gap={10} className={className}>
        <div className={s.filecard}>
          <span className={s.fileIcon}>
            {isPdf ? <DocumentPdfRegular /> : <ImageRegular />}
          </span>
          <div className={s.fileMeta}>
            <Body1Strong className={s.fileName} block>{file.name}</Body1Strong>
            <Caption1>{formatBytes(file.size)}</Caption1>
          </div>
          {onClear && (
            <IconButton icon={<DismissRegular />} onClick={onClear} label="Remove file" />
          )}
        </div>
        {typeof progress === 'number' && (
          <ProgressBar value={progress / 100} thickness="large" />
        )}
      </Stack>
    )
  }

  return (
    <Field
      validationMessage={error}
      validationState={error ? 'error' : 'none'}
      hint={error ? undefined : hint}
      className={className}
    >
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        className={mergeClasses(
          s.zone,
          dragging && s.dragging,
          error && s.invalid
        )}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(ev) => {
          if (disabled) return
          if (ev.key === 'Enter' || ev.key === ' ') {
            ev.preventDefault()
            inputRef.current?.click()
          }
        }}
        onDragOver={(ev) => {
          ev.preventDefault()
          if (!disabled) setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(ev) => {
          ev.preventDefault()
          setDragging(false)
          if (!disabled) handleFiles(ev.dataTransfer.files)
        }}
      >
        <span className={s.icon} aria-hidden>
          <ArrowUploadRegular />
        </span>
        <Body1Strong>Drop your transcript here</Body1Strong>
        <Body muted>PDF, JPG or PNG · up to {formatBytes(maxBytes)}</Body>
        <input
          ref={inputRef}
          type="file"
          className={s.hiddenInput}
          accept={accept.join(',')}
          disabled={disabled}
          onChange={(ev) => handleFiles(ev.target.files)}
          tabIndex={-1}
        />
      </div>
    </Field>
  )
}
