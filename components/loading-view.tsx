import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

function ModelColumn({ label }: { label: string }) {
  return (
    <div className="flex flex-1 flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-clay opacity-60" />
          <span className="relative inline-flex size-2 rounded-full bg-clay" />
        </span>
        <span className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
          {label} is answering
        </span>
      </div>
      <Skeleton className="h-3.5 w-full" />
      <Skeleton className="h-3.5 w-[92%]" />
      <Skeleton className="h-3.5 w-[78%]" />
    </div>
  )
}

export function LoadingView({ topic }: { topic: string }) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
      <div className="flex flex-col gap-3 text-center">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Building your case
        </span>
        <h1 className="text-balance font-serif text-2xl font-normal leading-snug text-foreground sm:text-3xl">
          {topic}
        </h1>
        <p className="text-pretty text-base leading-relaxed text-muted-foreground">
          Model A and Model B are each answering independently. They don&apos;t see each other&apos;s work — that
          is the whole point.
        </p>
      </div>

      <Card>
        <CardHeader>
          <span className="font-mono text-xs text-muted-foreground">Two independent answers</span>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6 md:flex-row md:gap-0">
            <div className="flex md:flex-1 md:pr-8">
              <ModelColumn label="Model A" />
            </div>
            <Separator orientation="horizontal" className="md:hidden" />
            <Separator orientation="vertical" className="hidden h-auto md:block" />
            <div className="flex md:flex-1 md:pl-8">
              <ModelColumn label="Model B" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
