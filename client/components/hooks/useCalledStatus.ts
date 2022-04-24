import axios from 'axios';
import { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import { ENDPOINT } from 'api-helper/connection';

type CalledStatus = {
  explain: boolean;
  ask: boolean;
  docstring: boolean;
  complexity: boolean;
  translate: boolean;
}

const useCalledStatus = () => {
  const [calledStatus, setCalledStatus] = useState<CalledStatus | null>(null);
  const [isLoadingCalledStatus, setIsLoadingCalledStatus] = useState(true);
  const { user } = useUser();

  const getUserInfo = async () => {
    if (user != null) {
      setIsLoadingCalledStatus(true);
      const calledStatusRes = await axios.post(`${ENDPOINT}/user/v1/calledStatus`, {
        email: user.email,
      });
      const calledStatusData = calledStatusRes.data as CalledStatus;
      setCalledStatus(calledStatusData);
      setIsLoadingCalledStatus(false);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, [user]);

  return { calledStatus, isLoadingCalledStatus };
};

export default useCalledStatus;
