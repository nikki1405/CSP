import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, User, Package } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

import { DonationData } from '@/hooks/useDonations';

interface DonationCardProps {
  donation: DonationData;
  onClaim?: () => void;
}

export function DonationCard({ donation, onClaim }: DonationCardProps) {  const isAvailable = donation.status === 'available';
  
  const timeLeft = donation.expiry_time ? 
    formatDistanceToNow(new Date(donation.expiry_time), { addSuffix: true }) : 
    'No expiry set';
    
  const postedTime = donation.created_at ? 
    formatDistanceToNow(new Date(donation.created_at), { addSuffix: true }) : 
    'Recently';

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold">
              {donation.food_type}
              <Badge 
                variant={isAvailable ? "default" : "secondary"}
                className="ml-2"
              >
                {donation.status}
              </Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground">Posted {postedTime}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <Package className="h-4 w-4 mr-2 text-blue-500" />
            <span>Quantity: {donation.quantity}</span>
          </div>
          
          <div className="flex items-start text-sm">
            <MapPin className="h-4 w-4 mr-2 text-blue-500 mt-1" />
            <span>{donation.pickup_address}</span>
          </div>

          <div className="flex items-center text-sm">
            <User className="h-4 w-4 mr-2 text-blue-500" />
            <span>Donor: {donation.donor_name}</span>
          </div>

          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-2 text-blue-500" />
            <span>Best before: {timeLeft}</span>
          </div>

          {donation.description && (
            <p className="text-sm text-gray-600 mt-2">
              {donation.description}
            </p>
          )}

          {isAvailable && onClaim && (
            <Button 
              className="w-full mt-4" 
              onClick={onClaim}
            >
              Claim Food
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
