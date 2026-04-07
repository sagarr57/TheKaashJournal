import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SEO } from "@/components/SEO";

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Cookie Policy"
        description="Learn how The Kaash Journal uses cookies for analytics, functionality, and advertising."
        url="/cookie-policy"
      />
      <Header />

      <main id="main-content">
        <section className="bg-gray-50 border-b border-gray-200 py-10 md:py-12">
          <div className="container">
            <h1 className="font-oswald text-3xl sm:text-4xl lg:text-5xl font-bold uppercase mb-3 md:mb-4">
              Cookie <span className="text-blue-600">Policy</span>
            </h1>
            <p className="text-gray-600 text-base md:text-lg">
              Last updated: February 2026
            </p>
          </div>
        </section>

        <section className="container py-10 md:py-12">
          <div className="max-w-3xl prose prose-base md:prose-lg">
            <h2>What Are Cookies</h2>
            <p>
              Cookies are small text files stored on your device to help websites function and
              understand how users interact with content.
            </p>

            <h2>How We Use Cookies</h2>
            <p>We use cookies for:</p>
            <ul>
              <li>Essential site functionality</li>
              <li>Performance and analytics measurement</li>
              <li>Personalization and traffic insights</li>
              <li>Advertising and conversion tracking where applicable</li>
            </ul>

            <h2>Third-Party Cookies</h2>
            <p>
              Some cookies may be set by third-party services we use, including analytics and ad
              platforms. These third parties are responsible for their own cookie and privacy
              practices.
            </p>

            <h2>Managing Cookies</h2>
            <p>
              You can manage or block cookies in your browser settings. Disabling certain cookies
              may impact site functionality or analytics accuracy.
            </p>

            <h2>Updates</h2>
            <p>
              We may update this policy as our services or legal requirements evolve. Please review
              this page periodically.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
