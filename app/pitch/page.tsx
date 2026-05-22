import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CLOSER — Pitch",
  description: "CLOSER — Autonomous Revenue Agents. Intent-first AI SDR pitch deck.",
};

const LIVE = "https://closer-production-e0e3.up.railway.app";
const REPO = "https://github.com/beto-llanos/closer";

export default function Pitch() {
  return (
    <div className="deck">
      <nav className="deck-nav">
        <div className="brand" style={{ fontSize: 17 }}>
          <span className="dot" />
          CLOSER
        </div>
        <div>
          <a href={LIVE} target="_blank" rel="noopener noreferrer">
            Live demo ↗
          </a>
          <a href={REPO} target="_blank" rel="noopener noreferrer">
            GitHub ↗
          </a>
        </div>
      </nav>

      {/* 1 — Title */}
      <section className="slide" style={{ justifyContent: "center" }}>
        <div className="kicker">Autonomous Revenue Agents · International AI Agents Hackathon</div>
        <h2>
          Your AI SDR finds buyers <span className="hl">raising their hand</span> — before your
          competitor does.
        </h2>
        <p className="big">
          A crew of AI agents that scans the open web for people describing a problem you solve,
          qualifies the real buyers, and writes the first message — ready to send.
        </p>
        <div className="cta-row">
          <a className="cta" href={LIVE} target="_blank" rel="noopener noreferrer">
            Try it live →
          </a>
          <a className="cta ghost" href={REPO} target="_blank" rel="noopener noreferrer">
            View the code
          </a>
        </div>
        <div className="scroll-hint">scroll ↓</div>
      </section>

      {/* 2 — Problem */}
      <section className="slide">
        <div className="kicker">The problem</div>
        <h2>Finding customers is broken.</h2>
        <p>
          Every &quot;AI SDR&quot; on the market — Artisan, 11x, Clay, Apollo — does the same thing:
        </p>
        <p className="quote">Buy a contact list. Blast cold spam. Hope someone replies.</p>
        <p>
          Expensive, contract-locked, low reply rates — and the prospect{" "}
          <strong style={{ color: "var(--text)" }}>never asked for anything.</strong> Small teams
          and founders can&apos;t afford it and hate doing it.
        </p>
      </section>

      {/* 3 — The shift */}
      <section className="slide">
        <div className="kicker">The shift</div>
        <h2>
          People announce their problems in public <span className="hl">every day.</span>
        </h2>
        <p className="quote">&quot;Need to automate our invoice processing…&quot;</p>
        <p className="quote">&quot;Looking for a dev to sync our catalog across marketplaces…&quot;</p>
        <p className="quote">&quot;Frustrated with our current tool — recommendations?&quot;</p>
        <p className="big" style={{ marginTop: 18 }}>
          That&apos;s a raised hand. CLOSER catches it while it&apos;s warm — the opposite of cold
          outbound.
        </p>
      </section>

      {/* 4 — What it is */}
      <section className="slide">
        <div className="kicker">What it is</div>
        <h2>Four agents. One pipeline. Top-of-funnel, automated.</h2>
        <div className="deck-grid">
          <div className="deck-card">
            <div className="n">01 · Prospector</div>
            <h3>Scans the open web</h3>
            <p>Turns your product + ICP into intent queries, pulls live buying signals.</p>
          </div>
          <div className="deck-card">
            <div className="n">02 · Qualifier</div>
            <h3>Scores fit + intent</h3>
            <p>Keeps real buyers, drops sellers, spam, and low-intent noise.</p>
          </div>
          <div className="deck-card">
            <div className="n">03 · Researcher</div>
            <h3>Briefs the pain</h3>
            <p>Who they are, what they need, and the angle to reach out on.</p>
          </div>
          <div className="deck-card">
            <div className="n">04 · Outreach</div>
            <h3>Writes the first message</h3>
            <p>Personalized to their exact situation. Copy, paste, send.</p>
          </div>
        </div>
      </section>

      {/* 5 — Demo */}
      <section className="slide">
        <div className="kicker">The demo</div>
        <h2>Tell it what you sell. Watch the agents work.</h2>
        <ul>
          <li>Enter a product + ideal customer (or one click on a preset).</li>
          <li>The 4 agents light up live, streamed in real time.</li>
          <li>
            A board of qualified leads appears — sorted by buying intent, each with a fit score, the
            reason it qualified, a research brief, and a copy-ready outreach message.
          </li>
        </ul>
        <p className="big" style={{ marginTop: 16 }}>
          Try it with <span className="hl">your own</span> product — it works on anything.
        </p>
      </section>

      {/* 6 — Innovation */}
      <section className="slide">
        <div className="kicker">Why it&apos;s different · Innovation</div>
        <h2>Intent-first, not list-first.</h2>
        <table className="cmp">
          <thead>
            <tr>
              <th>Incumbents</th>
              <th>CLOSER</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="old">Buy a contact database</td>
              <td className="vs">Read public buying signals</td>
            </tr>
            <tr>
              <td className="old">Cold spam at scale</td>
              <td className="vs">Warm, context-aware first touch</td>
            </tr>
            <tr>
              <td className="old">$$$ + annual contracts</td>
              <td className="vs">Free to try, no login</td>
            </tr>
            <tr>
              <td className="old">Black box</td>
              <td className="vs">Watch every agent reason, live</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* 7 — Impact */}
      <section className="slide">
        <div className="kicker">Impact</div>
        <h2>A proven, hot market — done warmer and cheaper.</h2>
        <ul>
          <li>
            <strong style={{ color: "var(--text)" }}>Who:</strong> any B2B company, agency, or
            freelancer who needs customers — i.e. everyone.
          </li>
          <li>
            <strong style={{ color: "var(--text)" }}>ROI:</strong> replaces hours of manual
            prospecting + an SDR&apos;s first-touch writing, every day.
          </li>
          <li>
            <strong style={{ color: "var(--text)" }}>Validated:</strong> Artisan and 11x raised
            hundreds of millions doing the <em>worse</em> (cold) version of this.
          </li>
          <li>
            <strong style={{ color: "var(--text)" }}>Dual-use:</strong> the builder uses it to find
            his own freelance clients (Top-2 on Workana in Mexico).
          </li>
        </ul>
      </section>

      {/* 8 — Architecture */}
      <section className="slide">
        <div className="kicker">How it works</div>
        <h2>The pipeline</h2>
        <pre>{`Product + ICP
   │
 ┌─▼ Prospector ─┐  intent queries   ┌─ HackerNews ─┐
 │               │ ────────────────▶ │  Reddit      │
 └─┬─────────────┘                   │  StackExchange│
   │  raw signals                    └──────┬───────┘
 ┌─▼ Qualifier ──┐ ◀───────────────────────┘
 └─┬─────────────┘  fit + intent · drop sellers/spam
   │ qualified leads
 ┌─▼ Researcher ─┐    ┌─ Outreach ─┐
 │               │ ─▶ │            │ ─▶  Ready-to-send board
 └───────────────┘    └────────────┘      (streamed via SSE)`}</pre>
      </section>

      {/* 9 — Tech */}
      <section className="slide">
        <div className="kicker">Built with</div>
        <h2>Modern, fast, real.</h2>
        <ul>
          <li>
            <strong style={{ color: "var(--text)" }}>Claude Sonnet 4.6</strong> via the Anthropic
            SDK — structured JSON scoring + prompt caching on shared agent instructions.
          </li>
          <li>
            <strong style={{ color: "var(--text)" }}>Next.js 16 + React 19 + TypeScript</strong>,
            streamed to the browser over Server-Sent Events.
          </li>
          <li>
            Live sources: HackerNews + Reddit + Stack Exchange, with a high-intent fallback so the
            board is never empty.
          </li>
          <li>Per-IP + global rate limiting. Deployed on Railway.</li>
        </ul>
      </section>

      {/* 10 — Close */}
      <section className="slide" style={{ justifyContent: "center" }}>
        <div className="kicker">CLOSER</div>
        <h2>
          Turn the open web into a <span className="hl">warm pipeline</span> — automatically.
        </h2>
        <p className="big">Multi-agent workflow automation any industry can use, today.</p>
        <div className="cta-row">
          <a className="cta" href={LIVE} target="_blank" rel="noopener noreferrer">
            Try CLOSER live →
          </a>
          <a className="cta ghost" href={REPO} target="_blank" rel="noopener noreferrer">
            github.com/beto-llanos/closer
          </a>
        </div>
      </section>
    </div>
  );
}
