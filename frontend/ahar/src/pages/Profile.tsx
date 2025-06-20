import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { Camera, Settings2, Save } from 'lucide-react';
import NGOProfile from '@/components/profile/NGOProfile';
import DonorProfile from '@/components/profile/DonorProfile';
import { UserData } from '@/types/auth';

export default function Profile() {
  const { user, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<UserData | null>(null);

  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  const handleUpdate = async () => {
    if (!formData || !user) return;

    setIsSaving(true);
    try {
      await updateUserProfile(formData);
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(user);
    setIsEditing(false);
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !formData) return;

    // Check file size and type
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (file.size > maxSize) {
      toast({
        title: "Error",
        description: "File size must be less than 5MB",
        variant: "destructive"
      });
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Error",
        description: "Only JPEG, PNG and WebP images are allowed",
        variant: "destructive"
      });
      return;
    }

    try {
      setUploadingPhoto(true);
      // TODO: Implement photo upload to storage
      const photoURL = URL.createObjectURL(file);
      setFormData({ ...formData, photoURL });
      
      toast({
        title: "Photo updated",
        description: "Your profile photo has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile photo. Please try again.",
        variant: "destructive"
      });
      console.error('Photo upload error:', error);
    } finally {
      setUploadingPhoto(false);
    }
  };

  if (!user || !formData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center">Please log in to view your profile.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-10 px-4">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Profile Header */}
          <div className="relative">
            <div className="h-48 w-full rounded-lg bg-gradient-to-r from-blue-600 to-blue-400"></div>
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-white rounded-full">
                  <AvatarImage src={formData.photoURL || '/placeholder.svg'} />
                  <AvatarFallback className="bg-blue-500 text-2xl">
                    {formData.displayName?.charAt(0)?.toUpperCase() || formData.email?.charAt(0)?.toUpperCase() || '?'}
                  </AvatarFallback>
                </Avatar>
                <label 
                  htmlFor="photo-upload" 
                  className="absolute bottom-0 right-0 p-2 bg-white rounded-full border shadow-lg cursor-pointer hover:bg-gray-50"
                >
                  <Camera className="h-5 w-5 text-gray-600" />
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                    disabled={uploadingPhoto}
                  />
                </label>
              </div>
            </div>
            <div className="ml-48 pt-4 flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold">{formData.displayName || 'User'}</h1>
                <p className="text-gray-600">{formData.email}</p>
                <Badge variant="secondary" className="mt-2">
                  {formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
                </Badge>
              </div>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      className="flex items-center"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleUpdate}
                      disabled={isSaving}
                      className="flex items-center"
                    >
                      {isSaving ? (
                        'Saving...'
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    className="flex items-center"
                  >
                    <Settings2 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Profile Content */}
          {formData.role === 'ngo' ? (
            <NGOProfile
              userData={formData}
              isEditing={isEditing}
              onUpdate={(data) => setFormData(prev => prev ? { ...prev, ...data } : null)}
            />
          ) : (
            <DonorProfile
              userData={formData}
              isEditing={isEditing}
              onUpdate={(data) => setFormData(prev => prev ? { ...prev, ...data } : null)}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
