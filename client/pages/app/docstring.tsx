import type { ReactElement } from 'react';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { ArrowRightIcon, XIcon, LightBulbIcon } from '@heroicons/react/solid';
import CodeEditor from '@components/app/CodeEditor';
import Output from '@components/app/Output';
import Sidebar from '@components/app/Sidebar';
import Dropdown from '@components/app/Dropdown';
import { docstringFunction, translateLanguagesDropdown, INTRO_EXAMPLES } from '@components/app/constants';
import FunctionCard from '@components/app/FunctionCard';
import Badge from '@components/app/Badge';
import useCalledStatus from '@components/hooks/useCalledStatus';

const outputs = ['English'];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

export default function Explain() {
  const [selectedLanguage, setLanguage] = useState(translateLanguagesDropdown[0]);
  const [selectedOutputLanguage, setOutputLanguage] = useState(outputs[0]);
  const [code, setCode] = useState('');
  const [outputDisplay, setOutputDisplay] = useState('');
  const [functionId, setFunctionId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { calledStatus } = useCalledStatus();

  const {
    input, inputLanguage, output,
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

    router.replace(router.pathname);
  }, []);

  let isBadgeHidden = true;
  if (calledStatus?.docstring === false) {
    isBadgeHidden = false;
  }

  const onExample = () => {
    setLanguage(INTRO_EXAMPLES.docstring.language);
    setCode(INTRO_EXAMPLES.docstring.code);
  };

  const onSubmit = async () => {
    if (!isSubmitting) {
      try {
        setIsSubmitting(true);
        setOutputDisplay('');
        setFunctionId('');
        const response = await axios.post('/api/function/docstring', {
          code,
          inputLanguage: selectedLanguage,
        });

        const { data } = response;

        if (data.error) {
          toast.error(data.error);
        }

        setOutputDisplay(data?.output || '');
        setFunctionId(data?.id || '');
        setIsSubmitting(false);
      } catch {
        toast.error('An unexpected error ocurred. Please try again later');
      }
    } else {
      setIsSubmitting(false);
    }
  };

  const DocStringBadge = (
    <>
      <Badge name="docstring" isHidden={isBadgeHidden} content="See how docstring works with an example" onClickExample={onExample} />
      <div className="inset-x-0 pb-2 sm:pb-5">
        <div className="w-full mx-auto">
          <div className="px-3 py-2 rounded-lg bg-yellow-100 border-2 border-yellow-200 shadow-ls">
            <div className="flex items-center justify-between flex-wrap">
              <div className="w-0 flex-1 flex items-center">
                <span className="flex p-1 rounded-lg bg-yellow-400">
                  <LightBulbIcon className="h-5 w-5 text-white" aria-hidden="true" />
                </span>
                <p className="ml-3 text-gray-700 truncate text-sm">
                  <span>
                    Generate Documentation using AI in VS Code.
                    {' '}
                    <a
                      href="https://marketplace.visualstudio.com/items?itemName=mintlify.document"
                      className="font-medium"
                    >
                      Install here

                    </a>
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <Head>
        <title>Docstring</title>
      </Head>
      <FunctionCard
        badge={DocStringBadge}
        header={docstringFunction.name}
        icon={<docstringFunction.icon className={classNames(docstringFunction.primaryBackground, 'h-5 w-5')} aria-hidden="true" />}
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
                      Write
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
