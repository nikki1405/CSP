
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import TestDonations from '@/components/debug/TestDonations';
import Hero from '@/components/home/Hero';
import QuickActions from '@/components/home/QuickActions';
import ImpactStats from '@/components/home/ImpactStats';
import Newsletter from '@/components/home/Newsletter';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <QuickActions />
        <ImpactStats />
        {process.env.NODE_ENV === 'development' && <TestDonations />}
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
