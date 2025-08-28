
"use client";

import { useState } from "react";
import { useOffers, type Offer } from "@/contexts/OffersContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StoryUploader } from "./story-uploader";
import { Skeleton } from "./ui/skeleton";
import { Clapperboard } from "lucide-react";

export function StoryCreator() {
  const { offers, loading } = useOffers();
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);

  const handleOfferSelect = (offerId: string) => {
    setSelectedOfferId(offerId);
  };

  const selectedOffer = offers.find(o => o.id === selectedOfferId);

  return (
    <div className="max-w-xl mx-auto">
       <div className="text-center mb-12">
        <h2 className="text-3xl font-headline font-bold">Post a New Story</h2>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
          Select a business to post a story for. Stories are visible for 24 hours.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clapperboard />
            Story Uploader
          </CardTitle>
          <CardDescription>
            {selectedOfferId ? `Uploading story for "${selectedOffer?.title}"` : "First, select an offer to associate the story with."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <div>
              <label htmlFor="offer-select" className="text-sm font-medium mb-2 block">
                Select a Business / Offer
              </label>
              <Select onValueChange={handleOfferSelect} value={selectedOfferId ?? ""}>
                <SelectTrigger id="offer-select">
                  <SelectValue placeholder="Choose an offer..." />
                </SelectTrigger>
                <SelectContent>
                  {offers.filter(o => !o.isHidden).map(offer => (
                    <SelectItem key={offer.id} value={offer.id}>
                      {offer.title} ({offer.business})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {selectedOffer && (
            <div className="border-t pt-6">
              <StoryUploader 
                offer={selectedOffer} 
                onFinished={() => setSelectedOfferId(null)} 
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
