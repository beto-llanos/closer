// Thin wrapper around the Anthropic SDK for CLOSER's agents.
// Model: Sonnet 4.6 — fast enough for a live demo (no dead air on stage).
// Shared instructions go in `system` with cache_control so repeated per-lead
// calls read the prompt from cache instead of paying for it every time.
import Anthropic from "@anthropic-ai/sdk";

export const CLOSER_MODEL = process.env.CLOSER_MODEL || "claude-sonnet-4-6";

let _client: Anthropic | null = null;
export function getClient(): Anthropic {
  if (!_client) _client = new Anthropic(); // reads ANTHROPIC_API_KEY
  return _client;
}

type Effort = "low" | "medium" | "high";

function firstText(msg: Anthropic.Message): string {
  for (const block of msg.content) {
    if (block.type === "text") return block.text;
  }
  return "";
}

/** Constrained JSON call. `schema` is a JSON Schema object. Returns parsed T. */
export async function jsonCall<T>(opts: {
  system: string;
  user: string;
  schema: Record<string, unknown>;
  effort?: Effort;
  maxTokens?: number;
}): Promise<T> {
  const client = getClient();
  const params = {
    model: CLOSER_MODEL,
    max_tokens: opts.maxTokens ?? 2000,
    thinking: { type: "disabled" },
    system: [
      { type: "text", text: opts.system, cache_control: { type: "ephemeral" } },
    ],
    output_config: {
      effort: opts.effort ?? "low",
      format: { type: "json_schema", schema: opts.schema },
    },
    messages: [{ role: "user", content: opts.user }],
    // output_config is newer than some SDK type bundles — cast keeps the build green.
  } as unknown as Anthropic.MessageCreateParamsNonStreaming;

  const msg = await client.messages.create(params);
  const text = firstText(msg).trim();
  return JSON.parse(text) as T;
}

/** Plain-text call (e.g. writing an outreach message). Returns the text. */
export async function textCall(opts: {
  system: string;
  user: string;
  effort?: Effort;
  maxTokens?: number;
}): Promise<string> {
  const client = getClient();
  const params = {
    model: CLOSER_MODEL,
    max_tokens: opts.maxTokens ?? 700,
    thinking: { type: "disabled" },
    system: [
      { type: "text", text: opts.system, cache_control: { type: "ephemeral" } },
    ],
    output_config: { effort: opts.effort ?? "medium" },
    messages: [{ role: "user", content: opts.user }],
  } as unknown as Anthropic.MessageCreateParamsNonStreaming;

  const msg = await client.messages.create(params);
  return firstText(msg).trim();
}
