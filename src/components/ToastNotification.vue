<template>
  <Transition name="fade">
    <span v-if="isVisible" class="toast">{{ message }}</span>
  </Transition>
</template>

<script setup lang="ts">
import { useToast } from '@/composables/useToast'

const { isVisible, message } = useToast()
</script>

<style scoped>
.toast {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-primary);
  color: var(--color-white);
  padding: 0.6rem 1.4rem;
  border-radius: 20px;
  font-size: 0.95rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  pointer-events: none;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translate(-50%, 1rem);
}
</style>
