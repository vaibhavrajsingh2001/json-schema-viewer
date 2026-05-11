<template>
  <div class="workbench">
    <WorkbenchToolbar :on-share="share" :on-open-settings="openSettings" />

    <div v-if="isMobile" class="mobile-tabs" role="tablist" aria-label="Workbench view">
      <button
        id="editor-tab"
        class="mobile-tab"
        :class="{ 'mobile-tab--active': activeViewMode === 'editor' }"
        type="button"
        role="tab"
        :aria-selected="activeViewMode === 'editor'"
        aria-controls="editor-panel"
        @click="setMobileViewMode('editor')"
      >
        Edit
      </button>
      <button
        id="preview-tab"
        class="mobile-tab"
        :class="{ 'mobile-tab--active': activeViewMode === 'preview' }"
        type="button"
        role="tab"
        :aria-selected="activeViewMode === 'preview'"
        aria-controls="preview-panel"
        @click="setMobileViewMode('preview')"
      >
        Preview
      </button>
    </div>

    <div v-if="isMobile" class="mobile-workbench">
      <section
        id="editor-panel"
        class="mobile-panel"
        role="tabpanel"
        aria-labelledby="editor-tab"
        :hidden="activeViewMode !== 'editor'"
        :inert="activeViewMode !== 'editor'"
      >
        <JsonEditorPane
          v-model="jsonContent"
          v-model:sidebar-open="editorSidebarOpen"
          v-model:view-mode="editorViewMode"
        />
      </section>
      <section
        id="preview-panel"
        class="mobile-panel"
        role="tabpanel"
        aria-labelledby="preview-tab"
        :hidden="activeViewMode !== 'preview'"
        :inert="activeViewMode !== 'preview'"
      >
        <SchemaPreviewPane
          :schema="renderableSchema"
          :diagnostics="previewDiagnostics"
          :diagnostics-open="diagnosticsOpen"
          :validation-enabled="validationEnabled"
          :state="previewState"
          @toggle-diagnostics="diagnosticsOpen = !diagnosticsOpen"
          @close-diagnostics="diagnosticsOpen = false"
        />
      </section>
    </div>

    <section
      v-else-if="paneVisibility === 'editor'"
      id="desktop-editor-pane"
      class="desktop-single-pane"
      aria-label="JSON editor"
    >
      <JsonEditorPane
        v-model="jsonContent"
        v-model:sidebar-open="editorSidebarOpen"
        v-model:view-mode="editorViewMode"
      />
    </section>

    <section v-else-if="paneVisibility === 'preview'" class="desktop-single-pane">
      <SchemaPreviewPane
        :schema="renderableSchema"
        :diagnostics="previewDiagnostics"
        :diagnostics-open="diagnosticsOpen"
        :validation-enabled="validationEnabled"
        :state="previewState"
        @toggle-diagnostics="diagnosticsOpen = !diagnosticsOpen"
        @close-diagnostics="diagnosticsOpen = false"
      />
    </section>

    <Splitpanes v-else class="container">
      <Pane :size="editorSize" min-size="0">
        <section id="desktop-editor-pane" class="desktop-pane" aria-label="JSON editor">
          <JsonEditorPane
            v-model="jsonContent"
            v-model:sidebar-open="editorSidebarOpen"
            v-model:view-mode="editorViewMode"
          />
        </section>
      </Pane>
      <Pane :size="100 - editorSize">
        <SchemaPreviewPane
          :schema="renderableSchema"
          :diagnostics="previewDiagnostics"
          :diagnostics-open="diagnosticsOpen"
          :validation-enabled="validationEnabled"
          :state="previewState"
          @toggle-diagnostics="diagnosticsOpen = !diagnosticsOpen"
          @close-diagnostics="diagnosticsOpen = false"
        />
      </Pane>
    </Splitpanes>

    <WorkbenchSettingsPanel
      v-model:open="settingsOpen"
      v-model:pane-visibility="paneVisibility"
      v-model:editor-view-mode="editorViewMode"
      v-model:editor-sidebar-open="editorSidebarOpen"
      v-model:validation-enabled="validationEnabled"
      v-model:schema-draft="schemaDraft"
      v-model:current-theme="currentTheme"
    />
  </div>
</template>

<script setup lang="ts">
import { shallowRef, computed, watch } from 'vue'
import { Splitpanes, Pane } from 'splitpanes'
import type { JsonValue } from '@visual-json/vue'
import sampleSchema from '@/assets/sample-schema.json' with { type: 'json' }
import type {
  PreviewState,
  JsonEditorViewMode,
  SchemaDraftPreference,
  WorkbenchPaneVisibility,
  WorkbenchViewMode,
} from '@/types'
import { useMediaQuery } from '@vueuse/core'
import { useSchemaDiagnostics } from '@/composables/useSchemaDiagnostics'
import { useToast } from '@/composables/useToast'
import { useShareableJson } from '@/composables/useShareableJson'
import { useTheme } from '@/composables/useTheme'
import WorkbenchToolbar from '@/components/WorkbenchToolbar.vue'
import WorkbenchSettingsPanel from '@/components/WorkbenchSettingsPanel.vue'
import JsonEditorPane from '@/components/JsonEditorPane.vue'
import SchemaPreviewPane from '@/components/SchemaPreviewPane.vue'

const { show: showToast } = useToast()
const { currentTheme } = useTheme()
const { jsonContent, hasMalformedSharedHash, share } = useShareableJson(
  sampleSchema as JsonValue,
  showToast,
)
const isMobile = useMediaQuery('(max-width: 760px)')
const viewMode = shallowRef<WorkbenchViewMode>('editor')
const paneVisibility = shallowRef<WorkbenchPaneVisibility>('both')
const editorViewMode = shallowRef<JsonEditorViewMode>('tree')
const editorSidebarOpen = shallowRef(false)
const validationEnabled = shallowRef(true)
const schemaDraft = shallowRef<SchemaDraftPreference>('auto')
const diagnosticsOpen = shallowRef(false)
const settingsOpen = shallowRef(false)

const renderableSchema = computed<Record<string, unknown> | null>(() => {
  const value = jsonContent.value

  // Kong's renderer expects an object schema, while the editor can emit any JSON root.
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null
  }

  return value as Record<string, unknown>
})

const diagnostics = useSchemaDiagnostics(renderableSchema, {
  enabled: computed(() => validationEnabled.value),
  draftPreference: computed(() => schemaDraft.value),
})

const activeViewMode = computed<WorkbenchViewMode>(() => {
  if (paneVisibility.value === 'editor') return 'editor'
  if (paneVisibility.value === 'preview') return 'preview'
  return viewMode.value
})

const previewState = computed<PreviewState>(() => {
  if (hasMalformedSharedHash.value) {
    return {
      kind: 'empty',
      severity: 'error',
      title: 'Shared URL could not be loaded',
      message: 'The schema link is malformed or incomplete. The sample schema has been restored.',
    }
  }

  const value = jsonContent.value
  if (Array.isArray(value)) {
    return {
      kind: 'empty',
      severity: 'info',
      title: 'Array roots cannot be rendered',
      message:
        'Kong’s schema renderer expects a JSON object at the root. Change the root value to an object schema.',
    }
  }

  if (!value || typeof value !== 'object') {
    return {
      kind: 'empty',
      severity: 'info',
      title: 'Object schema required',
      message:
        'The preview needs a JSON object root. Primitive JSON values are valid JSON, but not renderable schemas here.',
    }
  }

  return { kind: 'ready' }
})

const previewDiagnostics = computed(() => {
  if (previewState.value.kind !== 'ready') return []
  return diagnostics.value
})

const editorSize = computed(() => 50)

watch([validationEnabled, previewState], () => {
  if (!validationEnabled.value || previewState.value.kind !== 'ready') {
    diagnosticsOpen.value = false
  }
})

watch(paneVisibility, (nextVisibility) => {
  if (nextVisibility === 'editor') {
    diagnosticsOpen.value = false
  }
})

function setMobileViewMode(nextViewMode: WorkbenchViewMode) {
  viewMode.value = nextViewMode
  if (paneVisibility.value !== 'both') {
    paneVisibility.value = nextViewMode
  }
}

function openSettings() {
  settingsOpen.value = true
}
</script>

<style scoped>
.workbench {
  height: 100vh;
  min-height: 0;
  overflow: hidden;
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr);
  background: var(--color-app-bg);
}

.container {
  grid-row: 2 / -1;
  height: 100%;
  min-height: 0;
  overflow: hidden;

  &.splitpanes {
    background: var(--color-app-bg);
  }

  .splitpanes__pane {
    width: 100%;
    min-height: 0;
    overflow: hidden;
    box-shadow: var(--shadow-app-inset);
  }
}

.desktop-pane,
.mobile-panel,
.desktop-single-pane {
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.desktop-single-pane {
  grid-row: 2 / -1;
  box-shadow: var(--shadow-app-inset);
}

.mobile-tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: var(--color-app-surface);
  border-bottom: 1px solid var(--color-app-border);
}

.mobile-tab {
  border-radius: 0;
  border: 0;
  border-bottom: 3px solid transparent;
  min-height: 44px;
  font-weight: 700;
}

.mobile-tab--active {
  border-bottom-color: var(--color-app-accent);
  color: var(--color-app-accent);
}

.mobile-workbench {
  grid-row: 3;
  min-height: 0;
  overflow: hidden;
}
</style>
