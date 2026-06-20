import { ArrowRightIcon } from "lucide-react"
import type { DebaterView as DebaterViewType } from "@/lib/case"
import { SourceLink } from "@/components/source-link"

export function DebaterView({
  label,
  view,
}: {
  label: string
  view: DebaterViewType
}) {
  // "Check this" points at the first source so the reader can verify the claim
  // themselves. Both sides are rendered identically — no winner is implied.
  const firstSource = view.sources[0]

  return (
    <div className="flex flex-1 flex-col gap-4">
      <span className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </span>

      <p className="text-pretty text-[0.95rem] leading-relaxed text-card-foreground">{view.answer}</p>

      <div className="mt-auto flex flex-col gap-3 pt-1">
        {view.sources.length > 0 ? (
          <ul className="flex flex-col gap-1.5">
            {view.sources.map((source) => (
              <SourceLink key={source.url} source={source} />
            ))}
          </ul>
        ) : (
          <p className="text-sm italic text-muted-foreground">No sources provided.</p>
        )}

        {firstSource ? (
          <a
            href={firstSource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex w-fit items-center gap-1.5 text-sm font-medium text-clay transition-colors hover:text-foreground"
          >
            Check this
            <ArrowRightIcon
              className="size-3.5 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </a>
        ) : null}
      </div>
    </div>
  )
}
