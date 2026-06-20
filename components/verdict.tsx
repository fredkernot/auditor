"use client"

import { useState } from "react"

export function Verdict({ options }: { options: [string, string] }) {
  const [choice, setChoice] = useState<string | null>(null)

  return (
    <section className="flex flex-col items-center gap-5 text-center">
      <p className="text-pretty text-base text-muted-foreground">
        The app won&apos;t decide for you. Your verdict:
      </p>

      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        {options.map((option) => {
          const selected = choice === option
          return (
            <button
              key={option}
              type="button"
              onClick={() => setChoice(option)}
              aria-pressed={selected}
              className={`rounded-md border px-6 py-3 text-base font-medium transition-colors ${
                selected
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-border bg-card text-card-foreground hover:border-accent"
              }`}
            >
              {option}
            </button>
          )
        })}
      </div>

      {choice ? (
        <p className="text-sm text-muted-foreground">
          You leaned toward <span className="font-medium text-foreground">{choice}</span>. You can change your mind
          anytime.
        </p>
      ) : null}
    </section>
  )
}
