<template>
  <Splitpanes class="container">
    <Pane>
      <JsonEditorVue v-model="jsonContent" :stringified="false" :navigation-bar="false" />
    </Pane>
    <Pane class="schema-pane">
      <SchemaRenderer v-if="jsonContent" :schema="jsonContent" />
    </Pane>
  </Splitpanes>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Splitpanes, Pane } from 'splitpanes'
import { SchemaRenderer } from '@kong/spec-renderer'
import JsonEditorVue from 'json-editor-vue'
import sampleSchema from '@/assets/sample-schema.json' with { type: 'json' }

const jsonContent = ref<Record<string, unknown>>(sampleSchema)
</script>

<style scoped>
.container {
  &.splitpanes {
    background: #fdf0d5;
  }

  .splitpanes__pane {
    overflow: auto;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2) inset;
  }

  .schema-pane {
    padding: 1rem 1.4rem;

    :deep(.model-example-visible) {
      grid-template-columns: auto;
    }
  }
}
</style>
