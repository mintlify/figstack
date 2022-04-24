export const IS_DEV = process.env.NODE_ENV === 'development';

export const DEV_ENDPOINT: string = 'http://localhost:5000';
export const PROD_ENDPOINT: string = 'https://api.figstack.com';
export const ENDPOINT = IS_DEV ? DEV_ENDPOINT : PROD_ENDPOINT;

// For GitHub Auth0 Instance
const AUTH0_GITHUB_DEV = {
  uri: 'https://dev-uxa1yxhj.us.auth0.com',
  clientId: 'PFwOGCe645FGv4mkskyGiqBINJoODu5z',
  redirectUri: 'http://localhost:3000/github/callback',
};

const AUTH0_GITHUB_PROD = {
  uri: 'https://figstack.us.auth0.com',
  clientId: 'J0OhkOUXE5wHmppxnMEnH7SB3XLH9e8M',
  redirectUri: 'https://figstack.com/github/callback',
};
const GITHUB_SCOPE = 'openid profile email';
const AUTH0_GITHUB = IS_DEV ? AUTH0_GITHUB_DEV : AUTH0_GITHUB_PROD;

export const GITHUB_AUTH_URI = `${AUTH0_GITHUB.uri}/authorize?response_type=token&client_id=${AUTH0_GITHUB.clientId}&redirect_uri=${AUTH0_GITHUB.redirectUri}&scope=${GITHUB_SCOPE}`;
