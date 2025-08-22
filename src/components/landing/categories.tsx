
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { categories } from "@/lib/categories";

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
    <section id="categories" className="py-16 sm:py-24 bg-white dark:bg-gray-900/10">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-headline font-bold text-center mb-12">
          Explore by Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category) => (
            <Card 
              key={category.name} 
              onClick={() => handleCategoryClick(category.name)}
              className={cn(
                "group flex flex-col items-center justify-center p-3 text-center transition-all duration-300 ease-in-out hover:bg-primary hover:text-primary-foreground hover:shadow-lg transform hover:-translate-y-1 cursor-pointer",
                selectedCategory === category.name && "bg-primary text-primary-foreground shadow-lg -translate-y-1"
              )}
            >
              <CardContent className="p-0 flex flex-col items-center justify-center space-y-2">
                <div className={cn("text-primary group-hover:text-primary-foreground transition-colors", selectedCategory === category.name && "text-primary-foreground")}>
                  {category.icon}
                </div>
                <p className="font-semibold font-headline text-xs sm:text-sm">{category.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
