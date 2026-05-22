# CLOSER — Autonomous Revenue Agents

**Intent-first AI SDR.** A crew of AI agents that finds buyers *raising their hand* on the open web, qualifies the real ones, researches their pain, and writes the first outreach message — ready to send.

Built for the **International AI Agents Hackathon** (multi-agent workflow automation).

🔗 **Live demo:** _(deployed on Railway — link in submission)_

---

## The wedge

Every "AI SDR" on the market (Artisan, 11x, Clay, Apollo) does the same thing: **buy a contact list and blast cold spam.** Expensive, contract-locked, and the prospect never asked for anything.

CLOSER works the other way around — **signal-based selling.** The agents scan public conversations (HackerNews, Reddit, forums) for people *describing a problem you solve right now*, so outreach is warm and relevant instead of cold. You catch the raised hand before your competitor does.

## How it works — 4 agents, one pipeline

| # | Agent | Job |
|---|-------|-----|
| 01 | **Prospector** | Turns your product + ICP into intent-rich search queries, then scans the open web for buying signals. |
| 02 | **Qualifier** | Scores each signal for fit + buying intent, drops sellers, spam, and low-intent chatter. |
| 03 | **Researcher** | Briefs you on each lead: who they are, the real pain, why now. |
| 04 | **Outreach** | Writes a personalized first message tied to their exact situation. |

Progress streams to the browser over **Server-Sent Events**, so you watch the agents light up in real time.

## Stack

- **Next.js 16** (App Router) + React 19 + TypeScript
- **Claude Sonnet 4.6** via the Anthropic SDK — structured JSON output + prompt caching on shared agent instructions
- Live sources: HackerNews (Algolia API) + Reddit public search — with a high-intent sample fallback so the demo never shows an empty board
- Deployed on **Railway**

## Run locally

```bash
npm install
cp .env.example .env.local   # add your ANTHROPIC_API_KEY
npm run dev
```

Open http://localhost:3000, describe what you sell, and deploy the agents.

## Environment

| Var | Required | Notes |
|-----|----------|-------|
| `ANTHROPIC_API_KEY` | ✅ | From console.anthropic.com |
| `CLOSER_MODEL` | — | Defaults to `claude-sonnet-4-6` |
