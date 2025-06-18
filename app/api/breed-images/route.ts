import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const breed = searchParams.get('breed');
  const page = searchParams.get('page') || '1';

  if (!breed) {
    return NextResponse.json(
      { error: 'Breed parameter is required' },
      { status: 400 }
    );
  }

  try {
    const searchQuery = `${breed} dog breed`;
    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?` +
      `key=${process.env.GOOGLE_API_KEY}&` +
      `cx=${process.env.GOOGLE_SEARCH_ENGINE_ID}&` +
      `q=${encodeURIComponent(searchQuery)}&` +
      `searchType=image&` +
      `start=${(parseInt(page) - 1) * 10 + 1}&` + 
      `num=10`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch images from Google Custom Search API');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching breed images:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch breed images' },
      { status: 500 }
    );
  }
} 