import type { Source } from "@/lib/case"
import { sourceLabel } from "@/lib/case"

export function SourceLink({ source }: { source: Source }) {
  return (
    <li className="flex items-baseline gap-2">
      <a
        href={source.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-accent underline decoration-border underline-offset-4 transition-colors hover:decoration-accent break-words"
      >
        {sourceLabel(source.url)}
      </a>
      {source.verified ? (
        <span className="text-[0.7rem] uppercase tracking-wide text-muted-foreground">verified</span>
      ) : null}
    </li>
  )
}
