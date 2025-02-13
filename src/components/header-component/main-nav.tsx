'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import { CiShop } from 'react-icons/ci';
import { CiBullhorn } from 'react-icons/ci';
import { FaGripfire } from 'react-icons/fa';
import { IoHomeOutline } from 'react-icons/io5';

import { cn } from '@/lib/utils';

import LogoImg from './logo';

export default function MainNav() {
  const searchParams = useSearchParams();
  const pathname_ = usePathname();
  return (
    <nav className='flex items-center space-x-0 lg:space-x-0'>
      <Link href='/' className='flex items-center md:mr-6 md:space-x-2'>
        <LogoImg />
        {/* <span className="font-serif font-medium"> {siteConfig.name}</span> */}
      </Link>
      <MainNavElement pathname={pathname_} href='/' title='Home'>
        <IoHomeOutline />
      </MainNavElement>
      <MainNavElement pathname={pathname_} href='/shop' title='Shop'>
        <CiShop />
      </MainNavElement>
      {/* <MainNavElement
        pathname={pathname_}
        href="#Popular-Products"
        title="Popular Products"
      >
        <FaGripfire />
      </MainNavElement> */}
      <MainNavElement
        pathname={pathname_}
        href='#Announcement'
        title='Announcement'
      >
        <CiBullhorn />
      </MainNavElement>
    </nav>
  );
}

export function MainNavElement({
  pathname,
  href,
  title,
  children,
  alias_href,
  isMobile,
}: {
  pathname: string;
  href: string;
  alias_href?: string;
  title: string;
  children?: React.ReactNode;
  isMobile?: boolean;
}) {
  const isActive = pathname === href || (alias_href && pathname === alias_href);
  return (
    <Link
      href={href}
      className={cn(
        'text-md group px-2 font-medium text-foreground/50 transition-colors hover:text-primary sm:inline-block md:px-4 md:py-3',
        // isActive ? " text-foreground " : " text-foreground/50",
        { 'text-foreground': isActive },
        { hidden: !isMobile },
      )}
    >
      {children ? (
        <div className='flex flex-row items-center gap-1'>
          {children}
          {title}
        </div>
      ) : (
        title
      )}

      <div
        className={cn(
          'group-hover:animate-rotateYOpen mt-0.5 h-0.5 bg-primary transition-all duration-1000 group-hover:w-full',
          { 'animate-rotateYOpen w-full': isActive },
          { 'animate-rotateYClose w-0': !isActive },
          // [transform:rotateY(0deg)]
        )}
      ></div>
    </Link>
  );
}
