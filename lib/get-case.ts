import type { CaseFile } from "@/lib/case"

/**
 * Data wiring for Auditor. This is intentionally the ONLY place that knows how
 * a case is fetched, so regenerating the UI never touches the network call.
 *
 * Calls the real backend at /api/case. The route always returns a JSON body the
 * UI can render: a full CaseFile, an early-return triage refusal, or an object
 * carrying an "error" field. Non-200 responses still carry usable JSON, so we
 * merge that body onto a safe fallback rather than throwing.
 */
export async function getCase(topic: string): Promise<CaseFile> {
  const fallback: CaseFile = {
    topic,
    cached: false,
    triage: { route: "error", reason: "" },
    facets: [],
    userVerdict: null,
    error: "Something went wrong while building your case. Please try again.",
  }

  const response = await fetch("/api/case", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic }),
  })

  let body: Partial<CaseFile> & { error?: string }
  try {
    body = await response.json()
  } catch {
    return fallback
  }

  if (!response.ok) {
    // 400 (bad topic) etc. still return JSON; surface it via the error field.
    return { ...fallback, ...body, topic }
  }

  return { ...(body as CaseFile), topic }
}
