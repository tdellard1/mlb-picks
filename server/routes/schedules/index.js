const router = require('express').Router();
const schedulesURL = './server/assets/schedules.json';
const schedules = require('../../assets/schedules.json');
const {writeFile} = require("fs");

router.get('/', (req, res) => {
  res.json(schedules);
});

router.post('/', (req, res) => {
  console.log('Update Schedule Requested!');
  writeFile(schedulesURL, JSON.stringify(req.body, null, 2), err => {
    if (err) {
      console.log("Failed to write updated data to file", err);
      return;
    }
    res.json({"message": "Updated file successfully"});
  });
});

module.exports = router;
