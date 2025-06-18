import { fetchAllDogBreeds } from '@/lib/fetchAllDogBreeds';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const breeds = await fetchAllDogBreeds();
    
    if (!breeds || breeds.length === 0) {
      return NextResponse.json(
        { message: 'No breeds found' },
        { status: 404 }
      );
    }

    return NextResponse.json(breeds, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('GET /api/dog-breeds error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch dog breeds' },
      { status: 500 }
    );
  }
}
