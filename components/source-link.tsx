import { ExternalLinkIcon } from "lucide-react"
import type { Source } from "@/lib/case"
import { sourceLabel } from "@/lib/case"
import { Badge } from "@/components/ui/badge"

export function SourceLink({ source }: { source: Source }) {
  return (
    <li className="flex items-baseline gap-2">
      <a
        href={source.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-baseline gap-1.5 break-all text-sm leading-relaxed text-clay underline decoration-clay/30 underline-offset-4 transition-colors hover:decoration-clay"
      >
        <ExternalLinkIcon className="size-3.5 shrink-0 translate-y-0.5" aria-hidden="true" />
        {sourceLabel(source.url)}
      </a>
      {source.verified ? (
        <Badge variant="secondary" className="shrink-0 text-[0.65rem] uppercase tracking-wide">
          verified
        </Badge>
      ) : null}
    </li>
  )
}
