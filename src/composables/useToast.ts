import { shallowRef } from 'vue'
import type { ToastVariant } from '@/types'

const isVisible = shallowRef(false)
const message = shallowRef('')
const variant = shallowRef<ToastVariant>('info')
let timeoutId: ReturnType<typeof setTimeout> | null = null

export function useToast() {
  function show(msg: string, nextVariant: ToastVariant = 'info', duration = 3000) {
    message.value = msg
    variant.value = nextVariant
    isVisible.value = true

    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      isVisible.value = false
      timeoutId = null
    }, duration)
  }

  return {
    isVisible,
    message,
    variant,
    show,
  }
}
