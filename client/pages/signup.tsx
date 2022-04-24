import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import { figFunctions } from '@components/app/constants';
import logo1 from '@assets/landing/logos/harvard.svg';
import logo2 from '@assets/landing/logos/sendbird.svg';
import logo3 from '@assets/landing/logos/tribe.svg';
import logo from '@assets/logo.svg';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

export default function SignUp() {
  return (
    <div className="min-h-screen bg-white flex">
      <Head>
        <title>Get started with Figstack</title>
      </Head>
      <div className="hidden lg:flex relative w-0 flex-1 bg-gray-100 items-center">
        <div className="py-4 max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-2xl lg:px-16">
          <div className="relative">
            <h3 className="text-2xl font-extrabold text-gray-800 tracking-tight sm:text-3xl">
              Get access to
            </h3>

            <dl className="mt-8 space-y-10">
              {figFunctions.map((figFunction) => (
                <div key={figFunction.name} className="relative">
                  <dt>
                    <span
                      className={classNames(
                        figFunction.iconBackground,
                        figFunction.iconForeground,
                        'rounded-md inline-flex p-1 absolute flex items-center justify-center h-8 w-8 text-white',
                      )}
                    >
                      <figFunction.icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <p className="ml-12 text-lg leading-6 font-medium text-gray-900">{figFunction.name}</p>
                  </dt>
                  <dd className="mt-1 ml-12 text-base text-gray-500">{figFunction.description}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="mt-12">
            <h1 className="text-gray-500 mb-6 font-medium">
              Used by the best from
            </h1>
            <div className="grid grid-cols-2 gap-8 lg:grid-cols-3">
              <div className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1">
                <Image
                  src={logo1}
                  height={60}
                  width={159}
                />
              </div>
              <div className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1">
                <Image
                  src={logo2}
                  height={60}
                  width={159}
                />
              </div>
              <div className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1">
                <Image
                  src={logo3}
                  height={60}
                  width={159}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <Link href="/" passHref>
              <Image
                className="cursor-pointer"
                src={logo}
                alt="Figstack"
                width={48}
                height={48}
              />
            </Link>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Sign up for free</h2>
            <p className="mt-2 text-sm text-gray-600">
              Start with
              {' '}
              <span className="font-medium text-primary hover:text-primary">
                20 free credits
              </span>
              {' '}
              per month. No credit card required.
            </p>
          </div>

          <div className="mt-8">
            <div>
              <div>
                <div className="mt-1 grid grid-cols-3 gap-3">
                  <div>
                    <button
                      type="button"
                      className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">Sign in with Facebook</span>
                      <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>

                  <div>
                    <button
                      type="button"
                      className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">Sign in with Twitter</span>
                      <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </button>
                  </div>

                  <div>
                    <button
                      type="button"
                      className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">Sign in with GitHub</span>
                      <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <form action="#" method="POST" className="space-y-6">
                <div>
                  <p className="block text-sm font-medium text-gray-700">
                    Email address
                  </p>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="block text-sm font-medium text-gray-700">
                    Password
                  </p>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <p className="ml-2 block text-sm text-gray-900">
                      Remember me
                    </p>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-active focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    Create account
                  </button>
                </div>
                <Link href="/signin" passHref>
                  <button type="button" className="w-full flex justify-center text-sm text-primary hover:text-primary-active">
                    Already have an account?
                  </button>
                </Link>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
