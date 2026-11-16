// Groups of articles on one topic. Each group has a main guide that the others point to, so
// readers (and search engines) can tell which page is the starting point, plus the official
// bodies a reader can check the facts with.

export interface TopicResource {
  name: string;
  url: string;
}

export interface TopicHub {
  label: string;
  /** Slug of the main guide for the topic. */
  hub: string;
  members: string[];
  resources: TopicResource[];
}

const MONEYHELPER = { name: "MoneyHelper (government-backed)", url: "https://www.moneyhelper.org.uk/" };
const STEPCHANGE = { name: "StepChange Debt Charity", url: "https://www.stepchange.org/" };
const FCA_REGISTER = { name: "FCA Financial Services Register", url: "https://register.fca.org.uk/s/" };
const FSCS = { name: "Financial Services Compensation Scheme", url: "https://www.fscs.org.uk/" };
const FCA_CONSUMERS = { name: "FCA consumer information", url: "https://www.fca.org.uk/consumers" };
const NHS = { name: "NHS.uk", url: "https://www.nhs.uk/" };
const NICE = { name: "NICE guidance", url: "https://www.nice.org.uk/" };
const MHRA = { name: "MHRA (medical device regulator)", url: "https://www.gov.uk/government/organisations/medicines-and-healthcare-products-regulatory-agency" };
const NHS_MENTAL_HEALTH = { name: "NHS mental health services", url: "https://www.nhs.uk/mental-health/" };
const MIND = { name: "Mind", url: "https://www.mind.org.uk/" };

export const topicHubs: TopicHub[] = [
  {
    label: "UK debt solutions: IVAs, DMPs and DROs",
    hub: "debt-options-guide-uk-2026",
    members: [
      "iva-vs-debt-management-plan-uk-2026",
      "iva-uk-explained-trade-offs",
      "debt-relief-order-vs-iva-homeowner-uk-2026",
      "debt-relief-options-uk-winter-2026",
      "ivas-post-2022-high-july-2026",
      "september-2026-uk-insolvency-statistics",
      "uk-insolvency-2025-record-household-case-studies",
      "debt-collector-call-uk-verify-rights",
      "uk-household-debt-67802-average-2026",
      "uk-energy-debt-6bn-record-2026",
    ],
    resources: [
      { name: "GOV.UK: options for paying off your debts", url: "https://www.gov.uk/options-for-paying-off-your-debts" },
      STEPCHANGE,
      { name: "National Debtline", url: "https://nationaldebtline.org/" },
      { name: "Citizens Advice: debt and money", url: "https://www.citizensadvice.org.uk/debt-and-money/" },
      { name: "Insolvency Service official statistics", url: "https://www.gov.uk/government/collections/insolvency-service-official-statistics" },
    ],
  },
  {
    label: "Debt payoff plans, budgeting and tools",
    hub: "top-5-ai-tools-debt-management-2026",
    members: [
      "build-debt-payoff-plan-in-60-minutes",
      "automate-budget-ai-tutorial",
      "best-budgeting-savings-apps-uk-2026",
      "multiple-loans-strategy-consolidation-pitfalls",
      "loan-repayment-stress-seven-approaches",
      "best-emergency-loan-alternatives-2026",
      "case-study-ai-debt-payoff-50000",
      "credit-score-myths-uk-2026",
      "uk-personal-debt-emergency-ai-tools-2026",
    ],
    resources: [MONEYHELPER, STEPCHANGE, FCA_REGISTER],
  },
  {
    label: "Buy Now Pay Later in the UK",
    hub: "buy-now-pay-later-bnpl-uk-guide-2026",
    members: ["bnpl-fca-regulation-july-2026", "bnpl-regulation-uk-2026", "bnpl-uk-debt-crisis-ai-fintech-regulation-2026"],
    resources: [{ name: "FCA: Buy Now Pay Later", url: "https://www.fca.org.uk/consumers/buy-now-pay-later" }, MONEYHELPER, STEPCHANGE],
  },
  {
    label: "Open banking and open finance",
    hub: "open-banking-uk-explained",
    members: [
      "open-banking-17-million-uk-users-2026",
      "fca-open-finance-roadmap-2030-guide",
      "open-finance-uk-fca-roadmap-2026",
      "truelayer-27m-open-banking-payments-2026",
      "open-banking-ai-credit-invisible-borrowers-uk-2026",
      "commercial-vrp-uk-2026-businesses",
      "real-time-credit-decisioning-uk",
    ],
    resources: [{ name: "Open Banking Limited", url: "https://www.openbanking.org.uk/" }, FCA_CONSUMERS, FCA_REGISTER],
  },
  {
    label: "UK payments infrastructure",
    hub: "new-payments-architecture-uk-guide-2026",
    members: [
      "new-payments-architecture-uk",
      "uk-faster-payments-59-billion-transactions",
      "real-time-payments-uk-small-business",
      "agentic-commerce-uk-payments-2026",
      "digital-identity-payments-uk-2026",
      "paymentology-175m-real-time-cards-2026",
      "real-time-treasury-management-uk-2026",
    ],
    resources: [{ name: "Pay.UK", url: "https://www.wearepay.uk/" }, { name: "Payment Systems Regulator", url: "https://www.psr.org.uk/" }],
  },
  {
    label: "Fraud and scams",
    hub: "ai-fraud-detection-uk-banks-explained-2026",
    members: ["real-time-fraud-detection-uk-banking", "debt-advice-scams-red-flags-uk"],
    resources: [{ name: "FCA ScamSmart", url: "https://www.fca.org.uk/scamsmart" }, { name: "Action Fraud", url: "https://www.actionfraud.police.uk/" }],
  },
  {
    label: "Robo-advisors and AI investing",
    hub: "ai-robo-advisors-comparison",
    members: [
      "robo-advisors-vs-human-financial-advisors-2026",
      "wall-street-in-your-pocket-ai-copilot-beat-market",
      "real-time-financial-data-investment",
      "climate-fintech-esg-investing-ai-2026",
      "ai-advice-gap-uk-fintech-financial-guidance-28-million",
      "agentic-finance-ai-2026",
    ],
    resources: [FCA_REGISTER, FSCS, MONEYHELPER],
  },
  {
    label: "UK neobanks and fintech",
    hub: "uk-fintech-unicorns-2026-revolut-monzo-starling-wise",
    members: [
      "neobanks-uk-2026-comparison",
      "monzo-172m-profit-case-study-2026",
      "starling-bank-217m-profit-2026",
      "revolut-uk-banking-licence-march-2026",
      "wise-nasdaq-listing-may-2026",
      "uk-fintech-investment-2026",
      "uk-fintech-investment-18bn-h1-2026",
    ],
    resources: [FCA_REGISTER, FSCS],
  },
  {
    label: "AI in banking: case studies",
    hub: "jpmorgan-ai-banking-strategy-case-study",
    members: [
      "nubank-ai-strategy-100-million-customers",
      "klarna-ai-customer-service-case-study",
      "deutsche-bank-google-cloud-ai-transformation",
      "mastercard-ai-fraud-detection-decision-intelligence",
      "blockchain-ai-case-studies-financial-value-2026",
      "generative-ai-uk-financial-services-fca",
    ],
    resources: [],
  },
  {
    label: "AI in the NHS",
    hub: "ai-nhs-uk-healthcare-transformation",
    members: [
      "nhs-10bn-ai-rollout-2026",
      "microsoft-copilot-nhs-500000-staff-2026",
      "ai-notetaking-nhs-ambient-voice-technology-2026",
      "nhs-ai-scribing-uk-2026",
      "predictive-ai-nhs-patient-data-uk",
      "ai-cancer-detection-uk",
      "ai-cbt-gp-surgeries-pilot-2026",
      "ai-drug-discovery-uk",
    ],
    resources: [{ name: "NHS England", url: "https://www.england.nhs.uk/" }, NICE, MHRA],
  },
  {
    label: "AI and mental health",
    hub: "ai-therapy-apps-uk-2026-safe",
    members: [
      "ai-mental-health-uk",
      "ai-chatbot-therapy-uk-mental-health-2026",
      "ai-mental-health-tools-nhs-2026-evidence",
      "ai-mental-health-digital-therapist-2026",
      "ai-workplace-mental-health-uk-employers-2026",
      "ai-uk-loneliness-crisis-2026",
    ],
    resources: [NHS_MENTAL_HEALTH, MIND, { name: "Samaritans (116 123, free, any time)", url: "https://www.samaritans.org/" }, NICE],
  },
  {
    label: "Health apps and wearables",
    hub: "best-ai-health-apps-uk-2026",
    members: [
      "ai-symptom-checker-uk-safe",
      "wearable-health-technology-uk",
      "ai-wearables-predicting-illness-2026",
      "ai-sleep-health-apps-uk-2026",
      "ai-chronic-disease-management-uk-2026",
      "ai-financial-wellbeing-apps-uk-2026",
      "ai-elderly-care-uk-technology",
    ],
    resources: [NHS, MHRA, NICE],
  },
  {
    label: "Stress, burnout and money worries",
    hub: "ai-burnout-wellness-tech-uk-workplace-2026",
    members: [
      "stress-burnout-nervous-system-ai-2026",
      "ai-app-financial-burnout-early-signs-uk-2026",
      "financial-wellbeing-workplace-money-stress-uk-employers-2026",
      "debt-mental-health-spiral-ai-wellness-tools-uk",
      "debt-stress-mindset-practical-steps",
    ],
    resources: [{ name: "HSE: work-related stress", url: "https://www.hse.gov.uk/stress/" }, NHS_MENTAL_HEALTH, MIND],
  },
];

export function getTopicHub(slug: string): TopicHub | undefined {
  return topicHubs.find((topic) => topic.hub === slug || topic.members.includes(slug));
}
