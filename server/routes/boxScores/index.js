const router = require('express').Router();
const boxScoresURL = './server/assets/boxScores.json';
const boxScores = require('../../assets/boxScores.json');
const {writeFile} = require("fs");

router.get('/', (req, res) => {
  res.json(boxScores);
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

module.exports = router;
