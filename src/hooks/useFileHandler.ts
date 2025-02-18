import { parsePdfFileSSA } from '@/server/parsepdf';
import { useDropzone } from 'react-dropzone';

import type { TranslationState } from './useTranslationState';

export const useFileDrophandler = (state: TranslationState) => {
  const {
    setters: { setFile, setFileContent, setError },
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
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      setError(null);

      try {
        if (selectedFile.type === 'application/pdf') {
          parsePdfFileSSA(selectedFile).then((res) => {
            setFileContent(res.text);
          });
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
