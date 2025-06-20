import { useEffect, useState } from 'react';
import { donationApi } from '@/lib/api';

export default function TestDonations() {
  const [donations, setDonations] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await donationApi.listDonations();
        console.log('API Response:', response);
        setDonations(Array.isArray(response) ? response : [response]);
      } catch (error) {
        console.error('Error fetching donations:', error);
      }
    };
    
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Debug: Recent Donations</h2>
      <pre className="bg-gray-100 p-4 rounded">
        {JSON.stringify(donations, null, 2)}
      </pre>
    </div>
  );
}
