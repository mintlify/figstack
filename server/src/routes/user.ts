import dotenv from 'dotenv';
import express from 'express';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import analytics from '../analytics';
import { FigFunction } from './function';
import User from '../models/User';
import Fig from '../models/Fig';

// Default types
type Plan = 'free' | 'starter' | 'unlimited';

type NewTokens = {
  accessToken: string;
  refreshToken: string;
}

type ChecklistItem = {
  // Contains either figFunction or link
  figFunction?: FigFunction;
  link?: string;
  intro: string;
  functionName: string;
  isChecked: boolean;
}

type UserInfo = {
  email: string;
  profileImg: string;
  plan: {
    name: string;
    lastBilled: Date;
  }
  userId: string;
  createdAt: Date;
  lastLogInAt: Date;
  checklist?: ChecklistItem[];
}

type FromToken = {
  userInfo: UserInfo,
  newTokens?: NewTokens | undefined
}

type UsageInfo = {
  figsUsed: number;
  figsBudget: number | null;
}

type AuthInfo = {
  email: string;
  name: string;
  email_verified: string;
  picture: string;
  given_name: string;
  family_name: string;
}

// Default config
dotenv.config();

// Not using at the moment
const plansQuota = {
  free: 30,
  starter: 150,
  unlimited: null
};

// Initializations
const userRouter = express.Router();

export const getAuthInfoFromToken = async (accessToken: string): Promise<AuthInfo> => {
  const authInfoRes = await axios.get(`${process.env.AUTH0_ISSUER_BASE_URL}/userinfo`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  return authInfoRes.data;
}

// Note: Refresh tokens are passed from VSCode auth instance
const getNewTokensFromVSCRefreshToken = async (currentRefreshToken: string): Promise<NewTokens> => {
  try {
    const accessTokenRes = await axios.post(`${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`, {
      grant_type: 'refresh_token',
      client_id: process.env.AUTH0_VSC_CLIENT_ID,
      client_secret: process.env.AUTH0_VSC_CLIENT_SECRET,
      refresh_token: currentRefreshToken
    });
  
    const accessToken = accessTokenRes.data.access_token;
    const refreshToken = accessTokenRes.data.refresh_token;
    return { accessToken, refreshToken };
  } catch (err) {
    throw 'Unable to authenticate using refresh tokens';
  }
}

const getUserInfo = async (accessToken: string): Promise<UserInfo> => {
  const authInfo = await getAuthInfoFromToken(accessToken);
  const userInfo = await User.findOne({ email: authInfo.email });

  if (userInfo == null) throw 'Invalid access token';

  return userInfo;
}

export const getUserInfoFromToken = async (accessToken: string | null, refreshToken?: string | null): Promise<FromToken> => {
  if (accessToken == null) {
    throw 'Unauthorized access. No tokens provided';
  }
  try {
    const userInfo = await getUserInfo(accessToken);
    return { userInfo };
  } catch {
    if (refreshToken) {
      const newTokens = await getNewTokensFromVSCRefreshToken(refreshToken);
      const userInfo = await getUserInfo(newTokens.accessToken);
      return {
        userInfo,
        newTokens
      };
    }

    throw 'Invalid tokens';
  }
}

const getUserInfoWithChecklistFromToken = async (accessToken: string): Promise<FromToken> => {
  const authInfo = await getAuthInfoFromToken(accessToken);
  const userInfo = await User.aggregate([
    { $match: { email: authInfo.email } },
    { $lookup: { from: 'figs', localField: 'email', foreignField: 'email', as: 'logs' } },
    {
      $addFields: {
        checklist: [
          {
            figFunction: 'explain',
            intro: 'Have code explained with',
            functionName: 'Explain Code',
            isChecked: { '$in': ['explain', '$logs.figFunction'] }
          },
          {
            figFunction: 'ask',
            intro: 'Get answers to your questions with',
            functionName: 'Ask Question',
            isChecked: { '$in': ['ask', '$logs.figFunction'] }
          },
          {
            figFunction: 'docstring',
            intro: 'Document a function with',
            functionName: 'Docstring Writer',
            isChecked: { '$in': ['docstring', '$logs.figFunction'] }
          },
          {
            figFunction: 'complexity',
            intro: 'Calculate efficiency with',
            functionName: 'Time Complexity',
            isChecked: { '$in': ['complexity', '$logs.figFunction'] }
          },
          {
            link: 'https://marketplace.visualstudio.com/items?itemName=figstack.vsc',
            intro: 'Install the',
            functionName: 'Figstack VSCode Extension',
            isChecked: { '$in': ['vscode', '$logs.source'] }
          }
        ],
      }
    },
    { $project: {
      logs: 0
    } }
  ]) as UserInfo[];

  if (userInfo == null || userInfo.length === 0) throw 'Invalid access token';

  return { userInfo: userInfo[0] };
}

const getCalledStatusFromEmail = async (email: string) => {
  const callStatus = await User.aggregate([
    { $match: { email } },
    { $lookup: { from: 'figs', localField: 'email', foreignField: 'email', as: 'logs' } },
    { $addFields: {
      explain: { '$in': ['explain', '$logs.figFunction'] },
      ask: { '$in': ['ask', '$logs.figFunction'] },
      docstring: { '$in': ['docstring', '$logs.figFunction'] },
      complexity: { '$in': ['complexity', '$logs.figFunction'] },
      translate: { '$in': ['translate', '$logs.figFunction'] },
    },
    },
    { $project: {
      explain: true,
      ask: true,
      docstring: true,
      complexity: true,
      translate: true,
    },
    },
  ])

  if (callStatus?.length === 0) throw 'Invalid email';

  return callStatus[0];
}

export const getUserInfoFromGitHubUsername = async (githubUsername: string): Promise<UserInfo> => {
  const userInfo = await User.findOne({ githubUsername });

  if (userInfo == null) throw 'Invalid GitHub username';

  return userInfo;
}

const getUsage = async (email: string): Promise<UsageInfo> => {
  const userInfo = await User.findOne({ email });
  const lastBilledAt: Date = userInfo.plan.lastBilled;

  const currentTimestamp = new Date().getTime();
  const oneMonthAgo = currentTimestamp - 1000 * 60 * 60 * 24 * 30;

  const isLastBilledAtBefore = lastBilledAt.getTime() < oneMonthAgo;
  const referenceTime = isLastBilledAtBefore ? new Date().setTime(oneMonthAgo) : lastBilledAt;
  const figsAfterReference = await Fig.find({
    email,
    timestamp: { $gte: referenceTime },
  });

  const currentPlanName = userInfo.plan.name as Plan;

  return {
    figsUsed: figsAfterReference.length,
    figsBudget: plansQuota[currentPlanName]
  }
}

export const doesExceedQuota = async (email: string): Promise<boolean> => {
  const usageInfo = await getUsage(email);
  if (usageInfo.figsBudget == null) return false;

  // return usageInfo.figsUsed >= usageInfo.figsBudget;
  return false;
}

type UpdateQuery = {
  lastLogInAt: Date;
  githubUsername?: string;
}

export const loginOrCreateUser = async (accessToken: string, githubUsername?: string): Promise<void> => {
  const authInfo = await getAuthInfoFromToken(accessToken);
  const { email, name, email_verified, picture, given_name, family_name } = authInfo;

  const updateQuery: UpdateQuery = {
    lastLogInAt: new Date(),
  };

  if (githubUsername) {
    updateQuery.githubUsername = githubUsername;
  }

  const existingUser = await User.findOneAndUpdate({ email }, updateQuery);

  const doesUserExist = existingUser != null;

  let newUserId;

  if (!doesUserExist) {
    newUserId = uuidv4();
    const userTraits = {
      email,
      isEmailVerified: email_verified,
      name,
      firstName: given_name,
      lastName: family_name,
      profileImg: picture,
      // Free plan by default
      plan: {
        name: 'free',
        lastBilled: new Date(),
      },
      githubUsername
    }
    const newUser = new User({
      userId: newUserId,
      ...userTraits
    });
    await newUser.save();

    try {
      analytics.identify({
        userId: newUserId,
        traits: userTraits
      });
      
    } catch (err) {
      console.log('User also exists on Segment');
    }
  }

  analytics.track({
    userId: doesUserExist ? existingUser.userId : newUserId,
    event: 'Login',
  });
}

userRouter.post('/login', async (req, res) => {
  const { accessToken } = req.body;
  await loginOrCreateUser(accessToken);
  return res.end();
});

userRouter.post('/v1/profile', async (req, res) => {
  const { accessToken } = req.body;
  const userInfo = await getUserInfoWithChecklistFromToken(accessToken);
  return res.send(userInfo);
});

userRouter.post('/v1/calledStatus', async (req, res) => {
  const { email } = req.body;
  const calledStatus = await getCalledStatusFromEmail(email);
  return res.send(calledStatus);
})

// Currently not used
userRouter.post('/v1/usage', async (req, res) => {
  const { accessToken } = req.body;
  const authInfo = await getAuthInfoFromToken(accessToken);
  const email = authInfo.email;
  const usageInfo = await getUsage(email);
  return res.send(usageInfo);
});

userRouter.post('/v1/history', async (req, res) => {
  const { accessToken } = req.body;
  const authInfo = await getAuthInfoFromToken(accessToken);

  const historyLogs = await Fig.aggregate([
    { $match: { email: authInfo.email } },
    { $sort: { timestamp: -1 } },
    { $project: {
      _id: false,
      email: false,
    } }
  ]);

  res.send(historyLogs);

})

userRouter.put('/v1/name', async (req, res) => {
  const { accessToken, name } = req.body;
  const authInfo = await getAuthInfoFromToken(accessToken);
  const userInfo = await User.findOneAndUpdate({ email: authInfo.email }, { name });
  analytics.identify({
    userId: userInfo.userId,
    traits: {
      name
    },
  });
  return res.send({success: true})
})

export default userRouter;
