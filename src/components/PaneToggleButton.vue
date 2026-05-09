<template>
  <button
    class="pane-toggle-btn"
    :class="sizeClass"
    :title="title"
    type="button"
    @click="$emit('toggle')"
  >
    {{ collapsed ? '↦' : '↤' }}
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    collapsed: boolean
    title: string
    size?: 'sm' | 'lg'
  }>(),
  {
    size: 'sm',
  },
)

defineEmits<{
  toggle: []
}>()

const sizeClass = computed(() => `pane-toggle-btn--${props.size}`)
</script>

<style scoped>
.pane-toggle-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  z-index: 10;
  background: var(--color-primary);
  color: var(--color-white);
  opacity: 0.85;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);

  &:hover {
    opacity: 1;
    background: var(--color-primary-hover);
  }
}

.pane-toggle-btn--sm {
  font-size: 1rem;
  line-height: 1;
  padding: 0.35rem 0.55rem;
}

.pane-toggle-btn--lg {
  font-size: 2rem;
  line-height: 0.8;
  padding: 0.2rem 0.6rem 0.35rem 0.6rem;
}
</style>
