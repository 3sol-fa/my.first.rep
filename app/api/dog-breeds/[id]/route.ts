import { NextResponse } from 'next/server';
import { getBreedById } from '@/lib/getBreedById';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const breedId = url.pathname.split('/').pop()?.trim();

  if (!breedId) {
    return NextResponse.json({ message: 'Missing breed ID' }, { status: 400 });
  }

  try {
    const breed = await getBreedById(breedId);

    if (!breed) {
      return NextResponse.json({ message: 'Breed not found' }, { status: 404 });
    }

    return NextResponse.json(breed);
  } catch (error) {
    console.error('GET /api/dog-breeds/[id] error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
