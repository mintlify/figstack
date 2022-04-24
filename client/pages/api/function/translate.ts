import axios from 'axios';
import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { ENDPOINT } from 'api-helper/connection';
import { removeDefaultDropdown } from '@components/app/constants';

export default withApiAuthRequired(async (req, res) => {
  try {
    const {
      code, inputLanguage, outputLanguage,
    } = req.body;
    const { accessToken } = await getAccessToken(req, res);
    const response = await axios.post(`${ENDPOINT}/function/v1/translate`, {
      code,
      inputLanguage: removeDefaultDropdown(inputLanguage),
      outputLanguage: removeDefaultDropdown(outputLanguage),
      accessToken,
      source: 'web',
    });
    res.send(response.data);
  } catch (error: any) {
    res.send(error.response.data);
  }
});
