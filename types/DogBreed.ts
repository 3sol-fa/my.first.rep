// types/DogBreed.ts

export interface DogBreed {
  id: string;
  name: string;
  description: string;
  life_min?: number;
  life_max?: number;
  image?: string;
  image_url?: string;
}

export interface ApiBreedAttributes {
  name: string;
  description: string;
  life?: {
    min?: number;
    max?: number;
  };
  image?: {
    url?: string;
  };
}

export interface ApiBreed {
  id: string;
  attributes: ApiBreedAttributes;
}
