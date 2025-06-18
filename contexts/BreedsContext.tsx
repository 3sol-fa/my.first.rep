'use client';
import React, { createContext, useContext, ReactNode } from 'react';
import { DogBreed } from '@/types/DogBreed';

interface BreedsContextType {
  breeds: DogBreed[];
}

const BreedsContext = createContext<BreedsContextType>({ breeds: [] });

interface BreedsProviderProps {
  breeds: DogBreed[];
  children: ReactNode;
}

export const BreedsProvider = ({ breeds, children }: BreedsProviderProps) => {
  return <BreedsContext.Provider value={{ breeds }}>{children}</BreedsContext.Provider>;
};

export const useBreeds = () => useContext(BreedsContext);
