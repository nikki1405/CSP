import { useEffect, useState } from 'react';
import axios from 'axios';

export interface MoneyDonation {
  id: string;
  amount: number;
  donorName: string;
  donorEmail: string;
  donorPhone: string;
  donorAddress: string;
  date: string;
  transactionId: string;
  purpose: string;
}

export function useMoneyReceived(ngoId?: string) {
  const [donations, setDonations] = useState<MoneyDonation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ngoId) return;
    setLoading(true);
    setError(null);
    axios
      .get<MoneyDonation[]>(`/api/money_donations/?ngo_id=${ngoId}`)
      .then((res) => {
        setDonations(res.data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message || 'Failed to fetch donations');
        setLoading(false);
      });
  }, [ngoId]);

  return { donations, loading, error };
}
