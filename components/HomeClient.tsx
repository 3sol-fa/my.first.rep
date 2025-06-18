"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import DogList from "./DogList";
import SearchBar from "./SearchBar";
import { DogBreed } from "../types/DogBreed";

export default function HomeClient() {
  const [breeds, setBreeds] = useState<DogBreed[]>([]);
  const [filteredBreeds, setFilteredBreeds] = useState<DogBreed[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await axios.get<DogBreed[]>("/api/dog-breeds");
        setBreeds(res.data);
        setFilteredBreeds(res.data);
      } catch (e) {
        console.error("Failed to load dog breeds:", e);
        setError("Failed to load dog breeds.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSearch = useCallback(
    (query: string) => {
      if (!query.trim()) {
        setFilteredBreeds(breeds);
        return;
      }
      const lower = query.toLowerCase();
      const filtered = breeds.filter((b) =>
        b.name.toLowerCase().includes(lower)
      );
      setFilteredBreeds(filtered);
    },
    [breeds]
  );

  if (loading) return <p className="text-center mt-10">Loading dog breeds...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    <main className="min-h-screen w-full bg-yellow-50 py-6">
      <div className="p-4 mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold mb-2">🐶 Dog Breed List</h1>
        <h2 className="text-xl mb-6 text-yellow-800">
          Please click the breed name to see more details.
        </h2>

        <SearchBar onSearch={handleSearch} />
        <DogList breeds={filteredBreeds} />
      </div>
    </main>
  );
}
