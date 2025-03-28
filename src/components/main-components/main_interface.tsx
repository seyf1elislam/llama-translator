'use client';

import { useTranslationStore } from '@/store/translationStore';
import { FileText, Loader2, RotateCw, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TooltipProvider } from '@/components/ui/tooltip';

import { ContentPreview } from './ContentPreviewCard';
import { FileUploadArea } from './FileUploadArea';
import { LanguageSwitcher } from './LanguageSwitcher';
import { TranslationProgress } from './TranslationProgress';
import { SettingsSheet } from './settings_sheet';

export function TranslationInterface() {
  // Select individual state slices needed
  const error = useTranslationStore((state) => state.error);
  const isTranslating = useTranslationStore((state) => state.isTranslating);
  const isReadingFile = useTranslationStore((state) => state.isReadingFile);
  const progress = useTranslationStore((state) => state.progress);
  const fileContent = useTranslationStore((state) => state.fileContent);
  const translatedContent = useTranslationStore(
    (state) => state.translatedContent,
  );
  const targetLang = useTranslationStore((state) => state.targetLang);
  const file = useTranslationStore((state) => state.file); // Get file for download name

  // Select individual actions needed
  const clearAll = useTranslationStore((state) => state.clearAll);
  const handleTranslate = useTranslationStore((state) => state.handleTranslate);
  const setFileContent = useTranslationStore((state) => state.setFileContent); // For original content editing

  const isProcessing = isReadingFile || isTranslating;
  // Enable translate button if there's content and we're not processing and there is no error
  const canTranslate = !!fileContent && !isProcessing && !error;
  // Always show content areas
  const showContentAreas = true;

  return (
    <TooltipProvider>
      <Card className='mx-auto w-full max-w-4xl rounded-xl bg-card/90 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-card/80'>
        <CardHeader className='border-b border-border/70 pb-4'>
          <CardTitle className='flex items-center justify-between text-xl font-semibold text-foreground'>
            <div className='flex items-center gap-2'>
              <FileText className='h-5 w-5' />
              <span>Llama Translator</span>
            </div>

            <SettingsSheet />
          </CardTitle>
          <CardDescription>
            <div className='flex items-center gap-2 text-sm font-normal text-muted-foreground'>
              <span>
                Translate Text & documents using any OpenAI-compatible API .
              </span>
              {isTranslating && (
                <Loader2 className='h-4 w-4 animate-spin text-muted-foreground' />
              )}
            </div>
          </CardDescription>
        </CardHeader>

        <CardContent className='space-y-6 p-4 sm:p-6'>
          {/* {error && !error.includes('OpenAI') && ( */}
          {error && (
            <div
              role='alert'
              className='rounded-lg border border-destructive bg-destructive/10 p-3 text-sm text-destructive shadow-sm'
            >
              {error}
            </div>
          )}

          <FileUploadArea />
          <LanguageSwitcher />

          {isTranslating && <TranslationProgress progress={progress} />}

          {showContentAreas && (
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <ContentPreview
                title='Original'
                content={fileContent}
                isLoading={isReadingFile}
                onContentChange={setFileContent} // Pass the action directly
                fileName={file?.name}
              />
              <ContentPreview
                title={`Translation (${targetLang})`}
                content={translatedContent}
                isLoading={isTranslating && progress < 100}
                isTranslation
                fileName={file?.name}
              />
            </div>
          )}

          <div className='flex flex-col-reverse justify-end gap-2 border-t border-border/70 pt-4 sm:flex-row'>
            <Button
              variant='outline'
              onClick={clearAll}
              disabled={isProcessing}
              className='transition-colors duration-200 hover:bg-muted/60'
            >
              <Trash2 className='mr-2 h-4 w-4' />
              Clear All
            </Button>
            <Button
              onClick={handleTranslate}
              disabled={!canTranslate}
              className='transition-colors duration-200 hover:bg-primary/90'
            >
              {isTranslating ? (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              ) : (
                <RotateCw className='mr-2 h-4 w-4' />
              )}
              {isTranslating ? 'Translating...' : 'Translate'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
