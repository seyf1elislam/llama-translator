import { TranslationState } from '@/hooks/useTranslationState';
import { Settings } from 'lucide-react';

import ToggleThemeMode from '@/components/theme-components/toggle_theme_mode';
import { Button } from '@/components/ui/button';
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

export function SettingsSheet({ state }: { state: TranslationState }) {
  const { openaiToken, openaiBaseUrl } = state;
  const { setOpenaiToken, setOpenaiBaseUrl } = state.setters;
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
      <SheetContent>
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
                OpenAI Token
              </Label>
              <Input
                id='openai-token'
                type='password'
                value={openaiToken}
                onChange={(e) => setOpenaiToken(e.target.value)}
                placeholder='sk-...yourkey'
                className='col-span-3'
              />
            </div>

            {/* OpenAI Base URL field */}
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='openai-url' className='text-right'>
                Base URL
              </Label>
              <Input
                id='openai-url'
                type='text'
                value={openaiBaseUrl}
                onChange={(e) => setOpenaiBaseUrl(e.target.value)}
                placeholder='https://api.openai.com/v1'
                className='col-span-3'
              />
            </div>
          </div>

          {/* Footer with a Save button */}
          <SheetFooter>
            <SheetClose asChild>
              <Button type='submit'>Save Settings</Button>
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
