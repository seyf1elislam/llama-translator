import { TranslationInterface } from '@/components/main-components/main_interface';

import { siteConfig } from '@/config/siteConfig';

export const metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    // url: siteConfig.url,
  },
};

export default function Home() {
  return (
    <div>
      <div className='flex min-h-screen w-full flex-col items-center justify-center bg-primary/30 px-2 py-4 font-mono'>
        <TranslationInterface />
      </div>
    </div>
  );
}
