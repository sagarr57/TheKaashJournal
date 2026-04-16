import type { BlogPost } from "@/lib/types";

// Post metadata only (no heavy markdown content).
export type PostIndexItem = Omit<BlogPost, "content"> & { content?: never };

export const postIndex: PostIndexItem[] = [
  {
    id: "1",
    title: "Top 5 AI Tools for Debt Management in 2026",
    slug: "top-5-ai-tools-debt-management-2026",
    excerpt:
      "Discover the most powerful AI-driven tools that can help you automate debt tracking, optimize payoff strategies, and take control of your finances.",
    author: "Team Kaash",
    date: "2026-01-15",
    category: "Debt Management",
    tags: ["AI", "Debt", "Tools", "Finance"],
    readingTime: 8,
    featured: true,
    image: "/images/hero-abstract.jpg",
    seo: {
      metaDescription:
        "Explore the top 5 AI tools transforming debt management in 2026. Automate tracking, optimize payoff strategies, and achieve financial freedom faster.",
      keywords: ["AI debt management", "debt payoff tools", "AI finance", "debt consolidation"],
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
      "Learn how to use ChatGPT and other AI language models to improve your personal finance management, budgeting, and financial planning.",
    author: "Team Kaash",
    date: "2026-01-10",
    category: "How-To Guides",
    tags: ["ChatGPT", "AI", "Personal Finance", "Budgeting"],
    readingTime: 7,
    featured: true,
    image: "/images/icon-ai.png",
    seo: {
      metaDescription:
        "Master ChatGPT for personal finance. Learn practical strategies for budgeting, debt payoff, and financial planning with AI assistance.",
      keywords: ["ChatGPT finance", "AI budgeting", "personal finance AI", "ChatGPT money"],
    },
  },
  {
    id: "4",
    title: "The Rise of AI-Powered Fintech Startups: What You Need to Know",
    slug: "ai-fintech-startups-2026",
    excerpt:
      "Explore the explosive growth of AI-powered fintech companies and what their success means for the future of finance.",
    author: "Team Kaash",
    date: "2026-01-08",
    category: "Fintech Trends",
    tags: ["Fintech", "AI", "Startups", "Investment"],
    readingTime: 9,
    featured: false,
    image: "/images/icon-finance.png",
    seo: {
      metaDescription:
        "Discover the explosive growth of AI-powered fintech startups and what it means for the future of finance and investment opportunities.",
      keywords: ["AI fintech", "fintech startups", "fintech innovation", "AI finance companies"],
    },
  },
  {
    id: "5",
    title: "Automating Your Budget with AI: Step-by-Step Tutorial",
    slug: "automate-budget-ai-tutorial",
    excerpt:
      "A practical guide to setting up automated budgeting with AI tools. Save time and make smarter financial decisions.",
    author: "Team Kaash",
    date: "2026-01-05",
    category: "How-To Guides",
    tags: ["Budgeting", "Automation", "AI", "Personal Finance"],
    readingTime: 6,
    featured: false,
    image: "/images/icon-marketing.png",
    seo: {
      metaDescription:
        "Learn how to automate your budget with AI tools. Step-by-step guide to save time and make smarter financial decisions.",
      keywords: ["automated budgeting", "AI budget", "budget automation", "smart budgeting"],
    },
  },
  {
    id: "6",
    title: "Comparing AI Robo-Advisors: Which One is Best for You?",
    slug: "ai-robo-advisors-comparison",
    excerpt:
      "Compare the top AI-powered robo-advisors and find the perfect fit for your investment goals and budget.",
    author: "Team Kaash",
    date: "2026-01-02",
    category: "How-To Guides",
    tags: ["Robo-Advisors", "Investment", "AI", "Comparison"],
    readingTime: 8,
    featured: false,
    image: "/images/hero-abstract.jpg",
    seo: {
      metaDescription:
        "Compare the best AI robo-advisors. Find the perfect platform for your investment goals with our detailed comparison and recommendations.",
      keywords: ["robo-advisor comparison", "best robo-advisors", "AI investment", "automated investing"],
    },
  },
  {
    id: "7",
    title: "Latest AI Finance Tools: What's New in January 2026",
    slug: "latest-ai-finance-tools-january-2026",
    excerpt:
      "Stay ahead of the curve with the newest AI-powered finance tools launching this month. Discover innovations that can transform your financial management.",
    author: "Team Kaash",
    date: "2026-01-20",
    category: "AI Tools & Updates",
    tags: ["AI Tools", "Finance", "Updates", "Technology"],
    readingTime: 7,
    featured: true,
    image: "/images/icon-ai.png",
    seo: {
      metaDescription:
        "Discover the latest AI finance tools launching in January 2026. Stay ahead with cutting-edge innovations in financial technology.",
      keywords: ["AI finance tools", "financial technology", "AI updates", "fintech 2026"],
    },
  },
  {
    id: "8",
    title: "Case Study: How AI Helped a Family Pay Off $50,000 in Debt",
    slug: "case-study-ai-debt-payoff-50000",
    excerpt:
      "A real-world success story of how AI-powered debt management tools helped a family eliminate $50,000 in debt in just 18 months.",
    author: "Team Kaash",
    date: "2026-01-18",
    category: "Case Studies",
    tags: ["Case Study", "Debt", "AI", "Success Story"],
    readingTime: 10,
    featured: true,
    image: "/images/data-visualization-bg.jpg",
    seo: {
      metaDescription:
        "Real success story: How AI helped a family pay off $50,000 in debt in 18 months. Learn the strategies and tools that made it possible.",
      keywords: ["debt payoff success", "AI debt management", "debt free story", "financial success"],
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
];

export function getPostIndexBySlug(slug: string): PostIndexItem | undefined {
  return postIndex.find((post) => post.slug === slug);
}

