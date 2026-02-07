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
  background-color: #003049;
  color: #fdf0d5;
  height: 5vh;
  padding-left: 8px;

  h1 {
    font-weight: 600;
  }
}

.main {
  height: 95vh;
}
</style>
