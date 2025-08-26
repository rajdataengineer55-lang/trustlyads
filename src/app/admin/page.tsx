
"use client";

import { useEffect, useState } from 'react';
import { AdGenerator } from "@/components/ad-generator";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { ManageOffers } from "@/components/manage-offers";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminLoginForm } from '@/components/admin-login-form';

export default function AdminPage() {
    const { user, loading, signOut } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);
    
    // We add a new state to specifically track if we have checked the admin claim.
    // This prevents showing the "Unauthorized" message prematurely.
    const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);

    useEffect(() => {
        // This effect runs whenever the user or loading state changes.
        // It's simpler and more reliable than the previous implementation.
        const checkAdminStatus = async () => {
            if (loading) {
                // If auth state is loading, we are definitely still checking.
                setIsCheckingAdmin(true);
                return;
            }

            if (user) {
                // If we have a user, get their token and check for the admin claim.
                try {
                    const idTokenResult = await user.getIdTokenResult();
                    const isAdminClaim = !!idTokenResult.claims.admin;
                    setIsAdmin(isAdminClaim);
                } catch (error) {
                    console.error("Error checking admin status:", error);
                    setIsAdmin(false);
                }
            } else {
                // No user, so they can't be an admin.
                setIsAdmin(false);
            }
            // Once we have checked, we update the state.
            setIsCheckingAdmin(false);
        };

        checkAdminStatus();
    }, [user, loading]);

    // 1. Show a loading skeleton while either the user is loading OR we are checking the admin claim.
    if (loading || isCheckingAdmin) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 bg-background/50 py-16">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="text-center mb-12">
                          <Skeleton className="h-10 w-1/2 mx-auto" />
                          <Skeleton className="h-6 w-3/4 mx-auto mt-4" />
                        </div>
                        <div className="max-w-3xl mx-auto">
                           <Skeleton className="h-[600px] w-full" />
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }
    
    // 2. If NO user is logged in after loading, show the login form.
    if (!user) {
         return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 bg-background/50 flex flex-col items-center justify-center text-center p-4">
                    <Card className="max-w-md w-full">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-center gap-2">
                                <ShieldAlert className="h-6 w-6" /> Admin Login
                            </CardTitle>
                            <CardDescription>
                                Please sign in to manage the website.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                           <AdminLoginForm />
                        </CardContent>
                    </Card>
                </main>
                <Footer />
            </div>
        );
    }

    // 3. If a user IS logged in, but is NOT an admin, show the unauthorized access message.
    if (!isAdmin) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 bg-background/50 flex flex-col items-center justify-center text-center p-4">
                    <Card className="max-w-md w-full">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-center gap-2">
                                <ShieldAlert className="h-6 w-6" /> Unauthorized Access
                            </CardTitle>
                            <CardDescription>
                                This account is not authorized to view the admin page.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-destructive">
                                Signed in as <span className="font-medium">{user.email}</span>.
                            </p>
                            <Button onClick={signOut} variant="destructive" className="w-full">
                                <LogOut className="mr-2 h-4 w-4" />
                                Sign Out
                            </Button>
                             <Button variant="outline" asChild className="w-full">
                                <Link href="/">Go to Homepage</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </main>
                <Footer />
            </div>
        )
    }

    // 4. If all checks pass, render the admin dashboard.
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
