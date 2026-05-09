/**
 * Canonical list of concrete theme ids.
 *
 * Keep this tuple in sync with the matching `:root[data-theme='<id>']` token blocks in
 * `src/assets/themes.css`. The default Harbor theme is defined on `:root` itself.
 */
export const themeIds = ['harbor', 'midnight', 'forest'] as const

/** Valid theme ids derived from the canonical theme id tuple. */
export type ThemeId = (typeof themeIds)[number]
export type ThemePreference = 'system' | ThemeId

/** Labels keyed by theme id; `satisfies` enforces every ThemeId has exactly one label. */
const themeLabels = {
  harbor: 'Harbor',
  midnight: 'Midnight',
  forest: 'Forest',
} satisfies Record<ThemeId, string>

/** Theme options exposed to the picker. */
export const themes = themeIds.map((id) => ({ id, label: themeLabels[id] }))
export const themePreferences = [{ id: 'system', label: 'System' }, ...themes] satisfies Array<{
  id: ThemePreference
  label: string
}>

/** Theme used before any persisted user preference is loaded. */
export const fallbackTheme: ThemeId = 'harbor'
