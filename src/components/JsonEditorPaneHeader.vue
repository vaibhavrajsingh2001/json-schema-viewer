<template>
  <header class="editor-header">
    <div class="editor-title">
      <p>Schema</p>
      <h2>Editor</h2>
    </div>

    <div class="editor-controls" aria-label="Schema editor controls">
      <div class="segmented-control" role="group" aria-label="Editor mode">
        <button
          type="button"
          :class="{ 'is-active': viewMode === 'tree' }"
          :aria-pressed="viewMode === 'tree'"
          @click="viewMode = 'tree'"
        >
          Tree
        </button>
        <button
          type="button"
          :class="{ 'is-active': viewMode === 'raw' }"
          :aria-pressed="viewMode === 'raw'"
          @click="viewMode = 'raw'"
        >
          Raw
        </button>
      </div>

      <button
        v-if="showSidebarToggle"
        class="icon-btn"
        type="button"
        title="Toggle outline"
        aria-label="Toggle outline"
        :aria-pressed="sidebarOpen"
        @click="sidebarOpen = !sidebarOpen"
      >
        <IconPanelLeft class="app-icon" aria-hidden="true" />
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { JsonEditorViewMode } from '@/types'
import IconPanelLeft from '~icons/lucide/panel-left'

const { showSidebarToggle = true } = defineProps<{
  showSidebarToggle?: boolean
}>()

const viewMode = defineModel<JsonEditorViewMode>('viewMode', { required: true })
const sidebarOpen = defineModel<boolean>('sidebarOpen', { default: false })
</script>

<style scoped>
.editor-header {
  align-items: center;
  background: var(--color-app-surface);
  border-bottom: 1px solid var(--color-app-border-subtle);
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  min-height: 56px;
  padding: 0.55rem 0.75rem;
}

.editor-title {
  display: grid;
  gap: 0.1rem;
  min-width: 0;

  p {
    color: var(--color-app-text-muted);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0;
    line-height: 1;
    margin: 0;
    text-transform: uppercase;
  }

  h2 {
    font-size: 0.98rem;
    font-weight: 700;
    line-height: 1.15;
    margin: 0;
  }
}

.editor-controls {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  justify-content: flex-end;
}

.segmented-control {
  background: var(--color-app-surface-raised);
  border: 1px solid var(--color-app-border);
  border-radius: 7px;
  display: grid;
  grid-template-columns: repeat(2, minmax(3.2rem, 1fr));
  min-height: 36px;
  overflow: hidden;

  button {
    border: 0;
    border-radius: 0;
    color: var(--color-app-text-muted);
    min-height: 34px;
    padding: 0 0.65rem;
  }

  .is-active {
    background: var(--color-app-accent);
    color: var(--theme-on-accent);
    font-weight: 700;
  }
}

.icon-btn {
  align-items: center;
  background: var(--color-app-surface-raised);
  border-color: var(--color-app-border);
  display: inline-flex;
  justify-content: center;
  min-height: 36px;
}

.icon-btn {
  min-width: 36px;
}

.app-icon {
  font-size: 1rem;
}

@media (max-width: 560px) {
  .editor-header {
    align-items: stretch;
    flex-direction: column;
  }

  .editor-controls {
    justify-content: flex-start;
  }
}
</style>
