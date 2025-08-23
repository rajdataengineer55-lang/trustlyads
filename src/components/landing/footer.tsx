
import { Megaphone, Facebook, Twitter, Linkedin, Phone, MessageCircle, Instagram } from "lucide-react";
import Link from "next/link";

const footerLinks = [
  { name: "About", href: "/about" },
  { name: "FAQ", href: "/faq" },
  { name: "Terms of Service", href: "/terms" },
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Admin", href: "/admin" },
];

export function Footer() {
  return (
    <footer className="bg-background/50 border-t">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Megaphone className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold font-headline">LocalPulse</span>
            </Link>
            <p className="text-muted-foreground">Connecting communities, one offer at a time.</p>
          </div>
          <div className="md:col-span-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
              <div>
                <h4 className="font-headline font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  {footerLinks.map((link) => (
                    <li key={link.name}>
                      <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-headline font-semibold mb-4">Contact Us</h4>
                <ul className="space-y-2">
                    <li>
                      <a href="mailto:dandurajkumarworld24@gmail.com" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                        <MessageCircle className="h-4 w-4" /> Email
                      </a>
                    </li>
                    <li>
                      <a href="tel:+919380002829" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                        <Phone className="h-4 w-4" /> Call
                      </a>
                    </li>
                    <li>
                      <a href="https://wa.me/919380002829" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                        <MessageCircle className="h-4 w-4" /> WhatsApp
                      </a>
                    </li>
                </ul>
              </div>
              <div>
                <h4 className="font-headline font-semibold mb-4">Follow Us</h4>
                <div className="flex space-x-4">
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    <Facebook className="h-6 w-6" />
                  </Link>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    <Twitter className="h-6 w-6" />
                  </Link>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    <Linkedin className="h-6 w-6" />
                  </Link>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    <Instagram className="h-6 w-6" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} LocalPulse. All rights reserved.</p>
          <p className="mt-2">Developed by Rajkumardandu</p>
        </div>
      </div>
    </footer>
  );
}
