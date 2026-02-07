import lzString from 'lz-string'

const HASH_PREFIX = '#schema/'

export function encodeSchema(schema: Record<string, unknown>): string {
  return HASH_PREFIX + lzString.compressToEncodedURIComponent(JSON.stringify(schema))
}

export function decodeSchema(hash: string): Record<string, unknown> | null {
  if (!hash.startsWith(HASH_PREFIX)) return null

  try {
    const compressed = hash.slice(HASH_PREFIX.length)
    const json = lzString.decompressFromEncodedURIComponent(compressed)
    if (!json) return null
    return JSON.parse(json) as Record<string, unknown>
  } catch {
    console.warn('[share] Failed to decode schema from URL')
    return null
  }
}
