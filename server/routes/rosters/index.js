const router = require('express').Router();
const rostersURL = './server/assets/rosters.json';
const rosters = require('../../assets/rosters.json');
const {writeFile} = require("fs");

router.get('/', (req, res) => {
  res.json(rosters);
});

router.post('/', (req, res) => {
  console.log('Update Rosters Requested!');
  writeFile(rostersURL, JSON.stringify(req.body, null, 2), err => {
    if (err) {
      console.log("Failed to write updated data to file", err);
      return;
    }
    console.log('Update Rosters Successful!');
    res.json({"message": "Updated file successfully"});
  });
});

module.exports = router;
