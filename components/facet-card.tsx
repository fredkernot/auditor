import type { Facet } from "@/lib/case"
import { DebaterView } from "@/components/debater-view"

export function FacetCard({ facet }: { facet: Facet }) {
  return (
    <article className="rounded-lg border border-border bg-card p-6 shadow-sm sm:p-8">
      <h2 className="text-balance font-serif text-xl leading-snug text-card-foreground sm:text-2xl">
        {facet.question}
      </h2>

      <div className="mt-6 flex flex-col gap-8 md:flex-row md:gap-6">
        <DebaterView label="Model A" view={facet.debaterA} question={facet.question} />
        <div className="hidden w-px shrink-0 self-stretch bg-border md:block" aria-hidden="true" />
        <div className="h-px w-full bg-border md:hidden" aria-hidden="true" />
        <DebaterView label="Model B" view={facet.debaterB} question={facet.question} />
      </div>
    </article>
  )
}
