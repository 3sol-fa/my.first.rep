'use client';
import { DogBreed } from '../../types/DogBreed';
import React, { createContext, useContext } from 'react';

// 공통 데이터 저장소
const BreedsContext = createContext<{ breeds: DogBreed[] }>({ breeds: [] });

export function BreedsProvider({
  breeds,
  children,
}: {
  breeds: DogBreed[];
  children: React.ReactNode;
}) {
  return (
    <BreedsContext.Provider value={{ breeds }}>
      {children}
    </BreedsContext.Provider>
  );
}

export function useBreeds() {
  return useContext(BreedsContext);
}
