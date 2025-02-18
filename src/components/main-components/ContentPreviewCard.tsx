import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const ContentPreview = ({
  title,
  content,
  isTranslation = false,
  onContentChange, // Callback to handle content changes
}: {
  title: string;
  content: string;
  isTranslation?: boolean;
  onContentChange?: (content: string) => void;
}) => (
  <Card
    className={`max-h-96 rounded-xl shadow-md ${isTranslation ? 'border border-primary/20' : ''}`}
  >
    <CardHeader className='border-b border-muted/20 pb-3'>
      <div className='text-sm font-medium text-foreground'>{title}</div>
    </CardHeader>
    <CardContent className='max-h-[calc(100%-4rem)] flex-1 overflow-y-auto p-4 text-sm'>
      <textarea
        className='h-full w-full resize-none whitespace-pre-wrap rounded-md border border-input bg-transparent p-2 font-mono text-sm leading-normal outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20'
        value={content || 'Content will appear here'}
        readOnly={isTranslation}
        onChange={(e) => onContentChange?.(e.target.value)}
        spellCheck={false}
      />
    </CardContent>
  </Card>
);
