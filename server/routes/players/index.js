const router = require('express').Router();
const playersURL = './server/assets/teams.json';
const players = require("../../assets/players.json");
const {default: axios} = require("axios");

router.get('/', async (req, res) => {
  try {
    const response = await axios.get(`https://tank01-mlb-live-in-game-real-time-statistics.p.rapidapi.com/getMLBPlayerList`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Host': 'tank01-mlb-live-in-game-real-time-statistics.p.rapidapi.com',
          'X-RapidAPI-Key': 'e22845af99mshf6b3ec01f4d7666p1c7ce7jsne4ce7518ae06',
        }
      }
    );
    res.send(response.data.body);
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
