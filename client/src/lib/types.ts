export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  updated?: string;
  category: string;
  tags: string[];
  readingTime: number;
  featured: boolean;
  image: string;
  seo: {
    metaDescription: string;
    keywords: string[];
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
}

export interface Author {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

export interface SearchResult {
  posts: BlogPost[];
  total: number;
  query: string;
}
