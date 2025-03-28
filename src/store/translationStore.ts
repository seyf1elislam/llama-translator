import { parsePdfFileSSA } from '@/server/parsepdf';
import { translate } from '@/server/translate';
import mammoth from 'mammoth';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// State and Actions interfaces remain the same...
interface TranslationState {
  file: File | null;
  fileContent: string;
  translatedContent: string;
  sourceLang: string;
  targetLang: string;
  openaiToken: string;
  openaiBaseUrl: string;
  modelName: string;
  temperature: number;
  maxSeq: number;
  isReadingFile: boolean;
  isTranslating: boolean;
  progress: number;
  error: string | null;
}

interface TranslationActions {
  setFile: (file: File | null) => void;
  // readFileContent removed as public action, now internal detail of setFile
  setFileContent: (content: string) => void;
  setSourceLang: (lang: string) => void;
  setTargetLang: (lang: string) => void;
  swapLanguages: () => void;
  handleTranslate: () => Promise<void>;
  setOpenaiToken: (token: string) => void;
  setOpenaiBaseUrl: (url: string) => void;
  setModelName: (name: string) => void;
  setTemperature: (temp: number) => void;
  setMaxSeq: (seq: number) => void;
  validateAndSaveSettings: () => boolean;
  setError: (error: string | null) => void;
  clearAll: () => void;
}

const initialState: TranslationState = {
  file: null,
  fileContent: '',
  translatedContent: '',
  sourceLang: 'Auto Detect',
  targetLang: 'English',
  openaiToken: '',
  openaiBaseUrl: 'https://api.openai.com/v1',
  modelName: 'gpt-4o-mini',
  temperature: 0.3,
  maxSeq: 8192,
  isReadingFile: false,
  isTranslating: false,
  progress: 0,
  error: null,
};

const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const useTranslationStore = create<
  TranslationState & TranslationActions
>()(
  persist(
    (set, get) => ({
      ...initialState,

      setFile: (file) => {
        // Reset state *before* starting async operation
        set({
          file: file,
          fileContent: '',
          translatedContent: '',
          error: null,
          progress: 0,
          isReadingFile: !!file, // Set reading true only if there's a file
          isTranslating: false, // Ensure translating is false
        });

        // Perform async read operation if a file was provided
        if (file) {
          const readFileAsync = async (fileToRead: File) => {
            try {
              let content = '';
              if (fileToRead.type === 'application/pdf') {
                const pdfData = await parsePdfFileSSA(fileToRead);
                content = pdfData.text;
              } else if (
                fileToRead.type ===
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
              ) {
                const result = await mammoth.extractRawText({
                  arrayBuffer: await fileToRead.arrayBuffer(),
                });
                content = result.value;
              } else if (fileToRead.type === 'text/plain') {
                content = await fileToRead.text();
              } else {
                throw new Error('Unsupported file type');
              }
              // Update state on success
              set({ fileContent: content, isReadingFile: false });
            } catch (err) {
              console.error('Error reading file:', err);
              // Update state on error
              set({
                error:
                  err instanceof Error
                    ? err.message
                    : 'Failed to read file content',
                fileContent: '',
                file: null, // Clear the file on read error
                isReadingFile: false,
              });
            }
          };
          // Don't await here, let the UI update with isReadingFile: true first
          readFileAsync(file);
        }
      },

      setFileContent: (content) => {
        set({
          fileContent: content,
          translatedContent: '',
          progress: 0,
          // Keep file association if user edits
          // file: get().file, // No need to reset file here
        });
      },

      // Other actions remain largely the same as the previous non-Immer version
      setSourceLang: (lang) => {
        if (lang !== get().targetLang) {
          set({ sourceLang: lang });
        }
      },

      setTargetLang: (lang) => {
        if (lang !== get().sourceLang && lang !== 'Auto Detect') {
          set({ targetLang: lang });
        }
      },

      swapLanguages: () => {
        const currentSource = get().sourceLang;
        const currentTarget = get().targetLang;

        if (currentSource === 'Auto Detect') return;

        set((state) => ({
          ...state,
          sourceLang: currentTarget,
          targetLang: currentSource,
          fileContent: state.translatedContent,
          translatedContent: state.fileContent,
          progress: 0,
        }));
      },

      handleTranslate: async () => {
        const {
          file, // Keep file for potential metadata if needed by server action
          fileContent,
          sourceLang,
          targetLang,
          openaiBaseUrl,
          openaiToken,
          modelName,
          temperature,
          maxSeq,
        } = get();

        if (!fileContent) {
          set({ error: 'No content to translate.' });
          return;
        }
        if (!get().validateAndSaveSettings()) {
          set({
            error: 'Invalid OpenAI settings. Please check the settings panel.',
          });
          return;
        }

        set({
          isTranslating: true,
          error: null,
          progress: 5,
          translatedContent: '',
        });

        let progressInterval: NodeJS.Timeout | null = null;
        try {
          progressInterval = setInterval(() => {
            set((state) => {
              // Prevent progress update if no longer translating
              if (!state.isTranslating) return state;
              if (state.progress < 90) {
                return { ...state, progress: state.progress + 5 };
              }
              // If progress reaches 90, clear interval but keep isTranslating true
              if (progressInterval) clearInterval(progressInterval);
              progressInterval = null; // Avoid trying to clear again
              return state;
            });
          }, 300);

          const formData = new FormData();
          if (file) {
            // Send original file if it exists
            formData.append('file', file as Blob);
          }
          formData.append('textContent', fileContent); // Always send current content
          formData.append(
            'sourceLang',
            sourceLang === 'Auto Detect' ? 'auto' : sourceLang,
          );
          formData.append('targetLang', targetLang);
          formData.append('openaiBaseUrl', openaiBaseUrl);
          formData.append('openaiToken', openaiToken);
          formData.append('modelName', modelName);
          formData.append('temperature', temperature.toString());
          formData.append('maxSeq', maxSeq.toString());

          const result = await translate(formData);

          // Clear interval just in case it's still running (e.g., API was super fast)
          if (progressInterval) clearInterval(progressInterval);

          if (result.error) {
            throw new Error(result.error);
          }

          set({
            translatedContent: result.translatedText ?? '',
            progress: 100,
            isTranslating: false, // Set translating false on SUCCESS
          });
        } catch (err) {
          if (progressInterval) clearInterval(progressInterval);
          console.error('Translation error:', err);
          set({
            error: err instanceof Error ? err.message : 'Translation failed',
            progress: 0,
            isTranslating: false, // Set translating false on ERROR
          });
        }
      },

      // Simple setters
      setOpenaiToken: (token) => set({ openaiToken: token }),
      setOpenaiBaseUrl: (url) => set({ openaiBaseUrl: url }),
      setModelName: (name) => set({ modelName: name }),
      setTemperature: (temp) => set({ temperature: temp }),
      setMaxSeq: (seq) => set({ maxSeq: seq }),

      validateAndSaveSettings: () => {
        const { openaiBaseUrl, openaiToken, modelName, temperature, maxSeq } =
          get();
        const errors: string[] = [];

        if (!validateUrl(openaiBaseUrl)) {
          errors.push('Invalid OpenAI Base URL format.');
        }
        if (!openaiToken || openaiToken.length < 10) {
          errors.push('Invalid or missing OpenAI token.');
        }
        if (!modelName) {
          errors.push('Model name is required.');
        }
        if (
          temperature === null ||
          isNaN(temperature) ||
          temperature < 0 ||
          temperature > 2
        ) {
          // Allow temp up to 2
          errors.push(
            'Temperature must be a number, typically between 0 and 2.',
          );
        }
        if (maxSeq === null || isNaN(maxSeq) || maxSeq < 1) {
          errors.push('Max tokens must be a positive number.');
        }

        if (errors.length > 0) {
          set({ error: errors.join(' ') });
          return false;
        } else {
          set({ error: null });
          return true;
        }
      },

      setError: (error) => set({ error: error }),

      clearAll: () => {
        const {
          openaiToken,
          openaiBaseUrl,
          modelName,
          temperature,
          maxSeq,
          sourceLang,
          targetLang,
        } = get();
        set({
          ...initialState,
          openaiToken,
          openaiBaseUrl,
          modelName,
          temperature,
          maxSeq,
          sourceLang,
          targetLang,
        });
      },
    }),
    {
      name: 'llama-translator-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        openaiToken: state.openaiToken,
        openaiBaseUrl: state.openaiBaseUrl,
        modelName: state.modelName,
        temperature: state.temperature,
        maxSeq: state.maxSeq,
        sourceLang: state.sourceLang,
        targetLang: state.targetLang,
      }),
      //? Skip hydration errors during SSR/initial client render  This tells Zustand to wait until rehydration is complete before applying persisted state
      //?im handling the mount condition in the page.tsx .
      //? skipHydration: true, // You might try uncommenting this if the client guard isn't enough
    },
  ),
);
