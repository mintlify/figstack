import { useState } from 'react';
import { XIcon, InformationCircleIcon } from '@heroicons/react/solid';

type BadgeProps = {
    name: string;
    isHidden?: boolean;
    content: string;
    onClickExample: () => void,
}

export default function Badge({
  name, isHidden, content, onClickExample,
}: BadgeProps) {
  const [refreshKey, setRefreshKey] = useState(0);
  const isClosed = typeof window !== 'undefined' && window.localStorage.getItem(`${name}-closed`) != null;
  if (isHidden || isClosed) return null;

  const onClose = () => {
    window?.localStorage.setItem(`${name}-closed`, 'true');
    setRefreshKey(Math.random());
  };

  return (
    <div className="inset-x-0 pb-2 sm:pb-5">
      <div className="w-full mx-auto">
        <div className="px-3 py-2 rounded-lg bg-hero shadow-lg">
          <div className="flex items-center justify-between flex-wrap">
            <div className="w-0 flex-1 flex items-center">
              <span className="flex p-1 rounded-lg bg-indigo-800">
                <InformationCircleIcon className="h-5 w-5 text-white" aria-hidden="true" />
              </span>
              <p className="ml-3 text-white truncate">
                <span>{content}</span>
              </p>
            </div>
            <div className="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
              <button
                type="button"
                className="flex items-center justify-center w-full px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50 cursor-pointer"
                onClick={onClickExample}
              >
                Use example
              </button>
            </div>
            <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-2">
              <button
                type="button"
                className="-mr-1 flex p-1 rounded-md text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white"
                onClick={onClose}
              >
                <span className="sr-only">Dismiss</span>
                <XIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <span className="hidden">{refreshKey}</span>
    </div>
  );
}
