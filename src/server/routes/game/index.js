// -------------------------------------------------------------------
// GAME
// -------------------------------------------------------------------

const router = require('express').Router();
const cache = require('../../cache/memoryCache');

router.get('/:gameId', (req, res) => {
  console.log('Does this file have bocScores cache? ', cache.has('boxScores'));
  res.send({ hello: 'goodbye' })
});

module.exports = router;
