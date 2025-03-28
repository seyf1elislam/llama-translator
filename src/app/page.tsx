'use client';

import { useEffect, useState } from 'react';

import { TranslationInterface } from '@/components/main-components/main_interface';

import InterfaceSkeleton from './loading';

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); //ensuring the components is mounted on the client side
  }, []);

  return (
    <div className='flex min-h-dvh w-full flex-col items-center justify-center bg-gradient-to-br from-background to-secondary/30 px-2 py-4 md:py-8'>
      {isClient ? <TranslationInterface /> : <InterfaceSkeleton />}
    </div>
  );
}
