
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { Megaphone } from "lucide-react";
  

const faqs = [
    {
        question: "How do I post an ad for my business?",
        answer: "Currently, you can post an ad by contacting our admin team directly. You can call us or message us on WhatsApp at +91 9380002829, or click the 'Post Your Business' button found on the homepage. We will help you get your offer listed quickly."
    },
    {
        question: "How do I find offers relevant to me?",
        answer: "You can easily find offers by using the search bar on the homepage, or by using the filters. You can filter offers by category (e.g., Restaurants, Shops, Services) and by location to see what's available in your area."
    },
    {
        question: "Is it free to use trustlyads.in?",
        answer: "For customers looking for offers, our platform is completely free to use. For businesses, we currently offer a free listing service to help you get started. We may introduce premium features in the future."
    },
    {
        question: "How can I edit or delete an offer I have already posted?",
        answer: "If you need to make changes to your live offer or remove it, please contact our admin team via call or WhatsApp. We will assist you with your request."
    },
    {
        question: "How does the 'Boost' feature work for my ad?",
        answer: "The 'Boost' feature moves your offer to the top of the list in our admin dashboard, which means it will also appear first on the website for a temporary period. This gives your ad more visibility. Contact us to learn more about promoting your offers."
    },
    {
        question: "Can I add a video to my offer?",
        answer: "Yes! Our ad posting form allows you to upload a short video (up to 1 minute) along with up to 10 images to make your offer more engaging."
    }
]

export default function FaqPage() {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 bg-background py-16 sm:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
                <Megaphone className="h-12 w-12 text-primary mx-auto mb-4" />
                <h1 className="text-3xl sm:text-4xl font-bold mb-4">Frequently Asked Questions</h1>
                <p className="text-muted-foreground">Find answers to common questions about our platform.</p>
            </div>
            <div className="max-w-3xl mx-auto mt-12">
                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, i) => (
                        <AccordionItem value={`item-${i}`} key={i}>
                            <AccordionTrigger className="text-left font-semibold">{faq.question}</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
}
