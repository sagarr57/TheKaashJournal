import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SEO } from "@/components/SEO";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Privacy Policy"
        description="Read the privacy policy for The Kaash Journal, including data collection, cookies, analytics, and newsletter usage."
        url="/privacy-policy"
      />
      <Header />

      <main id="main-content">
        <section className="bg-gray-50 border-b border-gray-200 py-10 md:py-12">
          <div className="container">
            <h1 className="font-oswald text-3xl sm:text-4xl lg:text-5xl font-bold uppercase mb-3 md:mb-4">
              Privacy <span className="text-blue-600">Policy</span>
            </h1>
            <p className="text-gray-600 text-base md:text-lg">
              Last updated: February 2026
            </p>
          </div>
        </section>

        <section className="container py-10 md:py-12">
          <div className="max-w-3xl prose prose-base md:prose-lg">
            <h2>Information We Collect</h2>
            <p>
              We may collect personal information you provide directly, such as your email
              address when subscribing to newsletters. We also collect limited technical and
              usage data such as device type, browser, pages viewed, and referral source.
            </p>

            <h2>How We Use Information</h2>
            <p>We use collected information to:</p>
            <ul>
              <li>Deliver content and improve site performance</li>
              <li>Send newsletters and updates when you opt in</li>
              <li>Analyze engagement and optimize user experience</li>
              <li>Maintain security and prevent abuse</li>
            </ul>

            <h2>Cookies and Tracking</h2>
            <p>
              We use cookies and similar technologies for analytics, performance, and advertising
              measurement. You can control cookies through browser settings. See our Cookie Policy
              for more details.
            </p>

            <h2>Third-Party Services</h2>
            <p>
              We may use third-party services for analytics, email delivery, and advertising.
              These providers process data according to their own privacy policies and applicable
              law.
            </p>

            <h2>Data Retention</h2>
            <p>
              We keep personal data only as long as necessary for the purpose it was collected,
              unless a longer period is required by law.
            </p>

            <h2>Your Rights</h2>
            <p>
              Depending on your location, you may have rights to access, correct, delete, or
              restrict use of your personal data. Contact us to make a request.
            </p>

            <h2>Contact</h2>
            <p>
              For privacy-related requests, contact us through the information provided on our
              About page.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
