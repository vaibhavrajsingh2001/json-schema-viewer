<template>
  <div class="editor-pane">
    <PaneToggleButton
      :collapsed="!sidebarOpen"
      :title="sidebarOpen ? 'Hide editor sidepanel' : 'Show editor sidepanel'"
      @toggle="sidebarOpen = !sidebarOpen"
    />
    <JsonEditor
      :value="json"
      :sidebar-open="sidebarOpen"
      tree-show-values
      tree-show-counts
      editor-show-descriptions
      editor-show-counts
      @change="json = $event"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { JsonEditor, type JsonValue } from '@visual-json/vue'
import PaneToggleButton from '@/components/PaneToggleButton.vue'

const json = defineModel<JsonValue>({ required: true })

// Visual JSON exposes sidebar visibility as a prop, but does not render its own toggle.
const sidebarOpen = ref<boolean>(false)
</script>

<style scoped>
.editor-pane {
  height: 100%;
  position: relative;
}
</style>
