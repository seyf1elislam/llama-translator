import { useSwapLanguageLogic } from '@/hooks/useSwapLanguageLogic';
import { TranslationState } from '@/hooks/useTranslationState';
import { ArrowUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { LanguageSelector } from './lang_selector';

export const LanguageSwitcher = ({ state }: { state: TranslationState }) => {
  const {
    sourceLang,
    targetLang,
    swapLanguages,
    setSourceLangWrapper,
    setTargetLangWrapper,
  } = useSwapLanguageLogic(state);

  return (
    <div className='flex items-center justify-center gap-4'>
      <LanguageSelector value={sourceLang} onSelect={setSourceLangWrapper} />
      <Button
        variant='ghost'
        size='icon'
        className='rounded-full transition-transform hover:rotate-180 hover:bg-accent'
        onClick={swapLanguages}
      >
        <ArrowUpDown className='h-4 w-4' />
      </Button>
      <LanguageSelector
        value={targetLang}
        onSelect={setTargetLangWrapper}
        isTarget
      />
    </div>
  );
};
