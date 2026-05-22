# CLOSER — Pitch Deck

> Autonomous Revenue Agents · International AI Agents Hackathon
> Slide-by-slide content — drop into Google Slides / Canva, or present as-is.

---

## Slide 1 — Title

# CLOSER
### Autonomous Revenue Agents

**Your AI SDR finds buyers raising their hand — before your competitor does.**

🔗 Live: https://closer-production-e0e3.up.railway.app · 💻 Code: github.com/beto-llanos/closer

---

## Slide 2 — The problem

Finding customers is the hardest, most expensive part of any business.

- The whole "AI SDR" category (Artisan, 11x, Clay, Apollo) does the same thing: **buy a contact list and blast cold spam.**
- Expensive, contract-locked, low reply rates — and the prospect **never asked for anything.**
- Small teams and founders can't afford it and hate doing it.

---

## Slide 3 — The shift: signal-based selling

People announce their problems in public **every day** — on Reddit, HackerNews, forums:

> *"Need to automate our invoice processing…"*
> *"Looking for a developer to build a WhatsApp/CRM integration…"*
> *"Frustrated with our current tool, recommendations?"*

**That's a raised hand.** CLOSER catches it while it's warm — the opposite of cold outbound.

---

## Slide 4 — What it is

**A crew of 4 AI agents that runs your top-of-funnel, end to end:**

| Agent | Job |
|-------|-----|
| 🛰 Prospector | Turns your product + ICP into intent queries, scans the open web |
| 🎯 Qualifier | Scores fit + buying intent, drops sellers, spam, and noise |
| 🔍 Researcher | Briefs you on each lead: who, the pain, why now |
| ✍️ Outreach | Writes the personalized first message, ready to send |

You type what you sell. ~15 seconds later you have qualified leads with outreach drafts.

---

## Slide 5 — The demo (what the judge sees)

1. Enter a product + ideal customer (or one click on a preset).
2. Watch the 4 agents **light up live** as they work (streamed in real time).
3. A board of qualified leads appears — sorted by buying intent, each with a fit score, the reason it qualified, a research brief, and a **copy-ready outreach message.**

Try it with **your own** product — it works on anything.

---

## Slide 6 — Why it's different (Innovation)

| Incumbents (Artisan, 11x, Clay) | CLOSER |
|---|---|
| Buy a contact database | Read public buying signals |
| Cold spam at scale | Warm, context-aware first touch |
| $$$ + annual contracts | Free to try, no login |
| Black box | Watch every agent's reasoning live |

**Intent-first, not list-first.** A genuinely different wedge in a proven, hot market.

---

## Slide 7 — Impact

- **Who:** any B2B company, agency, or freelancer who needs customers — i.e. everyone.
- **ROI:** replaces hours of manual prospecting + an SDR's first-touch writing, per day.
- **Validated market:** Artisan and 11x raised hundreds of millions doing the *worse* version of this. The demand is proven; CLOSER does it warmer and cheaper.
- **Dual-use:** the builder uses it himself to find freelance clients (ranked Top-2 in Mexico on Workana).

---

## Slide 8 — How it works (architecture)

```
Product + ICP
     │
 ┌───▼─────────┐   intent queries   ┌──────────────┐
 │  Prospector │ ─────────────────▶ │ HN + Reddit  │
 └───┬─────────┘                    └──────┬───────┘
     │            raw signals              │
 ┌───▼─────────┐                           │
 │  Qualifier  │ ◀─────────────────────────┘
 └───┬─────────┘  fit + intent score, filter sellers/spam
     │ qualified leads
 ┌───▼─────────┐     ┌──────────────┐
 │ Researcher  │ ──▶ │   Outreach   │ ──▶  Ready-to-send board
 └─────────────┘     └──────────────┘       (streamed via SSE)
```

---

## Slide 9 — Built with

- **Claude Sonnet 4.6** (Anthropic SDK) — structured JSON scoring + prompt caching on shared agent instructions
- **Next.js 16** + React 19 + TypeScript, streamed to the browser over Server-Sent Events
- Live sources: HackerNews (Algolia) + Reddit, with a high-intent sample fallback for reliability
- Deployed on **Railway**

---

## Slide 10 — The ask

**CLOSER turns the open web into a warm pipeline — automatically.**

Multi-agent workflow automation that any industry can use, today.

🔗 https://closer-production-e0e3.up.railway.app  ·  💻 github.com/beto-llanos/closer
