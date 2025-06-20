
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'donor' | 'ngo';
  photo?: string;
  ngoIdProof?: string; // For NGO users only
  phone?: string;
  address?: string;
  createdAt: string;
}

export interface FoodPost {
  id: string;
  donorId: string;
  donorName: string;
  donorPhone?: string;
  donorEmail: string;
  donorAddress: string;
  foodType: string;
  quantity: string;
  description: string;
  pickupLocation: {
    address: string;
    lat: number;
    lng: number;
  };
  availabilityStart: string;
  availabilityEnd: string;
  photo?: string;
  status: 'available' | 'claimed' | 'completed';
  claimedBy?: string;
  claimedAt?: string;
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  type: 'drive' | 'campaign' | 'awareness';
  registrations: string[];
  maxParticipants?: number;
}

export interface NewsletterSubscription {
  email: string;
  subscribedAt: string;
  isActive: boolean;
}

export interface Claim {
  id: string;
  postId: string;
  ngoId: string;
  ngoName: string;
  claimedAt: string;
  status: 'pending' | 'approved' | 'completed';
  pickupTime?: string;
}
