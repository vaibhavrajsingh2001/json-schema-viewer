<template>
  <nav class="toolbar" aria-label="Application toolbar">
    <div class="brand">
      <h1>JSON Schema Viewer</h1>
    </div>

    <div class="toolbar-actions">
      <button
        class="tool-btn"
        type="button"
        :aria-pressed="issuesOpen"
        :class="{ 'tool-btn--active': issuesOpen }"
        @click="onToggleIssues"
      >
        <IconListChecks class="app-icon" aria-hidden="true" />
        <span>Issues</span>
        <strong v-if="summary.issueCount">{{ summary.issueCount }}</strong>
      </button>
      <button
        class="icon-btn"
        title="Open settings"
        type="button"
        aria-label="Open settings"
        @click="onOpenSettings"
      >
        <IconSettings class="app-icon" aria-hidden="true" />
      </button>
      <button class="tool-btn share-btn" type="button" aria-label="Copy share link" @click="onShare">
        <IconShare2 class="app-icon" aria-hidden="true" />
        <span>Share</span>
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import type { SchemaDiagnosticsSummary, ShareResult } from '@/types'
import IconListChecks from '~icons/lucide/list-checks'
import IconSettings from '~icons/lucide/settings'
import IconShare2 from '~icons/lucide/share-2'

defineProps<{
  summary: SchemaDiagnosticsSummary
  issuesOpen: boolean
  onShare: () => void | ShareResult | Promise<void | ShareResult>
  onOpenSettings: () => void
  onToggleIssues: () => void
}>()
</script>

<style scoped>
.toolbar {
  align-items: center;
  background: var(--color-app-surface) !important;
  border-bottom: 1px solid var(--color-app-border);
  color: var(--color-app-text) !important;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  min-height: 56px;
  padding: 0.55rem 0.75rem;
}

.brand {
  align-items: center;
  display: flex;
  gap: 0.75rem;
  min-width: 0;

  h1 {
    font-size: 1rem;
    font-weight: 800;
    line-height: 1.1;
    margin: 0;
    white-space: nowrap;
  }
}

.toolbar-actions {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: flex-end;
}

.tool-btn,
.icon-btn {
  align-items: center;
  background: var(--color-app-surface-raised);
  border-color: var(--color-app-border);
  color: var(--color-app-text);
  display: inline-flex;
  font-size: 0.88rem;
  gap: 0.4rem;
  justify-content: center;
  min-height: 38px;
}

.tool-btn {
  padding: 0.3rem 0.7rem;

  strong {
    align-items: center;
    background: var(--color-app-accent-soft);
    border-radius: 999px;
    color: var(--color-app-accent);
    display: inline-flex;
    font-size: 0.72rem;
    font-weight: 800;
    justify-content: center;
    min-height: 1.25rem;
    min-width: 1.25rem;
    padding: 0 0.3rem;
  }
}

.icon-btn {
  min-width: 38px;
}

.tool-btn--active {
  border-color: var(--color-app-accent);
  color: var(--color-app-accent);
}

.share-btn {
  background: var(--color-app-accent);
  border-color: var(--color-app-accent);
  color: var(--theme-on-accent);
}

.app-icon {
  font-size: 1rem;
}

@media (max-width: 700px) {
  .toolbar {
    align-items: stretch;
    flex-direction: column;
  }

  .brand,
  .toolbar-actions {
    justify-content: space-between;
    width: 100%;
  }

  .toolbar-actions {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .tool-btn,
  .icon-btn {
    min-width: 0;
  }
}
</style>
