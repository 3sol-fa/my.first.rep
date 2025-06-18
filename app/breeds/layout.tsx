import axios from 'axios';
import React, { ReactNode } from 'react';
import { BreedsProvider } from './BreedsContext';

interface BreedsLayoutProps {
  children: ReactNode;
}

async function getBreeds() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await axios.get(`${baseUrl}/api/dog-breeds`, {
      timeout: 10000, // 10초 타임아웃 설정
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    return res.data;
  } catch (error) {
    console.error('Failed to fetch breeds:', error);
    // 에러가 발생해도 빈 배열을 반환하여 앱이 계속 작동하도록 함
    return [];
  }
}

const BreedsLayout = async ({ children }: BreedsLayoutProps) => {
  const breeds = await getBreeds();

  return (
    <BreedsProvider breeds={breeds}>
      <div>{children}</div>
    </BreedsProvider>
  );
};

export default BreedsLayout;
