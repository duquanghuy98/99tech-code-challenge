export type Severity = 'critical' | 'warning' | 'minor'

export interface Issue {
  id: string
  severity: Severity
  bugSnippet: string
  fixSnippet: string
  originalLines: [number, number]
  refactoredLines: [number, number]
}

export interface IssueHighlightRange {
  original: [number, number]
  refactored: [number, number]
}

export interface IssueRef extends Issue {
  title: string
  detail: string
}

export interface IssueMarker {
  id: string
  firstLine: number
  isActive: boolean
}
