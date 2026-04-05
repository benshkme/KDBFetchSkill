import { useState } from 'react'
import type { KalturaConfig } from '../types/kaltura'

interface Props {
  onFetch: (config: KalturaConfig) => void
  loading: boolean
}

export function ConfigForm({ onFetch, loading }: Props) {
  const [apiUrl, setApiUrl] = useState('https://www.kaltura.com')
  const [ks, setKs] = useState('')
  const [fetchLimit, setFetchLimit] = useState(500)
  const [csvLimit, setCsvLimit] = useState(500)
  const [csvLimitLinked, setCsvLimitLinked] = useState(true)

  function handleFetchLimitChange(val: number) {
    setFetchLimit(val)
    if (csvLimitLinked) setCsvLimit(val)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onFetch({ apiUrl, ks, fetchLimit, csvLimit })
  }

  return (
    <form className="config-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label>
          Kaltura API URL
          <input
            type="url"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            placeholder="https://www.kaltura.com"
            required
          />
        </label>
        <label>
          KS (Kaltura Session)
          <input
            type="text"
            value={ks}
            onChange={(e) => setKs(e.target.value)}
            placeholder="Kaltura session token"
            required
          />
        </label>
      </div>
      <div className="form-row">
        <label>
          Fetch Limit
          <input
            type="number"
            min={1}
            max={10000}
            value={fetchLimit}
            onChange={(e) => handleFetchLimitChange(Number(e.target.value))}
          />
        </label>
        <label className="csv-limit-label">
          CSV Export Limit
          <div className="csv-limit-row">
            <input
              type="number"
              min={1}
              max={10000}
              value={csvLimit}
              disabled={csvLimitLinked}
              onChange={(e) => setCsvLimit(Number(e.target.value))}
            />
            <label className="linked-checkbox">
              <input
                type="checkbox"
                checked={csvLimitLinked}
                onChange={(e) => {
                  setCsvLimitLinked(e.target.checked)
                  if (e.target.checked) setCsvLimit(fetchLimit)
                }}
              />
              Sync with fetch
            </label>
          </div>
        </label>
        <button type="submit" disabled={loading} className="fetch-btn">
          {loading ? 'Fetching...' : 'Fetch Entries'}
        </button>
      </div>
    </form>
  )
}
