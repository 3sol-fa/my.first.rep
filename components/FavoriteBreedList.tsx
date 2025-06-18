// components/FavoriteBreedList.tsx
import React, { useEffect, useState } from 'react';
import { fetchAllDogBreeds } from '@/services/dogBreedsService';

interface FavoriteBreed {
  breeds_id: string;
  memo: string;
}

interface DogBreed {
  id: string;
  name: string;
  // ... 다른 필드들
}

export default function FavoriteBreedList() {
  const [favoriteBreeds, setFavoriteBreeds] = useState<FavoriteBreed[]>([]);
  const [allBreeds, setAllBreeds] = useState<DogBreed[]>([]);

  useEffect(() => {
    async function fetchData() {
      const favoritesFromApi: FavoriteBreed[] = await fetch('/api/favorite-breeds').then(res => res.json());
      setFavoriteBreeds(favoritesFromApi);

      const breeds = await fetchAllDogBreeds();
      setAllBreeds(breeds);
    }

    fetchData();
  }, []);

  return (
    <div>
      {favoriteBreeds.length === 0 && <p>No favorite breeds yet.</p>}

      {favoriteBreeds.map(({ breeds_id, memo }) => {
        const breed = allBreeds.find(b => b.id === breeds_id);

        return (
          <div key={breeds_id}>
            <h3>{breed ? breed.name : 'Unknown breed'}</h3>
            <p>{memo}</p>
          </div>
        );
      })}
    </div>
  );
}
