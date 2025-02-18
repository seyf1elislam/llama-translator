'use client';

import { useTheme } from 'next-themes';
// import { Moon, Sun } from "lucide-react";
import { GrSystem } from 'react-icons/gr';
// import { GiNightSky } from "react-icons/gi";
// import { WiDaySunny } from "react-icons/wi";
import { IoSunny } from 'react-icons/io5';
import { MdOutlineNightlight } from 'react-icons/md';

import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export type ToggleThemeModeProps = {
  use_expaned_variant?: boolean;
  className?: string;
  children?: React.ReactNode;
  show_text?: boolean;
};
export default function ToggleThemeMode({
  use_expaned_variant = true,
  show_text = false,
  className,
  children,
}: ToggleThemeModeProps) {
  const { theme, setTheme } = useTheme();
  const toggleTheme = () => {
    setTheme((theme) => (theme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div>
            {/* {use_custom_button && children} */}
            {use_expaned_variant ? (
              <div className='mx-2 flex items-center p-0'>
                {show_text ? (
                  <span className='mr-2'>Select Theme :</span>
                ) : null}
                <Button
                  variant='outline'
                  className='flex flex-1 items-center justify-between space-x-1 px-4 py-0'
                >
                  <IoSunny className='flex-2 inline-flex size-5 scale-100 justify-start transition-all dark:hidden dark:scale-0' />
                  <MdOutlineNightlight className='flex-2 hidden size-5 scale-0 justify-start transition-all dark:inline-flex dark:scale-100' />
                  <span className='inline flex-1 px-3 sm:hidden'>{theme}</span>
                </Button>
              </div>
            ) : null}
            {!use_expaned_variant && (
              <div
                // variant="ghost"
                className={'m-0 flex w-6 items-end justify-center p-0'}
                onClick={() => toggleTheme()}
              >
                <IoSunny className='inline-flex size-6 scale-100 transition-all dark:hidden dark:scale-0' />
                <MdOutlineNightlight className='hidden size-6 scale-0 transition-all dark:inline-flex dark:scale-100' />
              </div>
            )}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {/* <DropdownMenuItem onClick={() => setTheme("light")}>
            Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            dark
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>
            system
          </DropdownMenuItem> */}

          <DropdownMenuItem
            onClick={() => setTheme('light')}
            className='flex flex-1 items-center justify-between space-x-3'
          >
            <IoSunny className='w-8' />
            <span className='w-fill inline flex-1 px-3'>Light</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setTheme('dark')}
            className='flex flex-1 items-center justify-between space-x-3'
          >
            <MdOutlineNightlight className='w-8' />
            <span className='w-fill inline flex-1 px-3'>Dark</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setTheme('system')}
            className='flex flex-1 items-center justify-between space-x-3'
          >
            <GrSystem className='w-8'></GrSystem>
            <span className='w-fill inline flex-1 px-3'>System</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
