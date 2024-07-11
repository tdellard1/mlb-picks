const router = require('express').Router();
const teamsURL = '../../assets/teams.json';
const teams = require('../../assets/teams.json');
const {writeFile} = require("fs");

const axios = require('axios').default;

// Production
router.get('/', async (req, res) => {
  try {
    const response = await axios.get(`https://tank01-mlb-live-in-game-real-time-statistics.p.rapidapi.com/getMLBTeams`,
      {
        params: {
          teamStats: true,
          topPerformers: true,
        },
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Host': 'tank01-mlb-live-in-game-real-time-statistics.p.rapidapi.com',
          'X-RapidAPI-Key': 'e22845af99mshf6b3ec01f4d7666p1c7ce7jsne4ce7518ae06',
        }
      }
    );
    console.log(response);
    res.send(response.data.body);
  } catch (error) {
    console.error(error);
  }
});

// Development
// router.get('/', (req, res) => {
//   res.json(teams);
// });

router.post('/', (req, res) => {
  console.log('Update Teams Requested!');
  writeFile(teamsURL, JSON.stringify(req.body, null, 2), err => {
    if (err) {
      console.log("Failed to write updated data to file");
      return;
    }
    res.json({"message": "Updated file successfully"});
  });
});

module.exports = router;
