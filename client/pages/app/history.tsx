import type { ReactElement } from 'react';
import Head from 'next/head';
import dateFormat from 'dateformat';
import Sidebar from '@components/app/Sidebar';
import {
  ChevronRightIcon, ClockIcon, ArrowRightIcon,
} from '@heroicons/react/solid';
import FunctionCard from '@components/app/FunctionCard';
import { getFigFunctionById } from '@components/app/constants';
import FigIcon from '@components/app/icons';
import useHistory, { FigLog } from '@components/hooks/useHistory';
import Link from 'next/link';

export default function History() {
  const { history } = useHistory();

  return (
    <>
      <Head>
        <title>History</title>
      </Head>
      <FunctionCard
        header="History"
        icon={<ClockIcon className="h-4 w-4" />}
      >
        <div className="bg-white overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {history == null ? (
              <div className="py-2 w-full flex justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
            ) : history.length === 0
              ? <div className="py-2 w-full flex justify-center text-gray-500">No functions recorded...yet</div>
              : history.map((log: FigLog) => (
                <li key={log.id} className="w-full">
                  <Link
                    href={{
                      pathname: log.figFunction,
                      query: {
                        input: log.input,
                        inputLanguage: log.inputLanguage,
                        output: log.output,
                        outputLanguage: log.outputLanguage,
                      },
                    }}
                    passHref
                  >
                    <span className="block hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center px-4 py-4 sm:px-6">
                        <div className="min-w-0 flex-1 flex items-center">
                          <div className="flex-shrink-0">
                            <FigIcon functionId={log.figFunction} className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-4 md:gap-4">
                            <div>
                              <p className="text-sm font-medium text-gray-700 truncate">{getFigFunctionById(log.figFunction)?.name || ''}</p>
                              <p className="mt-1 flex items-center text-sm text-gray-500">
                                <span className="truncate">{dateFormat(log.timestamp, 'mm/dd/yy, h:MM TT')}</span>
                              </p>
                            </div>
                            <div className="hidden md:col-span-3 md:grid md:grid-cols-9 md:gap-4">
                              <div className="col-span-4">
                                <p className="text-sm text-gray-900">
                                  {log.inputLanguage}
                                </p>
                                <p className="mt-1 block text-sm text-gray-500 truncate">
                                  {log.input}
                                </p>
                              </div>
                              <div className="flex items-center justify-center">
                                <ArrowRightIcon className="h-4 w-4 text-primary" />
                              </div>
                              <div className="col-span-4">
                                <p className="text-sm text-gray-900">
                                  {log.outputLanguage}
                                </p>
                                <p className="mt-1 block text-sm text-gray-500 truncate">
                                  {log.output}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <ChevronRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                      </div>
                    </span>
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </FunctionCard>
    </>
  );
}

History.getLayout = function getLayout(page: ReactElement) {
  return (
    <Sidebar>
      {page}
    </Sidebar>
  );
};
