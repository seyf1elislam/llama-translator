import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const InterfaceSkeleton = () => (
  <Card className='mx-auto w-full max-w-4xl rounded-xl bg-card/90 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-card/80'>
    <CardHeader className='border-b border-border/70 pb-4'>
      <Skeleton className='h-6 w-48' />
    </CardHeader>
    <CardContent className='space-y-6 p-4 sm:p-6'>
      <Skeleton className='h-24 w-full' /> {/* Placeholder for upload */}
      <div className='flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-4'>
        <Skeleton className='h-9 w-full sm:w-[180px]' />
        <Skeleton className='h-9 w-9 rounded-full' />
        <Skeleton className='h-9 w-full sm:w-[180px]' />
      </div>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <Skeleton className='h-96 w-full' />
        <Skeleton className='h-96 w-full' />
      </div>
      <div className='flex flex-col-reverse justify-end gap-2 border-t border-border/70 pt-4 sm:flex-row'>
        <Skeleton className='h-9 w-28' />
        <Skeleton className='h-9 w-32' />
      </div>
    </CardContent>
  </Card>
);

export default InterfaceSkeleton;
