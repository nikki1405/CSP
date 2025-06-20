import { useState, useEffect, useCallback } from 'react';
import { donationApi } from '@/lib/api';

export interface DonationPreferences {
  availability_start?: string;
  availability_end?: string;
  special_instructions?: string;
  pickup_time?: string;
  packaging?: string;
  posted_at?: string;
}

export interface RawDonationData {
  id?: string;
  food_type?: string;
  category?: string;
  quantity?: string;
  description?: string;
  pickup_address?: string;
  expiry_time?: string;
  donor_name?: string;
  donor_id?: string;
  donor_phone?: string;
  status?: string;
  created_at?: string;
  preferences?: DonationPreferences;
  claimed_by?: string;
}

export type DonationStatus = 'available' | 'claimed' | 'completed' | 'expired';

export interface DonationData {
  id: string;
  food_type: string;
  category?: string;
  quantity: string;
  description: string;
  pickup_address: string;
  expiry_time: string;
  donor_name: string;
  donor_id: string;
  donor_phone: string;
  status: DonationStatus;
  created_at: string;
  preferences?: DonationPreferences;
  claimed_by?: string;
}

function validateDonation(raw: RawDonationData): DonationData {
  if (!raw.id) throw new Error('Donation ID is required');
  if (!raw.food_type) throw new Error('Food type is required');
  if (!raw.quantity) throw new Error('Quantity is required');
  if (!raw.pickup_address) throw new Error('Pickup address is required');
  if (!raw.donor_id) throw new Error('Donor ID is required');

  // Validate status
  const validStatuses: DonationStatus[] = ['available', 'claimed', 'completed', 'expired'];
  const status = raw.status?.toLowerCase() as DonationStatus;
  
  if (!validStatuses.includes(status)) {
    console.warn(`Invalid status: ${raw.status}, defaulting to 'available'`);
  }

  return {
    id: raw.id,
    food_type: raw.food_type,
    category: raw.category,
    quantity: raw.quantity,
    description: raw.description || '',
    pickup_address: raw.pickup_address,
    expiry_time: raw.expiry_time || new Date().toISOString(),
    donor_name: raw.donor_name || '',
    donor_id: raw.donor_id,
    donor_phone: raw.donor_phone || '',
    status: validStatuses.includes(status) ? status : 'available',
    created_at: raw.created_at || new Date().toISOString(),
    preferences: raw.preferences,
    claimed_by: raw.claimed_by,
  };
}

export function useDonations() {
  const [donations, setDonations] = useState<DonationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDonations = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await donationApi.listDonations();
      
      // Filter out any invalid donations and validate the rest
      const validDonations = response
        .filter((raw: RawDonationData) => {
          try {
            validateDonation(raw);
            return true;
          } catch (e) {
            console.warn('Invalid donation:', raw, e);
            return false;
          }
        })
        .map((raw: RawDonationData) => validateDonation(raw));

      setDonations(validDonations);
    } catch (e: any) {
      console.error('Error fetching donations:', e);
      setError(e.message || 'Failed to fetch donations');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDonations();
  }, [fetchDonations]);

  return {
    donations,
    isLoading,
    error,
    refetch: fetchDonations
  };
}
