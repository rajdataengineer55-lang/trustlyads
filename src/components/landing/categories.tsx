
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Leaf, Milk, Shirt, Palette, Armchair, Construction, Car, CircuitBoard, Wrench, Gem, Building, ShoppingCart, Printer, Pill, Code, Landmark } from "lucide-react";

const categories = [
  { name: "Agriculture & Farming", icon: <Leaf className="h-8 w-8" /> },
  { name: "Dairy & Poultry", icon: <Milk className="h-8 w-8" /> },
  { name: "Textile & Garments", icon: <Shirt className="h-8 w-8" /> },
  { name: "Handlooms & Handicrafts", icon: <Palette className="h-8 w-8" /> },
  { name: "Wood & Furniture", icon: <Armchair className="h-8 w-8" /> },
  { name: "Building & Construction", icon: <Construction className="h-8 w-8" /> },
  { name: "Automobiles", icon: <Car className="h-8 w-8" /> },
  { name: "Electrical & Electronics", icon: <CircuitBoard className="h-8 w-8" /> },
  { name: "Hardware & Machinery", icon: <Wrench className="h-8 w-8" /> },
  { name: "Gold & Jewellery", icon: <Gem className="h-8 w-8" /> },
  { name: "Real Estate & Property", icon: <Building className="h-8 w-8" /> },
  { name: "Wholesale & Retail", icon: <ShoppingCart className="h-8 w-8" /> },
  { name: "Printing & Stationery", icon: <Printer className="h-8 w-8" /> },
  { name: "Medical & Pharmacy", icon: <Pill className="h-8 w-8" /> },
  { name: "IT & Software Solutions", icon: <Code className="h-8 w-8" /> },
  { name: "Banks & Finance", icon: <Landmark className="h-8 w-8" /> },
];

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
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
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
                <p className="font-semibold font-headline text-xs">{category.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
