
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
}

const initialOffers: Offer[] = [
    {
      id: "bella-italia-50-off-on-italian-cu",
      title: "50% Off on Italian Cuisine",
      description: "Enjoy a taste of Italy with a 50% discount on our entire menu. Valid for dine-in only.",
      business: "Bella Italia",
      category: "Food & Restaurants",
      location: "Tirupati Urban",
      image: "https://placehold.co/600x400.png",
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
      description: "Get ready for summer with 30% off our new collection. Featuring vibrant colors and breezy fabrics.",
      business: "Chic Boutique",
      category: "Textile & Garments",
      location: "Vellore",
      image: "https://placehold.co/600x400.png",
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
      description: "Two can relax for the price of one. Book our couple's massage and get a complimentary facial.",
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
      description: "Rent any car for the weekend for just $50 per day. Includes unlimited mileage.",
      business: "Speedy Rentals",
      category: "Automobiles",
      location: "Tirupati Rural",
      image: "https://placehold.co/600x400.png",
      hint: "car rental",
      discount: "$50/day",
      tags: ["Just Listed"],
      allowCall: true,
      allowChat: false,
      allowSchedule: false,
      phoneNumber: "9380002829",
    },
    {
      id: "sparkle-clean-home-cleaning-servic",
      title: "Home Cleaning Services",
      description: "Get your home sparkling clean with 20% off our deep cleaning services. Offer valid for a limited time.",
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

  const getOfferById = (id: string) => {
    return offers.find(offer => offer.id === id);
  };

  return (
    <OffersContext.Provider value={{ offers, addOffer, getOfferById }}>
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
