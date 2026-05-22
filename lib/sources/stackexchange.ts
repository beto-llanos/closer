// Stack Exchange search — keyless and works from datacenter IPs (unlike Reddit),
// so it gives real LIVE signals from Railway with zero credentials. We target the
// sites where people ask for solutions to a problem (buying intent):
//   - softwarerecs.stackexchange.com  → "recommend software that does X"
//   - webmasters.stackexchange.com    → site / e-commerce / SEO tooling questions
// Keyless quota is ~300 req/day per IP; on throttle it just returns [] and the
// pipeline leans on HackerNews. Never throws.
import type { Candidate } from "@/lib/types";

const ENDPOINT = "https://api.stackexchange.com/2.3/search/advanced";

interface SeItem {
  question_id: number;
  title: string;
  body?: string;
  link: string;
  creation_date: number;
  owner?: { display_name?: string };
}

function decode(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x2F;/g, "/");
}

function stripHtml(s: string): string {
  return decode(s.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}

export async function searchStackExchange(
  query: string,
  site: string,
  limit = 5,
): Promise<Candidate[]> {
  try {
    const u = new URL(ENDPOINT);
    u.searchParams.set("order", "desc");
    u.searchParams.set("sort", "relevance");
    u.searchParams.set("q", query);
    u.searchParams.set("site", site);
    u.searchParams.set("pagesize", String(limit));
    u.searchParams.set("filter", "withbody");

    const res = await fetch(u, {
      headers: { "User-Agent": "closer-sdr/1.0" },
      signal: AbortSignal.timeout(7000),
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { items?: SeItem[] };
    return (data.items || []).map((it): Candidate => {
      const title = decode(it.title || "");
      const body = stripHtml(it.body || "");
      return {
        id: `se_${site}_${it.question_id}`,
        source: "forum",
        title,
        text: body ? `${title} — ${body}`.slice(0, 600) : title,
        url: it.link,
        author: `${site}.stackexchange.com${
          it.owner?.display_name ? " · " + it.owner.display_name : ""
        }`,
        createdAt: new Date(it.creation_date * 1000).toISOString(),
      };
    });
  } catch {
    return [];
  }
}
