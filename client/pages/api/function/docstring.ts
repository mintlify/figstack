import axios from 'axios';
import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { removeDefaultDropdown } from '@components/app/constants';
import { ENDPOINT } from 'api-helper/connection';

export default withApiAuthRequired(async (req, res) => {
  try {
    const { code, inputLanguage } = req.body;
    const { accessToken } = await getAccessToken(req, res);
    const response = await axios.post(`${ENDPOINT}/function/v2/docstring`, {
      code,
      inputLanguage: removeDefaultDropdown(inputLanguage),
      accessToken,
      source: 'web',
    });
    res.send(response.data);
  } catch (error: any) {
    res.send(error.response.data);
  }
});
