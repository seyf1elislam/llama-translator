// components/ContentPreview.tsx
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const ContentPreview = ({
  title,
  content,
  isTranslation = false,
  onContentChange, // Add this prop
}: {
  title: string;
  content: string;
  isTranslation?: boolean;
  onContentChange?: (content: string) => void; // Add type definition
}) => (
  <Card className={`max-h-96 ${isTranslation ? 'border border-primary/20' : ''}`}>
    <CardHeader className="pb-3">
      <div className="text-sm text-muted-foreground">{title}</div>
    </CardHeader>
    <CardContent className="max-h-[calc(100%-4rem)] flex-1 overflow-y-auto text-sm">
      <textarea
        className="min-h-fit w-full grow resize-none whitespace-pre-wrap rounded-none border-0 bg-transparent p-4 font-mono text-sm leading-normal outline-none focus:border-0 focus:ring-0"
        value={content || 'Content will appear here'}
        readOnly={isTranslation}
        onChange={(e) => onContentChange?.(e.target.value)} // Use the prop instead of state
        spellCheck={false}
      />
    </CardContent>
  </Card>
);