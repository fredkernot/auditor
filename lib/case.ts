export type Source = {
  url: string
  verified: boolean
}

export type DebaterView = {
  answer: string
  confidence: string
  sources: Source[]
  missingSources: boolean
}

export type Facet = {
  facetId: string
  question: string
  debaterA: DebaterView
  debaterB: DebaterView
}

export type Triage = {
  route: string
  reason: string
}

export type CaseFile = {
  topic: string
  cached: boolean
  triage: Triage
  facets: Facet[]
  userVerdict: string | null
}

// Derive a readable label from a source URL, since the data has no title field.
export function sourceLabel(url: string): string {
  try {
    const { hostname } = new URL(url)
    return hostname.replace(/^www\./, "")
  } catch {
    return url
  }
}

// Pull the two choices out of an "X or Y" style topic question so the verdict
// buttons stay faithful to the question and never imply a recommendation.
export function verdictOptions(topic: string): [string, string] {
  const cleaned = topic
    .replace(/\?+\s*$/, "")
    .replace(/^\s*should i\s+/i, "")
    .trim()

  const idx = cleaned.toLowerCase().lastIndexOf(" or ")
  if (idx === -1) {
    return ["Yes", "No"]
  }

  const first = cleaned.slice(0, idx).trim()
  const second = cleaned.slice(idx + 4).trim()

  const capitalize = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s)
  return [capitalize(first), capitalize(second)]
}
