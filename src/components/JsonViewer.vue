<template>
  <Splitpanes class="container">
    <Pane>
      <JsonEditor class="json-editor" v-model:json="jsonContent" />
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
import JsonEditor from 'vue3-ts-jsoneditor'
import sampleSchema from '@/assets/sample-schema.json'

const jsonContent = ref(sampleSchema)
</script>

<style scoped>
.container {
  &.splitpanes {
    background: #fdf0d5;
  }

  .json-editor {
    height: 100%;
    overflow: auto;
  }

  .schema-pane {
    padding: 1rem 1.4rem;
    overflow: auto;

    :deep(.model-example-visible) {
      grid-template-columns: auto;
    }
  }

  .splitpanes__pane {
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2) inset;
  }
}
</style>
