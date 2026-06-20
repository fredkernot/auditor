import type { Facet } from "@/lib/case"
import { DebaterView } from "@/components/debater-view"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export function FacetCard({ facet, index }: { facet: Facet; index: number }) {
  return (
    <Card className="gap-0 overflow-hidden py-0">
      <CardHeader className="gap-2 border-b border-border bg-muted/40 px-6 py-5 [.border-b]:pb-5">
        <span className="font-mono text-xs text-muted-foreground">{`Facet ${index + 1}`}</span>
        <CardTitle className="text-pretty font-serif text-lg font-normal leading-snug text-foreground">
          {facet.question}
        </CardTitle>
      </CardHeader>

      <CardContent className="px-6 py-6">
        <div className="flex flex-col gap-6 md:flex-row md:gap-0">
          <div className="flex md:flex-1 md:pr-8">
            <DebaterView label="Model A" view={facet.debaterA} />
          </div>

          <Separator orientation="horizontal" className="md:hidden" />
          <Separator orientation="vertical" className="hidden h-auto md:block" />

          <div className="flex md:flex-1 md:pl-8">
            <DebaterView label="Model B" view={facet.debaterB} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
