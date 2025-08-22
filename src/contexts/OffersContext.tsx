
"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

export interface Offer {
  id: string;
  title: string;
  description: string;
  business: string;
  category: string;
  location: string;
  image: string;
  otherImages?: string[];
  hint: string;
  discount: string;
  tags: string[];
  allowCall: boolean;
  allowChat: boolean;
  allowSchedule: boolean;
  phoneNumber?: string;
  chatLink?: string;
  scheduleLink?: string;
}

interface OffersContextType {
  offers: Offer[];
  addOffer: (offer: Omit<Offer, 'id'>) => void;
  getOfferById: (id: string) => Offer | undefined;
  updateOffer: (id: string, updatedOffer: Omit<Offer, 'id'>) => void;
  deleteOffer: (id: string) => void;
  boostOffer: (id: string) => void;
}

const initialOffers: Offer[] = [
    {
      id: "bella-italia-50-off-on-italian-cu",
      title: "50% Off on Italian Cuisine",
      description: "Enjoy a taste of Italy with a 50% discount on our entire menu. Valid for dine-in only. We use the freshest ingredients to bring you authentic flavors that will transport you to the heart of Italy. Our cozy ambiance and friendly staff make for a perfect dining experience.",
      business: "Bella Italia",
      category: "Food & Restaurants",
      location: "Tirupati Urban",
      image: "https://placehold.co/600x400.png",
      otherImages: [
        "https://placehold.co/200x200.png",
        "https://placehold.co/200x200.png",
        "https://placehold.co/200x200.png",
        "https://placehold.co/200x200.png",
      ],
      hint: "restaurant food",
      discount: "50% OFF",
      tags: ["Today's Offer", "Discounts"],
      allowCall: true,
      allowChat: true,
      allowSchedule: false,
      phoneNumber: "9380002829",
      chatLink: "wa.me/919380002829",
    },
    {
      id: "chic-boutique-summer-collection-sal",
      title: "Summer Collection Sale",
      description: "Get ready for summer with 30% off our new collection. Featuring vibrant colors and breezy fabrics, perfect for the sunny days ahead. Our collection includes dresses, tops, skirts, and accessories to complete your summer look. Limited stock available.",
      business: "Chic Boutique",
      category: "Textile & Garments",
      location: "Vellore",
      image: "https://placehold.co/600x400.png",
       otherImages: [
        "https://placehold.co/200x200.png",
        "https://placehold.co/200x200.png",
        "https://placehold.co/200x200.png",
      ],
      hint: "fashion clothing",
      discount: "30% OFF",
      tags: ["Sale", "Just Listed"],
      allowCall: true,
      allowChat: false,
      allowSchedule: true,
      phoneNumber: "9380002829",
      scheduleLink: "https://calendly.com/dandurajkumarworld24",
    },
    {
      id: "serenity-spa-relaxing-spa-day-pack",
      title: "Relaxing Spa Day Package",
      description: "Two can relax for the price of one. Book our couple's massage and get a complimentary facial. Escape the stress of daily life and indulge in a day of pampering. Our expert therapists will ensure you leave feeling refreshed and rejuvenated.",
      business: "Serenity Spa",
      category: "Health & Wellness",
      location: "Chittoor",
      image: "https://placehold.co/600x400.png",
      hint: "spa wellness",
      discount: "2-for-1",
      tags: ["Discounts"],
      allowCall: true,
      allowChat: true,
      allowSchedule: true,
      phoneNumber: "9380002829",
      chatLink: "wa.me/919380002829",
      scheduleLink: "https://calendly.com/dandurajkumarworld24",
    },
    {
      id: "speedy-rentals-weekend-car-rental-d",
      title: "Weekend Car Rental Deal",
      description: "Rent any car for the weekend for just ₹3999 per day. Includes unlimited mileage. Choose from our wide range of vehicles, from compact cars to SUVs. Perfect for a weekend getaway or running errands around town.",
      business: "Speedy Rentals",
      category: "Automobiles",
      location: "Tirupati Rural",
      image: "https://placehold.co/600x400.png",
      hint: "car rental",
      discount: "₹3999/day",
      tags: ["Just Listed"],
      allowCall: true,
      allowChat: false,
      allowSchedule: false,
      phoneNumber: "9380002829",
    },
    {
      id: "sparkle-clean-home-cleaning-servic",
      title: "Home Cleaning Services",
      description: "Get your home sparkling clean with 20% off our deep cleaning services. Offer valid for a limited time. Our professional team uses eco-friendly products to ensure a safe and thorough clean for your home.",
      business: "Sparkle Clean",
      category: "Home & Local Services",
      location: "Puttur",
      image: "https://placehold.co/600x400.png",
      hint: "home service",
      discount: "20% OFF",
      tags: ["Today's Offer"],
      allowCall: true,
      allowChat: true,
      allowSchedule: true,
      phoneNumber: "9380002829",
      chatLink: "wa.me/919380002829",
      scheduleLink: "https://calendly.com/dandurajkumarworld24",
    }
  ];

const OffersContext = createContext<OffersContextType | undefined>(undefined);

export function OffersProvider({ children }: { children: ReactNode }) {
  const [offers, setOffers] = useState<Offer[]>(initialOffers);

  const addOffer = (offer: Omit<Offer, 'id'>) => {
    const newOffer: Offer = {
      ...offer,
      id: `${offer.business.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0,15)}-${offer.title.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0,20)}`
    };
    setOffers(prevOffers => [newOffer, ...prevOffers]);
  };

  const updateOffer = (id: string, updatedOfferData: Omit<Offer, 'id'>) => {
    setOffers(prevOffers =>
      prevOffers.map(offer =>
        offer.id === id ? { ...offer, ...updatedOfferData, id } : offer
      )
    );
  };
  
  const deleteOffer = (id: string) => {
    setOffers(prevOffers => prevOffers.filter(offer => offer.id !== id));
  };
  
  const boostOffer = (id: string) => {
    setOffers(prevOffers => {
      const offerToBoost = prevOffers.find(offer => offer.id === id);
      if (!offerToBoost) return prevOffers;
      const otherOffers = prevOffers.filter(offer => offer.id !== id);
      return [offerToBoost, ...otherOffers];
    });
  };

  const getOfferById = (id: string) => {
    return offers.find(offer => offer.id === id);
  };

  return (
    <OffersContext.Provider value={{ offers, addOffer, getOfferById, updateOffer, deleteOffer, boostOffer }}>
      {children}
    </OffersContext.Provider>
  );
}

export function useOffers() {
  const context = useContext(OffersContext);
  if (context === undefined) {
    throw new Error('useOffers must be used within an OffersProvider');
  }
  return context;
}
