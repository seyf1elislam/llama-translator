import { Card, CardContent, CardHeader } from '@/components/ui/card';

import { Textarea } from '../ui/textarea';

export const ContentPreview = ({
  title,
  content,
  isTranslation = false,
  isRtl = false,
  onContentChange, // Callback to handle content changes
}: {
  title: string;
  content: string;
  isTranslation?: boolean;
  isRtl?: boolean;
  onContentChange?: (content: string) => void;
}) => (
  <Card
    className={`max-h-96 rounded-xl shadow-md ${isTranslation ? 'border border-primary/20' : ''}`}
  >
    <CardHeader className='border-b border-muted/20 pb-3'>
      <div className='text-sm font-medium text-foreground'>{title}</div>
    </CardHeader>
    <CardContent className='max-h-[calc(100%-4rem)] flex-1 overflow-y-auto p-4 text-sm'>
      <Textarea
        className={`h-full w-full resize-none rounded-md border border-input bg-transparent p-2 font-mono text-sm leading-normal outline-none transition-all duration-200 [field-sizing:content] ${isRtl ? 'text-right' : ''}`}
        value={content || 'Content will appear here'}
        readOnly={isTranslation}
        onChange={(e) => onContentChange?.(e.target.value)}
        spellCheck={false}
      />
    </CardContent>
  </Card>
);
