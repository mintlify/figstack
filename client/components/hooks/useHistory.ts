import axios from 'axios';
import { useEffect, useState } from 'react';

export type FigLog = {
  id: string;
  figFunction: string;
  input: string;
  inputLanguage: string;
  output: string;
  outputLanguage: string;
  timestamp: Date;
}

const useHistory = () => {
  const [history, setHistory] = useState<FigLog[] | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  const getHistoryInfo = async () => {
    setIsLoadingHistory(true);
    const getHistoryRes = await axios.get('/api/history');
    const historyInfo = getHistoryRes.data as FigLog[];
    setHistory(historyInfo);
    setIsLoadingHistory(false);
  };

  useEffect(() => {
    getHistoryInfo();
  }, []);

  return { history, isLoadingHistory };
};

export default useHistory;
