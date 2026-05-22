"use client";

import { useState } from "react";
import type { Lead, RunEvent, AgentStage } from "@/lib/types";

type StageState = "idle" | "active" | "done";

const AGENTS: { key: AgentStage; num: string; name: string; role: string }[] = [
  { key: "prospector", num: "01", name: "Prospector", role: "Scans the open web for buying signals" },
  { key: "qualifier", num: "02", name: "Qualifier", role: "Scores fit + intent, drops sellers & spam" },
  { key: "researcher", num: "03", name: "Researcher", role: "Briefs you on each lead's real pain" },
  { key: "outreach", num: "04", name: "Outreach", role: "Writes the first message, ready to send" },
];

const PRESETS = [
  {
    label: "AI bookkeeping for restaurants",
    product:
      "An AI bookkeeping tool that automatically categorizes expenses and reconciles accounts for small restaurants and cafes.",
    icp: "Owners of independent restaurants, cafes, and small food businesses who do their own books or use a part-time bookkeeper.",
  },
  {
    label: "B2B onboarding automation",
    product:
      "A no-code platform that automates customer onboarding workflows — forms, e-signatures, data collection, and CRM sync.",
    icp: "Operations and customer-success leads at B2B SaaS companies with 10-200 employees.",
  },
  {
    label: "Freelance automation dev (Workana)",
    product:
      "Freelance developer who builds custom automations: web scrapers, WhatsApp/CRM integrations, and AI workflow bots for SMBs.",
    icp: "Small business owners and founders who need a specific automation built and have budget to hire a developer.",
  },
];

const ENRICH_TOP = 5;

export default function Home() {
  const [product, setProduct] = useState(PRESETS[0].product);
  const [icp, setIcp] = useState(PRESETS[0].icp);
  const [running, setRunning] = useState(false);
  const [started, setStarted] = useState(false);
  const [stages, setStages] = useState<Record<AgentStage, StageState>>({
    prospector: "idle",
    qualifier: "idle",
    researcher: "idle",
    outreach: "idle",
  });
  const [details, setDetails] = useState<Record<AgentStage, string>>({
    prospector: "",
    qualifier: "",
    researcher: "",
    outreach: "",
  });
  const [queries, setQueries] = useState<string[]>([]);
  const [live, setLive] = useState<boolean | null>(null);
  const [candidateCount, setCandidateCount] = useState<number | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function applyEvent(e: RunEvent) {
    switch (e.type) {
      case "stage":
        setStages((s) => ({ ...s, [e.stage]: e.status === "start" ? "active" : "done" }));
        if (e.detail) setDetails((d) => ({ ...d, [e.stage]: e.detail as string }));
        break;
      case "queries":
        setQueries(e.queries);
        break;
      case "sources":
        setLive(e.live);
        break;
      case "candidates":
        setCandidateCount(e.count);
        break;
      case "lead":
        setLeads((prev) => {
          const next = prev.filter((l) => l.id !== e.lead.id);
          next.push(e.lead);
          next.sort((a, b) => b.intent - a.intent);
          return next;
        });
        break;
      case "error":
        setError(e.message);
        break;
      case "done":
        break;
    }
  }

  async function run() {
    if (running) return;
    setRunning(true);
    setStarted(true);
    setError(null);
    setQueries([]);
    setLive(null);
    setCandidateCount(null);
    setLeads([]);
    setStages({ prospector: "idle", qualifier: "idle", researcher: "idle", outreach: "idle" });
    setDetails({ prospector: "", qualifier: "", researcher: "", outreach: "" });

    try {
      const res = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product, icp }),
      });
      if (!res.body) throw new Error("No response stream.");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() || "";
        for (const part of parts) {
          const line = part.trim();
          if (!line.startsWith("data:")) continue;
          try {
            applyEvent(JSON.parse(line.slice(5).trim()) as RunEvent);
          } catch {
            /* ignore partial */
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Run failed.");
    } finally {
      setRunning(false);
    }
  }

  function usePreset(p: (typeof PRESETS)[number]) {
    setProduct(p.product);
    setIcp(p.icp);
  }

  async function copy(lead: Lead) {
    if (!lead.outreach) return;
    try {
      await navigator.clipboard.writeText(lead.outreach);
      setCopiedId(lead.id);
      setTimeout(() => setCopiedId((c) => (c === lead.id ? null : c)), 1500);
    } catch {
      /* clipboard blocked */
    }
  }

  const qualifiedCount = leads.length;
  const hasSampleLead = leads.some((l) => l.seed);

  return (
    <div className="wrap">
      <div className="topbar">
        <div className="brand">
          <span className="dot" />
          CLOSER <small>/ revenue agents</small>
        </div>
        <span className="tag-pill">⚡ Live multi-agent demo</span>
      </div>

      <section className="hero">
        <h1>
          Your AI SDR finds buyers <span className="hl">raising their hand</span> — before your competitor does.
        </h1>
        <p>
          Forget bought lists and cold spam. CLOSER deploys a crew of AI agents that scan the open web for
          people describing a problem you solve right now, qualifies the real buyers, and writes the first
          message for you. Tell it what you sell and watch the agents work.
        </p>
      </section>

      <div className="console">
        <div className="field">
          <label>What do you sell?</label>
          <textarea
            rows={2}
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            placeholder="e.g. An AI tool that automates invoice processing for construction firms"
          />
        </div>
        <div className="field">
          <label>Who is your ideal customer?</label>
          <textarea
            rows={2}
            value={icp}
            onChange={(e) => setIcp(e.target.value)}
            placeholder="e.g. Office managers at small construction and contracting businesses"
          />
        </div>
        <div className="presets">
          {PRESETS.map((p) => (
            <button key={p.label} className="preset" onClick={() => usePreset(p)} type="button">
              {p.label}
            </button>
          ))}
        </div>
        <div className="row">
          <button className="btn" onClick={run} disabled={running} type="button">
            {running ? "Agents working…" : "Deploy agents →"}
          </button>
          <span className="hint">
            Powered by Claude Sonnet 4.6 · finds, qualifies & writes outreach in ~15s
          </span>
        </div>
      </div>

      {error && <div className="error">⚠ {error}</div>}

      {started && (
        <>
          <div className="pipeline">
            {AGENTS.map((a) => (
              <div key={a.key} className={`agent ${stages[a.key]}`}>
                <div className="num">{a.num}</div>
                <div className="name">
                  <span className="led" />
                  {a.name}
                </div>
                <div className="role">{a.role}</div>
                <div className="detail mono">{details[a.key]}</div>
              </div>
            ))}
          </div>

          {queries.length > 0 && (
            <div className="queries">
              {queries.map((q, i) => (
                <span key={i} className="qtag mono">
                  {q}
                </span>
              ))}
            </div>
          )}

          <div className="statusbar">
            {candidateCount !== null && (
              <span>
                <b>{candidateCount}</b> signals scanned
              </span>
            )}
            {qualifiedCount > 0 && (
              <span>
                <b>{qualifiedCount}</b> qualified
              </span>
            )}
            {live === true && <span className="live-chip">● LIVE WEB DATA</span>}
            {hasSampleLead && <span className="seed-chip">+ sample signals (thin live niche)</span>}
          </div>
        </>
      )}

      {leads.length > 0 && (
        <>
          <div className="section-title">Qualified pipeline — highest intent first</div>
          <div className="leads">
            {leads.map((lead, idx) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                enrich={idx < ENRICH_TOP}
                running={running}
                copied={copiedId === lead.id}
                onCopy={() => copy(lead)}
              />
            ))}
          </div>
        </>
      )}

      <div className="footer">
        <b>CLOSER</b> — autonomous revenue agents · intent-first prospecting on the open web
        <br />
        Built for the International AI Agents Hackathon · multi-agent workflow automation
      </div>
    </div>
  );
}

function LeadCard({
  lead,
  enrich,
  running,
  copied,
  onCopy,
}: {
  lead: Lead;
  enrich: boolean;
  running: boolean;
  copied: boolean;
  onCopy: () => void;
}) {
  const scoreColor =
    lead.intent >= 70 ? "var(--accent)" : lead.intent >= 40 ? "var(--amber)" : "var(--muted)";

  return (
    <div className="card">
      <div className="meta">
        <span className="badge src">{lead.source}</span>
        <span className={`badge fit-${lead.fit}`}>{lead.fit} fit</span>
        {lead.seed && <span className="badge sample">sample</span>}
      </div>
      <div className="title">
        <a href={lead.url} target="_blank" rel="noopener noreferrer">
          {lead.title}
        </a>
      </div>
      <div className="author">{lead.author}</div>

      <div className="intent">
        <div className="gauge">
          <div className="fill" style={{ width: `${lead.intent}%` }} />
        </div>
        <div className="score mono" style={{ color: scoreColor }}>
          {lead.intent}/100
        </div>
      </div>

      <div className="reason">{lead.reason}</div>

      {(lead.research || (enrich && running)) && (
        <div className="block">
          <div className="lbl">Researcher brief</div>
          {lead.research ? (
            <div className="body">{lead.research}</div>
          ) : (
            <>
              <div className="skeleton" style={{ width: "100%" }} />
              <div className="skeleton" style={{ width: "80%" }} />
            </>
          )}
        </div>
      )}

      {(lead.outreach || (enrich && running)) && (
        <div className="block">
          <div className="lbl">
            <span>Outreach draft</span>
            {lead.outreach && (
              <button className="copy" onClick={onCopy} type="button">
                {copied ? "✓ copied" : "copy"}
              </button>
            )}
          </div>
          {lead.outreach ? (
            <div className="body outreach">{lead.outreach}</div>
          ) : (
            <>
              <div className="skeleton" style={{ width: "100%" }} />
              <div className="skeleton" style={{ width: "90%" }} />
              <div className="skeleton" style={{ width: "70%" }} />
            </>
          )}
        </div>
      )}
    </div>
  );
}
