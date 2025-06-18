'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';

interface DogBreed {
  id: string;
  name: string;
  image_url?: string;
  image?: string;
  description?: string;
  life_min?: number;
  life_max?: number;
}

export default function FavoriteDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id ? String(params.id) : '';

  const [memo, setMemo] = useState('');
  const [originalMemo, setOriginalMemo] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [breed, setBreed] = useState<DogBreed | null>(null);
  const [loading, setLoading] = useState(true);

  // 견종 정보 + 즐겨찾기 메모 불러오기
  const fetchData = useCallback(async () => {
    if (!id) return;

    setLoading(true);

    try {
      // 견종 정보 fetch
      const resBreed = await fetch(`/api/dog-breeds/${id}`);
      if (!resBreed.ok) throw new Error('Failed to fetch breed info');
      const breedData: DogBreed = await resBreed.json();
      setBreed(breedData);

      // 즐겨찾기 메모 fetch - Supabase 클라이언트 사용
      const { data: favData, error } = await supabase
        .from('favorite_breeds')
        .select('*')
        .eq('breeds_id', id)
        .single();

      if (error) {
        console.error('Error fetching favorite:', error);
        setIsFavorite(false);
        setMemo('');
        setOriginalMemo('');
      } else if (favData) {
          setIsFavorite(true);
          setMemo(favData.memo || '');
          setOriginalMemo(favData.memo || '');
      } else {
        setIsFavorite(false);
        setMemo('');
        setOriginalMemo('');
      }
    } catch (error) {
      console.error('fetchData error:', error);
      setBreed(null);
      setIsFavorite(false);
      setMemo('');
      setOriginalMemo('');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const isChanged = memo !== originalMemo;

  // 저장 (추가 or 수정)
  async function handleSave() {
    if (!id) return;

    try {
      if (isFavorite) {
        // 수정
        const { error } = await supabase
          .from('favorite_breeds')
          .update({ memo })
          .eq('breeds_id', id);

        if (error) throw error;
      } else {
        // 추가
        const { error } = await supabase
          .from('favorite_breeds')
          .insert([{ breeds_id: id, memo }]);

        if (error) throw error;
      }

      setIsFavorite(true);
      setOriginalMemo(memo);
      alert(`✅ ${isFavorite ? 'Memo updated!' : 'Added to favorites!'}`);
    } catch (error) {
      console.error(error);
      alert('❌ Failed to save.');
    }
  }

  // 삭제
  async function handleDelete() {
    if (!id) return;

    try {
      const { error } = await supabase
        .from('favorite_breeds')
        .delete()
        .eq('breeds_id', id);

      if (error) throw error;

      alert('🗑️ Removed from favorites.');
      setIsFavorite(false);
      setMemo('');
      setOriginalMemo('');
      router.push('/favorites');
    } catch (error) {
      console.error(error);
      alert('❌ Failed to delete.');
    }
  }

  if (loading) {
    return <p className="text-center text-gray-500 animate-pulse">🐾 Loading breed info...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {breed ? (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative h-96 w-full">
            {(breed.image_url || breed.image) && (
              <Image
                src={breed.image_url || breed.image || ''}
              alt={breed.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
              />
            )}
          </div>
          
          <div className="p-6">
            <h1 className="text-4xl font-bold mb-4 text-gray-800">{breed.name}</h1>
            
            {breed.description && (
              <p className="mb-6 text-gray-700 leading-relaxed">{breed.description}</p>
            )}
            
            {(breed.life_min || breed.life_max) && (
              <p className="mb-6 text-gray-600">
                <span className="font-semibold">Life Expectancy:</span>{' '}
                {breed.life_min && breed.life_max
                  ? `${breed.life_min} - ${breed.life_max} years`
                  : breed.life_min
                  ? `Minimum ${breed.life_min} years`
                  : `Maximum ${breed.life_max} years`}
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
        <button
          onClick={handleSave}
          disabled={!isChanged}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
                      Update Note
        </button>
          <button
            onClick={handleDelete}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Remove from Favorites
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
                    Add to Favorites
          </button>
        )}
      </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-red-500">Breed not found</p>
      )}
    </div>
  );
}
