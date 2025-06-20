
import { useEffect, useState } from 'react';

const ImpactStats = () => {
  const [stats, setStats] = useState({
    foodSaved: 0,
    mealsProvided: 0,
    ngosConnected: 0,
    donorsActive: 0
  });

  useEffect(() => {
    // Simulate counting animation
    const targetStats = {
      foodSaved: 12500,
      mealsProvided: 8750,
      ngosConnected: 156,
      donorsActive: 892
    };

    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setStats({
        foodSaved: Math.floor(targetStats.foodSaved * progress),
        mealsProvided: Math.floor(targetStats.mealsProvided * progress),
        ngosConnected: Math.floor(targetStats.ngosConnected * progress),
        donorsActive: Math.floor(targetStats.donorsActive * progress)
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setStats(targetStats);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <section className="py-20 gradient-bg text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-heading font-bold mb-4">
            Our Impact So Far
          </h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Together, we're making a real difference in fighting hunger and reducing food waste
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-5xl font-bold mb-2">
              {formatNumber(stats.foodSaved)}
            </div>
            <div className="text-xl opacity-90">kg</div>
            <div className="text-lg mt-2">Food Saved</div>
          </div>

          <div className="text-center">
            <div className="text-5xl font-bold mb-2">
              {formatNumber(stats.mealsProvided)}
            </div>
            <div className="text-xl opacity-90">+</div>
            <div className="text-lg mt-2">Meals Provided</div>
          </div>

          <div className="text-center">
            <div className="text-5xl font-bold mb-2">
              {formatNumber(stats.ngosConnected)}
            </div>
            <div className="text-xl opacity-90">NGOs</div>
            <div className="text-lg mt-2">Connected</div>
          </div>

          <div className="text-center">
            <div className="text-5xl font-bold mb-2">
              {formatNumber(stats.donorsActive)}
            </div>
            <div className="text-xl opacity-90">Donors</div>
            <div className="text-lg mt-2">Active</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactStats;
