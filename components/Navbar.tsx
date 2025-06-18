'use client';

import Link from 'next/link';
import { Button } from './ui/button';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.replace('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="flex items-center justify-between py-4 px-6 bg-yellow-100 shadow-md fixed top-0 w-full z-50">
      {/* 왼쪽 로고 박스 */}
      <div className="bg-yellow-300 rounded-md px-4 py-2 font-bold text-xl text-yellow-900 shadow-inner select-none">
        🐾 I Love My Puppy 🐾
      </div>

      {/* 중앙 메뉴 */}
      <div className="flex space-x-8 text-yellow-800 font-semibold">
        <Link href="/" className="hover:text-yellow-600 transition">
          Home
        </Link>
        <Link href="/breeds" className="hover:text-yellow-600 transition">
          Breeds
        </Link>
        <Link href="/favorites" className="hover:text-yellow-600 transition">
          Favorite
        </Link>
        <Link href="/contact" className="hover:text-yellow-600 transition">
          Contact
        </Link>
        {isLoggedIn && (
          <Link href="/mypage" className="hover:text-yellow-600 transition">
            My Page
          </Link>
        )}
      </div>

      {/* 오른쪽 로그인/회원가입 버튼 */}
      <div className="flex space-x-4">
        {isLoggedIn ? (
          <Button
            variant="outline"
            className="text-yellow-800 border-yellow-800 hover:bg-yellow-200"
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        ) : (
          <>
            <Button variant="outline" className="text-yellow-800 border-yellow-800 hover:bg-yellow-200">
              <Link href="/login">Login</Link>
            </Button>
            <Button className="bg-yellow-500 text-yellow-900 hover:bg-yellow-600">
              <Link href="/signup">Sign Up</Link>
            </Button>
          </>
        )}
      </div>
    </nav>
  );
}
