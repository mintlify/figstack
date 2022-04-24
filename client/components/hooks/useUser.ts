import axios from 'axios';
import { useEffect, useState } from 'react';

type ChecklistItem = {
  // Contains either figFunction or link
  figFunction?: string;
  link?: string;
  intro: string;
  functionName: string;
  isChecked: boolean;
}

export type User = {
  email: string;
  isEmailVerified: boolean;
  name: string;
  profileImg: string;
  userId: string;
  accessToken: string;
  plan: {
    name: string;
    lastBilled: Date;
  };
  checklist: ChecklistItem[];
  usage?: {
    explain: boolean;
    ask: boolean;
    docstring: boolean;
    complexity: boolean;
    translate: boolean;
  }
}

type UserInfoResponse = {
  userInfo: User;
  newTokens: {
    accessToken: string;
    refreshToken: string;
  }
}

const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getUserInfo = async () => {
    try {
      setIsLoading(true);
      const userInfoRes = await axios.get('/api/user');
      const { userInfo } = userInfoRes.data as UserInfoResponse;
      setUser(userInfo);
      setIsLoading(false);
    } catch {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return { user, isLoading };
};

export default useUser;
