import { computed, type ComputedRef } from 'vue'
import Ajv, { type ErrorObject } from 'ajv'
import Ajv2019 from 'ajv/dist/2019'
import Ajv2020 from 'ajv/dist/2020'
import AjvDraft04 from 'ajv-draft-04'
import addFormats from 'ajv-formats'
import type {
  SchemaDiagnostic,
  SchemaDiagnosticsSummary,
  SchemaDraftPreference,
} from '@/types'

type SchemaDraft = Exclude<SchemaDraftPreference, 'auto'>

const supportedDrafts = ['4', '7', '2019-09', '2020-12'] as const satisfies readonly SchemaDraft[]
const defaultDraft = '2020-12' satisfies SchemaDraft
const draftSchemaUris = {
  '4': 'http://json-schema.org/draft-04/schema#',
  '7': 'http://json-schema.org/draft-07/schema#',
  '2019-09': 'https://json-schema.org/draft/2019-09/schema',
  '2020-12': 'https://json-schema.org/draft/2020-12/schema',
} satisfies Record<SchemaDraft, string>

type AjvInstance = InstanceType<typeof Ajv>

interface DraftDetection {
  draft: SchemaDraft
  diagnostics: SchemaDiagnostic[]
}

function createDiagnostic(
  diagnostic: Omit<SchemaDiagnostic, 'id'> & { id?: string },
): SchemaDiagnostic {
  return {
    id:
      diagnostic.id ??
      [
        diagnostic.category,
        diagnostic.severity,
        diagnostic.path,
        diagnostic.schemaPath,
        diagnostic.title,
        diagnostic.message,
        diagnostic.source,
      ]
        .filter(Boolean)
        .join(':'),
    ...diagnostic,
  }
}

function cloneSchema(schema: Record<string, unknown>) {
  return JSON.parse(JSON.stringify(schema)) as Record<string, unknown>
}

function cloneSchemaForAjv(schema: Record<string, unknown>, draft: SchemaDraft) {
  const schemaCopy = cloneSchema(schema)

  if (typeof schemaCopy.$schema !== 'string' || !schemaCopy.$schema.includes(draft)) {
    schemaCopy.$schema = draftSchemaUris[draft]
  }

  return schemaCopy
}

function toErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error)
}

function createAjv(draft: SchemaDraft): AjvInstance {
  const options = {
    allErrors: true,
    strict: false,
    verbose: true,
  }

  if (draft === '4') {
    const ajv = new AjvDraft04(options) as AjvInstance
    addFormats(ajv)
    return ajv
  }

  if (draft === '2019-09') {
    const ajv = new Ajv2019(options)
    addFormats(ajv)
    return ajv
  }

  if (draft === '2020-12') {
    const ajv = new Ajv2020(options)
    addFormats(ajv)
    return ajv
  }

  const ajv = new Ajv(options)
  addFormats(ajv)
  return ajv
}

function detectDraft(
  schema: Record<string, unknown>,
  draftPreference: SchemaDraftPreference,
): DraftDetection {
  if (draftPreference !== 'auto') {
    return {
      draft: draftPreference,
      diagnostics: [
        createDiagnostic({
          severity: 'info',
          category: 'draft',
          title: `Using draft ${draftPreference}`,
          message: `Schema validation is using draft ${draftPreference} from app settings.`,
          action: 'Switch Draft back to Auto if the schema declares a different version.',
          path: '/$schema',
          source: 'schema-diagnostics',
        }),
      ],
    }
  }

  const declaredDraft = schema.$schema

  if (typeof declaredDraft !== 'string' || declaredDraft.trim() === '') {
    return {
      draft: defaultDraft,
      diagnostics: [
        createDiagnostic({
          severity: 'info',
          category: 'draft',
          title: 'No $schema declared',
          message: 'Validation is using draft 2020-12 because the schema does not declare a draft.',
          action: 'Add a $schema URI when you want draft-specific validation.',
          path: '/$schema',
          source: 'schema-diagnostics',
        }),
      ],
    }
  }

  const matchedDraft = supportedDrafts.find((draft) => declaredDraft.includes(draft))

  if (matchedDraft) {
    return {
      draft: matchedDraft,
      diagnostics: [
        createDiagnostic({
          severity: 'info',
          category: 'draft',
          title: `Draft ${matchedDraft} detected`,
          message: `Validation is using the declared ${declaredDraft}.`,
          action: 'No action needed.',
          path: '/$schema',
          source: declaredDraft,
        }),
      ],
    }
  }

  return {
    draft: defaultDraft,
    diagnostics: [
      createDiagnostic({
        severity: 'warning',
        category: 'draft',
        title: 'Unknown $schema draft',
        message: `The declared $schema "${declaredDraft}" is not one of the supported drafts.`,
        action: 'Use draft 4, 7, 2019-09, or 2020-12, or choose a draft in settings.',
        path: '/$schema',
        source: 'schema-diagnostics',
      }),
    ],
  }
}

function formatAjvMessage(error: ErrorObject) {
  const detail = error.message ?? 'Schema validation failed.'

  if (error.keyword === 'type' && error.params && 'type' in error.params) {
    return `${detail} Expected ${String(error.params.type)}.`
  }

  if (error.keyword === 'required' && error.params && 'missingProperty' in error.params) {
    return `${detail} Missing ${String(error.params.missingProperty)}.`
  }

  return detail
}

function getSchemaQualityDiagnostics(
  schema: Record<string, unknown>,
  draft: SchemaDraft,
): SchemaDiagnostic[] {
  const ajv = createAjv(draft)
  const diagnostics: SchemaDiagnostic[] = []

  try {
    const schemaIsValid = ajv.validateSchema(schema)

    if (!schemaIsValid) {
      const errors = ajv.errors ?? []
      diagnostics.push(
        ...errors.slice(0, 8).map((error, index) =>
          createDiagnostic({
            id: `schema-quality:${index}:${error.keyword}:${error.instancePath}:${error.schemaPath}`,
            severity: 'error',
            category: error.keyword === '$ref' || error.keyword === 'ref' ? 'reference' : 'schema',
            title: 'Schema keyword is invalid',
            message: formatAjvMessage(error),
            action: 'Fix this schema keyword so it matches the active JSON Schema draft.',
            path: error.instancePath || undefined,
            schemaPath: error.schemaPath,
            source: error.keyword,
          }),
        ),
      )
    }

    ajv.compile(schema)
  } catch (error) {
    diagnostics.push(
      createDiagnostic({
        severity: 'error',
        category: toErrorMessage(error).includes('ref') ? 'reference' : 'schema',
        title: 'Schema setup failed',
        message: toErrorMessage(error),
        action: 'Check unresolved $ref values, duplicate $id values, and draft-specific syntax.',
        source: 'ajv',
      }),
    )
  }

  if (diagnostics.length === 0) {
    diagnostics.push(
      createDiagnostic({
        severity: 'info',
        category: 'schema',
        title: 'Schema is valid',
        message: `The schema is valid for JSON Schema draft ${draft}.`,
        action: 'No schema-quality fix is needed.',
        source: 'ajv',
      }),
    )
  }

  return diagnostics
}

function getRendererDiagnostics(schema: Record<string, unknown>, draft: SchemaDraft): SchemaDiagnostic[] {
  const ajv = createAjv(draft)

  try {
    ajv.compile(schema)

    return [
      createDiagnostic({
        severity: 'info',
        category: 'renderer',
        title: 'Preview is renderer-ready',
        message: 'The schema can be compiled for preview readiness checks.',
        action: 'No renderer fix is needed.',
        source: 'schema-diagnostics',
      }),
    ]
  } catch (error) {
    return [
      createDiagnostic({
        severity: 'error',
        category: 'renderer',
        title: 'Renderer validation failed',
        message: toErrorMessage(error),
        action: 'Check whether the schema uses unsupported references or malformed nested schemas.',
        source: schema.$id ? String(schema.$id) : 'ajv',
      }),
    ]
  }
}

/**
 * Builds JSON Schema diagnostics for schema quality and renderer readiness.
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
    const schemaCopy = cloneSchemaForAjv(schema.value, draft)

    return [
      ...diagnostics,
      ...getSchemaQualityDiagnostics(schemaCopy, draft),
      ...getRendererDiagnostics(schemaCopy, draft),
    ]
  })
}

export function summarizeDiagnostics(
  diagnostics: SchemaDiagnostic[],
  validationEnabled: boolean,
): SchemaDiagnosticsSummary {
  if (!validationEnabled) {
    return {
      severity: 'info',
      label: 'Validation off',
      detail: 'Schema quality checks are disabled.',
      issueCount: 0,
      errorCount: 0,
      warningCount: 0,
    }
  }

  const errorCount = diagnostics.filter((diagnostic) => diagnostic.severity === 'error').length
  const warningCount = diagnostics.filter((diagnostic) => diagnostic.severity === 'warning').length
  const issueCount = errorCount + warningCount

  if (errorCount > 0) {
    return {
      severity: 'error',
      label: `${errorCount} error${errorCount === 1 ? '' : 's'}`,
      detail: 'Schema quality needs attention.',
      issueCount,
      errorCount,
      warningCount,
    }
  }

  if (warningCount > 0) {
    return {
      severity: 'warning',
      label: `${warningCount} warning${warningCount === 1 ? '' : 's'}`,
      detail: 'Schema renders, but there are review notes.',
      issueCount,
      errorCount,
      warningCount,
    }
  }

  return {
    severity: 'info',
    label: 'Valid schema',
    detail: 'Schema quality checks are quiet.',
    issueCount,
    errorCount,
    warningCount,
  }
}
