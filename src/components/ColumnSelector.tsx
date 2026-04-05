interface Props {
  columns: string[]
  visibleColumns: string[]
  onChange: (cols: string[]) => void
  csvLimit: number
  onCsvLimitChange: (limit: number) => void
  onExport: () => void
  totalEntries: number
}

export function ColumnSelector({
  columns,
  visibleColumns,
  onChange,
  csvLimit,
  onCsvLimitChange,
  onExport,
  totalEntries,
}: Props) {
  function toggle(col: string) {
    onChange(
      visibleColumns.includes(col)
        ? visibleColumns.filter((c) => c !== col)
        : [...visibleColumns, col],
    )
  }

  function selectAll() {
    onChange([...columns])
  }

  function selectNone() {
    onChange([])
  }

  return (
    <div className="column-selector">
      <div className="column-selector-header">
        <span className="section-title">Columns</span>
        <div className="selector-actions">
          <button onClick={selectAll} className="btn-small">
            All
          </button>
          <button onClick={selectNone} className="btn-small">
            None
          </button>
        </div>
      </div>
      <div className="column-checkboxes">
        {columns.map((col) => (
          <label key={col} className="column-checkbox">
            <input
              type="checkbox"
              checked={visibleColumns.includes(col)}
              onChange={() => toggle(col)}
            />
            {col}
          </label>
        ))}
      </div>
      <div className="export-controls">
        <label className="export-limit-label">
          CSV export limit
          <input
            type="number"
            min={1}
            max={totalEntries || 10000}
            value={csvLimit}
            onChange={(e) => onCsvLimitChange(Number(e.target.value))}
          />
          <span className="limit-hint">of {totalEntries} loaded</span>
        </label>
        <button
          onClick={onExport}
          className="export-btn"
          disabled={visibleColumns.length === 0}
        >
          Export CSV ({Math.min(csvLimit, totalEntries)} rows)
        </button>
      </div>
    </div>
  )
}
