import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/layout/PageHeader";
import { SEO } from "@/components/SEO";
import { getContactEmail } from "@/lib/site-contact";
import { Mail, Clock, ShieldCheck, Users, Handshake, MessageSquare, AlertCircle } from "lucide-react";

export default function Contact() {
  const contactEmail = getContactEmail();

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Contact Us — The Kaash Journal"
        description="Contact The Kaash Journal editorial team for corrections, partnership enquiries, reader feedback, and media requests. We respond within 1–2 business days."
        url="/contact"
      />
      <Header />

      <main id="main-content" className="pt-6 sm:pt-8 md:pt-10">
        <PageHeader
          title={<>Contact <span className="text-blue-600">Us</span></>}
          subtitle="We're a small editorial team committed to accuracy and transparency. Whether you've spotted an error, want to collaborate, or just have a question — we want to hear from you."
        />

        <div className="container py-6 md:py-8">
          <div className="max-w-3xl mx-auto space-y-6">

            {/* Contact Email */}
            <section className="border border-gray-200 rounded p-5 md:p-6">
              <h2 className="font-oswald text-lg md:text-xl font-bold uppercase mb-3">Get in Touch</h2>
              <p className="text-gray-700 mb-2">
                Email is our primary channel. We personally read and respond to every message — no automated replies, no ticketing systems. If your query is time-sensitive, mention that in the subject line.
              </p>
              <p className="text-gray-600 text-sm mb-4">
                We cover AI, health technology, fintech, and personal finance. If your query relates to one of these topics, we're especially keen to engage.
              </p>
              <a
                href={`mailto:${contactEmail}`}
                className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-800 font-semibold break-all"
              >
                <Mail className="w-5 h-5 shrink-0" />
                {contactEmail}
              </a>
            </section>

            {/* What We Handle */}
            <section className="border border-gray-200 rounded p-5 md:p-6">
              <h2 className="font-oswald text-lg md:text-xl font-bold uppercase mb-4">What We Handle</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Factual Corrections</h3>
                    <p className="text-gray-600 text-sm">
                      We take accuracy seriously. If you spot a factual error — a wrong statistic, a misattributed study, or an outdated claim — please tell us. Include the article URL and the specific sentence in question. We aim to investigate and update within 48 hours.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Handshake className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Partnerships &amp; Collaborations</h3>
                    <p className="text-gray-600 text-sm">
                      We're open to editorial partnerships, sponsored content (clearly labelled), expert commentary, and data-sharing arrangements with credible organisations. Please outline your proposal and how it benefits our readers.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <MessageSquare className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Reader Feedback</h3>
                    <p className="text-gray-600 text-sm">
                      We genuinely value feedback on what's working and what isn't — topic suggestions, clarity improvements, missing context, or anything that would make our guides more useful. All feedback is read by the editorial team.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Users className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Media &amp; Press</h3>
                    <p className="text-gray-600 text-sm">
                      Journalists and researchers are welcome to quote our work with attribution. For exclusive commentary, interviews, or data licensing requests, please contact us directly with your publication name and deadline.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Response + Corrections */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded p-5">
                <h3 className="font-oswald text-lg font-bold uppercase mb-2 inline-flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  Response Time
                </h3>
                <p className="text-gray-700 text-sm">
                  We aim to reply within 1–2 business days (Monday–Friday, UK time). Complex editorial investigations or partnership reviews may take up to 5 business days. We'll acknowledge receipt if it's going to take longer.
                </p>
              </div>
              <div className="border border-gray-200 rounded p-5">
                <h3 className="font-oswald text-lg font-bold uppercase mb-2 inline-flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                  Our Editorial Standards
                </h3>
                <p className="text-gray-700 text-sm">
                  Every article on The Kaash Journal is researched against primary sources — government reports, peer-reviewed studies, and official company filings. We do not publish unverified claims. Our corrections policy is transparent: significant updates are noted at the top of the relevant article.
                </p>
              </div>
            </section>

            {/* What to Include */}
            <section className="border border-gray-200 rounded p-5 md:p-6 bg-gray-50">
              <h2 className="font-oswald text-lg md:text-xl font-bold uppercase mb-3">What to Include in Your Email</h2>
              <p className="text-gray-700 text-sm mb-3">
                To help us respond quickly and accurately, please include the following where relevant:
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex gap-2"><span className="text-blue-600 font-bold shrink-0">→</span> The URL of the specific article or page you're referencing</li>
                <li className="flex gap-2"><span className="text-blue-600 font-bold shrink-0">→</span> A brief description of your query or the issue you've identified</li>
                <li className="flex gap-2"><span className="text-blue-600 font-bold shrink-0">→</span> For corrections: the exact text you believe is incorrect and a source supporting your claim</li>
                <li className="flex gap-2"><span className="text-blue-600 font-bold shrink-0">→</span> For partnerships: your organisation name, your role, and a short description of what you're proposing</li>
                <li className="flex gap-2"><span className="text-blue-600 font-bold shrink-0">→</span> For media requests: your publication name, the nature of the piece, and your deadline</li>
              </ul>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
