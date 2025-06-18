import { supabase } from '@/lib/supabaseClient';
import { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth';   
import CredentialProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialProvider({
            name: "Email & Password",
            credentials: {
                email: { label: "Email", type: "text"},
                password: { label: "Password", type: "password" }
            },

            async authorize(credentials) {
                const email = credentials?.email;
                const password = credentials?.password;

                if (!email || !password) {
                    throw new Error("Email and password are required");
                }

                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                });

                if (error || !data.user) {
                    throw new Error(error?.message || "Login failed");
                }

                return data.user ? {
                    id: data.user.id,
                    email: data.user.email,
                } as { id: string; email: string } : null; // Ensure to cast to User type
            }
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            if (token) {
                session.user.id = token.sub || ''; // Provide a default value
            }

            const profile = await prisma.profiles.findUnique({
                where: {
                    id: session.user.id,
                },
            })

            if (profile) {
                session.user.name = profile.name || null;
                session.user.phone = profile.phone || null; // Optional phone number
            }
            
            return session;
        }
}, // Closing brace for callbacks
}; // Closing brace for authOptions

export default NextAuth(authOptions);