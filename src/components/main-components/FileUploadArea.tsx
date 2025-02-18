import { useFileDrophandler } from '@/hooks/useFileHandler';
import type { TranslationState } from '@/hooks/useTranslationState';
import { ArrowUpDown } from 'lucide-react';

export const FileUploadArea = ({ state }: { state: TranslationState }) => {
  const { getRootProps, getInputProps, isDragActive } =
    useFileDrophandler(state);

  return (
    <div
      {...getRootProps()}
      className={`transform rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200 hover:scale-105 ${
        isDragActive
          ? 'border-primary bg-accent/20'
          : 'border-border hover:shadow-lg'
      } ${state.isTranslating ? 'pointer-events-none opacity-50' : ''}`}
    >
      <input {...getInputProps()} />
      <div className='space-y-3'>
        <ArrowUpDown className='mx-auto h-8 w-8 text-muted-foreground' />
        <p className='text-sm text-muted-foreground'>
          {isDragActive
            ? 'Drop your file here'
            : 'Drag & drop file, or click to select'}
        </p>
        {state.file && (
          <p className='text-sm text-foreground/80'>
            Selected: {state.file.name} (
            {(state.file.size / 1024 / 1024).toFixed(2)}MB)
          </p>
        )}
      </div>
    </div>
  );
};
