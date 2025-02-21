import { translate } from '@/server/translate';
// import { translateClient } from '@/utils/client_translate';

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
  } = state;
  const { setTranslatedContent, setProgress, setIsTranslating, setError } =
    setters;

  const handleTranslate = async () => {
    if (!file) return;

    setIsTranslating(true);
    setError(null);
    setProgress(30);

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

      //! SSR
      translate(formData).then((data) => {
        setTranslatedContent(data.translatedText ?? '');
        setProgress(100);
      });
     
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Translation failed');
      setProgress(0);
    } finally {
      setIsTranslating(false);
    }
  };

  const clearAll = () => {
    setters.setFile(null);
    setters.setTranslatedContent('');
    setters.setFileContent('');
    setters.setProgress(0);
    setters.setError(null);
  };

  return { handleTranslate, clearAll };
};
