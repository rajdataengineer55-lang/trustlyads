"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

export interface Offer {
  title: string;
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
  addOffer: (offer: Offer) => void;
}

const initialOffers: Offer[] = [
    {
      title: "50% Off on Italian Cuisine",
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
    },
    {
      title: "Summer Collection Sale",
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
    },
    {
      title: "Relaxing Spa Day Package",
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
    },
    {
      title: "Weekend Car Rental Deal",
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
    },
    {
      title: "Home Cleaning Services",
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
    }
  ];

const OffersContext = createContext<OffersContextType | undefined>(undefined);

export function OffersProvider({ children }: { children: ReactNode }) {
  const [offers, setOffers] = useState<Offer[]>(initialOffers);

  const addOffer = (offer: Offer) => {
    setOffers(prevOffers => [offer, ...prevOffers]);
  };

  return (
    <OffersContext.Provider value={{ offers, addOffer }}>
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
