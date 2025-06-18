import NextAuth from "next-auth/next";

declare module "next-auth" {
  interface Session {  // interface can be overridden to add custom properties
    user: {
      id: string; // Supabase PK UUID
      email: string;
      name?: string | null;
      image?: string | null;
      phone?: string; // Optional phone number
    };
  }

  interface User {
    id: string; // Supabase PK UUID
    email: string;
    name?: string;
    image?: string;
  }
}