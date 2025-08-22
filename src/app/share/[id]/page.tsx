
"use client";

import { useParams } from 'next/navigation';
import { useOffers } from '@/contexts/OffersContext';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ShareOfferPage() {
    const params = useParams();
    const { getOfferById } = useOffers();
    const [offer, setOffer] = useState(getOfferById(params.id as string));

    useEffect(() => {
        setOffer(getOfferById(params.id as string));
    }, [params.id, getOfferById]);

    if (!offer) {
        return (
             <div id="share-card" className="w-[380px] h-[285px] p-4 bg-white flex items-center justify-center">
                <Skeleton className="w-full h-full" />
             </div>
        );
    }

    // This page is meant to be rendered in an iframe for image capture.
    // The layout should be fixed and not responsive.
    return (
        <div id="share-card" className="w-[380px] h-[285px] p-0 bg-white font-sans overflow-hidden">
            <div className="relative w-full h-[180px]">
                <Image
                    src={offer.image}
                    alt={offer.title}
                    fill
                    className="object-cover"
                    data-ai-hint={offer.hint}
                    sizes="380px"
                />
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
                    <h3 className="text-lg font-bold text-white truncate">{offer.title}</h3>
                    <p className="text-sm text-gray-200">{offer.business}</p>
                </div>
                <Badge variant="default" className="absolute top-2 right-2 bg-accent text-accent-foreground font-bold py-1 px-3">
                    {offer.discount}
                </Badge>
            </div>
            <div className="p-3">
                <div className="flex items-center text-sm text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{offer.location}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                    {offer.tags?.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                    ))}
                </div>
                 <p className="text-xs text-gray-400 mt-3 truncate">{offer.description}</p>
            </div>
        </div>
    );
}

