"use client"

import { useState } from "react"
import { ArrowLeftIcon, RotateCwIcon } from "lucide-react"
import type { CaseFile } from "@/lib/case"
import { verdictOptions } from "@/lib/case"
import { getCase } from "@/lib/get-case"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InputView } from "@/components/input-view"
import { LoadingView } from "@/components/loading-view"
import { FacetCard } from "@/components/facet-card"
import { Verdict } from "@/components/verdict"

type Status = "input" | "loading" | "result"

export default function Page() {
  const [status, setStatus] = useState<Status>("input")
  const [topic, setTopic] = useState("")
  const [result, setResult] = useState<CaseFile | null>(null)
  const [choice, setChoice] = useState<string | null>(null)

  async function runCase(nextTopic: string) {
    setTopic(nextTopic)
    setChoice(null)
    setResult(null)
    setStatus("loading")
    try {
      const data = await getCase(nextTopic)
      setResult(data)
    } catch {
      setResult({
        topic: nextTopic,
        cached: false,
        triage: { route: "error", reason: "" },
        facets: [],
        userVerdict: null,
        error: "Something went wrong while building your case. Please try again.",
      })
    }
    setStatus("result")
  }

  function reset() {
    setStatus("input")
    setResult(null)
    setChoice(null)
    setTopic("")
  }

  return (
    <main className="flex flex-1 flex-col px-6 py-12 sm:py-20">
      <div className="mx-auto w-full max-w-3xl flex-1">
        {status === "input" ? <InputView onSubmit={runCase} /> : null}

        {status === "loading" ? <LoadingView topic={topic} /> : null}

        {status === "result" && result ? (
          <ResultView
            result={result}
            choice={choice}
            onChoose={setChoice}
            onReset={reset}
            onRetry={() => runCase(result.topic)}
          />
        ) : null}
      </div>

      <footer className="mx-auto mt-16 w-full max-w-3xl border-t border-border pt-6">
        <p className="text-center text-sm text-muted-foreground">
          This is guidance, not regulated financial advice.
        </p>
      </footer>
    </main>
  )
}

function ResultView({
  result,
  choice,
  onChoose,
  onReset,
  onRetry,
}: {
  result: CaseFile
  choice: string | null
  onChoose: (option: string) => void
  onReset: () => void
  onRetry: () => void
}) {
  const askAnother = (
    <Button variant="ghost" onClick={onReset} className="text-muted-foreground hover:text-foreground">
      <ArrowLeftIcon data-icon="inline-start" />
      Ask another question
    </Button>
  )

  // 1. Hard error — never show a blank screen.
  if (result.error) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-6">
        <Alert variant="destructive">
          <AlertTitle>We couldn&apos;t build your case</AlertTitle>
          <AlertDescription>{result.error}</AlertDescription>
        </Alert>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button onClick={onRetry}>
            <RotateCwIcon data-icon="inline-start" />
            Try again
          </Button>
          {askAnother}
        </div>
      </div>
    )
  }

  // 2. Refusal — triage says this is not a debatable question.
  if (result.triage.route !== "debatable") {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-8 text-center">
        <div className="flex flex-col gap-3">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Auditor is sitting this one out
          </span>
          <p className="text-pretty font-serif text-2xl font-normal leading-snug text-foreground">
            {result.triage.reason}
          </p>
        </div>
        {askAnother}
      </div>
    )
  }

  // 3. The case file.
  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-3">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          The case
        </span>
        <h1 className="text-balance font-serif text-3xl font-normal leading-tight text-foreground sm:text-4xl">
          {result.topic}
        </h1>
        <p className="text-pretty text-base leading-relaxed text-muted-foreground">
          {result.triage.reason}
        </p>
      </header>

      <div className="flex flex-col gap-5">
        {result.facets.map((facet, index) => (
          <FacetCard key={facet.facetId} facet={facet} index={index} />
        ))}
      </div>

      <Verdict options={verdictOptions(result.topic)} choice={choice} onChoose={onChoose} />

      <div className="flex justify-center">{askAnother}</div>
    </div>
  )
}
