import axios from 'axios';
import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { ENDPOINT } from 'api-helper/connection';
import type { User } from '@components/hooks/useUser';

export default withApiAuthRequired(async (req, res) => {
  try {
    const { accessToken } = await getAccessToken(req, res);
    const response: { data: User } = await axios.post(`${ENDPOINT}/user/v1/profile`, {
      accessToken,
    });

    const userInfoWithAccessToken = { ...response.data, accessToken };
    res.send(userInfoWithAccessToken);
  } catch (error: any) {
    res.status(error.status || 500).end(error.message);
  }
});
