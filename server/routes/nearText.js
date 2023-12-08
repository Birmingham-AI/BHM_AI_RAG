import express from 'express';
import { nearText, capitalize } from '../utilities/weaviateHelpers.js';

const router = express.Router();

export default router.post('/near_text', async (req, res) => {
  if (!req.body.columns || !req.body.query || !req.body.table) {
    return res.status(400).json({ error: 'An object with table, columns, and a query are required.' });
  }

  const columns = req.body.columns;
  let searchText = req.body.query;
  const className = capitalize(req.body.table);

  let columnsArray = columns.split(',').map((field) => field.trim());

  const results = await nearText(className, columnsArray, searchText);
  res.json({ results });
});
