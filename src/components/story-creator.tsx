
"use client";

import { useState } from "react";
import { useOffers, type Offer } from "@/contexts/OffersContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select";
import { StoryUploader } from "./story-uploader";
import { Skeleton } from "./ui/skeleton";
import { Clapperboard } from "lucide-react";
import { locations } from "@/lib/locations";

export function StoryCreator() {
  const { offers, loading } = useOffers();
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    setSelectedOfferId(null); // Reset offer selection when location changes
  };
  
  const handleOfferSelect = (offerId: string) => {
    setSelectedOfferId(offerId);
  };

  const availableLocations = Array.from(new Set(offers.map(o => o.location)));

  const filteredOffers = selectedLocation
    ? offers.filter(o => o.location === selectedLocation && !o.isHidden)
    : [];

  const selectedOffer = offers.find(o => o.id === selectedOfferId);

  return (
    <div className="max-w-xl mx-auto">
       <div className="text-center mb-12">
        <h2 className="text-3xl font-headline font-bold">Post a New Story</h2>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
          Select a location, then a business, to post a story for. Stories are visible for 24 hours.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clapperboard />
            Story Uploader
          </CardTitle>
          <CardDescription>
            {selectedOfferId ? `Uploading story for "${selectedOffer?.title}"` : "First, select a location and then an offer."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <div className="space-y-4">
                <div>
                  <label htmlFor="location-select" className="text-sm font-medium mb-2 block">
                    1. Select a Location
                  </label>
                  <Select onValueChange={handleLocationSelect} value={selectedLocation ?? ""}>
                    <SelectTrigger id="location-select">
                      <SelectValue placeholder="Choose a location..." />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) =>
                        location.subLocations ? (
                        <SelectGroup key={location.name}>
                            <SelectLabel>{location.name}</SelectLabel>
                            {location.subLocations.map((sub) => (
                              availableLocations.includes(sub) &&
                              <SelectItem key={`${location.name}-${sub}`} value={sub}>
                                  {sub}
                              </SelectItem>
                            ))}
                        </SelectGroup>
                        ) : (
                          availableLocations.includes(location.name) &&
                          <SelectItem key={location.name} value={location.name}>
                              {location.name}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedLocation && (
                  <div>
                    <label htmlFor="offer-select" className="text-sm font-medium mb-2 block">
                      2. Select a Business / Offer
                    </label>
                    <Select onValueChange={handleOfferSelect} value={selectedOfferId ?? ""} disabled={filteredOffers.length === 0}>
                      <SelectTrigger id="offer-select">
                        <SelectValue placeholder={filteredOffers.length > 0 ? "Choose an offer..." : "No offers in this location"} />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredOffers.map(offer => (
                          <SelectItem key={offer.id} value={offer.id}>
                            {offer.title} ({offer.business})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
            </div>
          )}

          {selectedOffer && (
            <div className="border-t pt-6">
              <StoryUploader 
                offer={selectedOffer} 
                onFinished={() => {
                  setSelectedOfferId(null);
                  setSelectedLocation(null);
                }} 
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
