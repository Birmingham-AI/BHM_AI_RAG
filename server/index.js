import bodyParser from 'body-parser';
import deleteClass from './routes/deleteClass.js';
import express from 'express';
import expressWs from 'express-ws';
import healthCheck from './routes/healthCheck.js';
import nearText from './routes/nearText.js';
import setupLLMRoute from './routes/llm.js';
import showTables from './routes/showTables.js';
import showColumns from './routes/showColumns.js';
import showData from './routes/showData.js';
import vectorize from './routes/vectorize.js';

// Config
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const { app: wsApp } = expressWs(app);

// Routes
app.use('/', healthCheck);
app.use('/', showTables);
app.use('/', showColumns);
app.use('/', showData);
app.use('/', vectorize);
app.use('/', nearText);
app.use('/', deleteClass);
setupLLMRoute(wsApp);

app.listen(3000, '0.0.0.0', () => {
  console.log('Server running on port 3000');
});
