import { LoginForm } from "@/components/login-form";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";

export default function LoginPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 bg-gray-50 dark:bg-gray-900/50 flex items-center justify-center">
                <LoginForm />
            </main>
            <Footer />
        </div>
    );
}
