// hooks/useFileDropzone.ts
import { parsePdfFileSSA } from '@/server/parsepdf';
import { useDropzone } from 'react-dropzone';

import type { TranslationState } from './useTranslationState';

export const useFileDropzone = (state: TranslationState) => {
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
    onDrop: (acceptedFiles) => {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      setError(null);
      const fileType = selectedFile.type;

      if (fileType === 'application/pdf') {
        //   getpdfText(selectedFile);
        // const text = await parsePdf(selectedFile);
        //   setFileContent(text);
        parsePdfFileSSA(selectedFile)
          .then((res) => {
            setFileContent(res.text);
          })
          .catch((err) => {
            console.error('Error parsing PDF:', err);
            setFileContent('');
            setError('Failed to parse PDF.');
          });
      } else {
        selectedFile
          .text()
          .then((content) => {
            setFileContent(content);
          })
          .catch((err) => {
            console.error('Error reading file content:', err);
            setFileContent('');
            setError('Failed to read file content.');
          });
      }
    },
  });
};
