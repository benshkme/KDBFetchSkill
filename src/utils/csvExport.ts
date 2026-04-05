import type { KalturaEntry } from '../types/kaltura'

function escapeCell(value: unknown): string {
  const str = value === null || value === undefined ? '' : String(value)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export function exportToCsv(
  entries: KalturaEntry[],
  columns: string[],
  limit: number,
  filename = 'kaltura_entries.csv',
): void {
  const rows = entries.slice(0, limit)
  const header = columns.map(escapeCell).join(',')
  const body = rows
    .map((entry) => columns.map((col) => escapeCell(entry[col])).join(','))
    .join('\n')

  const csv = `${header}\n${body}`
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()

  URL.revokeObjectURL(url)
}
