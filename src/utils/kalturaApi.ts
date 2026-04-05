import type { KalturaListResponse } from '../types/kaltura'

// apiAction should be in "service/action" format, e.g. "flavorParams/list"
export async function fetchKalturaEntries(
  apiUrl: string,
  apiAction: string,
  ks: string,
  pageSize: number,
  pageIndex: number,
): Promise<KalturaListResponse> {
  const base = apiUrl.replace(/\/$/, '')
  const [service, action] = apiAction.split('/')
  const url = `${base}/api_v3/service/${service}/action/${action}`

  const params = new URLSearchParams({
    ks,
    format: '1',
    'pager[pageSize]': String(pageSize),
    'pager[pageIndex]': String(pageIndex),
  })

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  })

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
