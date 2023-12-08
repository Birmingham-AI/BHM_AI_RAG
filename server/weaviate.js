import weaviate from 'weaviate-ts-client';

const client = weaviate.client({
  scheme: 'http',
  host: process.env.WEAVIATE_URL,
  headers: { 'X-OpenAI-Api-Key': process.env.OPENAI_API_KEY },
});

export { client };
