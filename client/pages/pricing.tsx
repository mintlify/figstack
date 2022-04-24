import Head from 'next/head';
import Footer from '@components/landing/Footer';
import Header from '@components/landing/Header';
import PricingComponent from '@components/pricing';

export default function Pricing() {
  return (
    <div className="relative bg-hero">
      <Head>
        <title>Figstack Pricing</title>
      </Head>
      <Header />
      <PricingComponent />
      <Footer />
    </div>
  );
}
