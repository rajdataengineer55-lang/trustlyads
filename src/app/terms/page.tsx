
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-background py-16 sm:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold mb-8">Terms of Service</h1>
            <div className="prose dark:prose-invert max-w-none space-y-6 text-base sm:text-lg">
              <p>Welcome to trustlyads.in. By accessing or using our website, you agree to be bound by these Terms of Service. Please read them carefully.</p>
              
              <h2 className="text-xl sm:text-2xl font-bold mt-10 mb-4">1. Use of Service</h2>
              <p>trustlyads.in provides a platform for local businesses to post offers and for users to discover them. You agree to use the service responsibly and not to post any content that is unlawful, harmful, or violates the rights of others.</p>
              
              <h2 className="text-xl sm:text-2xl font-bold mt-10 mb-4">2. User Accounts</h2>
              <p>To post an offer, you may need to create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.</p>
              
              <h2 className="text-xl sm:text-2xl font-bold mt-10 mb-4">3. Content</h2>
              <p>Businesses are solely responsible for the content of their posts, including the accuracy of offers and compliance with applicable laws. We reserve the right to remove any content that we deem inappropriate or in violation of these terms.</p>
              
              <h2 className="text-xl sm:text-2xl font-bold mt-10 mb-4">4. Limitation of Liability</h2>
              <p>trustlyads.in is not responsible for any disputes that may arise between businesses and customers. We do not guarantee the quality, safety, or legality of the offers posted on our platform.</p>

              <h2 className="text-xl sm:text-2xl font-bold mt-10 mb-4">5. Changes to Terms</h2>
              <p>We reserve the right to modify these terms at any time. We will notify you of any changes by posting the new terms on this page. Your continued use of the service after any such changes constitutes your acceptance of the new terms.</p>

              <p className="mt-10">If you have any questions about these Terms of Service, please contact us.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
