import type { KalturaEntry } from '../types/kaltura'
import { Pagination } from './Pagination'

const PAGE_SIZE = 100

interface Props {
  entries: KalturaEntry[]
  columns: string[]
  visibleColumns: string[]
  page: number
  onPageChange: (page: number) => void
}

export function DataTable({
  entries,
  columns,
  visibleColumns,
  page,
  onPageChange,
}: Props) {
  const totalPages = Math.ceil(entries.length / PAGE_SIZE)
  const start = (page - 1) * PAGE_SIZE
  const pageEntries = entries.slice(start, start + PAGE_SIZE)

  const shownCols = columns.filter((c) => visibleColumns.includes(c))

  return (
    <div className="table-wrapper">
      <div className="table-meta">
        Showing {start + 1}–{Math.min(start + PAGE_SIZE, entries.length)} of{' '}
        {entries.length} entries
      </div>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              {shownCols.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageEntries.map((entry, i) => (
              <tr key={String(entry.id ?? i)}>
                {shownCols.map((col) => (
                  <td key={col}>
                    {entry[col] === null || entry[col] === undefined
                      ? ''
                      : String(entry[col])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  )
}
