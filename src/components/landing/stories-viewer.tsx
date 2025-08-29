
"use client"

import { useState, useEffect } from "react";
import Image from "next/image";
import { getActiveStories, incrementStoryView, type Story } from "@/lib/stories";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { X, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export function StoriesViewer() {
  const [storiesByOffer, setStoriesByOffer] = useState<Map<string, Story[]>>(new Map());
  const [loading, setLoading] = useState(true);
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [viewedStories, setViewedStories] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function fetchStories() {
      setLoading(true);
      const activeStories = await getActiveStories();
      const groupedStories = new Map<string, Story[]>();
      activeStories.forEach(story => {
        const stories = groupedStories.get(story.offerId) || [];
        stories.push(story);
        groupedStories.set(story.offerId, stories);
      });
      setStoriesByOffer(groupedStories);
      setLoading(false);
    }
    fetchStories();
  }, []);

  const openStory = (offerId: string) => {
    setSelectedOfferId(offerId);
    setCurrentStoryIndex(0);
  };

  const closeStory = () => {
    setSelectedOfferId(null);
  };
  
  const selectedStories = selectedOfferId ? storiesByOffer.get(selectedOfferId) : null;
  const currentStory = selectedStories?.[currentStoryIndex];

  useEffect(() => {
    if (currentStory && !viewedStories.has(currentStory.id)) {
      incrementStoryView(currentStory.id);
      setViewedStories(prev => new Set(prev).add(currentStory.id));
    }
  }, [currentStory, viewedStories]);


  const goToNextStory = () => {
    if (!selectedStories) return;
    if (currentStoryIndex < selectedStories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    } else {
      closeStory();
    }
  };

  const goToPreviousStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
    }
  };

  useEffect(() => {
    if (currentStory?.mediaType === 'image') {
      const timer = setTimeout(goToNextStory, 5000); // 5 seconds for images
      return () => clearTimeout(timer);
    }
  }, [currentStory, currentStoryIndex]);

  if (loading) {
    return (
      <section className="py-8 bg-background/50 border-b">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex gap-4 overflow-x-auto pb-4 -mb-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2 flex-shrink-0">
                <Skeleton className="h-16 w-16 rounded-full" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (storiesByOffer.size === 0) {
    return null; // Don't render anything if there are no stories
  }

  return (
    <>
      <section className="py-6 bg-background/50 border-b">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-lg">Recent Stories</h2>
            <div className="text-sm text-muted-foreground hidden sm:flex items-center gap-1">
              Swipe for more <ArrowRight className="h-4 w-4" />
            </div>
          </div>
          <div className="relative">
            <div className="flex gap-4 overflow-x-auto pb-2 -mb-2 no-scrollbar">
              {Array.from(storiesByOffer.entries()).map(([offerId, stories]) => {
                const story = stories[0];
                const businessImageUrl = story.businessImage || 'https://placehold.co/60x60.png';
                
                return (
                <button key={offerId} onClick={() => openStory(offerId)} className="flex flex-col items-center gap-2 flex-shrink-0 text-center w-20 group">
                  <div className="relative h-16 w-16 rounded-full p-1 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 group-hover:scale-105 transition-transform duration-200">
                    <div className="bg-background rounded-full h-full w-full p-0.5">
                      <Image
                        src={businessImageUrl}
                        alt={story.businessName}
                        width={60}
                        height={60}
                        className="rounded-full object-cover w-full h-full"
                      />
                    </div>
                  </div>
                  <p className="text-xs font-medium truncate w-full">{story.businessName}</p>
                </button>
              )})}
            </div>
            <div className="absolute top-0 right-0 bottom-4 w-16 bg-gradient-to-l from-background to-transparent pointer-events-none" />
          </div>
        </div>
      </section>

      <Dialog open={!!selectedOfferId} onOpenChange={(isOpen) => !isOpen && closeStory()}>
        <DialogContent className="p-0 bg-black border-0 max-w-md w-full h-full sm:h-[90vh] sm:max-h-[640px] flex flex-col gap-0 rounded-none sm:rounded-lg">
           <DialogTitle className="sr-only">Story Viewer: {currentStory?.businessName}</DialogTitle>
           <DialogDescription className="sr-only">
              A story from {currentStory?.businessName}. Use the sides of the screen to navigate between story slides.
           </DialogDescription>
          {currentStory && (
            <div className="relative w-full h-full flex flex-col">
              <div className="absolute top-2 left-0 right-0 px-2 flex items-center gap-1 z-10">
                {selectedStories?.map((_, index) => (
                  <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                    {index < currentStoryIndex && <div className="h-full bg-white w-full" />}
                    {index === currentStoryIndex && currentStory.mediaType === 'image' && <Progress value={100} className="h-1 bg-white animate-story-progress" />}
                  </div>
                ))}
              </div>

              <div className="absolute top-5 left-4 z-20 flex items-center gap-3">
                 <Image src={currentStory.businessImage || 'https://placehold.co/32x32.png'} alt={currentStory.businessName} width={32} height={32} className="rounded-full object-cover" />
                 <Link href={`/offer/${currentStory.offerId}`} onClick={closeStory}>
                   <p className="text-white text-sm font-bold hover:underline">{currentStory.businessName}</p>
                 </Link>
              </div>

              <Button variant="ghost" size="icon" onClick={closeStory} className="absolute top-4 right-2 z-20 text-white hover:bg-white/20 hover:text-white">
                <X className="h-6 w-6" />
              </Button>

              <div className="flex-1 relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
                {currentStory.mediaType === 'video' ? (
                  <video
                    src={currentStory.mediaUrl}
                    className="w-full h-full object-contain"
                    autoPlay
                    onEnded={goToNextStory}
                    playsInline
                  />
                ) : (
                  <Image
                    src={currentStory.mediaUrl || 'https://placehold.co/1080x1920.png'}
                    alt="Story Content"
                    fill
                    className="object-contain"
                    priority
                  />
                )}
              </div>
              
              <div className="absolute inset-0 flex justify-between items-center z-10">
                  <button onClick={goToPreviousStory} className="h-full w-1/2" aria-label="Previous Story"/>
                  <button onClick={goToNextStory} className="h-full w-1/2" aria-label="Next Story"/>
              </div>

              <div className="absolute inset-y-0 left-2 flex items-center z-20">
                <Button variant="ghost" size="icon" onClick={goToPreviousStory} className="text-white bg-black/30 hover:bg-black/50 hover:text-white rounded-full h-8 w-8">
                    <ChevronLeft/>
                </Button>
              </div>
              <div className="absolute inset-y-0 right-2 flex items-center z-20">
                <Button variant="ghost" size="icon" onClick={goToNextStory} className="text-white bg-black/30 hover:bg-black/50 hover:text-white rounded-full h-8 w-8">
                    <ChevronRight/>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
