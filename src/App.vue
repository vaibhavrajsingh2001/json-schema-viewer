<template>
  <main class="main">
    <JsonViewer />
  </main>
  <ToastNotification />
</template>

<script setup lang="ts">
import JsonViewer from './components/JsonViewer.vue'
import ToastNotification from './components/ToastNotification.vue'
</script>

<style scoped>
.main {
  min-height: 100vh;
}
</style>
