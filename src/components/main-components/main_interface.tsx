'use client';

import { useTranslationLogic } from '@/hooks/useTranslationLogic';
import { useTranslationState } from '@/hooks/useTranslationState';
import { FileText, RotateCw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { ContentPreview } from './ContentPreviewCard';
import { FileUploadArea } from './FileUploadArea';
import { LanguageSwitcher } from './LanguageSwitcher';
import { TranslationProgress } from './TranslationProgress';
import { SettingsSheet } from './settings_sheet';

export function TranslationInterface() {
  const state = useTranslationState();

  const { handleTranslate, clearAll } = useTranslationLogic(state);
  // Add error boundary
  if (!state) {
    return <div>Loading...</div>;
  }

  const {
    error,
    isTranslating,
    progress,
    fileContent,
    translatedContent,
    targetLang,
  } = state;

  return (
    <Card className='mx-auto w-full max-w-4xl  bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:w-4/5 lg:w-3/5'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <FileText className='h-6 w-6' />
          Document Translation
        </CardTitle>
      </CardHeader>

      <CardContent className='space-y-6'>
        {error && (
          <div className='rounded-lg border border-destructive bg-destructive/20 p-4 text-sm text-destructive-foreground'>
            {error}
          </div>
        )}

        <SettingsSheet state={state} />
        <FileUploadArea state={state} />
        <LanguageSwitcher state={state} />

        {isTranslating && <TranslationProgress progress={progress} />}

        {fileContent && (
          <div className='grid gap-4 md:grid-cols-2'>
            <ContentPreview
              title='Original'
              content={fileContent}
              onContentChange={(content) =>
                state.setters.setFileContent(content)
              }
            />
            <ContentPreview
              title={`Translation (${targetLang})`}
              content={translatedContent}
              isTranslation
            />
          </div>
        )}

        <div className='flex justify-end gap-2'>
          <Button variant='outline' onClick={clearAll}>
            Clear
          </Button>
          <Button
            onClick={handleTranslate}
            disabled={!state.file || isTranslating}
          >
            {isTranslating ? (
              <RotateCw className='mr-2 h-4 w-4 animate-spin' />
            ) : (
              <RotateCw className='mr-2 h-4 w-4' />
            )}
            Translate Document
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
