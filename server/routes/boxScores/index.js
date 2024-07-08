const router = require('express').Router();
const boxScoresURL = './server/assets/boxScores.json';
const boxScoresOnlyURL = './server/assets/boxScoresOnly.json';
const boxScores = require('../../assets/boxScores.json');
const boxScoresOnly = require('../../assets/boxScoresOnly.json');
const {writeFile} = require("fs");

router.get('/', (req, res) => {
  res.json(boxScores);
});

router.get('/only', (req, res) => {
  res.json(boxScoresOnly);
});

router.post('/', (req, res) => {
  console.log('Update BoxScore Requested!');
  writeFile(boxScoresURL, JSON.stringify(req.body, null, 2), err => {
    if (err) {
      console.log("Failed to write updated data to file", err);
      return;
    }
    res.json({"message": "Updated file successfully"});
  });
});

router.post('/only', (req, res) => {
  console.log('Update BoxScore Requested!');
  writeFile(boxScoresOnlyURL, JSON.stringify(req.body, null, 2), err => {
    if (err) {
      console.log("Failed to write updated data to file", err);
      return;
    }
    res.json({"message": "Updated file successfully"});
  });
});

module.exports = router;
