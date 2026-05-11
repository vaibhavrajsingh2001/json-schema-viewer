<template>
  <div class="raw-editor-wrap">
    <p v-if="error" class="raw-error" role="status">
      {{ error }}
    </p>
    <textarea
      v-model="rawText"
      class="raw-editor"
      aria-label="Raw JSON editor"
      spellcheck="false"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  error: string | null
}>()

const rawText = defineModel<string>({ required: true })
</script>

<style scoped>
.raw-editor-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.raw-error {
  background: var(--color-app-error-bg);
  border-bottom: 1px solid var(--color-app-error-border);
  color: var(--color-app-error-text);
  font-family: var(--font-mono);
  font-size: 0.82rem;
  margin: 0;
  padding: 0.5rem 0.75rem;
}

.raw-editor {
  background: transparent;
  border: 0;
  color: var(--color-app-text);
  flex: 1 1 auto;
  font-family: var(--font-mono);
  font-size: 0.9rem;
  height: 100%;
  line-height: 1.6;
  min-height: 0;
  outline: 0;
  padding: 1rem;
  resize: none;
  width: 100%;
}
</style>
