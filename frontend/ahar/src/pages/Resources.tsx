import { useState } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  BookOpen, 
  Video, 
  Download, 
  ExternalLink, 
  Clock, 
  Users,
  Search,
  Filter 
} from 'lucide-react';

const resources = [
  {
    id: '1',
    title: 'Food Safety Guidelines for Donors',
    description: 'Comprehensive guide on maintaining food safety standards when donating surplus food items.',
    type: 'guide',
    category: 'Food Safety',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=200&fit=crop',
    downloadUrl: '#'
  },
  {
    id: '2',
    title: 'How to Start a Community Food Drive',
    description: 'Step-by-step instructions for organizing successful food drives in your neighborhood.',
    type: 'article',
    category: 'Community',
    readTime: '12 min read',
    image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=300&h=200&fit=crop',
    downloadUrl: '#'
  },
  {
    id: '3',
    title: 'Food Waste Reduction in Restaurants',
    description: 'Learn practical strategies to minimize food waste and maximize donations in restaurant operations.',
    type: 'video',
    category: 'Sustainability',
    readTime: '15 min watch',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&h=200&fit=crop',
    downloadUrl: '#'
  },
  {
    id: '4',
    title: 'Legal Framework for Food Donation',
    description: 'Understanding the legal aspects and protections for food donors under Indian law.',
    type: 'guide',
    category: 'Legal',
    readTime: '10 min read',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=300&h=200&fit=crop',
    downloadUrl: '#'
  },
  {
    id: '5',
    title: 'NGO Partnership Best Practices',
    description: 'How to build effective partnerships between donors and NGOs for sustainable food relief.',
    type: 'article',
    category: 'Partnership',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=300&h=200&fit=crop',
    downloadUrl: '#'
  },
  {
    id: '6',
    title: 'Food Distribution Workshop',
    description: 'Video tutorial on efficient food distribution methods and logistics for NGOs.',
    type: 'video',
    category: 'Operations',
    readTime: '22 min watch',
    image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=300&h=200&fit=crop',
    downloadUrl: '#'
  },
  {
    id: '7',
    title: 'Hunger Statistics in India 2024',
    description: 'Latest data and insights on hunger, malnutrition, and food insecurity in India.',
    type: 'report',
    category: 'Statistics',
    readTime: '20 min read',
    image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=300&h=200&fit=crop',
    downloadUrl: '#'
  },
  {
    id: '8',
    title: 'Volunteer Training Manual',
    description: 'Complete training guide for volunteers involved in food collection and distribution.',
    type: 'guide',
    category: 'Training',
    readTime: '25 min read',
    image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=300&h=200&fit=crop',
    downloadUrl: '#'
  },
  {
    id: '9',
    title: 'Nutrition Guidelines for Donated Food',
    description: 'Ensuring nutritional value and balanced meals in food donation programs.',
    type: 'article',
    category: 'Nutrition',
    readTime: '14 min read',
    image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=300&h=200&fit=crop',
    downloadUrl: '#'
  }
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'guide': return <BookOpen className="w-4 h-4" />;
    case 'video': return <Video className="w-4 h-4" />;
    case 'article': return <ExternalLink className="w-4 h-4" />;
    case 'report': return <Download className="w-4 h-4" />;
    default: return <BookOpen className="w-4 h-4" />;
  }
};

export default function Resources() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [...new Set(resources.map(resource => resource.category))];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Resources</h1>
          <p className="text-gray-600">
            Access guides, articles, and videos about food donation and distribution
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              className="pl-10"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('all')}
            >
              All
            </Button>
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <Card key={resource.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <img
                src={resource.image}
                alt={resource.title}
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {getTypeIcon(resource.type)}
                    {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                  </Badge>
                  <span className="text-sm text-gray-500 flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {resource.readTime}
                  </span>
                </div>

                <h3 className="text-xl font-semibold mb-2">{resource.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{resource.description}</p>

                <div className="space-y-4">
                  <Badge variant="outline">{resource.category}</Badge>
                  
                  <div className="flex gap-2">
                    <Button className="flex-1" variant="default">
                      Read Now
                    </Button>
                    <Button variant="outline">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
