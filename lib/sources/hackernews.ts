// HackerNews via the Algolia API — keyless and reliable from server IPs,
// which makes it the dependable backbone for the live demo.
import type { Candidate } from "@/lib/types";

const ENDPOINT = "https://hn.algolia.com/api/v1/search";

interface HnHit {
  objectID: string;
  title?: string;
  story_title?: string;
  comment_text?: string;
  story_text?: string;
  url?: string;
  story_url?: string;
  author?: string;
  created_at?: string;
}

function stripHtml(s: string): string {
  return s
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x2F;/g, "/")
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

/** Search HN stories + comments for one query. Never throws. */
export async function searchHackerNews(query: string, limit = 8): Promise<Candidate[]> {
  try {
    const u = new URL(ENDPOINT);
    u.searchParams.set("query", query);
    u.searchParams.set("tags", "(story,comment)");
    u.searchParams.set("hitsPerPage", String(limit));
    const res = await fetch(u, {
      headers: { "User-Agent": "closer-sdr/1.0" },
      // keep the demo snappy — don't hang on a slow source
      signal: AbortSignal.timeout(7000),
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { hits: HnHit[] };
    return (data.hits || [])
      .map((h): Candidate | null => {
        const body = stripHtml(h.comment_text || h.story_text || "");
        const title = h.title || h.story_title || (body ? body.slice(0, 90) : "");
        if (!title && !body) return null;
        const id = `hn_${h.objectID}`;
        return {
          id,
          source: "hackernews",
          title,
          text: body || title,
          url: h.url || h.story_url || `https://news.ycombinator.com/item?id=${h.objectID}`,
          author: h.author || "anon",
          createdAt: h.created_at || new Date().toISOString(),
        };
      })
      .filter((c): c is Candidate => c !== null);
  } catch {
    return [];
  }
}
