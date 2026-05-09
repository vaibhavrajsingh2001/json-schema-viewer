import { computed, ref, watch } from 'vue'

/**
 * Theme options exposed to the picker.
 *
 * Keep this list in sync with the matching `:root[data-theme='<id>']` token blocks in
 * `src/assets/themes.css`. The default Harbor theme is defined on `:root` itself.
 */
export const themes = [
  { id: 'harbor', label: 'Harbor' },
  { id: 'midnight', label: 'Midnight' },
  { id: 'forest', label: 'Forest' },
] as const

/** Valid theme ids derived from the configured theme list. */
export type ThemeId = (typeof themes)[number]['id']

const storageKey = 'json-schema-viewer-theme'
const fallbackTheme: ThemeId = 'harbor'

/** Returns true when a persisted string matches one of the supported theme ids. */
function isThemeId(value: string | null): value is ThemeId {
  return themes.some((theme) => theme.id === value)
}

/** Reads the saved theme safely, falling back when localStorage is unavailable or stale. */
function getInitialTheme(): ThemeId {
  if (typeof window === 'undefined') {
    return fallbackTheme
  }

  const storedTheme = window.localStorage.getItem(storageKey)
  return isThemeId(storedTheme) ? storedTheme : fallbackTheme
}

const currentTheme = ref<ThemeId>(getInitialTheme())

// Applying the theme to <html> keeps CSS theme switching global without prop drilling.
if (typeof window !== 'undefined') {
  watch(
    currentTheme,
    (theme) => {
      document.documentElement.dataset.theme = theme
      window.localStorage.setItem(storageKey, theme)
    },
    { immediate: true },
  )
}

/**
 * Provides shared theme state for any component that needs to read or update the active theme.
 *
 * The returned `currentTheme` ref is module-scoped, so multiple consumers stay in sync and the
 * watcher above persists/applies changes exactly once.
 */
export function useTheme() {
  const themeOptions = computed(() => themes)

  return {
    currentTheme,
    themeOptions,
  }
}
