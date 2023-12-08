import express from 'express';
import { db } from '../pg.js';
import { showColumns } from '../utilities/showHelpers.js';

const router = express.Router();

export default router.get('/show_columns/:table', (req, res) => {
  const table = req.params.table;
  db.query('SELECT * FROM information_schema.columns WHERE table_name = $1', [table], (error, results) => {
    let columns;
    if (error) {
      console.error('Error executing query:', error);
      res.send(error);
    } else {
      columns = showColumns(results.rows);
      console.log('Query results:', columns);
    }
    res.json(columns);
  });
});
