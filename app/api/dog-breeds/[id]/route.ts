import { NextRequest, NextResponse } from 'next/server';
import { getBreedById } from '@/lib/getBreedById';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const breedId = params.id?.trim();

  if (!breedId) {
    return NextResponse.json({ message: 'Missing breed ID' }, { status: 400 });
  }

  try {
    const breed = await getBreedById(breedId);

    if (!breed) {
      return NextResponse.json({ message: 'Breed not found' }, { status: 404 });
    }

    return NextResponse.json(breed, { status: 200 });
  } catch (error) {
    console.error('GET /api/dog-breeds/[id] error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
