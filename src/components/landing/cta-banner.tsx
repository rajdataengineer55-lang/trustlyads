import { Button } from "@/components/ui/button";

export function CtaBanner() {
  return (
    <section id="cta" className="py-16 sm:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="bg-primary text-primary-foreground rounded-2xl p-10 md:p-16 text-center shadow-xl">
          <h2 className="text-3xl md:text-4xl font-headline font-bold">
            Ready to Boost Your Business?
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg">
            Join hundreds of local businesses on LocalPulse. Sign up today and post your first ad in minutes!
          </p>
          <div className="mt-8">
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg py-7 px-10 rounded-full"
            >
              Sign Up & Post Your Ad
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
