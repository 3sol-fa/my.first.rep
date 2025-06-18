// utils/breedUtils.ts

import { ApiBreed, DogBreed } from "@/types/DogBreed";

export async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export function toDogBreed(breed: ApiBreed): DogBreed {
  const { id, attributes } = breed;
  return {
    id,
    name: attributes.name,
    description: attributes.description,
    life_min: attributes.life?.min,
    life_max: attributes.life?.max,
    image: attributes.image?.url,
  };
}
