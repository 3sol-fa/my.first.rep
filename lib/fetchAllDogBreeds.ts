import { DogBreed, ApiBreed } from '@/types/DogBreed';
import { fetchJson, toDogBreed } from '@/utils/breedUtils';

const DOG_API_URL = 'https://dogapi.dog/api/v2/breeds';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// 지연 함수
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 재시도 로직이 포함된 fetch 함수
async function fetchWithRetry<T>(url: string, retries = MAX_RETRIES): Promise<T> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying... ${retries} attempts left`);
      await delay(RETRY_DELAY);
      return fetchWithRetry<T>(url, retries - 1);
    }
    throw error;
  }
}

export async function fetchAllDogBreeds(): Promise<DogBreed[]> {
  try {
    console.log('Fetching dog breeds...');
    const response = await fetchWithRetry<{ data: ApiBreed[] }>(DOG_API_URL);
  
  if (!response?.data) {
      console.error('No data received from dog API');
      return [];
  }
  
    console.log(`Successfully fetched ${response.data.length} breeds`);
  return response.data.map(toDogBreed);
  } catch (error) {
    console.error('Error fetching dog breeds:', error);
    return [];
  }
}
