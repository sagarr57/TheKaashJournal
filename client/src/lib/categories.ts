import type { Author, Category } from "@/lib/types";

export const categories: Category[] = [
  {
    id: "1",
    name: "AI and Health",
    slug: "ai-and-health",
    description: "AI developments in health, wellness, and wearables",
    longDescription:
      "How artificial intelligence is transforming healthcare in the UK and beyond — from NHS diagnostic tools and AI-assisted drug discovery to wearable health monitors, mental wellness apps, and digital therapeutics. Every article is grounded in peer-reviewed research, NHS policy, and real-world deployments, written by Kash.",
    topics: ["NHS AI diagnostics", "AI mental health tools", "wearable health tech", "digital therapeutics", "AI drug discovery"],
    color: "#0066FF",
  },
  {
    id: "2",
    name: "Debt Management",
    slug: "debt-management",
    description: "AI solutions for debt tracking and payoff",
    longDescription:
      "Practical, FCA-aware guides to managing debt using modern tools — IVA considerations, AI-powered budgeting apps, debt consolidation calculators, and UK-specific repayment strategies. Written by Saga with references to free UK debt services including StepChange and MoneyHelper.",
    topics: ["debt consolidation UK", "IVA explained", "AI budgeting apps", "credit score improvement", "debt-free strategies"],
    color: "#FF3B30",
  },
  {
    id: "3",
    name: "Real-Time Finance",
    slug: "real-time-finance",
    description: "Live market data and AI analysis",
    longDescription:
      "How AI and real-time data are reshaping personal finance decisions — robo-advisors, open banking apps, algorithmic trading explainers, and live market analysis tools. UK-focused, FCA-aware coverage of what is actually deployed today and what the independent data shows.",
    topics: ["robo-advisors UK", "open banking", "algorithmic trading", "real-time budgeting", "AI financial planning"],
    color: "#34C759",
  },
  {
    id: "4",
    name: "Fintech Trends",
    slug: "fintech-trends",
    description: "Industry news and analysis",
    longDescription:
      "In-depth analysis of UK and global fintech developments — neobanks, embedded finance, FCA and PRA regulatory changes, buy-now-pay-later, and the technologies reshaping how money moves. Balanced reporting with primary sources, regulatory context, and verified data.",
    topics: ["neobanks UK", "BNPL regulation", "embedded finance", "FCA regulation", "open banking", "fintech investment"],
    color: "#FF9500",
  },
  {
    id: "5",
    name: "Case Studies",
    slug: "case-studies",
    description: "In-depth analytical guides and worked examples",
    longDescription:
      "Detailed breakdowns of how major institutions — JPMorgan Chase, Nubank, Klarna, Goldman Sachs, and others — are deploying artificial intelligence and technology in financial services. Each case study draws exclusively on public filings, press releases, and verified industry sources.",
    topics: ["JPMorgan AI strategy", "Nubank growth model", "Goldman Sachs AI", "banking technology", "fintech company analysis"],
    color: "#00C7BE",
  },
];

export const author: Author = {
  id: "main",
  name: "Team Kaash",
  bio: "Team Kaash editorial desk covering AI, fintech, and practical personal finance insights.",
  avatar: "/images/icon-ai.png",
  social: {
    twitter: "https://twitter.com",
    linkedin: "https://linkedin.com",
    github: "https://github.com",
  },
};

