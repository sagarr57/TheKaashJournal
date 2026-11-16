export interface AuthorProfile {
  name: string;
  role: string;
  linkedin: string;
  experience: string[];
  researchSources: string[];
  specialisms: string[];
  bio: string[];
  categories: string[];
}

export const AUTHORS: Record<string, AuthorProfile> = {
  kash: {
    name: "Kash",
    role: "Contributor — AI & Health Technology",
    linkedin: "https://www.linkedin.com/in/kaushika-binod/",
    experience: [
      "Health technology research and digital health product analysis",
      "NHS digital transformation and clinical AI policy review",
      "Wearable diagnostics and preventive health evidence assessment",
      "Real-time financial data and investment technology reporting",
    ],
    researchSources: [
      "NHS England and NHS Digital publications",
      "GOV.UK and NICE guidance",
      "Peer-reviewed journals (NEJM, The Lancet, Nature Medicine)",
      "Company SEC filings and annual reports for case studies",
      "FCA register for UK financial product verification",
    ],
    specialisms: [
      "AI in NHS services",
      "Wearable health technology",
      "Digital therapeutics",
      "Clinical AI tools",
      "Real-time financial data",
      "Case studies & analytics",
    ],
    bio: [
      "Kash writes on the intersection of artificial intelligence and healthcare, covering how AI tools are being integrated into NHS services, preventive health, and digital therapeutics. Articles are grounded in peer-reviewed research and primary NHS and GOV.UK sources.",
      "Beyond health, Kash also covers real-time financial data and AI-driven investment tools — including how live market data, algorithmic trading platforms, and robo-advisory systems are changing personal and institutional finance.",
      "Every article Kash publishes on The Kaash Journal is fact-checked against authoritative sources before publication. Where the evidence is limited or contested, that limitation is stated clearly in the text.",
    ],
    categories: ["AI and Health", "Real-Time Finance", "Case Studies"],
  },
  saga: {
    name: "Saga",
    role: "Contributor — Fintech & Regulation",
    linkedin: "https://www.linkedin.com/in/sagar-mamindla/",
    experience: [
      "UK financial services compliance and consumer protection",
      "FCA regulatory policy and open banking developments",
      "Debt management strategies and insolvency route comparison",
      "Fintech investment analysis and neobank market coverage",
    ],
    researchSources: [
      "FCA policy statements and consumer guidance",
      "HM Treasury and Bank of England publications",
      "GOV.UK debt advice and insolvency resources",
      "MoneyHelper and StepChange public materials",
      "TheCityUK and UK Finance industry data",
    ],
    specialisms: [
      "FCA regulatory developments",
      "Open banking & BNPL",
      "Debt management strategies",
      "UK fintech investment",
      "RegTech & compliance",
      "Consumer finance guidance",
    ],
    bio: [
      "Saga covers the UK's fast-moving fintech landscape — from FCA regulatory changes and open banking to BNPL lending, debt management, and the rise of neobanks. Articles draw on FCA publications, HM Treasury consultations, TheCityUK data, and official consumer finance resources.",
      "A significant part of Saga's work focuses on debt management: practical guides for readers navigating IVAs, debt consolidation, repayment strategies, and free debt advice services. All articles signpost readers to FCA-authorised services including MoneyHelper and StepChange.",
      "Saga believes that financial journalism should lower barriers rather than raise them. That means jargon-free language, links to primary sources, and honest assessments of both the opportunities and risks in financial products.",
    ],
    categories: ["Debt Management", "Fintech Trends"],
  },
};
