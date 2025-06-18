import './globals.css';
import { Inter } from 'next/font/google';
import React from 'react';
import Navbar from '@/components/Navbar';
import { Toaster } from '@/components/ui/toaster';
import type { Metadata } from 'next';
import Providers from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Dog Breeds App',
  description: 'Find and learn about different dog breeds',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#FFF9DB] text-[#333] min-h-screen flex flex-col`}>
        <Providers>
          <Navbar />

          {/* content가 Navbar 밑으로 내려가도록 padding-top 줌 (네비 높이 약 64px) */}
          <main className="flex-grow max-w-6xl w-full mx-auto px-4 py-8 pt-[72px]">
            {children}
          </main>

          <footer className="bg-[#FFF3BF] text-center text-sm text-[#7B61FF] py-4">
            © {new Date().getFullYear()} DogBreeds App. Built with 💛 and React.
          </footer>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
