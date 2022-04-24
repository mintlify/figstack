import type { ReactElement } from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ArrowRightIcon, XIcon } from '@heroicons/react/solid';
import CodeEditor from '@components/app/CodeEditor';
import Sidebar from '@components/app/Sidebar';
import Dropdown from '@components/app/Dropdown';
import { translateLanguagesDropdown, complexityFunction, INTRO_EXAMPLES } from '@components/app/constants';
import FunctionCard from '@components/app/FunctionCard';
import Feedback from '@components/app/Feedback';
import Badge from '@components/app/Badge';
import useCalledStatus from '@components/hooks/useCalledStatus';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

export default function Complexity() {
  const [selectedLanguage, setLanguage] = useState(translateLanguagesDropdown[0]);
  const [code, setCode] = useState('');
  const [outputDisplay, setOutputDisplay] = useState('');
  const [functionId, setFunctionId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { calledStatus } = useCalledStatus();

  const { input, inputLanguage, output } = router.query;

  useEffect(() => {
    if (input) {
      setCode(input as string);
    }
    if (inputLanguage) {
      setLanguage(inputLanguage as string);
    }
    if (output) {
      setOutputDisplay(output as string);
    }

    router.replace(router.pathname);
  }, []);

  let isBadgeHidden = true;
  if (calledStatus?.complexity === false) {
    isBadgeHidden = false;
  }

  const onExample = () => {
    setLanguage(INTRO_EXAMPLES.complexity.language);
    setCode(INTRO_EXAMPLES.complexity.code);
  };

  const onSubmit = async () => {
    if (!isSubmitting) {
      try {
        setIsSubmitting(true);
        setOutputDisplay('');
        setFunctionId('');
        const response = await axios.post('/api/function/complexity', {
          code,
          inputLanguage: selectedLanguage,
        });

        const { data } = response;

        if (data.error) {
          toast.error(data.error);
        }

        setOutputDisplay(data.output);
        setFunctionId(data.id || '');
        setIsSubmitting(false);
      } catch {
        toast.error('An unexpected error ocurred. Please try again later');
      }
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Time Complexity</title>
      </Head>
      <FunctionCard
        badge={<Badge name="complexity" isHidden={isBadgeHidden} content="See how time complexity works with an example" onClickExample={onExample} />}
        header={complexityFunction.name}
        icon={<complexityFunction.icon className={classNames(complexityFunction.primaryBackground, 'h-5 w-5')} aria-hidden="true" />}
      >
        <div>
          <div className="grid sm:grid-cols-2 sm:gap-4">
            <div className="h-full">
              <div className="mb-1">
                <Dropdown
                  options={translateLanguagesDropdown}
                  selectedOption={selectedLanguage}
                  setOption={setLanguage}
                  required
                />
              </div>
              <CodeEditor
                code={code}
                setCode={setCode}
                placeholder="Enter Code"
                language={selectedLanguage}
              />
              <button
                type="button"
                className={classNames(
                  isSubmitting
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-primary hover:bg-primary-active text-white',
                  'mt-4 flex items-center px-4 py-2 border border-transparent shadow-sm rounded-md duration-100',
                )}
                onClick={onSubmit}
              >
                {isSubmitting
                  ? (
                    <>
                      Cancel
                      <XIcon className="ml-2 h-4 w-4" aria-hidden="true" />
                    </>
                  )
                  : (
                    <>
                      Calculate
                      <ArrowRightIcon className="ml-2 h-4 w-4" aria-hidden="true" />
                    </>
                  )}
              </button>
            </div>
            <div className="h-48 mt-4">
              <div className="h-full sm:m-0 flex items-center justify-center">
                <div>
                  <div className="truncate text-gray-800 text-lg font-medium">
                    Time Complexity
                  </div>
                  <div className="mt-2 text-4xl text-center">
                    O(
                    <span className="mx-1 my-px rounded-md bg-gray-100">{outputDisplay}</span>
                    )
                  </div>
                </div>
              </div>
              <Feedback functionId={functionId} />
            </div>
          </div>
        </div>
      </FunctionCard>
    </>
  );
}

Complexity.getLayout = function getLayout(page: ReactElement) {
  return (
    <Sidebar>
      {page}
    </Sidebar>
  );
};
