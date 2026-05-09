<template>
  <Transition name="diagnostics-drawer">
    <aside
      v-if="open"
      id="schema-diagnostics-drawer"
      class="diagnostics-drawer"
      aria-labelledby="diagnostics-drawer-heading"
      role="dialog"
      aria-modal="false"
    >
      <header class="drawer-header">
        <div>
          <p>{{ summary }}</p>
          <h3 id="diagnostics-drawer-heading">Schema validation</h3>
        </div>
        <button
          type="button"
          class="icon-btn"
          aria-label="Close schema validation"
          @click="emit('close')"
        >
          <IconX class="app-icon" aria-hidden="true" />
        </button>
      </header>

      <ul v-if="diagnostics.length" class="diagnostics" aria-label="Schema diagnostics">
        <li
          v-for="diagnostic in diagnostics"
          :key="`${diagnostic.severity}-${diagnostic.source}-${diagnostic.path}-${diagnostic.message}`"
          class="diagnostic"
          :class="`diagnostic--${diagnostic.severity}`"
        >
          <component
            :is="diagnostic.severity === 'error' ? IconCircleAlert : IconInfo"
            class="app-icon"
            aria-hidden="true"
          />
          <div>
            <strong>{{ diagnostic.severity }}</strong>
            <span>{{ diagnostic.message }}</span>
            <code v-if="diagnostic.path">{{ diagnostic.path }}</code>
          </div>
        </li>
      </ul>
      <p v-else class="empty-diagnostics">Validation is quiet for the current schema.</p>
    </aside>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { SchemaDiagnostic } from '@/types'
import IconCircleAlert from '~icons/lucide/circle-alert'
import IconInfo from '~icons/lucide/info'
import IconX from '~icons/lucide/x'

const props = defineProps<{
  diagnostics: SchemaDiagnostic[]
  open: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const summary = computed(() => {
  if (props.diagnostics.length === 0) return 'No diagnostics'
  return `${props.diagnostics.length} diagnostic${props.diagnostics.length === 1 ? '' : 's'}`
})
</script>

<style scoped>
.diagnostics-drawer {
  position: absolute;
  inset-inline: 1rem;
  bottom: 1rem;
  z-index: 12;
  max-height: min(58vh, 32rem);
  overflow: auto;
  background: var(--color-app-surface);
  border: 1px solid var(--color-app-border);
  border-radius: 8px;
  box-shadow: var(--shadow-app-md);
  padding: 0.9rem;
}

.drawer-header {
  align-items: flex-start;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.75rem;

  p {
    color: var(--color-app-text-muted);
    font-size: 0.78rem;
    margin: 0 0 0.2rem;
  }

  h3 {
    font-size: 0.95rem;
    font-weight: 700;
    margin: 0;
  }
}

.icon-btn {
  align-items: center;
  background: var(--color-app-surface-raised);
  border-color: var(--color-app-border);
  display: inline-flex;
  justify-content: center;
  min-height: 32px;
  min-width: 32px;

  .app-icon {
    font-size: 1rem;
  }
}

.diagnostics {
  display: grid;
  gap: 0.55rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.diagnostic {
  align-items: flex-start;
  border-left: 3px solid var(--color-app-info-border);
  display: grid;
  gap: 0.55rem;
  grid-template-columns: auto 1fr;
  padding: 0.35rem 0.25rem 0.35rem 0.65rem;

  .app-icon,
  strong {
    color: var(--color-app-info-text);
  }

  strong {
    display: block;
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
  }

  span {
    display: block;
  }

  code {
    color: var(--color-app-text-muted);
    display: inline-block;
    font-size: 0.78rem;
    margin-top: 0.2rem;
  }
}

.diagnostic--warning {
  border-left-color: var(--color-app-warning-border);

  .app-icon,
  strong {
    color: var(--color-app-warning-text);
  }
}

.diagnostic--error {
  border-left-color: var(--color-app-error-border);

  .app-icon,
  strong {
    color: var(--color-app-error-text);
  }
}

.empty-diagnostics {
  color: var(--color-app-text-muted);
  margin: 0;
}

.diagnostics-drawer-enter-active,
.diagnostics-drawer-leave-active {
  transition:
    opacity 0.18s,
    transform 0.18s;
}

.diagnostics-drawer-enter-from,
.diagnostics-drawer-leave-to {
  opacity: 0;
  transform: translateY(0.75rem);
}
</style>
