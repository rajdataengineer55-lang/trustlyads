import { Card, CardContent } from "@/components/ui/card";
import { HeartPulse, KeyRound, ShoppingCart, Sparkles, Utensils, Wrench } from "lucide-react";

const categories = [
  { name: "Restaurants", icon: <Utensils className="h-10 w-10" /> },
  { name: "Shopping", icon: <ShoppingCart className="h-10 w-10" /> },
  { name: "Health", icon: <HeartPulse className="h-10 w-10" /> },
  { name: "Beauty", icon: <Sparkles className="h-10 w-10" /> },
  { name: "Rentals", icon: <KeyRound className="h-10 w-10" /> },
  { name: "Services", icon: <Wrench className="h-10 w-10" /> },
];

export function Categories() {
  return (
    <section id="categories" className="py-16 sm:py-24 bg-white dark:bg-gray-900/10">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-headline font-bold text-center mb-12">
          Explore by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
          {categories.map((category) => (
            <Card key={category.name} className="group flex flex-col items-center justify-center p-6 text-center transition-all duration-300 ease-in-out hover:bg-primary hover:text-primary-foreground hover:shadow-lg transform hover:-translate-y-1 cursor-pointer">
              <CardContent className="p-0 flex flex-col items-center justify-center space-y-4">
                <div className="text-primary group-hover:text-primary-foreground transition-colors">
                  {category.icon}
                </div>
                <p className="font-semibold font-headline">{category.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
