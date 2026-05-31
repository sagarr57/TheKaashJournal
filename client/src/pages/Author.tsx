import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { PostCard } from "@/components/blog/PostCard";
import { SEO } from "@/components/SEO";
import { useParams } from "wouter";
import { useMemo } from "react";
import { usePostIndex } from "@/lib/post-cache";
import { SITE_URL } from "@/lib/config";

interface AuthorProfile {
  name: string;
  role: string;
  specialisms: string[];
  bio: string[];
  categories: string[];
}

const AUTHORS: Record<string, AuthorProfile> = {
  kash: {
    name: "Kash",
    role: "Contributor — AI & Health Technology",
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

export default function Author() {
  const params = useParams();
  const authorSlug = (params.slug as string)?.toLowerCase();
  const profile = AUTHORS[authorSlug];

  const allPosts = usePostIndex();

  const authorPosts = useMemo(() => {
    if (!profile) return [];
    return [...allPosts]
      .filter((p) => p.author?.toLowerCase() === authorSlug)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [allPosts, authorSlug, profile]);

  if (!profile) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main id="main-content" className="container pt-24 sm:pt-28 pb-20 text-center">
          <h1 className="font-oswald text-2xl sm:text-3xl font-bold mb-3">Author Not Found</h1>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">
            The author you're looking for doesn't exist.
          </p>
          <a href="/about" className="text-blue-600 font-semibold hover:text-blue-700">
            ← Meet the team
          </a>
        </main>
        <Footer />
      </div>
    );
  }

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: `${SITE_URL}/author/${authorSlug}`,
    worksFor: {
      "@type": "Organization",
      name: "The Kaash Journal",
      url: SITE_URL,
    },
    jobTitle: profile.role,
    knowsAbout: profile.specialisms,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "About", item: `${SITE_URL}/about` },
      { "@type": "ListItem", position: 3, name: profile.name, item: `${SITE_URL}/author/${authorSlug}` },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title={`${profile.name} — ${profile.role}`}
        description={`${profile.name} is a contributor at The Kaash Journal. ${profile.bio[0]}`}
        url={`/author/${authorSlug}`}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Header />

      <main id="main-content" className="pt-6 sm:pt-8 md:pt-10">
        {/* Page Header */}
        <section className="bg-gray-50 border-b border-gray-200 py-5 md:py-6">
          <div className="container">
            <nav aria-label="Breadcrumb" className="mb-3 text-sm text-gray-500 flex gap-1 items-center">
              <a href="/" className="hover:text-blue-700 hover:underline">Home</a>
              <span aria-hidden="true">/</span>
              <a href="/about" className="hover:text-blue-700 hover:underline">About</a>
              <span aria-hidden="true">/</span>
              <span className="text-gray-700">{profile.name}</span>
            </nav>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-2xl shrink-0 select-none">
                {profile.name[0]}
              </div>
              <div>
                <h1 className="font-oswald text-xl sm:text-2xl md:text-3xl font-bold uppercase mb-0.5">
                  {profile.name}
                </h1>
                <p className="text-blue-600 font-medium text-sm md:text-base">{profile.role}</p>
              </div>
            </div>
          </div>
        </section>

        <div className="container py-6 md:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">

              {/* Bio */}
              <section className="max-w-3xl space-y-4">
                {profile.bio.map((para) => (
                  <p key={para.slice(0, 40)} className="text-gray-700 text-base leading-relaxed">{para}</p>
                ))}
              </section>

              {/* Specialisms */}
              <section className="max-w-3xl">
                <h2 className="font-oswald text-lg md:text-xl font-bold uppercase mb-3">Areas of Coverage</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {profile.specialisms.map((s) => (
                    <li key={s} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </section>

              {/* Articles */}
              {authorPosts.length > 0 && (
                <section>
                  <h2 className="font-oswald text-lg md:text-xl font-bold uppercase mb-4">
                    Articles by {profile.name}
                    <span className="ml-2 text-sm font-sans font-normal text-gray-500 normal-case">
                      ({authorPosts.length} articles)
                    </span>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {authorPosts.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>
                </section>
              )}

            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Sidebar />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
