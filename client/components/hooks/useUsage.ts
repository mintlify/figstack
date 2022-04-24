import axios from 'axios';
import { useEffect, useState } from 'react';

type Usage = {
  figsUsed: number;
  figsBudget: number;
}

const useUsage = () => {
  const [usage, setUsage] = useState<Usage | null>(null);
  const [isLoadingUsage, setIsLoadingUsage] = useState(true);

  const getUserInfo = async () => {
    setIsLoadingUsage(true);
    const usageInfoRes = await axios.get('/api/usage');
    const usageInfo = usageInfoRes.data as Usage;
    setUsage(usageInfo);
    setIsLoadingUsage(false);
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return { usage, isLoadingUsage };
};

export default useUsage;
