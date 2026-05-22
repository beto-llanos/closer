// In-memory rate limiting for the public /api/run endpoint.
// This is the in-app guardrail against a runaway bill if the demo gets crawled
// or hammered. The REAL backstop is a hard spend limit set in the Anthropic
// console — set that too. Single Railway instance => in-memory is fine; counters
// reset on restart, which is acceptable for a demo.

const PER_IP_PER_MIN = 4; // runs per IP per rolling minute
const GLOBAL_PER_DAY = 150; // total runs/day across everyone (caps total spend)

const ipHits = new Map<string, number[]>();
let dayCount = 0;
let dayStart = Date.now();

export interface RateResult {
  ok: boolean;
  reason?: string;
}

export function checkRateLimit(ip: string): RateResult {
  const now = Date.now();

  // Roll the global daily window.
  if (now - dayStart > 86_400_000) {
    dayStart = now;
    dayCount = 0;
  }
  if (dayCount >= GLOBAL_PER_DAY) {
    return { ok: false, reason: "Daily demo limit reached — try again tomorrow." };
  }

  // Per-IP sliding 60s window.
  const recent = (ipHits.get(ip) || []).filter((t) => now - t < 60_000);
  if (recent.length >= PER_IP_PER_MIN) {
    return { ok: false, reason: "Easy there — wait a minute and run it again." };
  }

  recent.push(now);
  ipHits.set(ip, recent);
  dayCount++;

  // Opportunistic cleanup so the map doesn't grow unbounded.
  if (ipHits.size > 5000) {
    for (const [k, v] of ipHits) {
      if (v.every((t) => now - t > 60_000)) ipHits.delete(k);
    }
  }

  return { ok: true };
}
