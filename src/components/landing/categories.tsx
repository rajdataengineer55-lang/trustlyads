
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { categories } from "@/lib/categories";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

interface CategoriesProps {
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
}

export function Categories({ selectedCategory, setSelectedCategory }: CategoriesProps) {
  const handleCategoryClick = (categoryName: string) => {
    if (selectedCategory === categoryName) {
      setSelectedCategory(null); // Deselect if the same category is clicked again
    } else {
      setSelectedCategory(categoryName);
    }
  };
  
  return (
    <section id="categories" className="py-10 sm:py-12 bg-background/50">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-headline font-bold text-center mb-12">
          Explore by Category
        </h2>
        <Carousel
          opts={{
            align: "start",
            dragFree: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {categories.map((category) => (
              <CarouselItem key={category.name} className="basis-1/3 sm:basis-1/4 md:basis-1/6 lg:basis-1/9">
                 <Card 
                    onClick={() => handleCategoryClick(category.name)}
                    className={cn(
                      "group flex flex-col items-center justify-center p-2 text-center transition-all duration-300 ease-in-out hover:bg-primary hover:text-primary-foreground hover:shadow-lg transform hover:-translate-y-1 cursor-pointer h-full",
                      selectedCategory === category.name && "bg-primary text-primary-foreground shadow-lg -translate-y-1"
                    )}
                  >
                    <CardContent className="p-2 flex flex-col items-center justify-center space-y-2">
                      <div className={cn("h-12 w-12 flex items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary-foreground transition-colors duration-300", selectedCategory === category.name && "bg-primary-foreground")}>
                        <div className={cn("text-primary group-hover:text-primary transition-colors duration-300", selectedCategory === category.name && "text-primary")}>
                          {category.icon}
                        </div>
                      </div>
                      <p className="font-semibold text-xs sm:text-sm leading-tight">{category.name}</p>
                    </CardContent>
                  </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </div>
    </section>
  );
}
