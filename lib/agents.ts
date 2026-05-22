// The closing crew: Qualifier → Researcher → Outreach.
// Each is a focused Claude call. Shared instructions live in `system` (cached);
// per-lead data goes in the user turn.
import type { Candidate, Lead, Fit } from "@/lib/types";
import { jsonCall, textCall } from "@/lib/anthropic";

// ── Qualifier ────────────────────────────────────────────────────────────────

const QUALIFIER_SYSTEM = `You are CLOSER's Qualifier — a ruthless but fair SDR.
You receive public posts and must score each as a sales lead for the given product/ICP.

For each item return:
- fit: "high" | "medium" | "low" — how well this person matches the ICP.
- intent: 0-100 — how strong their BUYING INTENT is RIGHT NOW. A clear "I need / I'm looking for /
  willing to pay" is 80-100. Vague interest is 30-50. Just discussing the topic is <30.
- reason: one short sentence on why (cite the signal).
- disqualified: true if the author is SELLING/offering services (an agency, freelancer pitching,
  "DM me", "I build X"), is spam, a job applicant, or clearly off-topic. Buyers only.

Be strict: it is better to disqualify a weak lead than to waste an SDR's time. Return strict JSON.`;

const QUALIFIER_SCHEMA = {
  type: "object",
  properties: {
    leads: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          fit: { type: "string", enum: ["high", "medium", "low"] },
          intent: { type: "integer" },
          reason: { type: "string" },
          disqualified: { type: "boolean" },
        },
        required: ["id", "fit", "intent", "reason", "disqualified"],
        additionalProperties: false,
      },
    },
  },
  required: ["leads"],
  additionalProperties: false,
} as const;

interface QualifierRow {
  id: string;
  fit: Fit;
  intent: number;
  reason: string;
  disqualified: boolean;
}

// Only surface leads worth an SDR's time — drop noise and low-intent chatter.
export const QUALIFY_THRESHOLD = 45;

export async function qualifyLeads(
  candidates: Candidate[],
  product: string,
  icp: string,
): Promise<Lead[]> {
  const compact = candidates.map((c) => ({
    id: c.id,
    source: c.source,
    title: c.title,
    text: c.text.slice(0, 280),
    author: c.author,
  }));

  const { leads: rows } = await jsonCall<{ leads: QualifierRow[] }>({
    system: QUALIFIER_SYSTEM,
    user: `PRODUCT:\n${product}\n\nIDEAL CUSTOMER:\n${icp}\n\nPOSTS (score every one by id):\n${JSON.stringify(
      compact,
    )}`,
    schema: QUALIFIER_SCHEMA as unknown as Record<string, unknown>,
    effort: "low",
    maxTokens: 2500,
  });

  const byId = new Map(candidates.map((c) => [c.id, c]));
  const leads: Lead[] = [];
  for (const r of rows) {
    const c = byId.get(r.id);
    if (!c) continue;
    leads.push({
      ...c,
      fit: r.fit,
      intent: clamp(r.intent),
      reason: r.reason,
      disqualified: r.disqualified,
    });
  }
  // Real buyers only: drop sellers/spam, off-ICP (low fit), and low-intent
  // chatter — never show a lead the SDR would be told not to contact.
  return leads
    .filter((l) => !l.disqualified && l.fit !== "low" && l.intent >= QUALIFY_THRESHOLD)
    .sort((a, b) => b.intent - a.intent);
}

function clamp(n: number): number {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

// ── Researcher ───────────────────────────────────────────────────────────────

const RESEARCHER_SYSTEM = `You are CLOSER's Researcher. In 2-3 tight sentences, brief the SDR on a lead:
who they appear to be, the specific pain they expressed, and the angle to reach out on.
Be concrete and reference what they actually said. No fluff, no preamble.
The lead is already qualified — always give a constructive, actionable brief.
Never say "do not pursue", "not a fit", or "skip this one".`;

export async function researchLead(lead: Lead, product: string, icp: string): Promise<string> {
  return textCall({
    system: RESEARCHER_SYSTEM,
    user: `OUR PRODUCT:\n${product}\n\nICP:\n${icp}\n\nLEAD POST (${lead.source}, by ${lead.author}):\n${lead.title}\n${lead.text}`,
    effort: "low",
    maxTokens: 250,
  });
}

// ── Outreach ─────────────────────────────────────────────────────────────────

const OUTREACH_SYSTEM = `You are CLOSER's Outreach writer. Write the FIRST message to a warm inbound-style lead
who publicly described a problem our product solves.

Style:
- Sound like a sharp, helpful human — not a marketer. No "I hope this finds you well".
- Open by referencing THEIR specific situation (shows you actually read it).
- One sentence on how we can help, tied to their pain. No feature dumps.
- End with a low-friction question. Under 90 words. Plain text, no subject line.
- Never invent facts about them. Don't be salesy or use exclamation marks.
- This lead is already qualified — ALWAYS write a usable message. Never refuse,
  never say they're "not a fit", never suggest skipping them. If the link to their
  post is loose, lead with genuine curiosity about their problem.`;

export async function writeOutreach(lead: Lead, product: string, icp: string): Promise<string> {
  return textCall({
    system: OUTREACH_SYSTEM,
    user: `OUR PRODUCT:\n${product}\n\nICP:\n${icp}\n\nLEAD POST (${lead.source}, by ${lead.author}):\n${lead.title}\n${lead.text}\n\nResearch notes: ${lead.research || "(none)"}`,
    effort: "medium",
    maxTokens: 350,
  });
}
