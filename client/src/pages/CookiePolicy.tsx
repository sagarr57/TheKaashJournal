import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/layout/PageHeader";
import { SEO } from "@/components/SEO";

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Cookie Policy"
        description="Full details of how The Kaash Journal uses cookies — including strictly necessary, analytics, and advertising cookies set by Google Analytics and Google AdSense."
        url="/cookie-policy"
      />
      <Header />

      <main id="main-content" className="pt-6 sm:pt-8 md:pt-10">
        <PageHeader
          title={<>Cookie <span className="text-blue-600">Policy</span></>}
          subtitle="Last updated: 1 May 2026"
        />

        <section className="container py-6 md:py-8">
          <div className="max-w-3xl space-y-5 text-gray-700 text-base leading-relaxed">

            <p>
              This Cookie Policy explains how <strong>The Kaash Journal</strong> ("we", "us", "our") uses cookies and
              similar tracking technologies on <strong>www.thekaashjournal.com</strong>. It should be read alongside
              our <a href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</a>.
            </p>

            <div>
              <h2 className="font-oswald text-lg md:text-xl font-bold uppercase mb-2 text-gray-900">1. What Are Cookies</h2>
              <p className="mb-3">
                Cookies are small text files placed on your device (computer, phone, or tablet) when you visit a website.
                They allow the site to recognise your device on future visits and remember certain information about you,
                such as your preferences or whether you have accepted our cookie consent banner.
              </p>
              <p>
                Similar technologies include web beacons, pixels, and local storage — these work in comparable ways and
                are covered by this policy. We refer to all of these collectively as "cookies" for simplicity.
              </p>
            </div>

            <div>
              <h2 className="font-oswald text-lg md:text-xl font-bold uppercase mb-2 text-gray-900">2. Types of Cookies We Use</h2>

              <h3 className="font-semibold text-gray-900 mb-2 mt-4">Strictly Necessary Cookies</h3>
              <p className="mb-3">
                These cookies are required for the Site to function and cannot be switched off. They are typically set
                in response to actions such as setting your cookie preferences or navigating between pages. These cookies
                do not store personally identifiable information.
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li><strong>cookie_consent</strong> — stores your cookie preference (accepted / declined). Duration: 1 year. Set by: The Kaash Journal.</li>
              </ul>

              <h3 className="font-semibold text-gray-900 mb-2 mt-4">Analytics Cookies</h3>
              <p className="mb-3">
                These cookies help us understand how visitors interact with our Site. All data is aggregated and
                anonymised where possible. Analytics cookies are only activated after you have given consent.
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li><strong>_ga</strong> — distinguishes unique users. Duration: 2 years. Set by: Google Analytics.</li>
                <li><strong>_ga_*</strong> — used to persist session state. Duration: 2 years. Set by: Google Analytics.</li>
                <li><strong>_gid</strong> — distinguishes users. Duration: 24 hours. Set by: Google Analytics.</li>
                <li><strong>_gat</strong> — used to throttle request rate. Duration: 1 minute. Set by: Google Analytics.</li>
              </ul>
              <p>
                You can opt out of Google Analytics tracking at any time by installing the{" "}
                <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Google Analytics Opt-out Browser Add-on
                </a>.
              </p>

              <h3 className="font-semibold text-gray-900 mb-2 mt-4">Advertising Cookies</h3>
              <p className="mb-3">
                This Site uses <strong>Google AdSense</strong> to display advertisements. AdSense may use cookies to
                serve ads relevant to your interests based on your browsing history across this and other websites.
                Advertising cookies are only activated after you have given consent.
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li><strong>IDE</strong> — used by Google DoubleClick to register and report actions on the site after seeing or clicking an ad. Duration: 1 year. Set by: Google AdSense / DoubleClick.</li>
                <li><strong>test_cookie</strong> — used to check whether the user's browser supports cookies. Duration: 15 minutes. Set by: Google DoubleClick.</li>
                <li><strong>DSID, FLC, AID, TAID</strong> — used for cross-website tracking for personalised advertising. Set by: Google.</li>
              </ul>
              <p>
                You can opt out of personalised advertising from Google by visiting{" "}
                <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Google Ads Settings
                </a>{" "}
                or{" "}
                <a href="https://www.aboutads.info/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  aboutads.info
                </a>.
              </p>

              <h3 className="font-semibold text-gray-900 mb-2 mt-4">Tag Management Cookies</h3>
              <p>
                We use <strong>Google Tag Manager</strong> to deploy and manage our analytics and advertising tags.
                GTM itself does not set cookies but may trigger scripts that do, including Google Analytics and
                AdSense where consent has been given.
              </p>
            </div>

            <div>
              <h2 className="font-oswald text-lg md:text-xl font-bold uppercase mb-2 text-gray-900">3. Cookie Consent</h2>
              <p className="mb-3">
                When you first visit this Site, a cookie consent banner will appear at the bottom of the page. You can:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Accept all cookies</strong> — enables strictly necessary, analytics, and advertising cookies.</li>
                <li><strong>Decline</strong> — only strictly necessary cookies will be set; analytics and advertising cookies will not be activated.</li>
              </ul>
              <p className="mt-3">
                Your preference is stored for 12 months. You can withdraw consent at any time by clearing your browser
                cookies — the banner will reappear on your next visit.
              </p>
            </div>

            <div>
              <h2 className="font-oswald text-lg md:text-xl font-bold uppercase mb-2 text-gray-900">4. Managing Cookies in Your Browser</h2>
              <p className="mb-3">
                You can control and delete cookies through your browser settings at any time. Please note that blocking
                certain cookies may affect site functionality. Browser help guides:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Chrome — manage cookies</a></li>
                <li><a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Mozilla Firefox — manage cookies</a></li>
                <li><a href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Apple Safari — manage cookies</a></li>
                <li><a href="https://support.microsoft.com/en-us/windows/manage-cookies-in-microsoft-edge" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Microsoft Edge — manage cookies</a></li>
              </ul>
            </div>

            <div>
              <h2 className="font-oswald text-lg md:text-xl font-bold uppercase mb-2 text-gray-900">5. Third-Party Cookies</h2>
              <p>
                Cookies set by third-party services (Google Analytics, Google AdSense) are governed by each provider's
                own privacy and cookie policies. We do not control these cookies once set. See the{" "}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Google Privacy Policy
                </a>{" "}
                for full details of how Google processes data collected via these cookies.
              </p>
            </div>

            <div>
              <h2 className="font-oswald text-lg md:text-xl font-bold uppercase mb-2 text-gray-900">6. Legal Basis (UK GDPR)</h2>
              <p>
                Strictly necessary cookies are used on the basis of legitimate interest (they are required for the Site
                to function). Analytics and advertising cookies are only activated upon your consent, in accordance with
                UK GDPR and the Privacy and Electronic Communications Regulations (PECR). You can withdraw consent at
                any time — see Section 3 above.
              </p>
            </div>

            <div>
              <h2 className="font-oswald text-lg md:text-xl font-bold uppercase mb-2 text-gray-900">7. Updates to This Policy</h2>
              <p>
                We may update this Cookie Policy when we add new services, change how cookies are used, or if legal
                requirements change. Changes will be reflected by an updated date at the top of this page. We encourage
                you to review this page periodically.
              </p>
            </div>

            <div>
              <h2 className="font-oswald text-lg md:text-xl font-bold uppercase mb-2 text-gray-900">8. Contact</h2>
              <p>
                For questions about this Cookie Policy or to exercise your data rights, contact us via our{" "}
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
