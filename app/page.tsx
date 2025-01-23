'use client'

import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();

  return router.replace('/login');
}
