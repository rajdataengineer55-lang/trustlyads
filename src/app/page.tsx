
"use client";

import { useState } from "react";
import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { FeaturedOffers } from "@/components/landing/featured-offers";
import { Footer } from "@/components/landing/footer";
import { Filters, SortOption } from "@/components/landing/filters";
import { categories as categoryData } from "@/lib/categories";
import { StoriesViewer } from "@/components/landing/stories-viewer";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [searchTerm, setSearchTerm] = useState('');


  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
       <Filters 
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          sortOption={sortOption}
          setSortOption={setSortOption}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categoryData}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
      />
      <main className="flex-1">
        <Hero />
        <StoriesViewer />
        <FeaturedOffers 
          selectedCategory={selectedCategory} 
          selectedLocation={selectedLocation}
          sortOption={sortOption}
          searchTerm={searchTerm}
        />
      </main>
      <Footer />
    </div>
  );
}
