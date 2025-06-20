import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  QrCode, 
  DollarSign, 
  History, 
  CheckCircle, 
  Clock, 
  X,
  MapPin,
  Calendar,
  ArrowLeft,
  Star
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const MoneyDonation = () => {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [selectedNGO, setSelectedNGO] = useState('');
  const [showQRScanner, setShowQRScanner] = useState(false);

  // Mock data for NGOs
  const ngos = [
    {
      id: '1',
      name: 'Feed Mumbai Foundation',
      location: 'Mumbai Central',
      rating: 4.8,
      verified: true,
      description: 'Working towards zero hunger in Mumbai since 2010.'
    },
    {
      id: '2',
      name: 'Hunger Relief Network',
      location: 'Andheri West',
      rating: 4.6,
      verified: true,
      description: 'Supporting underprivileged communities with food security.'
    },
    {
      id: '3',
      name: 'Community Kitchen Trust',
      location: 'Bandra',
      rating: 4.9,
      verified: true,
      description: 'Operating community kitchens across Mumbai suburbs.'
    }
  ];

  // Mock payment history
  const paymentHistory = [
    {
      id: '1',
      amount: 500,
      ngoName: 'Feed Mumbai Foundation',
      date: '2024-01-15',
      status: 'completed',
      transactionId: 'TXN123456789'
    },
    {
      id: '2',
      amount: 1000,
      ngoName: 'Hunger Relief Network',
      date: '2024-01-10',
      status: 'completed',
      transactionId: 'TXN123456788'
    },
    {
      id: '3',
      amount: 750,
      ngoName: 'Community Kitchen Trust',
      date: '2024-01-05',
      status: 'pending',
      transactionId: 'TXN123456787'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'failed': return <X className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Money Donation</h1>
          <p className="text-gray-600">Support our NGO partners in their mission to fight hunger</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Select NGO and Amount</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {ngos.map((ngo) => (
                  <div
                    key={ngo.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedNGO === ngo.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-600'
                    }`}
                    onClick={() => setSelectedNGO(ngo.id)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{ngo.name}</h3>
                        <p className="text-sm text-gray-600">{ngo.description}</p>
                      </div>
                      <Badge variant="secondary" className="flex items-center">
                        <Star className="w-4 h-4 mr-1 text-yellow-500" />
                        {ngo.rating}
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      {ngo.location}
                    </div>
                  </div>
                ))}

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="amount">Donation Amount (₹)</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="text-lg"
                    />
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {[100, 500, 1000, 5000].map((quickAmount) => (
                      <Button
                        key={quickAmount}
                        variant={amount === String(quickAmount) ? 'default' : 'outline'}
                        onClick={() => setAmount(String(quickAmount))}
                      >
                        ₹{quickAmount}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  size="lg"
                  disabled={!selectedNGO || !amount}
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Proceed to Payment
                </Button>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentHistory.map((payment) => (
                    <div
                      key={payment.id}
                      className="p-4 rounded-lg border space-y-2"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">₹{payment.amount}</p>
                          <p className="text-sm text-gray-600">{payment.ngoName}</p>
                        </div>
                        <Badge className={getStatusColor(payment.status)}>
                          {getStatusIcon(payment.status)}
                          <span className="ml-1">{payment.status}</span>
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(payment.date).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MoneyDonation;
