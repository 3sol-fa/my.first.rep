import { NextRequest } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import * as FavoriteBreedsService from '@/services/favoriteBreeds';

export async function POST(request: NextRequest) {
  try {
    const { breeds_id, memo }: { breeds_id: string; memo: string } = await request.json();

    if (!breeds_id || typeof memo !== 'string') {
      return Response.json({ message: 'breeds_id and memo are required' }, { status: 400 });
    }

    // 🔐 Supabase 서버 클라이언트로 사용자 인증
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const newFavorite = await FavoriteBreedsService.addFavoriteBreed({
      breeds_id,
      memo,
      user_id: user.id,
    });

    return Response.json(newFavorite, { status: 201 });
  } catch (error) {
    console.error('POST /api/favorite-breeds Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
