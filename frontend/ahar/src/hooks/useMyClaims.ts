import { useState, useEffect } from 'react';
import { donationApi, DonationData } from '@/lib/api';

export function useMyClaims(ngoId?: string) {
  const [claims, setClaims] = useState<DonationData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClaims = async () => {
    if (!ngoId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await donationApi.listMyClaims(ngoId);
      setClaims(data);
    } catch (e: any) {
      setError(e.message || 'Failed to fetch claims');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ngoId]);

  return { claims, isLoading, error, refetch: fetchClaims };
}
