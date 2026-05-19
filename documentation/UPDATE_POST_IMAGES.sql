-- ============================================================
-- UPDATE ALL BLOG POST IMAGES IN SUPABASE
-- Run this in: Supabase Dashboard → SQL Editor → Run
-- ============================================================
-- All images live in /images/ (served from client/public/images/)
-- Available photos:
--   ai-health.jpg          doctor with phone  → AI & Health
--   fintech.jpg            trading charts     → Finance / Real-Time Finance
--   debt-money.jpg         plant from coins   → Debt Management
--   nutrition.jpg          healthy food bowl  → Nutrition / Gut Health
--   fitness.jpg            weightlifting      → Fitness
--   sleep-health.jpg       cosy sleeping cat  → Sleep
--   wellness-mental.jpg    person + laptop    → Mental Health / Wellness / Burnout
--   business-analytics.jpg laptop dashboard   → Comparisons / Analytics
--   business-case.jpg      analytics chart    → Case Studies (bank/corp)
--   data-analytics.jpg     analytics screen   → Data / Analytics
-- ============================================================

-- ── DEBT MANAGEMENT ─────────────────────────────────────────
UPDATE blog_posts SET image = '/images/debt-money.jpg' WHERE slug IN (
  'top-5-ai-tools-debt-management-2026',
  'automate-budget-ai-tutorial',
  'case-study-ai-debt-payoff-50000',
  'loan-repayment-stress-seven-approaches',
  'debt-collector-call-uk-verify-rights',
  'iva-uk-explained-trade-offs',
  'multiple-loans-strategy-consolidation-pitfalls',
  'debt-advice-scams-red-flags-uk',
  'build-debt-payoff-plan-in-60-minutes',
  'best-emergency-loan-alternatives-2026'
);

-- ── DEBT MANAGEMENT — stress / mental health angle ──────────
UPDATE blog_posts SET image = '/images/wellness-mental.jpg' WHERE slug IN (
  'debt-stress-mindset-practical-steps'
);

-- ── FINTECH TRENDS ──────────────────────────────────────────
UPDATE blog_posts SET image = '/images/fintech.jpg' WHERE slug IN (
  'chatgpt-personal-finance-guide',
  'ai-fintech-startups-2026',
  'latest-ai-finance-tools-january-2026',
  'voice-banking-conversational-ai-2026',
  'agentic-finance-ai-2026',
  'fintech-gig-economy-ai-2026',
  'climate-fintech-esg-investing-ai-2026'
);

-- ── REAL-TIME FINANCE ────────────────────────────────────────
UPDATE blog_posts SET image = '/images/fintech.jpg' WHERE slug IN (
  'real-time-financial-data-investment',
  'wall-street-in-your-pocket-ai-copilot-beat-market'
);

-- ── REAL-TIME FINANCE — robo-advisor comparison ──────────────
UPDATE blog_posts SET image = '/images/business-analytics.jpg' WHERE slug IN (
  'ai-robo-advisors-comparison'
);

-- ── FINTECH TRENDS — robo-advisor vs human ──────────────────
UPDATE blog_posts SET image = '/images/business-analytics.jpg' WHERE slug IN (
  'robo-advisors-vs-human-financial-advisors-2026'
);

-- ── AI AND HEALTH — general ──────────────────────────────────
UPDATE blog_posts SET image = '/images/ai-health.jpg' WHERE slug IN (
  'ai-wearables-predicting-illness-2026',
  'ai-health-agent-proactive-wellness-2026',
  'ai-skin-longevity-biotech-2026',
  'longevity-science-biological-age-ai-2026',
  'ai-diagnostics-preventive-healthcare-2026'
);

-- ── AI AND HEALTH — nutrition / gut health ───────────────────
UPDATE blog_posts SET image = '/images/nutrition.jpg' WHERE slug IN (
  'ai-microbiome-precision-nutrition-2026',
  'ai-nutritionist-meal-planning-2026',
  'gut-brain-axis-microbiome-mental-health-2026'
);

-- ── AI AND HEALTH — mental health / wellbeing / burnout ──────
UPDATE blog_posts SET image = '/images/wellness-mental.jpg' WHERE slug IN (
  'ai-mental-health-digital-therapist-2026',
  'digital-detox-intentional-tech-use-2026',
  'stress-burnout-nervous-system-ai-2026'
);

-- ── AI AND HEALTH — sleep ────────────────────────────────────
UPDATE blog_posts SET image = '/images/sleep-health.jpg' WHERE slug IN (
  'sleep-optimization-technology-ai-2026'
);

-- ── AI AND HEALTH — fitness ──────────────────────────────────
UPDATE blog_posts SET image = '/images/fitness.jpg' WHERE slug IN (
  'ai-fitness-coaching-personal-trainer-2026'
);

-- ── CASE STUDIES — bank / corporate transformations ──────────
UPDATE blog_posts SET image = '/images/business-case.jpg' WHERE slug IN (
  'blockchain-ai-case-studies-financial-value-2026',
  'jpmorgan-ai-banking-strategy-case-study',
  'klarna-ai-customer-service-case-study',
  'deutsche-bank-google-cloud-ai-transformation'
);

-- ── CASE STUDIES — customer data / analytics ─────────────────
UPDATE blog_posts SET image = '/images/business-analytics.jpg' WHERE slug IN (
  'nubank-ai-strategy-100-million-customers',
  'mastercard-ai-fraud-detection-decision-intelligence'
);

-- ── VERIFY — run this SELECT after to confirm ────────────────
SELECT slug, image FROM blog_posts ORDER BY date DESC;
