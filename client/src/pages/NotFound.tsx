import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SEO } from "@/components/SEO";
import { Home } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="404 — Page Not Found"
        description="The page you are looking for doesn't exist or has been moved."
        noIndex={true}
      />
      <Header />
      <main id="main-content" className="container pt-24 sm:pt-28 pb-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="font-oswald text-5xl sm:text-6xl font-bold uppercase mb-3 text-black">
            404
          </h1>

          <h2 className="font-oswald text-xl sm:text-2xl md:text-3xl font-bold uppercase mb-4 text-black">
            Page Not Found
          </h2>

          <p className="text-gray-600 text-base mb-8 leading-relaxed max-w-md mx-auto">
            Sorry, the page you are looking for doesn't exist.
            <br />
            It may have been moved or deleted.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => setLocation("/")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 text-sm rounded-xl"
            >
              <Home className="w-5 h-5 mr-2" />
              Go Home
            </Button>
            <Button
              onClick={() => setLocation("/blog")}
              variant="outline"
              className="border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold px-6 py-3 text-sm rounded-xl"
            >
              View Blog
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
