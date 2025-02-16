import { useState } from 'react';

export type TranslationState = ReturnType<typeof useTranslationState>;

export const useTranslationState = () => {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [sourceLang, setSourceLang] = useState('Auto Detect');
  const [targetLang, setTargetLang] = useState('English');
  const [translatedContent, setTranslatedContent] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  return {
    file,
    progress,
    sourceLang,
    targetLang,
    translatedContent,
    fileContent,
    isTranslating,
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
    },
  };
};
