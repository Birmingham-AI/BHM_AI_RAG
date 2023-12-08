import weaviate from 'weaviate-ts-client';
import { config } from 'dotenv';
config();

const client = weaviate.client({
  scheme: 'https',
  host: process.env.WEAVIATE_URL,
  headers: { 'X-OpenAI-Api-Key': process.env.OPENAI_API_KEY },
});

export { client };
