import { validateUrl } from "@/lib/allowlist"

export type CatalogueEntry = {
  id: string
  host: string
  title: string
  url: string
}

/**
 * Pure resolver from cited catalogue ids to full entries.
 *
 * This replaces the old per-request reachability check entirely. Source
 * existence and liveness are guaranteed once, by hand, when the catalogue is
 * built, so there are NO network calls here and nothing is dropped for a 403.
 *
 *  - Unknown ids (a debater hallucinating an id) are dropped.
 *  - Duplicate ids are collapsed.
 *  - Belt-and-braces: any entry whose URL host is not on the allowlist is
 *    dropped even though the catalogue is curated.
 *
 * A view that resolves to zero entries is sourceless; the caller flags it
 * rather than silently emptying it.
 */
export function resolveSources(
  sourceIds: string[] | undefined,
  catalogue: CatalogueEntry[]
): CatalogueEntry[] {
  if (!sourceIds || sourceIds.length === 0) return []

  const byId = new Map(catalogue.map((entry) => [entry.id, entry]))
  const seen = new Set<string>()
  const resolved: CatalogueEntry[] = []

  for (const id of sourceIds) {
    const entry = byId.get(id)
    if (!entry) continue // unknown / hallucinated id
    if (seen.has(entry.id)) continue // dedupe
    if (validateUrl(entry.url) === null) continue // belt-and-braces allowlist
    seen.add(entry.id)
    resolved.push(entry)
  }

  return resolved
}
