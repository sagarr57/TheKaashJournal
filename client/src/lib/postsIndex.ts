import type { BlogPost } from "@/lib/types";

// Post metadata only (no heavy markdown content).
export type PostIndexItem = Omit<BlogPost, "content"> & { content?: never };

export const postIndex: PostIndexItem[] = [
  {
    id: "1",
    title: "Five apps that help you tackle debt and budgeting (2026)",
    slug: "top-5-ai-tools-debt-management-2026",
    excerpt:
      "A straight comparison of YNAB, Rocket Money, Undebt.it, Copilot, and Goodbudget—what each is for, with links so you can check pricing and coverage yourself.",
    author: "Team Kaash",
    date: "2026-01-15",
    category: "Debt Management",
    tags: ["AI", "Debt", "Tools", "Finance"],
    readingTime: 8,
    featured: true,
    image: "/images/hero-abstract.jpg",
    seo: {
      metaDescription:
        "Hands-on look at YNAB, Rocket Money, Undebt.it, Copilot, and Goodbudget for budgeting and debt—with links to each product and UK debt help resources.",
      keywords: ["YNAB", "Undebt.it", "Rocket Money", "debt payoff tools", "budgeting apps UK"],
    },
  },
  {
    id: "2",
    title: "How Real-Time Financial Data is Changing Investment Decisions",
    slug: "real-time-financial-data-investment",
    excerpt:
      "Real-time data combined with AI is revolutionizing how investors make decisions. Learn how to leverage this technology for better returns.",
    author: "Team Kaash",
    date: "2026-01-12",
    category: "Real-Time Finance",
    tags: ["AI", "Investment", "Real-Time Data", "Trading"],
    readingTime: 6,
    featured: true,
    image: "/images/data-visualization-bg.jpg",
    seo: {
      metaDescription:
        "Discover how real-time financial data and AI are revolutionizing investment decisions. Learn strategies for leveraging this technology.",
      keywords: ["real-time financial data", "AI investing", "algorithmic trading", "investment AI"],
    },
  },
  {
    id: "3",
    title: "ChatGPT for Personal Finance: A Complete Beginner's Guide",
    slug: "chatgpt-personal-finance-guide",
    excerpt:
      "Concrete prompts for budgeting (UK and US examples), using ChatGPT for investing vocabulary—not stock tips—and when to switch to FCA-regulated human advice.",
    author: "Team Kaash",
    date: "2026-01-10",
    category: "How-To Guides",
    tags: ["ChatGPT", "AI", "Personal Finance", "Budgeting"],
    readingTime: 9,
    featured: true,
    image: "/images/icon-ai.png",
    seo: {
      metaDescription:
        "Use ChatGPT safely for budgets, debt strategy sketches, and learning investing terms—with UK prompts, GOV.UK debt signposting, and FCA/MoneyHelper links.",
      keywords: ["ChatGPT finance", "AI budgeting", "personal finance AI", "ChatGPT money"],
    },
  },
  {
    id: "4",
    title: "The Rise of AI-Powered Fintech Startups: What You Need to Know",
    slug: "ai-fintech-startups-2026",
    excerpt:
      "How AI shows up in lending, wealth apps, fraud detection, and support—and what to verify before you trust a startup with your money.",
    author: "Team Kaash",
    date: "2026-01-08",
    category: "Fintech Trends",
    tags: ["Fintech", "AI", "Startups", "Investment"],
    readingTime: 10,
    featured: false,
    image: "/images/icon-finance.png",
    seo: {
      metaDescription:
        "AI in fintech: underwriting speed, robo journeys, invisible fraud controls, and chat support—with FCA register and MoneyHelper signposts for UK readers.",
      keywords: ["AI fintech", "fintech startups", "fintech innovation", "AI finance companies"],
    },
  },
  {
    id: "5",
    title: "Automating Your Budget with AI: Step-by-Step Tutorial",
    slug: "automate-budget-ai-tutorial",
    excerpt:
      "Five steps: pick an app after Mint, connect safely via UK open banking, slim categories, weekly reviews, and month-end exports—plus YNAB, Goodbudget, Undebt.it.",
    author: "Team Kaash",
    date: "2026-01-05",
    category: "How-To Guides",
    tags: ["Budgeting", "Automation", "AI", "Personal Finance"],
    readingTime: 8,
    featured: false,
    image: "/images/icon-marketing.png",
    seo: {
      metaDescription:
        "Automated budgeting tutorial: Mint’s closure, YNAB/Goodbudget/Undebt.it, UK open banking consent, weekly review habit, and CSV snapshots.",
      keywords: ["automated budgeting", "AI budget", "budget automation", "smart budgeting"],
    },
  },
  {
    id: "6",
    title: "Comparing AI Robo-Advisors: Which One is Best for You?",
    slug: "ai-robo-advisors-comparison",
    excerpt:
      "What robo-advisors actually do, how to compare fees and ISAs, when chat features help, and UK platforms to research—Moneybox, Vanguard, interactive investor—plus the FCA register.",
    author: "Team Kaash",
    date: "2026-01-02",
    category: "How-To Guides",
    tags: ["Robo-Advisors", "Investment", "AI", "Comparison"],
    readingTime: 10,
    featured: false,
    image: "/images/hero-abstract.jpg",
    seo: {
      metaDescription:
        "Robo-advisor comparison framework: costs, portfolios, cash drag, ISAs, risk questionnaires, UK platform links, and when you need a human adviser—not hype.",
      keywords: ["robo-advisor comparison", "best robo-advisors", "AI investment", "automated investing"],
    },
  },
  {
    id: "7",
    title: "Latest AI Finance Tools: What's New in January 2026",
    slug: "latest-ai-finance-tools-january-2026",
    excerpt:
      "A January 2026 snapshot: ChatGPT, Claude, Gemini, Copilot, real budgeting apps, UK bank analytics, open banking—and how to tell signal from social hype.",
    author: "Team Kaash",
    date: "2026-01-20",
    category: "AI Tools & Updates",
    tags: ["AI Tools", "Finance", "Updates", "Technology"],
    readingTime: 11,
    featured: true,
    image: "/images/icon-ai.png",
    seo: {
      metaDescription:
        "Early-2026 AI finance landscape: assistants, Microsoft/Google copilots, YNAB, Goodbudget, Undebt.it, UK neobanks, TrueLayer, FCA scam guidance—with official links.",
      keywords: ["AI finance tools", "financial technology", "AI updates", "fintech 2026"],
    },
  },
  {
    id: "8",
    title: "Paying down a large balance: a composite teaching example (not a verified news story)",
    slug: "case-study-ai-debt-payoff-50000",
    excerpt:
      "A fictional-but-realistic path: full debt list, one weekly budgeting habit, avalanche vs snowball, automated minimums, and when to call free UK advisers—not a verified household story.",
    author: "Team Kaash",
    date: "2026-01-18",
    category: "Case Studies",
    tags: ["Debt", "AI", "Budgeting", "Teaching example"],
    readingTime: 12,
    featured: true,
    image: "/images/data-visualization-bg.jpg",
    seo: {
      metaDescription:
        "Composite teaching example: phases from honest inventory through budgeting apps, avalanche vs snowball, automation, and when to use free UK debt advice—not a news story.",
      keywords: ["debt payoff plan", "AI budgeting tools", "debt management UK", "financial habits"],
    },
  },
  {
    id: "9",
    title: "When Debt Takes Over Your Headspace (and How to Steady the Wheel)",
    slug: "debt-stress-mindset-practical-steps",
    excerpt:
      "Money worries can crowd out everything else. Here is a calmer way to understand what is happening emotionally — and a practical path back toward clarity.",
    author: "Team Kaash",
    date: "2026-04-14",
    category: "Debt Management",
    tags: ["Debt stress", "Mental health", "Budgeting", "UK finance"],
    readingTime: 11,
    featured: false,
    image: "/images/hero-abstract.jpg",
    seo: {
      metaDescription:
        "Understand how debt stress affects thinking and motivation, and learn practical, non-judgemental steps to regain control of your finances in the UK.",
      keywords: ["debt stress", "money anxiety", "debt help UK", "financial wellbeing"],
    },
  },
  {
    id: "10",
    title: "Loan Repayments Feel Relentless. Here Is How to Take the Pressure Down",
    slug: "loan-repayment-stress-seven-approaches",
    excerpt:
      "Fixed monthly payments can feel like a treadmill. These approaches focus on communication, structure, and small buffers — not willpower alone.",
    author: "Team Kaash",
    date: "2026-04-12",
    category: "Debt Management",
    tags: ["Loans", "Repayments", "Refinancing", "UK"],
    readingTime: 12,
    featured: false,
    image: "/images/data-visualization-bg.jpg",
    seo: {
      metaDescription:
        "Practical ways to manage loan repayment stress: clarity on numbers, lender conversations, automation, and when to seek free debt advice.",
      keywords: ["loan stress", "repayment help", "debt advice UK", "personal loans"],
    },
  },
  {
    id: "11",
    title: "A Debt Collector Has Called. Pause, Verify, Then Decide Your Next Move",
    slug: "debt-collector-call-uk-verify-rights",
    excerpt:
      "Unexpected calls about money you may or may not owe are unsettling. This guide walks through verification, records, and where to get trustworthy help.",
    author: "Team Kaash",
    date: "2026-04-10",
    category: "Debt Management",
    tags: ["Debt collection", "Consumer rights", "UK", "Scams"],
    readingTime: 10,
    featured: false,
    image: "/images/hero-abstract.jpg",
    seo: {
      metaDescription:
        "What to do if a debt collector calls: verify the debt, know UK protections, avoid pressure tactics, and use official channels before you pay.",
      keywords: ["debt collector UK", "verify debt", "FCA debt collection", "consumer rights"],
    },
  },
  {
    id: "12",
    title: "IVAs in Plain English: Who They Suit, What They Cost You, and What to Ask First",
    slug: "iva-uk-explained-trade-offs",
    excerpt:
      "Individual Voluntary Arrangements are widely advertised. This piece explains the mechanics, typical trade-offs, and how to get advice that is not selling you a product.",
    author: "Team Kaash",
    date: "2026-04-08",
    category: "Debt Management",
    tags: ["IVA", "Insolvency", "UK debt", "Advice"],
    readingTime: 13,
    featured: false,
    image: "/images/data-visualization-bg.jpg",
    seo: {
      metaDescription:
        "An impartial overview of UK IVAs: duration, voting rules, credit file impact, fees, and why free debt charities should be part of your research.",
      keywords: ["IVA UK", "Individual Voluntary Arrangement", "debt solutions", "insolvency practitioner"],
    },
  },
  {
    id: "13",
    title: "Several Loans at Once? A Straightforward Way to Tidy the Mess",
    slug: "multiple-loans-strategy-consolidation-pitfalls",
    excerpt:
      "More than one repayment each month is mentally expensive. Here is how to rank debts, when consolidation helps, and the habits that undo good plans.",
    author: "Team Kaash",
    date: "2026-04-06",
    category: "Debt Management",
    tags: ["Multiple debts", "Snowball", "Avalanche", "Consolidation"],
    readingTime: 12,
    featured: false,
    image: "/images/hero-abstract.jpg",
    seo: {
      metaDescription:
        "Manage multiple loans with a clear inventory, a repayment strategy that matches your personality, and pitfalls that keep people cycling back into debt.",
      keywords: ["multiple loans", "debt snowball", "debt avalanche", "consolidation loan UK"],
    },
  },
  {
    id: "14",
    title: "Debt Advice Scams: 9 Red Flags Before You Share a Pound",
    slug: "debt-advice-scams-red-flags-uk",
    excerpt:
      "Not every company promising debt relief is acting in your best interest. Learn the warning signs and how to verify providers before you commit.",
    author: "Team Kaash",
    date: "2026-04-04",
    category: "Debt Management",
    tags: ["Debt advice", "Scams", "UK", "Consumer protection"],
    readingTime: 11,
    featured: false,
    image: "/images/data-visualization-bg.jpg",
    seo: {
      metaDescription:
        "How to spot debt advice scams in the UK: red flags, verification steps, and safe alternatives through free FCA-authorised support.",
      keywords: ["debt scam warning signs", "FCA authorised debt advice", "debt help UK", "financial scams"],
    },
  },
  {
    id: "15",
    title: "How to Build a Debt Payoff Plan in 60 Minutes (Without Fancy Tools)",
    slug: "build-debt-payoff-plan-in-60-minutes",
    excerpt:
      "You do not need complex apps to start. This one-hour planning method helps you map balances, priorities, and realistic monthly actions.",
    author: "Team Kaash",
    date: "2026-04-02",
    category: "Debt Management",
    tags: ["Debt plan", "Budgeting", "Repayment strategy", "Financial wellbeing"],
    readingTime: 10,
    featured: false,
    image: "/images/hero-abstract.jpg",
    seo: {
      metaDescription:
        "Create a practical debt payoff plan in one hour with a simple template, realistic budget rules, and a follow-through routine.",
      keywords: ["debt payoff plan", "budget for debt", "repayment strategy", "debt management steps"],
    },
  },
];

export function getPostIndexBySlug(slug: string): PostIndexItem | undefined {
  return postIndex.find((post) => post.slug === slug);
}

