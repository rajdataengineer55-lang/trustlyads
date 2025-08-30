import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-background py-16 sm:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold mb-8">✨ About Us</h1>
            <div className="prose dark:prose-invert max-w-none space-y-6 text-base sm:text-lg text-muted-foreground">
              <p className="text-foreground">Welcome to trustlyads.in, a community-driven platform dedicated to empowering local businesses, entrepreneurs, and service providers. Our mission is simple – to connect rural talent, shops, and services with the right customers through digital promotion.</p>
              <p>In today’s world, every business deserves visibility. Whether you are a farmer, a small shop owner, a service provider, or a startup, we provide a trusted space to advertise, grow, and reach more people.</p>
              
              <h2 className="text-xl sm:text-2xl font-bold mt-10 mb-4 text-foreground">🔹 What We Do</h2>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>Promote local businesses through our digital ads platform</li>
                <li>Help shops and services reach wider audiences</li>
                <li>Support rural entrepreneurs with affordable marketing</li>
                <li>Build a bridge of trust between customers and business owners</li>
              </ul>
              
              <h2 className="text-xl sm:text-2xl font-bold mt-10 mb-4 text-foreground">🔹 Our Values</h2>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>✔ Trust &amp; Transparency</li>
                <li>✔ Affordable Promotion</li>
<li>✔ Community Growth</li>
                <li>✔ Digital Empowerment</li>
              </ul>
              
              <p className="font-semibold italic mt-10">“Local Growth, Global Reach.”</p>
              <p>By supporting small and medium businesses, we are creating opportunities, jobs, and sustainable development for our community.</p>
              
              <p className="mt-10">👉 Join us today and let’s grow together!</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
