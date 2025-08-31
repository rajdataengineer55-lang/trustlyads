
"use client";

import { AdGenerator } from "@/components/ad-generator";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { ManageOffers } from "@/components/manage-offers";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StoryCreator } from "@/components/story-creator";
import { ManageStories } from "@/components/manage-stories";
import { useAuth } from "@/contexts/AuthContext";
import { AdminLoginForm } from "@/components/admin-login-form";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
                   <div className="text-center max-w-md">
                     <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
                     <p className="text-muted-foreground mb-6">You do not have permission to view this page. This area is for administrators only.</p>
                     {user ? (
                        <Link href="/">
                            <Button>Go to Homepage</Button>
                        </Link>
                     ) : (
                        <Link href="/login">
                           <Button>Sign In</Button>
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
                        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 max-w-2xl mx-auto text-xs sm:text-sm">
                            <TabsTrigger value="post-ad">Post Ad</TabsTrigger>
                            <TabsTrigger value="manage-ads">Manage Ads</TabsTrigger>
                            <TabsTrigger value="post-story">Post Story</TabsTrigger>
                            <TabsTrigger value="manage-stories">Manage Stories</TabsTrigger>
                        </TabsList>
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
                    </Tabs>
                </div>
            </main>
            <Footer />
        </div>
    );
}
