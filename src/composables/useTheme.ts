import { computed, ref, watch } from 'vue'
import {
  fallbackTheme,
  themePreferences,
  themes,
  type ThemeId,
  type ThemePreference,
} from '@/constants/themes'

export {
  fallbackTheme,
  themeIds,
  themePreferences,
  themes,
  type ThemeId,
  type ThemePreference,
} from '@/constants/themes'

const storageKey = 'json-schema-viewer-theme'

/** Returns true when a persisted string matches one of the supported theme preferences. */
function isThemePreference(value: string | null): value is ThemePreference {
  return themePreferences.some((theme) => theme.id === value)
}

/** Reads the saved theme preference safely, falling back when localStorage is unavailable or stale. */
function getInitialThemePreference(): ThemePreference {
  if (typeof window === 'undefined') {
    return fallbackTheme
  }

  const storedTheme = window.localStorage.getItem(storageKey)
  return isThemePreference(storedTheme) ? storedTheme : fallbackTheme
}

const currentTheme = ref<ThemePreference>(getInitialThemePreference())
const prefersDark = ref(false)
const resolvedTheme = computed<ThemeId>(() => {
  if (currentTheme.value !== 'system') return currentTheme.value
  return prefersDark.value ? 'midnight' : fallbackTheme
})

// Applying the theme to <html> keeps CSS theme switching global without prop drilling.
if (typeof window !== 'undefined') {
  const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const updatePreferredScheme = () => {
    prefersDark.value = colorSchemeQuery.matches
  }

  updatePreferredScheme()
  colorSchemeQuery.addEventListener('change', updatePreferredScheme)

  watch(
    resolvedTheme,
    (theme) => {
      document.documentElement.dataset.theme = theme
    },
    { immediate: true },
  )

  watch(
    currentTheme,
    (theme) => {
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
  const themeOptions = computed(() => themePreferences)

  return {
    currentTheme,
    resolvedTheme,
    themeOptions,
  }
}
