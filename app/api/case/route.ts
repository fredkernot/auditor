import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateObject } from "ai";
import { openrouter, MODELS } from "@/lib/models";
import { resolveSources, type CatalogueEntry } from "@/lib/resolveSources";
import { getCachedCase } from "@/lib/demoCache";
import catalogueData from "@/data/source-catalogue.json";

const CATALOGUE = catalogueData as CatalogueEntry[];

// --- Schemas ---

const FacetSchema = z.object({
  id: z.string().describe("Unique stable ID like f1, f2"),
  question: z.string().describe("The specific sub-question to be answered"),
});

const DebaterAnswerSchema = z.object({
  facetId: z.string(),
  answer: z.string().describe("A short view on this facet"),
  sourceIds: z
    .array(z.string())
    .max(2)
    .describe("Catalogue ids that back this view. Empty if none fit. Never URLs."),
  confidence: z.enum(["low", "medium", "high"]),
});

const TopicRequestSchema = z.object({
  topic: z.string().min(1).max(500),
});

const TriageSchema = z.object({
  route: z.enum(["debatable", "unknowable", "needs-a-professional"]),
  reason: z.string().describe("Short plain English reason for this triage result"),
});

// --- Implementation ---

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = TopicRequestSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid topic. Must be a string between 1 and 500 characters." },
        { status: 400 }
      );
    }

    const { topic } = result.data;

    // Demo cache: serve a pre-run, curated CaseFile for known demo questions
    // instantly. Keeps the stage demo fast and well-sourced; never runs the
    // live two-model pipeline cold.
    const cached = getCachedCase(topic);
    if (cached) {
      return NextResponse.json(cached);
    }

    // 0. Triage: Determine if the topic is suitable for debate
    const { object: triage } = await generateObject({
      model: openrouter(MODELS.AGENDA_SETTER),
      schema: TriageSchema,
      prompt: `Triage the following household money topic: "${topic}". 
               Classify it as "debatable" (UK financial facts/comparisons), 
               "unknowable" (future predictions/speculation), 
               or "needs-a-professional" (requires specific legal or regulated advice).`,
    });

    if (triage.route !== "debatable") {
      return NextResponse.json({
        topic,
        triage,
        userVerdict: null,
      });
    }

    // 1. Agenda Setter: Break topic into facets
    const { object: agenda } = await generateObject({
      model: openrouter(MODELS.AGENDA_SETTER),
      schema: z.object({
        facets: z.array(FacetSchema).min(3).max(5),
      }),
      prompt: `Break the following household money topic into exactly 3 to 5 checkable, two-sided sub-questions (facets): "${topic}". 
               Each facet must have a unique stable id (e.g., f1, f2). 
               Provide only the questions. Do not answer them.`,
    });

    // 2. Debaters: Answer facets independently in parallel with settle-all strategy
    const debaterPrompts = agenda.facets.map(f => `ID: ${f.id}, Question: ${f.question}`).join("\n");
    const catalogueList = CATALOGUE
      .map((c) => `- ${c.id}: ${c.title} (${c.host})`)
      .join("\n");
    const commonInstructions = `
      Answer each facet for a UK audience.
      - Provide a short view (1-2 sentences).
      - Cite sources ONLY by their catalogue id, using the SOURCE CATALOGUE below.
      - Put the chosen ids in the "sourceIds" array. Use only ids that genuinely
        support the specific facet. NEVER write a URL, and never invent an id.
      - If no catalogue entry fits a facet, return an empty sourceIds array for it.
      - Assign confidence: low, medium, or high.

      SOURCE CATALOGUE (cite by id only):
${catalogueList}
    `;

    const results = await Promise.allSettled([
      generateObject({
        model: openrouter(MODELS.DEBATER_A),
        schema: z.object({ answers: z.array(DebaterAnswerSchema) }),
        prompt: `Debater A Instructions: ${commonInstructions}\n\nFacets:\n${debaterPrompts}`,
      }),
      generateObject({
        model: openrouter(MODELS.DEBATER_B),
        schema: z.object({ answers: z.array(DebaterAnswerSchema) }),
        prompt: `Debater B Instructions: ${commonInstructions}\n\nFacets:\n${debaterPrompts}`,
      }),
    ]);

    const resA = results[0].status === "fulfilled" ? results[0].value.object.answers : null;
    const resB = results[1].status === "fulfilled" ? results[1].value.object.answers : null;

    // Handle case where both debaters fail to provide content
    if (!resA && !resB) {
      return NextResponse.json({
        topic,
        triage,
        error: "Both debaters are currently unavailable. Please try again later.",
        userVerdict: null,
      }, { status: 200 });
    }

    // 3. Formatter: Deterministic pairing by Facet ID.
    // No model or code computes agreement, winners, or verdicts.
    // Sources are resolved from the curated catalogue by id, so there are no
    // live URL checks: hallucinated and dead links are impossible by design.
    const resolveView = (sourceIds: string[] | undefined) => {
      const entries = resolveSources(sourceIds, CATALOGUE);
      // Every catalogue entry was verified by hand when the catalogue was built.
      const sources = entries.map((e) => ({ url: e.url, title: e.title, verified: true }));
      return { sources, missingSources: sources.length === 0 };
    };

    const formattedFacets = agenda.facets.map((facet) => {
      const ansA = resA?.find((a) => a.facetId === facet.id);
      const ansB = resB?.find((a) => a.facetId === facet.id);

      return {
        facetId: facet.id,
        question: facet.question,
        debaterA: ansA ? {
          answer: ansA.answer,
          confidence: ansA.confidence,
          ...resolveView(ansA.sourceIds)
        } : { answer: "Debater unavailable", confidence: "low", sources: [], missingSources: true },
        debaterB: ansB ? {
          answer: ansB.answer,
          confidence: ansB.confidence,
          ...resolveView(ansB.sourceIds)
        } : { answer: "Debater unavailable", confidence: "low", sources: [], missingSources: true },
      };
    });

    const caseFile = {
      topic,
      triage,
      facets: formattedFacets,
      userVerdict: null, // Always null as per :AdditionalFunctionality:
    };

    return NextResponse.json(caseFile);
  } catch (error: any) {
    console.error("[CASE_ROUTE_ERROR]", error);
    return NextResponse.json(
      { 
        error: "Internal Server Error", 
        details: error.message,
        timestamp: new Date().toISOString() 
      },
      { status: 500 }
    );
  }
}