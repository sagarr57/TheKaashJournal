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
];

export function getPostIndexBySlug(slug: string): PostIndexItem | undefined {
  return postIndex.find((post) => post.slug === slug);
}

