const router = require('express').Router();
const stateURL = './server/assets/state.json';
const state = require('../../assets/state.json');
const {writeFile} = require("fs");

router.get('/', (req, res) => {
  res.json(state);
});

router.post('/', (req, res) => {
  console.log('State Requested!');
  writeFile(stateURL, JSON.stringify(req.body, null, 2), err => {
    if (err) {
      console.log("Failed to write updated data to file", err);
      return;
    }
    res.json({"message": "Updated file successfully"});
  });
});

module.exports = router;
