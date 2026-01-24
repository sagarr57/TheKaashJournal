import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Home } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  const handleGoHome = () => {
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="font-oswald text-6xl lg:text-8xl font-bold uppercase mb-4 text-black">
            404
          </h1>

          <h2 className="font-oswald text-3xl lg:text-4xl font-bold uppercase mb-6 text-black">
            Page Not Found
          </h2>

          <p className="text-gray-600 text-lg mb-12 leading-relaxed max-w-md mx-auto">
            Sorry, the page you are looking for doesn't exist.
            <br />
            It may have been moved or deleted.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleGoHome}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-6 text-lg rounded-none"
            >
              <Home className="w-5 h-5 mr-2" />
              Go Home
            </Button>
            <Button
              onClick={() => setLocation("/blog")}
              variant="outline"
              className="border-2 border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white font-bold px-8 py-6 text-lg rounded-none"
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
