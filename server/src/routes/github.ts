import dotenv from 'dotenv';
import express from 'express';
import axios from 'axios';
import { loginOrCreateUser } from './user';

dotenv.config();

// Initializations
const githubRouter = express.Router();

githubRouter.post('/user', async (req, res) => {
  // Code is for GitHub
  const { code } = req.body;

  try {
    const tokensResponse = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: process.env.GITHUB_APP_ID,
      client_secret: process.env.GITHUB_APP_SECRET,
      code,
    });

    const tokens = tokensResponse.data;
    if (tokens == null) {
      return res.send(null);
    }

    const tokenParams = new URLSearchParams(tokens);
    const accessToken = tokenParams.get('access_token');

    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `token ${accessToken}`
      }
    });

    return res.send(userResponse.data);

  } catch (error) {
    res.status(500).send(error);
  }
})

githubRouter.post('/connect', async (req, res) => {
  const { token, githubUsername } = req.body;

  try {
    if (token == null || githubUsername == null) throw 'Access token or github username not provided';
    await loginOrCreateUser(token, githubUsername);
    res.send({ success: true });
  } catch (error: any) {
    res.status(500).send(error.response.data);
  }
})

export default githubRouter;
