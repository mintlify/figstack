import Link from 'next/link';
import { CheckIcon } from '@heroicons/react/outline';
import useUser from '@components/hooks/useUser';
import { ENDPOINT } from 'api-helper/connection';

const isDevelopment = process.env.NODE_ENV === 'development';

export const tiers = [
  {
    id: 'free',
    name: 'Free',
    priceId: isDevelopment ? 'price_1JRQCpKIkS09GbFgm2al6rDa' : 'price_1JRQHaKIkS09GbFgGeMrYoBm',
    priceMonthly: 0,
    description: 'Free forever. No credit card required.',
    features: [
      '30 credits per month',
      'Explain code',
      'Language translator',
      'Docstring writer',
      'Time complexity',
    ],
  },
  {
    id: 'starter',
    name: 'Starter',
    priceId: isDevelopment ? 'price_1JSvVpKIkS09GbFgWIWOIUGc' : 'price_1JSvUGKIkS09GbFgSXvPta73',
    priceMonthly: 9,
    description: 'Unleash the power of code interpretation.',
    features: [
      '150 credits per month',
      'File uploading',
      'GitHub integration',
    ],
  },
  {
    id: 'unlimited',
    name: 'Unlimited',
    priceId: isDevelopment ? 'price_1JSvWLKIkS09GbFggJOtRqVi' : 'price_1JSvT1KIkS09GbFg1FcVFRu4',
    priceMonthly: 29,
    description: 'Build with custom tools and no boundaries.',
    features: [
      'Unlimited usage',
      'Custom workflow integrations',
      'Whiteglove customer support',
    ],
  },
];

export default function PricingComponent() {
  const { user } = useUser();

  return (
    <>
      <div className="pt-12 sm:pt-16 lg:pt-24">
        <div className="max-w-7xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto space-y-2 lg:max-w-none">
            <h2 className="text-lg leading-6 font-semibold text-gray-300 uppercase tracking-wider">Pricing</h2>
            <p className="text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl font-dystopian">
              Build
              {' '}
              <span className="text-secondary">lightning fast</span>
              {' '}
              with automation
            </p>
            <p className="text-xl text-gray-300">
              Make reading and writing code easy so you can build what matters.
              We only succeed when you do.
            </p>
          </div>
        </div>
      </div>
      <div className="relative z-0 mt-8 pb-12 bg-gray-50 sm:mt-12 sm:pb-16 lg:mt-16 lg:pb-24">
        <div className="relative">
          <div className="absolute inset-0 h-3/4 bg-hero" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto space-y-4 lg:max-w-5xl lg:grid lg:grid-cols-3 lg:gap-5 lg:space-y-0">
              {tiers.map((tier) => (
                <div key={tier.name} className="flex flex-col rounded-lg shadow-lg overflow-hidden">
                  <div className="px-6 py-8 bg-white sm:p-10 sm:pb-6">
                    <div>
                      <h3
                        className="inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-indigo-100 text-indigo-600"
                        id="tier-standard"
                      >
                        {tier.name}
                      </h3>
                    </div>
                    <div className="mt-4 flex items-baseline text-6xl font-bold">
                      $
                      {tier.priceMonthly}
                      <span className="ml-1 text-2xl font-medium text-gray-500">/mo</span>
                    </div>
                    <p className="mt-5 text-lg text-gray-500">{tier.description}</p>
                  </div>
                  <div className="flex-1 flex flex-col justify-between px-6 pt-6 pb-8 bg-gray-50 space-y-6 sm:p-10 sm:pt-6">
                    <ul className="space-y-4">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-start">
                          <div className="flex-shrink-0">
                            <CheckIcon className="h-6 w-6 text-green-500" aria-hidden="true" />
                          </div>
                          <p className="ml-3 text-base text-gray-700">{feature}</p>
                        </li>
                      ))}
                    </ul>
                    <div className="rounded-md shadow">
                      {
                        user != null
                          ? (
                            user.plan.name === tier.id
                              ? (
                                <div
                                  className="flex items-center justify-center w-full px-5 py-3 border border-transparent text-base font-medium rounded-md text-gray-800 border-2 border-gray-800"
                                >
                                  Current Plan
                                </div>
                              )
                              : (
                                <form
                                  action={`${ENDPOINT}/payment/create-checkout-session/${tier.priceId}/${user.email}`}
                                  method="POST"
                                >
                                  <button
                                    type="submit"
                                    className="flex items-center justify-center w-full px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-800 hover:bg-gray-900"
                                  >
                                    Select
                                  </button>
                                </form>
                              )
                          )
                          : (
                            <Link href="/api/auth/login" passHref>
                              <button
                                type="button"
                                className="flex items-center justify-center w-full px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-800 hover:bg-gray-900"
                              >
                                Get started
                              </button>
                            </Link>
                          )
                      }
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:mt-5">
          <div className="max-w-md mx-auto lg:max-w-5xl">
            <div className="rounded-lg bg-gray-100 px-6 py-8 sm:p-10 lg:flex lg:items-center">
              <div className="flex-1">
                <div>
                  <h3 className="inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-white text-gray-800">
                    A way to save
                  </h3>
                </div>
                <div className="mt-4 text-lg text-gray-600">
                  If you’re a student or nonprofit, let us know and we’ll take
                  {' '}
                  <span className="font-semibold text-gray-900">25%</span>
                  {' '}
                  off any plan. ♥️
                </div>
              </div>
              <div className="mt-6 rounded-md shadow lg:mt-0 lg:ml-10 lg:flex-shrink-0">
                <a
                  href="mailto:hi@figstack.com"
                  className="flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 bg-white hover:bg-gray-50"
                >
                  Request Discount
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
