import { ReactElement } from 'react';
import Footer from '@components/app/Footer';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

type FunctionCardProps = {
  icon: ReactElement;
  header: string;
  children: ReactElement;
  badge?: ReactElement
}

export default function FunctionCard({
  icon, header, children, badge,
}: FunctionCardProps) {
  return (
    <div className="relative min-h-screen bg-gray-100">
      <main className="py-4">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          {badge}
          {/* Welcome panel */}
          <div className="rounded-lg bg-white shadow p-6">
            <div
              className="group text-base font-medium text-gray-800"
            >
              <div className="flex items-center">
                <span
                  className={classNames(
                    'rounded-md inline-flex mr-2',
                  )}
                >
                  {icon}
                </span>
                <span className="font-medium mr-2">{header}</span>
              </div>
            </div>
            <div className="h-px bg-gray-100 w-full my-3" />
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
