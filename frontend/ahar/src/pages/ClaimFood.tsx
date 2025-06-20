
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

const ClaimFood = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedFoodType, setSelectedFoodType] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedFood, setSelectedFood] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const availableFood = [
    {
      id: '1',
      foodType: 'Fresh Vegetables',
      quantity: '10 kg',
      donorName: 'Green Garden Restaurant',
      donorPhone: '+91 98765 43210',
      donorEmail: 'contact@greengarden.com',
      donorAddress: '123 MG Road, Mumbai Central, Mumbai 400008',
      location: 'Mumbai Central',
      pickupLocation: {
        address: '123 MG Road, Mumbai Central, Mumbai 400008',
        lat: 19.0176,
        lng: 72.8562
      },
      availableUntil: '6:00 PM today',
      distance: '2.3 km',
      status: 'available',
      description: 'Fresh mixed vegetables including carrots, beans, and cabbage. Perfect condition.',
      photo: '/placeholder.svg'
    },
    {
      id: '2',
      foodType: 'Cooked Rice & Dal',
      quantity: '50 servings',
      donorName: 'Community Kitchen',
      donorPhone: '+91 98765 43211',
      donorEmail: 'info@communitykitchen.org',
      donorAddress: '456 Linking Road, Andheri West, Mumbai 400058',
      location: 'Andheri West',
      pickupLocation: {
        address: '456 Linking Road, Andheri West, Mumbai 400058',
        lat: 19.1367,
        lng: 72.8269
      },
      availableUntil: '8:00 PM today',
      distance: '4.1 km',
      status: 'available',
      description: 'Freshly cooked rice and dal with vegetables. Hygienic preparation.',
      photo: '/placeholder.svg'
    },
    {
      id: '3',
      foodType: 'Bakery Items',
      quantity: '30 pieces',
      donorName: 'Sweet Treats Bakery',
      donorPhone: '+91 98765 43212',
      donorEmail: 'orders@sweettreats.com',
      donorAddress: '789 Hill Road, Bandra West, Mumbai 400050',
      location: 'Bandra',
      pickupLocation: {
        address: '789 Hill Road, Bandra West, Mumbai 400050',
        lat: 19.0596,
        lng: 72.8295
      },
      availableUntil: '5:00 PM today',
      distance: '1.8 km',
      status: 'available',
      description: 'Assorted bread, pastries, and cakes. All items are fresh.',
      photo: '/placeholder.svg'
    },
    {
      id: '4',
      foodType: 'Fruits',
      quantity: '15 kg',
      donorName: 'Fresh Mart',
      donorPhone: '+91 98765 43213',
      donorEmail: 'help@freshmart.in',
      donorAddress: '321 Shivaji Park, Dadar, Mumbai 400028',
      location: 'Dadar',
      pickupLocation: {
        address: '321 Shivaji Park, Dadar, Mumbai 400028',
        lat: 19.0198,
        lng: 72.8431
      },
      availableUntil: '7:00 PM today',
      distance: '3.2 km',
      status: 'available',
      description: 'Mixed seasonal fruits including apples, bananas, and oranges.',
      photo: '/placeholder.svg'
    }
  ];

  const locations = ['All Locations', 'Mumbai Central', 'Andheri West', 'Bandra', 'Dadar', 'Colaba'];
  const foodTypes = ['All Types', 'Vegetables', 'Cooked Food', 'Bakery Items', 'Fruits', 'Grains'];

  const filteredFood = availableFood.filter(food => {
    const matchesSearch = food.foodType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         food.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         food.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !selectedLocation || selectedLocation === 'All Locations' || 
                           food.location === selectedLocation;
    const matchesFoodType = !selectedFoodType || selectedFoodType === 'All Types' ||
                           food.foodType.toLowerCase().includes(selectedFoodType.toLowerCase());
    
    return matchesSearch && matchesLocation && matchesFoodType;
  });

  const handleClaimFood = (food: any) => {
    setSelectedFood(food);
    setShowConfirmation(true);
  };

  const confirmClaim = () => {
    if (selectedFood) {
      toast({
        title: "Food Claimed Successfully!",
        description: `You have successfully claimed ${selectedFood.foodType}. The donor has been notified and will approve your pickup request.`,
      });
      setShowConfirmation(false);
      setSelectedFood(null);
      navigate('/ngo-dashboard');
    }
  };

  const cancelClaim = () => {
    setShowConfirmation(false);
    setSelectedFood(null);
  };

  if (showConfirmation && selectedFood) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <ClaimConfirmation 
              food={selectedFood}
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
              <div className="relative">
                <img
                  src={food.photo}
                  alt={food.foodType}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <Badge className="absolute top-3 right-3 bg-green-100 text-green-800">
                  Available
                </Badge>
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold">{food.foodType}</h3>
                    <p className="text-gray-600 text-sm">{food.donorName}</p>
                  </div>
                  <span className="text-sm text-gray-500">{food.distance}</span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Package className="w-4 h-4 mr-2" />
                    Quantity: {food.quantity}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {food.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    Available until {food.availableUntil}
                  </div>
                  {food.donorPhone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      Contact available
                    </div>
                  )}
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
