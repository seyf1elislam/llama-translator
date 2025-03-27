import { Progress } from '@/components/ui/progress';

export const TranslationProgress = ({ progress }: { progress: number }) => (
  <div className='space-y-1 duration-300 animate-in fade-in'>
    <div className='flex justify-between text-xs font-medium text-muted-foreground'>
      <span>Translating...</span>
      <span>{Math.min(progress, 100)}%</span>{' '}
      {/* Ensure progress doesn't exceed 100 */}
    </div>
    <Progress
      value={progress}
      className='h-1.5 w-full overflow-hidden rounded-full bg-primary/20' // Use primary/20 for background
      // indicatorClassName='bg-primary transition-all duration-300 ease-linear' // Custom indicator class if needed by Progress component
    />
  </div>
);

// Add this to your Progress component if it doesn't support indicatorClassName
// File: src/components/ui/progress.tsx (Add indicatorClassName prop)
/*
...
>(({ className, value, indicatorClassName, ...props }, ref) => ( // Add indicatorClassName
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn("h-full w-full flex-1 bg-primary transition-all", indicatorClassName)} // Use indicatorClassName
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
...
*/
