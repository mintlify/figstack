import axios from 'axios';
import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { ENDPOINT } from 'api-helper/connection';

export default withApiAuthRequired(async (req, res) => {
  try {
    const { id, isPositive } = req.body;
    const { accessToken } = await getAccessToken(req, res);
    const response = await axios.put(`${ENDPOINT}/function/feedback/${id}`, {
      accessToken,
      isPositive,
      source: 'web',
    });
    res.send(response.data);
  } catch (error: any) {
    res.send(error.response.data);
  }
});
