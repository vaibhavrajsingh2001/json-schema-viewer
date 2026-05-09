import { computed, type ComputedRef } from 'vue'
import { Validator, type SchemaDraft } from '@cfworker/json-schema'
import type { SchemaDiagnostic, SchemaDraftPreference } from '@/types'

const supportedDrafts = ['4', '7', '2019-09', '2020-12'] as const
const defaultDraft = '2020-12' satisfies SchemaDraft

interface DraftDetection {
  draft: SchemaDraft
  diagnostics: SchemaDiagnostic[]
}

function detectDraft(
  schema: Record<string, unknown>,
  draftPreference: SchemaDraftPreference,
): DraftDetection {
  if (draftPreference !== 'auto') {
    return {
      draft: draftPreference,
      diagnostics: [
        {
          severity: 'info',
          message: `Validating with draft ${draftPreference} from app settings.`,
          source: 'schema-diagnostics',
        },
      ],
    }
  }

  const declaredDraft = schema.$schema

  if (typeof declaredDraft !== 'string' || declaredDraft.trim() === '') {
    return {
      draft: defaultDraft,
      diagnostics: [
        {
          severity: 'info',
          message: 'No $schema was declared. Validating with draft 2020-12.',
          path: '/$schema',
          source: 'schema-diagnostics',
        },
      ],
    }
  }

  const matchedDraft = supportedDrafts.find((draft) => declaredDraft.includes(draft))

  if (matchedDraft) {
    return {
      draft: matchedDraft,
      diagnostics: [],
    }
  }

  return {
    draft: defaultDraft,
    diagnostics: [
      {
        severity: 'warning',
        message: `Unsupported or unknown $schema "${declaredDraft}". Validating with draft 2020-12.`,
        path: '/$schema',
        source: 'schema-diagnostics',
      },
    ],
  }
}

function toErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error)
}

function getValidationDiagnostics(
  validator: Validator,
  schema: Record<string, unknown>,
): SchemaDiagnostic[] {
  try {
    const result = validator.validate({})

    if (result.valid) {
      return [
        {
          severity: 'info',
          message: 'Schema is renderer-ready and accepts an empty example object.',
          source: 'schema-diagnostics',
        },
      ]
    }

    const failures = result.errors.slice(0, 5).map<SchemaDiagnostic>((error) => ({
      severity: 'warning',
      message: `Renderer-ready, but an empty example object fails validation: ${error.error}`,
      path: error.instanceLocation === '#' ? undefined : error.instanceLocation,
      source: error.keyword,
    }))

    if (result.errors.length > failures.length) {
      failures.push({
        severity: 'info',
        message: `${result.errors.length - failures.length} additional example validation issue(s) hidden.`,
        source: 'schema-diagnostics',
      })
    }

    return failures
  } catch (error) {
    return [
      {
        severity: 'error',
        message: `Example validation failed: ${toErrorMessage(error)}`,
        source: schema.$id ? String(schema.$id) : 'schema-diagnostics',
      },
    ]
  }
}

/**
 * Builds Cloudflare-compatible JSON Schema diagnostics for renderer-ready schemas.
 */
export function useSchemaDiagnostics(
  schema: ComputedRef<Record<string, unknown> | null>,
  options: {
    enabled: ComputedRef<boolean>
    draftPreference: ComputedRef<SchemaDraftPreference>
  },
): ComputedRef<SchemaDiagnostic[]> {
  return computed(() => {
    if (!options.enabled.value) return []
    if (!schema.value) return []

    const { draft, diagnostics } = detectDraft(schema.value, options.draftPreference.value)

    try {
      const validator = new Validator(schema.value, draft, false)
      return [...diagnostics, ...getValidationDiagnostics(validator, schema.value)]
    } catch (error) {
      return [
        ...diagnostics,
        {
          severity: 'error',
          message: `Validator setup failed: ${toErrorMessage(error)}`,
          source: 'schema-diagnostics',
        },
      ]
    }
  })
}
