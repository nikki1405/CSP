import { useState } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Calendar, MapPin, Users, Clock, Search, Filter } from 'lucide-react';

const events = [
  {
    id: '1',
    title: 'Community Food Drive',
    description: 'Join us in collecting food donations for underprivileged families in the Dharavi area. We aim to collect 500kg of food items.',
    date: '2024-12-30',
    time: '10:00 AM - 4:00 PM',
    location: 'Dharavi Community Center, Mumbai',
    organizer: 'Mumbai Food Relief NGO',
    type: 'drive',
    registrations: 45,
    maxParticipants: 100,
    image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=200&fit=crop'
  },
  {
    id: '2',
    title: 'Zero Hunger Awareness Campaign',
    description: 'Educational campaign to raise awareness about food waste and hunger in urban areas. Interactive workshops and discussions.',
    date: '2025-01-05',
    time: '2:00 PM - 6:00 PM',
    location: 'Phoenix Mills, Lower Parel',
    organizer: 'Aahaar Setu Team',
    type: 'awareness',
    registrations: 23,
    maxParticipants: 50,
    image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&h=200&fit=crop'
  },
  {
    id: '3',
    title: 'Restaurant Partnership Program',
    description: 'Workshop for restaurant owners to learn about food donation processes and build partnerships with local NGOs.',
    date: '2025-01-10',
    time: '11:00 AM - 3:00 PM',
    location: 'Hotel Association Hall, Bandra',
    organizer: 'Mumbai Restaurant Association',
    type: 'campaign',
    registrations: 18,
    maxParticipants: 30,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=200&fit=crop'
  },
  {
    id: '4',
    title: 'Monthly Food Distribution',
    description: 'Regular monthly food distribution drive for homeless individuals. Volunteers needed for packaging and distribution.',
    date: '2025-01-15',
    time: '7:00 AM - 11:00 AM',
    location: 'CST Railway Station Area',
    organizer: 'Street Care Foundation',
    type: 'drive',
    registrations: 67,
    maxParticipants: 80,
    image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=400&h=200&fit=crop'
  },
  {
    id: '5',
    title: 'Food Safety & Hygiene Workshop',
    description: 'Training session on food safety practices for NGOs and volunteers involved in food collection and distribution.',
    date: '2025-01-20',
    time: '3:00 PM - 5:00 PM',
    location: 'Online (Zoom)',
    organizer: 'Food Safety Council',
    type: 'awareness',
    registrations: 89,
    maxParticipants: 200,
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=200&fit=crop'
  },
  {
    id: '6',
    title: 'Corporate Social Responsibility Meet',
    description: 'Networking event for corporate teams interested in food donation CSR activities and sustainable practices.',
    date: '2025-01-25',
    time: '6:00 PM - 8:00 PM',
    location: 'BKC Convention Center',
    organizer: 'CSR Network India',
    type: 'campaign',
    registrations: 34,
    maxParticipants: 75,
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=200&fit=crop'
  }
];

const getTypeColor = (type: string) => {
  switch (type) {
    case 'drive': return 'bg-green-100 text-green-800';
    case 'awareness': return 'bg-blue-100 text-blue-800';
    case 'campaign': return 'bg-purple-100 text-purple-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default function Events() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || event.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Upcoming Events</h1>
          <p className="text-gray-600">Join our food donation and awareness events to make a difference</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              className="pl-10"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={selectedFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedFilter('all')}
            >
              All
            </Button>
            <Button
              variant={selectedFilter === 'drive' ? 'default' : 'outline'}
              onClick={() => setSelectedFilter('drive')}
            >
              Food Drives
            </Button>
            <Button
              variant={selectedFilter === 'awareness' ? 'default' : 'outline'}
              onClick={() => setSelectedFilter('awareness')}
            >
              Awareness
            </Button>
            <Button
              variant={selectedFilter === 'campaign' ? 'default' : 'outline'}
              onClick={() => setSelectedFilter('campaign')}
            >
              Campaigns
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-6">
                <Badge className={`mb-2 ${getTypeColor(event.type)}`}>
                  {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                </Badge>
                <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{event.description}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="text-sm">{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    <span className="text-sm">{event.time}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    <span className="text-sm">
                      {event.registrations}/{event.maxParticipants} registered
                    </span>
                  </div>
                </div>

                <Button className="w-full mt-4">
                  Register Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
