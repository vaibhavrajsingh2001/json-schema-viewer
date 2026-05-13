<template>
  <div class="editor-pane">
    <JsonRawEditor
      v-if="viewMode === 'raw'"
      v-model="rawText"
      :error="rawError"
      @switch-tree="viewMode = 'tree'"
    />

    <VisualJson v-else :value="json" @change="handleJsonChange">
      <JsonEditorPaneHeader
        v-model:view-mode="viewMode"
        v-model:sidebar-open="sidebarOpenModel"
      />
      <div class="visual-shell" :class="{ 'visual-shell--with-sidebar': sidebarOpenModel }">
        <aside v-if="sidebarOpenModel" class="tree-sidebar" aria-label="Schema outline">
          <TreeView show-values show-counts />
        </aside>
        <section class="form-region" aria-label="Schema editor">
          <div class="editor-find">
            <SearchBar />
            <Breadcrumbs />
          </div>
          <FormView show-descriptions show-counts />
        </section>
      </div>
      <JsonStudioNavigator :target-path="targetPath" @targeted="emit('targeted', $event)" />
    </VisualJson>
  </div>
</template>

<script setup lang="ts">
import { shallowRef, watch } from 'vue'
import {
  Breadcrumbs,
  FormView,
  SearchBar,
  TreeView,
  VisualJson,
  type JsonValue,
} from '@visual-json/vue'
import type { JsonEditorViewMode } from '@/types'
import JsonEditorPaneHeader from '@/components/JsonEditorPaneHeader.vue'
import JsonRawEditor from '@/components/JsonRawEditor.vue'
import JsonStudioNavigator from '@/components/JsonStudioNavigator.vue'

defineProps<{
  targetPath: string | null
}>()

const emit = defineEmits<{
  targeted: [path: string]
}>()

const json = defineModel<JsonValue>({ required: true })
const sidebarOpenModel = defineModel<boolean>('sidebarOpen', { default: false })
const viewMode = defineModel<JsonEditorViewMode>('viewMode', { default: 'tree' })
const rawError = defineModel<string | null>('rawError', { default: null })

const rawText = shallowRef(JSON.stringify(json.value, null, 2))

watch(json, (value) => {
  if (viewMode.value === 'raw') return
  rawText.value = JSON.stringify(value, null, 2)
})

watch(viewMode, (mode) => {
  if (mode === 'raw') {
    rawText.value = JSON.stringify(json.value, null, 2)
    rawError.value = null
  }
})

watch(rawText, (value) => {
  if (viewMode.value !== 'raw') return

  try {
    json.value = JSON.parse(value) as JsonValue
    rawError.value = null
  } catch (error) {
    rawError.value = error instanceof Error ? error.message : 'Invalid JSON'
  }
})

function handleJsonChange(value: JsonValue) {
  json.value = value
  rawText.value = JSON.stringify(value, null, 2)
  rawError.value = null
}
</script>

<style scoped>
.editor-pane {
  background: var(--color-app-surface-raised);
  height: 100%;
  min-height: 0;
  overflow: hidden;
  overscroll-behavior: contain;
  --vj-bg: var(--theme-json-bg);
  --vj-bg-panel: var(--theme-json-bg-panel);
  --vj-bg-hover: var(--theme-json-bg-hover);
  --vj-bg-selected: var(--theme-json-bg-selected);
  --vj-bg-selected-muted: var(--theme-json-bg-selected-muted);
  --vj-bg-match: var(--theme-json-bg-match);
  --vj-bg-match-active: var(--theme-json-bg-match-active);
  --vj-border: var(--theme-json-border);
  --vj-border-subtle: var(--theme-json-border-subtle);
  --vj-text: var(--theme-json-text);
  --vj-text-selected: var(--theme-json-text-selected);
  --vj-text-muted: var(--theme-json-text-muted);
  --vj-text-dim: var(--theme-json-text-dim);
  --vj-text-dimmer: var(--theme-json-text-dimmer);
  --vj-string: var(--theme-json-string);
  --vj-number: var(--theme-json-number);
  --vj-boolean: var(--theme-json-boolean);
  --vj-accent: var(--theme-json-accent);
  --vj-accent-muted: var(--theme-json-accent-muted);
  --vj-input-bg: var(--theme-json-input-bg);
  --vj-input-border: var(--theme-json-input-border);
  --vj-error: var(--theme-json-error);
  --vj-font: var(--font-mono);
  --vj-input-font-size: var(--theme-json-input-font-size);
}

.editor-pane :deep([data-vj-root]) {
  height: 100%;
}

.visual-shell {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  height: calc(100% - 56px);
  min-height: 0;
}

.visual-shell--with-sidebar {
  grid-template-columns: minmax(13rem, 32%) minmax(0, 1fr);
}

.tree-sidebar {
  background: var(--color-app-surface);
  border-right: 1px solid var(--color-app-border-subtle);
  min-height: 0;
  overflow: auto;
}

.form-region {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  min-height: 0;
  overflow: hidden;
}

.editor-find {
  align-items: center;
  background: var(--color-app-surface);
  border-bottom: 1px solid var(--color-app-border-subtle);
  display: grid;
  gap: 0.45rem;
  grid-template-columns: minmax(12rem, 0.9fr) minmax(0, 1.1fr);
  min-height: 44px;
  padding: 0.35rem 0.6rem;
}

.form-region :deep(.vj-form-view),
.tree-sidebar :deep(.vj-tree-view) {
  height: 100%;
}

@media (max-width: 700px) {
  .visual-shell,
  .visual-shell--with-sidebar {
    grid-template-columns: minmax(0, 1fr);
  }

  .tree-sidebar {
    display: none;
  }

  .editor-find {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
