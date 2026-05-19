-- Run this in Supabase SQL Editor to update blog post hero images.
-- Replaces icon placeholders with category-appropriate landscape photos.

-- Fintech / AI Finance posts
UPDATE blog_posts SET image = '/images/fintech.jpg'
WHERE slug IN (
  'chatgpt-personal-finance-guide',
  'ai-fintech-startups-2026',
  'latest-ai-finance-tools-january-2026',
  'robo-advisors-vs-human-financial-advisors-2026',
  'voice-banking-conversational-ai-2026',
  'agentic-finance-ai-2026',
  'fintech-gig-economy-ai-2026',
  'climate-fintech-esg-investing-ai-2026'
);

-- Debt Management posts
UPDATE blog_posts SET image = '/images/debt-money.jpg'
WHERE slug IN (
  'automate-budget-ai-tutorial'
);

-- AI and Health — general
UPDATE blog_posts SET image = '/images/ai-health.jpg'
WHERE slug IN (
  'ai-wearables-predicting-illness-2026',
  'ai-health-agent-proactive-wellness-2026',
  'ai-skin-longevity-biotech-2026',
  'longevity-science-biological-age-ai-2026',
  'ai-diagnostics-preventive-healthcare-2026'
);

-- AI and Health — nutrition / gut health
UPDATE blog_posts SET image = '/images/nutrition.jpg'
WHERE slug IN (
  'ai-microbiome-precision-nutrition-2026',
  'ai-nutritionist-meal-planning-2026',
  'gut-brain-axis-microbiome-mental-health-2026'
);

-- AI and Health — mental health / wellbeing
UPDATE blog_posts SET image = '/images/wellness-mental.jpg'
WHERE slug IN (
  'ai-mental-health-digital-therapist-2026',
  'digital-detox-intentional-tech-use-2026',
  'stress-burnout-nervous-system-ai-2026'
);

-- AI and Health — sleep
UPDATE blog_posts SET image = '/images/sleep-health.jpg'
WHERE slug IN (
  'sleep-optimization-technology-ai-2026'
);

-- AI and Health — fitness
UPDATE blog_posts SET image = '/images/fitness.jpg'
WHERE slug IN (
  'ai-fitness-coaching-personal-trainer-2026'
);

-- Case Studies — blockchain / fintech
UPDATE blog_posts SET image = '/images/business-case.jpg'
WHERE slug IN (
  'blockchain-ai-case-studies-financial-value-2026'
);

-- Fintech Trends — robo-advisors comparison (analytics feel)
UPDATE blog_posts SET image = '/images/business-analytics.jpg'
WHERE slug IN (
  'robo-advisors-vs-human-financial-advisors-2026'
);
