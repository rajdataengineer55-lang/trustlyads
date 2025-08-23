import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section id="hero" className="relative w-full py-12 md:py-20 lg:py-24 bg-background/50 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <div className="max-w-2xl mx-auto animate-in fade-in-up duration-1000">
          <h1 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl text-foreground">
            Connect with Local Businesses. Find Best Offers Daily.
          </h1>
          <p className="mt-4 text-base text-muted-foreground">
            All your local businesses in one place – shops, restaurants, salons, rentals, and more.
          </p>
          <div className="mt-6 max-w-lg mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="search"
                name="search"
                type="search"
                placeholder="Search in Tirupati, Vellore & more"
                className="w-full pl-12 pr-4 py-5 rounded-full border-2 focus:border-primary focus:ring-primary"
              />
            </div>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link href="#featured-offers">
              <Button size="lg" className="rounded-full font-semibold w-full sm:w-auto">Explore Offers</Button>
            </Link>
            <a href="https://wa.me/919380002829" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="rounded-full font-semibold bg-background w-full">Post Your Business</Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
