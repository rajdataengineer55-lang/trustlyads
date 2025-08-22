
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
import { LogIn, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminPage() {
    const { user, loading, signInWithGoogle } = useAuth();
    const router = useRouter();

    const authorizedAdminEmail = "dandurajkumarworld24@gmail.com";

    // 1. Show a loading state while we check for the user
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
    
    // 2. If the user is not the admin, show the specific admin login prompt
    if (!user || user.email !== authorizedAdminEmail) {
         return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 bg-background/50 flex flex-col items-center justify-center text-center p-4">
                    <Card className="max-w-md w-full">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-center gap-2">
                                <ShieldAlert className="h-6 w-6" /> Admin Access Required
                            </CardTitle>
                            <CardDescription>
                                Please sign in with the authorized admin Google account to continue.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {user && user.email !== authorizedAdminEmail && (
                                <p className="text-sm text-destructive">
                                    Account <span className="font-medium">{user.email}</span> is not authorized.
                                </p>
                            )}
                            <Button onClick={signInWithGoogle} className="w-full">
                                <LogIn className="mr-2 h-4 w-4" />
                                Sign in with Google
                            </Button>
                             <Button variant="outline" asChild className="w-full">
                                <Link href="/">Go to Homepage</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </main>
                <Footer />
            </div>
        );
    }

    // 3. If all checks pass, render the admin dashboard
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
