import { Mail, Twitter, Linkedin, Github } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-20">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center justify-center md:justify-start mb-4">
              <img 
                src="/images/Kaash_logo.png" 
                alt="The Kaash Journal" 
                className="h-24 md:h-28 lg:h-32 w-auto object-contain"
              />
            </div>
            <p className="text-gray-600 text-sm">
              Exploring the intersection of AI and finance. Real-time solutions, debt management, and fintech trends.
            </p>
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
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-oswald font-bold uppercase text-sm mb-4 text-gray-900">Categories</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="/category/ai-tools-updates" className="hover:text-gray-900 transition-colors">
                  AI Tools & Updates
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
                <a href="/category/how-to-guides" className="hover:text-gray-900 transition-colors">
                  How-To Guides
                </a>
              </li>
              <li>
                <a href="/category/case-studies" className="hover:text-gray-900 transition-colors">
                  Case Studies
                </a>
              </li>
            </ul>
          </div>

          {/* Social & Newsletter */}
          <div>
            <h3 className="font-oswald font-bold uppercase text-sm mb-4 text-gray-900">Connect</h3>
            <div className="flex gap-4 mb-6">
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
          <p>&copy; {currentYear} The Kaash Journal. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-900 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-gray-900 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
