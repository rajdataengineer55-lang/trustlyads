
"use client";

import { AdGenerator } from "@/components/ad-generator";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { ManageOffers } from "@/components/manage-offers";
import { StoryGenerator } from "@/components/story-generator";
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminLoginForm } from '@/components/admin-login-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminPage() {
    const { user, loading, signOut, isAdmin } = useAuth();
    
    // Show a loading skeleton if the auth state is still loading.
    if (loading) {
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
    
    // After loading, if there's no user, or the user is not an admin, show the login form or an error.
    if (!user || !isAdmin) {
         return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 bg-background/50 flex flex-col items-center justify-center text-center p-4">
                     {user && !isAdmin ? (
                         <Card className="max-w-md w-full">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-center gap-2">
                                    <ShieldAlert className="h-6 w-6" /> Unauthorized Access
                                </CardTitle>
                                <CardDescription>
                                    This account does not have admin privileges. Please sign in with an admin account.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-sm text-destructive">
                                    Signed in as {user.email}.
                                </p>
                                <div className="flex justify-center items-center gap-4">
                                    <Button variant="outline" onClick={signOut}>
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Sign Out & Switch
                                    </Button>
                                    <Link href="/" passHref>
                                        <Button>
                                            Go to Homepage
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                     ) : (
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
                     )}
                </main>
                <Footer />
            </div>
        );
    }

    // If all checks pass, render the admin dashboard.
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 bg-background/50">
                 <div className="container mx-auto px-4 md:px-6 py-12">
                     <Tabs defaultValue="post-offer" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto">
                            <TabsTrigger value="post-offer">Post Offer</TabsTrigger>
                            <TabsTrigger value="manage-offers">Manage Offers</TabsTrigger>
                            <TabsTrigger value="post-story">Post Story</TabsTrigger>
                        </TabsList>
                        <TabsContent value="post-offer">
                            <section className="py-12 sm:py-16">
                                <AdGenerator />
                            </section>
                        </TabsContent>
                        <TabsContent value="manage-offers">
                            <section className="py-12 sm:py-16">
                                <ManageOffers />
                            </section>
                        </TabsContent>
                        <TabsContent value="post-story">
                             <section className="py-12 sm:py-16">
                                <StoryGenerator />
                            </section>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
            <Footer />
        </div>
    );
}
