import { NextApiRequest, NextApiResponse } from 'next';

const vscodeInsidersLogout = (async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    res.redirect('vscode-insiders://figstack.vsc/logout');
  } catch (error: any) {
    res.send(error.response.data);
  }
});

export default vscodeInsidersLogout;
