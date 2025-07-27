<template>
  <Splitpanes class="container">
    <Pane>
      <code class="content-area" contenteditable @input="handleUpdateValue">
        {{ jsonContent }}
      </code>
    </Pane>
    <Pane class="schema-pane">
      <SchemaRenderer
        v-if="jsonContent"
        :schema="JSON.parse(jsonContent)"
      />
    </Pane>
  </Splitpanes>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Splitpanes, Pane } from 'splitpanes'
import { SchemaRenderer } from '@kong/spec-renderer'
import sampleSchema from '@/assets/sample-schema.json' with { type: 'json' }

const jsonContent = ref<string>(JSON.stringify(sampleSchema, null, 2))

const handleUpdateValue = (event: Event) => {
  jsonContent.value = (event.target as HTMLElement).innerText
}
</script>

<style>
.container {
  .schema-pane {
    padding: 2rem;
    overflow: auto;
  }

  &.splitpanes {
    background: #fdf0d5;
  }

  .splitpanes__pane {
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2) inset;
  }

  .splitpanes__splitter {
    background: #003049;
    width: 2px;
  }
}
</style>
