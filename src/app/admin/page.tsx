

"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdGenerator } from "@/components/ad-generator";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { ManageOffers } from "@/components/manage-offers";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminPage() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for login status from localStorage
        if (typeof window !== 'undefined') {
            const loggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
            if (!loggedIn) {
                router.replace('/login');
            } else {
                setIsLoggedIn(true);
            }
            setIsLoading(false);
        }
    }, [router]);

    if (isLoading) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 bg-gray-50 dark:bg-gray-900/50 py-16">
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
    
    if (!isLoggedIn) {
        // This will be shown briefly before the redirect happens.
        // Or if the redirect somehow fails.
        return null; 
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 bg-gray-50 dark:bg-gray-900/50">
                <AdGenerator />
                <Separator className="my-12" />
                <ManageOffers />
            </main>
            <Footer />
        </div>
    );
}
