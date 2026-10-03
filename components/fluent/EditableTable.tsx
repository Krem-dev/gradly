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
  shorthands,
  tokens,
} from '@fluentui/react-components'
import { DeleteRegular, AddRegular } from '@fluentui/react-icons'
import { IconButton } from './Button'
import { Caption1 } from '@fluentui/react-components'

const useStyles = makeStyles({
  shell: {
    ...shorthands.border(tokens.strokeWidthThin, 'solid', tokens.colorNeutralStroke2),
    borderRadius: tokens.borderRadiusMedium,
    overflowX: 'auto',
    backgroundColor: tokens.colorNeutralBackground1,
  },
  cell: {
    paddingTop: tokens.spacingVerticalXXS,
    paddingBottom: tokens.spacingVerticalXXS,
    paddingLeft: tokens.spacingHorizontalXS,
    paddingRight: tokens.spacingHorizontalXS,
  },
  /**
   * Inputs inside a table cell use Fluent's `transparent` appearance so a dense
   * grid of fields does not read as a wall of boxes; the focus indicator is
   * still Fluent's.
   */
  cellInput: { width: '100%', minWidth: 0 },
  numericInput: { '& input': { fontVariantNumeric: 'tabular-nums' } },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: tokens.spacingVerticalM,
    paddingBottom: tokens.spacingVerticalM,
    paddingLeft: tokens.spacingHorizontalM,
    paddingRight: tokens.spacingHorizontalM,
    borderTopWidth: tokens.strokeWidthThin,
    borderTopStyle: 'solid',
    borderTopColor: tokens.colorNeutralStroke2,
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
        <TableHeader>
          <TableRow>
            {columns.map((c) => (
              <TableHeaderCell
                key={c.field}
                style={c.width ? { width: c.width } : undefined}
              >
                <Caption1>{c.header}</Caption1>
              </TableHeaderCell>
            ))}
            {onRemove && (
              <TableHeaderCell style={{ width: 48 }}>
                <span className="sr-only" />
              </TableHeaderCell>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow key={i}>
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
                        appearance="underline"
                        className={mergeClasses(
                          s.cellInput,
                          c.kind === 'number' && s.numericInput
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
                      size="small"
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
