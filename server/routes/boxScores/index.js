// -------------------------------------------------------------------
// BOX SCORES
// -------------------------------------------------------------------

const router = require('express').Router();
const {getDownloadURL, getStorage, ref, uploadBytes} = require("firebase/storage");
const key = 'boxScores';
const redis = require('../../singletons/redis');

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
  const storage = getStorage();
  const storageRef = ref(storage, `${key}.json`);

  const jsn = JSON.stringify(req.body, null, 2);
  const blob = new Blob([jsn], {type: 'application/json'});
  const file = new File([blob], `${key}.json`);

  uploadBytes(storageRef, file).then(() => {
    console.log('Uploaded Box Scores To Firebase!');
    res.json({"message": "Updated file successfully"});
  });
});

module.exports = router;
