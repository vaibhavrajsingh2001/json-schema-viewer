<template>
  <Splitpanes class="container">
    <Pane :size="editorSize" min-size="0">
      <JsonEditorPane v-model="jsonContent" />
    </Pane>
    <Pane :size="100 - editorSize">
      <SchemaPreviewPane :schema="renderableSchema">
        <template #actions>
          <PaneToggleButton
            :collapsed="editorCollapsed"
            :title="editorCollapsed ? 'Show editor' : 'Hide editor'"
            size="lg"
            @toggle="toggleEditor"
          />
        </template>
      </SchemaPreviewPane>
    </Pane>
  </Splitpanes>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Splitpanes, Pane } from 'splitpanes'
import type { JsonValue } from '@visual-json/vue'
import sampleSchema from '@/assets/sample-schema.json' with { type: 'json' }
import { useToast } from '@/composables/useToast'
import { useShareableJson } from '@/composables/useShareableJson'
import JsonEditorPane from '@/components/JsonEditorPane.vue'
import SchemaPreviewPane from '@/components/SchemaPreviewPane.vue'
import PaneToggleButton from '@/components/PaneToggleButton.vue'

const { show: showToast } = useToast()
const { jsonContent, share } = useShareableJson(sampleSchema as JsonValue, showToast)

const renderableSchema = computed<Record<string, unknown> | null>(() => {
  const value = jsonContent.value

  // Kong's renderer expects an object schema, while the editor can emit any JSON root.
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null
  }

  return value as Record<string, unknown>
})

defineExpose({
  share
})

const editorCollapsed = ref(false)
const editorSize = computed(() => (editorCollapsed.value ? 0 : 50))

function toggleEditor() {
  editorCollapsed.value = !editorCollapsed.value
}
</script>

<style scoped>
.container {
  &.splitpanes {
    background: var(--color-secondary);
  }

  .splitpanes__pane {
    width: 100%;
    overflow: auto;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2) inset;
  }
}
</style>
