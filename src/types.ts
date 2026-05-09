export type SchemaDiagnosticSeverity = 'error' | 'warning' | 'info'

export interface SchemaDiagnostic {
  severity: SchemaDiagnosticSeverity
  message: string
  path?: string
  source?: string
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

export type WorkbenchViewMode = 'editor' | 'preview'

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
