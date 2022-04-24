import type { ReactElement } from 'react';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { ArrowRightIcon, XIcon } from '@heroicons/react/solid';
import CodeEditor from '@components/app/CodeEditor';
import Sidebar from '@components/app/Sidebar';
import Dropdown from '@components/app/Dropdown';
import { translateFunction, translateLanguagesDropdown, INTRO_EXAMPLES } from '@components/app/constants';
import FunctionCard from '@components/app/FunctionCard';
import Feedback from '@components/app/Feedback';
import Badge from '@components/app/Badge';
import useCalledStatus from '@components/hooks/useCalledStatus';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

export default function Translate() {
  const [selectedInputLanguage, setInputLanguage] = useState(translateLanguagesDropdown[0]);
  const [selectedOutputLanguage, setOutputLanguage] = useState(translateLanguagesDropdown[0]);
  const [code, setCode] = useState('');
  const [outputCode, setOutputCode] = useState('');
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
      setInputLanguage(inputLanguage as string);
    }
    if (output) {
      setOutputCode(output as string);
    }
    if (outputLanguage) {
      setOutputLanguage(outputLanguage as string);
    }

    router.replace(router.pathname);
  }, []);

  let isBadgeHidden = true;
  if (calledStatus?.docstring === false) {
    isBadgeHidden = false;
  }

  const onExample = () => {
    setInputLanguage(INTRO_EXAMPLES.translate.language);
    setCode(INTRO_EXAMPLES.translate.code);
  };

  const onSubmit = async () => {
    if (!isSubmitting) {
      try {
        setIsSubmitting(true);
        setOutputCode('');
        setFunctionId('');
        const response = await axios.post('/api/function/translate', {
          code,
          inputLanguage: selectedInputLanguage,
          outputLanguage: selectedOutputLanguage,
        });

        const { data } = response;

        if (data.error) {
          toast.error(data.error);
        }

        setOutputCode(data?.output || '');
        setFunctionId(data?.id || '');
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
        <title>Language Translator</title>
      </Head>
      <FunctionCard
        badge={<Badge name="translate" isHidden={isBadgeHidden} content="See how translator works with an example" onClickExample={onExample} />}
        header={translateFunction.name}
        icon={<translateFunction.icon className={classNames(translateFunction.primaryBackground, 'h-5 w-5')} aria-hidden="true" />}
      >
        <div>
          <div className="grid sm:grid-cols-2 sm:gap-4">
            <div className="h-full">
              <div className="mb-1">
                <Dropdown
                  options={translateLanguagesDropdown}
                  selectedOption={selectedInputLanguage}
                  setOption={setInputLanguage}
                  required
                />
              </div>
              <CodeEditor
                code={code}
                setCode={setCode}
                placeholder="Enter Code"
                language={selectedInputLanguage}
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
                      Translate
                      <ArrowRightIcon className="ml-2 h-4 w-4" aria-hidden="true" />
                    </>
                  )}
              </button>
            </div>
            <div className="h-full mt-4 sm:m-0">
              <div className="mb-1">
                <Dropdown
                  options={translateLanguagesDropdown}
                  selectedOption={selectedOutputLanguage}
                  setOption={setOutputLanguage}
                  required
                />
              </div>
              <CodeEditor
                code={outputCode}
                setCode={() => {}}
                placeholder="Output"
                language={selectedOutputLanguage}
                disabled
              />
              <Feedback functionId={functionId} />
            </div>
          </div>
        </div>
      </FunctionCard>
    </>
  );
}

Translate.getLayout = function getLayout(page: ReactElement) {
  return (
    <Sidebar>
      {page}
    </Sidebar>
  );
};
