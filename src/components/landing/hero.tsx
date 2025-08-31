import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface HeroProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export function Hero({ searchTerm, setSearchTerm }: HeroProps) {
  return (
    <section id="hero" className="w-full py-10 md:py-16 bg-background/50">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <div className="max-w-2xl mx-auto animate-fade-in-up duration-1000">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Connect with Local Businesses. Find Best Offers Daily.
          </h1>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            All your local businesses in one place – shops, restaurants, salons, rentals, and more.
          </p>
          <div className="mt-6 flex flex-col gap-4">
             <div className="relative w-full max-w-lg mx-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search in Tirupati, Vellore & more..."
                    className="w-full pl-10 h-12 rounded-full bg-background"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <Link href="#featured-offers" className="w-full sm:w-auto mx-auto">
              <Button size="lg" className="rounded-full font-semibold w-full sm:w-auto px-10">Explore Offers</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
