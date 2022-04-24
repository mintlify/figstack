import Image from 'next/image';
import logo1 from '@assets/landing/logos/sendbird.svg';
import logo2 from '@assets/landing/logos/harvard.svg';
import logo3 from '@assets/landing/logos/kaokao.svg';
import logo4 from '@assets/landing/logos/tribe.svg';
import logo5 from '@assets/landing/logos/meeshkan.svg';
import logo6 from '@assets/landing/logos/integry.svg';

export default function LogoCloud() {
  return (
    <div className="relative z-10 bg-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
          <div className="col-span-1 flex justify-center lg:col-span-1">
            <Image
              src={logo1}
              height={60}
              width={159}
            />
          </div>
          <div className="col-span-1 flex justify-center lg:col-span-1">
            <Image
              src={logo2}
              height={60}
              width={159}
            />
          </div>
          <div className="col-span-1 flex justify-center lg:col-span-1">
            <Image
              src={logo3}
              height={60}
              width={159}
            />
          </div>
          <div className="col-span-1 flex justify-center lg:col-span-1">
            <Image
              src={logo4}
              height={60}
              width={159}
            />
          </div>
          <div className="col-span-1 flex justify-center lg:col-span-1">
            <Image
              src={logo5}
              height={60}
              width={159}
            />
          </div>
          <div className="col-span-1 flex justify-center lg:col-span-1">
            <Image
              src={logo6}
              height={60}
              width={159}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
