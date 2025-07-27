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
  background-color: #003049;
  color: #fdf0d5;
  padding: 1rem;
  height: 4vh;

  h1 {
    font-weight: 600;
  }
}

.main {
  height: 96vh;
}
</style>
