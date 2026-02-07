<template>
  <Splitpanes class="container">
    <Pane :size="editorSize" min-size="0">
      <JsonEditorVue v-model="jsonContent" :stringified="false" :navigation-bar="false" />
    </Pane>
    <Pane :size="100 - editorSize" class="schema-pane">
      <button class="collapse-btn" :title="editorCollapsed ? 'Show editor' : 'Hide editor'" @click="toggleEditor">
        {{ editorCollapsed ? '↦' : '↤' }}
      </button>
      <SchemaRenderer v-if="jsonContent" :schema="jsonContent" />
    </Pane>
  </Splitpanes>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Splitpanes, Pane } from 'splitpanes'
import { SchemaRenderer } from '@kong/spec-renderer'
import JsonEditorVue from 'json-editor-vue'
import sampleSchema from '@/assets/sample-schema.json' with { type: 'json' }
import { encodeSchema, decodeSchema } from '@/utils/share'
import { useToast } from '@/composables/useToast'

const jsonContent = ref<Record<string, unknown>>(sampleSchema)
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

const defaultEditorSize = 50
const editorSize = ref(defaultEditorSize)
const editorCollapsed = ref(false)

function toggleEditor() {
  editorCollapsed.value = !editorCollapsed.value
  editorSize.value = editorCollapsed.value ? 0 : defaultEditorSize
}
</script>

<style scoped>
.container {
  &.splitpanes {
    background: var(--color-secondary);
  }

  .splitpanes__pane {
    overflow: auto;
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
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 2rem;
      padding: 0.2rem 0.6rem 0.35rem 0.6rem;
      line-height: 0.8;
      opacity: 0.85;
      transition: opacity 0.2s, background 0.2s;
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
