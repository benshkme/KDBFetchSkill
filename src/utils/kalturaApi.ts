import type { KalturaListResponse } from '../types/kaltura'

export async function fetchKalturaEntries(
  apiUrl: string,
  ks: string,
  pageSize: number,
  pageIndex: number,
): Promise<KalturaListResponse> {
  const base = apiUrl.replace(/\/$/, '')
  const url = `${base}/api_v3/service/baseEntry/action/list`

  const params = new URLSearchParams({
    ks,
    format: '1',
    'pager[pageSize]': String(pageSize),
    'pager[pageIndex]': String(pageIndex),
  })

  const response = await fetch(`${url}?${params.toString()}`)

  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}: ${response.statusText}`)
  }

  const data = await response.json()

  if (data.code && data.message) {
    throw new Error(`Kaltura API error [${data.code}]: ${data.message}`)
  }

  return {
    objects: Array.isArray(data.objects) ? data.objects : [],
    totalCount: typeof data.totalCount === 'number' ? data.totalCount : 0,
  }
}
