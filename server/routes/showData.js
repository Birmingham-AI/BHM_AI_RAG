import express from 'express';
import { db } from '../pg.js';

const router = express.Router();

export default router.get('/show_data/:table', (req, res) => {
  const table = req.params.table;
  const query = `SELECT * FROM ${table}`;

  db.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
    } else {
      console.log('Query results:', results.rows);
      res.json(results.rows);
    }
  });
});
