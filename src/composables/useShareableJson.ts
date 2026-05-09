import { shallowRef } from 'vue'
import type { JsonValue } from '@visual-json/core'
import type { ShareResult } from '@/types'
import { encodeSchema, decodeSchemaHash } from '@/utils/share'

type ShareToast = (
  message: string,
  variant?: 'success' | 'error' | 'info',
  duration?: number,
) => void

/**
 * Owns the editable JSON state and keeps share-link behavior close to that state.
 */
export function useShareableJson(initialValue: JsonValue, onShare?: ShareToast) {
  const decodedHash = decodeSchemaHash(window.location.hash)

  // URL state wins on first load; otherwise the bundled sample schema is used.
  const jsonContent = shallowRef<JsonValue>(decodedHash.schema ?? initialValue)
  const hasMalformedSharedHash = shallowRef(decodedHash.malformed)

  /**
   * Copies the current JSON as a shareable URL and updates the address bar.
   */
  async function share(): Promise<ShareResult> {
    const hash = encodeSchema(jsonContent.value)
    const url = `${window.location.origin}${window.location.pathname}${hash}`
    // Keep the visible URL in sync with the generated link even if clipboard access fails.
    window.history.replaceState(null, '', hash)

    try {
      await navigator.clipboard.writeText(url)
      onShare?.('Copied share URL to clipboard.', 'success')
      return {
        ok: true,
        url,
      }
    } catch (err) {
      console.error('Failed to copy to clipboard', err)
      const reason =
        'Clipboard access failed. The share URL is now in the address bar for manual copy.'
      onShare?.(reason, 'error', 6000)
      return {
        ok: false,
        url,
        reason,
      }
    }
  }

  return {
    jsonContent,
    hasMalformedSharedHash,
    share,
  }
}
