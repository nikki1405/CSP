
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const Hero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate(user.role === 'donor' ? '/donor-dashboard' : '/ngo-dashboard');
    } else {
      navigate('/register');
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 gradient-bg opacity-10"></div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-gray-900 leading-tight">
            Bridge the Gap Between
            <span className="text-primary"> Food Waste </span>
            and
            <span className="text-secondary"> Hunger</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Aahaar Setu connects food donors with NGOs to ensure surplus food reaches those who need it most, 
            building sustainable communities one meal at a time.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="bg-primary hover:bg-primary-dark text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Started Today
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/events')}
              className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-6 text-lg rounded-full transition-all duration-300"
            >
              View Events
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white rounded-2xl p-6 shadow-lg card-hover">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🍽️</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Post Food</h3>
              <p className="text-gray-600">Share surplus food with nearby NGOs and make a difference</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg card-hover">
              <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Claim Food</h3>
              <p className="text-gray-600">NGOs can easily find and claim available food donations</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg card-hover">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🌱</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Build Community</h3>
              <p className="text-gray-600">Join events and educational programs for sustainable impact</p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ArrowDown className="w-6 h-6 text-gray-400" />
      </div>
    </section>
  );
};

export default Hero;
