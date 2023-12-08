import express from 'express';
import { db } from '../pg.js';
import { vectorize } from '../utilities/weaviateHelpers.js';

const router = express.Router();

export default router.get('/vectorize/:table', async (req, res) => {
  const table = req.params.table;
  const query = `SELECT * FROM ${table}`;

  try {
    const results = await new Promise((resolve, reject) => {
      db.query(query, (error, results) => {
        if (error) {
          console.error('Error executing query:', error);
          reject(error);
        } else {
          resolve(results.rows);
        }
      });
    });

    const statusMessage = `Vectorizing ${results.length} rows from ${table}`;
    console.log(statusMessage);
    const vectorizedData = await vectorize(table, results);

    console.log(vectorizedData);

    res.json({
      data: vectorizedData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});
