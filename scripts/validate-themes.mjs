import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { createJiti } from 'jiti'

const jiti = createJiti(import.meta.url)
const themeCssPath = resolve('src/assets/themes.css')

/** Returns each selector block body from a CSS file without needing a full CSS parser. */
function parseCssBlocks(css) {
  const cssWithoutComments = css.replace(/\/\*[\s\S]*?\*\//g, '')

  return [...cssWithoutComments.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(([, selector, body]) => ({
    selector: selector.trim(),
    body,
  }))
}

/** Extracts all theme primitive custom property names from a CSS declaration block. */
function parseThemeTokens(blockBody) {
  return new Set(
    [...blockBody.matchAll(/--theme-[\w-]+\s*:/g)].map(([token]) => token.slice(0, -1).trim()),
  )
}

/** Formats set contents for readable validation errors. */
function formatSet(values) {
  return [...values].sort().join(', ')
}

/** Returns values present in `left` but absent in `right`. */
function difference(left, right) {
  return new Set([...left].filter((value) => !right.has(value)))
}

/**
 * Validates that every TypeScript theme id has CSS and every CSS theme defines the same tokens.
 *
 * The fallback theme intentionally uses the base `:root` block so the app has usable colors even
 * before Vue applies `data-theme` during startup.
 */
function validateThemes({ themeIds, fallbackTheme, cssBlocks }) {
  const errors = []
  const configuredThemeIds = new Set(themeIds)
  const themedBlocks = new Map()
  const rootBlock = cssBlocks.find((block) => block.selector === ':root')

  for (const block of cssBlocks) {
    const match = block.selector.match(/^:root\[data-theme=['"]([^'"]+)['"]\]$/)
    if (match) {
      themedBlocks.set(match[1], block)
    }
  }

  if (!configuredThemeIds.has(fallbackTheme)) {
    errors.push(`Fallback theme "${fallbackTheme}" is not listed in themeIds.`)
  }

  if (!rootBlock) {
    errors.push('Missing base `:root` block for the fallback theme.')
  }

  for (const themeId of configuredThemeIds) {
    if (themeId !== fallbackTheme && !themedBlocks.has(themeId)) {
      errors.push(
        `Theme "${themeId}" is listed in themeIds but has no :root[data-theme='${themeId}'] block.`,
      )
    }
  }

  for (const themeId of themedBlocks.keys()) {
    if (!configuredThemeIds.has(themeId)) {
      errors.push(`Theme CSS block "${themeId}" exists but is not listed in themeIds.`)
    }
  }

  if (!rootBlock) {
    return errors
  }

  const requiredTokens = parseThemeTokens(rootBlock.body)
  if (requiredTokens.size === 0) {
    errors.push('Base `:root` block does not define any `--theme-*` tokens.')
    return errors
  }

  for (const [themeId, block] of themedBlocks.entries()) {
    const tokens = parseThemeTokens(block.body)
    const missing = difference(requiredTokens, tokens)
    const extra = difference(tokens, requiredTokens)

    if (missing.size > 0) {
      errors.push(`Theme "${themeId}" is missing tokens: ${formatSet(missing)}.`)
    }

    if (extra.size > 0) {
      errors.push(`Theme "${themeId}" defines unknown tokens: ${formatSet(extra)}.`)
    }
  }

  return errors
}

const [{ themeIds, fallbackTheme }, themeCss] = await Promise.all([
  jiti.import('../src/constants/themes.ts'),
  readFile(themeCssPath, 'utf8'),
])

const errors = validateThemes({
  themeIds,
  fallbackTheme,
  cssBlocks: parseCssBlocks(themeCss),
})

if (errors.length > 0) {
  console.error(['Theme validation failed:', ...errors.map((error) => `- ${error}`)].join('\n'))
  process.exitCode = 1
} else {
  console.log('Theme validation passed.')
}
