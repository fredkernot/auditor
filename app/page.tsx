import caseData from "@/data/demo-case.json"
import type { CaseFile } from "@/lib/case"
import { verdictOptions } from "@/lib/case"
import { FacetCard } from "@/components/facet-card"
import { Verdict } from "@/components/verdict"

const data = caseData as CaseFile

export default function Home() {
  const isDebatable = data.triage.route === "debatable"

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-12 px-6 py-16 sm:px-8 sm:py-24">
      <header className="flex flex-col gap-3">
        <span className="text-sm font-medium uppercase tracking-wide text-muted-foreground">The case</span>
        <h1 className="text-balance font-serif text-3xl leading-tight text-foreground sm:text-4xl">
          {data.topic}
        </h1>
      </header>

      {!isDebatable ? (
        <section className="rounded-lg border border-border bg-card p-6 sm:p-8">
          <p className="text-pretty text-lg leading-relaxed text-card-foreground">{data.triage.reason}</p>
        </section>
      ) : (
        <>
          <p className="text-pretty text-base leading-relaxed text-muted-foreground">
            {data.triage.reason}
          </p>

          <div className="flex flex-col gap-6">
            {data.facets.map((facet) => (
              <FacetCard key={facet.facetId} facet={facet} />
            ))}
          </div>

          <Verdict options={verdictOptions(data.topic)} />
        </>
      )}

      <footer className="border-t border-border pt-6">
        <p className="text-center text-sm text-muted-foreground">
          This is guidance, not regulated financial advice.
        </p>
      </footer>
    </main>
  )
}
