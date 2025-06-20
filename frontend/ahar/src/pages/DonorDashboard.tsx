import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Package, MapPin, Users, TrendingUp, Clock, CheckCircle, IndianRupee, Loader2, Edit, Trash2, MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import { donationApi } from '@/lib/api';
import { useDonations, DonationData } from '@/hooks/useDonations';
import { useAuth } from '@/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';
import EditDonation from '@/pages/EditDonation';

export default function DonorDashboard() {
  const { user } = useAuth();
  const { donations, isLoading, refetch } = useDonations();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  console.log('Current user:', user);
  console.log('All donations:', donations);
  
  // Filter donations for the current user and exclude expired ones
  const myDonations = donations.filter(donation => {
    console.log('Checking donation:', donation);
    // For testing, we're using the hardcoded donor_id since that's what we used in PostFood
    return donation.donor_id === 'test123' &&
           (donation.status === 'available' || donation.status === 'claimed' || donation.status === 'completed') &&
           (!donation.expiry_time || new Date(donation.expiry_time) > new Date());
  });
  
  // Calculate statistics
  console.log('Filtered myDonations:', myDonations);
  
  const stats = {
    totalDonations: myDonations.length,
    activeDonations: myDonations.filter(d => d.status === 'available').length,
    claimedDonations: myDonations.filter(d => d.status === 'claimed').length,
    completedDonations: myDonations.filter(d => d.status === 'completed').length,
  };
  
  console.log('Calculated stats:', stats);

  const handleDelete = async (donationId: string) => {
    try {
      setDeletingId(donationId);
      
      // Find the donation
      const donationToDelete = donations.find(d => d.id === donationId);
      
      if (!donationToDelete) {
        toast({
          title: "Error",
          description: "Cannot find the donation",
          variant: "destructive",
        });
        return;
      }

      if (donationToDelete.donor_id !== 'test123') {
        toast({
          title: "Error",
          description: "You can only remove your own donations",
          variant: "destructive",
        });
        return;
      }

      if (donationToDelete.status === 'claimed' || donationToDelete.status === 'completed') {
        toast({
          title: "Error",
          description: `Cannot remove a ${donationToDelete.status.toLowerCase()} donation`,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Processing",
        description: "Removing donation...",
      });

      const result = await donationApi.deleteFood(donationId);
      
      if (result) {
        toast({
          title: "Success",
          description: "Donation has been removed",
        });
        
        // Refresh the list
        await refetch();
      }
    } catch (error: any) {
      console.error('Error removing donation:', error);
      
      toast({
        title: "Error",
        description: error.message || "Failed to remove donation",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (donationId: string) => {
    navigate(`/edit-donation/${donationId}`);
  };

  const renderDonationCard = (donation: DonationData) => {
    console.log('Rendering donation card:', donation);
    
    const statusColors = {
      available: 'bg-green-100 text-green-800',
      claimed: 'bg-blue-100 text-blue-800',
      completed: 'bg-gray-100 text-gray-800',
      expired: 'bg-red-100 text-red-800',
    };

    const timeLeft = donation.expiry_time ? 
      formatDistanceToNow(new Date(donation.expiry_time), { addSuffix: true }) :
      'No expiry set';

    return (
      <Card key={donation.id} className="mb-4">
        <CardContent className="pt-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold">{donation.food_type}</h3>
              <p className="text-sm text-gray-600">{donation.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge 
                className={statusColors[donation.status as keyof typeof statusColors] || statusColors.expired}
              >
                {donation.status}
              </Badge>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => handleEdit(donation.id || '')}
                    disabled={donation.status !== 'available'}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        className="text-red-600"
                        disabled={donation.status !== 'available'}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete this food donation. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(donation.id || '')}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <Package className="h-4 w-4 mr-2 text-gray-500" />
              <span>Quantity: {donation.quantity}</span>
            </div>
            
            <div className="flex items-center text-sm">
              <MapPin className="h-4 w-4 mr-2 text-gray-500" />
              <span>{donation.pickup_address}</span>
            </div>
            
            <div className="flex items-center text-sm">
              <Clock className="h-4 w-4 mr-2 text-gray-500" />
              <span>Best before: {timeLeft}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-8 px-4">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome back, {user?.displayName || 'Donor'}!</h1>
          <p className="text-gray-600 mt-2">Manage your food donations and track their status.</p>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-4 mb-8">
          <Link to="/post-food">
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" /> Post New Food Donation
            </Button>
          </Link>
          <Link to="/money-donation">
            <Button className="w-full sm:w-auto" variant="secondary">
              <IndianRupee className="mr-2 h-4 w-4" /> Donate Money
            </Button>
          </Link>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Donations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Package className="h-8 w-8 text-blue-500 mr-2" />
                <span className="text-2xl font-bold">{stats.totalDonations}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Active Donations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-500 mr-2" />
                <span className="text-2xl font-bold">{stats.activeDonations}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Claimed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="h-8 w-8 text-orange-500 mr-2" />
                <span className="text-2xl font-bold">{stats.claimedDonations}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-purple-500 mr-2" />
                <span className="text-2xl font-bold">{stats.completedDonations}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* My Posts Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>My Posts</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                <p className="text-gray-600 mt-2">Loading your donations...</p>
              </div>
            ) : donations.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No donations found in the system.</p>
              </div>
            ) : myDonations.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">You haven't posted any donations yet.</p>
                <Link to="/post-food">
                  <Button variant="outline" className="mt-4">
                    <Plus className="mr-2 h-4 w-4" /> Post Your First Donation
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {myDonations.map((donation, index) => {
                  console.log(`Rendering donation ${index}:`, donation);
                  return renderDonationCard(donation);
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
