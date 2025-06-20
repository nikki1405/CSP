
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Heart } from 'lucide-react';

interface RoleSelectorProps {
  selectedRole: 'donor' | 'ngo' | null;
  onRoleSelect: (role: 'donor' | 'ngo') => void;
}

const RoleSelector = ({ selectedRole, onRoleSelect }: RoleSelectorProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-heading font-semibold mb-2">Choose Your Role</h3>
        <p className="text-gray-600">How would you like to contribute to our community?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card 
          className={`cursor-pointer transition-all duration-300 ${
            selectedRole === 'donor' 
              ? 'ring-2 ring-primary bg-primary/5' 
              : 'hover:shadow-lg hover:-translate-y-1'
          }`}
          onClick={() => onRoleSelect('donor')}
        >
          <CardContent className="p-6 text-center">
            <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
              selectedRole === 'donor' ? 'bg-primary text-white' : 'bg-primary/10 text-primary'
            }`}>
              <Heart className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-semibold mb-2">Food Donor</h4>
            <p className="text-gray-600 text-sm mb-4">
              Share surplus food from restaurants, events, or households with NGOs in need.
            </p>
            <Button 
              variant={selectedRole === 'donor' ? 'default' : 'outline'}
              className="w-full"
            >
              {selectedRole === 'donor' ? 'Selected' : 'Select Donor Role'}
            </Button>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all duration-300 ${
            selectedRole === 'ngo' 
              ? 'ring-2 ring-secondary bg-secondary/5' 
              : 'hover:shadow-lg hover:-translate-y-1'
          }`}
          onClick={() => onRoleSelect('ngo')}
        >
          <CardContent className="p-6 text-center">
            <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
              selectedRole === 'ngo' ? 'bg-secondary text-white' : 'bg-secondary/10 text-secondary'
            }`}>
              <Users className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-semibold mb-2">NGO</h4>
            <p className="text-gray-600 text-sm mb-4">
              Find and claim food donations to support your community programs and beneficiaries.
            </p>
            <Button 
              variant={selectedRole === 'ngo' ? 'default' : 'outline'}
              className={`w-full ${selectedRole === 'ngo' ? 'bg-secondary hover:bg-secondary-dark' : ''}`}
            >
              {selectedRole === 'ngo' ? 'Selected' : 'Select NGO Role'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RoleSelector;
