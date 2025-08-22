import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section id="hero" className="relative w-full py-12 md:py-20 lg:py-24 bg-white dark:bg-gray-900/10">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl md:text-4xl text-gray-900 dark:text-white">
            Connect with Local Businesses. Find Best Offers Daily.
          </h1>
          <p className="mt-4 text-base text-gray-600 dark:text-gray-300">
            All your local businesses in one place – shops, restaurants, salons, rentals, and more.
          </p>
          <div className="mt-6 max-w-lg mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="search"
                placeholder="Search in Tirupati, Vellore, Chittoor & more"
                className="w-full pl-12 pr-4 py-5 rounded-full border-2 border-gray-200 focus:border-primary focus:ring-primary"
              />
            </div>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Button size="lg" className="rounded-full font-semibold">Explore Offers</Button>
            <a href="https://wa.me/919380002829" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="rounded-full font-semibold bg-white">Post Your Business</Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
