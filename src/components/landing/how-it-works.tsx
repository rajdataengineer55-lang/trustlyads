import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Handshake, Megaphone, Search } from "lucide-react";

const steps = [
  {
    icon: <Megaphone className="h-8 w-8 text-primary" />,
    title: "Post Your Offer",
    description: "Business owners easily create and post their daily ads and special offers in minutes.",
  },
  {
    icon: <Search className="h-8 w-8 text-primary" />,
    title: "Users Browse & Discover",
    description: "Customers browse a live feed of deals from their favorite local businesses.",
  },
  {
    icon: <Handshake className="h-8 w-8 text-primary" />,
    title: "Connect & Get Deals",
    description: "Users connect directly with businesses to avail offers, happening instantly.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 sm:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-headline font-bold">How It Works</h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            A simple, streamlined process for businesses and customers to connect.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="text-center bg-white shadow-sm hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto bg-blue-100/50 rounded-full p-3 w-fit mb-4">
                  {step.icon}
                </div>
                <CardTitle className="font-headline text-lg">{`Step ${index + 1}: ${step.title}`}</CardTitle>
                <CardDescription className="pt-2 text-sm">{step.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
