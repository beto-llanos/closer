// Shared types for CLOSER — the intent-first multi-agent SDR.

export type SourceName = "hackernews" | "reddit" | "forum";

export type Fit = "high" | "medium" | "low";

/** A raw signal pulled from the public web before any AI scoring. */
export interface Candidate {
  id: string;
  source: SourceName;
  title: string;
  url: string;
  text: string;
  author: string;
  createdAt: string; // ISO
  seed?: boolean; // true when it comes from the demo fallback set
}

/** A candidate after the Qualifier + enrichment agents have run. */
export interface Lead extends Candidate {
  fit: Fit;
  intent: number; // 0-100 buying-intent score
  reason: string; // why it qualified
  disqualified?: boolean; // seller / spam / off-topic
  research?: string; // Researcher agent output
  outreach?: string; // Outreach agent output
}

export type AgentStage = "prospector" | "qualifier" | "researcher" | "outreach";

/** Events streamed from the API route to the browser over SSE. */
export type RunEvent =
  | { type: "stage"; stage: AgentStage; status: "start" | "done"; detail?: string }
  | { type: "queries"; queries: string[] }
  | { type: "sources"; counts: Record<string, number>; live: boolean }
  | { type: "candidates"; count: number }
  | { type: "lead"; lead: Lead }
  | { type: "done"; qualified: number; contacted: number }
  | { type: "error"; message: string };
