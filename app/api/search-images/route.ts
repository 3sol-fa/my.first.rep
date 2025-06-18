import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const breed = searchParams.get('breed');

    if (!breed) {
      return NextResponse.json(
        { error: 'Breed parameter is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
    const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;

    if (!apiKey || !searchEngineId) {
      console.error('Missing API configuration:', { apiKey: !!apiKey, searchEngineId: !!searchEngineId });
      return NextResponse.json(
        { error: 'Google API configuration is missing' },
        { status: 500 }
      );
    }

    // Format the search query
    const searchQuery = `${breed} dog`;
    const encodedQuery = encodeURIComponent(searchQuery);

    const apiUrl = new URL('https://www.googleapis.com/customsearch/v1');
    apiUrl.searchParams.append('key', apiKey);
    apiUrl.searchParams.append('cx', searchEngineId);
    apiUrl.searchParams.append('q', searchQuery);
    apiUrl.searchParams.append('searchType', 'image');
    apiUrl.searchParams.append('num', '10');
    apiUrl.searchParams.append('safe', 'active');

    console.log('Making API request to:', apiUrl.toString());

    const response = await fetch(apiUrl.toString(), {
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('Google API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      return NextResponse.json(
        { error: errorData?.error?.message || 'Failed to fetch images from Google' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    if (!data.items || !Array.isArray(data.items)) {
      console.error('Invalid API response:', data);
      return NextResponse.json(
        { error: 'Invalid response from Google API' },
        { status: 500 }
      );
    }

    return NextResponse.json({ items: data.items });
  } catch (error) {
    console.error('Error in search-images API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 