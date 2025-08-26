
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { type Offer } from "@/contexts/OffersContext";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Progress } from "./ui/progress";
import Link from "next/link";
import { Button } from "./ui/button";

interface StoryViewerProps {
  offer: Offer;
  onClose: () => void;
}

const STORY_DURATION = 5000; // 5 seconds per story

export function StoryViewer({ offer, onClose }: StoryViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const stories = offer.stories || [];
  const currentStory = stories[currentIndex];

  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, stories.length - 1));
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  useEffect(() => {
    if (currentIndex >= stories.length) {
      onClose();
      return;
    }

    setProgress(0);
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + (100 / (STORY_DURATION / 100));
      });
    }, 100);

    const autoAdvance = setTimeout(() => {
      if (currentIndex < stories.length - 1) {
        goToNext();
      } else {
        onClose();
      }
    }, STORY_DURATION);

    return () => {
      clearInterval(timer);
      clearTimeout(autoAdvance);
    };
  }, [currentIndex, stories.length, onClose]);
  
  if (!currentStory) return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center animate-in fade-in-0" onClick={onClose}>
      <div className="relative w-full max-w-[400px] aspect-[9/16] bg-black rounded-lg overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Story Media */}
        {currentStory.mediaType === 'image' ? (
          <Image
            src={currentStory.mediaUrl}
            alt={`Story for ${offer.business}`}
            fill
            className="object-cover"
          />
        ) : (
          <video
            src={currentStory.mediaUrl}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
            onEnded={goToNext}
          />
        )}
        
        {/* Overlay with Header and Controls */}
        <div className="absolute inset-0 flex flex-col">
          {/* Progress Bars */}
          <div className="flex gap-1 p-2">
            {stories.map((_, index) => (
              <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-white" 
                    style={{ width: `${index < currentIndex ? 100 : (index === currentIndex ? progress : 0)}%`}}
                />
              </div>
            ))}
          </div>

          {/* Header */}
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center gap-2">
                <Avatar className="h-10 w-10 border-2 border-white">
                    <AvatarImage src={offer.image} alt={offer.business} />
                    <AvatarFallback>{offer.business.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-white font-bold text-sm">{offer.business}</span>
            </div>
            <button onClick={onClose} className="text-white">
              <X className="h-6 w-6" />
            </button>
          </div>

           {/* Clickable areas for navigation */}
          <div className="flex-grow flex">
            <div className="w-1/3 h-full" onClick={goToPrevious} />
            <div className="w-1/3 h-full" />
            <div className="w-1/3 h-full" onClick={goToNext} />
          </div>

           {/* View Offer Button */}
          <div className="p-4 text-center">
            <Link href={`/offer/${offer.id}`} passHref>
                <Button variant="secondary" className="w-full backdrop-blur-sm bg-white/80">View Offer Details</Button>
            </Link>
          </div>
        </div>

        {/* Prev/Next Buttons for Desktop */}
        {currentIndex > 0 && (
          <button
            onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 rounded-full p-2 text-white hidden md:block"
          >
            <ChevronLeft />
          </button>
        )}
        {currentIndex < stories.length - 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); goToNext(); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 rounded-full p-2 text-white hidden md:block"
          >
            <ChevronRight />
          </button>
        )}
      </div>
    </div>
  );
}
