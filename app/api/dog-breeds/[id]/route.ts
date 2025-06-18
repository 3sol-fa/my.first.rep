import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/lib/types/supabase';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    const { data: breed, error } = await supabase
      .from('dog_breeds')
      .select('*')
      .eq('id', context.params.id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!breed) {
      return NextResponse.json({ error: 'Breed not found' }, { status: 404 });
    }

    return NextResponse.json(breed);
  } catch (error) {
    console.error('Error fetching breed:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
