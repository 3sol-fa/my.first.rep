// lib/getBreedById.ts

import { DogBreed, ApiBreed } from "@/types/DogBreed";
import { fetchJson, toDogBreed } from "@/utils/breedUtils";

export async function getBreedById(id: string): Promise<DogBreed | null> {
  const url = `https://dogapi.dog/api/v2/breeds/${id}`;

  try {
    const json = await fetchJson<{ data: ApiBreed }>(url);
    return toDogBreed(json.data);
  } catch (error) {
    console.error(`getBreedById(${id}) error:`, error);
    return null;
  }
}
