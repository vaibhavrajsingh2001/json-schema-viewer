<template>
  <Transition name="fade">
    <span
      v-if="isVisible"
      class="toast"
      :class="`toast--${variant}`"
      :role="variant === 'error' ? 'alert' : 'status'"
      aria-live="polite"
    >
      <component :is="toastIcon" class="app-icon" aria-hidden="true" />
      <span>{{ message }}</span>
    </span>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useToast } from '@/composables/useToast'
import IconCircleCheck from '~icons/lucide/circle-check'
import IconCircleAlert from '~icons/lucide/circle-alert'
import IconInfo from '~icons/lucide/info'

const { isVisible, message, variant } = useToast()

const toastIcon = computed(() => {
  if (variant.value === 'error') return IconCircleAlert
  if (variant.value === 'success') return IconCircleCheck
  return IconInfo
})
</script>

<style scoped>
.toast {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-app-status-bg);
  color: var(--color-app-status-text);
  padding: 0.6rem 1.4rem;
  border: 1px solid var(--color-app-status-border);
  border-radius: 8px;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.45rem;
  box-shadow: var(--shadow-app-md);
  z-index: 1000;
  pointer-events: none;

  .app-icon {
    font-size: 1rem;
  }
}

.toast--success {
  --color-app-status-bg: var(--color-app-success-bg);
  --color-app-status-border: var(--color-app-success-border);
  --color-app-status-text: var(--color-app-success-text);
}

.toast--error {
  --color-app-status-bg: var(--color-app-error-bg);
  --color-app-status-border: var(--color-app-error-border);
  --color-app-status-text: var(--color-app-error-text);
}

.toast--info {
  --color-app-status-bg: var(--color-app-info-bg);
  --color-app-status-border: var(--color-app-info-border);
  --color-app-status-text: var(--color-app-info-text);
}

.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.3s,
    transform 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translate(-50%, 1rem);
}

@media (prefers-reduced-motion: reduce) {
  .fade-enter-active,
  .fade-leave-active {
    transition: none;
  }
}
</style>
