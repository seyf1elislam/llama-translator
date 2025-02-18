import type { TranslationState } from './useTranslationState';

export const useSwapLanguageLogic = (state: TranslationState) => {
  const {
    sourceLang,
    targetLang,
    setters: { setSourceLang, setTargetLang },
  } = state;

  const swapLanguages = () => {
    // Never allow targetLang to be "Auto Detect"
    const newSource = targetLang;

    // Only use sourceLang if it's NOT "Auto Detect"
    const newTarget = sourceLang === 'Auto Detect' ? targetLang : sourceLang;

    // Handle case where swap might create duplicates
    if (newSource === newTarget) {
      setSourceLang('Auto Detect');
    } else {
      setSourceLang(newSource);
      setTargetLang(newTarget);
    }
  };

  const setSourceLangWrapper = (lang: string) => {
    if (lang !== targetLang) {
      setSourceLang(lang);
    }
  };
  const setTargetLangWrapper = (lang: string) => {
    if (lang !== sourceLang) {
      setTargetLang(lang);
    }
  };
  return {
    sourceLang,
    targetLang,
    swapLanguages,
    setSourceLang,
    setTargetLang,
    setSourceLangWrapper,
    setTargetLangWrapper,
  };
};
