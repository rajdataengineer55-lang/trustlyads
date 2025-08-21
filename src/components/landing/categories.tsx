import { Card, CardContent } from "@/components/ui/card";
import { Leaf, Milk, Shirt, Palette, Armchair, Construction, Car, CircuitBoard, Wrench, Gem, Building, ShoppingCart, Printer, Pill, Code, Landmark } from "lucide-react";

const categories = [
  { name: "Agriculture & Farming", icon: <Leaf className="h-10 w-10" /> },
  { name: "Dairy & Poultry", icon: <Milk className="h-10 w-10" /> },
  { name: "Textile & Garments", icon: <Shirt className="h-10 w-10" /> },
  { name: "Handlooms & Handicrafts", icon: <Palette className="h-10 w-10" /> },
  { name: "Wood & Furniture", icon: <Armchair className="h-10 w-10" /> },
  { name: "Building & Construction", icon: <Construction className="h-10 w-10" /> },
  { name: "Automobiles", icon: <Car className="h-10 w-10" /> },
  { name: "Electrical & Electronics", icon: <CircuitBoard className="h-10 w-10" /> },
  { name: "Hardware & Machinery", icon: <Wrench className="h-10 w-10" /> },
  { name: "Gold & Jewellery", icon: <Gem className="h-10 w-10" /> },
  { name: "Real Estate & Property", icon: <Building className="h-10 w-10" /> },
  { name: "Wholesale & Retail", icon: <ShoppingCart className="h-10 w-10" /> },
  { name: "Printing & Stationery", icon: <Printer className="h-10 w-10" /> },
  { name: "Medical & Pharmacy", icon: <Pill className="h-10 w-10" /> },
  { name: "IT & Software Solutions", icon: <Code className="h-10 w-10" /> },
  { name: "Banks & Finance", icon: <Landmark className="h-10 w-10" /> },
];

export function Categories() {
  return (
    <section id="categories" className="py-16 sm:py-24 bg-white dark:bg-gray-900/10">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-headline font-bold text-center mb-12">
          Explore by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category) => (
            <Card key={category.name} className="group flex flex-col items-center justify-center p-4 text-center transition-all duration-300 ease-in-out hover:bg-primary hover:text-primary-foreground hover:shadow-lg transform hover:-translate-y-1 cursor-pointer">
              <CardContent className="p-0 flex flex-col items-center justify-center space-y-2">
                <div className="text-primary group-hover:text-primary-foreground transition-colors">
                  {category.icon}
                </div>
                <p className="font-semibold font-headline text-sm">{category.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
