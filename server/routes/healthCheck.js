import express from 'express';

const router = express.Router();

export default router.get('/healthcheck', (req, res) => {
  res.json({ message: "I'm alive you fools!" });
});
