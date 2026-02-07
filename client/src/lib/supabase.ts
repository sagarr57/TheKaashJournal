// Supabase client configuration
// This file creates a singleton Supabase client instance

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Supabase URL and Anon Key should be set in .env file

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || '',
  {
    auth: {
      persistSession: false, // We're using our own auth system
      autoRefreshToken: false,
    },
  }
);

// Database types (will be generated from Supabase schema)
export interface Database {
  public: {
    Tables: {
      analytics_daily: {
        Row: {
          id: string;
          date: string;
          visitors: number;
          clicks: number;
          revenue: number;
          subscribers: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          date: string;
          visitors?: number;
          clicks?: number;
          revenue?: number;
          subscribers?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          date?: string;
          visitors?: number;
          clicks?: number;
          revenue?: number;
          subscribers?: number;
          created_at?: string;
        };
      };
      blog_posts: {
        Row: {
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
          reading_time: number;
          featured: boolean;
          image: string;
          meta_description?: string;
          keywords?: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          excerpt: string;
          content: string;
          author: string;
          date: string;
          updated?: string;
          category: string;
          tags?: string[];
          reading_time?: number;
          featured?: boolean;
          image: string;
          meta_description?: string;
          keywords?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          excerpt?: string;
          content?: string;
          author?: string;
          date?: string;
          updated?: string;
          category?: string;
          tags?: string[];
          reading_time?: number;
          featured?: boolean;
          image?: string;
          meta_description?: string;
          keywords?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      newsletter_subscribers: {
        Row: {
          id: string;
          email: string;
          subscribed_at: string;
          source?: string;
          unsubscribed_at?: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          subscribed_at: string;
          source?: string;
          unsubscribed_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          subscribed_at?: string;
          source?: string;
          unsubscribed_at?: string;
          created_at?: string;
        };
      };
    };
  };
}
