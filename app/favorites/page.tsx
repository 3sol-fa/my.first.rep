'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DogBreed {
  id: string;
  name: string;
  description?: string;
  image?: string;
  image_url?: string;
}

interface FavoriteBreed {
  id: string;
  breeds_id: string;
  memo: string;
  breed?: DogBreed;
}

export default function FavoritesPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteBreed[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editMemo, setEditMemo] = useState('');

  useEffect(() => {
    fetchFavorites();
  }, []);

  async function fetchFavorites() {
    try {
      setLoading(true);
      const { data: favoritesData, error: favoritesError } = await supabase
        .from('favorite_breeds')
        .select('*')
        .order('created_at', { ascending: false });

      if (favoritesError) throw favoritesError;

      // Fetch breed details for each favorite
      const favoritesWithBreeds = await Promise.all(
        favoritesData.map(async (favorite) => {
          try {
            const response = await fetch(`/api/dog-breeds/${favorite.breeds_id}`);
            if (!response.ok) throw new Error('Failed to fetch breed details');
            const breedData = await response.json();
            return { ...favorite, breed: breedData };
          } catch (error) {
            console.error(`Error fetching breed ${favorite.breeds_id}:`, error);
            return favorite;
          }
        })
      );

      setFavorites(favoritesWithBreeds);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setError('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to remove this breed from favorites?')) return;

    try {
      const { error } = await supabase
        .from('favorite_breeds')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setFavorites(favorites.filter(fav => fav.id !== id));
      alert('Successfully removed from favorites');
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to remove from favorites');
    }
  }

  async function handleEdit(id: string, memo: string) {
    try {
      const { error } = await supabase
        .from('favorite_breeds')
        .update({ memo })
        .eq('id', id);

      if (error) throw error;

      setFavorites(favorites.map(fav => 
        fav.id === id ? { ...fav, memo } : fav
      ));
      setEditingId(null);
      alert('Memo updated successfully');
    } catch (error) {
      console.error('Edit error:', error);
      alert('Failed to update memo');
    }
  }

  function handleViewImages(breedName: string) {
    router.push(`/breed-images?breed=${encodeURIComponent(breedName)}`);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-800 mx-auto"></div>
          <p className="mt-4 text-yellow-700">Loading favorites...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => router.push('/breeds')}>
            Back to Breeds List
          </Button>
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-yellow-700 mb-4">No favorite breeds yet</p>
          <Button onClick={() => router.push('/breeds')}>
            Browse Dog Breeds
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-yellow-800">❤️ My Favorite Dog Breeds ❤️</h1>
      <div className="space-y-4">
        {favorites.map((favorite) => (
          <Card key={favorite.id} className="h-auto bg-yellow-50">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold mb-2 text-yellow-900">
                    {favorite.breed?.name || 'Unknown Breed'}
                  </h2>
                  {favorite.breed?.description && (
                    <p className="text-yellow-800 mb-4">{favorite.breed.description}</p>
                  )}
                  {editingId === favorite.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={editMemo}
                        onChange={(e) => setEditMemo(e.target.value)}
                        placeholder="Add a note about this breed..."
                        className="w-full p-2 border rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleEdit(favorite.id, editMemo)}
                          variant="default"
                          className="bg-yellow-600 hover:bg-yellow-700 text-white hover:text-yellow-50 transition-colors duration-200"
                        >
                          Save
                        </Button>
                        <Button
                          onClick={() => {
                            setEditingId(null);
                            setEditMemo('');
                          }}
                          variant="outline"
                          className="border-yellow-600 text-yellow-700 hover:bg-yellow-600 hover:text-white transition-colors duration-200"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-yellow-700">
                        {favorite.memo || 'No memo added'}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          onClick={() => {
                            setEditingId(favorite.id);
                            setEditMemo(favorite.memo);
                          }}
                          variant="outline"
                          className="border-yellow-600 text-yellow-700 hover:bg-yellow-600 hover:text-white transition-colors duration-200"
                        >
                          Edit Memo
                        </Button>
                        <Button
                          onClick={() => handleDelete(favorite.id)}
                          variant="destructive"
                          className="bg-red-500 hover:bg-red-600 text-white hover:text-red-50 transition-colors duration-200"
                        >
                          Remove
                        </Button>
                        {favorite.breed?.name && (
                          <Button
                            onClick={() => handleViewImages(favorite.breed!.name)}
                            variant="outline"
                            className="border-yellow-600 text-yellow-700 hover:bg-yellow-600 hover:text-white transition-colors duration-200"
                          >
                            View Images
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                {favorite.breed?.image_url || favorite.breed?.image ? (
                  <div className="w-full md:w-48 h-48 relative">
                    <img
                      src={favorite.breed.image_url || favorite.breed.image}
                      alt={favorite.breed.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
