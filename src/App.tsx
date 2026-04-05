import { useState } from 'react'
import type { KalturaConfig, KalturaEntry } from './types/kaltura'
import { fetchKalturaEntries } from './utils/kalturaApi'
import { exportToCsv } from './utils/csvExport'
import { ConfigForm } from './components/ConfigForm'
import { DataTable } from './components/DataTable'
import { ColumnSelector } from './components/ColumnSelector'

function deriveColumns(entries: KalturaEntry[]): string[] {
  const keySet = new Set<string>()
  for (const entry of entries) {
    for (const key of Object.keys(entry)) {
      keySet.add(key)
    }
  }
  return Array.from(keySet)
}

export default function App() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [entries, setEntries] = useState<KalturaEntry[]>([])
  const [columns, setColumns] = useState<string[]>([])
  const [visibleColumns, setVisibleColumns] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [csvLimit, setCsvLimit] = useState(500)

  async function handleFetch(config: KalturaConfig) {
    setLoading(true)
    setError(null)
    setEntries([])
    setColumns([])
    setVisibleColumns([])
    setPage(1)
    setCsvLimit(config.csvLimit)

    try {
      const allEntries: KalturaEntry[] = []
      const pageSize = 500
      let pageIndex = 1

      while (allEntries.length < config.fetchLimit) {
        const remaining = config.fetchLimit - allEntries.length
        const batchSize = Math.min(pageSize, remaining)
        const result = await fetchKalturaEntries(
          config.apiUrl,
          config.apiAction,
          config.ks,
          batchSize,
          pageIndex,
        )

        allEntries.push(...result.objects)

        if (allEntries.length >= result.totalCount || result.objects.length < batchSize) {
          break
        }

        pageIndex++
      }

      const cols = deriveColumns(allEntries)
      setEntries(allEntries)
      setColumns(cols)
      setVisibleColumns(cols)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  function handleExport() {
    exportToCsv(entries, visibleColumns, csvLimit)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>KDB Fetch Skill</h1>
        <p className="subtitle">Kaltura API Browser &amp; Exporter</p>
      </header>

      <main className="app-main">
        <ConfigForm onFetch={handleFetch} loading={loading} />

        {loading && (
          <div className="status-bar loading">Fetching from Kaltura API...</div>
        )}
        {error && <div className="status-bar error">Error: {error}</div>}

        {entries.length > 0 && (
          <div className="results-layout">
            <ColumnSelector
              columns={columns}
              visibleColumns={visibleColumns}
              onChange={setVisibleColumns}
              csvLimit={csvLimit}
              onCsvLimitChange={setCsvLimit}
              onExport={handleExport}
              totalEntries={entries.length}
            />
            <DataTable
              entries={entries}
              columns={columns}
              visibleColumns={visibleColumns}
              page={page}
              onPageChange={setPage}
            />
          </div>
        )}
      </main>
    </div>
  )
}
