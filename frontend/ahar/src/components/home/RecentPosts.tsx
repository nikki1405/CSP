import { useDonations, DonationData } from '@/hooks/useDonations';
import { useToast } from '@/components/ui/use-toast';
import { DonationCard } from '@/components/donations/DonationCard';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function RecentPosts() {
  const { donations, isLoading, error, refetch } = useDonations();
  const { toast } = useToast();

  // Show only the most recent 6 available donations
  const recentDonations = donations
    .filter((donation): donation is DonationData => {
      if (!donation.status || !donation.food_type || !donation.quantity) {
        console.warn('Invalid donation data:', donation);
        return false;
      }
      return donation.status === 'available';
    })
    .sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 6);

  const handleClaim = async (donationId: string) => {
    toast({
      title: "Coming Soon",
      description: "Claim functionality will be available soon!",
    });
  };

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={refetch} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <section className="container mx-auto py-10 px-4">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold">Recent Food Donations</h2>
        <p className="text-gray-600 mt-2">
          Check out the latest food donations available in your area
        </p>
        <Button 
          onClick={refetch} 
          variant="ghost" 
          className="mt-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Refreshing...
            </>
          ) : (
            'Refresh listings'
          )}
        </Button>
      </div>

      {isLoading && donations.length === 0 ? (
        <div className="text-center py-10">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-gray-600 mt-2">Loading donations...</p>
        </div>
      ) : recentDonations.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600">No donations available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentDonations.map((donation) => (
            <DonationCard
              key={donation.id}
              donation={donation}
              onClaim={() => handleClaim(donation.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
