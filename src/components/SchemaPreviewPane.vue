<template>
  <div class="schema-pane">
    <slot name="actions" />
    <SchemaRenderer v-if="schema" :schema="schema" />
  </div>
</template>

<script setup lang="ts">
import { SchemaRenderer } from '@kong/spec-renderer'

defineProps<{
  schema: Record<string, unknown> | null
}>()
</script>

<style scoped>
.schema-pane {
  container-type: inline-size;
  min-height: 100%;
  padding: 1rem 1.4rem;
  position: relative;
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
