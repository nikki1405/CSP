import { UserData } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Heart, Clock, Award, MapPin, Calendar } from 'lucide-react';

interface DonorProfileProps {
  userData: UserData;
  isEditing: boolean;
  onUpdate: (data: Partial<UserData>) => void;
}

const foodTypes = [
  { type: 'Cooked Food', icon: '🍲' },
  { type: 'Raw Food', icon: '🥬' },
  { type: 'Packaged Food', icon: '📦' },
  { type: 'Beverages', icon: '🥤' },
  { type: 'Fruits', icon: '🍎' },
  { type: 'Vegetables', icon: '🥕' }
] as const;

const weekDays = [
  { day: 'Monday', short: 'Mon' },
  { day: 'Tuesday', short: 'Tue' },
  { day: 'Wednesday', short: 'Wed' },
  { day: 'Thursday', short: 'Thu' },
  { day: 'Friday', short: 'Fri' },
  { day: 'Saturday', short: 'Sat' },
  { day: 'Sunday', short: 'Sun' }
] as const;

export default function DonorProfile({ userData, isEditing, onUpdate }: DonorProfileProps) {
  const stats = userData.donorStats || {
    donationsCount: 0,
    peopleHelped: 0,
    volunteeredHours: 0
  };

  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="preferences">Preferences</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between p-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Donations</p>
                  <h3 className="text-3xl font-bold text-blue-600">{stats.donationsCount}</h3>
                  <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Heart className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between p-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">People Helped</p>
                  <h3 className="text-3xl font-bold text-yellow-600">{stats.peopleHelped}</h3>
                  <p className="text-xs text-muted-foreground mt-1">Total Impact</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Award className="h-8 w-8 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between p-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Volunteer Hours</p>
                  <h3 className="text-3xl font-bold text-green-600">{stats.volunteeredHours}</h3>
                  <p className="text-xs text-muted-foreground mt-1">Total Hours</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Clock className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bio and Address */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  placeholder="Tell us about yourself..."
                  value={userData.bio || ''}
                  onChange={(e) => onUpdate({ bio: e.target.value })}
                  rows={4}
                  className="resize-none"
                />
              ) : (
                <p className="text-gray-600 leading-relaxed">
                  {userData.bio || 'No bio provided yet.'}
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                Food Pickup Address
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
                    <div>
                      <Label>Landmark</Label>
                      <Input
                        value={userData.address?.landmark || ''}
                        onChange={(e) => onUpdate({
                          address: { ...userData.address, landmark: e.target.value }
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
                  </div>
                ) : (
                  <div className="space-y-2">
                    {userData.address?.street ? (
                      <>
                        <p className="font-medium">{userData.address.street}</p>
                        {userData.address.landmark && (
                          <p className="text-sm text-gray-600">Near: {userData.address.landmark}</p>
                        )}
                        <p className="text-sm text-gray-600">
                          {userData.address.city}, {userData.address.pincode}
                        </p>
                      </>
                    ) : (
                      <p className="text-gray-600">No pickup address provided yet.</p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="preferences" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-blue-600" />
                Food Types
              </CardTitle>
              <CardDescription>
                Select the types of food you can donate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {foodTypes.map(({ type, icon }) => (
                  <Button
                    key={type}
                    variant={userData.preferences?.foodTypes?.includes(type) ? "default" : "outline"}
                    onClick={() => {
                      if (isEditing) {
                        const types = userData.preferences?.foodTypes || [];
                        const newTypes = types.includes(type)
                          ? types.filter(t => t !== type)
                          : [...types, type];
                        onUpdate({
                          preferences: { ...userData.preferences, foodTypes: newTypes }
                        });
                      }
                    }}
                    disabled={!isEditing}
                    className="h-auto py-3 px-4"
                  >
                    <span className="mr-2">{icon}</span>
                    {type}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Availability
              </CardTitle>
              <CardDescription>
                Set your preferred days and times for food pickup
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label className="text-sm font-medium">Available Days</Label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {weekDays.map(({ day, short }) => (
                    <Button
                      key={day}
                      variant={userData.preferences?.availableDays?.includes(day) ? "default" : "outline"}
                      onClick={() => {
                        if (isEditing) {
                          const days = userData.preferences?.availableDays || [];
                          const newDays = days.includes(day)
                            ? days.filter(d => d !== day)
                            : [...days, day];
                          onUpdate({
                            preferences: { ...userData.preferences, availableDays: newDays }
                          });
                        }
                      }}
                      disabled={!isEditing}
                      className="h-auto py-2"
                    >
                      <span className="hidden sm:inline">{day}</span>
                      <span className="sm:hidden">{short}</span>
                    </Button>
                  ))}
                </div>

                <div className="space-y-2 pt-4">
                  <Label className="text-sm font-medium">Preferred Time Slots</Label>
                  <Select
                    disabled={!isEditing}
                    value={userData.preferences?.preferredTime}
                    onValueChange={(value) => onUpdate({
                      preferences: { ...userData.preferences, preferredTime: value }
                    })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select preferred time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">
                        <div className="flex items-center">
                          <span className="mr-2">🌅</span>
                          Morning (6 AM - 12 PM)
                        </div>
                      </SelectItem>
                      <SelectItem value="afternoon">
                        <div className="flex items-center">
                          <span className="mr-2">☀️</span>
                          Afternoon (12 PM - 4 PM)
                        </div>
                      </SelectItem>
                      <SelectItem value="evening">
                        <div className="flex items-center">
                          <span className="mr-2">🌅</span>
                          Evening (4 PM - 8 PM)
                        </div>
                      </SelectItem>
                      <SelectItem value="night">
                        <div className="flex items-center">
                          <span className="mr-2">🌙</span>
                          Night (8 PM - 11 PM)
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
}
