import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function Hero() {
  return (
    <section id="hero" className="relative w-full py-24 md:py-32 lg:py-40 bg-white dark:bg-gray-900/10">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-gray-900 dark:text-white">
            Connect with Local Businesses. Find Best Offers Daily.
          </h1>
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
            All your local businesses in one place – shops, restaurants, salons, rentals, and more.
          </p>
          <div className="mt-8 max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="search"
                placeholder="Search by category, business, or location"
                className="w-full pl-12 pr-4 py-6 rounded-full border-2 border-gray-200 focus:border-primary focus:ring-primary"
              />
            </div>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button size="lg" className="rounded-full font-semibold">Explore Offers</Button>
            <Button size="lg" variant="outline" className="rounded-full font-semibold bg-white">Post Your Business</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
