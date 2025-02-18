import { useState } from 'react';

export type TranslationState = ReturnType<typeof useTranslationState>;

export const useTranslationState = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState('');
  // Progress of translation
  const [progress, setProgress] = useState(0);
  const [isTranslating, setIsTranslating] = useState(false);
  // Source and target language
  const [sourceLang, setSourceLang] = useState('Auto Detect');
  const [targetLang, setTargetLang] = useState('English');
  const [translatedContent, setTranslatedContent] = useState('');
  // Error message
  const [error, setError] = useState<string | null>(null);
  //token and base url for openai
  const [openaiToken, setOpenaiToken] = useState('');
  const [openaiBaseUrl, setOpenaiBaseUrl] = useState(
    'https://api.openai.com/v1',
  );
  return {
    file,
    progress,
    sourceLang,
    targetLang,
    translatedContent,
    fileContent,
    isTranslating,
    openaiBaseUrl,
    openaiToken,
    error,
    setters: {
      setFile,
      setProgress,
      setSourceLang,
      setTargetLang,
      setTranslatedContent,
      setFileContent,
      setIsTranslating,
      setError,
      setOpenaiToken,
      setOpenaiBaseUrl,
    },
  };
};
