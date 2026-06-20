import demoCase from "@/data/demo-case.json";

/**
 * Pre-run, curated CaseFile fallbacks served instantly for known demo
 * questions. This guarantees the stage demo is fast and well-sourced, and
 * never runs the live two-model pipeline cold. The cached file obeys the same
 * invariants as the live route: allowlist hosts only, deep links, and
 * userVerdict fixed to null. No verdict or agreement is computed here either.
 */

function normalizeTopic(topic: string): string {
  return topic.trim().toLowerCase().replace(/\s+/g, " ").replace(/[?.!]+$/g, "");
}

const CACHED_CASES = new Map<string, unknown>([
  [normalizeTopic(demoCase.topic), demoCase],
]);

export function getCachedCase(topic: string): unknown | null {
  return CACHED_CASES.get(normalizeTopic(topic)) ?? null;
}
