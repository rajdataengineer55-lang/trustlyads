
"use client";

import { useState } from "react";
import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { Categories } from "@/components/landing/categories";
import { FeaturedOffers } from "@/components/landing/featured-offers";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Testimonials } from "@/components/landing/testimonials";
import { CtaBanner } from "@/components/landing/cta-banner";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Hero />
        <Categories
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        <FeaturedOffers selectedCategory={selectedCategory} />
        <HowItWorks />
        <Testimonials />
        <CtaBanner />
      </main>
      <Footer />
    </div>
  );
}
