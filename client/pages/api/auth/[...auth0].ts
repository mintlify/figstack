import axios from 'axios';
import {
  handleAuth, handleCallback, handleLogin, Session,
} from '@auth0/nextjs-auth0';
import { NextApiResponse, NextApiRequest } from 'next';
import { ENDPOINT } from 'api-helper/connection';

const afterCallback = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  const { accessToken } = session;
  await axios.post(`${ENDPOINT}/user/login`, { accessToken });
  return session;
};

export default handleAuth({
  async login(req, res) {
    await handleLogin(req, res, {
      returnTo: '/app',
    });
  },
  async callback(req, res) {
    try {
      await handleCallback(req, res, { afterCallback });
    } catch (error: any) {
      res.status(error.status || 500).end(error.message);
    }
  },
});
