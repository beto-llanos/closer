# CLOSER — Autonomous Revenue Agents

> Paste this into a new Google Doc → Share → "Anyone with the link (Viewer)" →
> submit that Doc link on Devpost. (Hackathon requires a GDoc with the 3 links below.)

---

## Submission links

- **🔗 Live tool:** https://closer-production-e0e3.up.railway.app
- **🎤 Pitch deck:** https://closer-production-e0e3.up.railway.app/pitch
- **💻 Code (GitHub):** https://github.com/beto-llanos/closer

---

## Elevator pitch

**CLOSER is an intent-first AI SDR.** A crew of AI agents scans the open web for people
*describing a problem you solve right now*, qualifies the real buyers, researches their pain,
and writes the first outreach message — ready to send. Signal-based selling instead of cold spam.

## What it does

You type what you sell and who your ideal customer is. ~15 seconds later you have a board of
qualified leads — sorted by buying intent, each with a fit score, the reason it qualified, a
research brief, and a copy-ready personalized outreach message. You watch four agents work live.

## How it works — 4 agents, one pipeline

1. **Prospector** — turns your product + ICP into intent-rich search queries, scans the open web.
2. **Qualifier** — scores fit + buying intent, drops sellers, spam, and low-intent noise.
3. **Researcher** — briefs you on each lead: who they are, the pain, the angle.
4. **Outreach** — writes a personalized first message tied to their exact situation.

Progress streams to the browser over Server-Sent Events, so the agents light up in real time.

## Why it's different (Innovation)

Every "AI SDR" on the market (Artisan, 11x, Clay, Apollo) buys a contact list and blasts cold
spam — expensive, contract-locked, and the prospect never asked for anything. CLOSER works the
other way: it reads **public buying signals** (HackerNews, Reddit, Stack Exchange) and reaches out
**warm**. Free to try, no login, and you can watch every agent reason — not a black box.

## Impact

Any B2B company, agency, or freelancer who needs customers can use it — it replaces hours of
manual prospecting plus an SDR's first-touch writing, every day. The market is proven (Artisan and
11x raised hundreds of millions doing the *cold* version); CLOSER does it warmer and cheaper. The
builder uses it himself to find freelance clients (Top-2 on Workana in Mexico).

## Built with

Claude Sonnet 4.6 (Anthropic SDK — structured JSON scoring + prompt caching) · Next.js 16 +
React 19 + TypeScript · Server-Sent Events streaming · HackerNews + Reddit + Stack Exchange live
sources with a high-intent fallback · per-IP & global rate limiting · deployed on Railway.
