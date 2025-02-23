import { translate } from '@/server/translate';

import type { TranslationState } from './useTranslationState';

export const useTranslationLogic = (state: TranslationState) => {
  const {
    file,
    sourceLang,
    targetLang,
    openaiBaseUrl,
    openaiToken,
    modelName,
    temperature,
    maxSeq,
    setters,
    startTransition,
  } = state;
  const { setTranslatedContent, setProgress, setError } = setters;

  const handleTranslate = async () => {
    if (!file) return;

    setError(null);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append(
        'sourceLang',
        sourceLang === 'Auto Detect' ? 'auto' : sourceLang,
      );
      formData.append('targetLang', targetLang);
      formData.append('openaiBaseUrl', openaiBaseUrl);
      formData.append('openaiToken', openaiToken);
      formData.append('modelName', modelName);
      formData.append('targetLang', targetLang);
      formData.append('temperature', temperature.toString());
      formData.append('maxSeq', maxSeq.toString());

      // //! Call SSR function
      translate(formData).then((data) => {
        startTransition(() => {
          setTranslatedContent(data.translatedText ?? '');
          setProgress(100);
        });
      });
    } catch (err) {
      startTransition(() => {
        setError(err instanceof Error ? err.message : 'Translation failed');
        setProgress(0);
      });
    } finally {
      // Removed setIsTranslating(false);
    }
  };

  return { handleTranslate };
};
