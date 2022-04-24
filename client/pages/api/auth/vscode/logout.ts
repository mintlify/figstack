import { NextApiRequest, NextApiResponse } from 'next';

const vscodeLogout = (async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    res.redirect('vscode://figstack.vsc/logout');
  } catch (error: any) {
    res.send(error.response.data);
  }
});

export default vscodeLogout;
