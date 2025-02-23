import { useState, useTransition } from 'react';

export type TranslationState = ReturnType<typeof useTranslationState>;

export const useTranslationState = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState('');
  const [progress, setProgress] = useState(0);
  const [sourceLang, setSourceLang] = useState('Auto Detect');
  const [targetLang, setTargetLang] = useState('English');
  const [translatedContent, setTranslatedContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [openaiToken, setOpenaiToken] = useState('');
  const [openaiBaseUrl, setOpenaiBaseUrl] = useState(
    'https://api.openai.com/v1',
  );

  const [modelName, setModelName] = useState<string>('emini-2.0-pro-exp-02-05');
  const [temperature, setTemperature] = useState<number>(0.3);
  const [maxSeq, setMaxSeq] = useState<number>(8126);

  // Replace isTranslating state with useTransition
  const [isPending, startTransition] = useTransition();

  // const clearAll = () => {
  function clearAll() {
    setFile(null);
    setTranslatedContent('');
    setFileContent('');
    setProgress(0);
    setError(null);
  }
  return {
    file,
    progress,
    sourceLang,
    targetLang,
    translatedContent,
    fileContent,
    isPending,
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
      setError,
      setOpenaiToken,
      setOpenaiBaseUrl,
      setModelName,
      setTemperature,
      setMaxSeq,
      clearAll,
    },
    startTransition, // exposing startTransition for async state updates
  };
};
