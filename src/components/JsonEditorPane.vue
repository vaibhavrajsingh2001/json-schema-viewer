<template>
  <div class="editor-pane">
    <JsonRawEditor v-if="viewMode === 'raw'" v-model="rawText" :error="rawError" />
    <JsonEditor
      v-else
      :value="json"
      :sidebar-open="sidebarOpenModel"
      tree-show-values
      tree-show-counts
      editor-show-descriptions
      editor-show-counts
      :style="{ height: '100%' }"
      @change="handleJsonChange"
    />
  </div>
</template>

<script setup lang="ts">
import { shallowRef, watch } from 'vue'
import { JsonEditor, type JsonValue } from '@visual-json/vue'
import type { JsonEditorViewMode } from '@/types'
import JsonRawEditor from '@/components/JsonRawEditor.vue'

const json = defineModel<JsonValue>({ required: true })
// Visual JSON exposes sidebar visibility as a prop, but does not render its own toggle.
const sidebarOpenModel = defineModel<boolean>('sidebarOpen', { default: false })
const viewMode = defineModel<JsonEditorViewMode>('viewMode', { default: 'tree' })

const rawText = shallowRef(JSON.stringify(json.value, null, 2))
const rawError = shallowRef<string | null>(null)

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
  overflow: auto;
  overscroll-behavior: contain;
}
</style>
