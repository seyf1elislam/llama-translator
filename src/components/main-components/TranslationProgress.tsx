import { Progress } from '@/components/ui/progress';

export const TranslationProgress = ({ progress }: { progress: number }) => (
  <div className='space-y-1 duration-300 animate-in fade-in'>
    <div className='flex justify-between text-xs font-medium text-muted-foreground'>
      <span>Translating...</span>
      <span>{Math.min(progress, 100)}%</span>{' '}
    </div>
    <Progress
      value={progress}
      className='h-1.5 w-full overflow-hidden rounded-full bg-primary/20'
    />
  </div>
);
