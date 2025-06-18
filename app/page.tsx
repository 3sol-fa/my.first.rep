'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <section className="relative h-[90vh] flex items-center justify-center bg-cover bg-center bg-[url('/dogs-bg.jpg')]">
      {/* 그라디언트 오버레이 */}
      <div className="absolute inset-0 bg-black/60" />

      {/* 콘텐츠 */}
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-5xl font-bold tracking-tight mb-4 drop-shadow-lg">
          Welcome to the Puppy World 🐾
        </h1>
        <p className="text-lg max-w-2xl mx-auto mb-6 text-gray-200">
          Discover hundreds of dog breeds, mark your favorites, and learn more about my girl's best friend.
        </p>
        <Link
          href="/breeds"
          className="inline-block bg-yellow-400 text-black px-6 py-3 rounded-full font-semibold text-lg shadow-lg hover:bg-yellow-500 transition"
        >
          Explore Breeds
        </Link>
      </div>
    </section>
  );
}
