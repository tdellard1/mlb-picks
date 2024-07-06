const router = require('express').Router();
const playersURL = './server/assets/teams.json';
const players = require("../../assets/players.json");

router.get('/', (req, res) => {
  res.json(players);
});

module.exports = router;
