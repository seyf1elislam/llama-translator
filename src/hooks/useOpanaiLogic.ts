import { useCallback, useEffect } from 'react';

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
  const {
    openaiBaseUrl,
    openaiToken,
    modelName,
    temperature,
    maxSeq,
    setters,
  } = state;
  const {
    setOpenaiBaseUrl,
    setOpenaiToken,
    setModelName,
    setTemperature,
    setMaxSeq,
    setError,
  } = setters;

  const BASE_URL_KEY = 'OPENAI_API_BASE_URL';
  const TOKEN_KEY = 'OPENAI_API_KEY_xyz';
  const MODEL_NAME_KEY = 'OPENAI_MODEL_NAME';
  const TEMPERATURE_KEY = 'OPENAI_TEMPERATURE';
  const MAX_SEQ_KEY = 'OPENAI_MAX_SEQ';

  // Initial load from localStorage
  useEffect(() => {
    const errors: string[] = [];
    const savedBaseUrl = localStorage.getItem(BASE_URL_KEY);
    const savedToken = localStorage.getItem(TOKEN_KEY);
    const savedModelName = localStorage.getItem(MODEL_NAME_KEY);
    const savedTemperature = localStorage.getItem(TEMPERATURE_KEY);
    const savedMaxSeq = localStorage.getItem(MAX_SEQ_KEY);

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

    if (savedModelName) {
      setModelName(savedModelName);
    }

    if (savedTemperature) {
      setTemperature(parseFloat(savedTemperature));
    }

    if (savedMaxSeq) {
      setMaxSeq(parseInt(savedMaxSeq, 10));
    }

    if (errors.length > 0) {
      setError(errors.join(' '));
    }
  }, [
    setOpenaiBaseUrl,
    setOpenaiToken,
    setModelName,
    setTemperature,
    setMaxSeq,
    setError,
  ]);

  // Save handlers with validation
  const validateAndSave = useCallback(() => {
    const errors: string[] = [];

    if (!validateUrl(openaiBaseUrl)) {
      errors.push('Invalid OpenAI Base URL format');
    }

    if (!openaiToken || openaiToken.length < 10) {
      errors.push('Invalid OpenAI token format');
    }

    if (!modelName) {
      errors.push('Model name is required');
    }

    if (temperature === null) {
      errors.push('Temperature is required');
    }

    if (maxSeq === null) {
      errors.push('Max sequence length is required');
    }

    if (errors.length > 0) {
      setError(errors.join(' '));
      return false;
    }

    localStorage.setItem(BASE_URL_KEY, openaiBaseUrl);
    localStorage.setItem(TOKEN_KEY, openaiToken);
    localStorage.setItem(MODEL_NAME_KEY, modelName);
    localStorage.setItem(TEMPERATURE_KEY, temperature.toString());
    localStorage.setItem(MAX_SEQ_KEY, maxSeq.toString());
    setError(null);
    return true;
  }, [openaiBaseUrl, openaiToken, modelName, temperature, maxSeq, setError]);

  // Auto-save with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (openaiBaseUrl || openaiToken || modelName || temperature || maxSeq) {
        validateAndSave();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [
    openaiBaseUrl,
    openaiToken,
    modelName,
    temperature,
    maxSeq,
    validateAndSave,
  ]);

  return {
    setOpenaiBaseUrl,
    setOpenaiToken,
    setModelName,
    setTemperature,
    setMaxSeq,
    openaiBaseUrl,
    openaiToken,
    modelName,
    temperature,
    maxSeq,
    validateAndSave,
  };
};
