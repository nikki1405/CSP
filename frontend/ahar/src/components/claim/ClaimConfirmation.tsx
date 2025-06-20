
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MapPin, Phone, Mail, Navigation, Clock, Package, User, Home } from 'lucide-react';

interface ClaimConfirmationProps {
  food: {
    id: string;
    foodType: string;
    quantity: string;
    donorName: string;
    donorPhone?: string;
    donorEmail: string;
    donorAddress: string;
    pickupLocation: {
      address: string;
      lat: number;
      lng: number;
    };
    availableUntil: string;
    description: string;
    photo?: string;
  };
  onConfirm: () => void;
  onCancel: () => void;
}

const ClaimConfirmation = ({ food, onConfirm, onCancel }: ClaimConfirmationProps) => {
  const [showMap, setShowMap] = useState(false);

  const openGoogleMaps = () => {
    const { lat, lng } = food.pickupLocation;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
    window.open(url, '_blank');
  };

  const callDonor = () => {
    if (food.donorPhone) {
      window.open(`tel:${food.donorPhone}`);
    }
  };

  const emailDonor = () => {
    const subject = `Food Collection - ${food.foodType}`;
    const body = `Hello ${food.donorName},\n\nI am writing to coordinate the pickup of the ${food.foodType} (${food.quantity}) that I have claimed through Aahaar Setu.\n\nPlease let me know the best time for pickup.\n\nThank you for your generous donation!\n\nBest regards`;
    window.open(`mailto:${food.donorEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  return (
    <>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center flex items-center justify-center">
            <Package className="mr-2" />
            Confirm Food Claim
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <Package className="h-4 w-4" />
            <AlertDescription>
              Please review all details and contact information before confirming your claim.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Food Details */}
            <div className="space-y-4">
              {food.photo && (
                <img
                  src={food.photo}
                  alt={food.foodType}
                  className="w-full h-48 object-cover rounded-lg"
                />
              )}
              <div>
                <h3 className="text-xl font-semibold">{food.foodType}</h3>
                <Badge variant="secondary" className="mt-1">
                  {food.quantity}
                </Badge>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Description</h4>
                <p className="text-gray-600">{food.description}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Availability
                </h4>
                <p className="text-gray-600">Until {food.availableUntil}</p>
              </div>
            </div>

            {/* Donor & Location Details */}
            <div className="space-y-4">
              <Card className="border-2 border-secondary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Donor Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-semibold">{food.donorName}</p>
                  </div>
                  
                  {food.donorPhone && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-2" />
                        {food.donorPhone}
                      </div>
                      <Button size="sm" variant="outline" onClick={callDonor}>
                        Call
                      </Button>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      {food.donorEmail}
                    </div>
                    <Button size="sm" variant="outline" onClick={emailDonor}>
                      Email
                    </Button>
                  </div>
                  
                  <div>
                    <div className="flex items-start text-sm text-gray-600 mb-2">
                      <Home className="w-4 h-4 mr-2 mt-0.5" />
                      <span>{food.donorAddress}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Pickup Location
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start text-sm text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-2 mt-0.5" />
                    <span>{food.pickupLocation.address}</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={openGoogleMaps}
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      Get Directions
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setShowMap(true)}
                    >
                      View Map
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Alert className="bg-blue-50 border-blue-200">
            <Phone className="h-4 w-4" />
            <AlertDescription>
              <strong>Next Steps:</strong> After claiming, contact the donor to coordinate pickup time. 
              The donor will be notified of your claim and can approve the pickup.
            </AlertDescription>
          </Alert>

          <div className="flex space-x-4">
            <Button
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              className="flex-1 bg-secondary hover:bg-secondary/90"
            >
              Confirm Claim
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Map Dialog */}
      <Dialog open={showMap} onOpenChange={setShowMap}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Pickup Location Map</DialogTitle>
          </DialogHeader>
          <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Interactive map would be displayed here</p>
              <p className="text-sm text-gray-500 mb-4">
                Coordinates: {food.pickupLocation.lat}, {food.pickupLocation.lng}
              </p>
              <Button onClick={openGoogleMaps} className="bg-green-600 hover:bg-green-700">
                <Navigation className="w-4 h-4 mr-2" />
                Open in Google Maps
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ClaimConfirmation;
