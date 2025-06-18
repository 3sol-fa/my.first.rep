'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

interface DogImage {
  link: string;
  title: string;
}

export default function BreedImagesPage() {
  const searchParams = useSearchParams();
  const breed = searchParams?.get('breed') ?? null;
  const router = useRouter();
  const [images, setImages] = useState<DogImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchImages() {
      if (!breed) {
        setError('No breed specified');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/search-images?breed=${encodeURIComponent(breed)}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch images');
        }

        if (!data.items || !Array.isArray(data.items)) {
          throw new Error('Invalid response format');
        }

        setImages(data.items);
      } catch (err) {
        console.error('Error fetching images:', err);
        setError(err instanceof Error ? err.message : 'Failed to load images');
      } finally {
        setLoading(false);
      }
    }

    fetchImages();
  }, [breed]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-800"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-yellow-800 mb-4">Error</h1>
          <p className="text-yellow-700 mb-4">{error}</p>
          <Button
            onClick={() => router.back()}
            className="bg-yellow-600 hover:bg-yellow-700 text-white"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-yellow-800">
          {breed} Images
        </h1>
        <Button
          onClick={() => router.back()}
          className="bg-yellow-600 hover:bg-yellow-700 text-white"
        >
          Back to Details
        </Button>
      </div>

      {images.length === 0 ? (
        <div className="text-center text-yellow-700">
          No images found for this breed.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <Card key={index} className="overflow-hidden bg-yellow-50">
              <CardContent className="p-0">
                <img
                  src={image.link}
                  alt={image.title || `${breed} image ${index + 1}`}
                  className="w-full h-64 object-cover"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 