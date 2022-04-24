import axios from 'axios';
import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { ENDPOINT } from 'api-helper/connection';

export default withApiAuthRequired(async (req, res) => {
  try {
    const { accessToken } = await getAccessToken(req, res);
    const response = await axios.post(`${ENDPOINT}/user/v1/usage`, {
      accessToken,
    });
    res.send(response.data);
  } catch (error: any) {
    res.status(error.status || 500).end(error.message);
  }
});
