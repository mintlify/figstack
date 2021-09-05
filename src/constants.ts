import * as dotenv from 'dotenv';
dotenv.config();

const IS_DEV = false;
export const FRONTEND_ENDPOINT = IS_DEV ? 'http://localhost:3000' : 'https://figstack.com';
export const BACKEND_ENDPOINT = IS_DEV ? 'http://localhost:5000' : 'https://api.figstack.com';

// URL config for authentication
const auth0Domain = IS_DEV ? 'https://dev-uxa1yxhj.us.auth0.com' : 'https://figstack.us.auth0.com';
const responseType = 'code';
const clientId = IS_DEV ? 'nv8BC1pmSBIw2HMNRqsd8Bkl5xwc1ipN' : 'zyVI6tCd7UQ44NCkqlx3TsulhrLtMYzm';
const redirectUri = `${FRONTEND_ENDPOINT}/api/auth/vscode/login`;
const scope = 'openid profile email offline_access';
export const loginURL = `${auth0Domain}/authorize?response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;

const returnToUri = `${FRONTEND_ENDPOINT}/api/auth/vscode/logout`;
export const logoutURL = `${auth0Domain}/v2/logout?client_id=${clientId}&returnTo=${returnToUri}`;
