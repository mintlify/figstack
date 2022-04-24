import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import { ChevronRightIcon } from '@heroicons/react/solid';
import type { NextPage } from 'next';
import Footer from '@components/landing/Footer';
import Header from '@components/landing/Header';
import LogoCloud from '@components/landing/LogoCloud';
import {
  explainFunction, translateFunction, docstringFunction, complexityFunction,
} from '@components/app/constants';
import Typist from 'react-text-typist';
import deej from '@assets/landing/deej.jpeg';
import bertie from '@assets/landing/bertie.jpeg';
import noah from '@assets/landing/noah.jpeg';
import xitang from '@assets/landing/xitang.jpeg';
import HeroBG from '@assets/landing/hero-bg.svg';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

const LandingPage: NextPage = () => (
  <>
    <Head>
      <title>Figstack: Your Intelligent Coding Companion</title>
      <meta property="og:title" content="Figstack: Your Intelligent Coding Companion" />
      <meta property="og:description" content="Reading and writing code is hard! Figstack helps you interpret the details so you can focus on building what matters" />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="https://figstack.com/thumbnail.png" />
      <meta property="og:url" content="https://figstack.com" />
    </Head>
    <div className="relative bg-hero overflow-hidden">
      <Header />
      <div className="hidden sm:block sm:absolute sm:inset-0 overflow-hidden z-0" aria-hidden="true">
        <Image
          className="h-full w-full opacity-25"
          src={HeroBG}
        />
      </div>
      <div className="relative pb-16 sm:pb-24">
        <main className="mt-16 sm:mt-24">
          <div className="mx-auto max-w-7xl">
            <div className="lg:grid lg:grid-cols-12 lg:gap-8">
              <div className="px-4 sm:px-6 sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left lg:flex lg:items-center">
                <div>
                  <Link href="https://www.producthunt.com/posts/figstack" passHref>
                    <button
                      type="button"
                      className="inline-flex items-center text-white bg-gray-900 rounded-full p-1 pr-2
                  sm:text-base lg:text-sm xl:text-base hover:text-gray-200"
                    >
                      <span className="px-3 py-0.5 text-white text-xs font-medium leading-5 uppercase
                  tracking-wide bg-primary rounded-full"
                      >
                        #1 Product of the day
                      </span>
                      <span className="ml-4 text-sm">Check us out on Product Hunt</span>
                      <ChevronRightIcon className="ml-2 w-5 h-5 text-gray-500" aria-hidden="true" />
                    </button>
                  </Link>
                  <h1 className="mt-4 text-4xl tracking-tight font-extrabold text-white font-dystopian sm:mt-5 sm:leading-none lg:mt-6 lg:text-5xl xl:text-6xl">
                    <span className="md:block">Understand and document code</span>
                    {' '}
                    <span className="text-secondary md:block">lightning fast</span>
                  </h1>
                  <p className="mt-3 text-base text-gray-300 sm:pr-4 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                    Reading and writing code is hard! Figstack helps you interpret the details
                    so you can focus on building what matters
                  </p>
                </div>
              </div>
              <div className="mt-16 sm:mt-24 lg:mt-0 lg:col-span-6">
                <div className="bg-white sm:max-w-md sm:w-full sm:mx-auto sm:rounded-lg sm:overflow-hidden">
                  <div className="px-4 py-8 sm:px-10">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Sign in with</p>

                      <div className="mt-2 grid grid-cols-2 gap-3">
                        <div>
                          <Link href="/api/auth/login" passHref>
                            <button
                              type="button"
                              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                            >
                              <span className="sr-only">Sign in with Google</span>
                              <svg aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" className="svg-inline--fa fa-google fa-w-16 h-5 w-5" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                                <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
                              </svg>
                            </button>
                          </Link>
                        </div>

                        <div>
                          <Link href="/api/auth/login" passHref>
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
                          </Link>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 relative">
                      <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-gray-300" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or</span>
                      </div>
                    </div>

                    <div className="mt-6">
                      <form action="#" method="POST" className="space-y-6">
                        <div>
                          <p className="sr-only">
                            Full name
                          </p>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            autoComplete="name"
                            placeholder="Full name"
                            required
                            className="block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>

                        <div>
                          <p className="sr-only">
                            Email address
                          </p>
                          <input
                            type="text"
                            name="mobile-or-email"
                            id="mobile-or-email"
                            autoComplete="email"
                            placeholder="Email address"
                            required
                            className="block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>

                        <div>
                          <p className="sr-only">
                            Password
                          </p>
                          <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Password"
                            autoComplete="current-password"
                            required
                            className="block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>

                        <Link href="/api/auth/login" passHref>
                          <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-active focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                          >
                            Start for free
                          </button>
                        </Link>
                      </form>
                    </div>
                  </div>
                  <div className="px-4 py-6 bg-gray-50 border-t-2 border-gray-200 sm:px-10">
                    <p className="text-xs leading-5 text-gray-500">
                      By signing up, you agree to our
                      {' '}
                      <Link href="https://app.termly.io/document/terms-of-use-for-saas/45b03409-3c40-49ee-aa05-ba71a4cbdf5b" passHref>
                        <button type="button" className="font-medium text-gray-900 hover:underline">
                          Terms
                        </button>
                      </Link>
                      ,
                      {' '}
                      <Link href="https://app.termly.io/document/privacy-policy/d2126d4e-53aa-4527-ab2e-bb39b6b8e2ad" passHref>
                        <button type="button" className="font-medium text-gray-900 hover:underline">
                          Privacy Policy
                        </button>
                      </Link>
                      {' '}
                      and
                      {' '}
                      <Link href="https://app.termly.io/document/cookie-policy/830638a7-2d92-4b18-a52a-b1d4f100e931" passHref>
                        <button type="button" className="font-medium text-gray-900 hover:underline">
                          Cookies Policy
                        </button>
                      </Link>
                      .
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <LogoCloud />
      <div className="relative bg-white py-16 overflow-hidden">
        <div className="mt-8 mx-auto max-w-md px-4 text-center sm:px-6 sm:max-w-3xl lg:px-8 lg:max-w-7xl">
          <div>
            <h2 className="text-base font-semibold tracking-wider text-primary uppercase">Figstack is</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl font-dystopian">
              A suite of solutions for
              {' '}
              <Typist
                className="text-primary"
                sentences={['developers', 'managers', 'reviewers', 'students', 'builders']}
                typingSpeed={100}
                deletingSpeed={60}
                pauseTime={1800}
              />
            </p>
          </div>
          <p className="mt-5 max-w-prose mx-auto text-xl text-gray-500">
            Powered by AI and trained with billions of lines of code, Figstack
            supercharges your ability to read and write code across languages.
          </p>
        </div>
      </div>
      <div className="relative bg-white pt-16 pb-32 overflow-hidden">
        <section className="relative" id="explain">
          <div className="lg:mx-auto lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-3 lg:grid-flow-col-dense lg:gap-24">
            <div className="px-4 max-w-xl mx-auto sm:px-6 lg:py-16 lg:max-w-none lg:mx-0 lg:px-0">
              <div>
                <span
                  className={classNames(
                    explainFunction.iconBackground,
                    explainFunction.iconForeground,
                    'rounded-lg inline-flex p-2',
                  )}
                >
                  <explainFunction.icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <div className="mt-6">
                  <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 font-dystopian">
                    Understand code in any language
                  </h2>
                  <p className="mt-4 text-lg text-gray-500">
                    Having trouble understanding the program that you&apos;re looking at? Use the
                    {' '}
                    <span className="py-px px-1 bg-gray-100 rounded-md text-primary font-medium">Explain Code</span>
                    {' '}
                    function to explain it to you in natural language.
                  </p>
                  <div className="mt-6">
                    <Link href="/api/auth/login" passHref>
                      <button
                        type="button"
                        className="inline-flex px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-active"
                      >
                        Get started
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="mt-8 border-t border-gray-200 pt-6">
                <blockquote>
                  <div>
                    <p className="text-base text-gray-500">
                      &ldquo;What I really need is something that explains other devs&apos; code.
                      I just tried some of my functions in the Explain Code tool
                      and was blown away. Bravo.&rdquo;
                    </p>
                  </div>
                  <footer className="mt-3">
                    <div className="flex items-center space-x-3">
                      <Image
                        className="rounded-full"
                        src={deej}
                        width={24}
                        height={24}
                        alt="Xitang"
                      />
                      <div className="text-base font-medium text-gray-700">Deej Tulleken, Software Engineer</div>
                    </div>
                  </footer>
                </blockquote>
              </div>
            </div>
            <div className="mt-12 sm:mt-16 lg:mt-0">
              <div className="pl-4 -mr-48 sm:pl-6 md:-mr-16 lg:px-0 lg:m-0 lg:relative lg:h-full">
                <video
                  className="w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5
                lg:absolute lg:left-0 lg:h-full lg:w-auto lg:max-w-none"
                  autoPlay
                  muted
                  loop
                >
                  <source src="videos/explain.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
        </section>
        <section className="mt-48" id="translate">
          <div className="lg:mx-auto lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-3 lg:grid-flow-col-dense lg:gap-24">
            <div className="px-4 max-w-xl mx-auto sm:px-6 lg:py-10 lg:max-w-none lg:mx-0 lg:px-0 lg:col-start-3">
              <div>
                <span
                  className={classNames(
                    translateFunction.iconBackground,
                    translateFunction.iconForeground,
                    'rounded-lg inline-flex p-2',
                  )}
                >
                  <translateFunction.icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <div className="mt-6">
                  <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 font-dystopian">
                    Translate programming languages
                  </h2>
                  <p className="mt-4 text-lg text-gray-500">
                    Need to convert Python to Go or Ruby to Javascript?
                    The
                    {' '}
                    <span className="py-px px-1 bg-gray-100 rounded-md text-primary font-medium">Language Translator</span>
                    {' '}
                    function lets you reliably swap from one language to another.
                  </p>
                  <div className="mt-6">
                    <Link href="/api/auth/login" passHref>
                      <button
                        type="button"
                        className="inline-flex px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-active"
                      >
                        Get started
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="mt-8 border-t border-gray-200 pt-6">
                <blockquote>
                  <div>
                    <p className="text-base text-gray-500">
                      &ldquo;Over the last decade when I&apos;ve been dabbling in learning languages
                      trying to understand the logic. This is exactly the sort of
                      tool to take that specific challenge away.&rdquo;
                    </p>
                  </div>
                  <footer className="mt-3">
                    <div className="flex items-center space-x-3">
                      <Image
                        className="rounded-full"
                        src={bertie}
                        width={24}
                        height={24}
                        alt="Xitang"
                      />
                      <div className="text-base font-medium text-gray-700">Bertie IP, Product Manager</div>
                    </div>
                  </footer>
                </blockquote>
              </div>
            </div>
            <div className="mt-12 sm:mt-16 lg:mt-0 lg:col-start-2 lg:col-span-1">
              <div className="pr-4 -ml-48 sm:pr-6 md:-ml-16 lg:px-0 lg:m-0 lg:relative lg:h-full">
                <video
                  className="w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 lg:absolute lg:right-0 lg:h-full lg:w-auto lg:max-w-none"
                  autoPlay
                  muted
                  loop
                >
                  <source src="videos/translate.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
        </section>
        <section className="mt-48 relative" id="docstring">
          <div className="lg:mx-auto lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-3 lg:grid-flow-col-dense lg:gap-24">
            <div className="px-4 max-w-xl mx-auto sm:px-6 lg:py-16 lg:max-w-none lg:mx-0 lg:px-0">
              <div>
                <span
                  className={classNames(
                    docstringFunction.iconBackground,
                    docstringFunction.iconForeground,
                    'rounded-lg inline-flex p-2',
                  )}
                >
                  <docstringFunction.icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <div className="mt-6">
                  <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 font-dystopian">
                    Automate documentation for your functions
                  </h2>
                  <p className="mt-4 text-lg text-gray-500">
                    Don&apos;t like writing documentation for your functions? Have Figstack&apos;s
                    {' '}
                    <span className="py-px px-1 bg-gray-100 rounded-md text-primary font-medium">Docstring Writer</span>
                    {' '}
                    craft detailed docstrings so your functions are always readable and maintable.
                  </p>
                  <div className="mt-6">
                    <Link href="/api/auth/login" passHref>
                      <button
                        type="button"
                        className="inline-flex px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-active"
                      >
                        Get started
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="mt-8 border-t border-gray-200 pt-6">
                <blockquote>
                  <div>
                    <p className="text-base text-gray-500">
                      &ldquo;The docstring function blew me away. It writes what the
                      parameters are and what the function returns so I don&apos;t have to.&rdquo;
                    </p>
                  </div>
                  <footer className="mt-3">
                    <div className="flex items-center space-x-3">
                      <Image
                        className="rounded-full"
                        src={noah}
                        width={24}
                        height={24}
                        alt="Noah"
                      />
                      <div className="text-base font-medium text-gray-700">Noah Chun, Student at Cornell</div>
                    </div>
                  </footer>
                </blockquote>
              </div>
            </div>
            <div className="mt-12 sm:mt-16 lg:mt-0">
              <div className="pl-4 -mr-48 sm:pl-6 md:-mr-16 lg:px-0 lg:m-0 lg:relative lg:h-full">
                <video
                  className="w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 lg:absolute lg:left-0 lg:h-full lg:w-auto lg:max-w-none"
                  autoPlay
                  muted
                  loop
                >
                  <source src="videos/docstring.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
        </section>
        <section className="mt-48" id="complexity">
          <div className="lg:mx-auto lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-3 lg:grid-flow-col-dense lg:gap-24">
            <div className="px-4 max-w-xl mx-auto sm:px-6 lg:py-16 lg:max-w-none lg:mx-0 lg:px-0 lg:col-start-3">
              <div>
                <span
                  className={classNames(
                    complexityFunction.iconBackground,
                    complexityFunction.iconForeground,
                    'rounded-lg inline-flex p-2',
                  )}
                >
                  <complexityFunction.icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <div className="mt-6">
                  <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 font-dystopian">
                    Get the time complexity of your program
                  </h2>
                  <p className="mt-4 text-lg text-gray-500">
                    Measure the efficiency of your code in Big O notation using the
                    {' '}
                    <span className="py-px px-1 bg-gray-100 rounded-md text-primary font-medium">Time Complexity</span>
                    {' '}
                    function and see how you can optimize your program.
                  </p>
                  <div className="mt-6">
                    <Link href="/api/auth/login" passHref>
                      <button
                        type="button"
                        className="inline-flex px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-active"
                      >
                        Get started
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="mt-8 border-t border-gray-200 pt-6">
                <blockquote>
                  <div>
                    <p className="text-base text-gray-500">
                      &ldquo;Love each of the value-props, the time complexity tracker
                      was especially slick.&rdquo;
                    </p>
                  </div>
                  <footer className="mt-3">
                    <div className="flex items-center space-x-3">
                      <Image
                        className="rounded-full"
                        src={xitang}
                        width={24}
                        height={24}
                        alt="Xitang"
                      />
                      <div className="text-base font-medium text-gray-700">Xitang Zhao, Founder</div>
                    </div>
                  </footer>
                </blockquote>
              </div>
            </div>
            <div className="mt-12 sm:mt-16 lg:mt-0 lg:col-start-1 lg:col-span-2">
              <div className="pr-4 -ml-48 sm:pr-6 md:-ml-16 lg:px-0 lg:m-0 lg:relative lg:h-full">
                <video
                  className="w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 lg:absolute lg:right-0 lg:h-full lg:w-auto lg:max-w-none"
                  autoPlay
                  muted
                  loop
                >
                  <source src="videos/complexity.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  </>
);

export default LandingPage;
