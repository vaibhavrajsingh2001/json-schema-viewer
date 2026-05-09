<template>
  <div class="editor-pane">
    <button
      class="pane-action-btn editor-sidebar-btn"
      :title="sidebarOpen ? 'Hide editor sidepanel' : 'Show editor sidepanel'"
      @click="sidebarOpen = !sidebarOpen"
    >
      {{ sidebarOpen ? '↤' : '↦' }}
    </button>
    <JsonEditor
      class="json-editor"
      :value="value"
      height="100%"
      width="100%"
      :sidebar-open="sidebarOpen"
      :tree-show-values="true"
      :tree-show-counts="true"
      :editor-show-descriptions="true"
      :editor-show-counts="true"
      @change="$emit('change', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { JsonEditor, type JsonValue } from '@visual-json/vue'

defineProps<{
  value: JsonValue
}>()

defineEmits<{
  change: [value: JsonValue]
}>()

// Visual JSON hides the tree/form sidepanel when this is false; keep editing focused by default.
const sidebarOpen = ref(false)
</script>

<style scoped>
.editor-pane {
  height: 100%;
  position: relative;
}

.editor-sidebar-btn {
  font-size: 1rem;
  line-height: 1;
  padding: 0.35rem 0.55rem;
}
</style>
