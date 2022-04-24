import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Dialog, Transition } from '@headlessui/react';
import {
  MenuAlt1Icon, XIcon, LogoutIcon, CogIcon,
} from '@heroicons/react/outline';
import {
  SearchIcon,
  TemplateIcon,
  ClockIcon,
} from '@heroicons/react/solid';
import { Fragment, ReactNode, useState } from 'react';
import { figFunctions } from '@components/app/constants';
import logoFull from '@assets/app/logo-full.svg';

const navigation = [
  {
    name: 'Dashboard',
    href: '/app',
    icon: TemplateIcon,
    current: true,
  },
  {
    name: 'History',
    href: '/app/history',
    icon: ClockIcon,
    current: false,
  },
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

const Separator = () => <div className="w-full my-4 px-3"><div className="h-px bg-gray-100" /></div>;

type SidebarProps = {
  children: ReactNode;
}

export default function Sidebar({ children }: SidebarProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isCurrent = (href: string) => href === router.route;

  return (
    <div className="relative h-screen flex overflow-hidden bg-white">
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 flex z-40 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    type="button"
                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </Transition.Child>
              <div className="flex-shrink-0 flex items-center px-4">
                <Image
                  src={logoFull}
                  height={30}
                  width={145}
                  alt="Figstack"
                />
              </div>
              <div className="mt-5 flex-1 h-0 overflow-y-auto">
                <nav className="px-2">
                  <div className="space-y-1">
                    {navigation.map((item) => (
                      <Link key={item.name} href={item.href} passHref>
                        <span
                          className={classNames(
                            isCurrent(item.href)
                              ? 'bg-gray-100 text-gray-900'
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
                            'group flex items-center px-2 py-2 text-base leading-5 font-medium rounded-sm cursor-pointer',
                          )}
                          aria-current={isCurrent(item.href) ? 'page' : undefined}
                        >
                          <item.icon
                            className={classNames(
                              isCurrent(item.href) ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
                              'mr-3 flex-shrink-0 h-6 w-6',
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-8">
                    <h3
                      className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                      id="mobile-teams-headline"
                    >
                      Fig Functions
                    </h3>
                    <div className="mt-1 space-y-1" role="group" aria-labelledby="mobile-teams-headline">
                      {figFunctions.map((figFunction) => (
                        <Link key={figFunction.name} href={figFunction.href} passHref>
                          <span
                            className={classNames(
                              isCurrent(figFunction.href)
                                ? 'bg-gray-100 text-gray-900'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
                              'group flex items-center px-3 py-2 text-base leading-5 font-medium rounded-sm cursor-pointer',
                            )}
                          >
                            <span
                              className={classNames(
                                figFunction.iconBackground,
                                figFunction.iconForeground,
                                'rounded-sm inline-flex p-1 mr-3',
                              )}
                            >
                              <figFunction.icon className="h-4 w-4" aria-hidden="true" />
                            </span>
                            <span className="truncate">{figFunction.name}</span>
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </nav>
              </div>
            </div>
          </Transition.Child>
          <div className="flex-shrink-0 w-14" aria-hidden="true">
            {/* Dummy element to force sidebar to shrink to fit close icon */}
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0 border-r border-gray-50">
        <div className="relative flex flex-col w-64 shadow-lg pt-5 pb-4">
          <div className="flex items-center flex-shrink-0 pl-12">
            <Image
              src={logoFull}
              height={30}
              width={145}
              alt="Figstack"
            />
          </div>
          <Separator />
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="h-0 flex-1 flex flex-col overflow-y-auto">
            {/* Navigation */}
            <nav className="px-3">
              <div className="space-y-1">
                {navigation.map((item) => (
                  <Link key={item.name} href={item.href} passHref>
                    <span
                      className={classNames(
                        isCurrent(item.href)
                          ? 'bg-hero text-white'
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50',
                        'group flex items-center px-2 py-2 text-sm font-medium rounded-sm cursor-pointer',
                      )}
                      aria-current={isCurrent(item.href) ? 'page' : undefined}
                    >
                      <div className={classNames(
                        isCurrent(item.href)
                          ? 'bg-primary-active'
                          : 'bg-gray-200',
                        'flex items-center p-1 rounded-sm mr-3',
                      )}
                      >
                        <item.icon
                          className={classNames(
                            isCurrent(item.href)
                              ? 'text-white'
                              : 'text-gray-400 group-hover:text-gray-500',
                            'flex-shrink-0 h-4 w-4',
                          )}
                          aria-hidden="true"
                        />
                      </div>
                      {item.name}
                    </span>
                  </Link>
                ))}
              </div>
              <div className="mt-8">
                {/* Secondary navigation */}
                <h3
                  className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  id="desktop-teams-headline"
                >
                  Fig Functions
                </h3>
                <div className="mt-1 space-y-1" role="group" aria-labelledby="desktop-teams-headline">
                  {figFunctions.map((figFunction) => (
                    <Link key={figFunction.name} href={figFunction.href} passHref>
                      <span
                        className={classNames(
                          isCurrent(figFunction.href)
                            ? 'bg-hero text-white'
                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50',
                          'group flex items-center px-3 py-2 text-sm font-medium rounded-sm cursor-pointer',
                        )}
                      >
                        <span
                          className={classNames(
                            isCurrent(figFunction.href)
                              ? 'bg-primary-active'
                              : `${figFunction.iconBackground} ${figFunction.iconForeground}`,
                            'rounded-sm inline-flex p-1 mr-3',
                          )}
                        >
                          <figFunction.icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <span className="truncate">{figFunction.name}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
              <Separator />
              <Link href="/app/settings" passHref>
                <span
                  className={classNames(
                    isCurrent('/app/settings')
                      ? 'bg-hero text-white'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50',
                    'group flex items-center px-3 py-2 text-sm font-medium rounded-sm cursor-pointer',
                  )}
                >
                  <div className={classNames(
                    isCurrent('/app/settings')
                      ? 'bg-primary-active'
                      : 'bg-gray-200',
                    'flex items-center p-1 rounded-sm mr-3',
                  )}
                  >
                    <CogIcon
                      className={classNames(
                        isCurrent('/app/settings')
                          ? 'text-white'
                          : 'text-gray-400 group-hover:text-gray-500',
                        'flex-shrink-0 h-4 w-4',
                      )}
                      aria-hidden="true"
                    />
                  </div>
                  Settings
                </span>
              </Link>
              {/* Addd signout functionality */}
              <Link href="/api/auth/logout" passHref>
                <span
                  className="text-gray-700 hover:text-gray-900 cursor-pointer
                  hover:bg-gray-50 group flex items-center px-3 py-2 text-sm font-medium rounded-sm"
                >
                  <div className={classNames(
                    'bg-gray-200',
                    'flex items-center p-1 rounded-sm mr-3',
                  )}
                  >
                    <LogoutIcon
                      className={classNames(
                        'text-gray-400 group-hover:text-gray-500',
                        'flex-shrink-0 h-4 w-4',
                      )}
                      aria-hidden="true"
                    />
                  </div>
                  Logout
                </span>
              </Link>
            </nav>
          </div>
          <div className="bottom-0">
            <Separator />
            <div className="relative py-1 px-4">
              <div className="mt-1">
                <h1 className="text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Support
                </h1>
                <Link href="https://discord.gg/6W7GuYuxra" passHref>
                  <div className="mt-2 text-xs font-base text-gray-500 cursor-pointer">
                    Join community
                  </div>
                </Link>
                <Link href="https://forms.gle/PUcMZBTZLQwCrheJ7" passHref>
                  <div className="mt-2 text-xs font-base text-gray-500 cursor-pointer">
                    Submit feature request
                  </div>
                </Link>
                <Link href="https://mintlify.com/?utm_source=figstack&utm_medium=sidebar" passHref>
                  <div className="mt-2 text-xs font-base text-gray-500 cursor-pointer">
                    Get code search
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Main column */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Search header */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200 lg:hidden">
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <MenuAlt1Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 flex justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex-1 flex">
              <form className="w-full flex md:ml-0" action="#" method="GET">
                <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <input
                    id="search-field"
                    name="search-field"
                    className="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-transparent focus:placeholder-gray-400 sm:text-sm"
                    placeholder="Search"
                    type="search"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  );
}
