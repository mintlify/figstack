import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import type { ReactElement } from 'react';
import useUser from '@components/hooks/useUser';
import { figFunctions } from '@components/app/constants';
import Sidebar from '@components/app/Sidebar';
import Footer from '@components/app/Footer';
import {
  CheckIcon,
  ChevronRightIcon,
} from '@heroicons/react/solid';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

export default function App() {
  const router = useRouter();
  const { user, isLoading } = useUser();

  if (!isLoading && !user) return router.replace('/');

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <div className="relative min-h-screen bg-gray-100">
        <main className="py-8">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <h1 className="sr-only">Profile</h1>
            {/* Main 3 column grid */}
            <div className="grid grid-cols-1 gap-4 items-start lg:grid-cols-3 lg:gap-8">
              {/* Left column */}
              <div className="grid grid-cols-1 gap-4 lg:col-span-2">
                {/* Welcome panel */}
                <section aria-labelledby="profile-overview-title">
                  <div className="rounded-lg bg-white overflow-hidden shadow">
                    <h2 className="sr-only" id="profile-overview-title">
                      Profile Overview
                    </h2>
                    <div className="bg-white p-6">
                      <div className="sm:flex sm:items-center sm:justify-between">
                        <div className="sm:flex sm:space-x-4">
                          <div className="flex-shrink-0">
                            <img
                              className="mx-auto rounded-full"
                              src={user?.profileImg || 'https://i.stack.imgur.com/dz7ja.png'}
                              width={56}
                              height={56}
                              alt=""
                            />
                          </div>
                          <div className="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
                            <p className="text-sm font-medium text-gray-600">Good afternoon,</p>
                            <p className="text-xl font-bold text-gray-900 sm:text-2xl">{user?.name}</p>
                          </div>
                        </div>
                        <div className="mt-5 flex justify-center sm:mt-0">
                          <Link href="/app/settings" passHref>
                            <button
                              type="button"
                              className="flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                              Open Settings
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Actions panel */}
                <section aria-labelledby="quick-links-title">
                  <div className="rounded-lg overflow-hidden shadow">
                    <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
                      <h3 className="text-lg leading-6 font-medium text-gray-800">What would you like to do?</h3>
                    </div>
                    <div className="divide-y divide-gray-200 sm:divide-y-0 sm:grid sm:grid-cols-2 sm:gap-px">
                      {figFunctions.map((figFunction) => (
                        <div
                          key={figFunction.name}
                          className="relative group bg-white hover:bg-gray-50 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-cyan-500"
                        >
                          <div>
                            <span
                              className={classNames(
                                figFunction.iconBackground,
                                figFunction.iconForeground,
                                'rounded-sm inline-flex p-2',
                              )}
                            >
                              <figFunction.icon className="h-6 w-6" aria-hidden="true" />
                            </span>
                          </div>
                          <div className="mt-4">
                            <h3 className="text-lg font-medium">
                              <Link href={figFunction.href} passHref>
                                <div className="cursor-pointer">
                                  <span className="absolute inset-0 focus:outline-none" aria-hidden="true" />
                                  {figFunction.name}
                                </div>
                              </Link>
                            </h3>
                            <p className="mt-2 text-sm text-gray-500">
                              {figFunction.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              </div>

              {/* Right column */}
              <div className="grid grid-cols-1 gap-4">
                {/* Announcements */}
                <section aria-labelledby="announcements-title">
                  <div className="bg-white py-5 shadow rounded-lg">
                    <h2 className="px-6 text-lg font-medium text-gray-900">
                      Checklist
                    </h2>

                    {/* Activity Feed */}
                    <div className="mt-1 flow-root">
                      <ul className="-mb-2">
                        {user?.checklist?.map((item) => (
                          <li key={item.figFunction || item.link}>
                            <Link href={item.link != null ? item.link : `app/${item.figFunction}`} passHref>
                              <button className="px-6 py-3 relative hover:bg-gray-100 text-left w-full" type="button">
                                <div className="relative flex space-x-3 items-center">
                                  <div>
                                    {
                                  item.isChecked ? (
                                    <span
                                      className="h-6 w-6 rounded-full flex items-center bg-green-500 justify-center"
                                    >
                                      <CheckIcon className="w-4 h-4 text-white" aria-hidden="true" />
                                    </span>
                                  ) : (
                                    <span
                                      className="h-6 w-6 rounded-full flex items-center bg-white justify-center border-2 border-gray-200"
                                    />
                                  )
                                  }
                                  </div>
                                  <div className="min-w-0 flex-1 flex justify-between items-center space-x-4">
                                    <div>
                                      <p className="text-sm text-gray-500">
                                        {item.intro}
                                        {' '}
                                        <span className="font-medium text-gray-900">
                                          {item.functionName}
                                        </span>
                                      </p>
                                    </div>
                                    <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                      <ChevronRightIcon className="h-4 w-4" />
                                    </div>
                                  </div>
                                </div>
                              </button>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}

App.getLayout = function getLayout(page: ReactElement) {
  return (
    <Sidebar>
      {page}
    </Sidebar>
  );
};
