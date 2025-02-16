'use client';

import { ArrowUpDown, FileText, RotateCw } from 'lucide-react';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

import { LanguageSelector } from './lang_selector';

export function TranslationInterface() {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [sourceLang, setSourceLang] = useState('Auto Detect');
  const [targetLang, setTargetLang] = useState('English');
  const [translatedContent, setTranslatedContent] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/plain': ['.txt'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        ['.docx'],
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
    onDrop: (acceptedFiles) => {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      setError(null);
      const fileType = selectedFile.type;

      if (fileType === 'application/pdf') {
        getpdfText(selectedFile);
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

  const getpdfText = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/pdf-parse', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      setFileContent(data.text);
    } catch (error) {
      console.error('Error parsing PDF:', error);
      setError(
        error instanceof Error ? error.message : 'Failed to parse PDF document',
      );
      setProgress(0);
    }
  };

  const handleTranslate = async () => {
    if (!file) return;

    setIsTranslating(true);
    setError(null);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append(
        'sourceLang',
        sourceLang === 'Auto Detect' ? 'auto' : sourceLang,
      );
      formData.append('targetLang', targetLang);

      const response = await fetch('/api/translate', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      setTranslatedContent(data.translatedText);
      setProgress(100);
    } catch (err) {
      console.error('Translation error:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to translate document',
      );
      setProgress(0);
    } finally {
      setIsTranslating(false);
    }
  };
  const clear = () => {
    setFile(null);
    setTranslatedContent('');
    setFileContent('');
    setProgress(0);
    setError(null);
    console.warn('File has been cleared');
  };

  return (
    <Card className='mx-auto max-w-4xl bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <FileText className='h-6 w-6' />
          Document Translation
        </CardTitle>
      </CardHeader>

      <CardContent className='space-y-6'>
        {/* Error Message */}
        {error && (
          <div className='rounded-lg border border-destructive bg-destructive/20 p-4 text-sm text-destructive-foreground'>
            {error}
          </div>
        )}

        {/* File Upload Section */}
        <div
          {...getRootProps()}
          className={`rounded-xl border-2 border-dashed p-8 text-center transition-colors ${isDragActive ? 'border-primary bg-accent/20' : 'border-border'} ${isTranslating ? 'pointer-events-none opacity-50' : ''}`}
        >
          <input {...getInputProps()} />
          <div className='space-y-3'>
            <ArrowUpDown className='mx-auto h-8 w-8 text-muted-foreground' />
            <p className='text-sm text-muted-foreground'>
              {isDragActive
                ? 'Drop your file here'
                : 'Drag & drop file, or click to select'}
            </p>
            {file && (
              <p className='text-sm text-foreground/80'>
                Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)}MB)
              </p>
            )}
          </div>
        </div>

        {/* Language Selection */}
        <div className='flex items-center justify-center gap-4'>
          <LanguageSelector value={sourceLang} onSelect={setSourceLang} />

          <Button
            variant='ghost'
            size='icon'
            className='rounded-full transition-transform hover:rotate-180 hover:bg-accent'
            onClick={() => {
              const currentSource = sourceLang;
              let newSource: string;
              let newTarget: string;

              //? Case 1: When both languages are the same.
              if (currentSource === targetLang) {
                //? Set source to 'Auto Detect' and leave target unchanged.
                newSource = 'Auto Detect';
                newTarget = targetLang;
              }
              //? Case 2: When source is 'Auto Detect'.
              else if (currentSource === 'Auto Detect') {
                //? Set new source to targetLang.
                newSource = targetLang;
                /*
                  Since target should never be 'Auto Detect' and to prevent both
                  languages from being equal, choose a fallback for newTarget.
                  For example, if targetLang is already 'English', we choose 'Spanish'
                  as a fallback. You can adjust this fallback based on your app's needs.
                */
                newTarget = targetLang === 'English' ? 'Arabic' : 'English';
              }
              //? Case 3: Standard swap when languages are different and source is not 'Auto Detect'.
              else {
                newSource = targetLang;
                newTarget = currentSource;
              }

              //? Apply the new language settings.
              setSourceLang(newSource);
              setTargetLang(newTarget);
            }}
          >
            <ArrowUpDown className='h-4 w-4' />
          </Button>

          <LanguageSelector
            value={targetLang}
            onSelect={setTargetLang}
            isTarget
          />
        </div>

        {/* Progress Indicator */}
        {isTranslating && (
          <div className='space-y-2 animate-in fade-in'>
            <div className='flex justify-between text-sm text-muted-foreground'>
              <span>Translating...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className='h-2' />
          </div>
        )}

        {/* Translation Preview */}
        {fileContent && (
          <div className='grid gap-4 md:grid-cols-2'>
            <Card className='max-h-96'>
              <CardHeader className='pb-3'>
                <div className='text-sm text-muted-foreground'>Original</div>
              </CardHeader>
              <CardContent className='flex min-h-[calc(100%-4rem)] overflow-y-auto p-3 text-sm'>
                {/* <pre className='whitespace-pre-wrap font-sans'>
                  {fileContent && fileContent.length > 0
                    ? fileContent
                    : 'File content would appear here'}
                </pre> */}
                <textarea
                  className={`min-h-fit w-full grow resize-none whitespace-pre-wrap rounded-none border-0 bg-transparent p-4 font-mono text-sm leading-normal outline-none focus:border-0 focus:ring-0`}
                  value={fileContent || 'File content would appear here'}
                  onChange={(e) => {
                    setFileContent(e.target.value);
                  }}
                  spellCheck={false}
                />
              </CardContent>
            </Card>

            <Card className='max-h-96 border border-primary/20'>
              <CardHeader className='pb-3'>
                <div className='text-sm text-muted-foreground'>
                  Translation ({targetLang})
                </div>
              </CardHeader>
              <CardContent className='max-h-[calc(100%-4rem)] flex-1 overflow-y-auto text-sm'>
                <pre className='whitespace-pre-wrap font-sans'>
                  {translatedContent && translatedContent.length > 0
                    ? translatedContent
                    : 'Click Translate to see translation'}
                </pre>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Action Buttons */}
        <div className='flex justify-end gap-2'>
          <Button variant='outline' onClick={clear}>
            Clear
          </Button>
          <Button onClick={handleTranslate} disabled={!file || isTranslating}>
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
