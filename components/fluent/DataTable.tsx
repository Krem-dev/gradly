'use client'

import {
  DataGrid,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridBody,
  DataGridRow,
  DataGridCell,
  TableCellLayout,
  createTableColumn,
  Skeleton,
  SkeletonItem,
  makeStyles,
  mergeClasses,
  shorthands,
  tokens,
  type TableColumnDefinition,
  type DataGridProps,
} from '@fluentui/react-components'
import { EmptyState } from './Card'
import { Stack } from './Layout'

const useStyles = makeStyles({
  // The only styling here is a scroll container. Fluent's DataGrid has no
  // built-in overflow handling, and a wide table must scroll inside its own
  // box rather than widening the page.
  shell: {
    ...shorthands.border(tokens.strokeWidthThin, 'solid', tokens.colorNeutralStroke2),
    borderRadius: tokens.borderRadiusMedium,
    overflowX: 'auto',
    backgroundColor: tokens.colorNeutralBackground1,
  },
  grid: { minWidth: '100%' },
  numeric: { fontVariantNumeric: 'tabular-nums' },
  skeletonRow: {
    paddingTop: tokens.spacingVerticalM,
    paddingBottom: tokens.spacingVerticalM,
    paddingLeft: tokens.spacingHorizontalM,
    paddingRight: tokens.spacingHorizontalM,
  },
})

export type DataTableColumn<T> = {
  /** Stable key. Also the sort key when `compare` is supplied. */
  id: string
  header: React.ReactNode
  render: (item: T) => React.ReactNode
  /** Supply to make the column sortable. */
  compare?: (a: T, b: T) => number
  /** Fixed/ideal width in px. Omit to let the column flex. */
  width?: number
  minWidth?: number
  /** Right-aligns and applies tabular figures. */
  numeric?: boolean
}

export type DataTableProps<T> = {
  items: T[]
  columns: DataTableColumn<T>[]
  getRowId: (item: T) => string
  sortable?: boolean
  resizable?: boolean
  selectionMode?: DataGridProps['selectionMode']
  onSelectionChange?: DataGridProps['onSelectionChange']
  loading?: boolean
  /** Rendered in place of the grid when `items` is empty and not loading. */
  empty?: React.ReactNode
  className?: string
}

/**
 * Generic table built on Fluent's `DataGrid`.
 *
 * `DataGrid` brings sorting, resizable columns, selection, keyboard navigation and
 * the correct ARIA grid roles. The cost is a verbose render-prop shape repeated at
 * every call site, so this wrapper takes a flat column array instead and keeps the
 * render props in one place.
 *
 * Reach for Fluent's `Table` directly when a layout needs full control over cell
 * markup (the editable course rows do exactly that) — `DataGrid` owns its cells.
 */
export function DataTable<T>({
  items,
  columns,
  getRowId,
  sortable = false,
  resizable = false,
  selectionMode,
  onSelectionChange,
  loading = false,
  empty,
  className,
}: DataTableProps<T>) {
  const s = useStyles()

  const gridColumns: TableColumnDefinition<T>[] = columns.map((c) =>
    createTableColumn<T>({
      columnId: c.id,
      renderHeaderCell: () => c.header,
      renderCell: (item) => (
        <TableCellLayout className={c.numeric ? s.numeric : undefined}>
          {c.render(item)}
        </TableCellLayout>
      ),
      ...(c.compare ? { compare: c.compare } : {}),
    })
  )

  const columnSizingOptions = Object.fromEntries(
    columns
      .filter((c) => c.width || c.minWidth)
      .map((c) => [
        c.id,
        {
          ...(c.width ? { idealWidth: c.width } : {}),
          ...(c.minWidth ? { minWidth: c.minWidth } : {}),
        },
      ])
  )

  if (loading) {
    return (
      <div className={mergeClasses(s.shell, className)}>
        <Skeleton>
          <Stack gap={0}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={s.skeletonRow}>
                <SkeletonItem size={16} />
              </div>
            ))}
          </Stack>
        </Skeleton>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className={mergeClasses(s.shell, className)}>
        {empty ?? <EmptyState title="Nothing here yet" />}
      </div>
    )
  }

  return (
    <div className={mergeClasses(s.shell, className)}>
      <DataGrid
        items={items}
        columns={gridColumns}
        getRowId={getRowId}
        sortable={sortable}
        resizableColumns={resizable}
        selectionMode={selectionMode}
        onSelectionChange={onSelectionChange}
        columnSizingOptions={columnSizingOptions}
        className={s.grid}
      >
        <DataGridHeader>
          <DataGridRow>
            {({ renderHeaderCell }) => (
              <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
            )}
          </DataGridRow>
        </DataGridHeader>
        <DataGridBody<T>>
          {({ item, rowId }) => (
            <DataGridRow<T> key={rowId}>
              {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
            </DataGridRow>
          )}
        </DataGridBody>
      </DataGrid>
    </div>
  )
}

export {
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  TableCellLayout,
  DataGrid,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridBody,
  DataGridRow,
  DataGridCell,
  createTableColumn,
  Skeleton,
  SkeletonItem,
} from '@fluentui/react-components'
export type { TableColumnDefinition }
