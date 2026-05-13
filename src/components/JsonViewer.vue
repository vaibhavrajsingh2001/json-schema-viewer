<template>
  <div class="workbench">
    <WorkbenchToolbar
      :summary="diagnosticsSummary"
      :issues-open="issuesOpen"
      :on-share="share"
      :on-open-settings="openSettings"
      :on-toggle-issues="toggleIssues"
    />

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
      <button
        id="issues-tab"
        class="mobile-tab"
        :class="{ 'mobile-tab--active': activeViewMode === 'issues' }"
        type="button"
        role="tab"
        :aria-selected="activeViewMode === 'issues'"
        aria-controls="issues-panel"
        @click="setMobileViewMode('issues')"
      >
        Issues
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
          v-model:raw-error="rawError"
          v-model:sidebar-open="editorSidebarOpen"
          v-model:view-mode="editorViewMode"
          :target-path="targetPath"
          @targeted="targetPath = null"
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
          :validation-enabled="validationEnabled"
          :state="previewState"
          :summary="diagnosticsSummary"
          :raw-error="rawError"
        />
      </section>
      <section
        id="issues-panel"
        class="mobile-panel"
        role="tabpanel"
        aria-labelledby="issues-tab"
        :hidden="activeViewMode !== 'issues'"
        :inert="activeViewMode !== 'issues'"
      >
        <SchemaIssuesPanel
          :diagnostics="visibleDiagnostics"
          :summary="diagnosticsSummary"
          @close="closeIssues"
          @focus-issue="focusIssue"
          @copied="handlePathCopied"
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
        v-model:raw-error="rawError"
        v-model:sidebar-open="editorSidebarOpen"
        v-model:view-mode="editorViewMode"
        :target-path="targetPath"
        @targeted="targetPath = null"
      />
    </section>

    <section v-else-if="paneVisibility === 'preview'" class="desktop-single-pane">
      <div class="preview-workspace" :class="{ 'preview-workspace--with-issues': issuesOpen }">
        <SchemaPreviewPane
          :schema="renderableSchema"
          :validation-enabled="validationEnabled"
          :state="previewState"
          :summary="diagnosticsSummary"
          :raw-error="rawError"
        />
        <SchemaIssuesPanel
          v-if="issuesOpen"
          :diagnostics="visibleDiagnostics"
          :summary="diagnosticsSummary"
          @close="closeIssues"
          @focus-issue="focusIssue"
          @copied="handlePathCopied"
        />
      </div>
    </section>

    <Splitpanes v-else class="container">
      <Pane :size="editorSize" min-size="0">
        <section id="desktop-editor-pane" class="desktop-pane" aria-label="JSON editor">
          <JsonEditorPane
            v-model="jsonContent"
            v-model:raw-error="rawError"
            v-model:sidebar-open="editorSidebarOpen"
            v-model:view-mode="editorViewMode"
            :target-path="targetPath"
            @targeted="targetPath = null"
          />
        </section>
      </Pane>
      <Pane :size="100 - editorSize">
        <div class="preview-workspace" :class="{ 'preview-workspace--with-issues': issuesOpen }">
          <SchemaPreviewPane
            :schema="renderableSchema"
            :validation-enabled="validationEnabled"
            :state="previewState"
            :summary="diagnosticsSummary"
            :raw-error="rawError"
          />
          <SchemaIssuesPanel
            v-if="issuesOpen"
            :diagnostics="visibleDiagnostics"
            :summary="diagnosticsSummary"
            @close="closeIssues"
            @focus-issue="focusIssue"
            @copied="handlePathCopied"
          />
        </div>
      </Pane>
    </Splitpanes>

    <WorkbenchSettingsPanel
      v-model:open="settingsOpen"
      v-model:pane-visibility="paneVisibility"
      v-model:validation-enabled="validationEnabled"
      v-model:schema-draft="schemaDraft"
      v-model:current-theme="currentTheme"
    />
  </div>
</template>

<script setup lang="ts">
import { shallowRef, computed, nextTick, watch } from 'vue'
import { Splitpanes, Pane } from 'splitpanes'
import type { JsonValue } from '@visual-json/vue'
import sampleSchema from '@/assets/sample-schema.json' with { type: 'json' }
import type {
  PreviewState,
  JsonEditorViewMode,
  SchemaDiagnostic,
  SchemaDraftPreference,
  WorkbenchPaneVisibility,
  WorkbenchViewMode,
} from '@/types'
import { useMediaQuery } from '@vueuse/core'
import { summarizeDiagnostics, useSchemaDiagnostics } from '@/composables/useSchemaDiagnostics'
import { useToast } from '@/composables/useToast'
import { useShareableJson } from '@/composables/useShareableJson'
import { useTheme } from '@/composables/useTheme'
import WorkbenchToolbar from '@/components/WorkbenchToolbar.vue'
import WorkbenchSettingsPanel from '@/components/WorkbenchSettingsPanel.vue'
import JsonEditorPane from '@/components/JsonEditorPane.vue'
import SchemaIssuesPanel from '@/components/SchemaIssuesPanel.vue'
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
const issuesOpen = shallowRef(false)
const settingsOpen = shallowRef(false)
const rawError = shallowRef<string | null>(null)
const targetPath = shallowRef<string | null>(null)

const renderableSchema = computed<Record<string, unknown> | null>(() => {
  const value = jsonContent.value

  // Kong's renderer expects an object schema, while the editor can emit any JSON root.
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null
  }

  return value as Record<string, unknown>
})

const schemaDiagnostics = useSchemaDiagnostics(renderableSchema, {
  enabled: computed(() => validationEnabled.value),
  draftPreference: computed(() => schemaDraft.value),
})

const activeViewMode = computed<WorkbenchViewMode>(() => {
  if (issuesOpen.value && viewMode.value === 'issues') return 'issues'
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

const visibleDiagnostics = computed<SchemaDiagnostic[]>(() => {
  const diagnostics: SchemaDiagnostic[] = []

  if (rawError.value) {
    diagnostics.push({
      id: 'raw-json-syntax',
      severity: 'error',
      category: 'syntax',
      title: 'Raw JSON syntax error',
      message: rawError.value,
      action: 'Fix the JSON syntax in Raw mode to resume live preview updates.',
      source: 'raw-editor',
    })
  }

  if (previewState.value.kind !== 'ready') {
    diagnostics.push({
      id: 'preview-root-state',
      severity: previewState.value.severity,
      category: 'root',
      title: previewState.value.title,
      message: previewState.value.message,
      action: 'Use an object at the JSON root so the documentation preview can render.',
      source: 'preview',
    })
  }

  if (previewState.value.kind === 'ready') {
    diagnostics.push(...schemaDiagnostics.value)
  }

  return diagnostics
})

const diagnosticsSummary = computed(() => {
  const hasLocalIssues = rawError.value || previewState.value.kind !== 'ready'
  return summarizeDiagnostics(
    visibleDiagnostics.value,
    hasLocalIssues ? true : validationEnabled.value,
  )
})

const editorSize = computed(() => 50)

watch([validationEnabled, previewState], () => {
  if (!validationEnabled.value && previewState.value.kind === 'ready') {
    issuesOpen.value = false
  }
})

watch(paneVisibility, (nextVisibility) => {
  if (nextVisibility === 'editor') {
    issuesOpen.value = false
  }
})

function setMobileViewMode(nextViewMode: WorkbenchViewMode) {
  viewMode.value = nextViewMode
  if (nextViewMode === 'issues') {
    issuesOpen.value = true
    return
  }

  if (paneVisibility.value !== 'both') {
    paneVisibility.value = nextViewMode
  }
}

function toggleIssues() {
  if (issuesOpen.value) {
    closeIssues()
    return
  }

  issuesOpen.value = true
  if (issuesOpen.value && isMobile.value) {
    viewMode.value = 'issues'
  }
}

function closeIssues() {
  issuesOpen.value = false
  if (isMobile.value && viewMode.value === 'issues') {
    viewMode.value = paneVisibility.value === 'preview' ? 'preview' : 'editor'
  }
}

function focusIssue(diagnostic: SchemaDiagnostic) {
  const path = diagnostic.path
  if (path) {
    targetPath.value = null
    nextTick(() => {
      targetPath.value = path
    })
  }

  issuesOpen.value = false
  viewMode.value = 'editor'
  if (paneVisibility.value === 'preview') {
    paneVisibility.value = 'both'
  }
}

function handlePathCopied(path: string) {
  showToast(`Copied ${path}.`, 'success')
}

function openSettings() {
  settingsOpen.value = true
}
</script>

<style scoped>
.workbench {
  background: var(--color-app-bg);
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr);
  height: 100vh;
  min-height: 0;
  overflow: hidden;
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
    min-height: 0;
    overflow: hidden;
    width: 100%;
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
}

.preview-workspace {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  height: 100%;
  min-height: 0;
  position: relative;
}

.preview-workspace--with-issues {
  grid-template-columns: minmax(0, 1fr);
}

.preview-workspace--with-issues :deep(.issues-panel) {
  bottom: 0;
  box-shadow: var(--shadow-app-md);
  max-width: min(24rem, 55%);
  position: absolute;
  right: 0;
  top: 0;
  width: 22rem;
  z-index: 5;
}

.mobile-tabs {
  background: var(--color-app-surface);
  border-bottom: 1px solid var(--color-app-border);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.mobile-tab {
  border: 0;
  border-bottom: 3px solid transparent;
  border-radius: 0;
  font-weight: 800;
  min-height: 44px;
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

@media (max-width: 1020px) {
  .preview-workspace--with-issues :deep(.issues-panel) {
    max-width: min(22rem, 64%);
    width: 20rem;
  }
}
</style>
