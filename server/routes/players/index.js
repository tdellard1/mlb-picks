// -------------------------------------------------------------------
// PLAYERS
// -------------------------------------------------------------------

const router = require('express').Router();
const {getStorage, ref, getDownloadURL} = require("firebase/storage");
const redis = require("../../singletons/redis");
const key = 'players';

router.get('/', async (req, res) => {
  let results;

  try {
    const cacheResults = await redis.getList(key);
    if (cacheResults) {
      results = cacheResults.map(result => JSON.parse(result));
      res.send(results);
    } else {
      const storage = getStorage();
      const storageRef = ref(storage, `${key}.json`);
      const file = await getDownloadURL(storageRef);

      fetch(file).then(file => file.json()).then((data) => {
        redis.listAddAll(data.map(d => JSON.stringify(d)));
        res.json(data);
      });
    }
  } catch (error) {
    console.error(error);
    res.status(404);
  }
});

router.get('/count', async (req, res) => {
  const count = await redis.length(key);
  res.send({ count });
});

module.exports = router;
