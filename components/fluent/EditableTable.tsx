'use client'

import {
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Tooltip,
  makeStyles,
  mergeClasses,
  tokens,
  shorthands,
} from '@fluentui/react-components'
import { DeleteRegular, AddRegular } from '@fluentui/react-icons'
import { gradlyTokens } from '@/lib/fluent'
import { IconButton } from './Button'
import { Kicker } from './Text'

const useStyles = makeStyles({
  shell: {
    ...shorthands.border('1px', 'solid', gradlyTokens.ink100),
    borderRadius: tokens.borderRadiusXLarge,
    overflowX: 'auto',
    backgroundColor: tokens.colorNeutralBackground1,
  },
  header: { backgroundColor: gradlyTokens.ink50 },
  headerCell: { paddingTop: '10px', paddingBottom: '10px' },
  row: {
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: gradlyTokens.ink100,
  },
  cell: { paddingTop: '6px', paddingBottom: '6px', paddingLeft: '8px', paddingRight: '8px' },
  // Inputs inside a table cell: no border until focus, so a dense grid of fields
  // doesn't turn into a wall of boxes.
  cellInput: {
    width: '100%',
    minWidth: '0',
    backgroundColor: 'transparent',
    ...shorthands.borderColor('transparent'),
    borderRadius: tokens.borderRadiusMedium,
    ':hover': {
      backgroundColor: gradlyTokens.ink50,
      ...shorthands.borderColor(gradlyTokens.ink100),
    },
    ':focus-within': {
      backgroundColor: tokens.colorNeutralBackground1,
      outlineWidth: '2px',
      outlineStyle: 'solid',
      outlineColor: gradlyTokens.amber,
      outlineOffset: '0',
    },
    '::after': { display: 'none' },
  },
  numericInput: { '& input': { fontVariantNumeric: 'tabular-nums' } },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: gradlyTokens.ink100,
  },
  invalid: {
    ...shorthands.borderColor(gradlyTokens.danger),
    ':hover': { ...shorthands.borderColor(gradlyTokens.danger) },
  },
})

export type EditableColumn<T> = {
  /** Key on the row object this column edits. */
  field: keyof T & string
  header: string
  /** `number` applies tabular figures and a numeric keypad on mobile. */
  kind?: 'text' | 'number'
  width?: number | string
  placeholder?: string
  /** Return a message to mark the cell invalid. */
  validate?: (row: T) => string | undefined
}

export type EditableTableProps<T> = {
  rows: T[]
  columns: EditableColumn<T>[]
  onChange: (index: number, patch: Partial<T>) => void
  onRemove?: (index: number) => void
  onAdd?: () => void
  addLabel?: string
  /** Rendered bottom-left, e.g. a running credit total. */
  summary?: React.ReactNode
  className?: string
}

/**
 * Spreadsheet-style editable rows — the transcript course list.
 *
 * Uses Fluent's `Table` rather than `DataGrid` on purpose: `DataGrid` renders its
 * own cells and owns focus within the row, which fights with a grid of text inputs.
 * `Table` is the presentational primitive, so the inputs keep native tab order.
 */
export function EditableTable<T extends Record<string, unknown>>({
  rows,
  columns,
  onChange,
  onRemove,
  onAdd,
  addLabel = 'Add row',
  summary,
  className,
}: EditableTableProps<T>) {
  const s = useStyles()

  return (
    <div className={mergeClasses(s.shell, className)}>
      <Table size="small">
        <TableHeader className={s.header}>
          <TableRow>
            {columns.map((c) => (
              <TableHeaderCell
                key={c.field}
                className={s.headerCell}
                style={c.width ? { width: c.width } : undefined}
              >
                <Kicker>{c.header}</Kicker>
              </TableHeaderCell>
            ))}
            {onRemove && (
              <TableHeaderCell className={s.headerCell} style={{ width: 48 }}>
                <span className="sr-only" />
              </TableHeaderCell>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow key={i} className={s.row}>
              {columns.map((c) => {
                const invalid = c.validate?.(row)
                return (
                  <TableCell key={c.field} className={s.cell}>
                    <Tooltip
                      content={invalid ?? ''}
                      relationship="description"
                      visible={invalid ? undefined : false}
                      withArrow
                    >
                      <Input
                        className={mergeClasses(
                          s.cellInput,
                          c.kind === 'number' && s.numericInput,
                          invalid && s.invalid
                        )}
                        value={String(row[c.field] ?? '')}
                        placeholder={c.placeholder}
                        inputMode={c.kind === 'number' ? 'decimal' : undefined}
                        aria-label={`${c.header}, row ${i + 1}`}
                        aria-invalid={invalid ? true : undefined}
                        onChange={(_, data) =>
                          onChange(i, { [c.field]: data.value } as Partial<T>)
                        }
                      />
                    </Tooltip>
                  </TableCell>
                )
              })}
              {onRemove && (
                <TableCell className={s.cell}>
                  <Tooltip content="Remove row" relationship="label" withArrow>
                    <IconButton
                      icon={<DeleteRegular />}
                      onClick={() => onRemove(i)}
                      label={`Remove row ${i + 1}`}
                      size="sm"
                    />
                  </Tooltip>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {(onAdd || summary) && (
        <div className={s.footer}>
          <div>{summary}</div>
          {onAdd && (
            <Button appearance="subtle" icon={<AddRegular />} onClick={onAdd}>
              {addLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
