import { shallowRef } from 'vue'
import type { JsonValue } from '@visual-json/core'
import { encodeSchema, decodeSchema } from '@/utils/share'

/**
 * Owns the editable JSON state and keeps share-link behavior close to that state.
 */
export function useShareableJson(initialValue: JsonValue, onShare?: (message: string) => void) {
  // URL state wins on first load; otherwise the bundled sample schema is used.
  const jsonContent = shallowRef<JsonValue>(decodeSchema(window.location.hash) ?? initialValue)

  /**
   * Copies the current JSON as a shareable URL and updates the address bar.
   */
  async function share() {
    const hash = encodeSchema(jsonContent.value)
    const url = `${window.location.origin}${window.location.pathname}${hash}`

    try {
      await navigator.clipboard.writeText(url)
      // Keep the visible URL in sync with the copied link without causing navigation.
      window.history.replaceState(null, '', hash)
      onShare?.('Copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy to clipboard', err)
    }
  }

  return {
    jsonContent,
    share,
  }
}
