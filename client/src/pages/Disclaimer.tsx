import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/layout/PageHeader";
import { SEO } from "@/components/SEO";

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Disclaimer & Advertising Disclosure"
        description="Important disclaimers for The Kaash Journal: financial and health information, Google AdSense advertising, affiliate links, and editorial limitations."
        url="/disclaimer"
      />
      <Header />

      <main id="main-content" className="pt-6 sm:pt-8 md:pt-10">
        <PageHeader
          title={
            <>
              Disclaimer &amp; <span className="text-blue-600">Advertising</span>
            </>
          }
          subtitle="Last updated: 12 June 2026"
        />

        <section className="container py-6 md:py-8">
          <div className="max-w-3xl space-y-6 text-gray-700 text-base leading-relaxed">
            <p>
              The Kaash Journal publishes educational articles about artificial intelligence, health
              technology, personal finance, and fintech. This page explains the limits of that
              information and how we earn revenue. Please read it alongside our{" "}
              <a href="/editorial-policy" className="text-blue-600 hover:underline">
                Editorial Policy
              </a>
              ,{" "}
              <a href="/privacy-policy" className="text-blue-600 hover:underline">
                Privacy Policy
              </a>
              , and{" "}
              <a href="/terms-and-conditions" className="text-blue-600 hover:underline">
                Terms of Service
              </a>
              .
            </p>

            <div>
              <h2 className="font-oswald text-lg md:text-xl font-bold uppercase mb-2 text-gray-900">
                1. Not Professional Advice
              </h2>
              <p className="mb-3">
                Content on this site is for <strong>general information only</strong>. It is not
                financial advice, investment advice, tax advice, legal advice, or medical advice —
                and it is not a substitute for advice from a qualified professional who understands
                your personal circumstances.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Finance &amp; debt:</strong> Before acting on any article about loans,
                  IVAs, consolidation, investing, or budgeting tools, speak to an FCA-authorised
                  adviser or use free UK services such as{" "}
                  <a
                    href="https://www.moneyhelper.org.uk/"
                    className="text-blue-600 hover:underline"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    MoneyHelper
                  </a>{" "}
                  or{" "}
                  <a
                    href="https://www.stepchange.org/"
                    className="text-blue-600 hover:underline"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    StepChange
                  </a>
                  .
                </li>
                <li>
                  <strong>Health &amp; AI in healthcare:</strong> Articles discuss research,
                  products, and NHS policy — they do not diagnose conditions or recommend
                  treatments. For medical decisions, consult a registered healthcare professional.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-oswald text-lg md:text-xl font-bold uppercase mb-2 text-gray-900">
                2. Accuracy &amp; Timeliness
              </h2>
              <p>
                We fact-check articles against primary sources (regulators, government sites,
                peer-reviewed research, and official product documentation) before publication.
                Markets, regulations, product features, and NHS guidance change. An article&apos;s
                published or updated date reflects our last substantive review — not a guarantee
                that every detail remains current. If you spot an error, please{" "}
                <a href="/contact" className="text-blue-600 hover:underline">
                  contact us
                </a>{" "}
                with the article URL and the specific claim.
              </p>
            </div>

            <div>
              <h2 className="font-oswald text-lg md:text-xl font-bold uppercase mb-2 text-gray-900">
                3. Human-Written Editorial Content
              </h2>
              <p>
                Articles are researched and written by named contributors (
                <a href="/author/kash" className="text-blue-600 hover:underline">
                  Kash
                </a>{" "}
                and{" "}
                <a href="/author/saga" className="text-blue-600 hover:underline">
                  Saga
                </a>
                ), reviewed against our editorial standards, and attributed on each post. We do not
                publish auto-generated pages or mass-produced summaries designed only to rank in
                search engines.
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded p-5 md:p-6">
              <h2 className="font-oswald text-lg md:text-xl font-bold uppercase mb-2 text-gray-900">
                4. Advertising Disclosure (Google AdSense)
              </h2>
              <p className="mb-3">
                This site displays advertisements served by{" "}
                <strong>Google AdSense</strong> (publisher ID: ca-pub-5606354728180472). Google
                and its partners may use cookies and similar technologies to serve ads based on
                your visits to this and other websites. You can manage ad personalisation in
                Google&apos;s{" "}
                <a
                  href="https://adssettings.google.com/"
                  className="text-blue-600 hover:underline"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Ads Settings
                </a>{" "}
                and learn more in our{" "}
                <a href="/cookie-policy" className="text-blue-600 hover:underline">
                  Cookie Policy
                </a>
                .
              </p>
              <p>
                Advertisers and ad networks have <strong>no editorial control</strong> over which
                topics we cover, how we write about them, or what conclusions we reach. Ad
                placement does not influence our rankings of products or services within articles.
              </p>
            </div>

            <div>
              <h2 className="font-oswald text-lg md:text-xl font-bold uppercase mb-2 text-gray-900">
                5. Affiliate &amp; Commercial Links
              </h2>
              <p>
                Some articles link to third-party products or services. Where a link is an
                affiliate link, we may earn a small commission if you sign up or purchase — at no
                extra cost to you. Affiliate relationships are disclosed in our{" "}
                <a href="/about" className="text-blue-600 hover:underline">
                  About page
                </a>{" "}
                and do not determine which products we recommend. We are not paid for undisclosed
                sponsored reviews.
              </p>
            </div>

            <div>
              <h2 className="font-oswald text-lg md:text-xl font-bold uppercase mb-2 text-gray-900">
                6. Third-Party Websites
              </h2>
              <p>
                Outbound links are provided for convenience and verification. We do not control
                third-party sites and are not responsible for their content, privacy practices, or
                availability. Mention of a company or product is not an endorsement unless clearly
                stated.
              </p>
            </div>

            <div>
              <h2 className="font-oswald text-lg md:text-xl font-bold uppercase mb-2 text-gray-900">
                7. Limitation of Liability
              </h2>
              <p>
                To the fullest extent permitted by law, The Kaash Journal and its contributors are
                not liable for any loss or damage arising from reliance on site content. Use of
                this site is at your own risk and subject to our Terms of Service.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
