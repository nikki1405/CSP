export type UserRole = 'ngo' | 'donor';

export interface UserAddress {
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
    landmark?: string;
}

export interface DonorPreferences {
    foodTypes?: string[];
    availableDays?: string[];
    preferredTime?: string;
    minQuantity?: string;
    maxDistance?: string;
    specialInstructions?: string;
}

export interface NGODetails {
    registrationNumber?: string;
    establishedYear?: string;
    volunteers?: number;
    operatingAreas?: string[];
    capacity?: {
        storageCapacity?: string;
        dailyServingCapacity?: number;
    };
    certifications?: string[];
    contactPerson?: {
        name: string;
        role: string;
        phone: string;
        email: string;
    };
}

export interface AvailableFood {
    id: string;
    donorName: string;
    foodType: string;
    quantity: string;
    pickupAddress: string;
    expiryTime: string;
    status: 'available' | 'claimed' | 'expired';
}

export interface NGOStats {
    totalDonationsReceived: number;
    activeVolunteers: number;
    peopleServedDaily: number;
    totalPeopleHelped: number;
    totalEventsOrganized: number;
    successfulPickups: number;
}

export interface DonorStats {
    donationsCount?: number;
    peopleHelped?: number;
    volunteeredHours?: number;
}

export interface SocialLinks {
    website?: string;
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
}

export interface UserData {
    uid: string;
    email: string;
    role: UserRole;
    displayName?: string;
    phoneNumber?: string;
    organization?: string;
    photoURL?: string;
    bio?: string;
    address?: UserAddress;
    // Role-specific fields
    preferences?: DonorPreferences;
    ngoDetails?: NGODetails;
    socialLinks?: SocialLinks;
    // Role-specific stats
    donorStats?: DonorStats;
    ngoStats?: NGOStats;
    createdAt?: string;
    updatedAt?: string;
}

export interface AuthContextType {
    user: UserData | null;
    loading: boolean;
    signUp: (email: string, password: string, role: UserRole, userData: Partial<UserData>) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    updateUserProfile: (data: Partial<UserData>) => Promise<void>;
}
