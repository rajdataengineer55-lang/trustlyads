# TrustlyAds.in - Technical Documentation

This document provides a comprehensive overview of the features, architecture, and core logic of the `trustlyads.in` web application.

## 1. Core Technologies

- **Framework:** [Next.js](https://nextjs.org/) (with App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [ShadCN UI](https://ui.shadcn.com/)
- **Backend & Database:** [Firebase](https://firebase.google.com/) (Firestore, Authentication, Storage)
- **State Management:** React Context API
- **Deployment:** Firebase App Hosting

## 2. Project Structure

- `src/app/`: Main application routes (pages).
- `src/components/`: Reusable React components.
  - `src/components/landing/`: Components specific to the homepage.
  - `src/components/ui/`: Auto-generated ShadCN UI components.
- `src/contexts/`: Global state management using React Context.
- `src/lib/`: Core logic and Firebase integration files.
- `src/hooks/`: Custom React hooks.
- `public/`: Static assets (this project does not use it for images).

---

## 3. Core Features & Logic

### 3.1. Firebase Backend

The entire backend is powered by Firebase services, configured in `src/lib/firebase.ts`.

- **Firestore (`db`):** A NoSQL database used to store all application data, including offers, reviews, and followers.
- **Authentication (`auth`):** Manages user sign-in and sessions.
- **Storage (`storage`):** Stores all user-uploaded media (offer images).

#### Firestore Data Model

- `offers` (collection): Each document represents a single business offer.
  - `id`: Document ID
  - `title`, `description`, `business`, `category`, `location`, `discount`, `tags`, etc.
  - `image`: URL of the main cover image.
  - `otherImages`: Array of URLs for additional images.
  - `isHidden`: Boolean to control public visibility.
  - `createdAt`: Timestamp for sorting by newest.
  - `views`: Number counter for offer detail page views.
  - `clicks`: Number counter for clicks on contact actions.
  - `reviews` (subcollection): Each document is a user review for that offer.
- `followers` (collection): Each document represents a user who has followed the site.

### 3.2. Authentication (`src/contexts/AuthContext.tsx`)

- **Admin Login:** The admin signs in using a specific email and password (`dandurajkumarworld24@gmail.com`). This is handled by `signInWithEmail()`.
- **User Login:** Regular users sign in via their Google account (`signInWithGoogle()`).
- **Global State:** The `AuthProvider` wraps the entire application, providing global access to the current user's state (`user`) and a `loading` status.
- **Access Control:** The admin page (`src/app/admin/page.tsx`) and contact actions on the offer page (`src/app/offer/[id]/page.tsx`) use the `useAuth()` hook to check user status and conditionally render content.

### 3.3. Offer Management (`src/contexts/OffersContext.tsx`)

This is the central nervous system for all offer-related data.

- **Real-time Data:** `getOffers()` sets up a real-time listener to the Firestore `offers` collection. Any change in the database (add, update, delete) is instantly reflected in the UI without needing a page refresh.
- **Data Hydration:** When fetching offers, it also fetches the `reviews` subcollection for each offer, ensuring the full data object is available.
- **CRUD Operations:** The context provides functions to interact with the database:
  - `addOffer`, `updateOffer`, `deleteOffer`, `addReview`, `toggleOfferVisibility`.
- **Analytics Tracking:**
  - `incrementOfferView`: Called from the offer detail page to increment the `views` count in Firestore.
  - `incrementOfferClick`: Called when a user clicks a contact button, incrementing the `clicks` count.
- **Client-Side Boost:** `boostOffer()` re-orders the local array of offers to move a specific offer to the top for the current admin session.

### 3.4. Admin Panel (`src/app/admin/page.tsx`)

This is a protected route, only fully visible to the authorized admin email.

#### Ad Posting & Editing (`src/components/ad-generator.tsx`)

- A single, reusable form component used for both creating new offers and editing existing ones.
- **Image Uploads:**
  1. User selects images via an `<input type="file">`.
  2. `uploadMultipleFiles()` in `src/lib/storage.ts` is called.
  3. It uploads each file to the `/offers/` directory in Firebase Storage with a unique UUID.
  4. It returns an array of public download URLs for the uploaded images.
- **Data Submission:** The form handler gathers all data, including the image URLs, and calls either `addOffer` or `updateOffer` from `OffersContext`.

#### Offer Management Table (`src/components/manage-offers.tsx`)

- Displays all offers in a table format for easy scanning.
- **Analytics:** Shows the `views` and `clicks` for each offer.
- **Status Badge:** A visual indicator shows if an offer is `Visible` or `Hidden`.
- **Actions Menu:** A dropdown menu provides all management functions:
  - **Boost:** Calls the client-side `boostOffer` function.
  - **Hide/Make Visible:** Toggles the `isHidden` flag in Firestore.
  - **Edit:** Opens the `AdGenerator` component in a dialog, pre-filled with the offer's data.
  - **Delete:** Triggers a confirmation dialog before permanently deleting the offer from Firestore.

### 3.5. Public User Experience

#### Homepage (`src/app/page.tsx`)

- **Filtering & Searching:** The homepage maintains state for `selectedCategory`, `selectedLocation`, `sortOption`, and `searchTerm`.
- These state variables are passed down to `FeaturedOffers` and `Filters` components.
- The `FeaturedOffers` component then filters the global list of offers from `OffersContext` based on these props before rendering them.

#### Offer Details Page (`src/app/offer/[id]/page.tsx`)

- **Data Fetching:** Uses the `useParams()` hook to get the offer `id` from the URL and `getOfferById()` from `OffersContext` to find the correct offer data.
- **View Tracking:** On first load, it calls `incrementOfferView(id)` to log a view for the ad. This is tracked in `sessionStorage` to prevent re-counting on page refresh.
- **Conditional Contact Actions:** It checks if a user is signed in.
  - If **yes**, it displays the "Call", "Chat", and "Schedule" buttons. Clicking these buttons calls `incrementOfferClick(id)` before performing the action.
  - If **no**, it displays a single "Sign in to Contact" button.
- **Review System:** Signed-in users can submit a review using the form, which calls the `addReview()` function.

### 3.6. Follower System (`src/lib/followers.ts`)

- A simple system allowing users to "follow" the website.
- `addFollower`: Creates a document in the `followers` collection using the user's UID as the document ID.
- `removeFollower`: Deletes the document.
- `getFollowersCount`: Sets up a real-time listener to the `followers` collection and returns the number of documents (followers), which is displayed in the header.
- `isFollowing`: Checks if a document for the current user's UID exists, used to determine the state of the "Follow" button.

---
This documentation should serve as a solid foundation for understanding the application's inner workings.
