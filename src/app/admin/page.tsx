"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdGenerator } from "@/components/ad-generator";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminPage() {
    const router = useRouter();
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const isLoggedIn = localStorage.getItem('isAdminLoggedIn');
            if (isLoggedIn !== 'true') {
                router.replace('/login');
            } else {
                setIsVerified(true);
            }
        }
    }, [router]);

    if (!isVerified) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="w-full max-w-lg p-4 space-y-4">
                        <Skeleton className="h-12 w-1/2" />
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-24 w-full" />
                         <Skeleton className="h-10 w-full" />
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 bg-gray-50 dark:bg-gray-900/50">
                <AdGenerator />
            </main>
            <Footer />
        </div>
    );
}
