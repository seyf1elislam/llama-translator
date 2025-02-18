import type { TranslationState } from './useTranslationState';

export const useOpenaiLogic = (state: TranslationState) => {
  const { openaiBaseUrl, openaiToken, setters } = state;
  const { setOpenaiBaseUrl, setOpenaiToken, setError } = setters;

  return {
    setOpenaiBaseUrl,
    setOpenaiToken,
    setError,
    openaiBaseUrl,
    openaiToken,
  };
};
