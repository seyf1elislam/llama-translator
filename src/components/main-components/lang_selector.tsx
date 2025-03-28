import { Languages } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const LANG_LIST: string[] = [
  'Auto Detect',
  'Arabic',
  'English',
  'Spanish',
  'French',
  'German',
  'Chinese',
  'Japanese',
  'Russian',
  'Portuguese',
  'Italian',
];

interface LanguageSelectorProps {
  value: string;
  onSelect: (lang: string) => void;
  disabledLang?: string; // Language to disable in the list
  isTarget?: boolean; // Specifically for disabling "Auto Detect" in target
}

export const LanguageSelector = ({
  value,
  onSelect,
  disabledLang,
  isTarget = false,
}: LanguageSelectorProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant='outline' className='w-full justify-start sm:w-[180px]'>
        <Languages className='mr-2 h-4 w-4 flex-shrink-0' />
        <span className='truncate'>{value}</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className='max-h-60 overflow-y-auto'>
      {LANG_LIST.map((lang) => (
        <DropdownMenuItem
          key={lang}
          onSelect={() => onSelect(lang)}
          // Disable if it's the opposite language or if it's "Auto Detect" for target
          disabled={
            (isTarget && lang === 'Auto Detect') || lang === disabledLang
          }
          className='cursor-pointer'
        >
          {lang}
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
);
