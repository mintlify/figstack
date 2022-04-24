import dotenv from 'dotenv';
dotenv.config();

export const DEV_FRONTEND = 'http://localhost:3000';
export const PROD_FRONTEND = 'https://figstack.com';
export const ENDPOINT_FRONTEND: string = process.env.NODE_ENV === 'development' ? DEV_FRONTEND : PROD_FRONTEND;

export const OPENAI_AUTHORIZATION = {
  headers: {
    Authorization: `Bearer ${process.env.OPENAI_TOKEN}`
  }
}
