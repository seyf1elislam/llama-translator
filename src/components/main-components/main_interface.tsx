'use client';

import { useTranslationStore } from '@/store/translationStore';
import { FileText, Loader2, RotateCw, Trash2 } from 'lucide-react';

// Updated Icons

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { ContentPreview } from './ContentPreviewCard';
import { FileUploadArea } from './FileUploadArea';
import { LanguageSwitcher } from './LanguageSwitcher';
import { TranslationProgress } from './TranslationProgress';
import { SettingsSheet } from './settings_sheet';

export function TranslationInterface() {
  // Select state and actions from Zustand store
  const {
    error,
    isTranslating,
    isReadingFile,
    progress,
    fileContent,
    translatedContent,
    targetLang,
    file, // Get file for download name
    clearAll,
    handleTranslate,
    setFileContent, // Get setter for original content editing
  } = useTranslationStore((state) => ({
    error: state.error,
    isTranslating: state.isTranslating,
    isReadingFile: state.isReadingFile,
    progress: state.progress,
    fileContent: state.fileContent,
    translatedContent: state.translatedContent,
    targetLang: state.targetLang,
    file: state.file,
    clearAll: state.clearAll,
    handleTranslate: state.handleTranslate,
    setFileContent: state.setFileContent,
  }));

  const isProcessing = isReadingFile || isTranslating;
  const canTranslate = fileContent && !isProcessing;
  const showContentAreas = fileContent || translatedContent || isProcessing;

  return (
    <Card className='mx-auto w-full max-w-4xl rounded-xl bg-card/90 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-card/80'>
      <CardHeader className='border-b border-border/70 pb-4'>
        <CardTitle className='flex items-center justify-between text-xl font-semibold text-foreground'>
          <div className='flex items-center gap-2'>
            <FileText className='h-5 w-5' /> {/* Slightly smaller icon */}
            <span>Llama Translator</span>
          </div>
          <SettingsSheet /> {/* Moved settings button to header */}
        </CardTitle>
      </CardHeader>

      <CardContent className='space-y-6 p-4 sm:p-6'>
        {/* Display general errors */}
        {error &&
          !error.includes('OpenAI') && ( // Don't show settings errors here
            <div
              role='alert'
              className='rounded-lg border border-destructive bg-destructive/10 p-3 text-sm text-destructive shadow-sm'
            >
              {error}
            </div>
          )}

        {/* File Upload */}
        <FileUploadArea />

        {/* Language Selection */}
        <LanguageSwitcher />

        {/* Progress Bar */}
        {isTranslating && <TranslationProgress progress={progress} />}

        {/* Content Previews - Conditionally render based on state */}
        {showContentAreas && (
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <ContentPreview
              title='Original'
              content={fileContent}
              isLoading={isReadingFile} // Pass loading state
              onContentChange={setFileContent} // Connect editing
              fileName={file?.name}
            />
            <ContentPreview
              title={`Translation (${targetLang})`}
              content={translatedContent}
              isLoading={isTranslating && progress < 100} // Show loading until translation is done
              isTranslation
              fileName={file?.name}
              // Add isRtl logic if needed based on targetLang
              // isRtl={targetLang === 'Arabic' || targetLang === 'Hebrew'}
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className='flex flex-col-reverse justify-end gap-2 border-t border-border/70 pt-4 sm:flex-row'>
          <Button
            variant='outline'
            onClick={clearAll}
            disabled={isProcessing} // Disable clear while processing
            className='transition-colors duration-200 hover:bg-muted/60'
          >
            <Trash2 className='mr-2 h-4 w-4' />
            Clear All
          </Button>
          <Button
            onClick={handleTranslate}
            disabled={!canTranslate} // Use derived state for disabling
            className='transition-colors duration-200 hover:bg-primary/90'
          >
            {isTranslating ? (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' /> // Use Loader2 for consistency
            ) : (
              <RotateCw className='mr-2 h-4 w-4' />
            )}
            {isTranslating ? 'Translating...' : 'Translate'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
