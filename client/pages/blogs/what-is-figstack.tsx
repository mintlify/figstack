/* eslint-disable max-len */
import Head from 'next/head';
import Link from 'next/link';
import Header from '@components/landing/Header';
import Footer from '@components/landing/Footer';

export default function WhatIsFigstack() {
  return (
    <>
      <Head>
        <title>What is Figstack?</title>
        <meta property="og:description" content="2 minute read" />
      </Head>
      <div>
        <Header hideAlert showDarkBackground />
        <div className="relative py-16 bg-white overflow-hidden">
          <div className="hidden lg:block lg:absolute lg:inset-y-0 lg:h-full lg:w-full">
            <div className="relative h-full text-lg max-w-prose mx-auto" aria-hidden="true">
              <svg
                className="absolute top-12 left-full transform translate-x-32"
                width={404}
                height={384}
                fill="none"
                viewBox="0 0 404 384"
              >
                <defs>
                  <pattern
                    id="74b3fd99-0a6f-4271-bef2-e80eeafdf357"
                    x={0}
                    y={0}
                    width={20}
                    height={20}
                    patternUnits="userSpaceOnUse"
                  >
                    <rect x={0} y={0} width={4} height={4} className="text-gray-200" fill="currentColor" />
                  </pattern>
                </defs>
                <rect width={404} height={384} fill="url(#74b3fd99-0a6f-4271-bef2-e80eeafdf357)" />
              </svg>
              <svg
                className="absolute top-1/2 right-full transform -translate-y-1/2 -translate-x-32"
                width={404}
                height={384}
                fill="none"
                viewBox="0 0 404 384"
              >
                <defs>
                  <pattern
                    id="f210dbf6-a58d-4871-961e-36d5016a0f49"
                    x={0}
                    y={0}
                    width={20}
                    height={20}
                    patternUnits="userSpaceOnUse"
                  >
                    <rect x={0} y={0} width={4} height={4} className="text-gray-200" fill="currentColor" />
                  </pattern>
                </defs>
                <rect width={404} height={384} fill="url(#f210dbf6-a58d-4871-961e-36d5016a0f49)" />
              </svg>
              <svg
                className="absolute bottom-12 left-full transform translate-x-32"
                width={404}
                height={384}
                fill="none"
                viewBox="0 0 404 384"
              >
                <defs>
                  <pattern
                    id="d3eb07ae-5182-43e6-857d-35c643af9034"
                    x={0}
                    y={0}
                    width={20}
                    height={20}
                    patternUnits="userSpaceOnUse"
                  >
                    <rect x={0} y={0} width={4} height={4} className="text-gray-200" fill="currentColor" />
                  </pattern>
                </defs>
                <rect width={404} height={384} fill="url(#d3eb07ae-5182-43e6-857d-35c643af9034)" />
              </svg>
            </div>
          </div>
          <div className="relative px-4 sm:px-6 lg:px-8">
            <div className="text-lg max-w-prose mx-auto">
              <h1>
                <span className="block text-sm text-center text-gray-600 font-semibold tracking-wide uppercase">
                  2 min read
                </span>
                <span className="mt-2 block text-3xl text-center leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                  What is Figstack?
                </span>
              </h1>
              <p className="mt-8 italic text-gray-500 leading-8">
                <span className="font-semibold">Coding has a huge learning curve</span>
                .
                That statement seems obvious to most of us,
                but what it means goes beyond just those words.
                The difficulty of coding means that,
                even as technology becomes a greater presence in our individual lives,
                we’re moving further away from understanding how it all works.
              </p>
            </div>
            <div className="mt-6 prose prose-indigo prose-lg text-gray-500 mx-auto">
              <p>
                So when it comes to programming,
                even those of us with years of experience often feel just like beginners.
                And for those of us with less, maybe just an introductory-level college course,
                code can be really daunting:
                learning a little bit only exposes how much more there is you don’t understand.
                One way or another, whether we’re beginners or experts,
                we could all benefit from learning more about coding.
              </p>
              <p>
                Think of Figstack as like a tutor,
                or your roommate who&apos;s already taken that difficult class you&apos;re in now.
                We built Figstack not only to make coding less intimidating and easier
                to understand,
                but also to help increase your personal learning and understanding as you use it.
              </p>
              <p>
                Let’s say you’re trying to create a landing page for your business.
                You have a few choices:
                you can buy a premade template for it, you can code it yourself,
                or you can hire somebody else to do it for you.
                That’s up to you, but no matter which option you choose,
                Figstack is the perfect companion.
              </p>
              <h2>Explain Code</h2>
              <p>
                If you choose to buy a premade template,
                you’ll probably have at least one aspect you’ll want to modify.
                But often, when you’re looking at the way it was coded,
                there will be some part you don’t understand. That’s where Figstack comes in.
                All you have to do is take that section of code,
                select which coding language it belongs to,
                and enter it into Figstack’s Explain Code function.
                The Explain Code function, well, explains the code—in simple, non-technical English
                (or whatever your preferred language may be).
              </p>
              <blockquote>
                <p>
                  What I really need is something that explains other devs&apos; code.
                  I just tried some of my functions in the Explain Code tool and was blown away.
                  Bravo.
                </p>
              </blockquote>
              <figure>
                <video
                  className="w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5"
                  autoPlay
                  muted
                  loop
                >
                  <source src="../videos/explain.mp4" type="video/mp4" />
                </video>
              </figure>
              <p>
                Or in the situation you do the coding yourself, Figstack will be your ideal companion.
                Figstack doesn&apos;t just spit out answers, it teaches, so that your understanding will increase with time. And Figstack learns with you, tailoring and improving explanations using machine learning.
                So not only will you have an easier time programming in the short-term, but in the long-term, too.
              </p>
              <p>
                Lastly, let’s say somebody else codes the website for you. It’s possible you’ll get the finished product and everything will be perfect, but then, if you need to make a modification, you’re in a tough position. Because someone else did the programming, you might find it difficult to understand. Not only can Figstack’s Explain Code function once again help you to demystify the code, but Figstack’s additional features can help you in a few other essential ways.
              </p>
              <h2>Docstring Writer</h2>
              <p>
                The Docstring Writer function is an essential tool for collaborations between coders and for documenting your code. How it works is that, just like the Explain Code function, you input a section of code into the Docstring Writer function. But now, instead of explaining the code based on how it executes, the function crafts a detailed docstring of the section of code you’ve entered. Unlike the Explain Code function, a docstring describes what a function does, its parameters, and what it returns for others to understand. This is essential for explaining your functions directly in your code so that collaborators can instantly understand your work.
              </p>
              <figure>
                <video
                  className="w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5"
                  autoPlay
                  muted
                  loop
                >
                  <source src="../videos/docstring.mp4" type="video/mp4" />
                </video>
              </figure>
              <h2>Calculate Time Complexity</h2>
              <p>
                As well, you can make your code more efficient with the Time Complexity function. Again, you just input your code, and the function gives you the resulting Big O notation which explains the runtime of a function as the number of inputs grows. Coding isn’t just about solving problems, but solving them with the most minimal use of space and time. Imagine this for your website: you don’t want people waiting ten seconds for the home page to load. The Time Complexity function helps you understand if your code is inefficient and how it can be optimized.
              </p>
              <figure>
                <video
                  className="w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5"
                  autoPlay
                  muted
                  loop
                >
                  <source src="../videos/complexity.mp4" type="video/mp4" />
                </video>
              </figure>
              <h2>tl;dr</h2>
              <p>
                Figstack is for developers, managers, entrepreneurs, reviewers, students, and anyone else who works with programming. We made our service to supercharge your ability to read, write, and understand code, because we understand both the difficulty of coding and the necessity of working with it in the modern world. And we believe this strongly—coding should never be a roadblock from achieving your goals.
                If you agree, or if you want to see how Figstack can help you or your business succeed, check out Figstack by
                {' '}
                <Link href="/api/auth/login" passHref>
                  <button className="text-primary font-bold hover:text-primary-active" type="button">signing up</button>
                </Link>
                {' '}
                today.
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
