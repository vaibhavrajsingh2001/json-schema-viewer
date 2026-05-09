<template>
  <Transition name="settings-backdrop">
    <div v-if="open" class="settings-backdrop" @click.self="open = false">
      <Transition name="settings-panel" appear>
        <aside
          class="settings-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="settings-heading"
        >
          <header class="settings-header">
            <div>
              <p>App level config</p>
              <h2 id="settings-heading">Settings</h2>
            </div>
            <button
              type="button"
              class="icon-btn"
              aria-label="Close settings"
              @click="open = false"
            >
              <IconX class="app-icon" aria-hidden="true" />
            </button>
          </header>

          <section class="settings-section" aria-labelledby="pane-setting-heading">
            <h3 id="pane-setting-heading">Workbench</h3>
            <div class="segmented-control" role="group" aria-label="Visible panes">
              <label>
                <input v-model="paneVisibility" type="radio" value="both" />
                <span>Both</span>
              </label>
              <label>
                <input v-model="paneVisibility" type="radio" value="editor" />
                <span>Editor</span>
              </label>
              <label>
                <input v-model="paneVisibility" type="radio" value="preview" />
                <span>Preview</span>
              </label>
            </div>
          </section>

          <section class="settings-section" aria-labelledby="editor-setting-heading">
            <h3 id="editor-setting-heading">JSON editor</h3>
            <div class="segmented-control" role="group" aria-label="JSON editor view">
              <label v-for="option in editorViewOptions" :key="option.id">
                <input v-model="editorViewMode" type="radio" :value="option.id" />
                <span>{{ option.label }}</span>
              </label>
            </div>
            <label class="switch-row">
              <span>Sidebar</span>
              <input
                v-model="editorSidebarOpen"
                type="checkbox"
                :disabled="editorViewMode !== 'tree'"
              />
            </label>
          </section>

          <section class="settings-section" aria-labelledby="validation-setting-heading">
            <h3 id="validation-setting-heading">Schema validation</h3>
            <label class="switch-row">
              <span>Validate schema</span>
              <input v-model="validationEnabled" type="checkbox" />
            </label>
            <label class="field-row">
              <span>Draft</span>
              <select v-model="schemaDraft" :disabled="!validationEnabled">
                <option v-for="option in schemaDraftOptions" :key="option.id" :value="option.id">
                  {{ option.label }}
                </option>
              </select>
            </label>
          </section>

          <section class="settings-section" aria-labelledby="theme-setting-heading">
            <h3 id="theme-setting-heading">Appearance</h3>
            <label class="field-row">
              <span>Theme</span>
              <select v-model="currentTheme">
                <option v-for="theme in themePreferences" :key="theme.id" :value="theme.id">
                  {{ theme.label }}
                </option>
              </select>
            </label>
          </section>
        </aside>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import type { JsonEditorViewMode, SchemaDraftPreference, WorkbenchPaneVisibility } from '@/types'
import { themePreferences, type ThemePreference } from '@/constants/themes'
import IconX from '~icons/lucide/x'

const open = defineModel<boolean>('open', { required: true })
const paneVisibility = defineModel<WorkbenchPaneVisibility>('paneVisibility', { required: true })
const editorViewMode = defineModel<JsonEditorViewMode>('editorViewMode', { required: true })
const editorSidebarOpen = defineModel<boolean>('editorSidebarOpen', { required: true })
const validationEnabled = defineModel<boolean>('validationEnabled', { required: true })
const schemaDraft = defineModel<SchemaDraftPreference>('schemaDraft', { required: true })
const currentTheme = defineModel<ThemePreference>('currentTheme', { required: true })

const schemaDraftOptions: Array<{ id: SchemaDraftPreference; label: string }> = [
  { id: 'auto', label: 'Auto from schema' },
  { id: '2020-12', label: 'Draft 2020-12' },
  { id: '2019-09', label: 'Draft 2019-09' },
  { id: '7', label: 'Draft 7' },
  { id: '4', label: 'Draft 4' },
]

const editorViewOptions: Array<{ id: JsonEditorViewMode; label: string }> = [
  { id: 'tree', label: 'Tree' },
  { id: 'raw', label: 'Raw' },
]
</script>

<style scoped>
.settings-backdrop {
  position: fixed;
  inset: 0;
  z-index: 900;
  display: flex;
  justify-content: flex-end;
  background: rgb(0 0 0 / 0.24);
}

.settings-panel {
  background: var(--color-app-surface);
  border-left: 1px solid var(--color-app-border);
  box-shadow: var(--shadow-app-md);
  color: var(--color-app-text);
  display: grid;
  grid-auto-rows: max-content;
  gap: 1rem;
  max-width: min(100vw, 24rem);
  min-height: 100%;
  overflow: auto;
  padding: 1rem;
  width: 100%;
}

.settings-header {
  align-items: flex-start;
  display: flex;
  justify-content: space-between;
  gap: 1rem;

  p {
    color: var(--color-app-text-muted);
    font-size: 0.78rem;
    margin: 0 0 0.2rem;
  }

  h2 {
    font-size: 1.2rem;
    font-weight: 700;
    margin: 0;
  }
}

.settings-section {
  border-top: 1px solid var(--color-app-border-subtle);
  display: grid;
  gap: 0.75rem;
  padding-top: 1rem;

  h3 {
    font-size: 0.86rem;
    font-weight: 700;
    margin: 0;
  }
}

.segmented-control {
  background: var(--color-app-surface-raised);
  border: 1px solid var(--color-app-border);
  border-radius: 8px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
  overflow: hidden;

  label {
    cursor: pointer;
    min-width: 0;
  }

  input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  span {
    display: grid;
    min-height: 38px;
    place-items: center;
    padding: 0 0.5rem;
  }

  input:checked + span {
    background: var(--color-app-accent);
    color: var(--theme-on-accent);
    font-weight: 700;
  }

  input:focus-visible + span {
    outline: 3px solid var(--color-app-focus-ring);
    outline-offset: -3px;
  }
}

.switch-row,
.field-row {
  align-items: center;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.switch-row input {
  min-height: 1.1rem;
  min-width: 1.1rem;
}

.switch-row input:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.field-row select {
  background: var(--color-app-surface-raised);
  border: 1px solid var(--color-app-border);
  border-radius: 6px;
  color: var(--color-app-text);
  font: inherit;
  min-height: 36px;
  min-width: 10rem;
  padding: 0.25rem 0.5rem;
}

.icon-btn {
  align-items: center;
  background: var(--color-app-surface-raised);
  border-color: var(--color-app-border);
  display: inline-flex;
  justify-content: center;
  min-height: 36px;
  min-width: 36px;
}

.settings-backdrop-enter-active,
.settings-backdrop-leave-active,
.settings-panel-enter-active,
.settings-panel-leave-active {
  transition:
    opacity 0.18s,
    transform 0.18s;
}

.settings-backdrop-enter-from,
.settings-backdrop-leave-to {
  opacity: 0;
}

.settings-panel-enter-from,
.settings-panel-leave-to {
  transform: translateX(1rem);
}

@media (max-width: 520px) {
  .settings-backdrop {
    align-items: flex-end;
  }

  .settings-panel {
    border-left: 0;
    border-top: 1px solid var(--color-app-border);
    max-height: 88vh;
    min-height: auto;
    max-width: none;
  }

  .settings-panel-enter-from,
  .settings-panel-leave-to {
    transform: translateY(1rem);
  }
}
</style>
