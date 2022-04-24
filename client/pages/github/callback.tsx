import Head from 'next/head';
import { useRouter } from 'next/router';
import axios from 'axios';
import { ENDPOINT } from 'api-helper/connection';
import LoadingGitHub from '@components/app/loading';

const getStringBetween = (phrase: string, front: string, back: string): string => {
  const indexOfFront = phrase.indexOf(front) + front.length;
  return phrase.substring(
    indexOfFront,
    phrase.indexOf(back, indexOfFront),
  );
};

const GitHubCallback = () => {
  const router = useRouter();

  if (typeof window !== 'undefined') {
    const fullURL = window.location.href;
    const token = getStringBetween(fullURL, 'access_token=', '&');
    const githubUsername = window.localStorage.getItem('GitHubUsername');
    if (token != null && githubUsername != null) {
      // Connect user with github username
      axios.post(`${ENDPOINT}/github/connect`, {
        token,
        githubUsername,
      }).then(() => {
        window.localStorage.removeItem('GitHubUsername');
        router.replace('https://github.com');
      }).catch(() => {
        router.replace('/');
      });
    }
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

export default GitHubCallback;
