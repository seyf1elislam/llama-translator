import { useTranslationStore } from '@/store/translationStore';
import { ArrowUpFromLine, FileText, Loader2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

export const FileUploadArea = () => {
  // Get state and actions from Zustand store
  const setFile = useTranslationStore((state) => state.setFile);
  const isReadingFile = useTranslationStore((state) => state.isReadingFile);
  const isTranslating = useTranslationStore((state) => state.isTranslating);
  const file = useTranslationStore((state) => state.file);
  const fileContent = useTranslationStore((state) => state.fileContent);
  const error = useTranslationStore((state) => state.error);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/plain': ['.txt'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        ['.docx'],
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // Increased size limit slightly
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
      }
    },
    disabled: isReadingFile || isTranslating, // Disable while reading or translating
  });

  const isProcessing = isReadingFile || isTranslating;
  const hasManualContent = !!fileContent && !file && !isReadingFile;

  let primaryText = 'Drag & drop file, or click to select';
  if (isDragActive) {
    primaryText = 'Drop your file here';
  } else if (hasManualContent) {
    primaryText = 'Using manually entered text';
  } else if (file && !isReadingFile) {
    primaryText = 'File selected:';
  }

  let secondaryText = 'Supports .txt, .docx, .pdf (Max 10MB)';
  if (file && !isReadingFile) {
    secondaryText = `${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`;
  } else if (isReadingFile) {
    secondaryText = 'Reading file...';
  } else if (hasManualContent) {
    secondaryText = 'You can drop a file to replace it';
  }

  return (
    <div
      {...getRootProps()}
      className={`transform cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-all duration-200 hover:scale-[1.02] hover:shadow-md ${
        isDragActive
          ? 'border-primary bg-primary/10'
          : 'border-border hover:border-primary/50'
      } ${isProcessing ? 'pointer-events-none opacity-60' : ''} ${
        error && !error.includes('OpenAI')
          ? 'border-destructive bg-destructive/10'
          : '' // Only border red for non-settings errors
      }`}
    >
      <input {...getInputProps()} />
      <div className='space-y-1'>
        {isReadingFile ? (
          <Loader2 className='mx-auto mb-1 h-7 w-7 animate-spin text-primary' />
        ) : file ? (
          <FileText className='mx-auto mb-1 h-7 w-7 text-muted-foreground' />
        ) : (
          <ArrowUpFromLine className='mx-auto mb-1 h-7 w-7 text-muted-foreground' />
        )}
        <p
          className={`font-medium text-foreground ${file && !isReadingFile ? 'text-sm' : ''}`}
        >
          {primaryText}
        </p>
        <p
          className={`text-xs ${isReadingFile ? 'animate-pulse text-primary' : 'text-muted-foreground'}`}
        >
          {secondaryText}
        </p>
      </div>
    </div>
  );
};
