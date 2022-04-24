import Head from 'next/head';
import type { ReactElement } from 'react';
import Sidebar from '@components/app/Sidebar';
import PricingComponent from '@components/pricing';

export default function Plans() {
  return (
    <div className="bg-hero">
      <PricingComponent />
    </div>
  );
}

Plans.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Head>
        <title>Plans</title>
      </Head>
      <Sidebar>
        {page}
      </Sidebar>
    </>
  );
};
