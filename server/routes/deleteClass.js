import express from 'express';
import { deleteClass } from '../utilities/weaviateHelpers.js';

const router = express.Router();

export default router.get('/delete_class/:className', async (req, res) => {
  const className = capitalize(req.params.className);
  try {
    await deleteClass(className);
    res.json({
      message: `Class ${className} deleted`,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});
