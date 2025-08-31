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

- **Firestore (`db`):** A NoSQL database used to store all application data, including offers and followers. Secured with `firestore.rules`.
- **Authentication (`auth`):** Manages user sign-in and sessions.
- **Storage (`storage`):** Stores all user-uploaded media (offer and story images). Secured with `storage.rules`.

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
- `followers` (collection): Each document represents a user who has followed the site.
- `stories` (collection): Each document represents a temporary story linked to a business offer.

### 3.2. Authentication (`src/contexts/AuthContext.tsx` & `src/hooks/use-admin.ts`)

- **Admin Login:** The admin signs in using a specific email and password. Upon successful login, the application securely checks for a custom `admin: true` claim on the user's Firebase token. This server-side check is the sole source of truth for admin privileges.
- **User Login:** Regular users sign in via their Google account (`signInWithGoogle()`).
- **Global State:** The `AuthProvider` wraps the entire application, providing global access to the current user's state (`user`), a loading status (`loading`), and the secure admin status (`isAdmin`).
- **Access Control:** The admin page (`src/app/admin/page.tsx`) and all content management features rely on the `useAuth()` hook to check the `isAdmin` status and conditionally render content.

### 3.3. Offer Management (`src/contexts/OffersContext.tsx`)

This is the central hub for all offer-related data.

- **Data Fetching:** The context uses a `fetchOffers()` function to get the complete list of offers from Firestore. This function is called when the provider mounts and can be called again to refresh data.
- **CRUD Operations:** The context provides functions to interact with the database:
  - `addOffer`, `updateOffer`, `deleteOffer`, `toggleOfferVisibility`. Each of these functions performs its operation and then calls `fetchOffers()` to ensure the UI is updated with the latest data.
- **Analytics Tracking:**
  - `incrementOfferView`: Called from the offer detail page to increment the `views` count in Firestore.
  - `incrementOfferClick`: Called when a user clicks a contact button, incrementing the `clicks` count.
- **Client-Side Boost:** `boostOffer()` re-orders the local array of offers to move a specific offer to the top for the current admin session.

### 3.4. Admin Panel (`src/app/admin/page.tsx`)

This is a protected route, only fully visible to an authenticated admin user.

#### Ad Posting & Editing (`src/components/ad-generator.tsx`)

- A single, reusable form component used for both creating new offers and editing existing ones.
- **Image Uploads:**
  1. User selects images via an `<input type="file">`.
  2. `uploadMultipleFiles()` in `src/lib/storage.ts` is called.
  3. It uploads each file to the `/offers/` directory in Firebase Storage with a unique UUID.
  4. It returns an array of public download URLs for the uploaded images.
- **Data Submission:** The form handler gathers all data, including the image URLs, and calls either `addOffer` or `updateOffer` from `OffersContext`.

#### Offer Management Table (`src/components/manage-offers.tsx`)

- Displays all offers in a table, allowing the admin to easily manage them.
- **Analytics:** Shows the `views` and `clicks` for each offer.
- **Status Badge:** A visual indicator shows if an offer is `Visible` or `Hidden`.
- **Actions Menu:** A dropdown menu provides all management functions: Boost, Hide/Make Visible, Edit, and Delete.

### 3.5. Public User Experience

#### Homepage (`src/app/page.tsx`)

- **Filtering & Searching:** The homepage maintains state for `selectedCategory`, `selectedLocation`, `sortOption`, and `searchTerm`.
- These state variables are used by the `FeaturedOffers` component to filter the global list of offers from `OffersContext` before rendering them.

#### Offer Details Page (`src/app/offer/[id]/page.tsx`)

- **Data Fetching:** Uses the `useParams()` hook to get the offer `id` from the URL and `getOfferById()` from `OffersContext` to find the correct offer data. The component now includes robust loading and not-found states to prevent rendering errors.
- **View Tracking:** On first load, it calls `incrementOfferView(id)` to log a view for the ad. This is tracked in `sessionStorage` to prevent re-counting on page refresh.
- **Conditional Contact Actions:** It checks if a user is signed in to show contact buttons or a "Sign in" prompt.

### 3.6. Follower System (`src/lib/followers.ts`)

- A simple system allowing users to "follow" the website.
- `addFollower` & `removeFollower`: Manages a user's follow status.
- `getFollowersCount`: Uses an efficient `getCountFromServer` query to get the total number of followers.
- `isFollowing`: Checks if a specific user is following.

---
This documentation should serve as a solid foundation for understanding the application's inner workings.
