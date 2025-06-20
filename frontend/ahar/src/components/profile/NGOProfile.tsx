import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Building,
  Users,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Clock,
  Check,
  AlertTriangle,
  Award,
  Utensils,
  UserCheck,
  FileCheck,
} from 'lucide-react';
import { UserData, AvailableFood } from '@/types/auth';

interface NGOProfileProps {
  userData: UserData;
  isEditing: boolean;
  onUpdate: (data: Partial<UserData>) => void;
}

export default function NGOProfile({ userData, isEditing, onUpdate }: NGOProfileProps) {
  // Mock data for available food (replace with real data from your backend)
  const [availableFoodItems] = useState<AvailableFood[]>([
    {
      id: '1',
      donorName: 'Restaurant A',
      foodType: 'Cooked Food',
      quantity: '25 meals',
      pickupAddress: '123 Main St, Mumbai',
      expiryTime: '2025-06-15T18:00:00',
      status: 'available'
    },
    {
      id: '2',
      donorName: 'Hotel B',
      foodType: 'Packaged Food',
      quantity: '10 kg',
      pickupAddress: '456 Park Ave, Mumbai',
      expiryTime: '2025-06-16T12:00:00',
      status: 'claimed'
    }
  ]);

  const stats = userData.ngoStats || {
    totalDonationsReceived: 0,
    activeVolunteers: 0,
    peopleServedDaily: 0,
    totalPeopleHelped: 0,
    totalEventsOrganized: 0,
    successfulPickups: 0
  };

  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="organization">Organization Details</TabsTrigger>
        <TabsTrigger value="available-food">Available Food</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        {/* NGO Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between p-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Donations Received</p>
                  <h3 className="text-3xl font-bold text-blue-600">{stats.totalDonationsReceived}</h3>
                  <p className="text-xs text-muted-foreground mt-1">Total Donations</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Utensils className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between p-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Volunteers</p>
                  <h3 className="text-3xl font-bold text-green-600">{stats.activeVolunteers}</h3>
                  <p className="text-xs text-muted-foreground mt-1">Current Team</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <UserCheck className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between p-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">People Served Daily</p>
                  <h3 className="text-3xl font-bold text-yellow-600">{stats.peopleServedDaily}</h3>
                  <p className="text-xs text-muted-foreground mt-1">Average</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Users className="h-8 w-8 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Location and Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isEditing ? (
                  <div className="grid gap-3">
                    <div>
                      <Label>Street Address</Label>
                      <Input
                        value={userData.address?.street || ''}
                        onChange={(e) => onUpdate({
                          address: { ...userData.address, street: e.target.value }
                        })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>City</Label>
                        <Input
                          value={userData.address?.city || ''}
                          onChange={(e) => onUpdate({
                            address: { ...userData.address, city: e.target.value }
                          })}
                        />
                      </div>
                      <div>
                        <Label>PIN Code</Label>
                        <Input
                          value={userData.address?.pincode || ''}
                          onChange={(e) => onUpdate({
                            address: { ...userData.address, pincode: e.target.value }
                          })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Operating Areas</Label>
                      <Input
                        value={userData.ngoDetails?.operatingAreas?.join(', ') || ''}
                        onChange={(e) => onUpdate({
                          ngoDetails: {
                            ...userData.ngoDetails,
                            operatingAreas: e.target.value.split(',').map(area => area.trim())
                          }
                        })}
                        placeholder="Enter areas separated by commas"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="font-medium">{userData.address?.street}</p>
                    <p className="text-sm text-gray-600">
                      {userData.address?.city}, {userData.address?.pincode}
                    </p>
                    <Separator className="my-4" />
                    <div>
                      <Label className="text-sm text-muted-foreground">Operating Areas</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {userData.ngoDetails?.operatingAreas?.map((area) => (
                          <Badge key={area} variant="outline">{area}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-blue-600" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isEditing ? (
                  <div className="grid gap-3">
                    <div>
                      <Label>Contact Person Name</Label>
                      <Input
                        value={userData.ngoDetails?.contactPerson?.name || ''}
                        onChange={(e) => onUpdate({
                          ngoDetails: {
                            ...userData.ngoDetails,
                            contactPerson: {
                              ...userData.ngoDetails?.contactPerson,
                              name: e.target.value
                            }
                          }
                        })}
                      />
                    </div>
                    <div>
                      <Label>Role</Label>
                      <Input
                        value={userData.ngoDetails?.contactPerson?.role || ''}
                        onChange={(e) => onUpdate({
                          ngoDetails: {
                            ...userData.ngoDetails,
                            contactPerson: {
                              ...userData.ngoDetails?.contactPerson,
                              role: e.target.value
                            }
                          }
                        })}
                      />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input
                        value={userData.ngoDetails?.contactPerson?.phone || ''}
                        onChange={(e) => onUpdate({
                          ngoDetails: {
                            ...userData.ngoDetails,
                            contactPerson: {
                              ...userData.ngoDetails?.contactPerson,
                              phone: e.target.value
                            }
                          }
                        })}
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input
                        value={userData.ngoDetails?.contactPerson?.email || ''}
                        onChange={(e) => onUpdate({
                          ngoDetails: {
                            ...userData.ngoDetails,
                            contactPerson: {
                              ...userData.ngoDetails?.contactPerson,
                              email: e.target.value
                            }
                          }
                        })}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm text-muted-foreground">Contact Person</Label>
                      <p className="font-medium">{userData.ngoDetails?.contactPerson?.name}</p>
                      <p className="text-sm text-gray-600">{userData.ngoDetails?.contactPerson?.role}</p>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span>{userData.ngoDetails?.contactPerson?.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span>{userData.ngoDetails?.contactPerson?.email}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="organization" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Organization Details</CardTitle>
            <CardDescription>
              Information about your NGO and certifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Registration Number</Label>
                  <Input
                    value={userData.ngoDetails?.registrationNumber || ''}
                    onChange={(e) => onUpdate({
                      ngoDetails: { ...userData.ngoDetails, registrationNumber: e.target.value }
                    })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Established Year</Label>
                  <Input
                    value={userData.ngoDetails?.establishedYear || ''}
                    onChange={(e) => onUpdate({
                      ngoDetails: { ...userData.ngoDetails, establishedYear: e.target.value }
                    })}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Storage Capacity</Label>
                  <Input
                    value={userData.ngoDetails?.capacity?.storageCapacity || ''}
                    onChange={(e) => onUpdate({
                      ngoDetails: {
                        ...userData.ngoDetails,
                        capacity: { ...userData.ngoDetails?.capacity, storageCapacity: e.target.value }
                      }
                    })}
                    disabled={!isEditing}
                    placeholder="e.g., 500 kg"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Daily Serving Capacity</Label>
                  <Input
                    type="number"
                    value={userData.ngoDetails?.capacity?.dailyServingCapacity || ''}
                    onChange={(e) => onUpdate({
                      ngoDetails: {
                        ...userData.ngoDetails,
                        capacity: { ...userData.ngoDetails?.capacity, dailyServingCapacity: parseInt(e.target.value) }
                      }
                    })}
                    disabled={!isEditing}
                    placeholder="Number of people"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Certifications</Label>
                <div className="flex flex-wrap gap-2">
                  {userData.ngoDetails?.certifications?.map((cert, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      <FileCheck className="h-4 w-4" />
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="available-food" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Available Food</CardTitle>
            <CardDescription>
              Current food donations available for pickup
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {availableFoodItems.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-semibold">{item.donorName}</h4>
                        <p className="text-sm text-gray-600">{item.foodType}</p>
                      </div>
                      <Badge variant={item.status === 'available' ? 'default' : 'secondary'}>
                        {item.status === 'available' ? (
                          <Check className="h-4 w-4 mr-1" />
                        ) : (
                          <Clock className="h-4 w-4 mr-1" />
                        )}
                        {item.status}
                      </Badge>
                    </div>

                    <div className="grid gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>{item.pickupAddress}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>Expires: {new Date(item.expiryTime).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Utensils className="h-4 w-4 text-gray-500" />
                        <span>Quantity: {item.quantity}</span>
                      </div>
                    </div>

                    {item.status === 'available' && (
                      <Button className="w-full mt-4">
                        Claim Food
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
