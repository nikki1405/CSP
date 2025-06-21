import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Clock, Package, Users, TrendingUp, Bell, Calendar, IndianRupee } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useDonations, DonationData } from '@/hooks/useDonations';
import { useMyClaims } from '@/hooks/useMyClaims';

const NGODashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const { donations, isLoading } = useDonations();
  const { claims: myClaimedDonations, isLoading: isClaimsLoading, error: claimsError, refetch: refetchClaims } = useMyClaims(user?.uid);

  // Only show available, non-expired donations
  const availableFood: DonationData[] = donations.filter(donation =>
    donation.status === 'available' &&
    (!donation.expiry_time || new Date(donation.expiry_time) > new Date())
  );

  // Calculate stats from real claimed donations
  const stats = {
    totalClaimed: myClaimedDonations.length,
    activeClaims: myClaimedDonations.filter(d => d.status === 'claimed').length,
    completedClaims: myClaimedDonations.filter(d => d.status === 'completed').length,
    peopleServed: 234 // Keep as mock or update if you have real data
  };

  // Notification generator for NGO
  const notifications = [
    ...myClaimedDonations
      .filter(d => d.status === 'claimed' || d.status === 'completed')
      .map(d => ({
        id: d.id,
        message:
          d.status === 'claimed'
            ? `You have claimed ${d.food_type} from ${d.donor_name}. Await pickup.`
            : `You have completed serving ${d.food_type} from ${d.donor_name}.`,
        time: (d as any).claimed_at ? new Date((d as any).claimed_at).toLocaleString() : '',
        type: d.status,
      })),
    {
      id: '2',
      message: 'New food available near your location',
      time: '1 hour ago',
      type: 'food'
    },
    {
      id: '3',
      message: 'Food drive event tomorrow at 10 AM',
      time: '2 hours ago',
      type: 'event'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const filteredFood = availableFood.filter(food =>
    food.food_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    food.pickup_address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-purple-800 drop-shadow mb-2">
            Welcome back, {user?.displayName || 'NGO'}!
          </h1>
          <p className="text-gray-700">
            Find and claim food donations to support your community programs.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Link to="/claim-food">
            <Card className="card-hover cursor-pointer border-2 border-dashed border-secondary/30 hover:border-secondary bg-gradient-to-br from-purple-100 to-pink-100 shadow-md">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="font-semibold mb-2 text-purple-800">Browse Food</h3>
                <p className="text-sm text-gray-600">Find available food donations</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/money-received">
            <Card className="card-hover cursor-pointer border-2 border-dashed border-green-300 hover:border-green-500 bg-gradient-to-br from-green-100 to-blue-100 shadow-md">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <IndianRupee className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2 text-green-800">Money Received</h3>
                <p className="text-sm text-gray-600">Track monetary donations</p>
              </CardContent>
            </Card>
          </Link>

          <Card className="card-hover bg-gradient-to-br from-purple-100 to-pink-100 shadow-md">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2 text-purple-800">{stats.totalClaimed}</h3>
              <p className="text-sm text-gray-600">Total Claims</p>
            </CardContent>
          </Card>

          <Card className="card-hover bg-gradient-to-br from-orange-100 to-yellow-100 shadow-md">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="font-semibold mb-2 text-orange-800">{stats.activeClaims}</h3>
              <p className="text-sm text-gray-600">Active Claims</p>
            </CardContent>
          </Card>

          <Card className="card-hover bg-gradient-to-br from-green-100 to-blue-100 shadow-md">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2 text-green-800">{stats.peopleServed}</h3>
              <p className="text-sm text-gray-600">People Served</p>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-secondary text-secondary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('available')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'available'
                  ? 'border-secondary text-secondary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Available Food
            </button>
            <button
              onClick={() => setActiveTab('claims')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'claims'
                  ? 'border-secondary text-secondary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Claims
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Available Food Near You</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {availableFood.slice(0, 3).map((food) => (
                      <div key={food.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                            <Package className="w-5 h-5 text-secondary" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{food.food_type}</h4>
                            <p className="text-sm text-gray-600">
                              <MapPin className="w-3 h-3 inline mr-1" />
                              {food.pickup_address} • {food.quantity}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Link to="/claim-food">
                            <Button size="sm" className="bg-secondary hover:bg-secondary-dark">
                              Claim
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Link to="/claim-food">
                      <Button variant="outline" className="w-full">
                        View All Available Food
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Impact This Month
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Food Claimed</span>
                      <span className="font-semibold">67 kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Meals Served</span>
                      <span className="font-semibold">156 meals</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Donors Partnered</span>
                      <span className="font-semibold">12 donors</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="w-5 h-5 mr-2" />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Upcoming Events
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-semibold text-sm">Community Food Drive</h4>
                      <p className="text-xs text-gray-600">Tomorrow, 10:00 AM</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-semibold text-sm">Awareness Campaign</h4>
                      <p className="text-xs text-gray-600">Friday, 2:00 PM</p>
                    </div>
                  </div>
                  <Link to="/events">
                    <Button variant="outline" size="sm" className="w-full mt-4">
                      View All Events
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'available' && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by food type or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <MapPin className="w-4 h-4 mr-2" />
                Map View
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredFood.map((food) => (
                <Card key={food.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{food.food_type}</h3>
                        <p className="text-gray-600">{food.donor_name}</p>
                      </div>
                      <Badge className={getStatusColor(food.status)}>
                        {food.status}
                      </Badge>
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

                    <Link to="/claim-food">
                      <Button className="w-full bg-secondary hover:bg-secondary-dark">
                        Claim This Food
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'claims' && (
          <div className="space-y-4">
            {myClaimedDonations.length === 0 ? (
              <Card className="text-center py-8">
                <CardContent>
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No Claimed Donations</h3>
                  <p className="text-gray-600">You haven't claimed any food donations yet.</p>
                </CardContent>
              </Card>
            ) : myClaimedDonations.map((claim) => (
              <Card key={claim.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                        <Package className="w-6 h-6 text-secondary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{claim.food_type}</h4>
                        <p className="text-sm text-gray-600">{claim.donor_name}</p>
                        <p className="text-sm text-gray-600">
                          <MapPin className="w-3 h-3 inline mr-1" />
                          {claim.pickup_address} • {claim.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(claim.status)}>
                        {claim.status}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-2">
                        Pickup: {('pickup_time' in claim && (claim as any).pickup_time) || (claim.preferences && 'pickup_time' in claim.preferences ? (claim.preferences as any).pickup_time : undefined) || 'TBD'}
                      </p>
                      <p className="text-xs text-gray-500">
                        Claimed: {'claimed_at' in claim && (claim as any).claimed_at ? new Date((claim as any).claimed_at).toLocaleString() : ''}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default NGODashboard;
