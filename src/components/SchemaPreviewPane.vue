<template>
  <section class="schema-pane" aria-labelledby="preview-heading">
    <slot name="actions" />
    <div class="preview-header">
      <h2 id="preview-heading">Preview</h2>
      <button
        v-if="showDiagnosticsControl"
        class="diagnostic-trigger"
        type="button"
        :aria-expanded="diagnosticsOpen"
        aria-controls="schema-diagnostics-drawer"
        @click="emit('toggleDiagnostics')"
      >
        {{ diagnosticsLabel }}
      </button>
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

    <SchemaDiagnosticsDrawer
      :diagnostics="diagnostics"
      :open="diagnosticsOpen"
      @close="emit('closeDiagnostics')"
    />
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { SchemaRenderer } from '@kong/spec-renderer'
import type { PreviewState, SchemaDiagnostic } from '@/types'
import SchemaDiagnosticsDrawer from '@/components/SchemaDiagnosticsDrawer.vue'
import IconCircleAlert from '~icons/lucide/circle-alert'
import IconInfo from '~icons/lucide/info'

const props = defineProps<{
  schema: Record<string, unknown> | null
  diagnostics: SchemaDiagnostic[]
  diagnosticsOpen: boolean
  validationEnabled: boolean
  state: PreviewState
}>()

const emit = defineEmits<{
  toggleDiagnostics: []
  closeDiagnostics: []
}>()

const stateIcon = computed(() =>
  props.state.kind === 'empty' && props.state.severity === 'error' ? IconCircleAlert : IconInfo,
)

const showDiagnosticsControl = computed(
  () => props.validationEnabled && props.state.kind === 'ready',
)
const diagnosticsLabel = computed(() => {
  if (props.diagnostics.length === 0) return 'Validation quiet'
  return `${props.diagnostics.length} diagnostic${props.diagnostics.length === 1 ? '' : 's'}`
})
</script>

<style scoped>
.schema-pane {
  container-type: inline-size;
  height: 100%;
  min-height: 0;
  overflow: auto;
  overscroll-behavior: contain;
  padding: 1rem 1.4rem;
  position: relative;
}

.preview-header {
  align-items: center;
  display: flex;
  gap: 0.75rem;
  justify-content: space-between;
  margin: 0 2.75rem 1rem 0;

  h2 {
    font-size: 1rem;
    font-weight: 700;
    margin: 0;
  }
}

.diagnostic-trigger {
  background: var(--color-app-surface);
  border-color: var(--color-app-border);
  color: var(--color-app-text-muted);
  font-size: 0.8rem;
  min-height: 32px;
  padding: 0.2rem 0.6rem;
}

.empty-state {
  align-items: flex-start;
  background: var(--color-app-surface);
  border: 1px solid var(--color-app-info-border);
  border-radius: 8px;
  color: var(--color-app-text);
  display: flex;
  gap: 0.75rem;
  margin: 1rem 0;
  padding: 1rem;

  .app-icon {
    color: var(--color-app-info-text);
    font-size: 1.25rem;
    margin-top: 0.1rem;
  }

  h3 {
    font-size: 0.95rem;
    font-weight: 700;
    margin: 0 0 0.25rem;
  }

  p {
    color: var(--color-app-text-muted);
    margin: 0;
  }
}

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
</style>
