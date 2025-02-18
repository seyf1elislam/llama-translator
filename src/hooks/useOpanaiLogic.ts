import { useEffect } from 'react';

import type { TranslationState } from './useTranslationState';

// Utility function for URL validation
const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const useOpenaiLogic = (state: TranslationState) => {
  const { openaiBaseUrl, openaiToken, setters } = state;
  const { setOpenaiBaseUrl, setOpenaiToken, setError } = setters;

  const BASE_URL_KEY = 'OPENAI_API_BASE_URL';
  const TOKEN_KEY = 'OPENAI_API_KEY_xyz';

  // Initial load from localStorage
  useEffect(() => {
    const errors: string[] = [];
    const savedBaseUrl = localStorage.getItem(BASE_URL_KEY);
    const savedToken = localStorage.getItem(TOKEN_KEY);

    if (savedBaseUrl) {
      setOpenaiBaseUrl(savedBaseUrl);
      if (!validateUrl(savedBaseUrl)) {
        errors.push('Invalid saved OpenAI Base URL format');
      }
    }

    if (savedToken) {
      setOpenaiToken(savedToken);
      if (savedToken.length < 10) {
        // Basic token length validation
        errors.push('Invalid saved OpenAI token format');
      }
    }

    if (errors.length > 0) {
      setError(errors.join(' '));
    }
  }, [setOpenaiBaseUrl, setOpenaiToken, setError]);

  // Save handlers with validation
  const validateAndSave = () => {
    const errors: string[] = [];

    if (!validateUrl(openaiBaseUrl)) {
      errors.push('Invalid OpenAI Base URL format');
    }

    if (!openaiToken || openaiToken.length < 10) {
      errors.push('Invalid OpenAI token format');
    }

    if (errors.length > 0) {
      setError(errors.join(' '));
      return false;
    }

    localStorage.setItem(BASE_URL_KEY, openaiBaseUrl);
    localStorage.setItem(TOKEN_KEY, openaiToken);
    setError(null);
    return true;
  };

  // Auto-save with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (openaiBaseUrl || openaiToken) {
        validateAndSave();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [openaiBaseUrl, openaiToken]);

  return {
    setOpenaiBaseUrl,
    setOpenaiToken,
    openaiBaseUrl,
    openaiToken,
    validateAndSave,
  };
};
