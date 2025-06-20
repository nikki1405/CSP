
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true);
      setIsLoading(false);
      toast({
        title: "Successfully Subscribed!",
        description: "Thank you for joining our newsletter. You'll receive updates about our impact and opportunities to help.",
      });
    }, 1000);
  };

  if (isSubscribed) {
    return (
      <section id="newsletter" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto text-center bg-white shadow-lg">
            <CardContent className="p-12">
              <CheckCircle className="w-16 h-16 text-success mx-auto mb-6" />
              <h3 className="text-2xl font-heading font-bold mb-4">
                Welcome to Our Community!
              </h3>
              <p className="text-gray-600">
                You're now subscribed to receive updates about our impact, success stories, 
                and new opportunities to make a difference.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="newsletter" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto bg-white shadow-lg">
          <CardContent className="p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center mb-4">
                  <Mail className="w-8 h-8 text-primary mr-3" />
                  <h3 className="text-3xl font-heading font-bold">
                    Stay Connected
                  </h3>
                </div>
                <p className="text-gray-600 mb-6 text-lg">
                  Join our newsletter to receive inspiring success stories, hunger statistics, 
                  sustainability tips, and updates about upcoming community events.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success mr-2" />
                    Weekly impact reports
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success mr-2" />
                    Sustainability tips and guides
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success mr-2" />
                    Exclusive event invitations
                  </li>
                </ul>
              </div>

              <div>
                <form onSubmit={handleSubscribe} className="space-y-4">
                  <div>
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-lg py-6"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary hover:bg-primary-dark text-white py-6 text-lg rounded-lg"
                  >
                    {isLoading ? 'Subscribing...' : 'Subscribe to Newsletter'}
                  </Button>
                  <p className="text-sm text-gray-500 text-center">
                    We respect your privacy. Unsubscribe at any time.
                  </p>
                </form>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Newsletter;
