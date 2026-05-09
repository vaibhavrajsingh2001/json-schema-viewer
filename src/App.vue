<template>
  <nav class="navbar">
    <h1>JSON Schema Viewer</h1>
    <button class="share-btn" title="Copy share link" @click="handleShare">
      <IconShare2 class="app-icon" aria-hidden="true" />
      <span>Share</span>
    </button>
  </nav>

  <main class="main">
    <JsonViewer ref="jsonViewerRef" />
  </main>
  <ToastNotification />
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue'
import JsonViewer from './components/JsonViewer.vue'
import ToastNotification from './components/ToastNotification.vue'
import IconShare2 from '~icons/lucide/share-2'

const jsonViewerRef = useTemplateRef('jsonViewerRef')

function handleShare() {
  jsonViewerRef.value?.share()
}
</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--color-primary);
  color: var(--color-secondary);
  height: var(--navbar-height);
  padding: 0 1rem;

  h1 {
    font-family: var(--font-sans);
    font-weight: 700;
    margin: 0;
  }
}

.share-btn {
  background: var(--color-secondary);
  color: var(--color-primary);
  padding: 0.3rem 0.8rem;
  font-size: 0.9rem;
  height: 32px;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-weight: 500;

  .app-icon {
    font-size: 1rem;
  }

  &:hover {
    background: var(--color-white);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
}

.main {
  height: calc(100vh - var(--navbar-height));
}
</style>
