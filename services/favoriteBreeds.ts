import { supabase } from '@/lib/supabaseClient';

type FavoriteBreedPayload = {
  breeds_id: string;
  memo?: string;
  user_id: string;
};

export async function addFavoriteBreed(payload: FavoriteBreedPayload & { memo: string }) {
  const { breeds_id, memo, user_id } = payload;
  const { data, error } = await supabase
    .from('favorite_breeds')
    .insert([{ breeds_id, memo, user_id }])
    .select()
    .single();

  if (error) {
    console.error('Insert error:', error);
    throw new Error(error.message);
  }
  return data;
}

export async function updateFavoriteBreed(payload: FavoriteBreedPayload) {
  const { breeds_id, memo, user_id } = payload;
  if (memo === undefined) throw new Error('Memo is required for update.');

  const { data, error } = await supabase
    .from('favorite_breeds')
    .update({ memo })
    .eq('breeds_id', breeds_id)
    .eq('user_id', user_id)
    .select()
    .single();

  if (error) {
    console.error('Update error:', error);
    throw new Error(error.message);
  }
  return data;
}

export async function deleteFavoriteBreed({ breeds_id, user_id }: Pick<FavoriteBreedPayload, 'breeds_id' | 'user_id'>) {
  const { error } = await supabase
    .from('favorite_breeds')
    .delete()
    .eq('breeds_id', breeds_id)
    .eq('user_id', user_id);

  if (error) {
    console.error('Delete error:', error);
    throw new Error(error.message);
  }
  return true;
}
