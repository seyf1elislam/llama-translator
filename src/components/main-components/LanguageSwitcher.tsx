import { useTranslationStore } from '@/store/translationStore';
import { ArrowUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Added Tooltip

import { LanguageSelector } from './lang_selector';

export const LanguageSwitcher = () => {
  // Get state and actions from Zustand store
  const sourceLang = useTranslationStore((state) => state.sourceLang);
  const targetLang = useTranslationStore((state) => state.targetLang);
  const setSourceLang = useTranslationStore((state) => state.setSourceLang);
  const setTargetLang = useTranslationStore((state) => state.setTargetLang);
  const swapLanguages = useTranslationStore((state) => state.swapLanguages);
  const isTranslating = useTranslationStore((state) => state.isTranslating);
  const isReadingFile = useTranslationStore((state) => state.isReadingFile);

  const isDisabled = isTranslating || isReadingFile;

  return (
    // Responsive layout: stack on small screens, row on larger
    <div className='flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-4'>
      <LanguageSelector
        value={sourceLang}
        onSelect={setSourceLang}
        disabledLang={targetLang} // Disable selecting the target language
      />
      <Tooltip>
        <TooltipTrigger asChild>
          {/* Use span to wrap button for Tooltip when disabled */}
          <span tabIndex={isDisabled ? -1 : undefined}>
            <Button
              variant='ghost'
              size='icon'
              className='rounded-full transition-transform duration-300 hover:rotate-180 hover:bg-accent disabled:opacity-50'
              onClick={swapLanguages}
              disabled={isDisabled || sourceLang === 'Auto Detect'} // Disable swap if source is Auto Detect
              aria-label='Swap languages'
            >
              <ArrowUpDown className='h-4 w-4' />
            </Button>
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>Swap Languages</p>
          {sourceLang === 'Auto Detect' && (
            <p className='text-xs text-muted-foreground'>
              (Select a specific source language to swap)
            </p>
          )}
        </TooltipContent>
      </Tooltip>
      <LanguageSelector
        value={targetLang}
        onSelect={setTargetLang}
        disabledLang={sourceLang} // Disable selecting the source language
        isTarget // Disables "Auto Detect"
      />
    </div>
  );
};
