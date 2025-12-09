import { Pinnacle } from 'rcs-js';
import dotenv from 'dotenv';

dotenv.config();

const PINNACLE_API_KEY = process.env.PINNACLE_API_KEY;

if (!PINNACLE_API_KEY) {
  throw new Error('PINNACLE_API_KEY environment variable is required');
}

export const rcsClient = new Pinnacle({
  apiKey: PINNACLE_API_KEY,
});
