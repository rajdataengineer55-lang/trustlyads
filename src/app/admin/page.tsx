
"use client";

import { AdGenerator } from "@/components/ad-generator";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { ManageOffers } from "@/components/manage-offers";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StoryCreator } from "@/components/story-creator";
import { ManageStories } from "@/components/manage-stories";

export default function AdminPage() {
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
