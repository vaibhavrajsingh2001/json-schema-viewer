import lzString from 'lz-string'
import type { JsonValue } from '@visual-json/core'

const HASH_PREFIX = '#schema/'

export interface DecodeSchemaResult {
  schema: JsonValue | null
  malformed: boolean
}

/**
 * Encodes JSON into a compact URL hash so schemas can be shared without a backend.
 */
export function encodeSchema(schema: JsonValue): string {
  return HASH_PREFIX + lzString.compressToEncodedURIComponent(JSON.stringify(schema))
}

/**
 * Decodes a schema URL hash and reports whether a matching hash was malformed.
 */
export function decodeSchemaHash(hash: string): DecodeSchemaResult {
  if (!hash.startsWith(HASH_PREFIX)) {
    return {
      schema: null,
      malformed: false,
    }
  }

  try {
    const compressed = hash.slice(HASH_PREFIX.length)
    const json = lzString.decompressFromEncodedURIComponent(compressed)
    if (!json) {
      return {
        schema: null,
        malformed: true,
      }
    }

    return {
      schema: JSON.parse(json) as JsonValue,
      malformed: false,
    }
  } catch {
    console.warn('[share] Failed to decode schema from URL')
    return {
      schema: null,
      malformed: true,
    }
  }
}

/**
 * Decodes a schema URL hash. Returns null for unrelated, missing, or malformed hashes.
 */
export function decodeSchema(hash: string): JsonValue | null {
  return decodeSchemaHash(hash).schema
}
