'use client';

import Link from "next/link";  // Link 추가
import { useEffect, useState } from "react";
import { fetchAllDogBreeds } from "@/services/dogBreedsService";
import { DogBreed } from "@/types/DogBreed";
import SearchBar from "@/components/SearchBar";

export default function BreedsPage() {
  const [breeds, setBreeds] = useState<DogBreed[]>([]);
  const [filtered, setFiltered] = useState<DogBreed[]>([]);

  useEffect(() => {
    const loadBreeds = async () => {
      try {
        const data = await fetchAllDogBreeds();
        setBreeds(data);
        setFiltered(data);
      } catch (error) {
        console.error("Failed to fetch dog breeds:", error);
      }
    };
    loadBreeds();
  }, []);

  const handleSearch = (query: string) => {
    const lower = query.toLowerCase();
    const result = breeds.filter((breed) =>
      breed.name.toLowerCase().includes(lower)
    );
    setFiltered(result);
  };

  return (
    <div className="pt-[80px] px-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🐶 All Dog Breeds</h1>

      {/* 🔍 SearchBar 삽입 */}
      <SearchBar onSearch={handleSearch} />

      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        {filtered.map((breed) => (
          <Link
            key={breed.id}
            href={`/breeds/${breed.id}`}
            className="block bg-yellow-50 p-4 rounded-lg shadow-md hover:bg-yellow-200 transition-colors duration-300"
          >
            <h2 className="text-lg font-semibold text-yellow-900">{breed.name}</h2>
            <p className="text-sm text-yellow-800 mt-1">{breed.description}</p>
            <p className="text-xs text-yellow-700 mt-2">
             Life: {`Max: ${breed.life_max ?? 'N/A'}, Min: ${breed.life_min ?? 'N/A'}`}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
