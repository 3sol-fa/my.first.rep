'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useProfile } from '@/lib/hooks/useProfile';

export default function MyPage() {
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    date_of_birth: '',
    address: '',
    phone_number: '',
    favorite_breed: '',
    has_dog_experience: false,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const { profile, isLoading, error: profileError, updateProfile } = useProfile();

  // Initialize form data when profile is loaded
  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || '',
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        date_of_birth: profile.date_of_birth || '',
        address: profile.address || '',
        phone_number: profile.phone_number || '',
        favorite_breed: profile.favorite_breed || '',
        has_dog_experience: profile.has_dog_experience || false,
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await updateProfile.mutateAsync(formData);
      setSuccess('Profile updated successfully!');
      
      // Redirect to home page after successful profile update
      setTimeout(() => {
        router.replace('/');
      }, 1500); // Show success message for 1.5 seconds before redirecting
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setError(error.message || 'Failed to update profile');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Loading profile...</h2>
        </div>
      </div>
    );
  }

  if (profileError || !profile) {
    return null; // This will trigger the redirect to login
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
          <CardDescription>Manage your personal information</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md text-green-600">
              {success}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="Enter your username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={profile.email}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                  placeholder="Enter your first name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                  placeholder="Enter your last name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => setFormData(prev => ({ ...prev, date_of_birth: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input
                  id="phone_number"
                  value={formData.phone_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone_number: e.target.value }))}
                  placeholder="Enter your phone number"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Enter your address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="favorite_breed">Favorite Dog Breed</Label>
              <Input
                id="favorite_breed"
                value={formData.favorite_breed}
                onChange={(e) => setFormData(prev => ({ ...prev, favorite_breed: e.target.value }))}
                placeholder="Enter your favorite dog breed"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="has_dog_experience"
                checked={formData.has_dog_experience}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, has_dog_experience: checked as boolean }))
                }
              />
              <Label htmlFor="has_dog_experience">I have experience with dogs</Label>
            </div>
            <div className="flex justify-end space-x-4">
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700"
                disabled={updateProfile.isPending}
              >
                {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 