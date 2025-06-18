// services/dogBreedsService.ts
import axios from 'axios';
import { DogBreed } from '@/types/DogBreed';

const API_BASE_URL = 'https://dogapi.dog/api/v2/breeds';
const PAGE_SIZE = 50;

// API 응답을 DogBreed 타입으로 변환하는 함수
function mapToDogBreed(apiBreed: any): DogBreed {
  return {
    id: apiBreed.id,
    name: apiBreed.attributes.name,
    description: apiBreed.attributes.description,
    image: apiBreed.attributes.image?.url,
    life_min: apiBreed.attributes.life?.min,
    life_max: apiBreed.attributes.life?.max,
  };
}

// 요청 사이에 지연을 추가하는 함수
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function fetchAllDogBreeds(): Promise<DogBreed[]> {
  try {
    const firstPageResponse = await axios.get(`${API_BASE_URL}?page[number]=1&page[size]=${PAGE_SIZE}`);
    const totalPages = firstPageResponse.data.meta.pagination.last;

    const breeds = firstPageResponse.data.data.map(mapToDogBreed);

    if (totalPages === 1) return breeds;

    // 나머지 페이지들을 순차적으로 가져오기
    const moreBreeds: DogBreed[] = [];
    for (let page = 2; page <= totalPages; page++) {
      // 지연 시간을 300ms로 감소
      await delay(300);
      
      try {
        const response = await axios.get(`${API_BASE_URL}?page[number]=${page}&page[size]=${PAGE_SIZE}`);
        const pageBreeds = response.data.data.map(mapToDogBreed);
        moreBreeds.push(...pageBreeds);
      } catch (error) {
        console.error(`Error fetching page ${page}:`, error);
        // 에러가 발생해도 계속 진행
        continue;
      }
    }

    return [...breeds, ...moreBreeds];
  } catch (error) {
    console.error('Dog API fetch failed:', error);
    return [];
  }
}
