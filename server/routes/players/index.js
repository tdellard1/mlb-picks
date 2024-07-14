const router = require('express').Router();
const playersURL = './server/assets/players.json';
const players = require("../../assets/players.json");
const {default: axios} = require("axios");
const cache = require("../../cache/memoryCache");
const {getStorage, ref, getDownloadURL} = require("firebase/storage");
const key = 'players';
const playersFileName = 'players.json';

router.get('/', async (req, res) => {
  if (cache.has(key)) {
    console.log('Cache has players!');
    res.json(cache.get(key))
  } else {
    console.log('Cache does NOT have players!');
    const storage = getStorage();
    const storageRef = ref(storage, playersFileName);
    const file = await getDownloadURL(storageRef);

    fetch(file).then(playersFile => playersFile.json()).then((data) => {
      cache.set(key, data);
      console.log('players Cache set: ', cache.has(key));
      res.json(data);
    });
  }
});

module.exports = router;
