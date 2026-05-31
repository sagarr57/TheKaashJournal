import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/layout/PageHeader";
import { SEO } from "@/components/SEO";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Privacy Policy"
        description="Read the privacy policy for The Kaash Journal, including data collection, Google AdSense advertising, cookies, analytics, and your rights under UK GDPR."
        url="/privacy-policy"
      />
      <Header />

      <main id="main-content" className="pt-6 sm:pt-8 md:pt-10">
        <PageHeader
          title={<>Privacy <span className="text-blue-600">Policy</span></>}
          subtitle="Last updated: 1 May 2026"
        />

        <section className="container py-6 md:py-8">
          <div className="max-w-3xl space-y-5 text-gray-700 text-base leading-relaxed">

            <p>
              This Privacy Policy explains how The Kaash Journal ("we", "us", "our") collects, uses, and protects
              information when you visit <strong>www.thekaashjournal.com</strong>. By using this site, you agree to
              the practices described below. This policy is governed by UK GDPR and the UK Data Protection Act 2018.
            </p>

            <div>
              <h2 className="font-oswald text-lg md:text-xl font-bold uppercase mb-2 text-gray-900">1. Information We Collect</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Email address</strong> — when you subscribe to our newsletter via Brevo.</li>
                <li><strong>Usage data</strong> — pages visited, time on site, referral source, browser type, and device type, collected via Google Analytics.</li>
                <li><strong>Cookie data</strong> — set by us and by third-party services listed below.</li>
              </ul>
              <p className="mt-3">We do not collect names, payment details, or sensitive personal data unless you voluntarily provide them via our contact form.</p>
            </div>

            <div>
              <h2 className="font-oswald text-lg md:text-xl font-bold uppercase mb-2 text-gray-900">2. How We Use Information</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>To deliver and improve site content and performance</li>
                <li>To send newsletters and editorial updates when you have opted in</li>
                <li>To analyse site engagement and optimise user experience</li>
                <li>To display relevant advertisements via Google AdSense (see Section 4)</li>
                <li>To maintain security and prevent abuse</li>
              </ul>
            </div>

            <div>
              <h2 className="font-oswald text-lg md:text-xl font-bold uppercase mb-2 text-gray-900">3. Cookies and Tracking</h2>
              <p className="mb-3">
                We use cookies and similar tracking technologies. You can control cookies through your browser settings or via
                the cookie consent banner shown on your first visit. See our{" "}
                <a href="/cookie-policy" className="text-blue-600 hover:underline">Cookie Policy</a> for full details.
              </p>
              <p>
                Types of cookies used on this site include: strictly necessary cookies (site function), analytics cookies
                (Google Analytics), and advertising cookies (Google AdSense).
              </p>
            </div>

            <div>
              <h2 className="font-oswald text-lg md:text-xl font-bold uppercase mb-2 text-gray-900">4. Google AdSense Advertising</h2>
              <p className="mb-3">
                This site uses <strong>Google AdSense</strong>, a third-party advertising service operated by Google LLC.
                Google AdSense uses cookies to serve advertisements based on your prior visits to this and other websites.
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-3">
                <li>Google may use the DoubleClick cookie to serve ads across the web based on your browsing history.</li>
                <li>Google's use of advertising cookies enables it and its partners to serve ads based on your visits to this site and other sites on the internet.</li>
                <li>We do not control the cookies set by Google AdSense. Google's data practices are governed by the <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Privacy Policy</a>.</li>
              </ul>
              <p className="mb-3">
                <strong>Opt out of personalised advertising:</strong> You can opt out of personalised ads from Google by visiting{" "}
                <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Google Ads Settings
                </a>{" "}
                or{" "}
                <a href="https://www.aboutads.info/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  aboutads.info
                </a>.
              </p>
              <p>
                Under UK GDPR, personalised advertising cookies are only activated after you have given consent via our cookie banner.
              </p>
            </div>

            <div>
              <h2 className="font-oswald text-lg md:text-xl font-bold uppercase mb-2 text-gray-900">5. Other Third-Party Services</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Google Analytics</strong> — used to measure site traffic and user behaviour. Data is anonymised before transmission where possible. <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Opt out of Google Analytics</a>.</li>
                <li><strong>Google Tag Manager</strong> — used to manage analytics and marketing tags without code changes.</li>
                <li><strong>Brevo (formerly Sendinblue)</strong> — used to manage newsletter subscriptions and send email updates. Your email address is stored on Brevo's servers. See the <a href="https://www.brevo.com/legal/privacypolicy/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Brevo Privacy Policy</a>.</li>
                <li><strong>Supabase</strong> — used as our backend database for content and analytics. Data is stored in the EU. See the <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Supabase Privacy Policy</a>.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-oswald text-lg md:text-xl font-bold uppercase mb-2 text-gray-900">6. Data Retention</h2>
              <p>
                We retain personal data only as long as necessary for the purpose it was collected, or as required by law.
                Newsletter subscribers can unsubscribe at any time using the link in any email. Upon unsubscribing, your
                email address is removed from active mailing lists within 30 days.
              </p>
            </div>

            <div>
              <h2 className="font-oswald text-lg md:text-xl font-bold uppercase mb-2 text-gray-900">7. Your Rights (UK GDPR)</h2>
              <p className="mb-3">Under UK GDPR, you have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Access</strong> — request a copy of the personal data we hold about you</li>
                <li><strong>Rectification</strong> — request correction of inaccurate data</li>
                <li><strong>Erasure</strong> — request deletion of your personal data ("right to be forgotten")</li>
                <li><strong>Restriction</strong> — request we limit how we use your data</li>
                <li><strong>Objection</strong> — object to processing based on legitimate interests</li>
                <li><strong>Withdrawal of consent</strong> — withdraw consent for cookies or marketing at any time</li>
              </ul>
              <p className="mt-3">
                To exercise any of these rights, contact us via our <a href="/contact" className="text-blue-600 hover:underline">contact page</a>.
                You also have the right to lodge a complaint with the{" "}
                <a href="https://ico.org.uk/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Information Commissioner's Office (ICO)
                </a>.
              </p>
            </div>

            <div>
              <h2 className="font-oswald text-lg md:text-xl font-bold uppercase mb-2 text-gray-900">8. Children's Privacy</h2>
              <p>
                This site is not directed at children under the age of 13. We do not knowingly collect personal data from
                children. If you believe a child has provided us with personal data, contact us and we will delete it promptly.
              </p>
            </div>

            <div>
              <h2 className="font-oswald text-lg md:text-xl font-bold uppercase mb-2 text-gray-900">9. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. Changes will be reflected by an updated date at the
                top of this page. Continued use of the site after any change constitutes acceptance of the revised policy.
              </p>
            </div>

            <div>
              <h2 className="font-oswald text-lg md:text-xl font-bold uppercase mb-2 text-gray-900">10. Contact</h2>
              <p>
                For privacy-related requests or questions about this policy, contact us via our{" "}
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
