// Core Types for AzerBook

export interface Hotel {
  id: number; // Backend-dən Long (rəqəm) gəlir
  name: string;
  slug: string; // Backend-də yoxdursa hələlik opsional (?) edirik
  city: string;
  citySlug: string; // Backend-də yoxdursa opsional
  address: string;
  stars: number;
  rating: number;
  reviewCount?: number; // Opsional (Hələ backend-də yoxdur)
  ratingLabel?: string; // Opsional
  basePrice: number;    // Backend-dəki adla eyni (basePrice)
  pricePerNight?: number; // Köhnə kodlar üçün saxlaya bilərik
  currency?: string;
  mainImageUrl?: string; // Backend-dəki ad (toHotelResponse-dan gələn)
  images?: string[];    // Siyahı üçün
  amenities: string[];
  description: string;
  type?: 'Hotel' | 'Resort' | 'Apartment' | 'Guesthouse';
  badge?: string;
  urgency?: string;
  lat: number;
  lng: number;
  checkInTime: string;
  checkOutTime: string;
  rooms: Room[];
  reviews: Review[];
  neighborhood: string;
}

export interface Room {
  id: string;
  name: string;
  bedType: string;
  capacity: number;
  size: number;
  price: number;
  amenities: string[];
  image: string;
  cancellation: string;
  available: number;
}

export interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  country: string;
  date: string;
  rating: number;
  comment: string;
  helpful: number;
  categories: {
    cleanliness: number;
    location: number;
    service: number;
    value: number;
  };
}

export interface Destination {
  id: string;
  name: string;
  slug: string;
  hotelCount: number;
  image: string;
  description: string;
  tagline: string;
}

export interface SearchParams {
  destination: string;
  checkIn: Date | null;
  checkOut: Date | null;
  adults: number;
  children: number;
}

export interface Booking {
  id: string;
  reference: string;
  hotelId: string;
  hotelName: string;
  hotelImage: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  totalPrice: number;
  status: 'confirmed' | 'completed' | 'cancelled';
  guestName: string;
  guestEmail: string;
  createdAt: string;
}

export interface FilterState {
  priceRange: [number, number];
  stars: number[];
  amenities: string[];
  guestRating: number;
  neighborhoods: string[];
  propertyTypes: string[];
  sortBy: string;
}
