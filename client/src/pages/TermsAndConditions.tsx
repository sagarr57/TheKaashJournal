import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SEO } from "@/components/SEO";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Terms and Conditions"
        description="Read the terms and conditions for using The Kaash Journal website and content."
        url="/terms-and-conditions"
      />
      <Header />

      <main id="main-content">
        <section className="bg-gray-50 border-b border-gray-200 py-10 md:py-12">
          <div className="container">
            <h1 className="font-oswald text-3xl sm:text-4xl lg:text-5xl font-bold uppercase mb-3 md:mb-4">
              Terms and <span className="text-blue-600">Conditions</span>
            </h1>
            <p className="text-gray-600 text-base md:text-lg">
              Last updated: February 2026
            </p>
          </div>
        </section>

        <section className="container py-10 md:py-12">
          <div className="max-w-3xl prose prose-base md:prose-lg">
            <h2>Acceptance of Terms</h2>
            <p>
              By accessing and using this website, you agree to these terms and applicable laws.
              If you do not agree, please do not use the site.
            </p>

            <h2>Content Disclaimer</h2>
            <p>
              Content on this site is for informational and educational purposes only and does not
              constitute legal, investment, or financial advice. Always seek qualified
              professional advice for your individual circumstances.
            </p>

            <h2>Intellectual Property</h2>
            <p>
              All original content, branding, and design are owned by The Kaash Journal unless
              stated otherwise. You may not reproduce or distribute content without permission.
            </p>

            <h2>External Links</h2>
            <p>
              This site may contain links to third-party websites. We are not responsible for
              third-party content, policies, or services.
            </p>

            <h2>Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, we are not liable for any loss or damage
              arising from use of this website, including reliance on published content.
            </p>

            <h2>Changes to Terms</h2>
            <p>
              We may update these terms from time to time. Continued use of the site after updates
              means you accept the revised terms.
            </p>

            <h2>Contact</h2>
            <p>
              For questions regarding these terms, contact us through the information provided on
              our About page.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
