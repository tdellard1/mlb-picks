const router = require('express').Router();
const slatesURL = '../../assets/slates.json';
const slates = require('../../assets/slates.json');
const {writeFile} = require("fs");

router.get('/', (req, res) => {
  res.json(slates);
});

router.post('/', (req, res) => {
  console.log('Update Teams Requested!');
  writeFile(slatesURL, JSON.stringify(req.body, null, 2), err => {
    if (err) {
      console.log("Failed to write updated data to file");
      return;
    }
    res.json({"message": "Updated file successfully"});
  });
});

module.exports = router;
