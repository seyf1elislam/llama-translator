import { parsePdfFileSSA } from '@/server/parsepdf';
import mammoth from 'mammoth';
import { useDropzone } from 'react-dropzone';

import { useTranslationLogic } from './useTranslationLogic';
import type { TranslationState } from './useTranslationState';

export const useFileDrophandler = (state: TranslationState) => {
  const {
    setters: { setFile, setFileContent, setError,clearAll },
  } = state;
  
  return useDropzone({
    accept: {
      'text/plain': ['.txt'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        ['.docx'],
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    onDrop: async (acceptedFiles) => {
      clearAll();
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      setError(null);

      try {
        if (selectedFile.type === 'application/pdf') {
          parsePdfFileSSA(selectedFile).then((res) => {
            setFileContent(res.text);
          });
        } else if (
          selectedFile.type ===
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ) {
          const result = await mammoth.extractRawText({
            arrayBuffer: await selectedFile.arrayBuffer(),
          });
          setFileContent(result.value);
        } else {
          const content = await selectedFile.text();
          setFileContent(content);
        }
      } catch (err) {
        setError('Failed to read file content');
        setFileContent('');
        console.error('Error reading file content:', err);
      }
    },
  });
};
