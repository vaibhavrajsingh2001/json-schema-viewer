<template>
  <section class="schema-pane" aria-labelledby="preview-heading">
    <header class="preview-header">
      <div class="preview-title">
        <p>Documentation</p>
        <h2 id="preview-heading">Preview</h2>
      </div>
      <span class="schema-badge" :class="schemaBadgeClass">{{ schemaBadgeLabel }}</span>
    </header>

    <div v-if="rawError" class="paused-state" role="status">
      <IconCircleAlert class="app-icon" aria-hidden="true" />
      <div>
        <h3>Preview paused</h3>
        <p>The raw JSON has a syntax error. The preview is showing the last valid schema.</p>
      </div>
    </div>

    <div
      v-if="state.kind !== 'ready'"
      class="empty-state"
      :class="`empty-state--${state.severity}`"
    >
      <component :is="stateIcon" class="app-icon" aria-hidden="true" />
      <div>
        <h3>{{ state.title }}</h3>
        <p>{{ state.message }}</p>
      </div>
    </div>

    <template v-else>
      <SchemaRenderer v-if="schema" :schema="schema" />
    </template>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { SchemaRenderer } from '@kong/spec-renderer'
import type { PreviewState, SchemaDiagnosticsSummary } from '@/types'
import IconCircleAlert from '~icons/lucide/circle-alert'
import IconInfo from '~icons/lucide/info'

const props = defineProps<{
  schema: Record<string, unknown> | null
  validationEnabled: boolean
  state: PreviewState
  summary: SchemaDiagnosticsSummary
  rawError: string | null
}>()

const stateIcon = computed(() =>
  props.state.kind === 'empty' && props.state.severity === 'error' ? IconCircleAlert : IconInfo,
)

const schemaIsInvalid = computed(() => props.summary.issueCount > 0)

const schemaBadgeLabel = computed(() => {
  if (!props.validationEnabled) return 'Validation off'
  return schemaIsInvalid.value ? 'Invalid schema' : 'Valid schema'
})

const schemaBadgeClass = computed(() => ({
  'schema-badge--error': props.validationEnabled && props.summary.severity === 'error',
  'schema-badge--warning': props.validationEnabled && props.summary.severity === 'warning',
  'schema-badge--disabled': !props.validationEnabled,
}))
</script>

<style scoped>
.schema-pane {
  container-type: inline-size;
  height: 100%;
  min-height: 0;
  overflow: auto;
  overscroll-behavior: contain;
  padding: 0 1.1rem 1rem;
  position: relative;
}

.preview-header {
  align-items: center;
  background: var(--color-app-bg);
  border-bottom: 1px solid var(--color-app-border-subtle);
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  margin: 0 -1.1rem 1rem;
  min-height: 56px;
  padding: 0.55rem 1.1rem;
  position: sticky;
  top: 0;
  z-index: 1;
}

.preview-title {
  display: grid;
  gap: 0.1rem;
  min-width: 0;

  p {
    color: var(--color-app-text-muted);
    font-size: 0.72rem;
    font-weight: 700;
    line-height: 1;
    margin: 0;
    text-transform: uppercase;
  }

  h2 {
    font-size: 0.98rem;
    font-weight: 800;
    line-height: 1.15;
    margin: 0;
  }
}

.schema-badge {
  align-items: center;
  background: var(--color-app-info-bg);
  border: 1px solid var(--color-app-info-border);
  border-radius: 999px;
  color: var(--color-app-info-text);
  display: inline-flex;
  font-size: 0.76rem;
  font-weight: 800;
  line-height: 1;
  min-height: 28px;
  padding: 0.25rem 0.6rem;
  white-space: nowrap;
}

.schema-badge--warning {
  background: var(--color-app-warning-bg);
  border-color: var(--color-app-warning-border);
  color: var(--color-app-warning-text);
}

.schema-badge--error {
  background: var(--color-app-error-bg);
  border-color: var(--color-app-error-border);
  color: var(--color-app-error-text);
}

.schema-badge--disabled {
  background: var(--color-app-surface);
  border-color: var(--color-app-border);
  color: var(--color-app-text-muted);
}

.paused-state,
.empty-state {
  align-items: flex-start;
  background: var(--color-app-surface);
  border: 1px solid var(--color-app-info-border);
  border-radius: 8px;
  color: var(--color-app-text);
  display: flex;
  gap: 0.75rem;
  margin: 1rem 0;
  padding: 0.9rem;

  .app-icon {
    color: var(--color-app-info-text);
    font-size: 1.15rem;
    margin-top: 0.1rem;
  }

  h3 {
    font-size: 0.95rem;
    font-weight: 800;
    margin: 0 0 0.25rem;
  }

  p {
    color: var(--color-app-text-muted);
    margin: 0;
  }
}

.paused-state,
.empty-state--error {
  border-color: var(--color-app-error-border);

  .app-icon {
    color: var(--color-app-error-text);
  }
}

.empty-state--warning {
  border-color: var(--color-app-warning-border);

  .app-icon {
    color: var(--color-app-warning-text);
  }
}

:deep(.model-example-visible) {
  /* The renderer's default two-column example layout is cramped in a split pane. */
  grid-template-columns: 1fr !important;
}

@container (min-width: 900px) {
  :deep(.model-example-visible) {
    grid-template-columns: auto clamp(410px, 40%, 575px) !important;
  }
}

@media (max-width: 560px) {
  .preview-header {
    align-items: stretch;
    flex-direction: column;
  }

  .schema-badge {
    width: fit-content;
  }
}
</style>
