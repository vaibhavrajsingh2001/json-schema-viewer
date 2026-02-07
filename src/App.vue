<template>
  <nav class="navbar">
    <h1>JSON Schema Viewer</h1>
    <button class="share-btn" title="Copy share link" @click="handleShare">
      🔗 Share
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
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    letter-spacing: -0.5px;
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
  font-weight: 500;

  &:hover {
    background: var(--color-white);
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
}

.main {
  height: calc(100vh - var(--navbar-height));
}
</style>
