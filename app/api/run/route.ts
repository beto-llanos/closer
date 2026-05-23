// POST /api/run — runs the 4-agent pipeline and streams progress to the browser
// as Server-Sent Events. The UI lights up each agent as its stage fires.
import type { NextRequest } from "next/server";
import type { RunEvent, Lead } from "@/lib/types";
import { generateQueries, fetchCandidates } from "@/lib/prospector";
import { qualifyLeads, researchLead, writeOutreach } from "@/lib/agents";
import { SEED_SIGNALS } from "@/lib/demo";
import { checkRateLimit } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const ENRICH_TOP = 5; // how many qualified leads get a research note + outreach draft

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as { product?: string; icp?: string };
  const product = (body.product || "").trim();
  const icp = (body.icp || "").trim();

  const ip =
    (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  const rate = checkRateLimit(ip);

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (e: RunEvent) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(e)}\n\n`));

      if (!rate.ok) {
        send({ type: "error", message: rate.reason || "Rate limit reached." });
        controller.close();
        return;
      }

      try {
        if (!product) throw new Error("Describe your product to start prospecting.");

        // 1 — Prospector
        send({ type: "stage", stage: "prospector", status: "start" });
        const queries = await generateQueries(product, icp);
        send({ type: "queries", queries });
        const { candidates, counts, live } = await fetchCandidates(queries);
        send({ type: "sources", counts, live });
        send({ type: "candidates", count: candidates.length });
        send({
          type: "stage",
          stage: "prospector",
          status: "done",
          detail: `${candidates.length} signals from ${queries.length} queries`,
        });

        // 2 — Qualifier
        send({ type: "stage", stage: "qualifier", status: "start" });
        let qualified = await qualifyLeads(candidates, product, icp);

        // If live yield is thin for a narrow niche, top up with high-intent
        // sample signals so the board always shows strong examples. These are
        // flagged as samples (seed: true) and badged accordingly in the UI.
        if (qualified.length < 3) {
          const sampleLeads = await qualifyLeads(SEED_SIGNALS, product, icp);
          const seen = new Set(qualified.map((l) => l.id));
          for (const sl of sampleLeads) if (!seen.has(sl.id)) qualified.push(sl);
          // Real live leads first, samples after — then by intent.
          qualified.sort((a, b) => (a.seed ? 1 : 0) - (b.seed ? 1 : 0) || b.intent - a.intent);
        }

        for (const lead of qualified) send({ type: "lead", lead });
        send({
          type: "stage",
          stage: "qualifier",
          status: "done",
          detail: `${qualified.length} qualified leads`,
        });

        const top = qualified.slice(0, ENRICH_TOP);

        // 3 — Researcher (parallel across top leads)
        send({ type: "stage", stage: "researcher", status: "start" });
        await Promise.all(
          top.map(async (lead) => {
            try {
              lead.research = await researchLead(lead, product, icp);
            } catch {
              lead.research = "Research unavailable for this lead.";
            }
            send({ type: "lead", lead });
          }),
        );
        send({ type: "stage", stage: "researcher", status: "done", detail: `${top.length} briefed` });

        // 4 — Outreach (parallel across top leads)
        send({ type: "stage", stage: "outreach", status: "start" });
        let contacted = 0;
        await Promise.all(
          top.map(async (lead: Lead) => {
            try {
              lead.outreach = await writeOutreach(lead, product, icp);
              contacted++;
            } catch {
              lead.outreach = "Draft unavailable — try regenerating.";
            }
            send({ type: "lead", lead });
          }),
        );
        send({ type: "stage", stage: "outreach", status: "done", detail: `${contacted} drafts ready` });

        send({ type: "done", qualified: qualified.length, contacted });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Something went wrong running the pipeline.";
        send({ type: "error", message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
