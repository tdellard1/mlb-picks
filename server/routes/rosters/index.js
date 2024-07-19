const router = require('express').Router();
const {getStorage, ref, uploadBytes, getDownloadURL} = require("firebase/storage");
const cache = require('../../cache/memoryCache');
const redis = require("../../singletons/redis");
const key = 'rosters';
const rosterFileName = 'rosters.json';

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

router.post('/', (req, res) => {
  cache.set(key, req.body);
  const storage = getStorage();
  const storageRef = ref(storage, rosterFileName);

  const jsn = JSON.stringify(req.body, null, 2);
  const blob = new Blob([jsn], {type: 'application/json'});
  const file = new File([blob], rosterFileName);

  uploadBytes(storageRef, file).then(() => {
    console.log('Uploaded Rosters To Firebase!');
    res.json({"message": "Updated file successfully"});
  });
});

module.exports = router;
