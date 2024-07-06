const router = require('express').Router();
const teamsURL = '../../assets/teams.json';
const teams = require('../../assets/teams.json');
const {writeFile} = require("fs");

router.get('/', (req, res) => {
  res.json(teams);
});

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
