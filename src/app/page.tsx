import { TooltipProvider } from '@/components/ui/tooltip';

import ConditionPlaceholder from './condition-placeholder';

export default function Home() {
  return (
    <div className='flex min-h-dvh w-full flex-col items-center justify-center bg-gradient-to-br from-background to-secondary/30 px-2 py-4 md:py-8'>
      {/* Conditionally render the component only on the client */}
      <TooltipProvider>
        <ConditionPlaceholder />
      </TooltipProvider>
    </div>
  );
}
