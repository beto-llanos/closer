// Prospector agent — turns a product + ICP into intent-rich search queries,
// then pulls candidate signals from the public web. Intent-first: we look for
// people raising their hand, not a bought contact list.
import type { Candidate } from "@/lib/types";
import { jsonCall } from "@/lib/anthropic";
import { searchHackerNews } from "@/lib/sources/hackernews";
import { searchReddit } from "@/lib/sources/reddit";

const PROSPECTOR_SYSTEM = `You are CLOSER's Prospector — an expert B2B prospecting strategist.
Given a product and its ideal customer profile (ICP), produce web search queries that surface
PEOPLE EXPRESSING BUYING INTENT in public: asking for a recommendation, looking to hire, frustrated
with their current tool/process, or describing a painful problem your product solves.

Rules:
- Write the queries the way a real buyer would phrase their problem, NOT marketing copy.
- Favor phrases like "looking for", "need help", "how do I", "recommend a", "frustrated with", "anyone use".
- Keep each query 3-7 words. No quotes, no operators, no brand names unless essential.
- 5 queries, each attacking a different angle of the pain.
Return strict JSON.`;

const QUERIES_SCHEMA = {
  type: "object",
  properties: { queries: { type: "array", items: { type: "string" } } },
  required: ["queries"],
  additionalProperties: false,
} as const;

export async function generateQueries(product: string, icp: string): Promise<string[]> {
  try {
    const { queries } = await jsonCall<{ queries: string[] }>({
      system: PROSPECTOR_SYSTEM,
      user: `PRODUCT:\n${product}\n\nIDEAL CUSTOMER:\n${icp}`,
      schema: QUERIES_SCHEMA as unknown as Record<string, unknown>,
      effort: "low",
      maxTokens: 400,
    });
    const cleaned = queries.map((q) => q.trim()).filter(Boolean).slice(0, 5);
    return cleaned.length ? cleaned : fallbackQueries(product);
  } catch {
    return fallbackQueries(product);
  }
}

function fallbackQueries(product: string): string[] {
  const core = product.split(/\s+/).slice(0, 3).join(" ") || "automation";
  return [
    `looking for ${core}`,
    `need help with ${core}`,
    `recommend a ${core} tool`,
    `frustrated with ${core}`,
    `how to automate ${core}`,
  ];
}

function dedupe(items: Candidate[]): Candidate[] {
  const seen = new Set<string>();
  const out: Candidate[] = [];
  for (const c of items) {
    const key = c.id || c.url;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(c);
  }
  return out;
}

export interface ProspectResult {
  candidates: Candidate[];
  counts: Record<string, number>;
  live: boolean;
}

export async function fetchCandidates(queries: string[]): Promise<ProspectResult> {
  const jobs: Promise<Candidate[]>[] = [];
  for (const q of queries) {
    jobs.push(searchHackerNews(q, 6));
    jobs.push(searchReddit(q, 6));
  }
  const settled = await Promise.allSettled(jobs);
  const all: Candidate[] = [];
  for (const s of settled) if (s.status === "fulfilled") all.push(...s.value);

  const candidates = dedupe(all).slice(0, 22);
  const counts: Record<string, number> = { hackernews: 0, reddit: 0, forum: 0 };
  for (const c of candidates) counts[c.source] = (counts[c.source] || 0) + 1;
  const live = candidates.length > 0;

  // Cap kept small so the Qualifier call stays fast and cheap.
  return { candidates, counts, live };
}
