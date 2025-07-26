<template>
  <div class="container">
    <div class="pane left-pane">
      <code class="content-area" contenteditable @input="handleUpdateValue">
        {{ jsonContent }}
      </code>
    </div>
    <div class="pane right-pane">
      <div class="content-area">
        <SchemaRenderer v-if="jsonContent" :schema="JSON.parse(jsonContent)" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { SchemaRenderer } from '@kong/spec-renderer'
import sampleSchema from '@/assets/sample-schema.json' with { type: 'json' }

import '@kong/spec-renderer/dist/style.css'

const jsonContent = ref<string>(JSON.stringify(sampleSchema, null, 2))

const handleUpdateValue = (event: Event) => {
  jsonContent.value = (event.target as HTMLElement).innerText
}
</script>

<style scoped>
.container {
  display: flex;
  width: 100%;
  height: 60vh;
  min-height: 400px;
  border: 2px solid black;
  background-color: #fdfdfd;
}

.pane {
  flex: 1;
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

.left-pane {
  border-right: 2px solid black;
}

.title {
  font-size: 1rem;
  font-weight: normal;
  margin: 0 0 0.75rem 0.25rem;
  color: #333;
}

.content-area {
  flex-grow: 1;
  border: 1px solid #dcdcdc;
  background-color: white;
  padding: 1rem;
  overflow: hidden;
  /* Hide overflow from textarea */
}

.editor {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  resize: none;
  padding: 0;
  background-color: transparent;
  font-family: 'Courier New', Courier, monospace;
  font-size: 1.25rem;
  line-height: 1.5;
  color: #333;
}
</style>
