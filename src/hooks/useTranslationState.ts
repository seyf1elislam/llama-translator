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

  const [modelName, setModelName] = useState<string>('emini-2.0-pro-exp-02-05');
  const [temperature, setTemperature] = useState<number>(0.3);
  const [maxSeq, setMaxSeq] = useState<number>(8126);

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
    modelName,
    temperature,
    maxSeq,
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
      setModelName,
      setTemperature,
      setMaxSeq,
    },
  };
};
