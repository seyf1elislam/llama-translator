import { useTranslationStore } from '@/store/translationStore';
import { Settings } from 'lucide-react';
import { useEffect, useState } from 'react';

import ToggleThemeMode from '@/components/theme-components/toggle_theme_mode';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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

const Providers_endpoints = [
  { name: 'OpenAI', url: 'https://api.openai.com/v1' },
  { name: 'OpenRouter', url: 'https://openrouter.ai/api/v1' },
  { name: 'Google', url: 'https://generativelanguage.googleapis.com/v1beta' },
  { name: 'Together AI', url: 'https://api.together.xyz/v1' },
  { name: 'Groq', url: 'https://api.groq.com/openai/v1' },
];

export function SettingsSheet() {
  // Select individual state values
  const openaiBaseUrl = useTranslationStore((state) => state.openaiBaseUrl);
  const openaiToken = useTranslationStore((state) => state.openaiToken);
  const modelName = useTranslationStore((state) => state.modelName);
  const temperature = useTranslationStore((state) => state.temperature);
  const maxSeq = useTranslationStore((state) => state.maxSeq);
  const error = useTranslationStore((state) => state.error);

  // Select individual actions
  const setOpenaiBaseUrl = useTranslationStore(
    (state) => state.setOpenaiBaseUrl,
  );
  const setOpenaiToken = useTranslationStore((state) => state.setOpenaiToken);
  const setModelName = useTranslationStore((state) => state.setModelName);
  const setTemperature = useTranslationStore((state) => state.setTemperature);
  const setMaxSeq = useTranslationStore((state) => state.setMaxSeq);
  const setError = useTranslationStore((state) => state.setError);

  const [showCustomUrlInput, setshowCustomUrlInput] = useState<boolean>(false);
  useEffect(() => {
    const show_ = !Providers_endpoints.some((p) => p.url === openaiBaseUrl);
    setshowCustomUrlInput(show_);
  }, []);

  const handleCustomUrlCheckChange = (checked: boolean | string) => {
    const isCustom = Boolean(checked);
    setshowCustomUrlInput(isCustom);
    if (!isCustom) {
      //! when user unchecks, revert to the default provider (e.g., OpenAI)
      setOpenaiBaseUrl(Providers_endpoints[0].url);
    }
    // If checking, the input field change handler will update the URL
    setError(null); // Clear error on interaction
  };

  const currentProviderName =
    Providers_endpoints.find((p) => p.url === openaiBaseUrl)?.name ??
    (showCustomUrlInput ? 'Custom' : 'Select Provider');

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant='outline'>
          <Settings className='mr-2 h-4 w-4' />
          Settings
        </Button>
      </SheetTrigger>

      <SheetContent
        side={'left'}
        className='flex w-[90vw] max-w-[400px] flex-col sm:max-w-[540px]'
      >
        <SheetHeader>
          <SheetTitle className='flex items-center'>
            <Settings className='mr-2 size-5' /> Settings
          </SheetTitle>
          <SheetDescription>
            Configure your AI provider settings. Changes are saved
            automatically.
          </SheetDescription>
        </SheetHeader>

        {/* Display settings-specific errors */}
        {error && error.includes('OpenAI') && (
          <div className='my-2 rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive'>
            {error}
          </div>
        )}

        <div className='flex-grow space-y-4 overflow-y-auto py-4 pr-2'>
          {/* API Token */}
          <div className='grid grid-cols-4 items-center gap-x-4 gap-y-1'>
            <Label htmlFor='openai-token' className='text-right'>
              API Token
            </Label>
            <Input
              id='openai-token'
              type='password'
              value={openaiToken}
              onChange={(e) => {
                setOpenaiToken(e.target.value);
                setError(null);
              }}
              placeholder='sk-... or equivalent'
              className='col-span-3'
              autoComplete='off'
            />
          </div>

          {/* Model Name */}
          <div className='grid grid-cols-4 items-center gap-x-4 gap-y-1'>
            <Label htmlFor='model-name' className='text-right'>
              Model Name
            </Label>
            <Input
              id='model-name'
              type='text'
              value={modelName}
              onChange={(e) => {
                setModelName(e.target.value);
                setError(null);
              }}
              placeholder='e.g., gpt-4o-mini'
              className='col-span-3'
            />
          </div>

          {/* Temperature */}
          <div className='grid grid-cols-4 items-center gap-x-4 gap-y-1'>
            <Label htmlFor='temperature' className='text-right'>
              Temperature
            </Label>
            <Input
              id='temperature'
              type='number'
              value={temperature}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                // Allow setting empty string temporarily, store handles NaN check if needed later
                if (
                  e.target.value === '' ||
                  (!isNaN(val) && val >= 0 && val <= 2)
                ) {
                  setTemperature(
                    isNaN(val) && e.target.value !== '' ? temperature : val,
                  ); // Keep old value on invalid input other than empty
                }
                setError(null);
              }}
              placeholder='0.3'
              className='col-span-3'
              step='0.1'
              min='0'
              max='2'
            />
          </div>

          {/* Max Sequence Length */}
          <div className='grid grid-cols-4 items-center gap-x-4 gap-y-1'>
            <Label htmlFor='max-seq' className='text-right'>
              Max Tokens
            </Label>
            <Input
              id='max-seq'
              type='number'
              value={maxSeq}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (e.target.value === '' || (!isNaN(val) && val >= 1)) {
                  setMaxSeq(isNaN(val) && e.target.value !== '' ? maxSeq : val); // Keep old value on invalid input other than empty
                }
                setError(null);
              }}
              placeholder='e.g., 8192'
              className='col-span-3'
              min='1'
              step='1'
            />
            <p className='col-span-3 col-start-2 text-xs text-muted-foreground'>
              Max output tokens (check model limits).
            </p>
          </div>

          {/* Custom URL Checkbox */}
          <div className='grid grid-cols-4 items-center gap-x-4 gap-y-1'>
            <Label htmlFor='use-custom-url-label' className='text-right'>
              API Endpoint
            </Label>
            <div className='col-span-3 flex items-center space-x-2'>
              <Checkbox
                id='use-custom-url'
                checked={showCustomUrlInput}
                onCheckedChange={handleCustomUrlCheckChange}
              />
              <Label htmlFor='use-custom-url' className='text-sm font-normal'>
                Use Custom URL
              </Label>
            </div>
          </div>

          {/* Provider Dropdown or Custom URL Input */}
          {!showCustomUrlInput ? (
            <div className='grid grid-cols-4 items-center gap-x-4 gap-y-1'>
              <Label htmlFor='openai-provider' className='text-right'>
                Provider
              </Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='outline'
                    className='col-span-3 justify-start font-normal'
                  >
                    {currentProviderName}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-56'>
                  {Providers_endpoints.map((provider) => (
                    <DropdownMenuItem
                      key={provider.name}
                      onSelect={() => {
                        setOpenaiBaseUrl(provider.url);
                        setError(null);
                      }}
                      className='cursor-pointer'
                    >
                      {provider.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className='grid grid-cols-4 items-center gap-x-4 gap-y-1'>
              <Label htmlFor='openai-url' className='text-right'>
                Base URL
              </Label>
              <Input
                id='openai-url'
                type='url'
                value={openaiBaseUrl}
                onChange={(e) => {
                  setOpenaiBaseUrl(e.target.value);
                  setError(null);
                }}
                placeholder='https://your-proxy-or-api.com/v1'
                className='col-span-3'
              />
            </div>
          )}
        </div>

        <SheetFooter className='mt-auto border-t pt-4'>
          <ToggleThemeMode
            use_expaned_variant={true}
            show_text
            className='mr-auto'
          />
          <SheetClose asChild>
            <Button variant='outline'>Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
