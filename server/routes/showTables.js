import express from 'express';
import { db } from '../pg.js';

const router = express.Router();

export default router.get('/show_tables', (req, res) => {
  db.query('SELECT * FROM information_schema.tables WHERE table_schema = $1', ['public'], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.send(error);
    } else {
      console.log('Query results:', results.rows);
      res.json(results.rows);
    }
  });
});
