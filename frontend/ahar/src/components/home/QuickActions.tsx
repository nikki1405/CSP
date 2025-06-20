
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Search, Calendar, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const QuickActions = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleAction = (action: string) => {
    if (!user) {
      navigate('/register');
      return;
    }

    switch (action) {
      case 'post':
        navigate('/post-food');
        break;
      case 'claim':
        navigate('/claim-food');
        break;
      case 'events':
        navigate('/events');
        break;
      case 'newsletter':
        // Scroll to newsletter section
        document.getElementById('newsletter')?.scrollIntoView({ behavior: 'smooth' });
        break;
    }
  };

  const actions = [
    {
      id: 'post',
      title: 'Post Food',
      description: 'Share surplus food with NGOs in your area',
      icon: Plus,
      color: 'bg-primary',
      available: !user || user.role === 'donor'
    },
    {
      id: 'claim',
      title: 'Claim Food',
      description: 'Find and claim available food donations',
      icon: Search,
      color: 'bg-secondary',
      available: !user || user.role === 'ngo'
    },
    {
      id: 'events',
      title: 'View Events',
      description: 'Join community events and food drives',
      icon: Calendar,
      color: 'bg-accent',
      available: true
    },
    {
      id: 'newsletter',
      title: 'Subscribe',
      description: 'Get updates on impact and opportunities',
      icon: Mail,
      color: 'bg-earth',
      available: true
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-heading font-bold text-gray-900 mb-4">
            Take Action Today
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose your path to making a difference in your community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {actions.filter(action => action.available).map((action) => {
            const IconComponent = action.icon;
            return (
              <Card key={action.id} className="group cursor-pointer card-hover border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 rounded-full ${action.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">
                    {action.title}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    {action.description}
                  </p>
                  <Button
                    onClick={() => handleAction(action.id)}
                    variant="outline"
                    className="w-full group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300"
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default QuickActions;
