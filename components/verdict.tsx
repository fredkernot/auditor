"use client"

import { CheckIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function Verdict({
  options,
  choice,
  onChoose,
}: {
  options: [string, string]
  choice: string | null
  onChoose: (option: string) => void
}) {
  return (
    <section className="flex flex-col items-center gap-5 rounded-xl border border-dashed border-border bg-card/50 px-6 py-8 text-center">
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
          The decision is yours
        </span>
        <p className="text-pretty font-serif text-xl leading-snug text-foreground">
          Auditor won&apos;t decide for you. Your verdict:
        </p>
      </div>

      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        {options.map((option) => {
          const selected = choice === option
          return (
            <Button
              key={option}
              type="button"
              variant={selected ? "default" : "outline"}
              size="lg"
              aria-pressed={selected}
              onClick={() => onChoose(option)}
              className={cn("h-auto min-h-12 whitespace-normal py-3 text-base", selected && "shadow-sm")}
            >
              {selected ? <CheckIcon data-icon="inline-start" /> : null}
              {option}
            </Button>
          )
        })}
      </div>

      {choice ? (
        <p className="text-sm text-muted-foreground">
          You leaned toward <span className="font-medium text-foreground">{choice}</span>. You can change your
          mind anytime — this is your call, not the app&apos;s.
        </p>
      ) : null}
    </section>
  )
}
