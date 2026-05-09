# AGENTS.md

This guide is for LLM agents working in this repository. Keep it current when scripts,
architecture, or conventions change.

## Project Snapshot

`json-schema-viewer` is a small Vue 3 + Vite app for editing a JSON Schema and rendering
it as documentation.

Core stack:

- Vue 3 single-file components with `<script setup lang="ts">`
- Vite, using `rolldown-vite`
- pnpm
- TypeScript project references
- `@visual-json/vue` for the JSON editor
- `@kong/spec-renderer` for schema rendering
- `splitpanes` for the editor/preview layout
- `lz-string` for URL hash sharing
- `unplugin-icons` with local Iconify collections for Vue icon components

There is no backend. Share links encode the current JSON in `window.location.hash`.

## Useful Commands

Run from the repository root:

```sh
pnpm install
pnpm dev
pnpm build
pnpm type-check
pnpm lint
pnpm format
```

Notes:

- `pnpm build` runs TypeScript checking and then the Vite build.
- `pnpm lint` runs oxlint and ESLint, both with `--fix`.
- `pnpm format` only formats `src/`.
- There is currently no test runner configured.

## Code Map

- `src/main.ts`: app bootstrap and global stylesheet imports.
- `src/App.vue`: top navigation, share button, top-level `JsonViewer`, and toast mount.
- `src/components/JsonViewer.vue`: main coordinator for editor state, split panes,
  schema renderability checks, editor collapse behavior, and exposing `share()`.
- `src/components/JsonEditorPane.vue`: wraps `@visual-json/vue`'s `JsonEditor`.
- `src/components/SchemaPreviewPane.vue`: wraps Kong's `SchemaRenderer`.
- `src/components/PaneToggleButton.vue`: reusable absolute-positioned pane toggle.
- `src/components/ToastNotification.vue`: global toast UI.
- `src/composables/useShareableJson.ts`: owns editable JSON state and share-link behavior.
- `src/composables/useToast.ts`: module-level singleton toast state.
- `src/utils/share.ts`: encode/decode helpers for `#schema/` URLs.
- `src/assets/base.css`: design tokens, resets, Visual JSON and Kong renderer overrides.
- `src/assets/main.css`: global imports plus split pane splitter styling.
- `src/assets/sample-schema.json`: initial schema when no valid URL hash is present.
- `vite.config.ts`: Vite plugins, `@` alias, font/icon loading, and build externals.

## Data Flow

1. `App.vue` renders `JsonViewer` and calls its exposed `share()` method from the navbar.
2. `JsonViewer.vue` initializes `jsonContent` through `useShareableJson(...)`.
3. `useShareableJson` prefers a valid `#schema/` hash, otherwise uses
   `sample-schema.json`.
4. `JsonEditorPane` receives `jsonContent` through `v-model` and emits JSON changes.
5. `JsonViewer` only passes object-root JSON to `SchemaPreviewPane`; non-object roots render
   nothing because Kong's renderer expects an object schema.
6. `SchemaPreviewPane` renders the schema through `@kong/spec-renderer`.
7. Sharing compresses `jsonContent`, copies the full URL, updates the current hash with
   `history.replaceState`, and shows a toast.

## Conventions

- Prefer the `@/` alias for imports from `src`.
- Keep component state local unless it is intentionally shared. `useToast` is a deliberate
  module-level singleton.
- Use `JsonValue` from `@visual-json/vue` or `@visual-json/core` for arbitrary JSON values.
- Guard calls into `SchemaRenderer`: it should receive `Record<string, unknown> | null`,
  not arrays, primitives, or undefined.
- Styling is mostly CSS variables in `src/assets/base.css` plus scoped component styles.
- Global third-party theme overrides live in `base.css`; component-specific overrides should
  stay close to the relevant component.
- The app uses nested CSS syntax in Vue scoped styles and global CSS.
- Import UI icons from `~icons/<collection>/<icon>` and keep the matching `@iconify-json/*`
  collection package in `devDependencies`.
- Size icons compositionally with the global `.app-icon` utility and `font-size`; avoid
  hardcoded SVG `width`/`height` unless an icon genuinely needs a one-off override.
- Keep comments sparse and useful; existing comments explain integration quirks.

## Build And Integration Gotchas

- `vite.config.ts` intentionally externalizes `shiki/onig.wasm`. Preserve this unless you
  have verified the renderer/editor build no longer needs it.
- `@kong/spec-renderer/dist/style.css` and `splitpanes/dist/splitpanes.css` are imported in
  `src/main.ts`; do not remove them while those libraries are in use.
- `@visual-json/vue` injects default theme variables inline, so overrides under
  `[data-vj-root]` use `!important`.
- `env.d.ts` includes `unplugin-icons/types/vue` so TypeScript can resolve virtual
  `~icons/...` imports.
- `SchemaPreviewPane.vue` uses `:deep(...)` and CSS container queries to adjust Kong renderer
  layout inside a split pane.
- Share URLs use the exact prefix `#schema/`; changing it breaks existing links unless a
  migration path is added.
- `navigator.clipboard.writeText` can fail outside secure browser contexts. Current behavior
  logs the error and does not show a failure toast.

## Validation Checklist

Before handing off code changes, run the narrowest useful checks:

```sh
pnpm type-check
pnpm lint
pnpm build
```

For UI changes, also run `pnpm dev` and verify in a browser:

- sample schema renders on initial load
- JSON editor changes update the preview
- editor pane collapse/expand works
- editor sidepanel toggle works
- share button copies a URL and updates the hash
- loading a copied `#schema/` URL restores the schema

## When Adding Features

- Put cross-cutting browser/state utilities in `src/composables` or `src/utils`.
- Keep `JsonViewer.vue` as the coordinator for editor-preview behavior.
- Add new visible UI as focused components under `src/components`.
- If adding tests, document the new test command here and in `package.json`.
- If adding another renderer/editor dependency, check whether it needs global CSS imports,
  WASM/assets configuration, or CSS variable overrides.
