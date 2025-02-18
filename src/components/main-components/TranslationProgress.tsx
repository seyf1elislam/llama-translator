import { Progress } from '@/components/ui/progress';

export const TranslationProgress = ({ progress }: { progress: number }) => (
  <div className='space-y-2 animate-in fade-in'>
    <div className='flex justify-between text-sm text-muted-foreground'>
      <span>Translating...</span>
      <span>{progress}%</span>
    </div>
    <Progress value={progress} className='h-2 rounded-full' />
  </div>
);
