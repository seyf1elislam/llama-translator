import { Languages } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const LANG_LIST: string[] = [
  'Auto Detect',
  'Arabic',
  'English',
  'Spanish',
  'French',
  'German',
  'Chinese',
];

export const LanguageSelector = ({
  value,
  sourceLang,
  onSelect,
}: {
  value: string;
  sourceLang: string;
  onSelect: (lang: string) => void;
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant='outline' className='w-[180px] justify-start'>
        <Languages className='mr-2 h-4 w-4' />
        {value}
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      {LANG_LIST.map((lang) => (
        <DropdownMenuItem
          key={lang}
          onSelect={() => onSelect(lang)}
          disabled={lang === 'Auto Detect' && sourceLang !== 'Auto Detect'}
        >
          {lang}
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
);
