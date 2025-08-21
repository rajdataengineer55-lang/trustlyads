import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    quote: "TrustAds helped us reach so many new customers! Posting our daily specials takes seconds and the results are amazing.",
    name: "Maria Garcia",
    title: "Owner, The Corner Cafe",
    avatar: "https://placehold.co/100x100.png",
    hint: "woman portrait"
  },
  {
    quote: "I love finding new lunch spots and deals on TrustAds. It's my go-to app for discovering what's happening in my neighborhood.",
    name: "David Chen",
    title: "Local Customer",
    avatar: "https://placehold.co/100x100.png",
    hint: "man portrait"
  },
  {
    quote: "The business dashboard is incredibly easy to use. We saw a 30% increase in foot traffic during our first week of advertising.",
    name: "Priya Sharma",
    title: "Manager, Style Salon",
    avatar: "https://placehold.co/100x100.png",
    hint: "woman professional"
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-16 sm:py-24 bg-white dark:bg-gray-900/10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-headline font-bold">Loved by Businesses and Users</h2>
          <p className="mt-4 text-muted-foreground">Don't just take our word for it. Here's what people are saying.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="flex flex-col justify-between">
              <CardContent className="p-6">
                <blockquote className="text-lg italic border-l-4 border-primary pl-4 mb-6">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} data-ai-hint={testimonial.hint} />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="ml-4">
                    <p className="font-semibold font-headline">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
