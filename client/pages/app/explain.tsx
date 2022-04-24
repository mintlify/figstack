import type { ReactElement } from 'react';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { ArrowRightIcon, XIcon } from '@heroicons/react/solid';
import CodeEditor from '@components/app/CodeEditor';
import Output from '@components/app/Output';
import Sidebar from '@components/app/Sidebar';
import Dropdown from '@components/app/Dropdown';
import { explainFunction, explainLanguagesDropdown, INTRO_EXAMPLES } from '@components/app/constants';
import FunctionCard from '@components/app/FunctionCard';
import Badge from '@components/app/Badge';
import useCalledStatus from '@components/hooks/useCalledStatus';

const languages = explainLanguagesDropdown;
const outputs = ['English'];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

export default function Explain() {
  const [selectedLanguage, setLanguage] = useState(languages[0]);
  const [selectedOutputLanguage, setOutputLanguage] = useState(outputs[0]);
  const [code, setCode] = useState('');
  const [outputDisplay, setOutputDisplay] = useState('');
  const [functionId, setFunctionId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { calledStatus } = useCalledStatus();

  const {
    input, inputLanguage, output, outputLanguage,
  } = router.query;

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
    if (outputLanguage) {
      setOutputLanguage(outputLanguage as string);
    }

    router.replace(router.pathname);
  }, []);

  // Check if badge should be displayed
  let isBadgeHidden = true;
  if (calledStatus?.explain === false) {
    isBadgeHidden = false;
  }

  const onExample = () => {
    setLanguage(INTRO_EXAMPLES.explain.language);
    setCode(INTRO_EXAMPLES.explain.code);
  };

  const onSubmit = async () => {
    if (!isSubmitting) {
      try {
        setIsSubmitting(true);
        setOutputDisplay('');
        setFunctionId('');
        const response = await axios.post('/api/function/explain', {
          code,
          inputLanguage: selectedLanguage,
          outputLanguage: selectedOutputLanguage,
        });

        const { data } = response;

        if (data.error) {
          toast.error(data.error);
        }

        setOutputDisplay(data?.output || '');
        setFunctionId(data?.id || '');
        setIsSubmitting(false);
      } catch (error) {
        toast.error('An unexpected error ocurred. Please try again later');
      }
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Explain Code</title>
      </Head>
      <FunctionCard
        badge={<Badge name="explain" isHidden={isBadgeHidden} content="See how explain works with an example" onClickExample={onExample} />}
        header={explainFunction.name}
        icon={<explainFunction.icon className={classNames(explainFunction.primaryBackground, 'h-5 w-5')} aria-hidden="true" />}
      >
        <div>
          <div className="grid sm:grid-cols-2 sm:gap-4">
            <div className="h-full">
              <div className="mb-1">
                <Dropdown
                  options={languages}
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
                      Explain
                      <ArrowRightIcon className="ml-2 h-4 w-4" aria-hidden="true" />
                    </>
                  )}
              </button>
            </div>
            <div className="h-full mt-4 sm:m-0">
              <div className="mb-1">
                <Dropdown
                  options={outputs}
                  selectedOption={selectedOutputLanguage}
                  setOption={setOutputLanguage}
                />
              </div>
              <Output
                output={outputDisplay}
                isLoading={isSubmitting}
                functionId={functionId}
              />
            </div>
          </div>
        </div>
      </FunctionCard>
    </>
  );
}

Explain.getLayout = function getLayout(page: ReactElement) {
  return (
    <Sidebar>
      {page}
    </Sidebar>
  );
};
