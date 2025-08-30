
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-background py-16 sm:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold mb-8">Privacy Policy</h1>
            <div className="prose dark:prose-invert max-w-none space-y-6 text-base sm:text-lg">
              <p>Your privacy is important to us. It is trustlyads.in's policy to respect your privacy regarding any information we may collect from you across our website.</p>
              
              <h2 className="text-xl sm:text-2xl font-bold mt-10 mb-4">1. Information We Collect</h2>
              <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.</p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li><strong>Log data:</strong> When you visit our website, our servers may automatically log the standard data provided by your web browser.</li>
                <li><strong>Personal Information:</strong> We may ask for personal information, such as your name, email, and phone number, when you register or contact us.</li>
                <li><strong>Business Information:</strong> When posting an ad, we collect information about the business, including its name, location, and details of the offer.</li>
              </ul>
              
              <h2 className="text-xl sm:text-2xl font-bold mt-10 mb-4">2. How We Use Your Information</h2>
              <p>We use the information we collect to operate and maintain our website, to provide you with the services you request, to communicate with you, and to improve our platform.</p>
              
              <h2 className="text-xl sm:text-2xl font-bold mt-10 mb-4">3. Security</h2>
              <p>We take the security of your data seriously and use commercially acceptable means to protect it. However, no method of transmission over the Internet or electronic storage is 100% secure.</p>
              
              <h2 className="text-xl sm:text-2xl font-bold mt-10 mb-4">4. Third-Party Services</h2>
              <p>Our website may link to external sites that are not operated by us. Please be aware that we have no control over the content and practices of these sites, and cannot accept responsibility or liability for their respective privacy policies.</p>

              <h2 className="text-xl sm:text-2xl font-bold mt-10 mb-4">5. Your Rights</h2>
              <p>You have the right to access, update, or delete your personal information. If you have an account with us, you can manage your information through your account settings or by contacting us directly.</p>

              <p className="mt-10">This policy is effective as of the current date. We may update our privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
