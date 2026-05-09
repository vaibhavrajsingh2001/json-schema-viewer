<template>
  <div class="schema-pane">
    <button
      class="pane-action-btn collapse-btn"
      :title="editorCollapsed ? 'Show editor' : 'Hide editor'"
      @click="$emit('toggleEditor')"
    >
      {{ editorCollapsed ? '↦' : '↤' }}
    </button>
    <SchemaRenderer v-if="schema" :schema="schema" />
  </div>
</template>

<script setup lang="ts">
import { SchemaRenderer } from '@kong/spec-renderer'

defineProps<{
  schema: Record<string, unknown> | null
  editorCollapsed: boolean
}>()

defineEmits<{
  toggleEditor: []
}>()
</script>

<style scoped>
.schema-pane {
  container-type: inline-size;
  min-height: 100%;
  padding: 1rem 1.4rem;
  position: relative;
}

.collapse-btn {
  font-size: 2rem;
  padding: 0.2rem 0.6rem 0.35rem 0.6rem;
  line-height: 0.8;
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
