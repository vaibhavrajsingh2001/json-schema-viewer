import lzString from 'lz-string'
import type { JsonValue } from '@visual-json/core'

const HASH_PREFIX = '#schema/'

/**
 * Encodes JSON into a compact URL hash so schemas can be shared without a backend.
 */
export function encodeSchema(schema: JsonValue): string {
  return HASH_PREFIX + lzString.compressToEncodedURIComponent(JSON.stringify(schema))
}

/**
 * Decodes a schema URL hash. Returns null for unrelated, missing, or malformed hashes.
 */
export function decodeSchema(hash: string): JsonValue | null {
  if (!hash.startsWith(HASH_PREFIX)) return null

  try {
    const compressed = hash.slice(HASH_PREFIX.length)
    const json = lzString.decompressFromEncodedURIComponent(compressed)
    if (!json) return null
    return JSON.parse(json) as JsonValue
  } catch {
    console.warn('[share] Failed to decode schema from URL')
    return null
  }
}
