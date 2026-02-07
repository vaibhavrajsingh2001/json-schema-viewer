<template>
  <nav class="navbar">
    <h1>JSON Schema Viewer</h1>
  </nav>
  <main class="main">
    <JsonViewer />
  </main>
</template>

<script setup lang="ts">
import JsonViewer from './components/JsonViewer.vue'
</script>

<style scoped>
.navbar {
  align-content: center;
  background-color: var(--color-primary);
  color: var(--color-secondary);
  height: var(--navbar-height);
  padding-left: 8px;

  h1 {
    font-weight: 600;
  }
}

.main {
  height: calc(100vh - var(--navbar-height));
}
</style>
