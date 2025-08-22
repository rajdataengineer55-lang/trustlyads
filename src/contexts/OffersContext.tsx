
"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
}

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
  reviews?: Review[];
}

interface OffersContextType {
  offers: Offer[];
  addOffer: (offer: Omit<Offer, 'id' | 'reviews'>) => void;
  getOfferById: (id: string) => Offer | undefined;
  updateOffer: (id: string, updatedOffer: Partial<Omit<Offer, 'id' | 'reviews'>>) => void;
  deleteOffer: (id: string) => void;
  boostOffer: (id: string) => void;
  addReview: (offerId: string, review: Omit<Review, 'id'>) => void;
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
      reviews: [
        { id: 'review-1', author: "Rahul Kumar", rating: 5, comment: "Amazing food and great service! Highly recommended." },
        { id: 'review-2', author: "Priya Sharma", rating: 4, comment: "The pasta was delicious, but the wait time was a bit long." },
      ],
    },
    {
      id: "chic-boutique-summer-collection-sal",
      title: "Summer Collection Sale",
      description: "Get ready for summer with 30% off our new collection. Featuring vibrant colors and breezy fabrics, perfect for the sunny days ahead. Our collection includes dresses, tops, skirts, and accessories to complete your summer look. Limited stock available.",
      business: "Chic Boutique",
      category: "Shops & Retail",
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
      reviews: [
        { id: 'review-3', author: "Anjali Mehta", rating: 5, comment: "Beautiful collection and very helpful staff." },
      ],
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
      reviews: [
        { id: 'review-4', author: "Suresh Patel", rating: 5, comment: "Incredibly relaxing experience. The best spa in town!" },
        { id: 'review-5', author: "Meena Iyer", rating: 4, comment: "Good service, but the facility was a bit crowded." },
        { id: 'review-6', author: "Amit Singh", rating: 5, comment: "My wife and I loved the couple's package. Will definitely be back." },
      ],
    },
    {
      id: "speedy-rentals-weekend-car-rental-d",
      title: "Weekend Car Rental Deal",
      description: "Rent any car for the weekend for just ₹3999 per day. Includes unlimited mileage. Choose from our wide range of vehicles, from compact cars to SUVs. Perfect for a weekend getaway or running errands around town.",
      business: "Speedy Rentals",
      category: "Automobiles & Transport",
      location: "Tirupati Rural",
      image: "https://placehold.co/600x400.png",
      hint: "car rental",
      discount: "₹3999/day",
      tags: ["Just Listed"],
      allowCall: true,
      allowChat: false,
      allowSchedule: false,
      phoneNumber: "9380002829",
      reviews: [],
    },
    {
      id: "sparkle-clean-home-cleaning-servic",
      title: "Home Cleaning Services",
      description: "Get your home sparkling clean with 20% off our deep cleaning services. Offer valid for a limited time. Our professional team uses eco-friendly products to ensure a safe and thorough clean for your home.",
      business: "Sparkle Clean",
      category: "Services",
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
      reviews: [
          { id: 'review-7', author: "Kavita Reddy", rating: 5, comment: "Very professional and thorough cleaning service. My house looks brand new!" }
      ],
    },
    {
      id: "fitness-first-gym-membership-offer",
      title: "Annual Gym Membership Offer",
      description: "Sign up for a yearly membership and get 3 months free! Access to all our equipment, classes, and facilities. Our certified trainers are always available to help you achieve your fitness goals.",
      business: "Fitness First",
      category: "Gym",
      location: "Vellore",
      image: "https://placehold.co/600x400.png",
      hint: "gym fitness",
      discount: "3 Months Free",
      tags: ["Health", "Fitness"],
      allowCall: true,
      allowChat: true,
      allowSchedule: false,
      phoneNumber: "9380002829",
      chatLink: "wa.me/919380002829",
      reviews: [
        { id: 'review-8', author: "Arjun Verma", rating: 5, comment: "Great gym with modern equipment and friendly trainers. The best in Vellore!" },
        { id: 'review-9', author: "Sneha Reddy", rating: 4, comment: "I love the variety of classes offered. It can get a bit crowded in the evenings though." }
      ],
    }
  ];

const OffersContext = createContext<OffersContextType | undefined>(undefined);

// Helper function to generate a URL-friendly slug
const createSlug = (text: string) => {
  return text
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');
};


export function OffersProvider({ children }: { children: ReactNode }) {
  const [offers, setOffers] = useState<Offer[]>(initialOffers);

  const addOffer = (offer: Omit<Offer, 'id' | 'reviews'>) => {
    const slug = createSlug(`${offer.business} ${offer.title}`);
    const newOffer: Offer = {
      ...offer,
      id: `${slug}-${crypto.randomUUID().slice(0, 4)}`,
      reviews: [],
    };
    setOffers(prevOffers => [newOffer, ...prevOffers]);
  };

  const updateOffer = (id: string, updatedOfferData: Partial<Omit<Offer, 'id' | 'reviews'>>) => {
    setOffers(prevOffers =>
      prevOffers.map(offer => {
        if (offer.id === id) {
          // Make sure to preserve existing reviews
          const existingReviews = offer.reviews || [];
          return { ...offer, ...updatedOfferData, reviews: existingReviews };
        }
        return offer;
      })
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
  
  const addReview = (offerId: string, review: Omit<Review, 'id'>) => {
    setOffers(prevOffers =>
      prevOffers.map(offer => {
        if (offer.id === offerId) {
          const newReview = { ...review, id: crypto.randomUUID() };
          const updatedReviews = [...(offer.reviews || []), newReview];
          return { ...offer, reviews: updatedReviews };
        }
        return offer;
      })
    );
  };

  return (
    <OffersContext.Provider value={{ offers, addOffer, getOfferById, updateOffer, deleteOffer, boostOffer, addReview }}>
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
