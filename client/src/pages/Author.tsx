import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { PostCard } from "@/components/blog/PostCard";
import { SEO } from "@/components/SEO";
import { useParams } from "wouter";
import { useMemo } from "react";
import { usePostIndex } from "@/lib/post-cache";
import { SITE_URL } from "@/lib/config";
import { AUTHORS } from "@/lib/author-profiles";

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
    sameAs: [profile.linkedin],
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
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-700 mt-1 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  LinkedIn
                </a>
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

              {/* Experience */}
              <section className="max-w-3xl border border-gray-200 rounded-lg p-5 md:p-6 bg-gray-50">
                <h2 className="font-oswald text-lg md:text-xl font-bold uppercase mb-3">Background &amp; Experience</h2>
                <ul className="space-y-2">
                  {profile.experience.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-700 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-2" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              {/* Research methodology */}
              <section className="max-w-3xl border border-gray-200 rounded-lg p-5 md:p-6">
                <h2 className="font-oswald text-lg md:text-xl font-bold uppercase mb-3">How {profile.name} Researches Articles</h2>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  Every article follows The Kaash Journal&apos;s{" "}
                  <a href="/editorial-policy" className="text-blue-700 hover:underline font-medium">
                    editorial policy
                  </a>
                  : primary sources are linked in the text, regulatory context is included for UK finance topics, and limitations in the evidence are stated clearly.
                </p>
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Primary sources consulted</p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {profile.researchSources.map((source) => (
                    <li key={source} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                      {source}
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-gray-600 mt-4">
                  Found an error?{" "}
                  <a href="/contact" className="text-blue-700 hover:underline font-medium">
                    Report a correction
                  </a>
                  .
                </p>
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
