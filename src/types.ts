export type SchemaDiagnosticSeverity = 'error' | 'warning' | 'info'
export type SchemaDiagnosticCategory =
  | 'syntax'
  | 'root'
  | 'draft'
  | 'schema'
  | 'reference'
  | 'renderer'

export interface SchemaDiagnostic {
  id: string
  severity: SchemaDiagnosticSeverity
  category: SchemaDiagnosticCategory
  title: string
  message: string
  action: string
  path?: string
  schemaPath?: string
  source?: string
}

export interface SchemaDiagnosticsSummary {
  severity: SchemaDiagnosticSeverity
  label: string
  detail: string
  issueCount: number
  errorCount: number
  warningCount: number
}

export type ShareResult =
  | {
      ok: true
      url: string
    }
  | {
      ok: false
      url: string
      reason: string
    }

export type ToastVariant = 'success' | 'error' | 'info'

export type WorkbenchViewMode = 'editor' | 'preview' | 'issues'

export type WorkbenchPaneVisibility = 'both' | 'editor' | 'preview'

export type JsonEditorViewMode = 'tree' | 'raw'

export type SchemaDraftPreference = 'auto' | '4' | '7' | '2019-09' | '2020-12'

export type PreviewState =
  | {
      kind: 'ready'
    }
  | {
      kind: 'empty'
      severity: 'error' | 'warning' | 'info'
      title: string
      message: string
    }
