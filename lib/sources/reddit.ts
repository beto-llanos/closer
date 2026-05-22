// Reddit public search JSON — keyless. Reddit sometimes rate-limits datacenter
// IPs (e.g. cloud hosts), so this is best-effort: any failure returns [] and the
// pipeline leans on HackerNews + the seed set instead.
import type { Candidate } from "@/lib/types";

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

export async function searchReddit(query: string, limit = 8): Promise<Candidate[]> {
  try {
    const u = new URL("https://www.reddit.com/search.json");
    u.searchParams.set("q", query);
    u.searchParams.set("sort", "relevance");
    u.searchParams.set("limit", String(limit));
    u.searchParams.set("t", "year");
    const res = await fetch(u, {
      headers: { "User-Agent": "closer-sdr/1.0 (intent radar)" },
      signal: AbortSignal.timeout(7000),
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { data?: { children: RedditChild[] } };
    return (data.data?.children || []).map((c): Candidate => {
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
  } catch {
    return [];
  }
}
