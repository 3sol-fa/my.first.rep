'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DogBreed {
  id: string;
  name: string;
  description?: string;
  life?: {
    min: number;
    max: number;
  };
  image?: string;
  image_url?: string;
}

export default function BreedDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id ? String(params.id) : '';

  const [breed, setBreed] = useState<DogBreed | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [memo, setMemo] = useState('');
  const [originalMemo, setOriginalMemo] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    async function fetchBreedData() {
      if (!id) {
        setError('Invalid breed ID');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/dog-breeds/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch breed data');
        }

        setBreed(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching breed:', error);
        setError(error instanceof Error ? error.message : 'Failed to load breed information');
        setBreed(null);
      } finally {
        setIsLoading(false);
      }
    }

    async function fetchFavoriteStatus() {
      if (!id) return;

      try {
        const { data, error } = await supabase
        .from('favorite_breeds')
        .select('*')
        .eq('breeds_id', id)
        .single();

        if (error) {
          if (error.code === 'PGRST116') {
            // No rows returned - not a favorite
            setIsFavorite(false);
            setMemo('');
            setOriginalMemo('');
          } else {
            console.error('Error fetching favorite status:', error);
          }
          return;
        }

      if (data) {
        setIsFavorite(true);
        setMemo(data.memo || '');
        setOriginalMemo(data.memo || '');
        }
      } catch (error) {
        console.error('Error in fetchFavoriteStatus:', error);
      }
    }

    fetchBreedData();
    fetchFavoriteStatus();
  }, [id]);

  const isChanged = memo !== originalMemo;

  async function handleSave() {
    if (!id) return;
  
    try {
    if (isFavorite) {
        // Update existing favorite
      const { error } = await supabase
        .from('favorite_breeds')
        .update({ memo })
        .eq('breeds_id', id);
  
        if (error) throw error;
      } else {
        // Add new favorite
      const { error } = await supabase
        .from('favorite_breeds')
        .insert([{ breeds_id: id, memo }]);
  
        if (error) throw error;
      }

        setIsFavorite(true);
        setOriginalMemo(memo);
      alert(`✅ ${isFavorite ? 'Memo updated!' : 'Added to favorites!'}`);
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save: ' + (error instanceof Error ? error.message : 'Unknown error'));
      }
    }

  async function handleDelete() {
    if (!id) return;

    try {
    const { error } = await supabase
      .from('favorite_breeds')
      .delete()
      .eq('breeds_id', id);

      if (error) throw error;

      setIsFavorite(false);
      setMemo('');
      setOriginalMemo('');
      alert('Successfully removed from favorites');
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading breed information...</p>
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

  if (!breed) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">Breed not found</p>
          <Button onClick={() => router.push('/breeds')}>
            Back to Breeds List
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="h-auto">
        <CardContent className="pt-6">
          <div className="relative w-full mb-6">
            {(breed.image_url || breed.image) && (
              <img
                src={breed.image_url || breed.image}
                alt={breed.name}
                className="w-full h-auto object-cover rounded-lg"
              />
            )}
          </div>

          <h1 className="text-3xl font-bold mb-4">{breed.name}</h1>
          
          {breed.description && (
            <p className="text-gray-700 mb-6">{breed.description}</p>
          )}
          
          {breed.life && (
            <p className="text-gray-600 mb-6">
              Life Expectancy: {breed.life.min} - {breed.life.max} years
            </p>
          )}

          <div className="mt-6">
      <textarea
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
              placeholder="Add a note about this breed..."
              className="w-full p-2 border rounded-md"
              rows={4}
      />
            
            <div className="flex justify-end gap-2 mt-4">
              {isFavorite ? (
                <>
                  <Button
          onClick={handleSave}
          disabled={!isChanged}
                    variant="default"
        >
                    Update Note
                  </Button>
                  <Button
            onClick={handleDelete}
                    variant="destructive"
          >
                    Remove from Favorites
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleSave}
                  variant="default"
                >
                  Add to Favorites
                </Button>
        )}
      </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
