export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          username: string | null
          first_name: string | null
          last_name: string | null
          date_of_birth: string | null
          address: string | null
          phone_number: string | null
          favorite_breed: string | null
          has_dog_experience: boolean | null
          avatar_url: string | null
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          username?: string | null
          first_name?: string | null
          last_name?: string | null
          date_of_birth?: string | null
          address?: string | null
          phone_number?: string | null
          favorite_breed?: string | null
          has_dog_experience?: boolean | null
          avatar_url?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string | null
          first_name?: string | null
          last_name?: string | null
          date_of_birth?: string | null
          address?: string | null
          phone_number?: string | null
          favorite_breed?: string | null
          has_dog_experience?: boolean | null
          avatar_url?: string | null
          updated_at?: string
        }
      }
      favorite_breeds: {
        Row: {
          id: string
          user_id: string
          breeds_id: string
          memo: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          breeds_id: string
          memo?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          breeds_id?: string
          memo?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 