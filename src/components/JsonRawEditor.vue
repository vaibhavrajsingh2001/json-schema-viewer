<template>
  <div class="raw-editor-wrap">
    <header class="raw-header">
      <div class="raw-title">
        <p>Schema</p>
        <h2>Editor</h2>
      </div>
      <div class="raw-controls">
        <div class="segmented-control" role="group" aria-label="Editor mode">
          <button type="button" @click="emit('switchTree')">Tree</button>
          <button class="is-active" type="button" aria-pressed="true">Raw</button>
        </div>
      </div>
    </header>
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

const emit = defineEmits<{
  switchTree: []
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

.raw-header {
  align-items: center;
  background: var(--color-app-surface);
  border-bottom: 1px solid var(--color-app-border-subtle);
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  min-height: 56px;
  padding: 0.55rem 0.75rem;
}

.raw-title {
  display: grid;
  gap: 0.1rem;
  min-width: 0;

  p {
    color: var(--color-app-text-muted);
    font-size: 0.72rem;
    font-weight: 700;
    line-height: 1;
    margin: 0;
    text-transform: uppercase;
  }

  h2 {
    font-size: 0.98rem;
    font-weight: 700;
    line-height: 1.15;
    margin: 0;
  }
}

.raw-controls {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  justify-content: flex-end;
}

.segmented-control {
  background: var(--color-app-surface-raised);
  border: 1px solid var(--color-app-border);
  border-radius: 7px;
  display: grid;
  grid-template-columns: repeat(2, minmax(3.2rem, 1fr));
  min-height: 36px;
  overflow: hidden;

  button {
    border: 0;
    border-radius: 0;
    color: var(--color-app-text-muted);
    min-height: 34px;
    padding: 0 0.65rem;
  }

  .is-active {
    background: var(--color-app-accent);
    color: var(--theme-on-accent);
    font-weight: 700;
  }
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

@media (max-width: 560px) {
  .raw-header {
    align-items: stretch;
    flex-direction: column;
  }

  .raw-controls {
    justify-content: flex-start;
  }
}
</style>
