import { Check, Clipboard, Download } from 'lucide-react';
import { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ContentPreviewProps {
  title: string;
  content: string;
  isLoading?: boolean;
  isTranslation?: boolean;
  isRtl?: boolean;
  onContentChange?: (content: string) => void; // Callback for original content changes
  fileName?: string; // For download
}

export const ContentPreview = ({
  title,
  content,
  isLoading = false,
  isTranslation = false,
  isRtl = false,
  onContentChange,
  fileName = 'translation.txt', // Default download filename
}: ContentPreviewProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1500); // Reset icon after 1.5s
  };

  const handleDownload = () => {
    if (!content) return;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    // Construct filename based on original, if available
    const baseName = fileName?.split('.').slice(0, -1).join('.') || 'content';
    const downloadFilename = isTranslation
      ? `${baseName}_translated.txt`
      : `${baseName}.txt`;
    link.download = downloadFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Determine if the textarea should be read-only
  // Original: ReadOnly only when actively reading file
  // Translation: Always ReadOnly
  const isReadOnly = isTranslation || (isLoading && !isTranslation);

  // Determine the placeholder text
  const placeholderText = isTranslation
    ? 'Translation will appear here...'
    : 'Upload a file or type/paste content here...';

  return (
    <Card
      className={`flex h-96 flex-col rounded-xl shadow-md ${
        isTranslation ? 'border border-primary/20' : ''
      } ${isLoading && !isTranslation ? 'opacity-70' : ''}`} // Only dim Original when loading
    >
      <CardHeader className='flex-row items-center justify-between border-b border-muted/20 pb-3'>
        <div className='text-sm font-medium text-foreground'>{title}</div>
        {/* Action Buttons */}
        <div className='flex items-center gap-1'>
          {content && (!isLoading || isTranslation) && (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <CopyToClipboard text={content} onCopy={handleCopy}>
                    <Button variant='ghost' size='icon' className='h-7 w-7'>
                      {copied ? (
                        <Check className='h-4 w-4 text-green-500' />
                      ) : (
                        <Clipboard className='h-4 w-4' />
                      )}
                    </Button>
                  </CopyToClipboard>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{copied ? 'Copied!' : 'Copy to Clipboard'}</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-7 w-7'
                    onClick={handleDownload}
                  >
                    <Download className='h-4 w-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Download {isTranslation ? 'Translation' : 'Original'} (.txt)
                  </p>
                </TooltipContent>
              </Tooltip>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent className='flex-grow overflow-hidden p-0 text-sm'>
        {isLoading && !isTranslation ? (
          <div className='flex h-full items-center justify-center px-4'>
            <p className='animate-pulse text-muted-foreground'>
              Reading file content...
            </p>
          </div>
        ) : (
          <Textarea
            className={`h-full w-full resize-none rounded-md border-none bg-transparent p-4 font-mono text-sm leading-normal shadow-none outline-none [field-sizing:content] focus-visible:ring-0 ${
              isRtl ? 'text-right' : ''
            }`}
            value={content || ''}
            readOnly={isReadOnly}
            onChange={(e) => {
              if (onContentChange && !isReadOnly) {
                onContentChange(e.target.value);
              }
            }}
            placeholder={placeholderText}
            spellCheck={false}
          />
        )}
      </CardContent>
    </Card>
  );
};
