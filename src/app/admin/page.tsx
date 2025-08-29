
"use client";

import { AdGenerator } from "@/components/ad-generator";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { ManageOffers } from "@/components/manage-offers";
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminLoginForm } from '@/components/admin-login-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StoryCreator } from "@/components/story-creator";
import { ManageStories } from "@/components/manage-stories";

export default function AdminPage() {
    const { user, loading, signOut, isAdmin } = useAuth();
    
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
    
    // If a user is logged in AND is an admin, show the dashboard.
    if (user && isAdmin) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 bg-background/50">
                     <div className="container mx-auto px-4 md:px-6 py-12">
                         <Tabs defaultValue="post-offer" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 max-w-2xl mx-auto text-xs sm:text-sm">
                                <TabsTrigger value="post-offer">Post Offer</TabsTrigger>
                                <TabsTrigger value="manage-offers">Manage Offers</TabsTrigger>
                                <TabsTrigger value="post-story">Post Story</TabsTrigger>
                                <TabsTrigger value="manage-stories">Manage Stories</TabsTrigger>
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
                                    <StoryCreator />
                                </section>
                            </TabsContent>
                             <TabsContent value="manage-stories">
                                <section className="py-12 sm:py-16">
                                    <ManageStories />
                                </section>
                            </TabsContent>
                        </Tabs>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // This section now handles both logged-out users AND logged-in non-admin users.
    // It will show the login form for both, but display an extra "Unauthorized" message
    // if a non-admin user is currently signed in.
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
                       {/* This block shows an error if a NON-admin user is logged in */}
                       {user && !isAdmin && (
                            <div className="mb-4 bg-destructive/10 p-3 rounded-md border border-destructive/50">
                                <p className="text-sm text-destructive font-semibold">
                                    Unauthorized Access
                                </p>
                                <p className="text-xs text-destructive/80 mt-1">
                                    The account <span className="font-medium">{user.email}</span> does not have admin privileges.
                                </p>
                                <Button variant="link" className="h-auto p-0 mt-2 text-destructive/80 text-xs" onClick={signOut}>
                                    Sign Out & Try Again
                                </Button>
                            </div>
                       )}
                       <AdminLoginForm />
                    </CardContent>
                </Card>
            </main>
            <Footer />
        </div>
    );
}
