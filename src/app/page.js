// app/page.js ou pages/index.js
import LandingHeader from '@/components/header';
import LandingMain from '@/components/landingpage';
import LandingFooter from '@/components/footer';

export default function LandingPage() {
  return (
    <>
      <LandingHeader />
      <LandingMain />
      <LandingFooter />
    </>
  );
}