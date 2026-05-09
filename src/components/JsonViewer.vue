<template>
  <Splitpanes class="container">
    <Pane :size="editorSize" min-size="0">
      <JsonEditor
        class="json-editor"
        :value="jsonContent"
        height="100%"
        width="100%"
        :sidebar-open="true"
        :tree-show-values="true"
        :tree-show-counts="true"
        :editor-show-descriptions="true"
        :editor-show-counts="true"
        @change="jsonContent = $event"
      />
    </Pane>
    <Pane :size="100 - editorSize" class="schema-pane">
      <button class="collapse-btn" :title="editorCollapsed ? 'Show editor' : 'Hide editor'" @click="toggleEditor">
        {{ editorCollapsed ? '↦' : '↤' }}
      </button>
      <SchemaRenderer v-if="renderableSchema" :schema="renderableSchema" />
    </Pane>
  </Splitpanes>
</template>

<script setup lang="ts">
import { ref, computed, shallowRef, onMounted } from 'vue'
import { Splitpanes, Pane } from 'splitpanes'
import { SchemaRenderer } from '@kong/spec-renderer'
import { JsonEditor, type JsonValue } from '@visual-json/vue'
import sampleSchema from '@/assets/sample-schema.json' with { type: 'json' }
import { encodeSchema, decodeSchema } from '@/utils/share'
import { useToast } from '@/composables/useToast'

const jsonContent = shallowRef<JsonValue>(sampleSchema as JsonValue)

const renderableSchema = computed<Record<string, unknown> | null>(() => {
  const value = jsonContent.value

  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null
  }

  return value as Record<string, unknown>
})

const { show: showToast } = useToast()

function loadFromUrl() {
  const hash = window.location.hash
  const decoded = decodeSchema(hash)
  if (decoded) {
    jsonContent.value = decoded
  }
}

async function share() {
  const hash = encodeSchema(jsonContent.value)
  const url = `${window.location.origin}${window.location.pathname}${hash}`

  try {
    await navigator.clipboard.writeText(url)
    showToast('Copied to clipboard!')
    window.history.replaceState(null, '', hash)
  } catch (err) {
    console.error('Failed to copy to clipboard', err)
  }
}

onMounted(() => {
  loadFromUrl()
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
    --vj-bg: #f8fafc;
    --vj-bg-panel: #ffffff;
    --vj-bg-hover: #e8eef3;
    --vj-bg-selected: #2a6f97;
    --vj-bg-selected-muted: #d8e8f0;
    --vj-bg-match: #f7e7b8;
    --vj-bg-match-active: #f1c96b;
    --vj-border: #c8d3dc;
    --vj-border-subtle: #e2e8ef;
    --vj-text: #132f3a;
    --vj-text-selected: #ffffff;
    --vj-text-muted: #5d7180;
    --vj-text-dim: #748592;
    --vj-text-dimmer: #94a3ad;
    --vj-string: #a64600;
    --vj-number: #2f7d32;
    --vj-boolean: #0066a6;
    --vj-accent: #2a6f97;
    --vj-accent-muted: #cfe5ef;
    --vj-input-bg: #ffffff;
    --vj-input-border: #b8c7d2;
    --vj-error: #b42318;
    --vj-font:
      ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
    --vj-input-font-size: 13px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2) inset;
  }

  .schema-pane {
    padding: 1rem 1.4rem;
    container-type: inline-size;
    position: relative;

    .collapse-btn {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      z-index: 10;
      background: var(--color-primary);
      color: var(--color-white);
      font-size: 2rem;
      padding: 0.2rem 0.6rem 0.35rem 0.6rem;
      line-height: 0.8;
      opacity: 0.85;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);

      &:hover {
        opacity: 1;
        background: var(--color-primary-hover);
      }
    }

    :deep(.model-example-visible) {
      grid-template-columns: 1fr;
    }

    @container (min-width: 900px) {
      :deep(.model-example-visible) {
        grid-template-columns: auto clamp(410px, 40%, 575px);
      }
    }
  }
}
</style>
