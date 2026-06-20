import demoCase from "@/data/demo-case.json"
import type { CaseFile } from "@/lib/case"

/**
 * Data wiring for Auditor. This is intentionally the ONLY place that knows how
 * a case is fetched, so regenerating the UI never touches the network call.
 *
 * Right now it returns the bundled demo JSON after a short delay so the full
 * flow (input -> loading -> result) runs in preview without a backend.
 *
 * To go live, delete the demo block below and use the real call instead:
 *
 *   const response = await fetch("/api/case", {
 *     method: "POST",
 *     headers: { "Content-Type": "application/json" },
 *     body: JSON.stringify({ topic }),
 *   })
 *   return (await response.json()) as CaseFile
 */
export async function getCase(topic: string): Promise<CaseFile> {
  // --- DEMO ONLY: remove this block when wiring the real backend ---------
  await new Promise((resolve) => setTimeout(resolve, 2600))
  return { ...(demoCase as CaseFile), topic }
  // -----------------------------------------------------------------------
}
