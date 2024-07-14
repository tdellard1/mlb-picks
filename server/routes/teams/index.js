const router = require('express').Router();
const teamsURL = '../../assets/teams.json';
const teams = require('../../assets/teams.json');
const {writeFile} = require("fs");
const cache = require("../../cache/memoryCache");
const key = 'teams';
const teamsFileName = 'teams.json';
const {getStorage, ref, getDownloadURL} = require("firebase/storage");
const axios = require('axios').default;

// Production
// router.get('/', async (req, res) => {
//   try {
//     const response = await axios.get(`https://tank01-mlb-live-in-game-real-time-statistics.p.rapidapi.com/getMLBTeams`,
//       {
//         params: {
//           teamStats: true,
//           topPerformers: true,
//         },
//         headers: {
//           'Content-Type': 'application/json',
//           'X-RapidAPI-Host': 'tank01-mlb-live-in-game-real-time-statistics.p.rapidapi.com',
//           'X-RapidAPI-Key': 'e22845af99mshf6b3ec01f4d7666p1c7ce7jsne4ce7518ae06',
//         }
//       }
//     );
//     res.send(response.data.body);
//   } catch (error) {
//     console.error(error);
//   }
// });

router.get('/', async (req, res) => {
  if (cache.has(key)) {
    console.log('Cache has teams!');
    res.json(cache.get(key))
  } else {
    console.log('Cache does NOT have teams!');
    const storage = getStorage();
    const storageRef = ref(storage, teamsFileName);
    const file = await getDownloadURL(storageRef);

    fetch(file).then(teamsFile => teamsFile.json()).then((data) => {
      cache.set(key, data);
      console.log('teams Cache set: ', cache.has(key));
      res.json(data);
    });
  }
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
