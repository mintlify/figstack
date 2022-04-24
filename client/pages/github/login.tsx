import Head from 'next/head';
import { useRouter } from 'next/router';
import axios from 'axios';
import { ENDPOINT, GITHUB_AUTH_URI } from 'api-helper/connection';
import LoadingGitHub from '@components/app/loading';

const GitHubLogin = () => {
  const router = useRouter();
  const { code, username } = router.query;

  if (code != null) {
    axios.post(`${ENDPOINT}/github/user`, {
      code,
    }).then((githubUserRes) => {
      const githubUser = githubUserRes.data;
      if (githubUser?.login != null) {
        const githubUsername = githubUser.login;
        window.localStorage.setItem('GitHubUsername', githubUsername);

        router.replace(GITHUB_AUTH_URI);
      }
    });
  } else if (username != null && typeof username === 'string') {
    window.localStorage.setItem('GitHubUsername', username);
    router.replace(GITHUB_AUTH_URI);
  }

  return (
    <>
      <Head>
        <title>Signing in to Figstack</title>
      </Head>
      <LoadingGitHub />
    </>
  );
};

export default GitHubLogin;
