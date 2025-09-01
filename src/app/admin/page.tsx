
"use client";

import dynamic from 'next/dynamic';
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/AuthContext";
import { AdminLoginForm } from "@/components/admin-login-form";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Dynamically import heavy components
const AdGenerator = dynamic(() => import('@/components/ad-generator').then(mod => mod.AdGenerator), { 
    loading: () => <Skeleton className="w-full h-96" />,
    ssr: false 
});
const ManageOffers = dynamic(() => import('@/components/manage-offers').then(mod => mod.ManageOffers), { 
    loading: () => <Skeleton className="w-full h-96" />,
    ssr: false 
});
const StoryCreator = dynamic(() => import('@/components/story-creator').then(mod => mod.StoryCreator), { 
    loading: () => <Skeleton className="w-full h-96" />,
    ssr: false 
});
const ManageStories = dynamic(() => import('@/components/manage-stories').then(mod => mod.ManageStories), { 
    loading: () => <Skeleton className="w-full h-96" />,
    ssr: false 
});
const AnalyticsDashboard = dynamic(() => import('@/components/analytics-dashboard').then(mod => mod.AnalyticsDashboard), { 
    loading: () => <Skeleton className="w-full h-96" />,
    ssr: false 
});
const OnboardingLobby = dynamic(() => import('@/components/onboarding-lobby').then(mod => mod.OnboardingLobby), { 
    loading: () => <Skeleton className="w-full h-96" />,
    ssr: false 
});


export default function AdminPage() {
    const { isAdmin, loading, user } = useAuth();

    if (loading) {
        return (
             <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 bg-background/50 flex items-center justify-center">
                    <div className="container mx-auto px-4 md:px-6 py-12 text-center">
                        <Skeleton className="h-10 w-1/3 mx-auto" />
                        <Skeleton className="h-6 w-1/2 mx-auto mt-4" />
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    if (!isAdmin) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 bg-background/50 flex items-center justify-center p-4">
                   <div className="text-center max-w-md w-full">
                     <h1 className="text-2xl font-bold mb-2">Admin Access</h1>
                     <p className="text-muted-foreground mb-6">This area is for administrators only. Please sign in to continue.</p>
                     
                     {/* Show Admin Login Form if no user is signed in, or if the signed-in user is not an admin */}
                     {!user || !isAdmin ? (
                        <AdminLoginForm />
                     ) : (
                        <Link href="/">
                            <Button>Go to Homepage</Button>
                        </Link>
                     )}
                   </div>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 bg-background/50">
                 <div className="container mx-auto px-4 md:px-6 py-12">
                     <Tabs defaultValue="post-ad" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 max-w-4xl mx-auto text-xs sm:text-sm">
                            <TabsTrigger value="analytics">Analytics</TabsTrigger>
                            <TabsTrigger value="post-ad">Post Ad</TabsTrigger>
                            <TabsTrigger value="manage-ads">Manage Ads</TabsTrigger>
                            <TabsTrigger value="post-story">Post Story</TabsTrigger>
                            <TabsTrigger value="manage-stories">Manage Stories</TabsTrigger>
                            <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
                        </TabsList>
                        <TabsContent value="analytics">
                            <section className="py-12 sm:py-16">
                                <AnalyticsDashboard />
                            </section>
                        </TabsContent>
                        <TabsContent value="post-ad">
                            <section className="py-12 sm:py-16">
                                <AdGenerator />
                            </section>
                        </TabsContent>
                        <TabsContent value="manage-ads">
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
                        <TabsContent value="onboarding">
                            <section className="py-12 sm:py-16">
                                <OnboardingLobby />
                            </section>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
            <Footer />
        </div>
    );
}
