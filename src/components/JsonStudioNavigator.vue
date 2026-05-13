<template>
  <span class="studio-navigator" aria-hidden="true" />
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { findNodeByPath } from '@visual-json/core'
import { useStudio } from '@visual-json/vue'

const props = defineProps<{
  targetPath: string | null
}>()

const emit = defineEmits<{
  targeted: [path: string]
}>()

const { state, actions } = useStudio()

watch(
  () => props.targetPath,
  (path) => {
    if (!path) return

    const node = findNodeByPath(state.tree.value, path)
    if (!node) return

    let parentId = node.parentId
    while (parentId) {
      actions.expandNode(parentId)
      parentId = state.tree.value.nodesById.get(parentId)?.parentId ?? null
    }

    actions.selectAndDrillDown(node.id)
    emit('targeted', path)
  },
)
</script>

<style scoped>
.studio-navigator {
  display: none;
}
</style>
