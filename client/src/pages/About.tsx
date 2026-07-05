import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/layout/PageHeader";
import { SEO } from "@/components/SEO";
import { Mail } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="About The Kaash Journal"
        description="The Kaash Journal publishes in-depth guides on AI, fintech, and personal finance for UK readers. Learn about our editorial standards, research process, and affiliate disclosure."
        url="/about"
      />
      <Header />

      <main id="main-content" className="pt-6 sm:pt-8 md:pt-10">
        <PageHeader
          title={<>About <span className="text-blue-600">The Kaash Journal</span></>}
          subtitle="In-depth, source-linked guides on AI, fintech, debt management, and personal finance — written for curious readers everywhere."
        />

        <div className="container py-6 md:py-8">
          <div className="max-w-3xl mx-auto space-y-6 md:space-y-7">

            {/* Who We Are */}
            <section>
              <h2 className="font-oswald text-lg md:text-xl font-bold uppercase mb-3">Who We Are</h2>
              <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-4">
                The Kaash Journal is an independent UK-focused publication covering the practical intersection of artificial intelligence, financial technology, and personal finance. We publish long-form guides, analysis, and explainers designed to help readers make better-informed decisions — not to sell them products.
              </p>
              <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-4">
                Our editorial team combines backgrounds in financial services, technology journalism, and consumer advocacy. Every article is researched against primary sources — including FCA guidance, NHS resources, GOV.UK, and peer-reviewed literature — and those sources are linked directly in the text so readers can verify claims themselves.
              </p>
              <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                We are not a regulated financial adviser. Where articles touch on financial products, debt solutions, or health decisions, we signpost readers to appropriate regulated or accredited services (FCA register, MoneyHelper, NHS, BDA) rather than acting as a substitute for professional advice.
              </p>
            </section>

            {/* What We Cover */}
            <section className="py-5 md:py-6 border-y border-gray-200">
              <h2 className="font-oswald text-lg md:text-xl font-bold uppercase mb-3 md:mb-4">What We Cover</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                <div>
                  <h3 className="font-oswald text-base md:text-lg font-bold uppercase mb-1.5 text-blue-600">AI and Health</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    How AI is changing preventive health, wearable diagnostics, nutrition, and mental wellbeing — with a focus on what the evidence actually supports versus what is marketing.
                  </p>
                </div>
                <div>
                  <h3 className="font-oswald text-base md:text-lg font-bold uppercase mb-1.5 text-blue-600">Debt Management</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Practical guides on debt strategies, IVAs, consolidation, and repayment planning — with links to free FCA-authorised debt advice services throughout.
                  </p>
                </div>
                <div>
                  <h3 className="font-oswald text-base md:text-lg font-bold uppercase mb-1.5 text-blue-600">Real-Time Finance</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    How live market data and AI tools are changing investment and trading decisions — explained honestly, including the risks.
                  </p>
                </div>
                <div>
                  <h3 className="font-oswald text-base md:text-lg font-bold uppercase mb-1.5 text-blue-600">Fintech Trends</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Analysis of emerging financial technology: open banking, robo-advisors, AI lending, and what UK consumers need to verify before trusting a new platform.
                  </p>
                </div>
                <div>
                  <h3 className="font-oswald text-base md:text-lg font-bold uppercase mb-1.5 text-blue-600">Case Studies</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    In-depth analytical guides and worked examples showing how AI and fintech tools apply to real-world financial and technology decisions — with supporting data and source links throughout.
                  </p>
                </div>
              </div>
            </section>

            {/* Editorial Standards */}
            <section>
              <h2 className="font-oswald text-lg md:text-xl font-bold uppercase mb-3">Our Editorial Standards</h2>
              <p className="text-gray-700 text-base leading-relaxed mb-4">
                Every article published on The Kaash Journal is held to the following standards:
              </p>
              <ul className="space-y-3">
                <li className="flex gap-4">
                  <span className="text-blue-600 font-bold text-lg flex-shrink-0 mt-0.5">1.</span>
                  <div>
                    <strong className="text-gray-900">Sources linked in the text.</strong>
                    <p className="text-gray-700 text-sm mt-1 leading-relaxed">
                      Claims backed by data, research, or regulatory guidance are linked directly to the primary source — not to a secondary aggregator. Readers can follow every link to verify independently.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="text-blue-600 font-bold text-lg flex-shrink-0 mt-0.5">2.</span>
                  <div>
                    <strong className="text-gray-900">Regulatory awareness, not regulatory advice.</strong>
                    <p className="text-gray-700 text-sm mt-1 leading-relaxed">
                      Articles on financial products, debt, or health reference FCA, NHS, and GOV.UK guidance where relevant. We tell readers where to get regulated advice — we do not provide it ourselves.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="text-blue-600 font-bold text-lg flex-shrink-0 mt-0.5">3.</span>
                  <div>
                    <strong className="text-gray-900">Disclaimers on every applicable article.</strong>
                    <p className="text-gray-700 text-sm mt-1 leading-relaxed">
                      Every article covering financial products, health decisions, or investment displays a visible disclaimer at the top of the page — plus in-article notices where relevant — directing readers to qualified services. See our <a href="/disclaimer" className="text-blue-600 hover:underline">full disclaimer</a>.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="text-blue-600 font-bold text-lg flex-shrink-0 mt-0.5">4.</span>
                  <div>
                    <strong className="text-gray-900">Content reviewed and updated.</strong>
                    <p className="text-gray-700 text-sm mt-1 leading-relaxed">
                      Articles are reviewed when the underlying information changes — regulatory updates, product changes, or new research. Updated dates are shown on individual posts.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="text-blue-600 font-bold text-lg flex-shrink-0 mt-0.5">5.</span>
                  <div>
                    <strong className="text-gray-900">Corrections policy.</strong>
                    <p className="text-gray-700 text-sm mt-1 leading-relaxed">
                      If you identify a factual error, contact us at <a href="/contact" className="text-blue-600 hover:underline">our contact page</a> with the article URL and the specific claim. Verified corrections are applied promptly and noted at the bottom of the article.
                    </p>
                  </div>
                </li>
              </ul>
              <p className="mt-4 text-sm text-gray-500">
                For full details, read our <a href="/editorial-policy" className="text-blue-600 hover:underline">Editorial Policy</a>.
              </p>
            </section>

            {/* Affiliate Disclosure */}
            <section className="bg-amber-50 border border-amber-200 rounded p-5 md:p-6">
              <h2 className="font-oswald text-lg md:text-xl font-bold uppercase mb-2">Affiliate &amp; Commercial Disclosure</h2>
              <p className="text-gray-700 text-base leading-relaxed mb-3">
                Some articles on The Kaash Journal contain links to third-party products or services. Where these are affiliate links, we may earn a small commission if you purchase or sign up through them — at no extra cost to you.
              </p>
              <p className="text-gray-700 text-base leading-relaxed mb-3">
                Affiliate relationships do not influence our editorial decisions. Products are included because they are relevant to the topic — not because of a commercial arrangement. We link to the official product page so readers can assess the product independently before acting.
              </p>
              <p className="text-gray-700 text-base leading-relaxed">
                The Kaash Journal does not accept payment for editorial coverage, sponsored reviews, or product placements that are not clearly labelled as such. No advertiser has editorial control over our content.
              </p>
            </section>

            {/* Independence */}
            <section>
              <h2 className="font-oswald text-lg md:text-xl font-bold uppercase mb-3">Editorial Independence</h2>
              <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-4">
                The Kaash Journal is independently operated. We are not owned by or affiliated with any financial institution, insurance company, debt management firm, or technology company whose products we cover.
              </p>
              <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                Display advertising on this site is served by Google AdSense. Advertisers have no influence over which topics we cover, how we cover them, or what conclusions we reach.
              </p>
            </section>

            {/* Meet the Team */}
            <section>
              <h2 className="font-oswald text-lg md:text-xl font-bold uppercase mb-3">Meet the Team</h2>
              <p className="text-gray-700 text-base leading-relaxed mb-5">
                The Kaash Journal is written and edited by two specialists with direct professional experience in the fields we cover — UK financial services and regulation, and AI-driven health technology. Every article you read has been researched, written, and reviewed by one of our contributors.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="border border-gray-200 rounded-lg p-5 bg-gray-50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
                      S
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Saga</p>
                      <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">Contributor — Fintech &amp; Regulation</p>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed mb-3">
                    Covers UK fintech investment, FCA regulatory developments, open banking, BNPL, debt management strategies, and consumer finance. Background in UK financial services and compliance.
                  </p>
                  <a href="/author/saga" className="text-sm text-blue-700 hover:text-blue-800 font-medium hover:underline">
                    View profile →
                  </a>
                </div>
                <div className="border border-gray-200 rounded-lg p-5 bg-gray-50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
                      K
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Kash</p>
                      <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">Contributor — AI &amp; Health Technology</p>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed mb-3">
                    Covers AI in NHS services, wearable health technology, digital therapeutics, clinical AI tools, and real-time financial data. Background in health technology and digital health research.
                  </p>
                  <a href="/author/kash" className="text-sm text-blue-700 hover:text-blue-800 font-medium hover:underline">
                    View profile →
                  </a>
                </div>
              </div>
            </section>

            {/* Contact */}
            <section className="bg-gray-50 border border-gray-200 p-6 md:p-8 rounded">
              <h2 className="font-oswald text-lg md:text-xl font-bold uppercase mb-2">Get In Touch</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                For editorial corrections, press enquiries, or general feedback, use our contact page. We aim to respond to all messages within two business days.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 transition-colors"
              >
                <Mail className="w-5 h-5" />
                Contact Us
              </a>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
