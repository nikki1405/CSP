import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { donationApi } from '@/lib/api';

export default function CompleteClaim() {
  const { donationId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      await donationApi.completeDonation(donationId!);
      toast({
        title: 'Donation marked as completed!',
        description: 'Thank you for serving the community.',
      });
      navigate('/ngo-dashboard');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to mark as completed',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-8 px-4">
        <div className="max-w-xl mx-auto bg-white rounded-lg shadow p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Complete Food Claim</h1>
          <p className="mb-6">If you have successfully served this food donation, please mark it as completed.</p>
          <Button onClick={handleComplete} disabled={isLoading} className="w-full">
            {isLoading ? 'Completing...' : 'Mark as Completed'}
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
