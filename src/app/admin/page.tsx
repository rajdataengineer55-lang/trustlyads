
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
import { AdminLoginForm } from '@/admin-login-form';

export default function AdminPage() {
    const { user, loading, signOut } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);
    
    // This state tracks if we are waiting for the admin claim check to complete.
    // It is separate from the main `loading` state.
    const [isCheckingClaim, setIsCheckingClaim] = useState(true);

    useEffect(() => {
        const checkAdminStatus = async () => {
            // We don't proceed until the main auth state is no longer loading.
            if (loading) {
                return;
            }

            // If there's a user, we check their claims.
            if (user) {
                try {
                    const idTokenResult = await user.getIdTokenResult(true); // Force refresh
                    const isAdminClaim = !!idTokenResult.claims.admin;
                    setIsAdmin(isAdminClaim);
                } catch (error) {
                    console.error("Error checking admin status:", error);
                    setIsAdmin(false);
                }
            } else {
                // If there's no user, they are definitely not an admin.
                setIsAdmin(false);
            }
            
            // Once the check is done (or not needed), we are no longer checking.
            setIsCheckingClaim(false);
        };

        checkAdminStatus();
    }, [user, loading]);

    // Show a loading skeleton if the auth state is loading OR if we are still verifying the admin claim.
    if (loading || isCheckingClaim) {
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
    
    // After loading, if there's no user, show the login form.
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

    // If a user is logged in but is not an admin, show the unauthorized message.
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
                                This account is not authorized to view the admin page. reason
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

    // If all checks pass, render the admin dashboard.
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
