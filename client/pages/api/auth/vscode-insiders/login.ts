import axios from 'axios';
import { ENDPOINT } from 'api-helper/connection';
import { NextApiRequest, NextApiResponse } from 'next';

const vscodeInsidersLogin = (async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { code } = req.query;
    const refreshTokenRes = await axios.post(`${ENDPOINT}/vscode/code`, { code });
    const { refreshToken, accessToken } = refreshTokenRes.data;
    res.redirect(`vscode-insiders://figstack.vsc/callback?refreshToken=${refreshToken}&accessToken=${accessToken}`);
  } catch (error: any) {
    res.send(error.response.data);
  }
});

export default vscodeInsidersLogin;
