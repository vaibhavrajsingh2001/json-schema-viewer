<template>
  <aside class="issues-panel" aria-labelledby="issues-heading">
    <header class="issues-header">
      <div>
        <p>{{ summary.detail }}</p>
        <h2 id="issues-heading">Issues</h2>
      </div>
      <button class="icon-btn" type="button" aria-label="Close issues" @click="emit('close')">
        <IconX class="app-icon" aria-hidden="true" />
      </button>
    </header>

    <ul v-if="diagnostics.length" class="issues-list" aria-label="Schema diagnostics">
      <li
        v-for="diagnostic in diagnostics"
        :key="diagnostic.id"
        class="issue"
        :class="`issue--${diagnostic.severity}`"
      >
        <button class="issue-main" type="button" @click="emit('focusIssue', diagnostic)">
          <component :is="iconFor(diagnostic.severity)" class="app-icon" aria-hidden="true" />
          <span class="issue-copy">
            <strong>{{ diagnostic.title }}</strong>
            <span>{{ diagnostic.message }}</span>
          </span>
        </button>
        <div class="issue-meta">
          <span class="issue-chip">{{ diagnostic.category }}</span>
          <code v-if="diagnostic.path">{{ diagnostic.path }}</code>
          <code v-else-if="diagnostic.schemaPath">{{ diagnostic.schemaPath }}</code>
          <button
            v-if="diagnostic.path || diagnostic.schemaPath"
            class="copy-btn"
            type="button"
            @click="copyPath(diagnostic)"
          >
            <IconCopy class="app-icon" aria-hidden="true" />
            Copy path
          </button>
        </div>
        <p class="issue-action">{{ diagnostic.action }}</p>
      </li>
    </ul>

    <div v-else class="empty-issues">
      <IconCircleCheck class="app-icon" aria-hidden="true" />
      <div>
        <strong>No issues</strong>
        <p>Schema quality checks are quiet for the current schema.</p>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import type {
  SchemaDiagnostic,
  SchemaDiagnosticsSummary,
  SchemaDiagnosticSeverity,
} from '@/types'
import IconCircleAlert from '~icons/lucide/circle-alert'
import IconCircleCheck from '~icons/lucide/circle-check'
import IconCopy from '~icons/lucide/copy'
import IconInfo from '~icons/lucide/info'
import IconX from '~icons/lucide/x'

defineProps<{
  diagnostics: SchemaDiagnostic[]
  summary: SchemaDiagnosticsSummary
}>()

const emit = defineEmits<{
  close: []
  focusIssue: [diagnostic: SchemaDiagnostic]
  copied: [path: string]
}>()

function iconFor(severity: SchemaDiagnosticSeverity) {
  if (severity === 'error') return IconCircleAlert
  if (severity === 'warning') return IconInfo
  return IconCircleCheck
}

async function copyPath(diagnostic: SchemaDiagnostic) {
  const path = diagnostic.path ?? diagnostic.schemaPath
  if (!path) return

  await navigator.clipboard.writeText(path)
  emit('copied', path)
}
</script>

<style scoped>
.issues-panel {
  background: var(--color-app-surface);
  border-left: 1px solid var(--color-app-border);
  color: var(--color-app-text);
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.issues-header {
  align-items: flex-start;
  border-bottom: 1px solid var(--color-app-border-subtle);
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  padding: 0.8rem;

  p {
    color: var(--color-app-text-muted);
    font-size: 0.78rem;
    margin: 0 0 0.15rem;
  }

  h2 {
    font-size: 1rem;
    font-weight: 800;
    margin: 0;
  }
}

.icon-btn {
  align-items: center;
  background: var(--color-app-surface-raised);
  border-color: var(--color-app-border);
  display: inline-flex;
  justify-content: center;
  min-height: 36px;
  min-width: 36px;
}

.issues-list {
  display: grid;
  gap: 0;
  list-style: none;
  margin: 0;
  min-height: 0;
  overflow: auto;
  padding: 0;
}

.issue {
  border-bottom: 1px solid var(--color-app-border-subtle);
  border-left: 3px solid var(--color-app-info-border);
  display: grid;
  gap: 0.55rem;
  padding: 0.75rem 0.8rem;
}

.issue--warning {
  border-left-color: var(--color-app-warning-border);
}

.issue--error {
  border-left-color: var(--color-app-error-border);
}

.issue-main {
  align-items: flex-start;
  border: 0;
  border-radius: 6px;
  color: inherit;
  display: grid;
  gap: 0.55rem;
  grid-template-columns: auto 1fr;
  justify-content: stretch;
  padding: 0.2rem;
  text-align: left;
  width: 100%;

  .app-icon {
    color: var(--color-app-info-text);
    font-size: 1rem;
    margin-top: 0.15rem;
  }
}

.issue--warning .issue-main .app-icon {
  color: var(--color-app-warning-text);
}

.issue--error .issue-main .app-icon {
  color: var(--color-app-error-text);
}

.issue-copy {
  display: grid;
  gap: 0.2rem;
  min-width: 0;

  strong {
    font-size: 0.88rem;
    font-weight: 800;
  }

  span {
    color: var(--color-app-text-muted);
    font-size: 0.82rem;
  }
}

.issue-meta {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  padding-left: 1.95rem;
}

.issue-chip,
.copy-btn {
  align-items: center;
  background: var(--color-app-surface-raised);
  border: 1px solid var(--color-app-border-subtle);
  border-radius: 999px;
  color: var(--color-app-text-muted);
  display: inline-flex;
  font-size: 0.72rem;
  min-height: 24px;
  padding: 0 0.45rem;
}

.copy-btn {
  gap: 0.25rem;
}

code {
  color: var(--color-app-accent);
  font-size: 0.78rem;
}

.issue-action {
  color: var(--color-app-text-muted);
  font-size: 0.78rem;
  margin: 0;
  padding-left: 1.95rem;
}

.empty-issues {
  align-items: flex-start;
  color: var(--color-app-text-muted);
  display: flex;
  gap: 0.65rem;
  padding: 1rem;

  .app-icon {
    color: var(--color-app-success-text);
    font-size: 1.1rem;
    margin-top: 0.1rem;
  }

  strong {
    color: var(--color-app-text);
    font-weight: 800;
  }

  p {
    margin: 0.15rem 0 0;
  }
}

@media (max-width: 760px) {
  .issues-panel {
    border-left: 0;
  }
}
</style>
