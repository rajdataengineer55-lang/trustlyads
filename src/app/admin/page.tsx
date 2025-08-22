
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdGenerator } from "@/components/ad-generator";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { ManageOffers } from "@/components/manage-offers";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
    const { user, loading, signInWithGoogle } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            // This is handled by the component logic below, but could be a redirect
            // router.replace('/'); 
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 bg-background/50 py-16">
                    <div className="container mx-auto px-4 md:px-6">
                        <Skeleton className="h-12 w-1/2 mx-auto mb-4" />
                        <Skeleton className="h-8 w-3/4 mx-auto mb-12" />
                        <div className="max-w-2xl mx-auto">
                           <Skeleton className="h-[500px] w-full" />
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }
    
    if (!user) {
         return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 bg-background/50 flex flex-col items-center justify-center text-center p-4">
                    <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
                    <p className="text-muted-foreground mb-8">You must be logged in to view the admin dashboard.</p>
                    <Button onClick={signInWithGoogle}>
                        <LogIn className="mr-2 h-4 w-4" />
                        Sign in with Google
                    </Button>
                </main>
                <Footer />
            </div>
        );
    }

    const authorizedAdminEmail = "dandurajkumarworld24@gmail.com";
    
    if (user.email !== authorizedAdminEmail) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 bg-background/50 flex flex-col items-center justify-center text-center p-4">
                    <h1 className="text-2xl font-bold mb-4">Unauthorized</h1>
                    <p className="text-muted-foreground mb-8">You are not authorized to view this page.</p>
                    <Link href="/" passHref>
                        <Button variant="outline">Go to Homepage</Button>
                    </Link>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 bg-background/50">
                <section className="py-12 sm:py-16">
                    <div className="container mx-auto px-4 md:px-6">
                        <AdGenerator />
                    </div>
                </section>
                <Separator className="my-8 sm:my-12" />
                <section className="pb-12 sm:pb-16">
                     <div className="container mx-auto px-4 md:px-6">
                        <ManageOffers />
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
