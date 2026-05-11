<template>
  <nav class="toolbar" aria-label="Application toolbar">
    <h1>JSON Schema Viewer</h1>
    <div class="toolbar-actions">
      <button
        class="tool-btn"
        title="Open settings"
        type="button"
        aria-label="Open settings"
        @click="onOpenSettings"
      >
        <IconSettings class="app-icon" aria-hidden="true" />
      </button>
      <button
        class="tool-btn share-btn"
        title="Copy share link"
        type="button"
        aria-label="Copy share link"
        @click="onShare"
      >
        <IconShare2 class="app-icon" aria-hidden="true" />
        <span>Share</span>
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import type { ShareResult } from '@/types'
import IconSettings from '~icons/lucide/settings'
import IconShare2 from '~icons/lucide/share-2'

defineProps<{
  onShare: () => void | ShareResult | Promise<void | ShareResult>
  onOpenSettings: () => void
}>()
</script>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--color-app-primary);
  color: var(--color-app-on-primary);
  min-height: var(--navbar-height);
  padding: 0.5rem 1rem;
  gap: 1rem;

  h1 {
    font-family: var(--font-sans);
    font-size: clamp(1rem, 2vw, 1.45rem);
    font-weight: 700;
    line-height: 1.1;
    margin: 0;
  }
}

.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.tool-btn {
  background: var(--color-app-surface);
  color: var(--color-app-primary);
  font-size: 0.9rem;
  min-height: 36px;
  min-width: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  font-weight: 500;
  padding: 0.3rem 0.65rem;

  .app-icon {
    font-size: 1rem;
  }

  &:hover {
    background: var(--color-app-surface-raised);
    box-shadow: var(--shadow-app-sm);
  }
}

.share-btn {
  min-width: auto;
  padding-inline: 0.8rem;
}

@media (max-width: 520px) {
  .toolbar {
    align-items: flex-start;
    flex-direction: column;
  }

  .toolbar-actions {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
