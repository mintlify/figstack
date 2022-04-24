import { useEffect, useState } from 'react';
import axios from 'axios';
import { ThumbUpIcon as ThumbUpIconSolid, ThumbDownIcon as ThumbDownIconSolid } from '@heroicons/react/solid';
import { ThumbUpIcon, ThumbDownIcon } from '@heroicons/react/outline';

type FeedbackProps = {
  functionId: string;
}

export default function Feedback({ functionId }: FeedbackProps) {
  const [isPositiveFeedback, setIsPositiveFeedback] = useState<boolean | null>(null);

  useEffect(() => {
    setIsPositiveFeedback(null);
  }, [functionId]);

  if (!functionId) return null;

  const onFeedback = (isPositive: boolean) => {
    if (functionId) {
      axios.post('/api/function/feedback', {
        id: functionId,
        isPositive,
      });
      setIsPositiveFeedback(isPositive);
    }
  };

  return (
    <div className="mt-2 w-full flex flex-col items-center">
      <div className="text-gray-600 text-sm">
        Was the result useful?
      </div>
      <div className="mt-2 flex space-x-1">
        {
            isPositiveFeedback === true
              ? <ThumbUpIconSolid className="h-5 w-5 text-green-600" />
              : (
                <button type="button" onClick={() => onFeedback(true)}>
                  <ThumbUpIcon className="h-5 w-5 text-gray-500 hover:text-green-600" />
                </button>
              )
          }
        {
            isPositiveFeedback === false
              ? <ThumbDownIconSolid className="h-5 w-5 text-red-600" />
              : (
                <button type="button" onClick={() => onFeedback(false)}>
                  <ThumbDownIcon className="h-5 w-5 text-gray-500 hover:text-red-600" />
                </button>
              )
          }
      </div>
    </div>
  );
}
