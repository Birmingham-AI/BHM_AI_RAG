import { config } from 'dotenv';
config();

// hit the vectorizer endpoint with the categories and pages tables
async function vectorize() {
  // Wait patiently for everything to start up
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 10000);
  });

  // vectorize the agents
  const agentRequest = await fetch(`http://${process.env.SERVER_BASE_URL}/vectorize/agents`);
  const agentData = await agentRequest.json();

  // vectorize the houses
  const houseRequest = await fetch(`http://${process.env.SERVER_BASE_URL}/vectorize/houses`);
  const houseData = await houseRequest.json();

  // vectorize the clients
  const clientRequest = await fetch(`http://${process.env.SERVER_BASE_URL}/vectorize/clients`);
  const clientData = await clientRequest.json();
}

const vectorizeResults = await vectorize();
