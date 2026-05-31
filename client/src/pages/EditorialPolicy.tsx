import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/layout/PageHeader";
import { SEO } from "@/components/SEO";

export default function EditorialPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Editorial Policy"
        description="How The Kaash Journal researches, writes, and publishes content — including our fact-checking process, affiliate disclosure, corrections policy, and editorial independence statement."
        url="/editorial-policy"
      />
      <Header />

      <main id="main-content" className="pt-6 sm:pt-8 md:pt-10">
        <PageHeader
          title={<>Editorial <span className="text-blue-600">Policy</span></>}
          subtitle="How we research, write, review, and publish content at The Kaash Journal."
        >
          <p className="text-gray-500 text-sm mt-2">Last updated: 1 May 2026</p>
        </PageHeader>

        <div className="container py-6 md:py-8">
          <div className="max-w-3xl mx-auto prose prose-gray prose-base md:prose-lg max-w-none space-y-5 md:space-y-6">

            {/* Our Mission */}
            <section>
              <h2 className="font-oswald text-lg md:text-xl font-bold uppercase mb-2">Our Editorial Mission</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                The Kaash Journal publishes practical, source-linked guides on AI, fintech, debt management, and personal finance for UK readers. Our editorial mission is to make complex topics accessible and actionable — without oversimplifying the risks or omitting the caveats.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We do not exist to promote financial products, generate affiliate revenue at the expense of accuracy, or produce content designed primarily for search engines. Every article is written to be genuinely useful to the reader who lands on it.
              </p>
            </section>

            {/* Content Creation Process */}
            <section>
              <h2 className="font-oswald text-lg md:text-xl font-bold uppercase mb-2">How We Create Content</h2>

              <h3 className="font-oswald text-base font-bold uppercase mb-2 text-blue-600">Research</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Articles begin with research against primary sources. For financial content, this includes the FCA register, FCA consumer guidance, GOV.UK, MoneyHelper, and National Debtline. For health content, we reference NHS guidance, NICE clinical guidelines, and peer-reviewed literature where accessible. For technology topics, we use official product documentation, published technical papers, and reputable trade sources.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                We do not base articles on press releases, brand-funded studies, or single sources. Where statistics or data points are cited, the original source is linked in the text.
              </p>

              <h3 className="font-oswald text-base font-bold uppercase mb-2 text-blue-600">Writing Standards</h3>
              <ul className="space-y-3 text-gray-700 mb-6">
                <li className="flex gap-3"><span className="text-blue-600 font-bold flex-shrink-0">—</span><span>Claims are backed by linked sources, not asserted without evidence.</span></li>
                <li className="flex gap-3"><span className="text-blue-600 font-bold flex-shrink-0">—</span><span>Uncertainty is stated plainly: where evidence is limited, emerging, or contested, we say so.</span></li>
                <li className="flex gap-3"><span className="text-blue-600 font-bold flex-shrink-0">—</span><span>Risks and limitations are included alongside benefits — not buried or omitted.</span></li>
                <li className="flex gap-3"><span className="text-blue-600 font-bold flex-shrink-0">—</span><span>UK English spelling and regulatory context are used throughout (FCA, NHS, GOV.UK, £ GBP).</span></li>
                <li className="flex gap-3"><span className="text-blue-600 font-bold flex-shrink-0">—</span><span>Composite or illustrative examples are explicitly labelled — not presented as verified real stories.</span></li>
              </ul>

              <h3 className="font-oswald text-base font-bold uppercase mb-2 text-blue-600">Review Process</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Every article is reviewed before publication against the following checklist:
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex gap-3"><span className="text-blue-600 font-bold flex-shrink-0">✓</span><span>All factual claims have a linked primary source.</span></li>
                <li className="flex gap-3"><span className="text-blue-600 font-bold flex-shrink-0">✓</span><span>Appropriate professional disclaimer is present at the top of the article.</span></li>
                <li className="flex gap-3"><span className="text-blue-600 font-bold flex-shrink-0">✓</span><span>UK-regulated or free advice services are signposted where relevant.</span></li>
                <li className="flex gap-3"><span className="text-blue-600 font-bold flex-shrink-0">✓</span><span>Any commercial or affiliate links are identified as such.</span></li>
                <li className="flex gap-3"><span className="text-blue-600 font-bold flex-shrink-0">✓</span><span>The article does not provide regulated financial, legal, or medical advice.</span></li>
              </ul>
            </section>

            {/* Affiliate Disclosure */}
            <section className="bg-amber-50 border border-amber-200 rounded p-6 md:p-8">
              <h2 className="font-oswald text-lg md:text-xl font-bold uppercase mb-2">Affiliate &amp; Commercial Disclosure</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                Some articles contain affiliate links to third-party products or services. If you purchase or sign up via one of these links, The Kaash Journal may receive a small commission at no additional cost to you.
              </p>
              <p className="text-gray-700 leading-relaxed mb-3">
                <strong>Affiliate relationships do not influence editorial decisions.</strong> Products are referenced because they are relevant to the topic being discussed. We do not include products solely because of a commercial arrangement, and we do not exclude products because of the absence of one.
              </p>
              <p className="text-gray-700 leading-relaxed mb-3">
                We do not accept payment for editorial coverage or sponsored reviews. Any sponsored content — if published in future — will be clearly labelled as "Sponsored" at the top of the page and excluded from our regular editorial standards.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Display advertising on this site is served by Google AdSense. Advertisers have no influence over our editorial content.
              </p>
            </section>

            {/* Corrections Policy */}
            <section>
              <h2 className="font-oswald text-lg md:text-xl font-bold uppercase mb-2">Corrections Policy</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We take factual accuracy seriously. If you believe an article contains an error — whether a factual mistake, an outdated statistic, a broken source link, or a misleading claim — please contact us via our <a href="/contact" className="text-blue-600 hover:underline">contact page</a> with:
              </p>
              <ul className="space-y-3 text-gray-700 mb-4">
                <li className="flex gap-3"><span className="text-blue-600 font-bold flex-shrink-0">—</span><span>The URL of the article containing the error</span></li>
                <li className="flex gap-3"><span className="text-blue-600 font-bold flex-shrink-0">—</span><span>The specific claim or passage you believe is incorrect</span></li>
                <li className="flex gap-3"><span className="text-blue-600 font-bold flex-shrink-0">—</span><span>A link to a primary source supporting the correction, if available</span></li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                Verified corrections are applied promptly. A brief correction note is added at the bottom of the article to acknowledge the change.
              </p>
            </section>

            {/* Updates Policy */}
            <section>
              <h2 className="font-oswald text-lg md:text-xl font-bold uppercase mb-2">Content Updates</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                Financial regulations, product details, and technology capabilities change. Articles covering time-sensitive topics — regulatory guidance, product comparisons, market data — are reviewed when underlying information changes significantly.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Where an article has been substantially updated, the "Last updated" date is shown alongside the original publication date on the article page.
              </p>
            </section>

            {/* Independence */}
            <section>
              <h2 className="font-oswald text-lg md:text-xl font-bold uppercase mb-2">Editorial Independence</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                The Kaash Journal is independently operated. We are not owned by or affiliated with any financial institution, debt management company, insurance provider, or technology firm whose products we cover.
              </p>
              <p className="text-gray-700 leading-relaxed mb-3">
                No external company, advertiser, or commercial partner has editorial control over our content, including topic selection, conclusions, or the inclusion or exclusion of specific products or services.
              </p>
              <p className="text-gray-700 leading-relaxed">
                If this policy changes — for example, if we accept a sponsored content arrangement — it will be reflected in this document and clearly disclosed on the relevant content.
              </p>
            </section>

            {/* What We Are Not */}
            <section className="bg-gray-50 border border-gray-200 rounded p-6 md:p-8">
              <h2 className="font-oswald text-lg md:text-xl font-bold uppercase mb-2">Important Limitations</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                The Kaash Journal is a general-information publication. We are not:
              </p>
              <ul className="space-y-3 text-gray-700 mb-4">
                <li className="flex gap-3"><span className="text-blue-600 font-bold flex-shrink-0">—</span><span><strong>FCA-authorised.</strong> We do not provide regulated financial advice. Nothing on this site constitutes a personal recommendation to buy, sell, or invest.</span></li>
                <li className="flex gap-3"><span className="text-blue-600 font-bold flex-shrink-0">—</span><span><strong>Medical practitioners.</strong> Health-related articles are for information only. Consult your GP or a qualified health professional before making clinical decisions.</span></li>
                <li className="flex gap-3"><span className="text-blue-600 font-bold flex-shrink-0">—</span><span><strong>Legal advisers.</strong> Articles covering debt, insolvency, or consumer rights describe general information, not legal advice specific to your circumstances.</span></li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                Where professional advice is relevant, we signpost readers to appropriate regulated services — including the <a href="https://register.fca.org.uk/s/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">FCA register</a>, <a href="https://www.moneyhelper.org.uk" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">MoneyHelper</a>, and the <a href="https://www.nhs.uk" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">NHS</a>.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="font-oswald text-lg md:text-xl font-bold uppercase mb-2">Contact the Editorial Team</h2>
              <p className="text-gray-700 leading-relaxed">
                For editorial corrections, factual disputes, or questions about this policy, contact us via our <a href="/contact" className="text-blue-600 hover:underline">contact page</a>. We aim to respond within two business days.
              </p>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
