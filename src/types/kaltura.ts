export interface KalturaConfig {
  apiUrl: string
  ks: string
  fetchLimit: number
  csvLimit: number
}

export interface KalturaEntry {
  [key: string]: unknown
}

export interface KalturaListResponse {
  objects: KalturaEntry[]
  totalCount: number
}
