import type { ReactElement } from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import axios from 'axios';
import toast from 'react-hot-toast';
import { PaperAirplaneIcon, XIcon } from '@heroicons/react/solid';
import CodeEditor from '@components/app/CodeEditor';
import Sidebar from '@components/app/Sidebar';
import Dropdown from '@components/app/Dropdown';
import { askFunction, explainLanguagesDropdown, INTRO_EXAMPLES } from '@components/app/constants';
import FunctionCard from '@components/app/FunctionCard';
import Badge from '@components/app/Badge';
import useCalledStatus from '@components/hooks/useCalledStatus';

const languages = explainLanguagesDropdown;

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

type ResponsesOutput = {
  question: string;
  answer: string;
}

export default function Ask() {
  const [selectedLanguage, setLanguage] = useState(languages[0]);
  const [code, setCode] = useState('');
  const [questionInput, setQuestionInput] = useState('');
  const [outputDisplay, setOutputDisplay] = useState<ResponsesOutput[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { calledStatus } = useCalledStatus();

  const { input, inputLanguage, output, outputLanguage } = router.query;

  useEffect(() => {
    if (input) {
      setCode(input as string);
    }
    if (inputLanguage) {
      setLanguage(inputLanguage as string);
    }
    if (outputLanguage && output) {
      setOutputDisplay([{
        question: outputLanguage as string,
        answer: output as string,
      }]);
    }

    router.replace(router.pathname);
  }, []);

  let isBadgeHidden = true;
  if (calledStatus?.ask === false) {
    isBadgeHidden = false;
  }

  const onExample = () => {
    setCode(INTRO_EXAMPLES.ask.code);
    setLanguage(INTRO_EXAMPLES.ask.language);
    setQuestionInput(INTRO_EXAMPLES.ask.question);
  };

  const onSubmit = async () => {
    if (!isSubmitting) {
      try {
        setIsSubmitting(true);
        // Only append the question
        const response = await axios.post('/api/function/ask', {
          code,
          question: questionInput,
          inputLanguage: selectedLanguage,
        });

        const { data } = response;

        if (data.error) {
          toast.error(data.error);
        } else {
          // Add answer to response
          setOutputDisplay([...outputDisplay, { question: questionInput, answer: data?.output }]);
        }

        setQuestionInput('');
        setIsSubmitting(false);
      } catch (error) {
        toast.error('An unexpected error ocurred. Please try again later');
      }
    } else {
      setIsSubmitting(false);
    }
  };

  const handleEnterKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      onSubmit();
    }
  };

  return (
    <>
      <Head>
        <title>Ask Question</title>
      </Head>
      <FunctionCard
        badge={<Badge name="ask" isHidden={isBadgeHidden} content="See how asking question works with an example" onClickExample={onExample} />}
        header={askFunction.name}
        icon={<askFunction.icon className={classNames(askFunction.primaryBackground, 'h-5 w-5')} aria-hidden="true" />}
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
            </div>
            <div className="h-full mt-4 sm:m-0">
              <div className="mb-3">
                <span className="block truncate text-gray-800 text-lg font-medium">Answers</span>
              </div>
              <div className="relative bg-white border border-gray-200 rounded-lg text-gray-700" style={{ minHeight: '12rem' }}>
                <div className="p-4 pb-12">
                  {
                    outputDisplay.map(({ question, answer }, i) => (
                      <div className="mb-2">
                        { i !== 0 && <div className="my-2 h-px w-full bg-gray-100" />}
                        <p className="whitespace-pre-line text-sm">
                          <span className="font-medium">Q:</span>
                          {' '}
                          {question}
                        </p>
                        <p className="mt-1 whitespace-pre-line text-sm font-medium">
                          A:
                          {' '}
                          {answer}
                        </p>
                      </div>
                    ))
                  }
                  {isSubmitting && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  </div>
                  )}
                </div>
                <div className="absolute w-full flex border-t border-gray-200 rounded-b-md bottom-0">
                  <input
                    type="text"
                    className="flex-1 rounded-bl-md py-1 px-4 focus:outline-none bg-gray-100"
                    placeholder="Enter your question here"
                    value={questionInput}
                    onChange={(e) => setQuestionInput(e.target.value)}
                    onKeyDown={handleEnterKeyDown}
                  />
                  <button
                    type="button"
                    className={classNames(
                      isSubmitting
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-primary hover:bg-primary-active text-white',
                      'flex items-center px-4 py-2 border border-transparent shadow-sm rounded-br-md duration-100',
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
                          Ask
                          <PaperAirplaneIcon className="ml-2 h-4 w-4" aria-hidden="true" />
                        </>
                      )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FunctionCard>
    </>
  );
}

Ask.getLayout = function getLayout(page: ReactElement) {
  return (
    <Sidebar>
      {page}
    </Sidebar>
  );
};
