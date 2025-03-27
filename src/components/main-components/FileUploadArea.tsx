import { useTranslationStore } from '@/store/translationStore';
import { ArrowUpFromLine, Loader2 } from 'lucide-react';
// Changed Icon
import { useDropzone } from 'react-dropzone';

export const FileUploadArea = () => {
  // Get state and actions from Zustand store
  const setFile = useTranslationStore((state) => state.setFile);
  const isReadingFile = useTranslationStore((state) => state.isReadingFile);
  const isTranslating = useTranslationStore((state) => state.isTranslating);
  const file = useTranslationStore((state) => state.file);
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
        setFile(acceptedFiles[0]); // Use Zustand action
      }
    },
    disabled: isReadingFile || isTranslating, // Disable while reading or translating
  });

  const isProcessing = isReadingFile || isTranslating;

  return (
    <div
      {...getRootProps()}
      className={`transform cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-all duration-200 hover:scale-[1.02] hover:shadow-md ${
        isDragActive
          ? 'border-primary bg-primary/10' // Enhanced active state
          : 'border-border hover:border-primary/50'
      } ${isProcessing ? 'pointer-events-none opacity-60' : ''} ${
        error ? 'border-destructive bg-destructive/10' : '' // Indicate error state
      }`}
    >
      <input {...getInputProps()} />
      <div className='space-y-2'>
        {isReadingFile ? (
          <Loader2 className='mx-auto h-8 w-8 animate-spin text-primary' />
        ) : (
          <ArrowUpFromLine className='mx-auto h-8 w-8 text-muted-foreground' />
        )}
        <p className='font-medium text-foreground'>
          {isDragActive
            ? 'Drop your file here'
            : 'Drag & drop file, or click to select'}
        </p>
        <p className='text-xs text-muted-foreground'>
          Supports .txt, .docx, .pdf (Max 10MB)
        </p>
        {file && !isReadingFile && (
          <p className='pt-2 text-sm text-foreground/80'>
            Selected: <span className='font-medium'>{file.name}</span> (
            {(file.size / 1024 / 1024).toFixed(2)}MB)
          </p>
        )}
        {isReadingFile && (
          <p className='animate-pulse pt-2 text-sm text-primary'>
            Reading file...
          </p>
        )}
      </div>
    </div>
  );
};
