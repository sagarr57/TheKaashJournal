import type { Author, Category } from "@/lib/types";

export const categories: Category[] = [
  {
    id: "1",
    name: "AI Tools & Updates",
    slug: "ai-tools-updates",
    description: "Latest AI tools and updates for finance",
    color: "#0066FF",
  },
  {
    id: "2",
    name: "Debt Management",
    slug: "debt-management",
    description: "AI solutions for debt tracking and payoff",
    color: "#FF3B30",
  },
  {
    id: "3",
    name: "Real-Time Finance",
    slug: "real-time-finance",
    description: "Live market data and AI analysis",
    color: "#34C759",
  },
  {
    id: "4",
    name: "Fintech Trends",
    slug: "fintech-trends",
    description: "Industry news and analysis",
    color: "#FF9500",
  },
  {
    id: "5",
    name: "How-To Guides",
    slug: "how-to-guides",
    description: "Tutorials on using AI for finance",
    color: "#5856D6",
  },
  {
    id: "6",
    name: "Case Studies",
    slug: "case-studies",
    description: "Real-world applications and success stories",
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

