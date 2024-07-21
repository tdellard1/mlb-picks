// -------------------------------------------------------------------
// GAME
// -------------------------------------------------------------------

import express from "express";
const router = express.Router();

router.get('/:gameId', (req, res) => {
  console.log('Does this file have bocScores cache? ');
  res.send({ hello: 'goodbye' })
});

export default router;
