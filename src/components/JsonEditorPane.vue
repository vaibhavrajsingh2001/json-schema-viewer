<template>
  <div class="editor-pane">
    <PaneToggleButton
      :collapsed="!sidebarOpen"
      :title="sidebarOpen ? 'Hide editor sidepanel' : 'Show editor sidepanel'"
      @toggle="sidebarOpen = !sidebarOpen"
    />
    <JsonEditor
      class="json-editor"
      :value="modelValue"
      height="100%"
      width="100%"
      :sidebar-open="sidebarOpen"
      :tree-show-values="true"
      :tree-show-counts="true"
      :editor-show-descriptions="true"
      :editor-show-counts="true"
      @change="$emit('update:modelValue', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { JsonEditor, type JsonValue } from '@visual-json/vue'
import PaneToggleButton from '@/components/PaneToggleButton.vue'

defineProps<{
  modelValue: JsonValue
}>()

defineEmits<{
  'update:modelValue': [value: JsonValue]
}>()

// Visual JSON hides the tree/form sidepanel when this is false; keep editing focused by default.
const sidebarOpen = ref(false)
</script>

<style scoped>
.editor-pane {
  height: 100%;
  position: relative;
}
</style>
