import type { DebaterView as DebaterViewType } from "@/lib/case"
import { SourceLink } from "@/components/source-link"

export function DebaterView({
  label,
  view,
  question,
}: {
  label: string
  view: DebaterViewType
  question: string
}) {
  const checkUrl = `https://www.google.com/search?q=${encodeURIComponent(question)}`

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">{label}</h3>
        <span className="text-xs text-muted-foreground">Confidence: {view.confidence}</span>
      </div>

      <p className="text-[0.975rem] leading-relaxed text-card-foreground text-pretty">{view.answer}</p>

      <div className="mt-auto flex flex-col gap-3 pt-2">
        {view.sources.length > 0 ? (
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Sources</span>
            <ul className="flex flex-col gap-1.5">
              {view.sources.map((source) => (
                <SourceLink key={source.url} source={source} />
              ))}
            </ul>
          </div>
        ) : null}

        <a
          href={checkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-fit items-center gap-1 text-sm font-medium text-accent underline decoration-border underline-offset-4 transition-colors hover:decoration-accent"
        >
          Check this
          <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
    </div>
  )
}
