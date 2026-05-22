// Seed signals — realistic public-style "raising my hand" posts used as a
// fallback so the demo ALWAYS shows a working pipeline, even if a live source
// is rate-limited or the judge's niche returns thin results. These are clearly
// sample data (seed: true) and are blended in only to top up live results.
import type { Candidate } from "@/lib/types";

const now = Date.now();
const ago = (h: number) => new Date(now - h * 3600_000).toISOString();

export const SEED_SIGNALS: Candidate[] = [
  {
    id: "seed_1",
    source: "reddit",
    title: "Drowning in manual data entry — need to automate our order workflow",
    text:
      "We run a 12-person distribution business and still copy orders from email into our ERP by hand. It eats ~3 hours a day. Looking for someone or a tool to automate this. Budget exists if it actually works.",
    url: "https://www.reddit.com/r/smallbusiness/",
    author: "r/smallbusiness · u/ops_lead_92",
    createdAt: ago(5),
    seed: true,
  },
  {
    id: "seed_2",
    source: "hackernews",
    title: "Ask HN: how are small teams handling inbound lead qualification?",
    text:
      "Founder here. We get ~80 inbound messages a week and our 2 SDRs can't keep up. Half are junk. Is there a sane way to auto-qualify and route the good ones? Open to paying.",
    url: "https://news.ycombinator.com/",
    author: "yc_founder",
    createdAt: ago(9),
    seed: true,
  },
  {
    id: "seed_3",
    source: "reddit",
    title: "Need help integrating WhatsApp with our CRM (clinic)",
    text:
      "We're a dental clinic group. Patients message on WhatsApp but nothing syncs to our CRM so we lose follow-ups. Need someone to build/automate this. Real budget.",
    url: "https://www.reddit.com/r/Entrepreneur/",
    author: "r/Entrepreneur · u/clinicgrowth",
    createdAt: ago(14),
    seed: true,
  },
  {
    id: "seed_4",
    source: "forum",
    title: "Looking for a developer to scrape supplier catalogs into one feed",
    text:
      "E-commerce store, 6 suppliers each with their own site/format. I want a daily automated feed merged into our catalog. Anyone do this kind of work?",
    url: "https://www.indiehackers.com/",
    author: "indiehackers · catalog_carlos",
    createdAt: ago(20),
    seed: true,
  },
  {
    id: "seed_5",
    source: "reddit",
    title: "Spending too much on a tool that does way less than promised",
    text:
      "We pay a fortune for an 'AI SDR' that just blasts a bought list. Reply rate is awful. Thinking of switching to something that actually finds warm leads. Recommendations?",
    url: "https://www.reddit.com/r/sales/",
    author: "r/sales · u/quota_crunch",
    createdAt: ago(26),
    seed: true,
  },
  {
    id: "seed_6",
    source: "hackernews",
    title: "Ask HN: best way to monitor competitors and get a weekly brief?",
    text:
      "Two-person startup. I want an automated weekly brief on what 5 competitors ship and what people say. Would happily pay for a done-for-me setup.",
    url: "https://news.ycombinator.com/",
    author: "stealth_b2b",
    createdAt: ago(33),
    seed: true,
  },
  {
    id: "seed_7",
    source: "reddit",
    title: "Our invoices are a mess — want to auto-extract and push to accounting",
    text:
      "Construction subcontractor. Hundreds of PDF invoices a month, all different layouts. Need to auto-extract line items into our accounting system. Where do I even start?",
    url: "https://www.reddit.com/r/smallbusiness/",
    author: "r/smallbusiness · u/buildco_amy",
    createdAt: ago(40),
    seed: true,
  },
  {
    id: "seed_8",
    source: "forum",
    title: "Want to integrate AI into our support inbox without a huge project",
    text:
      "SaaS, ~500 tickets/week. Want AI to draft replies and tag urgency, but our team is non-technical. Looking for someone to set it up pragmatically.",
    url: "https://www.indiehackers.com/",
    author: "indiehackers · support_sam",
    createdAt: ago(48),
    seed: true,
  },
];
