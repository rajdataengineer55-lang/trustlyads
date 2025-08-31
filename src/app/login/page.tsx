
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PhoneLoginForm } from "@/components/phone-login-form";

const GoogleIcon = () => (
    <svg className="mr-2 h-4 w-4" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
      <path
        fill="currentColor"
        d="M488 261.8C488 403.3 381.5 512 244 512 109.8 512 0 402.2 0 261.8 0 120.3 109.8 8.5 244 8.5c71.2 0 126.6 27.8 172.9 69.6l-65.7 64.2c-20.4-19.1-46.3-38.5-107.2-38.5-83.8 0-151.8 68.1-151.8 152.4s68 152.4 151.8 152.4c97.2 0 130.3-72.8 134.5-110.1H244V261.8h244z"
      ></path>
    </svg>
);


export default function LoginPage() {
    const { user, loading, signInWithGoogle } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            router.push('/');
        }
    }, [user, loading, router]);
    
    if (loading || user) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <p>Loading...</p>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 bg-background/50 flex items-center justify-center p-4">
                <Card className="w-full max-w-sm">
                    <CardHeader className="text-center">
                        <CardTitle>Sign In</CardTitle>
                        <CardDescription>Choose an option to continue</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <PhoneLoginForm />
                        <div className="relative">
                            <Separator />
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t"></span>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                            </div>
                        </div>
                        <Button variant="outline" className="w-full" onClick={signInWithGoogle}>
                           <GoogleIcon />
                           Sign In with Google
                        </Button>
                    </CardContent>
                </Card>
            </main>
            <Footer />
        </div>
    );
}
