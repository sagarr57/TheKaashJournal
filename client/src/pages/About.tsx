import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Mail, Linkedin, Twitter } from "lucide-react";
// import { ChartSection } from "@/components/ChartSection";
// import { NicheCard } from "@/components/NicheCard";
// import { nicheData } from "@/lib/data";

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        {/* Page Header */}
        <section className="bg-gray-50 border-b border-gray-200 py-16">
          <div className="container">
            <h1 className="font-oswald text-5xl font-bold uppercase mb-4">
              About <span className="text-blue-600">Us</span>
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl">
              Exploring the intersection of artificial intelligence and financial technology.
            </p>
          </div>
        </section>

        {/* Content */}
        <div className="container py-20">
          <div className="max-w-3xl mx-auto">
            {/* Mission */}
            <section className="mb-16">
              <h2 className="font-oswald text-3xl font-bold uppercase mb-6">Our Mission</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                At The Kaash Journal, we believe that the convergence of artificial intelligence and financial technology is reshaping how people manage money, invest, and plan for the future.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                Our mission is to provide clear, data-driven insights into this rapidly evolving landscape. We cover real-time financial solutions, AI-powered debt management tools, emerging fintech trends, and practical guides to help you leverage these technologies effectively.
              </p>
            </section>

            {/* What We Cover */}
            <section className="mb-16 py-12 border-y border-gray-200">
              <h2 className="font-oswald text-3xl font-bold uppercase mb-8">What We Cover</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-oswald text-xl font-bold uppercase mb-3 text-blue-600">
                    AI Tools & Updates
                  </h3>
                  <p className="text-gray-700">
                    Latest AI tools and platforms transforming the financial industry.
                  </p>
                </div>
                <div>
                  <h3 className="font-oswald text-xl font-bold uppercase mb-3 text-blue-600">
                    Debt Management
                  </h3>
                  <p className="text-gray-700">
                    AI solutions for tracking, optimizing, and eliminating debt.
                  </p>
                </div>
                <div>
                  <h3 className="font-oswald text-xl font-bold uppercase mb-3 text-blue-600">
                    Real-Time Finance
                  </h3>
                  <p className="text-gray-700">
                    Live market data, AI analysis, and investment insights.
                  </p>
                </div>
                <div>
                  <h3 className="font-oswald text-xl font-bold uppercase mb-3 text-blue-600">
                    Fintech Trends
                  </h3>
                  <p className="text-gray-700">
                    Industry news, analysis, and emerging opportunities.
                  </p>
                </div>
                <div>
                  <h3 className="font-oswald text-xl font-bold uppercase mb-3 text-blue-600">
                    How-To Guides
                  </h3>
                  <p className="text-gray-700">
                    Practical tutorials on using AI for personal finance.
                  </p>
                </div>
                <div>
                  <h3 className="font-oswald text-xl font-bold uppercase mb-3 text-blue-600">
                    Case Studies
                  </h3>
                  <p className="text-gray-700">
                    Real-world applications and success stories.
                  </p>
                </div>
              </div>
            </section>

            {/* Why Trust Us */}
            <section className="mb-16">
              <h2 className="font-oswald text-3xl font-bold uppercase mb-6">Why Trust Us</h2>
              <ul className="space-y-4">
                <li className="flex gap-4">
                  <span className="text-blue-600 font-bold text-xl flex-shrink-0">✓</span>
                  <p className="text-gray-700">
                    <strong>Data-Driven:</strong> All our insights are backed by research and real market data.
                  </p>
                </li>
                <li className="flex gap-4">
                  <span className="text-blue-600 font-bold text-xl flex-shrink-0">✓</span>
                  <p className="text-gray-700">
                    <strong>Practical:</strong> We focus on actionable advice you can implement immediately.
                  </p>
                </li>
                <li className="flex gap-4">
                  <span className="text-blue-600 font-bold text-xl flex-shrink-0">✓</span>
                  <p className="text-gray-700">
                    <strong>Transparent:</strong> We disclose our sources and methodologies clearly.
                  </p>
                </li>
                <li className="flex gap-4">
                  <span className="text-blue-600 font-bold text-xl flex-shrink-0">✓</span>
                  <p className="text-gray-700">
                    <strong>Updated:</strong> We continuously monitor trends and update our content.
                  </p>
                </li>
              </ul>
            </section>

            {/* Research & Data Insights - Commented out but keeping code for future use */}
            {/*
            <section className="mb-16 py-12 border-y border-gray-200">
              <div className="max-w-3xl mx-auto mb-8">
                <h2 className="font-oswald text-3xl font-bold uppercase mb-4">Research & Data Insights</h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  We believe in data-driven content. Here's a look at the top-performing niches in the fintech and AI space, based on search volume, monetization potential, and growth trends.
                </p>
              </div>
              
              <ChartSection />

              <div className="mb-12">
                <h3 className="font-oswald text-2xl font-bold uppercase mb-6 text-center">
                  Top Fintech & AI Niches
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {nicheData.top_niches.slice(0, 6).map((niche) => (
                    <NicheCard
                      key={niche.rank}
                      rank={niche.rank}
                      name={niche.name}
                      searchVolume={niche.search_volume}
                      cpc={niche.cpc}
                      difficulty={niche.difficulty}
                      growth={niche.growth_10y}
                      description={niche.description}
                      overallScore={niche.overall_score}
                    />
                  ))}
                </div>
              </div>
            </section>
            */}

            {/* Contact */}
            <section className="bg-gray-50 border border-gray-200 p-12 rounded max-w-3xl mx-auto">
              <h2 className="font-oswald text-3xl font-bold uppercase mb-6">Get In Touch</h2>
              <p className="text-gray-700 mb-8">
                Have questions, suggestions, or want to collaborate? We'd love to hear from you.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-none flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Email Us
                </Button>
                <Button variant="outline" className="border-2 border-gray-300 font-bold px-6 py-3 rounded-none flex items-center gap-2">
                  <Twitter className="w-5 h-5" />
                  Follow on Twitter
                </Button>
                <Button variant="outline" className="border-2 border-gray-300 font-bold px-6 py-3 rounded-none flex items-center gap-2">
                  <Linkedin className="w-5 h-5" />
                  Connect on LinkedIn
                </Button>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
