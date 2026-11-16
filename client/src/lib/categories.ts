import type { Author, Category } from "@/lib/types";

export const categories: Category[] = [
  {
    id: "1",
    name: "AI and Health",
    slug: "ai-and-health",
    description: "AI in the NHS, wearables, digital therapeutics, and mental health technology",
    longDescription:
      "How artificial intelligence is transforming UK healthcare — from the NHS £10bn AI investment and Microsoft Copilot for 500,000 staff, to ambient voice documentation, AI-guided CBT in GP surgeries, MHRA-evaluated digital therapeutics, and wearable health monitors. Every article is grounded in peer-reviewed research, NHS England policy, NICE evidence standards, and real-world pilot data. Written by Kash.",
    topics: ["NHS AI technology 2026", "AI mental health tools NHS", "ambient voice NHS", "NICE digital therapeutics", "Microsoft Copilot NHS", "wearable health UK", "AI-guided CBT"],
    color: "#0066FF",
  },
  {
    id: "2",
    name: "Debt Management",
    slug: "debt-management",
    description: "IVAs, DROs, debt relief options, and UK household debt guides",
    longDescription:
      "Practical, FCA-aware guides to managing debt in the UK — IVA statistics, Debt Relief Orders, Breathing Space, debt management plans, energy debt, and mortgage rate shocks. All articles reference free FCA-authorised services including StepChange, MoneyHelper, and National Debtline. Written by Saga, backed by Insolvency Service and Bank of England data.",
    topics: ["IVA guide UK 2026", "debt relief order UK", "UK household debt 2026", "energy debt Ofgem", "debt management plan UK", "mortgage arrears UK", "breathing space debt"],
    color: "#FF3B30",
  },
  {
    id: "3",
    name: "Real-Time Finance",
    slug: "real-time-finance",
    description: "Open banking payments, UK payments infrastructure, and fintech investment data",
    longDescription:
      "How real-time data, open banking, and payments infrastructure are reshaping UK finance — Faster Payments statistics, the New Payments Architecture migration, TrueLayer and Paymentology funding rounds, UK fintech investment trends, and what ISO 20022 means for UK businesses. UK-focused, FCA-aware. Written by Kash and Saga from primary industry and regulatory sources.",
    topics: ["UK Faster Payments statistics", "New Payments Architecture 2026", "open banking payments UK", "UK fintech investment 2026", "ISO 20022 UK", "TrueLayer open banking", "real-time payments"],
    color: "#34C759",
  },
  {
    id: "4",
    name: "Fintech Trends",
    slug: "fintech-trends",
    description: "FCA regulation, BNPL, open banking, crypto authorisation, and UK neobank trends",
    longDescription:
      "In-depth analysis of UK fintech regulatory developments and market trends — BNPL FCA regulation from July 2026, open banking 17 million UK users, the FCA open finance roadmap to 2030, FCA crypto authorisation gateway, safeguarding rules for e-money firms, and what it all means for UK consumers and businesses. Primary sources: FCA policy statements, GOV.UK, and official regulatory publications.",
    topics: ["BNPL FCA regulation 2026", "open banking 17 million users", "FCA open finance roadmap 2030", "FCA crypto authorisation 2026", "e-money safeguarding FCA", "fintech regulation UK"],
    color: "#FF9500",
  },
  {
    id: "5",
    name: "Case Studies",
    slug: "case-studies",
    description: "Revolut, Monzo, Starling, Wise — data-driven UK fintech analysis",
    longDescription:
      "Data-driven case studies of UK fintech's leading companies — Revolut's UK banking licence, Monzo's £172m first-year profit, Starling's £217m 24%-margin model, Wise's Nasdaq dual listing, and UK neobank comparison analysis. All case studies draw exclusively on official company filings, public financial statements, and verified regulatory records. Written by Kash.",
    topics: ["Revolut UK banking licence 2026", "Monzo profit case study 2026", "Starling Bank analysis 2026", "Wise Nasdaq listing 2026", "UK neobank comparison", "UK fintech unicorns 2026"],
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

