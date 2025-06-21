import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import ClaimConfirmation from '@/components/claim/ClaimConfirmation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, Clock, Package, Filter, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDonations, DonationData } from '@/hooks/useDonations';
import { useAuth } from '@/hooks/useAuth';
import { donationApi } from '@/lib/api';

const ClaimFood = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedFoodType, setSelectedFoodType] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedFood, setSelectedFood] = useState<DonationData | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { donations, isLoading, refetch } = useDonations();
  const { user } = useAuth();

  // Only show available, non-expired donations
  const availableFood: DonationData[] = donations.filter(donation =>
    donation.status === 'available' &&
    (!donation.expiry_time || new Date(donation.expiry_time) > new Date())
  );

  // Get unique locations and food types for filters
  const locations = ['All Locations', ...Array.from(new Set(availableFood.map(f => f.pickup_address)))]
  const foodTypes = ['All Types', ...Array.from(new Set(availableFood.map(f => f.food_type)))]

  const filteredFood = availableFood.filter(food => {
    const matchesSearch = food.food_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         food.donor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         food.pickup_address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !selectedLocation || selectedLocation === 'All Locations' || 
                           food.pickup_address === selectedLocation;
    const matchesFoodType = !selectedFoodType || selectedFoodType === 'All Types' ||
                           food.food_type.toLowerCase().includes(selectedFoodType.toLowerCase());
    return matchesSearch && matchesLocation && matchesFoodType;
  });

  const handleClaimFood = (food: DonationData) => {
    setSelectedFood(food);
    setShowConfirmation(true);
  };

  const confirmClaim = async () => {
    if (selectedFood && user) {
      try {
        await donationApi.claimDonation(selectedFood.id, user.uid);
        toast({
          title: "Food Claimed Successfully!",
          description: `You have successfully claimed ${selectedFood.food_type}. The donor has been notified and will approve your pickup request.`,
        });
        setShowConfirmation(false);
        setSelectedFood(null);
        await refetch();
        // Route to completion page after claim
        navigate(`/complete-claim/${selectedFood.id}`);
      } catch (error: any) {
        toast({
          title: "Error claiming food",
          description: error.message || 'Failed to claim food',
          variant: 'destructive',
        });
      }
    }
  };

  const cancelClaim = () => {
    setShowConfirmation(false);
    setSelectedFood(null);
  };

  if (showConfirmation && selectedFood) {
    // Map DonationData to the expected ClaimConfirmation prop shape
    const confirmationFood = {
      id: selectedFood.id,
      foodType: selectedFood.food_type,
      quantity: selectedFood.quantity,
      donorName: selectedFood.donor_name,
      donorPhone: selectedFood.donor_phone,
      donorEmail: '', // Not available in DonationData
      donorAddress: selectedFood.pickup_address,
      pickupLocation: {
        address: selectedFood.pickup_address,
        lat: 0, // Not available in DonationData
        lng: 0  // Not available in DonationData
      },
      availableUntil: selectedFood.expiry_time ? new Date(selectedFood.expiry_time).toLocaleString() : 'No expiry set',
      description: selectedFood.description,
      photo: '/placeholder.svg',
    };
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <ClaimConfirmation 
              food={confirmationFood}
              onConfirm={confirmClaim}
              onCancel={cancelClaim}
            />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">
            Available Food Donations
          </h1>
          <p className="text-gray-600">
            Browse and claim food donations from generous donors in your area.
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by food type, donor, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedFoodType} onValueChange={setSelectedFoodType}>
                <SelectTrigger>
                  <SelectValue placeholder="Food Type" />
                </SelectTrigger>
                <SelectContent>
                  {foodTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-600">
                {filteredFood.length} food donations available
              </p>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Food Listings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredFood.map((food) => (
            <Card key={food.id} className="hover:shadow-lg transition-shadow">
              {/* You can add a photo property to DonationData if available, or use a placeholder */}
              <div className="relative">
                <img
                  src={"/placeholder.svg"}
                  alt={food.food_type}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <Badge className="absolute top-3 right-3 bg-green-100 text-green-800">
                  Available
                </Badge>
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold">{food.food_type}</h3>
                    <p className="text-gray-600 text-sm">{food.donor_name}</p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Package className="w-4 h-4 mr-2" />
                    Quantity: {food.quantity}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {food.pickup_address}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    Available until {food.expiry_time ? new Date(food.expiry_time).toLocaleString() : 'No expiry set'}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {food.description}
                </p>
                <Button 
                  className="w-full bg-secondary hover:bg-secondary-dark"
                  onClick={() => handleClaimFood(food)}
                >
                  Claim This Food
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredFood.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Food Available</h3>
              <p className="text-gray-600">
                No food donations match your current filters. Try adjusting your search criteria.
              </p>
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ClaimFood;
