import { useOpenaiLogic } from '@/hooks/useOpanaiLogic';
import { TranslationState } from '@/hooks/useTranslationState';
import { Settings } from 'lucide-react';
import { useState } from 'react';

import ToggleThemeMode from '@/components/theme-components/toggle_theme_mode';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

const Providers_endpoints = [
  { name: 'OpenAI', url: 'https://api.openai.com/v1' },
  { name: 'OpenRouter', url: 'https://openrouter.ai/api/v1' },
  { name: 'Google', url: 'https://generativelanguage.googleapis.com/v1beta' },
];

export function SettingsSheet({ state }: { state: TranslationState }) {
  const {
    setOpenaiBaseUrl,
    setOpenaiToken,
   validateAndSave,
    openaiBaseUrl,
    openaiToken,
  } = useOpenaiLogic(state);
  const [useCustomUrl, setUseCustomUrl] = useState(false);

  return (
    <Sheet>
      {/* Trigger to open the settings sheet */}
      <SheetTrigger asChild>
        <Button variant='outline'>
          <Settings className='mr-2 h-4 w-4' />
          Settings
        </Button>
      </SheetTrigger>

      {/* Sheet content */}
      <SheetContent side={'left'} className='w-[400px] sm:min-w-[540px]'>
        <SheetHeader>
          <SheetTitle className='flex items-center'>
            <Settings className='mr-1 size-5' /> Settings
          </SheetTitle>
          <SheetDescription>
            Configure your OpenAI settings below.
          </SheetDescription>
        </SheetHeader>
        {/* Settings form */}
        <form onSubmit={(e) => e.preventDefault()}>
          <div className='grid gap-4 py-4'>
            {/* OpenAI API Token field */}
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='openai-token' className='text-right'>
                Api Token
              </Label>
              <Input
                id='openai-token'
                type='text'
                value={openaiToken}
                onChange={(e) => setOpenaiToken(e.target.value)}
                placeholder='sk-...yourkey'
                // placeholder='sk-...yourkey'
                className='col-span-3'
              />
            </div>
            {/* Shadecn Checkbox to choose between providers and custom URL */}
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='use-custom-url' className='text-right'>
                Custom URL
              </Label>
              <div className='col-span-3 flex items-center'>
                {/* <input
                  type='checkbox'
                  id='use-custom-url'
                  checked={useCustomUrl}
                  onChange={(e) => setUseCustomUrl(e.target.checked)}
                /> */}
                <Checkbox
                  id='use-custom-url'
                  checked={useCustomUrl}
                  onCheckedChange={(checked: boolean) =>
                    setUseCustomUrl(checked)
                  }
                />
                {/* <label htmlFor='use-custom-url2' className='ml-2'>
                  Use custom URL
                </label> */}
              </div>
            </div>
            {/* Conditionally render Provider dropdown or Base URL input */}
            {!useCustomUrl ? (
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='openai-provider' className='text-right'>
                  Provider
                </Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant='outline'
                      className='col-span-3 justify-start'
                    >
                      {
                        Providers_endpoints.find((p) => p.url === openaiBaseUrl)
                          ?.name
                      }
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className='w-56'>
                    {Providers_endpoints.map((provider) => (
                      <DropdownMenuItem
                        key={provider.name}
                        onClick={() => setOpenaiBaseUrl(provider.url)}
                      >
                        {provider.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='openai-url' className='text-right'>
                  Base URL
                </Label>
                <Input
                  id='openai-url'
                  type='text'
                  value={openaiBaseUrl}
                  onChange={(e) => setOpenaiBaseUrl(e.target.value)}
                  placeholder='Enter custom URL'
                  className='col-span-3'
                />
              </div>
            )}
          </div>

          {/* Footer with a Save button */}
          <SheetFooter>
            <SheetClose asChild>
              <Button onClick={validateAndSave} type='submit'>
                Save Settings
              </Button>
            </SheetClose>
          </SheetFooter>
        </form>
        <ToggleThemeMode
          use_expaned_variant={true}
          show_text
          className='mt-4 w-fit'
        />
      </SheetContent>
    </Sheet>
  );
}
