import { getContactEmail } from "@/lib/site-contact";
import { Mail } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const contactEmail = getContactEmail();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-8 md:mt-10">
      <div className="container py-10 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 mb-8 md:mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center justify-center md:justify-start mb-4">
              <img
                src="/images/Kaash_logo.png"
                alt="The Kaash Journal"
                className="h-12 sm:h-14 md:h-16 w-auto object-contain"
              />
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Exploring the intersection of AI and finance. Real-time solutions, debt management, and fintech trends.
            </p>
            <a
              href={contactEmail ? `mailto:${encodeURIComponent(contactEmail)}` : "/contact"}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm"
              aria-label={contactEmail ? `Email ${contactEmail}` : "Contact"}
            >
              <Mail className="w-4 h-4" />
              {contactEmail || "Contact us"}
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-oswald font-bold uppercase text-sm mb-4 text-gray-900">Navigation</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="/" className="hover:text-gray-900 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/blog" className="hover:text-gray-900 transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-gray-900 transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-gray-900 transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-oswald font-bold uppercase text-sm mb-4 text-gray-900">Categories</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="/category/ai-and-health" className="hover:text-gray-900 transition-colors">
                  AI and Health
                </a>
              </li>
              <li>
                <a href="/category/debt-management" className="hover:text-gray-900 transition-colors">
                  Debt Management
                </a>
              </li>
              <li>
                <a href="/category/real-time-finance" className="hover:text-gray-900 transition-colors">
                  Real-Time Finance
                </a>
              </li>
              <li>
                <a href="/category/fintech-trends" className="hover:text-gray-900 transition-colors">
                  Fintech Trends
                </a>
              </li>
              <li>
                <a href="/category/case-studies" className="hover:text-gray-900 transition-colors">
                  Case Studies
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 md:pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4 text-sm text-gray-600">
          <div className="flex flex-col items-center md:items-start gap-1">
            <p className="text-center md:text-left">&copy; {currentYear} The Kaash Journal. All rights reserved.</p>
            <p className="text-xs text-gray-400">
              Powered by{" "}
              <a
                href="https://dravyxai.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-800 transition-colors font-medium"
              >
                Dravyx AI
              </a>
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <a href="/privacy-policy" className="hover:text-gray-900 transition-colors">
              Privacy Policy
            </a>
            <a href="/terms-and-conditions" className="hover:text-gray-900 transition-colors">
              Terms of Service
            </a>
            <a href="/cookie-policy" className="hover:text-gray-900 transition-colors">
              Cookie Policy
            </a>
            <a href="/editorial-policy" className="hover:text-gray-900 transition-colors">
              Editorial Policy
            </a>
            <a href="/disclaimer" className="hover:text-gray-900 transition-colors">
              Disclaimer
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
