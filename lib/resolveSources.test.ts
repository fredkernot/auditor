import { describe, it, expect } from "vitest"
import { resolveSources, type CatalogueEntry } from "@/lib/resolveSources"

const catalogue: CatalogueEntry[] = [
  { id: "gov-isa", host: "gov.uk", title: "ISAs", url: "https://www.gov.uk/individual-savings-accounts" },
  { id: "mh-fund", host: "moneyhelper.org.uk", title: "Emergency fund", url: "https://www.moneyhelper.org.uk/en/savings/emergency" },
  // An entry whose host is NOT on the allowlist. Should never survive even
  // though it lives in the catalogue (belt-and-braces).
  { id: "bad-host", host: "evil.com", title: "Bad", url: "https://gov.uk.evil.com/phish" },
]

describe("resolveSources", () => {
  it("resolves a known id to its full entry", () => {
    const out = resolveSources(["gov-isa"], catalogue)
    expect(out).toHaveLength(1)
    expect(out[0].url).toBe("https://www.gov.uk/individual-savings-accounts")
    expect(out[0].title).toBe("ISAs")
  })

  it("drops an unknown / hallucinated id", () => {
    expect(resolveSources(["this-id-was-invented"], catalogue)).toEqual([])
  })

  it("a view of only unknown ids ends sourceless (flagged by the caller)", () => {
    expect(resolveSources(["nope-1", "nope-2"], catalogue)).toEqual([])
  })

  it("keeps the good id and drops the bad one in a mixed list", () => {
    const out = resolveSources(["nope", "gov-isa", "mh-fund"], catalogue)
    expect(out.map((e) => e.id)).toEqual(["gov-isa", "mh-fund"])
  })

  it("drops an off-allowlist catalogue entry (belt-and-braces)", () => {
    expect(resolveSources(["bad-host"], catalogue)).toEqual([])
  })

  it("deduplicates repeated ids", () => {
    expect(resolveSources(["gov-isa", "gov-isa"], catalogue)).toHaveLength(1)
  })

  it("handles empty and undefined input", () => {
    expect(resolveSources([], catalogue)).toEqual([])
    expect(resolveSources(undefined, catalogue)).toEqual([])
  })
})
