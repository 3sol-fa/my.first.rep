import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '../types/supabase';

interface Profile {
  id: string;
  email: string;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  date_of_birth: string | null;
  address: string | null;
  phone_number: string | null;
  favorite_breed: string | null;
  has_dog_experience: boolean;
  avatar_url: string | null;
}

interface ProfileFormData {
  username: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  address: string;
  phone_number: string;
  favorite_breed: string;
  has_dog_experience: boolean;
}

interface CreateProfileData {
  userId: string;
  email: string;
}

interface MutationContext {
  previousProfile: Profile | undefined;
}

export function useProfile() {
  const supabase = createClientComponentClient<Database>();
  const queryClient = useQueryClient();

  // Fetch profile data with stale-while-revalidate
  const { data: profile, isLoading, error } = useQuery<Profile, Error>({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No session found');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;
      if (!data) throw new Error('No profile found');

      return data as Profile;
    },
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    gcTime: 1000 * 60 * 30, // Keep data in cache for 30 minutes
    refetchOnWindowFocus: true, // Refetch when window regains focus
    refetchOnMount: true, // Refetch when component mounts
    refetchOnReconnect: true, // Refetch when network reconnects
    retry: 1,
  });

  // Update profile mutation with optimistic updates
  const updateProfile = useMutation<void, Error, ProfileFormData, MutationContext>({
    mutationFn: async (formData) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No session found');

      const { error } = await supabase
        .from('profiles')
        .update({
          ...formData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', session.user.id);

      if (error) throw error;
    },
    onMutate: async (newData) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['profile'] });

      // Snapshot the previous value
      const previousProfile = queryClient.getQueryData<Profile>(['profile']);

      // Optimistically update to the new value
      if (previousProfile) {
        queryClient.setQueryData<Profile>(['profile'], {
          ...previousProfile,
          ...newData,
        });
      }

      return { previousProfile };
    },
    onError: (err, newData, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousProfile) {
        queryClient.setQueryData<Profile>(['profile'], context.previousProfile);
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure data is in sync
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  // Create profile mutation
  const createProfile = useMutation<void, Error, CreateProfileData>({
    mutationFn: async ({ userId, email }) => {
      const { error } = await supabase
        .from('profiles')
        .insert([
          {
            id: userId,
            email,
            username: email.split('@')[0],
            updated_at: new Date().toISOString(),
          },
        ]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    createProfile,
  };
} 