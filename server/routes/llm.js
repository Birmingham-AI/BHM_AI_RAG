import { capitalize, LLMQuery } from '../utilities/weaviateHelpers.js';

const setupLLMRoute = (wsApp) => {
  wsApp.ws('/llm', async (ws, request) => {
    ws.on('message', (message) => {
      // Parse incoming message as JSON
      try {
        const data = JSON.parse(message);

        // Check if the message is a valid request
        if (!data.columns || !data.query || !data.table) {
          ws.send(JSON.stringify({ error: 'An object with table, columns, and a query are required.' }));
          return;
        }

        const columns = data.columns;
        let searchText = data.query;
        const messages = data.messages;
        const className = capitalize(data.table);

        let columnsArray = columns.split(',').map((field) => field.trim());

        // Perform your LLMQuery here and send results to the WebSocket
        LLMQuery(ws, className, columnsArray, searchText, messages)
          .then((results) => {
            ws.send(JSON.stringify({ results }));
          })
          .catch((error) => {
            ws.send(JSON.stringify({ error: error.message }));
          });
      } catch (error) {
        ws.send(JSON.stringify({ error: 'Invalid JSON format.' }));
      }
    });
  });
};

export default setupLLMRoute;
