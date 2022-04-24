import dotenv from 'dotenv';
import express from 'express';
import axios from 'axios';
import { ENDPOINT_FRONTEND } from '../constants/connection';
import { loginOrCreateUser } from './user';

dotenv.config();

// Initializations
const vscodeRouter = express.Router();

vscodeRouter.post('/code', async (req, res) => {
  const { code } = req.body;
  const tokenRes = await axios.post(`${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`,
    {
      grant_type: 'authorization_code',
      client_id: process.env.AUTH0_VSC_CLIENT_ID,
      client_secret: process.env.AUTH0_VSC_CLIENT_SECRET,
      redirect_uri: `${ENDPOINT_FRONTEND}/api/auth/vscode/login`,
      code,
    });

  const { refresh_token, access_token } = tokenRes.data;

  await loginOrCreateUser(access_token);
  res.send({
    refreshToken: refresh_token,
    accessToken: access_token
  });
})

export default vscodeRouter;
