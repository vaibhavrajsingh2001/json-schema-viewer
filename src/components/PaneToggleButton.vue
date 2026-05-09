<template>
  <button
    class="pane-toggle-btn"
    :class="sizeClass"
    :title="title"
    type="button"
    @click="$emit('toggle')"
  >
    <component :is="toggleIcon" class="app-icon" aria-hidden="true" />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import IconPanelLeftClose from '~icons/lucide/panel-left-close'
import IconPanelLeftOpen from '~icons/lucide/panel-left-open'

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
const toggleIcon = computed(() => (props.collapsed ? IconPanelLeftOpen : IconPanelLeftClose))
</script>

<style scoped>
.pane-toggle-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  z-index: 10;
  background: var(--color-app-primary);
  color: var(--color-app-on-primary);
  opacity: 0.85;
  box-shadow: var(--shadow-app-sm);
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 1;
    background: var(--color-app-primary-hover);
  }
}

.pane-toggle-btn--sm {
  font-size: 1rem;
  padding: 0.4rem;
}

.pane-toggle-btn--lg {
  font-size: 1.5rem;
  padding: 0.55rem;
}
</style>
