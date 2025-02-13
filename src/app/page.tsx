import Footer from '@/components/footer-component/footer';
import SiteHeader from '@/components/header-component/site-header';
// import MainUI from '@/components/main-components/main-ui';
import { TranslationInterface } from '@/components/main-components/main_interface';

export default function Home() {
  return (
    <main>
      {/* <SiteHeader /> */}
      <div className='flex min-h-screen w-full items-center justify-center bg-primary/30 px-2 py-4'>
        <TranslationInterface></TranslationInterface>
      </div>
      {/* <Footer /> */}
    </main>
  );
}
