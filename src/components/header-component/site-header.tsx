'use client';

import { cx } from 'class-variance-authority';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import React from 'react';
import { FaOpencart } from 'react-icons/fa';
import { MdOutlineFavoriteBorder } from 'react-icons/md';

import ThemeSwitcher from '@/components/theme-components/them_switch';
import type { ToggleThemeModeProps } from '@/components/theme-components/toggle_theme_mode';

import { siteConfig } from '@/config/siteConfig';

import { buttonVariants } from '../ui/button';
import MainNav from './main-nav';
import MobileNav from './mobile-nav';

// import ToggleThemeMode from "./toggle_theme_mode";

const ToggleThemeMode: React.ComponentType<ToggleThemeModeProps> = dynamic(
  () => import('../theme-components/toggle_theme_mode'),
  {
    ssr: false,
  },
);

const links_scoial = [
  { icon: 'github', url: 'https://github.com/seyf1elislam/' },
  // { icon: "reddit", url: "https://www.reddit.com/u/seyf1elislam" },
  // { icon: "twitter", url: "https://twitter.com/seyf1elislam" },
  { icon: 'linkedin', url: 'https://www.linkedin.com/in/seyf1eislam' },
  // { icon: "discord", url: "https://discordapp.com/users/seyf1elislam" },
  // { icon: "huggingface", url: "https://huggingface.co/seyf1elislam" },
];
// sticky  top-0
export default function SiteHeader() {
  return (
    // sticky top-0
    <header
      className='text-forground supports-[backdrop-filter]:bg-foreground/00 dark:prose-invert z-20 flex w-full items-center backdrop-blur-0 md:h-24 md:border-none'
      // flex w-full items-center border-b bg-background backdrop-blur  supports-[backdrop-filter]:bg-background/60 md:h-24 md:border-none"
    >
      <div className='container flex h-14 max-w-screen-2xl items-center px-4'>
        <MainNav />
        <div className='flex flex-1 items-center justify-end space-x-2'>
          <nav className='flex items-center'>
            {/* <SocialIconsResuable
              links={links_scoial}
              className="hidden sm:justify-center md:flex md:flex-row "
            /> */}
          </nav>
          {/* <ToggleThemeMode
            className="hidden sm:inline-flex"
            use_expaned_variant={false}
          /> */}
          <LeftIcons />
          <ThemeSwitcher className='hidden sm:inline-flex' />

          <MobileNav />
        </div>
      </div>
    </header>
  );
}

function LeftIcons() {
  return (
    <div className='flex flex-row gap-1'>
      <IconContainer>
        <FaOpencart />
      </IconContainer>
      <IconContainer>
        <MdOutlineFavoriteBorder />
      </IconContainer>
    </div>
  );
}

function IconContainer({ children }: { children: React.ReactNode }) {
  return <div className='rounded-md p-3 hover:bg-accent'>{children}</div>;
}
