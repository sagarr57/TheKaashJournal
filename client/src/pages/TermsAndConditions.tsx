import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/layout/PageHeader";
import { SEO } from "@/components/SEO";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Terms and Conditions"
        description="Read the terms and conditions for using The Kaash Journal website, including content disclaimer, intellectual property, advertising disclosure, and governing law."
        url="/terms-and-conditions"
      />
      <Header />

      <main id="main-content" className="pt-6 sm:pt-8 md:pt-10">
        <PageHeader
          title={<>Terms and <span className="text-blue-600">Conditions</span></>}
          subtitle="Last updated: 1 May 2026"
        />

        <section className="container py-6 md:py-8">
          <div className="max-w-3xl space-y-5 text-gray-700 text-base leading-relaxed">

            <p>
              These Terms and Conditions govern your use of <strong>www.thekaashjournal.com</strong> (the "Site"),
              operated by The Kaash Journal ("we", "us", "our"). By accessing or using the Site you agree to be
              bound by these terms. If you do not agree, please do not use the Site.
            </p>

            <div>
              <h2 className="font-oswald text-lg md:text-xl font-bold uppercase mb-2 text-gray-900">1. Who We Are</h2>
              <p>
                The Kaash Journal is an independent digital publication covering AI, health technology, fintech, debt
                management, and personal finance. We are not a regulated financial adviser, medical practitioner, or
                legal professional. All content is produced for general informational and educational purposes.
              </p>
            </div>

            <div>
              <h2 className="font-oswald text-lg md:text-xl font-bold uppercase mb-2 text-gray-900">2. Acceptance of Terms</h2>
              <p>
                By accessing or using any part of this Site, you confirm that you are at least 13 years old and agree
                to these Terms and Conditions in full. We may update these terms from time to time. Changes take effect
                when posted, and continued use of the Site constitutes acceptance of the revised terms.
              </p>
            </div>

            <div>
              <h2 className="font-oswald text-lg md:text-xl font-bold uppercase mb-2 text-gray-900">3. Content Disclaimer</h2>
              <p className="mb-3">
                Content on this Site is provided for informational and educational purposes only. Nothing on this Site
                constitutes or should be relied upon as:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-3">
                <li><strong>Financial advice</strong> — we are not authorised by the Financial Conduct Authority (FCA). Articles covering investment, credit, debt, or financial products are informational only and do not constitute a personal recommendation.</li>
                <li><strong>Medical advice</strong> — health-related content is for general awareness. Always consult a qualified healthcare professional before making clinical decisions.</li>
                <li><strong>Legal advice</strong> — articles covering debt, insolvency, or consumer rights describe general information and are not a substitute for advice from a qualified solicitor.</li>
              </ul>
              <p>
                We aim for accuracy but cannot guarantee that all published information is current or complete. Regulations,
                product terms, and clinical guidance change. Always verify time-sensitive information with authoritative
                sources such as <a href="https://www.gov.uk" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">GOV.UK</a>,{" "}
                <a href="https://www.nhs.uk" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">NHS.uk</a>, or the{" "}
                <a href="https://register.fca.org.uk/s/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">FCA register</a>.
              </p>
            </div>

            <div>
              <h2 className="font-oswald text-lg md:text-xl font-bold uppercase mb-2 text-gray-900">4. Intellectual Property</h2>
              <p className="mb-3">
                All original text, graphics, logos, and design elements on this Site are owned by or licensed to
                The Kaash Journal and are protected by applicable copyright and intellectual property laws.
              </p>
              <p>
                You may share links to articles and quote short passages with clear attribution to The Kaash Journal,
                provided you do not reproduce or redistribute substantial portions of our content without prior written
                permission. Republishing full articles, scraping content for AI training, or reproducing content for
                commercial purposes without authorisation is prohibited.
              </p>
            </div>

            <div>
              <h2 className="font-oswald text-lg md:text-xl font-bold uppercase mb-2 text-gray-900">5. User Conduct</h2>
              <p className="mb-3">When using this Site, you agree not to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the Site for any unlawful purpose or in violation of applicable laws</li>
                <li>Attempt to gain unauthorised access to any part of the Site or its infrastructure</li>
                <li>Transmit harmful, offensive, or misleading content through any contact form or submission</li>
                <li>Use automated scraping tools, bots, or crawlers in a manner that places excessive load on the Site</li>
                <li>Misrepresent your identity or affiliation when contacting us</li>
              </ul>
            </div>

            <div>
              <h2 className="font-oswald text-lg md:text-xl font-bold uppercase mb-2 text-gray-900">6. Advertising and Commercial Relationships</h2>
              <p className="mb-3">
                This Site displays advertisements served by <strong>Google AdSense</strong>. Google AdSense uses
                cookies and browsing data to serve relevant advertising. We do not control the content of advertisements
                and are not responsible for third-party advertiser claims or products.
              </p>
              <p className="mb-3">
                Some articles may contain affiliate links. If you click an affiliate link and make a purchase, we may
                receive a commission at no additional cost to you. Affiliate relationships do not affect our editorial
                content or recommendations — see our{" "}
                <a href="/editorial-policy" className="text-blue-600 hover:underline">Editorial Policy</a> for full details.
              </p>
              <p>
                We do not accept payment for editorial coverage. If sponsored content is ever published, it will be
                clearly labelled.
              </p>
            </div>

            <div>
              <h2 className="font-oswald text-lg md:text-xl font-bold uppercase mb-2 text-gray-900">7. External Links</h2>
              <p>
                Articles on this Site frequently link to external sources including GOV.UK, NHS, FCA, and other
                third-party websites. These links are provided for reference and convenience. We are not responsible
                for the content, accuracy, privacy practices, or availability of third-party websites. A link does not
                constitute an endorsement of the linked site.
              </p>
            </div>

            <div>
              <h2 className="font-oswald text-lg md:text-xl font-bold uppercase mb-2 text-gray-900">8. Newsletter</h2>
              <p>
                If you subscribe to our newsletter, your email address will be processed by Brevo (formerly Sendinblue).
                You may unsubscribe at any time using the link included in every email. See our{" "}
                <a href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</a> for full details
                on how we handle your data.
              </p>
            </div>

            <div>
              <h2 className="font-oswald text-lg md:text-xl font-bold uppercase mb-2 text-gray-900">9. Limitation of Liability</h2>
              <p className="mb-3">
                To the fullest extent permitted by applicable law, The Kaash Journal and its contributors accept no
                liability for:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Any direct, indirect, or consequential loss arising from your use of or reliance on this Site</li>
                <li>Errors, inaccuracies, or omissions in published content</li>
                <li>Interruption or unavailability of the Site</li>
                <li>Loss or damage caused by viruses or malicious code transmitted via third-party links</li>
              </ul>
            </div>

            <div>
              <h2 className="font-oswald text-lg md:text-xl font-bold uppercase mb-2 text-gray-900">10. Governing Law</h2>
              <p>
                These Terms and Conditions are governed by and construed in accordance with the laws of England and Wales.
                Any disputes arising from use of this Site shall be subject to the exclusive jurisdiction of the courts
                of England and Wales.
              </p>
            </div>

            <div>
              <h2 className="font-oswald text-lg md:text-xl font-bold uppercase mb-2 text-gray-900">11. Contact</h2>
              <p>
                For questions about these Terms and Conditions, contact us via our{" "}
                <a href="/contact" className="text-blue-600 hover:underline">contact page</a>.
              </p>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
