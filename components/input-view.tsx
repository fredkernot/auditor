"use client"

import { useState } from "react"
import { ArrowRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

const SUGGESTIONS = [
  "Should I overpay my mortgage or put the money into savings?",
  "Should I pay off my credit card or build an emergency fund first?",
  "Should I buy a used car outright or take a 0% finance deal?",
  "Should I fix my energy tariff or stay on a variable rate?",
]

export function InputView({ onSubmit }: { onSubmit: (topic: string) => void }) {
  const [topic, setTopic] = useState("")
  const trimmed = topic.trim()

  function submit() {
    if (trimmed.length === 0) return
    onSubmit(trimmed)
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-10">
      <div className="flex flex-col gap-4 text-center">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Auditor
        </span>
        <h1 className="text-balance font-serif text-4xl font-normal leading-[1.1] text-foreground sm:text-5xl">
          A second opinion on your money decision
        </h1>
        <p className="text-pretty text-base leading-relaxed text-muted-foreground">
          It gives you a second opinion on a money decision by having two AIs argue both sides while you decide.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <Textarea
          value={topic}
          onChange={(event) => setTopic(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
              event.preventDefault()
              submit()
            }
          }}
          placeholder="Should I overpay my mortgage or put it into savings?"
          rows={3}
          aria-label="Your money question"
          className="min-h-24 resize-none rounded-xl bg-card px-4 py-3.5 font-serif text-lg leading-relaxed shadow-sm md:text-lg"
        />
        <Button
          type="button"
          size="lg"
          onClick={submit}
          disabled={trimmed.length === 0}
          className="h-12 w-full text-base"
        >
          Get a second opinion
          <ArrowRightIcon data-icon="inline-end" />
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
          Try one of these
        </span>
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => setTopic(suggestion)}
              className="rounded-full border border-border bg-card px-3.5 py-2 text-left text-sm text-card-foreground transition-colors hover:border-clay hover:text-foreground"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      <p className="text-pretty text-center text-sm text-muted-foreground">
        Best for everyday A-or-B money questions, like saving versus overpaying or fixing versus floating a rate.
      </p>
    </div>
  )
}
