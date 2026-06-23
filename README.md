# Auditor

A second opinion on everyday money decisions.

Auditor takes an A-or-B money question, breaks it into a few sub-questions, and has **two different AI models answer each one independently**. It shows both sides next to each other, each claim backed by a link to a trusted source you can check yourself.

It never picks a winner. The decision stays with you. The point is not to trust the models, it is to trust the sources the debate puts in front of you.

## What it is for

Everyday A-or-B money questions with checkable facts and two fair sides, for example:

- "Should I overpay my mortgage or put the money into savings?"
- "Is a cash ISA better than an easy-access savings account?"
- "Should I pay off my credit card or build an emergency fund first?"

It is **not** for personal financial advice or pure predictions. Questions like "Will house prices crash next year?" are turned away, because there is nothing checkable to put a source against.

This is guidance, not regulated financial advice.

## How it works

A single API route (`POST /api/case` with `{ "topic": "..." }`) runs four steps:

1. **Triage** decides if the question is `debatable`, `unknowable`, or `needs-a-professional`. Only debatable questions go further.
2. **Agenda** breaks the topic into 3 to 5 checkable sub-questions (facets). It only writes the questions, it never answers them.
3. **Two debaters** (different models, run in parallel, neither sees the other) answer every facet with a short view and a confidence level.
4. **Formatter** pairs the two answers by facet and assembles the response. It computes no winner and no agreement.

### Sources are trusted, not guessed

Debaters do not write URLs. They cite by id from a hand-curated catalogue of pre-verified pages ([`data/source-catalogue.json`](data/source-catalogue.json)). The code resolves those ids to real links and drops anything it does not recognise. This means **hallucinated and dead links are impossible by design**, and every source sits on one of seven trusted UK hosts:

`moneyhelper.org.uk`, `gov.uk`, `ofgem.gov.uk`, `register.fca.org.uk`, `citizensadvice.org.uk`, `moneysavingexpert.com`, `bankofengland.co.uk`

The demo question is pre-run and cached, so it returns instantly.

## Running it

```bash
npm install

# add your OpenRouter key (not committed)
echo "OPENROUTER_API_KEY=sk-or-..." > .env.local

npm run dev      # http://localhost:3000
```

Run the tests with:

```bash
npm test
```

Both debater models are configured in one place, [`lib/models.ts`](lib/models.ts), so they can be swapped without touching any logic.

## Tech

Next.js (App Router), TypeScript, Tailwind. Models are reached through [OpenRouter](https://openrouter.ai) using the Vercel AI SDK, with structured output validated by zod. Deployed on Vercel.

## The shape of a result

```jsonc
{
  "topic": "Should I overpay my mortgage or put the money into savings?",
  "triage": { "route": "debatable", "reason": "..." },
  "facets": [
    {
      "facetId": "f1",
      "question": "Do savings rates beat a typical mortgage rate?",
      "debaterA": { "answer": "...", "confidence": "high", "sources": [ { "url": "...", "title": "...", "verified": true } ], "missingSources": false },
      "debaterB": { "answer": "...", "confidence": "medium", "sources": [ ... ], "missingSources": false }
    }
  ],
  "userVerdict": null
}
```

`userVerdict` is always `null`. Auditor does not fill it in. You do.
