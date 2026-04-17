import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SEO } from "@/components/SEO";
import { getContactEmail } from "@/lib/site-contact";
import { Mail, Clock, ShieldCheck } from "lucide-react";

export default function Contact() {
  const contactEmail = getContactEmail();

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Contact"
        description="Contact Team Kaash for editorial queries, corrections, partnerships, and feedback."
        url="/contact"
      />
      <Header />

      <main id="main-content">
        <section className="bg-gray-50 border-b border-gray-200 py-12 md:py-16">
          <div className="container">
            <h1 className="font-oswald text-3xl sm:text-4xl md:text-5xl font-bold uppercase mb-3 md:mb-4">
              Contact <span className="text-blue-600">Us</span>
            </h1>
            <p className="text-gray-600 text-base md:text-lg max-w-2xl">
              Questions, corrections, collaboration ideas, or media requests. We review every message.
            </p>
          </div>
        </section>

        <div className="container py-12 md:py-20">
          <div className="max-w-3xl mx-auto">
            <section className="border border-gray-200 rounded p-6 md:p-8 mb-8">
              <h2 className="font-oswald text-2xl font-bold uppercase mb-4">How to Reach Us</h2>
              <p className="text-gray-700 mb-5">
                Email is the fastest channel for editorial support, factual corrections, and partnership discussions.
              </p>
              <a
                href={`mailto:${encodeURIComponent(contactEmail)}`}
                className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-800 font-semibold break-all"
              >
                <Mail className="w-5 h-5 shrink-0" />
                {contactEmail}
              </a>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded p-5">
                <h3 className="font-oswald text-lg font-bold uppercase mb-2 inline-flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  Response Time
                </h3>
                <p className="text-gray-700 text-sm">
                  We usually respond within 1-2 business days. Complex editorial requests may take longer.
                </p>
              </div>
              <div className="border border-gray-200 rounded p-5">
                <h3 className="font-oswald text-lg font-bold uppercase mb-2 inline-flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                  Editorial Corrections
                </h3>
                <p className="text-gray-700 text-sm">
                  If you spot a factual issue, include the page URL and the specific line you want reviewed.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
