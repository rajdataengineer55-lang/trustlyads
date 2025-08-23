

"use client";

import { useState } from "react";
import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { Categories } from "@/components/landing/categories";
import { FeaturedOffers } from "@/components/landing/featured-offers";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Footer } from "@/components/landing/footer";
import { Filters, SortOption } from "@/components/landing/filters";
import { categories as categoryData } from "@/lib/categories";
import { Testimonials } from "@/components/landing/testimonials";
import { AdCopyGenerator } from "@/components/ad-copy-generator";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('newest');


  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Hero />
        <Categories
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        <Filters 
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            sortOption={sortOption}
            setSortOption={setSortOption}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={categoryData}
        />
        <FeaturedOffers 
          selectedCategory={selectedCategory} 
          selectedLocation={selectedLocation}
          sortOption={sortOption}
        />
        <HowItWorks />
        <Testimonials />
        <AdCopyGenerator />
      </main>
      <Footer />
    </div>
  );
}
