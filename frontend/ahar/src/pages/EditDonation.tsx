import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { donationApi } from '@/lib/api';
import { DonationData } from '@/hooks/useDonations';
import { Loader2 } from 'lucide-react';

interface FormData {
  foodType: string;
  quantity: string;
  description: string;
  pickupAddress: string;
  expiryTime: string;
  specialInstructions: string;
}

export default function EditDonation() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    foodType: '',
    quantity: '',
    description: '',
    pickupAddress: '',
    expiryTime: '',
    specialInstructions: ''
  });

  useEffect(() => {
    const fetchDonation = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const response = await donationApi.listDonations();
        
        if (!Array.isArray(response)) {
          throw new Error('Invalid response format');
        }

        const donation = response.find(d => d.id === id) as DonationData | undefined;
        
        if (donation) {
          setFormData({
            foodType: donation.food_type || '',
            quantity: donation.quantity || '',
            description: donation.description || '',
            pickupAddress: donation.pickup_address || '',
            expiryTime: donation.expiry_time ? new Date(donation.expiry_time).toISOString().slice(0, 16) : '',
            specialInstructions: donation.preferences?.special_instructions || ''
          });
        } else {
          toast({
            title: "Error",
            description: "Donation not found",
            variant: "destructive",
          });
          navigate('/donor-dashboard');
        }
      } catch (error) {
        console.error('Error fetching donation:', error);
        toast({
          title: "Error",
          description: "Failed to fetch donation details",
          variant: "destructive",
        });
        navigate('/donor-dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDonation();
  }, [id, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      if (!id) {
        throw new Error('Donation ID is required');
      }

      // Validate required fields
      const requiredFields = {
        'Food Type': formData.foodType,
        'Quantity': formData.quantity,
        'Pickup Address': formData.pickupAddress,
        'Best Before': formData.expiryTime
      };

      const emptyFields = Object.entries(requiredFields)
        .filter(([_, value]) => !value.trim())
        .map(([field]) => field);

      if (emptyFields.length > 0) {
        throw new Error(`Please fill in: ${emptyFields.join(', ')}`);
      }

      // Prepare update data
      const updateData = {
        food_type: formData.foodType.trim(),
        quantity: formData.quantity.trim(),
        description: formData.description.trim(),
        pickup_address: formData.pickupAddress.trim(),
        expiry_time: formData.expiryTime,
        preferences: {
          special_instructions: formData.specialInstructions?.trim() || ''
        }
      };

      console.log('Submitting update:', updateData);

      await donationApi.updateFood(id, updateData);

      toast({
        title: "Success",
        description: "Donation updated successfully",
      });
      
      navigate('/donor-dashboard');
    } catch (error: any) {
      console.error('Error updating donation:', error);
      
      toast({
        title: "Error",
        description: error.message || "Failed to update donation",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto py-8 px-4">
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-8 px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Edit Food Donation</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="foodType">Food Type</Label>
                <Input
                  id="foodType"
                  value={formData.foodType}
                  onChange={(e) => setFormData({ ...formData, foodType: e.target.value })}
                  placeholder="E.g., Cooked meals, Raw vegetables"
                  required
                />
              </div>

              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="E.g., 20 meals, 5 kg"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the food items, packaging, etc."
                  required
                />
              </div>

              <div>
                <Label htmlFor="pickupAddress">Pickup Address</Label>
                <Textarea
                  id="pickupAddress"
                  value={formData.pickupAddress}
                  onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })}
                  placeholder="Enter complete pickup address"
                  required
                />
              </div>

              <div>
                <Label htmlFor="expiryTime">Best Before</Label>
                <Input
                  id="expiryTime"
                  type="datetime-local"
                  value={formData.expiryTime}
                  onChange={(e) => setFormData({ ...formData, expiryTime: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="specialInstructions">Special Instructions (Optional)</Label>
                <Textarea
                  id="specialInstructions"
                  value={formData.specialInstructions}
                  onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                  placeholder="Any special instructions for pickup or handling"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/donor-dashboard')}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Donation'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
