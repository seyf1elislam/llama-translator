import { TranslationState } from '@/hooks/useTranslationState';
import { ArrowUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { LanguageSelector } from './lang_selector';

export const LanguageSwitcher = ({
  state,
}: {
  state: TranslationState;
}) => {
  const {
    sourceLang,
    targetLang,
    setters: { setSourceLang, setTargetLang },
  } = state;

  const swapLanguages = () => {
    if (sourceLang === targetLang) {
      setSourceLang('Auto Detect');
      return;
    }

    const newSource = sourceLang === 'Auto Detect' ? targetLang : targetLang;
    const newTarget = sourceLang === 'Auto Detect' ? sourceLang : sourceLang;

    setSourceLang(newSource);
    setTargetLang(newTarget);
  };

  return (
    <div className='flex items-center justify-center gap-4'>
      <LanguageSelector value={sourceLang} onSelect={setSourceLang} />
      <Button
        variant='ghost'
        size='icon'
        className='rounded-full transition-transform hover:rotate-180 hover:bg-accent'
        onClick={swapLanguages}
      >
        <ArrowUpDown className='h-4 w-4' />
      </Button>
      <LanguageSelector value={targetLang} onSelect={setTargetLang} isTarget />
    </div>
  );
};
