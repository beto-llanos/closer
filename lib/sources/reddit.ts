// Reddit search. Reddit rate-limits datacenter IPs (Railway is a datacenter), so
// the anonymous JSON endpoint usually returns nothing in production. If
// REDDIT_CLIENT_ID + REDDIT_CLIENT_SECRET are set, we use app-only OAuth
// (client_credentials) against oauth.reddit.com, which DOES work from datacenter
// IPs — that keeps the "LIVE" data real in prod. Without creds it falls back to
// the public endpoint (fine for local dev). Any failure returns [].
import type { Candidate } from "@/lib/types";

const CLIENT_ID = process.env.REDDIT_CLIENT_ID;
const CLIENT_SECRET = process.env.REDDIT_CLIENT_SECRET;
const UA = "web:closer-sdr:1.0 (intent radar)";

interface RedditChild {
  data: {
    id: string;
    title: string;
    selftext?: string;
    permalink: string;
    author: string;
    subreddit_name_prefixed?: string;
    created_utc: number;
  };
}

let tokenCache: { token: string; exp: number } | null = null;

async function getToken(): Promise<string | null> {
  if (!CLIENT_ID || !CLIENT_SECRET) return null;
  if (tokenCache && Date.now() < tokenCache.exp) return tokenCache.token;
  try {
    const res = await fetch("https://www.reddit.com/api/v1/access_token", {
      method: "POST",
      headers: {
        Authorization:
          "Basic " + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": UA,
      },
      body: new URLSearchParams({ grant_type: "client_credentials" }),
      signal: AbortSignal.timeout(7000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { access_token?: string; expires_in?: number };
    if (!data.access_token) return null;
    tokenCache = {
      token: data.access_token,
      exp: Date.now() + (data.expires_in ?? 3600) * 1000 - 60_000,
    };
    return tokenCache.token;
  } catch {
    return null;
  }
}

function toCandidates(children: RedditChild[]): Candidate[] {
  return (children || []).map((c): Candidate => {
    const d = c.data;
    const body = (d.selftext || "").replace(/\s+/g, " ").trim();
    return {
      id: `rd_${d.id}`,
      source: "reddit",
      title: d.title,
      text: body ? `${d.title} — ${body}`.slice(0, 600) : d.title,
      url: `https://www.reddit.com${d.permalink}`,
      author: `${d.subreddit_name_prefixed || "reddit"} · u/${d.author}`,
      createdAt: new Date(d.created_utc * 1000).toISOString(),
    };
  });
}

export async function searchReddit(query: string, limit = 8): Promise<Candidate[]> {
  const token = await getToken();
  const base = token ? "https://oauth.reddit.com/search" : "https://www.reddit.com/search.json";
  try {
    const u = new URL(base);
    u.searchParams.set("q", query);
    u.searchParams.set("sort", "relevance");
    u.searchParams.set("limit", String(limit));
    u.searchParams.set("t", "year");
    u.searchParams.set("type", "link");

    const headers: Record<string, string> = { "User-Agent": UA };
    if (token) headers.Authorization = `bearer ${token}`;

    const res = await fetch(u, { headers, signal: AbortSignal.timeout(7000) });
    if (!res.ok) return [];
    const data = (await res.json()) as { data?: { children: RedditChild[] } };
    return toCandidates(data.data?.children || []);
  } catch {
    return [];
  }
}
