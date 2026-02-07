import { ref } from 'vue'

const isVisible = ref(false)
const message = ref('')
let timeoutId: ReturnType<typeof setTimeout> | null = null

export function useToast() {
  function show(msg: string, duration = 3000) {
    message.value = msg
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
    show
  }
}
