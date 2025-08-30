import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface HeroProps {}


export function Hero({}: HeroProps) {
  return (
    <section id="hero" className="relative w-full py-10 md:py-16 bg-background/50 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <div className="max-w-2xl mx-auto animate-in fade-in-up duration-1000">
          <h1 className="text-2xl font-headline font-bold tracking-tighter sm:text-3xl text-foreground">
            Connect with Local Businesses. Find Best Offers Daily.
          </h1>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            All your local businesses in one place – shops, restaurants, salons, rentals, and more.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link href="#featured-offers" className="w-full sm:w-auto">
              <Button size="lg" className="rounded-full font-semibold w-full">Explore Offers</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
