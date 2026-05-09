<template>
  <label class="theme-picker">
    <span>Theme</span>
    <select v-model="currentTheme" aria-label="Theme">
      <option v-for="theme in themeOptions" :key="theme.id" :value="theme.id">
        {{ theme.label }}
      </option>
    </select>
  </label>
</template>

<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'

const { currentTheme, themeOptions } = useTheme()
</script>

<style scoped>
.theme-picker {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--color-app-on-primary);
  font-size: 0.85rem;
  font-weight: 500;

  select {
    appearance: none;
    background: var(--color-app-surface);
    border: 1px solid var(--color-app-border);
    border-radius: 6px;
    color: var(--color-app-text);
    cursor: pointer;
    font: inherit;
    min-width: 7rem;
    padding: 0.25rem 1.8rem 0.25rem 0.65rem;
    /* Draw a small chevron with CSS so the native select remains easy to theme. */
    background-image:
      linear-gradient(45deg, transparent 50%, currentColor 50%),
      linear-gradient(135deg, currentColor 50%, transparent 50%);
    background-position:
      calc(100% - 13px) 50%,
      calc(100% - 8px) 50%;
    background-size:
      5px 5px,
      5px 5px;
    background-repeat: no-repeat;
  }
}
</style>
