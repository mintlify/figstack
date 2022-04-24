import Image from 'next/image';
import Link from 'next/link';
import { Popover, Transition } from '@headlessui/react';
import {
  MenuIcon,
  MailIcon,
  XIcon,
} from '@heroicons/react/outline';
import { ChevronDownIcon } from '@heroicons/react/solid';
import { Fragment } from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import { figFunctions } from '@components/app/constants';
import logo from 'assets/logo.svg';
import logoWhite from 'assets/logo-white.svg';
import vscode from 'assets/landing/vscode.svg';
import github from 'assets/landing/github.svg';

const callsToAction = [
  {
    name: 'Contact Sales',
    href: 'mailto:hi@mintlify.com',
    icon: MailIcon,
  },
];

const integrations = [
  {
    name: 'VS Code',
    description: 'Get the power of Figstack in everyone\'s favorite IDE',
    href: 'https://marketplace.visualstudio.com/items?itemName=figstack.vsc',
    icon: vscode,
  },
  {
    name: 'GitHub',
    description: 'Your intelligent code review assistant',
    href: 'https://github.com/apps/figstack',
    icon: github,
  },
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

type HeaderProps = {
  hideAlert?: boolean;
  showDarkBackground?: boolean;
}

export default function Header({ hideAlert, showDarkBackground }: HeaderProps) {
  const { user } = useUser();

  const primaryCTAButton = user == null
    ? 'Start for free'
    : 'Dashboard';

  return (
    <Popover className={classNames('relative z-50', showDarkBackground ? 'bg-hero' : null)}>
      { !hideAlert && (
      <div className="relative" style={{ backgroundColor: '#18E299' }}>
        <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
          <div className="pr-16 sm:text-center sm:px-16">
            <p className="font-base text-gray-800">
              <span className="inline">✍️ Document your code using AI</span>
              <span className="block sm:ml-2 sm:inline-block">
                <Link
                  href="https://www.mintlify.com/writer"
                  passHref
                >
                  <span className="font-bold cursor-pointer">
                    {' '}
                    Check it out
                    {' '}
                    <span aria-hidden="true">&rarr;</span>
                  </span>
                </Link>
              </span>
            </p>
          </div>
        </div>
      </div>
      ) }
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-6 md:justify-start md:space-x-10">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <Link href="/" passHref>
              <button type="button">
                <Image
                  src={logoWhite}
                  alt="Figstack"
                  width={40}
                  height={40}
                  layout="fixed"
                />
              </button>
            </Link>
          </div>
          <div className="-mr-2 -my-2 md:hidden">
            <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100">
              <span className="sr-only">Open menu</span>
              <MenuIcon className="h-6 w-6" aria-hidden="true" />
            </Popover.Button>
          </div>
          <Popover.Group as="nav" className="hidden md:flex space-x-10">
            <Popover className="relative">
              {({ open }) => (
                <>
                  <Popover.Button
                    className={classNames(
                      open ? 'text-gray-300' : 'text-white',
                      'group rounded-md inline-flex items-center text-base font-medium hover:text-gray-300',
                    )}
                  >
                    <span>Solutions</span>
                    <ChevronDownIcon
                      className={classNames(
                        open ? 'text-gray-300' : 'text-white',
                        'ml-2 h-5 w-5 group-hover:text-gray-300',
                      )}
                      aria-hidden="true"
                    />
                  </Popover.Button>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                  >
                    <Popover.Panel className="absolute z-10 -ml-4 mt-3 transform px-2 w-screen max-w-md sm:px-0 lg:ml-0 lg:left-1/2 lg:-translate-x-1/2">
                      <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                        <div className="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
                          {figFunctions.map((figFunction) => (
                            <Link key={figFunction.id} href={`/#${figFunction.id}`} passHref>
                              <button
                                type="button"
                                className="text-left -m-3 p-3 flex items-start rounded-lg hover:bg-gray-50"
                              >
                                <span
                                  className={classNames(
                                    figFunction.iconBackground,
                                    figFunction.iconForeground,
                                    'rounded-md inline-flex p-1',
                                  )}
                                >
                                  <figFunction.icon className="h-4 w-4" aria-hidden="true" />
                                </span>
                                <div className="ml-4">
                                  <p className="text-base font-medium text-gray-900">{figFunction.name}</p>
                                  <p className="mt-1 text-sm text-gray-500">{figFunction.description}</p>
                                </div>
                              </button>
                            </Link>
                          ))}
                        </div>
                        <div className="px-5 py-5 bg-gray-50 space-y-6 sm:flex sm:space-y-0 sm:space-x-10 sm:px-8">
                          {callsToAction.map((item) => (
                            <div key={item.name} className="flow-root">
                              <a
                                href={item.href}
                                className="-m-3 p-3 flex items-center rounded-md text-base font-medium text-gray-900 hover:bg-gray-100"
                              >
                                <item.icon className="flex-shrink-0 h-6 w-6 text-gray-400" aria-hidden="true" />
                                <span className="ml-3">{item.name}</span>
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Popover.Panel>
                  </Transition>
                </>
              )}
            </Popover>
            <Popover className="relative">
              {({ open }) => (
                <>
                  <Popover.Button
                    className={classNames(
                      open ? 'text-gray-300' : 'text-white',
                      'group rounded-md inline-flex items-center text-base font-medium hover:text-gray-300',
                    )}
                  >
                    <span>Integrations</span>
                    <ChevronDownIcon
                      className={classNames(
                        open ? 'text-gray-300' : 'text-white',
                        'ml-2 h-5 w-5 group-hover:text-gray-300',
                      )}
                      aria-hidden="true"
                    />
                  </Popover.Button>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                  >
                    <Popover.Panel className="absolute z-10 -ml-4 mt-3 transform px-2 w-screen max-w-md sm:px-0 lg:ml-0 lg:left-1/2 lg:-translate-x-1/2">
                      <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                        <div className="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
                          {integrations.map((integration) => (
                            <Link key={integration.name} href={integration.href} passHref>
                              <button
                                type="button"
                                className="text-left -m-3 p-3 flex items-start rounded-lg hover:bg-gray-50"
                              >
                                <span
                                  className="p-1"
                                >
                                  <Image src={integration.icon} width={24} height={24} />
                                </span>
                                <div className="ml-4">
                                  <p className="text-base font-medium text-gray-900">{integration.name}</p>
                                  <p className="mt-1 text-sm text-gray-500">{integration.description}</p>
                                </div>
                              </button>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </Popover.Panel>
                  </Transition>
                </>
              )}
            </Popover>
            <a
              href="https://discord.gg/6W7GuYuxra"
              className="text-base font-medium text-white hover:text-gray-300 cursor-pointer"
              target="_blank"
              rel="noreferrer"
            >
              Community
            </a>
          </Popover.Group>
          <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
            {
              user == null && (
              <Link href="/api/auth/login" passHref>
                <button type="button" className="whitespace-nowrap text-base font-medium text-white hover:text-gray-300">
                  Sign in
                </button>
              </Link>
              )
            }
            <Link href="/api/auth/login" passHref>
              <button
                type="button"
                className="ml-8 whitespace-nowrap inline-flex items-center justify-center
              px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-secondary hover:bg-secondary-active"
              >
                {primaryCTAButton}
              </button>
            </Link>
          </div>
        </div>
      </div>

      <Transition
        as={Fragment}
        enter="duration-200 ease-out"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="duration-100 ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Popover.Panel focus className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden">
          <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
            <div className="pt-5 pb-6 px-5">
              <div className="flex items-center justify-between">
                <Link href="/" passHref>
                  <button type="button">
                    <Image
                      src={logo}
                      alt="Figstack"
                      width={32}
                      height={32}
                    />
                  </button>
                </Link>
                <div className="-mr-2">
                  <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100">
                    <span className="sr-only">Close menu</span>
                    <XIcon className="h-6 w-6" aria-hidden="true" />
                  </Popover.Button>
                </div>
              </div>
              <div className="mt-6">
                <nav className="grid gap-y-8">
                  {figFunctions.map((figFunction) => (
                    <a
                      key={figFunction.id}
                      href={figFunction.href}
                      className="-m-3 p-3 flex items-center rounded-md hover:bg-gray-50"
                    >
                      <figFunction.icon className="flex-shrink-0 h-6 w-6 text-indigo-600" aria-hidden="true" />
                      <span className="ml-3 text-base font-medium text-gray-900">{figFunction.name}</span>
                    </a>
                  ))}
                </nav>
              </div>
            </div>
            <div className="py-6 px-5 space-y-6">
              <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                <Link href="https://discord.gg/6W7GuYuxra" passHref>
                  <span
                    className="text-center text-base font-medium text-gray-900 hover:text-gray-700 cursor-pointer"
                  >
                    Community
                  </span>
                </Link>
                <Link href="https://mintlify.com/" passHref>
                  <span
                    className="text-center text-base font-medium text-gray-900 hover:text-gray-700 cursor-pointer"
                  >
                    Automated Documentation
                  </span>
                </Link>
              </div>
              <div>
                <Link href="/api/auth/login" passHref>
                  <button
                    type="button"
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    {primaryCTAButton}
                  </button>
                </Link>
                {
                  user == null && (
                  <p className="mt-6 text-center text-base font-medium text-gray-500">
                    Existing customer?
                    {' '}
                    <Link href="/api/auth/login" passHref>
                      <button type="button" className="text-indigo-600 hover:text-indigo-500">
                        Sign in
                      </button>
                    </Link>
                  </p>
                  )
                }
              </div>
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}
